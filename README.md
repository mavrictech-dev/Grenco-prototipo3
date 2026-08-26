# GRENCO — Landing

Landing de Grupo Enriquez Construcciones. React + Vite, una sola página, sin router.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ como en produccion
```

Scripts de assets. No hace falta correrlos para desarrollar: su salida ya esta
en el repo. Solo se usan cuando llega material nuevo.

```bash
npm run images   # assets/ -> src/assets/  (logos y fotos de secciones)
npm run video    # clips .MOV -> public/video/  (triptico del hero)
npm run fotos    # HEIC del movil -> src/assets/obra/  (banco de la bitacora)
```

`video` y `fotos` necesitan **ffmpeg**: `winget install Gyan.FFmpeg`.

## Estructura

```
assets/              Originales sin optimizar. NO se despliegan: son la fuente
                     para `npm run images`. No los borres, sin ellos no se
                     puede volver a generar una calidad distinta.
public/              Se copia tal cual a la raiz del sitio (favicon, robots, og)
scripts/             Optimizador de imagenes (sharp)
src/
  assets/            Imagenes ya optimizadas que Vite empaqueta y hashea
  components/        Un componente por seccion
  data/site.js       TODO el texto de la pagina
  hooks/             useSettings (tema/sede), useScrollFx, useReveal
  styles/            tokens.css -> base.css -> components.css
```

**Para cambiar textos, telefonos, servicios o proyectos: `src/data/site.js`.**
Los componentes solo maquetan, no contienen copy.

## Tema, sede y ambiente

Son dos ejes independientes, y esto es un cambio respecto a la primera version:

| Atributo en `<html>` | Valores | Controla |
|---|---|---|
| `data-theme` | `light` / `dark` | La paleta de color y la luminosidad del cielo |
| `data-sede` | `piura` / `trujillo` | El caracter del cielo y que sede se resalta en Contacto |

Antes estaban acoplados: elegir "Sede Trujillo" forzaba el modo oscuro, asi que
no se podia ver Piura de noche ni Trujillo de dia. Ahora el selector de sede y
el boton de tema son controles separados en la barra.

**El fondo ambiental sale del cruce de los dos.** La sede pone el caracter y el
tema la luminosidad, asi que las cuatro combinaciones tienen sentido:

| | claro | oscuro |
|---|---|---|
| **piura** | dia despejado, azul cielo | noche despejada, azul profundo |
| **trujillo** | luz dorada de tarde | atardecer, brasa calida |

Los tokens estan en `tokens.css` y los pinta la capa `.ambient`: el degradado
del cielo, el **sol** (`--sol-x/-y/-tam/-nucleo/-halo`) y las **nubes**.

Al cambiar de sede el sol se mueve, cambia de tamano y de color: en Piura queda
alto y pequeno (96px), en Trujillo baja y crece hasta 190px enrojecido. Eso es
lo que hace notorio el cambio.

**Por que el sol y las nubes estan por debajo del 50% de la capa:** en la
primera pantalla el cielo casi no se ve. La barra de navegacion ocupa los
primeros 94px y el hero arranca en el 96, asi que solo quedan 2px de franja
libre y 16px de margen a cada lado. Con el sol arriba quedaba escondido detras
del hero. Ahora el cielo llega hasta el 80% de 230vh y todo lo que hay que ver
cae por debajo del hero.

En el hero, que tapa el cielo, el cambio de sede se nota por **`--amb-tinte`**:
un lavado azul de dia en Piura y naranja de atardecer en Trujillo, aplicado
como ultima capa de `.hero__overlay`.

### Textos por sede

`src/data/sede-contenido.js` tiene el relato de cada sede: titular del hero,
parrafo de Nosotros, titular de Maquinaria y el bloque de Contacto. Los
componentes lo leen con `contenidoDeSede(sede)` y no saben cual esta activa.
Los proyectos de la sede activa se ordenan primero.

Ahi solo va lo que de verdad cambia entre Piura y Trujillo. Los datos de
empresa —anos en obra, obras entregadas, servicios, flota— se quedan en
`site.js` y **no se duplican**: inventar cifras por sede seria afirmar cosas
que nadie ha medido.

### Hero: solo logo y boton

El hero es el triptico de video, una marca de agua, y en la **esquina inferior
izquierda** un panel compacto (300px) con el logo, la sede y "Ver proyectos".
Nada mas: deja libre el 77% del ancho para las tomas.

El titular y el parrafo que antes iban encima del video estan ahora en la
seccion **Manifiesto**, justo despues de las tarjetas destacadas. Encima del
video competian con las tomas y obligaban a una tarjeta de vidrio tan ancha que
tapaba dos de los tres paneles.

**El `<h1>` de la pagina vive en Manifiesto.** El hero no debe recuperar uno o
habria dos y se rompe la jerarquia del documento.

La marca de agua usa `mix-blend-mode: overlay` (`soft-light` en oscuro) para
fundirse con el video en vez de posarse encima: sube donde el fotograma es
oscuro y baja donde es claro, como una marca de agua de verdad.

### Isotipo de fondo

La G + excavadora transparentada (`.marca-fondo`), detras de todo el contenido
de la pagina.

Tres cosas que conviene no romper:

- **`position: fixed` y ningun `transform` ligado al scroll.** Se queda quieta
  y del mismo tamano de arriba abajo. Una version anterior la escalaba y
  rotaba con el scroll, y mareaba.
- **`z-index: 1`**, o sea por encima del cielo (`0`) y por debajo del contenido
  (`2`). Asi se ve en todo momento, no solo al pasar el hero.
- **Imagen con opacidad (`--markop`), no una mascara en relieve.** Se probo el
  relieve neumorfico —silueta enmascarada rellena de `--bg` con dos sombras
  opuestas— y se ve muy bien, pero solo funciona sobre un fondo plano del mismo
  color: sobre el degradado del cielo se convierte en una mancha solida.

Un detalle que conviene no romper: **`--bg` tiene que seguir siendo un color
solido**. Las tarjetas neumorficas se pintan con `background: var(--bg)` y el
relieve depende de que sea plano. Por eso el cielo es una capa aparte que
termina fundiendose justo en ese mismo `--bg`, en vez de convertir `--bg` en un
degradado.

El tema arranca siguiendo `prefers-color-scheme` y deja de seguirlo en cuanto el
usuario lo cambia a mano. Ambos valores se guardan en `localStorage`, y un
script en `index.html` los aplica antes del primer pintado para que no haya
parpadeo.

## Formulario de contacto

Envia de verdad. En la version anterior el submit solo mostraba el mensaje de
exito y descartaba los datos.

Configura el endpoint en `.env` (copia `.env.example`):

```bash
VITE_FORM_ENDPOINT=https://formspree.io/f/TU_ID
```

Sirve cualquier servicio que acepte `POST` con JSON — Formspree, Basin,
Web3Forms (este ademas necesita `VITE_FORM_ACCESS_KEY`) o una funcion propia.

**Sin `VITE_FORM_ENDPOINT` el formulario no se rompe**: cae a un `mailto:`
prellenado con todos los campos. Nunca queda decorativo.

Incluye validacion en cliente (nombre, formato de correo, mensaje con contenido
real), estados de envio/error y un campo trampa antispam: si un bot lo rellena
se muestra el exito habitual pero no se envia nada.

En Vercel las variables van en *Settings → Environment Variables*. Al empezar
por `VITE_` quedan embebidas en el bundle publico, asi que **no pongas ahi
ningun secreto** — un endpoint de formulario esta pensado para ser publico.

## Triptico del hero

El fondo del hero son **tres clips verticales en fila**, no un panoramico.

El material de origen son tomas de movil en 9:16 (4K60 con rotacion -90). Se
probo primero recortarlas a un 16:9 y se tiraba el 70% del encuadre; en fila
vertical se aprovechan enteras. Al apuntar uno, crece y los otros ceden sitio;
cada panel enlaza a la bitacora, para que el hover no prometa algo que no pasa.

- Se generan con `npm run video`. Que clip entra en cada panel, desde que
  segundo y cuanto dura se define en el array `PANELES` de
  `scripts/encode-video.mjs`.
- **Solo MP4, sin WebM.** Se probo VP9 y salia mas pesado que H.264 con este
  material (3.5 MB contra 1.2 MB en el clip del polvo): una nube de polvo es
  ruido de altisima entropia. Como el navegador se queda con la primera fuente
  que soporta, ofrecer WebM le habria servido el archivo mas grande.
- Los tres bucles duran distinto a proposito. Con la misma duracion se
  sincronizan y el triptico late como un solo bloque.
- No se cargan si el visitante pidio menos movimiento o viene con ahorro de
  datos; queda el `poster`, que ya es la imagen de fondo.
- Se pausan al salir de viewport: un video fuera de pantalla sigue
  decodificando y gastando bateria.
- En movil (<620px) se muestra **una sola toma** —tres tiras de 100px no se
  leen— y los tres puntos de abajo cambian de clip. Esos puntos no se pintan en
  escritorio: alli se ven las tres a la vez y no habria nada que elegir. La
  barra mide 6px pero el area tactil se amplia a 44px con un `::after`.
- El `poster` de cada panel es **WebP**, como el resto de imagenes. Se extrae
  del video por un pipe a sharp en vez de dejar que lo codifique ffmpeg: su
  libwebp comprime bastante peor a la misma calidad percibida.

Los unicos archivos que **no** son WebP son `favicon.png` y `og-image.jpg`, y
es a proposito: los favicons necesitan PNG por compatibilidad, y los scrapers
de redes sociales no leen WebP de forma fiable en las tarjetas Open Graph.

## Bitacora de obra

Feed de actualizaciones, preparado para contenido dinamico.

Todo pasa por `getPosts()` en `src/data/bitacora.js`, que ya es asincrona
aunque hoy resuelva al instante. Para enchufar un CMS o una API se reemplaza
**solo el cuerpo de esa funcion**; los componentes no cambian, y los estados de
carga, vacio y error ya estan puestos y con su esqueleto.

La forma de un post esta documentada arriba de ese mismo archivo.

## GRENCO Tracking

Adelanto del portal del cliente: el panel de "Control de obra · semana 14" que
antes decoraba la seccion Nosotros se promovio a seccion propia, con maqueta de
app movil y de panel web.

Lleva insignia de "Próximamente" con borde discontinuo a proposito: **es un
producto que todavia no existe** y la seccion no debe leerse como algo ya
disponible. Los marcos del telefono y del navegador son CSS, no capturas, asi
que escalan y siguen al tema.

## Deploy (Vercel)

Importa el repo; `vercel.json` ya trae framework, build y cabeceras. No hace
falta configurar nada mas.

Cache: todo lo de `/assets/` lleva hash de contenido y se sirve `immutable` a un
año; el HTML se revalida siempre, para que un deploy nuevo salga al aire de
inmediato.

## Optimizacion

Lo que se hizo al migrar desde el export del canvas de diseño:

- **Eliminados 134 KB de JS del editor.** `image-slot.js` (65 KB) era un
  componente de arrastrar-y-soltar imagenes que en produccion solo pintaba un
  `<img>`; `support.js` (69 KB) ni siquiera estaba referenciado.
- **Logotipos: −93%.** Eran PNG de 3457×1629 px mostrados a 38 px de alto. A
  WebP de 480 px: 858 KB → 65 KB. Ademas ahora se descarga solo el del tema
  activo, en vez de los dos con `display:none`.
- **Fotografia recomprimida: −34%** (WebP q74). El hero sirve `srcset` con una
  variante de 960 px para movil.
- **Fuentes auto-hospedadas.** Antes se pedian a Google Fonts, lo que sumaba dos
  handshakes al camino critico. Ahora se empaquetan, se sirven desde el mismo
  dominio y solo baja el subset latino.
- **Assets totales: 6.5 MB → 3.0 MB.** El JS se parte en dos: React (192 KB, casi
  nunca cambia, se queda en cache entre deploys) y la landing (35 KB).
- Todas las imagenes con `width`/`height` declarados y `loading="lazy"` salvo el
  hero, que va con `fetchpriority="high"` por ser el LCP.

## Detalles que conviene no romper

- **`data-anim` lo pone JavaScript, nunca el HTML.** La regla que oculta los
  bloques antes de animarlos cuelga de ese atributo; si estuviera en el HTML y el
  JS fallara, la pagina entera quedaria invisible.
- **El salto a `#seccion` va en `useLayoutEffect`.** React ejecuta los efectos de
  los hijos antes que los del padre, y `useReveal` mide su posicion en el suyo.
  Con un `useEffect` normal, entrar por un enlace tipo `grenco.pe/#contacto`
  dejaria esa seccion en `opacity: 0`.
- **El carrusel y el parallax escriben en el DOM por referencia, no por estado.**
  Corren a 60 fps: pasarlos a estado de React re-renderizaria el arbol entero en
  cada frame.
