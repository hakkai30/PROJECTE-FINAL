# Proyecto Final: Plataforma de Moda y Red Social

Este repositorio contiene la documentación inicial del proyecto desarrollado por **Robin** y **Fabio**.

---

## 1. Idea de proyecto
**Descripción breve:**
Nuestra plataforma es una aplicación web híbrida que fusiona un **e-commerce de moda** con una **red social interactiva**.

**Problema que resuelve:** Elimina la fragmentación entre buscar inspiración y comprar productos, permitiendo a los usuarios ver "outfits" reales y adquirir las prendas en el mismo lugar sin salir de la web.
* **Público objetivo:** Entusiastas de la moda, compradores digitales y creadores de contenido de estilo de vida.
* **Propósito principal:** Unificar la experiencia de compra, la interacción social, la información de tendencias (noticias) y la asistencia personalizada mediante un chatbot en una sola interfaz.

---

## 2. Requisitos funcionales
A continuación se detallan las funcionalidades principales que tendrá la aplicación, indicando qué puede hacer el usuario y el sistema:

* **Módulo de E-commerce:** El usuario podrá explorar un catálogo de prendas, gestionar su carrito y realizar el proceso de compra de forma integrada.
* **Feed de Red Social:** El usuario podrá publicar fotos de sus vestimentas ("outfits") y compartir su estilo personal con la comunidad.
* **Interacción Social:** El sistema permitirá a los usuarios interactuar con las publicaciones de otros perfiles mediante "me gusta" y comentarios.
* **Muro de Noticias de Moda:** El sistema consumirá una API externa para mostrar noticias y tendencias actuales del sector.
* **Chatbot de Asistencia:** El usuario podrá interactuar con un asistente inteligente para recibir ayuda durante la compra o recomendaciones de estilo.

---

## 3. Mockup gráfico

<p align="center">
  <img src="https://github.com/user-attachments/assets/0643ede9-42c6-4559-a4ef-bb302a137a04" width="30%" />
  <img src="https://github.com/user-attachments/assets/66818ebd-f54a-4581-8149-a0c3374644e9" width="30%" />
  <img src="https://github.com/user-attachments/assets/18560098-da2d-49d1-93e0-9287f2c011d6" width="30%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7f6c47d-fe7f-405e-a7a7-bfd84bb4d2a2" width="30%" />
  <img src="https://github.com/user-attachments/assets/21ace1df-94cc-4263-8016-88e0fb6a6b3c" width="30%" />
  <img src="https://github.com/user-attachments/assets/10988262-817d-4b00-a32f-3b16cf2884b3" width="30%"/>
</p>

<p align="center">
   <img src="https://github.com/user-attachments/assets/ef16fc40-b352-4a1a-939a-63cc85570930" width="30%"/>
   <img src="https://github.com/user-attachments/assets/f7ecd7df-c47f-429b-af35-a511a8694904" width="30%"/>
   <img src="https://github.com/user-attachments/assets/a48c34b3-532a-4fdc-8ba7-18f19ed780a0" width="30%"/>
</p>

<p align="center">
   <img src="https://github.com/user-attachments/assets/b2f5b331-27aa-4632-a511-b1c7558b8bdb" width="30%"/>
   <img src="https://github.com/user-attachments/assets/8cab6011-936a-49b4-b06e-3b1260091c41" width="30%"/>
   <img src="https://github.com/user-attachments/assets/a8bb334f-5f58-4744-b1ae-80ecd4064c50" width="30%"/>
</p>

<p align="center">
   <img src="https://github.com/user-attachments/assets/a9565dd4-a2d1-4609-bbd2-3b3134bba180" width="30%"/>
   <img src="https://github.com/user-attachments/assets/a52535df-242f-4232-aca7-16d002264a95" width="30%"/>
   <img src="https://github.com/user-attachments/assets/5e8628de-c358-4e58-8061-4e263b3724de" width="30%"/>
   <img src="https://github.com/user-attachments/assets/aebe91cc-e0f1-400d-9b60-c341de790462" width="30%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/16e43a52-f230-4e84-80ae-6a00746522d5" width="30%"/>
  <img src="https://github.com/user-attachments/assets/30778cce-716b-4b82-8892-328142718682" width="30%"/>
  <img src="https://github.com/user-attachments/assets/ad619d46-dc5c-4884-a2b0-b50a71dd461a" width="30%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/de7d4256-2dbc-43de-a68e-1ca2d672189a" width="30%"/>
  <img src="https://github.com/user-attachments/assets/4575d5a7-1b5d-40f5-9262-ea5c63456e8c" width="30%"/>
  <img src="https://github.com/user-attachments/assets/1efa28d0-9ed4-41b4-9e17-84b139468735" width="30%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/596f94ec-220d-4b9e-b4e0-1605118ffcc7" width="30%"/>
  <img src="https://github.com/user-attachments/assets/5ca23273-9f17-49e7-83cd-41857751ae82" width="30%"/>
  <img src="https://github.com/user-attachments/assets/4a4ae4a0-1850-4080-b665-b765c2bef87a" width="30%"/>
</p>

---

## 4. Arquitectura y tecnología
La aplicación se estructurará siguiendo un modelo de arquitectura cliente-servidor:

* **Frontend (Interfaz):** Desarrollado con **React.js** para garantizar una experiencia de usuario fluida y reactiva.
* **Backend (Lógica):** Utilizaremos **Node.js** con el framework **Express** para gestionar las rutas de la API y la lógica de negocio.
* **Base de Datos:** **MongoDB** usando **Mongoose** (estructura ya preparada en el backend).
* **Servicios Externos (APIs):** * **Moda News API:** Para el contenido de actualidad.
    * **OpenAI API:** Para la inteligencia del chatbot de ayuda.

---

---

## 1r Seguimiento del Proyecto

### Estructura del Proyecto
- El proyecto está organizado en carpetas como `src/` para el código fuente, `components/` para componentes reutilizables, `pages/` para las vistas principales, y `data/` para datos simulados (mock data).
- El archivo `index.html` sirve como punto de entrada para la aplicación, donde el elemento `<div id="root"></div>` es el contenedor donde React renderiza la interfaz.

### Configuración del Proyecto
- Se utilizó **Vite** como herramienta de construcción para configurar el entorno de desarrollo rápido y eficiente. Esto se define en el archivo `vite.config.js`.
- En el archivo `package.json`, se configuraron scripts como `dev` para iniciar el servidor de desarrollo y `build` para generar una versión optimizada.

### Componentización
- Se crearon componentes reutilizables como `GlobalHeader` y `GlobalFooter` para mantener consistencia en el diseño.
- También se implementaron componentes específicos como `WindowOverlay` para efectos visuales.

### Páginas Principales
- **LandingPage:** Página de inicio con un diseño brutalista.
- **CategoryPage:** Muestra categorías de productos.
- **ProductsPage:** Lista productos con opciones de filtro y ordenamiento.
- **CartPage:** Permite gestionar el carrito de compras.
- **SocialFeedPage:** Una red social donde los usuarios pueden interactuar con publicaciones.

### Estilos
- Se definieron estilos personalizados en `style.css`, utilizando variables CSS para colores y sombras, y aplicando un diseño responsive con media queries.

### Datos Simulados
- Se crearon datos simulados en `mockData.js` para productos y publicaciones sociales, lo que permite probar la funcionalidad sin depender de una base de datos.

### Funcionalidades
- Se implementó navegación entre páginas usando un estado (`currentPage`) en el componente principal `App`.
- Se añadieron funcionalidades como agregar y eliminar productos del carrito, y un sistema de "me gusta" en el feed social.

## Autenticacion Frontend Lista Para Backend

Actualmente el proyecto ya tiene registro/login para proteger la parte social.

Modos disponibles:
- Modo local (actual): guarda usuarios y sesion en localStorage.
- Modo remoto (preparado): usa peticiones HTTP a backend con fetch.

Configuracion:
- Crear archivo `.env` basado en `.env.example`.
- Variables:
  - `VITE_USE_REMOTE_AUTH=true` para activar backend.
  - `VITE_AUTH_API_URL=http://localhost:3000` (o URL real de tu API).

Contrato de endpoints esperado:
- `POST /api/auth/register`
  - Body: `{ "name": "Robin", "email": "robin@mail.com", "password": "123456" }`
  - Respuesta OK: `{ "user": { "name": "Robin", "email": "robin@mail.com" } }`
- `POST /api/auth/login`
  - Body: `{ "email": "robin@mail.com", "password": "123456" }`
  - Respuesta OK: `{ "user": { "name": "Robin", "email": "robin@mail.com" } }`
- `POST /api/auth/logout`
  - Sin body obligatorio.

Si `VITE_USE_REMOTE_AUTH=false` o no hay `VITE_AUTH_API_URL`, el sistema usa modo local automaticamente.

### Levantar Front + Backend Auth en local

1. Instalar dependencias
  - `npm install`
2. Ejecutar frontend y backend a la vez
  - `npm run dev:full`
3. O ejecutar por separado
  - Terminal 1: `npm run dev`
  - Terminal 2: `npm run dev:server`

El backend se levanta en `http://localhost:3000` por defecto.
La configuracion local del frontend esta en `.env.local` para usar autenticacion remota.

## Backend Actual (Modo Temporal Sin Mongo)

Estado actual:
1. El backend ya esta estructurado en MVC dentro de `server/`:
  - `server/models`
  - `server/controllers`
  - `server/routes`
  - `server/middleware`
2. Aunque los modelos de Mongoose estan creados, ahora mismo el feed usa datos temporales en memoria para avanzar sin base de datos.

Endpoints activos de posts (temporales):
1. `GET /api/posts`: devuelve el feed desde un array en memoria.
2. `POST /api/posts`: crea una publicacion y la inserta en ese array en memoria.

Importante:
1. Si `MONGO_URI` no esta configurada, el servidor NO crashea.
2. El servidor arranca igualmente y muestra un warning indicando que esta en modo temporal en memoria.

## Preparado Para MongoDB (Siguiente Paso)

Cuando quieras activar persistencia real:
1. Define en tu `.env`:
  - `MONGO_URI`
  - `MONGO_DB_NAME` (opcional)
  - `JWT_SECRET`
2. Mantienes el mismo comando de backend: `npm run dev:server`.
3. Cambias los controladores temporales de posts a consultas con Mongoose (la estructura ya esta preparada).

## Guia Rapida de Estilos (CSS Modular)

Ahora los estilos globales se cargan desde [style.css](style.css) como indice de modulos en [styles/modules](styles/modules).

Orden y responsabilidad principal:

1. [styles/modules/00-foundations.css](styles/modules/00-foundations.css): reset, variables base y tokens.
2. [styles/modules/01-layout-atmosphere.css](styles/modules/01-layout-atmosphere.css): estructuras comunes y atmósfera general.
3. [styles/modules/02-brand-art-direction.css](styles/modules/02-brand-art-direction.css): dirección visual de marca.
4. [styles/modules/03-landing.css](styles/modules/03-landing.css): landing + ventanas emergentes.
5. [styles/modules/04-structure.css](styles/modules/04-structure.css): estructura global heredada.
6. [styles/modules/05-shop-social.css](styles/modules/05-shop-social.css): shop, product cards y social feed.
7. [styles/modules/06-ui-refinements.css](styles/modules/06-ui-refinements.css): refinados de UI (detalles de interacción).
8. [styles/modules/07-dark-theme.css](styles/modules/07-dark-theme.css): overrides de modo oscuro.
9. [styles/modules/08-responsive-accessibility.css](styles/modules/08-responsive-accessibility.css): responsive y accesibilidad.
10. [styles/modules/09-messages.css](styles/modules/09-messages.css): experiencia de mensajes/chat.
11. [styles/modules/10-auth.css](styles/modules/10-auth.css): login/registro.
12. [styles/modules/11-search.css](styles/modules/11-search.css): buscador global.
13. [styles/modules/12-chatbot.css](styles/modules/12-chatbot.css): widget de chatbot.
14. [styles/modules/13-brand-polish.css](styles/modules/13-brand-polish.css): pase de pulido visual de marca.
15. [styles/modules/14-global-polish.css](styles/modules/14-global-polish.css): pulido global transversal.
16. [styles/modules/15-global-consistency.css](styles/modules/15-global-consistency.css): sistema final de consistencia (botones, inputs, chips).

Nota:
1. Mantener el orden de imports en [style.css](style.css), porque define la cascada final.
2. Convencion de prefijos de clases: [styles/STYLE_CONVENTIONS.md](styles/STYLE_CONVENTIONS.md).

## Convencion de Nombres CSS

Para escalar sin conflictos, aplica prefijos por dominio cuando crees clases nuevas:

1. `landing-`: portada.
2. `shop-` y `product-`: catalogo y detalle.
3. `social-`: feed social.
4. `messages-` y `thread-`: chat/mensajeria.
5. `auth-`: login/registro.
6. `settings-`: ajustes.
7. `search-`: buscador global.
8. `chatbot-`: widget de asistente.
9. `is-` y `has-`: estados de UI.

Guia completa y ejemplos: [styles/STYLE_CONVENTIONS.md](styles/STYLE_CONVENTIONS.md).

### Contenido del archivo `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ROB THE FAB - Aplicacion web construida con React.">
  <meta name="theme-color" content="#111111">
  <title>ROB THE FAB</title>
</head>
<body>
  <div id="root"></div>
  <noscript>Necesitas habilitar JavaScript para usar esta aplicacion.</noscript>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
