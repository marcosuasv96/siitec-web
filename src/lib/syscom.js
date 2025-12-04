const BASE_URL = 'https://developers.syscom.mx/api/v1';
const TOKEN_URL = 'https://developers.syscom.mx/oauth/token';

// 1. OBTENER TOKEN
export async function getAccessToken() {
  const clientId = import.meta.env.SYSCOM_CLIENT_ID;
  const clientSecret = import.meta.env.SYSCOM_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error Token:', error);
    return null;
  }
}

// 2. OBTENER TIPO DE CAMBIO (Nuevo)
export async function getTipoCambio() {
  const token = await getAccessToken();
  if (!token) return 20; // Valor por defecto si falla la API (seguridad)

  try {
    const response = await fetch(`${BASE_URL}/tipocambio`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    // Syscom devuelve { normal: "20.50", ... }
    return parseFloat(data.normal) || 20;
  } catch (error) {
    return 20; // Fallback
  }
}

// 3. OBTENER LISTA DE PRODUCTOS (Con Paginación)
export async function getProductos(keyword = 'computo', page = 1) { 
  const token = await getAccessToken();
  const emptyResult = { items: [], total: 0, paginas: 0, pagina_actual: 1 };

  if (!token) return emptyResult;

  const params = new URLSearchParams();
  params.append('busqueda', keyword); 
  params.append('orden', 'relevancia');
  params.append('pagina', page.toString());
  params.append('limit', '12'); 

  try {
    const response = await fetch(`${BASE_URL}/productos?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return emptyResult;
    const data = await response.json();
    return {
      items: data.productos || [],
      total: data.total_registros || 0,
      paginas: data.paginas || 0,
      pagina_actual: parseInt(page)
    };
  } catch (error) {
    return emptyResult;
  }
}

// 4. OBTENER UN SOLO PRODUCTO POR ID (Nuevo para detalles)
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
    console.error("Error fetching product detail", error);
    return null;
  }
}