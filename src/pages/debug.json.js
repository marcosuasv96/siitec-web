// src/pages/debug.json.js

export async function GET() {
  const clientId = import.meta.env.SYSCOM_CLIENT_ID;
  const clientSecret = import.meta.env.SYSCOM_CLIENT_SECRET;
  
  const debugInfo = {
    credenciales_leidas: {
      hay_id: !!clientId, // Dice true si leyó el ID
      hay_secreto: !!clientSecret // Dice true si leyó el Secreto
    },
    paso_1_token: null,
    paso_2_productos: null,
    error: null
  };

  try {
    // 1. INTENTO DE OBTENER TOKEN
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');

    const tokenResponse = await fetch('https://developers.syscom.mx/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const tokenData = await tokenResponse.json();
    debugInfo.paso_1_token = {
      status: tokenResponse.status,
      mensaje: tokenData // Aquí veremos si Syscom dice "invalid_client"
    };

    if (!tokenResponse.ok) {
      throw new Error(`Fallo al obtener token: ${JSON.stringify(tokenData)}`);
    }

    // 2. INTENTO DE OBTENER 1 PRODUCTO (Solo si tenemos token)
    const productosResponse = await fetch('https://developers.syscom.mx/api/v1/productos?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const productosData = await productosResponse.json();
    debugInfo.paso_2_productos = {
      status: productosResponse.status,
      total_encontrado: productosData.productos ? productosData.productos.length : 0
    };

  } catch (e) {
    debugInfo.error = e.message;
  }

  // Devolvemos el resultado en formato JSON para leerlo fácil
  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}