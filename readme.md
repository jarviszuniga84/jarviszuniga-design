# Portfolio — Camila Sotelo (plantilla)

Portfolio personal de una sola página, con animaciones y todo funcional.
Dirección de diseño: **editorial kinético / sobreimpresión risográfica**.

## Cómo verlo

La forma más simple: **doble clic en `index.html`** (se abre en el navegador).
No necesita servidor ni instalar nada; las fuentes se cargan desde Google Fonts,
así que conviene tener internet la primera vez.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | Estructura y contenido |
| `styles.css` | Estilos, tokens de color/tipografía y animaciones |
| `script.js`  | Interacciones (menú, filtro, formulario, animaciones de scroll) |

## Qué incluye

- **Hero** con el nombre en sobreimpresión de dos tintas (coral + azul) que se
  "registran" al cargar y se mueven con el mouse.
- **Marquee** de servicios en bucle.
- **Sobre mí**, con datos destacados.
- **Trabajo** con grilla de proyectos y **filtro funcional** (Todo / Producto / Motion / Marca).
- **Servicios**, **Proceso** (3 pasos) y **Contacto** con formulario validado.
- Animaciones al hacer scroll, nav que resalta la sección activa, barra de progreso,
  cursor personalizado y menú móvil.
- Accesible: foco visible, navegable por teclado y respeta `prefers-reduced-motion`.

## Cómo hacerlo tuyo

1. **Nombre:** buscá y reemplazá `Camila Sotelo` en `index.html` (hero, nav, footer)
   y las iniciales `CS` del logo.
2. **Email:** reemplazá `hola@camilasotelo.com` en `index.html` y en `script.js`
   (la función del formulario arma un `mailto:` a esa dirección).
3. **Proyectos:** editá las tarjetas `<article class="card" ...>` en la sección
   `#trabajo`. El atributo `data-cat` define en qué filtro aparece
   (`producto`, `motion`, `marca`; podés poner varios separados por espacio).
4. **Colores:** cambiá los tokens al inicio de `styles.css` (`:root { --coral: ...; }`).
5. **Textos:** todo el copy está en `index.html`, listo para ajustar.

## Nota sobre el formulario

No tiene backend: valida los campos y abre el cliente de correo con el mensaje
pre-armado. Si querés que envíe de verdad sin abrir el correo, se puede conectar
a un servicio como Formspree o a una función serverless.
