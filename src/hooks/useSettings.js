import { useCallback, useEffect, useState } from 'react';

import { aplicarSinTransicion } from './aplicarSinTransicion';

/**
 * Tema y sede acoplados por diseño:
 *   Piura    -> data-theme="light" (cielo azul despejado)
 *   Trujillo -> data-theme="dark"  (cielo azul noche)
 */

const SEDE_KEY = 'grenco.sede';
const SEDES = ['piura', 'trujillo'];

/** localStorage puede lanzar en modo privado o con cookies bloqueadas. */
function read(key, allowed, fallback) {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* sin persistencia: la sesion actual sigue funcionando igual */
  }
}

export function useSettings() {
  const [sede, setSedeState] = useState(() => {
    const attr = document.documentElement.getAttribute('data-sede');
    if (SEDES.includes(attr)) return attr;
    return read(SEDE_KEY, SEDES, 'piura');
  });

  const theme = sede === 'trujillo' ? 'dark' : 'light';

  useEffect(() => {
    aplicarSinTransicion(() => {
      document.documentElement.setAttribute('data-sede', sede);
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    });
    write(SEDE_KEY, sede);
  }, [sede, theme]);

  const setSede = useCallback((nuevaSede) => {
    if (SEDES.includes(nuevaSede)) {
      setSedeState(nuevaSede);
    }
  }, []);

  return { theme, sede, setSede };
}

