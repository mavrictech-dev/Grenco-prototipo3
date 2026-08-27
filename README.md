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

**En movil el cielo necesita su propia banda.** Las tarjetas destacadas solapan
el hero -58px y son opacas; apiladas a ancho completo tapaban por entero el sol
y las nubes, asi que el cielo no se veia en ningun momento. Por debajo de 700px
ese solape se cambia por **200px de banda de cielo** entre el hero y las
tarjetas, y la capa baja a `148vh` para que el sol (que va al 74%) caiga en el
centro de esa banda.

El tamano del sol va en `clamp(min, vw, max)` por el mismo motivo: un disco de
190px se comia la banda entera en un movil. Queda en 62/44/108/82px segun sede
y tema en movil, y 95/62/187/132px en escritorio.

### Nubes

Las formas las genera un filtro SVG de **ruido fractal** (`Nubes.jsx`), no
figuras CSS. Un ovalo con `border-radius` siempre se lee como algo solido y de
canto duro; el ruido fractal da manchas de acuarela que se deshilachan.

Dos detalles que costaron y conviene no deshacer:

- **`preserveAspectRatio="xMidYMid slice"`.** El cielo es casi cuadrado en
  escritorio y muy alto y estrecho en movil. Estirando el SVG (`none`) el ruido
  se deformaba hasta salir como chorretones verticales. Con `slice` el SVG
  conserva su proporcion y recorta lo que sobra, asi que la nube tiene la misma
  forma en cualquier pantalla.
- **El realce de gamma (`feComponentTransfer`) va despues del corte de alfa.**
  `fractalNoise` reparte sus valores muy cerca del medio y casi nunca toca los
  extremos, asi que el cuerpo de la nube salia lavado. Subir el umbral en su
  lugar parece equivalente pero no lo es: engorda la nube hasta cubrir el cielo
  entero (se probo, dejaba un 93% tapado y se leia como bruma).

Van en cuatro bandas solapadas que cubren el cielo entero, cada una con su
semilla para que no se note el patron. El color sale de `currentColor`, que
hereda de `--amb-nube`: blancas en Piura, durazno en el atardecer de Trujillo,
sin duplicar el SVG.

Dos trampas mas que ya estan resueltas y conviene no reintroducir:

- **`max-width: none` en `.nubes__capa`.** El reset de `base.css` pone
  `svg { max-width: 100% }`, y esa regla recortaba el `width: 150%` de las
  bandas a exactamente 100%: las nubes se cortaban en seco antes del borde
  derecho. Las bandas TIENEN que desbordar para que la deriva no descubra el
  canto del lienzo.
- **El recorrido de la deriva sale de `--deriva`, no de los keyframes.** Las
  reglas `:nth-child` que asignan duracion usan el atajo `animation`, que
  incluye `animation-name`; sobrescribirlo desde `.nubes__capa` no funciona
  porque `:nth-child` tiene mas especificidad. Con una variable dentro de
  `translateX(var(--deriva))` basta cambiarla por media query.

La deriva va a 13-23px/s en escritorio y 10px/s en movil. Antes eran 150-210s
para un recorrido del 6%: menos de 1px por segundo, o sea invisible.

**Contraste en la parte baja del cielo.** Las nubes se veian lavadas segun
bajaba la pagina, por dos motivos a la vez:

1. El degradado llegaba a su tono mas claro ya al 62%, y contra un cielo casi
   blanco una nube blanca no tiene contra que contrastar. Se corrieron las
   paradas a 40/74/96% y se saturaron los `--amb-bajo`.
2. El desvanecido de `.nubes` arrancaba al 74%, justo donde todavia queda cielo
   de color. Ahora empieza al 84%.

En Trujillo habia ademas un tercer problema propio: la nube (`#ffd9b0`) y el
`--bg` beige tenian casi la misma luminancia, asi que al fundirse el cielo la
nube desaparecia. Se aclaro a `#fff0d8`.

Contraste de luminancia medido (60 / 70 / 78 / 85% de la capa):

| | antes | ahora |
|---|---|---|
| Piura dia | 21 / 19 / 15 / 7 | **43 / 40 / 35 / 27** |
| Trujillo dia | 35 / 30 / 21 / 10 | **53 / 50 / 41 / 26** |

La caida por debajo del 90% es intencionada: ahi el cielo ya termino y las
nubes tienen que apagarse, o se quedarian flotando sobre el fondo plano.

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

**Nada del hero puede entrar en la franja que solapan las tarjetas.** Las
destacadas suben `--solape-tarjetas` (58px) sobre el borde inferior del hero y
son opacas, asi que tapaban la fila de pistas y, entera, la etiqueta que sale
al pasar el cursor sobre un panel de video.

Esa medida esta en un token precisamente porque la usan tres reglas que tienen
que moverse juntas: el margen negativo de `.highlights`, el `padding-bottom` de
`.hero__body` y el de `.hero__panel-tag`. En movil vale `0` porque alli las
tarjetas se apartan para dejar ver el cielo.

**Ojo con la etiqueta del hover (`.hero__panel-tag`):** lo que sube por encima
del solape es su `padding-bottom`, NO su `bottom`. Su degradado va de opaco
abajo a transparente arriba, asi que si la caja termina antes del fondo del
panel su canto inferior se queda en el punto mas oscuro y aparece una linea
dura contra el video. Anclada con `bottom: 0`, esa zona la tapan las tarjetas y
la transicion no se ve.

Los textos del pie del hero (la pista y el indicador "Scroll") van sobre
pastillas mate. Iban sueltos sobre el video con `color: var(--ink3)`, y sobre
un fotograma de arena o de cielo claro un gris medio no se ve.

El panel tiene acabado **mate**, no de vidrio: superficie plana y translucida,
sin `backdrop-filter` ni brillo interior. Al no haber desenfoque el video se ve
nitido a traves, asi que el tinte es mas opaco de lo que seria con vidrio —80%
en claro y 84% en oscuro, frente al 42%/60% de la version anterior— o el texto
no se leeria sobre las zonas claras del clip.

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

### Politica de cache (por que cada regla es como es)

El esquema de `vercel.json` **no admite propiedades extra** dentro de `headers`,
asi que estas notas no pueden ir como comentarios en el propio archivo: un
`"comment"` ahi hace que Vercel rechace el deploy con
`headers[0] should NOT have additional property comment`.

| Ruta | Cabecera | Por que |
|---|---|---|
| `/assets/(.*)` | `max-age=31536000, immutable` | Todo lo que emite Vite lleva hash de contenido: si cambia el archivo, cambia el nombre. Se puede cachear para siempre. |
| `/video/(.*)` | `max-age=86400, stale-while-revalidate=604800` | Los videos y sus posters viven en `public/` y **no** llevan hash: si se reemplaza un clip, el nombre no cambia. Por eso no pueden ser `immutable`. Un dia de frescura, y una semana sirviendo el viejo mientras revalida en segundo plano. |
| `/` | `max-age=0, must-revalidate` | El HTML no lleva hash. Se revalida siempre para que un deploy nuevo salga al aire de inmediato. |
| `/(.*)` | cabeceras de seguridad | `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` y HSTS. |

### Requisitos del build

`package.json` fija `engines.node: ">=20.19"` porque Vite 7 lo exige. Sin eso,
Vercel podria elegir una version antigua y el build reventaria sin un mensaje
claro.

Las dos variables que Vercel detecta (`VITE_FORM_ENDPOINT` y
`VITE_FORM_ACCESS_KEY`) son **opcionales**: sin ellas el formulario cae al
`mailto:` prellenado y el deploy funciona igual.

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

## Responsive: criterios y minimos

Se audito en 360, 768, 1024, 1440 y 1920px buscando desbordes, solapes, texto
demasiado pequeno y objetivos tactiles cortos. Lo que quedo fijado:

- **Sin scroll horizontal en ningun ancho.** Las capas que desbordan a
  proposito (cielo, nubes, marca de fondo, triptico) las recorta su contenedor
  con `overflow: hidden`.
- **Objetivos tactiles de 40px minimo**: enlaces del menu, del pie, telefono y
  correo. Los puntos del selector de video miden 6px de alto pero amplian su
  area a 44px con un `::after`.
- **Suelo tipografico de 11px** en las micro-etiquetas en mayusculas. Bajaban
  hasta 8px y en un movil real no se leen.

Los dos ultimos van en `@media (max-width: 900px), (pointer: coarse)` y **no**
solo por ancho: una tablet de 768px se toca con el dedo igual que un movil, y
con un breakpoint de 700px se quedaba fuera.

Lo unico que sigue por debajo de 11px es el texto de dentro de la maqueta del
telefono (10-10.5px). Ahi es deliberado: representa la interfaz de una app a
escala pequena, y subirlo la haria parecer una captura ampliada.

## Neumorfismo sobre fondo de color

El neumorfismo clasico da por hecho que el elemento y su entorno comparten el
mismo color de fondo: la sombra clara simula una luz que rebota en esa misma
superficie. Aqui esa premisa **no se cumple** — la barra, el hero, las tarjetas
y el boton de WhatsApp flotan sobre el cielo de la sede.

Con la formula de manual (`-7px -7px 16px #ffffff`) esa mitad clara pintaba
blanco opaco fuera de cada caja, y sobre el cielo se leia como un halo: +64
niveles de luminancia en Piura y +99 en el atardecer de Trujillo.

**La luz va dentro, no fuera.** `--nu1/2/3` llevan la mitad clara como `inset`,
pintada sobre el propio fondo de la caja; fuera solo queda la sombra oscura:

```css
--nu1: 6px 7px 15px var(--sh), inset 0 1px 0 var(--hl);
```

Bajar simplemente el alfa de `--hl` no servia: apagaba por igual el halo y el
relieve sobre el fondo plano (de +25 a +6 niveles, las tarjetas quedaban
planas). Moviendola a `inset` el relieve puede ser fuerte —`--hl` esta al 72%—
sin derramar un solo pixel de luz sobre el cielo.

`--hl` y `--sh` son ademas **semitransparentes** y no colores solidos, por lo
mismo: una sombra opaca sobre un fondo de color lo tine en vez de oscurecerlo.

Comprobado con un barrido de todo el DOM en los dos temas: **ninguna sombra
exterior clara ni ningun borde claro**. Si al anadir un componente aparece un
halo, casi seguro es una sombra clara sin `inset`.

## Rendimiento al cambiar de tema o de sede

Cambiar claro/oscuro dejaba la pagina pillada casi un segundo. La causa no era
una sola cosa, sino tres sumandose:

| | coste |
|---|---|
| 114 elementos transicionando `box-shadow` | el desenfoque se rasteriza en CPU, no hay GPU que valga |
| `.ambient` transicionando `background` | interpolar un degradado de 4 paradas sobre 2,2 Mpx |
| `.nubes` transicionando `color` | **el peor**: el `<rect>` usa `fill="currentColor"`, asi que el filtro de ruido fractal (5 octavas x 4 bandas, 4,1 Mpx) se recalculaba en CADA frame |

Entre todo, unos 26 Mpx repintandose durante 900ms sobre una pantalla de 1,3.

**La solucion es no animar el cambio.** `hooks/aplicarSinTransicion.js` apaga
las transiciones, aplica el atributo, fuerza un recalculo sincrono para que el
navegador lo consolide sin animar, y las vuelve a encender en la siguiente
tarea. El cambio pasa a ser instantaneo y no cuesta nada.

Dos detalles de esa funcion que importan:

- Usa `setTimeout` y **no** `requestAnimationFrame` para restaurar: con la
  pestana en segundo plano rAF no se ejecuta, la clase se quedaria pegada y la
  pagina volveria sin ninguna transicion.
- El `void root.offsetHeight` no es decorativo. Fuerza el recalculo de estilo
  ahi mismo; sin el, el navegador podria agrupar el cambio de atributo con la
  retirada de la clase y animar igualmente.

De paso, `.reveal` dejo de transicionar `box-shadow` y `background-color`
—estaban solo para suavizar el cambio de tema, que ya no se anima— y se quedo
con `opacity` y `transform`, las dos compuestas por GPU. Revelar decenas de
bloques al hacer scroll pasa a no costar repintado.

Resultado en el escenario base: los elementos con alguna propiedad cara en
transicion bajan de **114 a 77**, y el area afectada de **19,4 a 6,9 Mpx**. Los
77 que quedan se disparan solo con el hover, o sea de uno en uno.
