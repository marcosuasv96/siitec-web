import { getProductoById } from '../../../lib/syscom'; 
// Nota: Ajusta los "../" dependiendo de qué tan profundo creaste el archivo.
// Si está en src/pages/api/test-producto/[id].js, son 3 niveles hacia atrás.

export async function GET({ params }) {
  // 1. Obtenemos el ID desde la URL
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Falta el ID" }), { status: 400 });
  }

  // 2. Llamamos a tu función de Syscom para un solo producto
  const producto = await getProductoById(id);

  // 3. Devolvemos el resultado puro en JSON
  return new Response(JSON.stringify(producto, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}