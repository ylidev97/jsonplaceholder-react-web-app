# MyEditorial — autores y publicaciones

Prueba técnica de Frontend React: una app pequeña con **React 19 y TypeScript** sobre la API pública
[JSONPlaceholder](https://jsonplaceholder.typicode.com).

- **Autores** (`GET /users`) con búsqueda por nombre.
- **Publicaciones** del autor elegido (`GET /posts?userId=X`).
- **Nueva publicación** (`POST /posts`) con formulario validado (título y texto obligatorios). La API no
  guarda los datos de verdad, así que la publicación nueva se añade a la caché y aparece la primera de la lista.
- **Estados de carga, error (con "Reintentar") y vacíos** en cada petición.

> **Tiempo empleado:** 2h

## Cómo ejecutarlo

Requiere Node `^20.19` o `>=22.12` (lo exige Vite 8).

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm test         # tests en modo watch (Vitest + Testing Library); npx vitest run para una sola pasada
npm run lint     # ESLint
npm run build    # tsc -b + build de producción
npm run preview  # sirve el build
```

## Requisitos de la prueba

| Requisito | Dónde |
| --- | --- |
| Lista de usuarios con búsqueda por nombre | [UserList.tsx](src/components/UserList.tsx) |
| Publicaciones del usuario elegido | [AuthorHeader.tsx](src/components/AuthorHeader.tsx), [PostList.tsx](src/components/PostList.tsx) |
| Alta de una publicación con formulario validado | [PostForm.tsx](src/components/PostForm.tsx), [useCreatePost.ts](src/hooks/useCreatePost.ts) |
| Estados de carga y error visibles | [StatusMessage.tsx](src/components/StatusMessage.tsx) |
| Al menos 3 tests | **62 tests en 10 archivos** (`npm test`, ver [Tests](#tests)) |
| README | este archivo |

Los requisitos detallados (R1–R8) y sus criterios de aceptación están en [docs/SPEC.md](docs/SPEC.md); los
tests se nombran por criterio (`AC1: ...`, `R3: ...`).

Extras que no pedía la prueba: modo claro/oscuro y navegación en dos pantallas en móvil.

## Stack

- **Vite** + **React 19** + **TypeScript**, con el React Compiler activado (no hay `useMemo`/`useCallback` manuales).
- **axios** y **TanStack Query** para los datos remotos.
- **Tailwind CSS v4** con tokens de diseño en [src/index.css](src/index.css).
- **Vitest** + **Testing Library** + jsdom.

## Estructura

```
src/
├── api/          Llamadas HTTP con axios (client, users, posts)
├── hooks/        useUsers, usePosts, useCreatePost, useTheme
├── components/   Header, UserList, AuthorHeader, PostList, PostForm,
│                 StatusMessage, Toast, Icons y styles.ts (clases compartidas)
├── types/        User, Post, NewPost
├── utils/        capitalize, initials
└── App.tsx       Composición y estado de la selección
docs/SPEC.md      Requisitos y criterios de aceptación
```

Los tests están junto a cada componente (`Componente.test.tsx`).

## Decisiones

- **axios con un único cliente** ([src/api/client.ts](src/api/client.ts)) y una función por recurso en
  `src/api`. Así los componentes no conocen URLs y los tests mockean `src/api`, no axios.
- **TanStack Query** (`useQuery`/`useMutation`) para los datos remotos. Da gratis los estados `isPending` e
  `isError`, el reintento con `refetch()` y la caché por `['posts', userId]`. Las peticiones con la misma clave
  se comparten: `AuthorHeader` y `PostList` piden las publicaciones del autor y solo sale una petición.
- **Sin Context ni Redux.** El único estado compartido es el autor elegido y vive en `useState` dentro de
  `App`. El tema, el formulario abierto y el aviso son estado local. Tampoco hay router: para este alcance
  habría sido complejidad sin beneficio.
- **El filtro de autores es derivado, no estado.** La lista filtrada se calcula al renderizar a partir del
  texto de búsqueda. JSONPlaceholder no filtra por nombre y son 10 usuarios, así que se filtra en el cliente.
- **La publicación nueva se escribe en la caché** (`setQueryData`), no con `invalidateQueries`: como la API no
  persiste, volver a pedir la lista haría desaparecer lo recién creado. Además la API responde siempre con
  `id: 101`; le asigno un id libre en el cliente para que dos altas seguidas no repitan la `key` de React, y
  la marco con `isNew` para mostrar la etiqueta "Recién publicada". Hay un test que lo comprueba.
- **Validación en el cliente, sin librería de formularios.** Título y texto no pueden estar vacíos ni ser solo
  espacios; el título admite 100 caracteres como máximo. Los errores aparecen en cuanto se escribe en el campo
  o se sale de él y se actualizan mientras se escribe. Al enviar con errores, el foco va al primer campo
  inválido y no se llama a la API. Mientras se envía, el botón y los campos se deshabilitan y el diálogo no se
  puede cerrar. Si falla, el diálogo sigue abierto con el borrador y un botón "Reintentar".
- **Un solo componente para carga y error** (`StatusMessage`), con la misma forma en autores, publicaciones y
  envío: esqueletos de carga y errores con descripción y botón "Reintentar". El `QueryClient` reintenta una
  vez antes de mostrar el error.
- **"Mostrar más / menos":** se ven 4 publicaciones por defecto. El componente recuerda *para qué autor* está
  expandida la lista; al elegir otro autor la condición deja de cumplirse y vuelve a 4, sin efectos.
- **Mayúscula inicial al mostrar, no al guardar.** Los títulos y textos se muestran con la primera letra en
  mayúscula ([capitalize.ts](src/utils/capitalize.ts)); en la caché se guarda lo que escribió el usuario. Sirve
  igual para las publicaciones de la API, que vienen en minúscula.
- **Diseño "Classical"** con Tailwind CSS v4: tokens de color en variables CSS y tema oscuro con la clase `dark`
  en `<html>`; Cormorant Garamond y Lora desde Google Fonts. El tema se guarda en `localStorage` solo cuando el
  usuario lo cambia y, sin valor guardado, sigue la preferencia del sistema. Si `localStorage` falla, la app
  sigue funcionando.
- **Navegación móvil en dos pantallas solo con CSS:** la lista de autores es la portada y, al elegir uno, se
  abre su detalle con un botón "Autores" para volver. En escritorio van en dos columnas.
- **Accesibilidad:** cada campo tiene su `<label>`, los errores usan `role="alert"` y `aria-describedby`, la
  carga `role="status"`, la selección `aria-pressed` y "Mostrar más" `aria-expanded`. El foco es siempre
  visible y el diálogo se cierra con Escape. El dorado del acento solo da 3:1 de contraste, así que el texto en
  color de acento usa un tono más oscuro.
- **Sin librería de iconos:** son SVG en línea.

## Tests

```bash
npx vitest run
```

62 tests en 10 archivos, con Vitest + Testing Library + jsdom. Se mockea `src/api` (no axios), cada test usa un
`QueryClient` nuevo con `retry: false` y las consultas son accesibles (`getByRole`, `getByLabelText`). Los
criterios de aceptación de [docs/SPEC.md](docs/SPEC.md) están nombrados como tales:

- `AC1`: escribir "leanne" muestra solo a Leanne Graham.
- `AC2`: enviar el formulario vacío muestra 2 errores y no llama a la API.
- `AC3`: si `GET /users` falla, se muestra el mensaje de error.

Además se cubren: reintentos, estados de carga y vacíos, ids únicos, "Mostrar más / menos" (incluido el reinicio
al cambiar de autor), el tema claro/oscuro y su persistencia, el modal (Escape, cancelar, botón deshabilitado al
enviar) y el flujo completo en `App.test.tsx`.

Para comprobar que los tests detectan fallos de verdad (y no solo que pasan), rompí el código a propósito en 43
sitios (quitar el `trim()`, invertir el orden de la lista, ignorar el tema guardado, permitir un segundo
envío…) y confirmé que al menos un test fallaba en cada caso. Así aparecieron y se cubrieron varios huecos: el
buscador no se probaba con mayúsculas, el formulario no se probaba con un solo campo vacío y el comportamiento
mientras se envía (segundo envío, Escape, clic en el fondo) no se comprobaba de verdad.

## Qué haría con más tiempo

**Datos y producto**
- **Persistir las publicaciones creadas** en el cliente (por ejemplo en `localStorage`) para que sobrevivan a una
  recarga, ya que la API no las guarda. Si el almacenamiento no está disponible (algunos modos privados), usar un
  respaldo en memoria y avisar al usuario.
- **Editar y borrar publicaciones propias** y, si los datos locales importaran, sincronizarlos entre dispositivos
  (cola de sincronización, PWA con modo sin conexión o un backend real).
- **Actualización optimista** al publicar, con reversión si falla.
- **Rutas** para enlazar cada autor y cada publicación.

**Listas y rendimiento**
- **Paginación o scroll infinito** y, si los datos crecieran, **virtualización** con TanStack Virtual.
- **Recordar la posición de scroll** al volver a la lista de autores.
- **Precargar las publicaciones** de un autor al pasar el cursor o enfocarlo (`prefetchQuery`), para que se
  abran al instante.

**Resiliencia**
- **Timeouts** en axios y **backoff exponencial** en los reintentos (hoy hay un reintento fijo).
- **Mensajes de error distintos** según el caso (sin conexión, tiempo de espera, 5xx) y un **aviso global de
  falta de conexión**.
- **Monitoreo de errores** (por ejemplo Sentry).

**Accesibilidad e interfaz**
- **Modal:** atrapar el foco dentro y devolverlo al botón que lo abrió (ahora se cierra con Escape, con
  "Cancelar" o con la X, pero no hay *focus trap*).
- **Evitar el parpadeo del tema:** aplicar la clase `dark` con un pequeño script en `index.html` antes de que
  cargue React.
- **Auto-hospedar las fuentes** para no depender de Google Fonts.
- **Internacionalización** con `react-i18next` si hicieran falta más idiomas o reglas de plurales y formatos (hoy
  los textos están en español dentro de los componentes).

**Calidad y experiencia de desarrollo**
- **Tests end-to-end** (Playwright) del flujo completo y en móvil, pruebas visuales del tema oscuro y una
  auditoría automática de accesibilidad (axe).
- **CI** en GitHub Actions (lint, `tsc -b` y tests), *pre-commit hooks* (husky + lint-staged) y un despliegue de
  la demo.
- **MSW** para simular la API en desarrollo y en los tests, **Storybook** para los componentes y reglas de lint
  más estrictas.

## Cómo usé la IA

Usé **Claude Code** a lo largo de todo el proyecto. El repositorio incluye los archivos que guiaron a la IA:
[CLAUDE.md](CLAUDE.md), [.claude/skills/](.claude/skills/) y [docs/SPEC.md](docs/SPEC.md).

**Cómo la dirigí**

- Escribí primero la especificación (`docs/SPEC.md`: requisitos con criterios de aceptación) y un `CLAUDE.md`
  con las reglas: un requisito cada vez, mostrar un plan corto y esperar mi visto bueno antes de programar,
  mocks de `src/api` y tests con nombre por criterio.
- Definí dos skills en `.claude/skills/`: `implement-requirement` (leer el requisito, plan, implementar solo
  eso, escribir el test del criterio de aceptación y pasar `npm test`, `npm run lint` y `npx tsc -b`) y
  `review-against-spec` (comparar el código con el spec sin tocar nada). También instalé el skill público
  `vercel-react-best-practices` como referencia.
- Para cada requisito (R1 a R6) usé `implement-requirement`: aprobaba el plan antes de que se escribiera código
  y respondía las dudas que planteaba (textos de los mensajes, dónde va el formulario, qué entra en cada
  requisito).

**Qué le pedí**

- Configurar Tailwind, Vitest y TanStack Query; implementar cada requisito con sus tests; proponer los
  mensajes de los commits.
- El rediseño visual: le pasé un diseño hecho en Claude Design ("MyEditorial") y le pedí adaptarlo a este código,
  traduciendo los textos al español, sin añadir librerías y manteniendo los textos que fija el spec.

**Qué acepté**

- La arquitectura por capas (api → hooks → componentes), el uso de TanStack Query con la caché actualizada a
  mano, la regla de mockear `src/api` en los tests, el modal accesible para el formulario y la partición de los
  commits por capas.

**Qué corregí o decidí distinto**

- La configuración de Vitest daba un error de TypeScript porque `defineConfig` venía de `vite`; se importó de
  `vitest/config`.
- `setupTests.js` pasó a `setupTests.ts` con `@testing-library/jest-dom/vitest`, porque `tsc -b` no reconocía
  `toBeInTheDocument`.
- Al revisar el formulario se detectó el problema de los **ids duplicados** (`id: 101` en cada `POST`) y se
  arregló con un test que lo reproduce.
- Un test fallaba porque TanStack Query llama a `mutationFn` con un segundo argumento; se corrigió la
  aserción en lugar de tocar el código. Otro emitía un error de consola engañoso por una API sin mockear
  (parecía un problema de claves duplicadas, pero no lo era); se arregló el mock.
- Al revisar los tests rompiendo el código a propósito, uno de ellos resultó ser demasiado débil: comprobaba
  "se llamó una sola vez" antes de que la petición llegara a la API, así que pasaba aunque el código estuviera
  roto. Se corrigió esperando a que se asiente.
- Decisiones mías sobre el producto: lista de autores a la izquierda y publicaciones a la derecha, título y
  texto con la primera letra en mayúscula, `capitalize` extraído a `utils`, nombres de los tests en inglés, el
  texto completo de cada publicación y las ampliaciones del diseño documentadas como R8 en el spec.

**Límites de este uso**

- La IA escribió gran parte del código y de los tests; yo definí los requisitos, revisé los cambios y tomé las
  decisiones de alcance. Los commits donde ayudó llevan el trailer `Co-Authored-By`.
- La IA no puede ver la aplicación en un navegador: el aspecto visual y el comportamiento en móvil hay que
  revisarlos a mano. Los tests comprueban comportamiento y accesibilidad, no píxeles.