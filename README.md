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





---

## 4. Arquitectura y tecnología
La aplicación se estructurará siguiendo un modelo de arquitectura cliente-servidor:

* **Frontend (Interfaz):** Desarrollado con **React.js** para garantizar una experiencia de usuario fluida y reactiva.
* **Backend (Lógica):** Utilizaremos **Node.js** con el framework **Express** para gestionar las rutas de la API y la lógica de negocio.
* **Base de Datos:** Estamos evaluando el uso de **MySQL** (Relacional) o **MongoDB** (NoSQL) para el almacenamiento de perfiles y transacciones.
* **Servicios Externos (APIs):** * **Moda News API:** Para el contenido de actualidad.
    * **OpenAI API:** Para la inteligencia del chatbot de ayuda.

---
