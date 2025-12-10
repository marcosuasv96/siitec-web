import { getProductos } from '../lib/syscom';

export async function GET() {
  // Llamamos a tu función
  const datos = await getProductos('computo'); 

  // Devolvemos el resultado puro en formato JSON
  return new Response(JSON.stringify(datos, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}