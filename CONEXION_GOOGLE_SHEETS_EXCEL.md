# 📊 Guía Rápida: Conectar el Formulario de GRENCO con Google Sheets (Excel en Línea)

Con este método gratuito, cada vez que un cliente llene el formulario en la web, **los datos se guardarán automáticamente como una nueva fila en tu Google Sheet (Excel)** con fecha, hora, nombre, teléfono, correo, servicio de interés, sede y mensaje.

---

## Paso 1: Crear tu Hoja de Cálculo en Google Drive

1. Entra a [Google Sheets (docs.google.com/spreadsheets)](https://docs.google.com/spreadsheets).
2. Crea una hoja en blanco y ponle de nombre: **`GRENCO - Cotizaciones Web`**.

---

## Paso 2: Pegar el Script de Conexión

1. En el menú superior de tu hoja de Google, haz clic en **Extensiones** > **Apps Script**.
2. Se abrirá una nueva pestaña con un editor de código. Borra todo lo que aparezca ahí y **pega exactamente este código**:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    
    // Leer los datos enviados desde la web
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter;
    }
    
    // Si la hoja está vacía, crea los encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre y Apellido",
        "Correo Electrónico",
        "Teléfono",
        "Servicio de Interés",
        "Sede",
        "Ubicación y Alcance (Mensaje)"
      ]);
      sheet.getRange(1, 1, 1, 7)
        .setFontWeight("bold")
        .setBackground("#e05a00")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // Fecha y hora local de Lima, Perú
    var fechaLima = Utilities.formatDate(new Date(), "America/Lima", "dd/MM/yyyy HH:mm:ss");
    
    // Agregar la nueva fila con los datos del cliente
    sheet.appendRow([
      fechaLima,
      data.nombre || "",
      data.email || "",
      data.telefono || "—",
      data.servicio || "",
      data.sede || "",
      data.mensaje || ""
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Fila agregada correctamente" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Haz clic en el icono de guardar (💾 o `Ctrl + S`).

---

## Paso 3: Publicar como Aplicación Web (Obtener tu Enlace)

1. En la esquina superior derecha de Apps Script, haz clic en el botón azul **Implementar** > **Nueva implementación**.
2. En la ventana emergente, haz clic en el icono de engranaje ⚙️ (al lado de "Seleccionar tipo") y elige **Aplicación web**.
3. Configura exactamente estas 3 opciones:
   - **Descripción**: `Conexión Web GRENCO`
   - **Ejecutar como**: **Yo (`tu-correo@gmail.com`)**
   - **Quién tiene acceso**: **Cualquier usuario** *(Importante: debe ser "Cualquier usuario" para que el formulario de la web pueda enviar datos sin pedir inicio de sesión)*.
4. Haz clic en **Implementar**.
5. Google te pedirá "Autorizar acceso" por primera vez:
   - Elige tu cuenta de Google.
   - Si sale una pantalla de advertencia ("Google no ha verificado esta app"), haz clic abajo en **Avanzado** (o *Configuración avanzada*) y luego en **Ir a proyecto (no seguro)**.
   - Haz clic en **Permitir**.
6. Google te entregará una **URL de la aplicación web** que empieza con:
   `https://script.google.com/macros/s/AKfycb.../exec`
7. **Copia esa URL.**

---

## Paso 4: Conectar la URL en tu Proyecto

Tienes dos formas súper sencillas:

### Opción A (Recomendada): Pegarla en el archivo `.env`
Abre el archivo [`.env`](file:///c:/Users/maxmo/Downloads/grenco/Landing%20GRENCO%20neumorfismo/.env) y pega la URL:
```env
VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/AKfycb.../exec
```

### Opción B: Pegarla en `src/data/site.js`
Abre [`src/data/site.js`](file:///c:/Users/maxmo/Downloads/grenco/Landing%20GRENCO%20neumorfismo/src/data/site.js) y en la línea `googleSheetUrl` pega la URL:
```javascript
export const contact = {
  ...
  googleSheetUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
  ...
};
```

---

## ¡Listo!
Apenas guardes la URL, llena el formulario de prueba en tu web y verás aparecer la fila de inmediato en tu Google Sheet en tiempo real.
