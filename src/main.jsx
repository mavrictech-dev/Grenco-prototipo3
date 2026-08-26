import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fuentes auto-hospedadas: se empaquetan con hash y se sirven desde el mismo
// dominio. El original las pedia a Google Fonts, lo que anadia dos handshakes
// (fonts.googleapis + fonts.gstatic) al camino critico del render.
// Solo el eje de peso (sin italica ni ancho) y solo los subsets latinos: cada
// @font-face lleva unicode-range, asi que el navegador baja unicamente el que
// necesita el texto en pantalla.
import '@fontsource-variable/archivo/wght.css';
import '@fontsource/young-serif/latin-400.css';
import '@fontsource/young-serif/latin-ext-400.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
