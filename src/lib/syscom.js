const BASE_URL = 'https://developers.syscom.mx/api/v1';
const TOKEN_URL = 'https://developers.syscom.mx/oauth/token';

const CLIENT_ID = import.meta.env.SYSCOM_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.SYSCOM_CLIENT_SECRET;

// Variables de Caché
let cachedToken = null;
let tokenExpiration = 0;

// 1. OBTENER TOKEN (Con Caché para velocidad)
export async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  if (cachedToken && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    if (!response.ok) return null;
    const data = await response.json();
    
    cachedToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000;
    return cachedToken;
  } catch (error) {
    console.error('Error Token:', error);
    return null;
  }
}

// 2. OBTENER TIPO DE CAMBIO
export async function getTipoCambio() {
  const token = await getAccessToken();
  if (!token) return 20;

  try {
    const response = await fetch(`${BASE_URL}/tipocambio`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return parseFloat(data.normal) || 20;
  } catch (error) {
    return 20;
  }
}

// 3. OBTENER PRODUCTOS (Inteligente y con Filtros)
export async function getProductos(search = '', page = 1, marca = '', categoria = '') { 
  const token = await getAccessToken();
  const emptyResult = { items: [], total: 0, paginas: 0, pagina_actual: 1 };

  if (!token) return emptyResult;

  const params = new URLSearchParams();
  params.append('pagina', page.toString());

  // LÓGICA DE BÚSQUEDA HÍBRIDA
  // 1. Si no hay nada, buscamos 'seguridad' (destacados)
  // 2. Si hay filtros, los sumamos al texto de búsqueda para evitar errores de ID
  
  let terminoFinal = search;

  if (!search && !marca && !categoria) {
      terminoFinal = 'seguridad'; // Default "Más vendidos"
      params.append('orden', 'relevancia');
  } else {
      // Truco: Concatenamos los filtros al texto para que el buscador los encuentre
      // Esto soluciona el error de "0 resultados" por no tener el ID de la marca
      if (marca) terminoFinal += ` ${marca}`;
      if (categoria) terminoFinal += ` ${categoria}`;
  }

  params.append('busqueda', terminoFinal.trim());

  try {
    const response = await fetch(`${BASE_URL}/productos?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return emptyResult;
    
    const data = await response.json();
    return {
      items: data.productos || data.items || [],
      total: data.total_registros || 0,
      paginas: data.paginas || 1,
      pagina_actual: parseInt(page)
    };
  } catch (error) {
    console.error("Error buscando productos:", error);
    return emptyResult;
  }
}

// 4. DETALLE DE PRODUCTO
export async function getProductoById(id) {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}/productos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}