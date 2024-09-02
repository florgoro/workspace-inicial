// Array para almacenar los productos
const listaProductos = [];

// Función asincrónica para obtener los productos desde la API 
async function obtenerProductos() {
  // Recuperar el id de categoría del local storage
  const categoryId = localStorage.getItem('selectedCategoryId');
  
  if (!categoryId) {
    console.error('No se ha encontrado un identificador de categoría en el almacenamiento local.');
    return;
  }
  // URL de la API con el id recuperado
  const apiUrl = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

  // Llama a getJSONData 
  const result = await getJSONData(apiUrl);

  // Si la solicitud fue exitosa, verifica el resultado y almacena en listaProductos
  if (result.status === 'ok') {
    listaProductos.push(...result.data.products);
    mostrarProductos();
  } else {
    console.error('Hubo un problema con la solicitud:', result.data);
  }
}

// Función para mostrar los productos en el frontend como tarjetas
function mostrarProductos() {
  const contenedorProductos = document.querySelector('#listaProductos');
  contenedorProductos.innerHTML = ''; // Limpiar el contenedor
  
  // Recorrer cada producto y crear su tarjeta
  listaProductos.forEach(producto => {
    const tarjetaProducto = `
      <div class="col-md-4">
        <div class="cards" class="card mb-4 shadow-sm custom-card cursor-active">
          <img class="bd-placeholder-img card-img-top" src="${producto.image}" alt="${producto.name}">
          <h3 class="m-3">${producto.name}</h3>
          <div class="card-body">
            <p class="card-text">${producto.description}</p>
            <p class="card-text"><strong>Precio:</strong> ${producto.cost} ${producto.currency}</p>
            <p class="card-text"><strong>Vendidos:</strong> ${producto.soldCount}</p>
          </div>
        </div>
      </div>
    `;
    contenedorProductos.innerHTML += tarjetaProducto;
  });
}

// Llamar a la función para cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);
