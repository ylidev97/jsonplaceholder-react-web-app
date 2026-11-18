# Spec — App JSONPlaceholder

## Objetivo
Ver autores, sus publicaciones y crear una nueva publicación.
API: https://jsonplaceholder.typicode.com (el POST no guarda los datos de verdad).

## Requisitos
### R1 — Lista de autores
- Al cargar, se muestran los autores (usuarios de GET /users).
- Un buscador filtra los autores por nombre (sin distinguir mayúsculas).
- Sin coincidencias: se muestra "Ningún autor coincide con “texto buscado”", con una sugerencia y un botón "Borrar búsqueda".

### R2 — Publicaciones del autor
- Al elegir un usuario, se muestran sus publicaciones (GET /posts?userId=X).
- El autor elegido queda resaltado.

### R3 — Crear publicación
- Formulario con título y texto, ambos obligatorios (no vale solo espacios).
- Si falta un campo, se muestra el error debajo y no se envía.
- Al enviar (POST /posts), la publicación nueva aparece primera en la lista y el formulario se limpia.
- El botón de enviar se deshabilita mientras se envía.

### R4 — Estados de carga y error
- Cada petición muestra un mensaje de carga mientras espera.
- Si falla, se muestra un mensaje de error con un botón "Reintentar".

### R5 — Cabecera y tema
- Una cabecera con el título "MyEditorial".
- A la derecha, un botón para cambiar entre tema claro y oscuro.
- El tema elegido se guarda en localStorage y se recupera al recargar.
- Sin tema guardado, se usa la preferencia del sistema.

### R6 — Mostrar más publicaciones
- La lista de publicaciones muestra 4 por defecto.
- Si hay más de 4, aparece el botón "Mostrar más", que muestra todas las demás.
- Con todas visibles, el botón pasa a ser "Mostrar menos" y vuelve a mostrar solo 4.
- Al elegir otro autor, la lista vuelve a mostrar 4.

### R7 — Estados vacíos
- Sin autores en GET /users: "No hay autores disponibles".
- Sin autor elegido: "Elige un autor" con la indicación de seleccionar a alguien de la lista.
- Autor sin publicaciones: "Aún no hay publicaciones", "{nombre} no ha publicado nada." y un botón "Escribir la primera publicación".

## Criterios de aceptación → tests
- [ ] AC1: escribir "leanne" muestra solo a Leanne Graham (R1)
- [ ] AC2: enviar el formulario vacío muestra 2 errores y no llama a la API (R3)
- [ ] AC3: si GET /users falla, se muestra el mensaje de error (R4)

## Fuera de alcance
Edición/borrado, paginado, rutas, persistencia real.