# Guía Definitiva: Cómo Conectar la Landing de GRENCO con Google y Aparecer en los Resultados de Búsqueda (SEO)

Esta guía explica detalladamente por qué una página nueva no aparece inmediatamente al buscar **"GRENCO"** en Google y cuáles son los **pasos exactos** para registrarla, verificarla y posicionarla en los primeros resultados.

---

## ¿Por qué aún no aparece "GRENCO" en Google?

Cuando una web se publica por primera vez en internet:
1. **Google no es adivino:** Google no rastrea todo internet al segundo; necesita ser "notificado" de que el dominio `grenco.com.pe` (o `grenco.pe`) existe.
2. **Falta de verificación de propiedad:** Sin **Google Search Console**, Google desconoce quién es el dueño del sitio y tarda semanas o meses en descubrirlo por sí solo.
3. **Falta de ficha en Google Maps (Google Business Profile):** Cuando buscas marcas consolidadas en Google, el 80% del impacto visual proviene de la **Ficha de Empresa** en Google Maps (con fotos, teléfonos, dirección y botón a la web).

Ya hemos preparado todo el código en la web (Structured Data Schema.org, meta tags, robots.txt, sitemap.xml). Ahora solo debes seguir estos sencillos pasos:

---

## PASO 1: Registrarse en Google Search Console y Conectar la Web

**Google Search Console** es la herramienta oficial y gratuita de Google para dueños de sitios web.

1. Abre tu navegador e ingresa con la cuenta de Gmail o Google de la empresa a:  
   👉 **[https://search.google.com/search-console](https://search.google.com/search-console)**
2. Haz clic en **"Empezar ahora"**.
3. En la ventana emergente para elegir tipo de propiedad, selecciona la opción de la derecha:  
   **"Prefijo de la URL"**.
4. Escribe la dirección web oficial:  
   `https://grenco.com.pe/` (o el dominio definitivo que estés usando).
5. Haz clic en **Continuar**.

---

## PASO 2: Elegir el Método de Verificación (Archivo HTML o Etiqueta Meta)

Google te pedirá demostrar que eres el dueño del sitio. Tienes **dos opciones muy fáciles**:

### Opción A: Archivo HTML (Muy sencilla)
1. En la lista de métodos, selecciona **"Archivo HTML"**.
2. Google te mostrará un botón para descargar un archivo que se llama algo como: `google1234567890abcdef.html`.
3. Descarga ese archivo y cópialo directamente dentro de la carpeta:  
   `Landing GRENCO neumorfismo/public/`
4. Sube los cambios al servidor (o haz `git push`).
5. Vuelve a Google Search Console y haz clic en el botón **"Verificar"**.  
   *¡Listo! Verificación aprobada al instante.*

---

### Opción B: Etiqueta HTML (Meta Tag)
1. En la lista de métodos de verificación de Google, selecciona **"Etiqueta HTML"**.
2. Google te dará una línea de código parecida a esta:  
   `<meta name="google-site-verification" content="xyzABC1234567890..." />`
3. Copia el valor que viene dentro de `content="..."`.
4. Abre el archivo `index.html` de este proyecto y busca la línea que dejamos lista:  
   ```html
   <meta name="google-site-verification" content="COLOCA_AQUI_TU_CODIGO_DE_GOOGLE_SEARCH_CONSOLE" />
   ```
5. Reemplaza `COLOCA_AQUI_TU_CODIGO_DE_GOOGLE_SEARCH_CONSOLE` por el código que te dio Google.
6. Sube los cambios al servidor y haz clic en **"Verificar"** en Google Search Console.

---

## PASO 3: Enviar el Mapa del Sitio (`sitemap.xml`) a Google

Una vez verificada la propiedad en Google Search Console:

1. En el menú lateral izquierdo, haz clic en **"Sitemaps"** (o "Mapas del sitio").
2. En la casilla que dice *"Añadir un nuevo sitemap"*, escribe únicamente:  
   `sitemap.xml`
3. Haz clic en **"Enviar"**.
4. Verás que en unos segundos el estado cambia a **"Correcto"** (verde).  
   *Esto le dice a Googlebot exactamente qué secciones tiene GRENCO (Inicio, Servicios, Proyectos, Nosotros, Contacto).*

---

## PASO 4: Forzar a Google a Indexar la Web Hoy Mismo ("Inspección de URLs")

Normalmente Google puede tardar días en visitar un sitemap, pero hay un truco para pedirle que lo haga **de inmediato**:

1. En la barra de búsqueda superior de Google Search Console (donde dice *"Inspeccionar las URLs de..."*), pega:  
   `https://grenco.com.pe/`
2. Presiona Enter.
3. Te saldrá un mensaje diciendo *"La URL no está en Google"* (lo cual es normal al inicio).
4. Haz clic en el botón que dice **"SOLICITAR INDEXACIÓN"**.
5. Google analizará la página en vivo en 1 minuto y la pondrá en la cola prioritaria de rastreo. En 24 a 48 horas ya aparecerá en los resultados de búsqueda.

---

## PASO 5: Crear la Ficha de Google Mi Negocio (Google Maps) con las 2 Sedes

Para que cuando alguien busque **"GRENCO"**, **"GRENCO Piura"** o **"GRENCO Trujillo"** aparezca el recuadro corporativo grande a la derecha de Google con fotos de maquinaria, teléfonos y mapa:

1. Ingresa a: 👉 **[https://www.google.com/business/](https://www.google.com/business/)** con el correo de la empresa.
2. Haz clic en **"Administrar ahora"**.
3. **Nombre de la empresa:** `GRENCO - Grupo Enríquez Construcciones S.A.C.`
4. **Categoría comercial:** *Empresa de construcción* / *Contratista general* / *Servicio de movimiento de tierras*.
5. Registra las **2 Sedes**:
   * **Sede Principal (Piura):**
     * Dirección: `Mz C lote 18 Las Malvinas - Urb. Piura, Piura, Perú`
     * Teléfono: `974 783 603`
     * Horario: Lunes a Sábado 7:00 a 18:00
     * Sitio web: `https://grenco.com.pe`
   * **Sede Trujillo:**
     * Dirección: `Apurimac 166 Urb. Palermo, Trujillo, La Libertad, Perú`
     * Teléfono: `979 506 948`
     * Horario: Lunes a Viernes 8:00 a 18:00
     * Sitio web: `https://grenco.com.pe`
6. Añade las fotos de maquinaria, logotipo y proyectos que están en la carpeta `src/assets/`.

---

## Resumen de Mejoras Técnicas Implementadas en el Código

En el código fuente de la landing ya hemos dejado configurado:

1. **Datos de Contacto Actualizados en toda la Web:**
   * **Piura:** `Mz C lote 18 Las Malvinas - Urb. Piura` · Tel: `+51 974 783 603`
   * **Trujillo:** `Apurimac 166 Urb. Palermo` · Tel: `+51 979 506 948`
   * **WhatsApp:** `+51 974 783 603` (Conexión directa flotante y en botones de cotización)
   * **Correo Oficial:** `grupoenriquezconstrucciones@hotmail.com`
   * **Redes Sociales Enlazadas:**
     * Facebook: [Página oficial de GRENCO](https://www.facebook.com/share/1Jf3TEdKWL/?mibextid=wwXIfr)
     * Instagram: [@grenco20construcciones](https://www.instagram.com/grenco20construcciones?stkn=YTJzenJlczV4c2d3)

2. **Marcado Estructurado Schema.org (JSON-LD en `index.html`):**
   * Configurado bajo el tipo `GeneralContractor` y `ConstructionBusiness`.
   * Incluye los nombres alternativos de búsqueda: `"GRENCO"`, `"Grupo Enríquez Construcciones"`, `"Grupo Enriquez Construcciones S.A.C."` y `"GRENCO S.A.C."`.
   * Incluye las coordenadas de región para Piura y La Libertad.
   * Vincula las cuentas oficiales de Facebook e Instagram (`sameAs`) para que Google reconozca la entidad oficial.

3. **Archivos de Rastreo Automático:**
   * `public/robots.txt`: Permite el acceso de Googlebot sin bloqueos e indica la ruta de los sitemaps.
   * `public/sitemap.xml`: Lista priorizada de URLs con etiquetas de actualización semanal y prioridad máxima (1.0).
