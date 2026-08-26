import { useCallback, useEffect, useState } from 'react';

/**
 * Tema y sede son dos ejes independientes.
 *
 *   data-theme  light | dark   -> paleta de color
 *   data-sede   piura | trujillo -> que sede se resalta en contacto
 *
 * En el export original venian acoplados ("Sede Trujillo" forzaba modo oscuro),
 * lo que impedia ver Piura de noche o Trujillo de dia.
 */

const THEME_KEY = 'grenco.theme';
const SEDE_KEY = 'grenco.sede';
const SEDES = ['piura', 'trujillo'];
const THEMES = ['light', 'dark'];

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

function systemTheme() {
  if (typeof matchMedia !== 'function') return 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useSettings() {
  // El script en index.html ya escribio data-theme antes del primer pintado.
  // Leerlo de ahi evita que React repinte con un valor distinto.
  const [theme, setTheme] = useState(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (THEMES.includes(attr)) return attr;
    return read(THEME_KEY, THEMES, systemTheme());
  });

  const [sede, setSede] = useState(() => read(SEDE_KEY, SEDES, 'piura'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    write(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-sede', sede);
    write(SEDE_KEY, sede);
  }, [sede]);

  // Seguir al sistema mientras el usuario no haya elegido tema a mano.
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    let userPicked = false;
    try {
      userPicked = localStorage.getItem(THEME_KEY) !== null;
    } catch {
      /* sin storage no hay eleccion previa que respetar */
    }
    if (userPicked) return;

    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme, sede, setSede };
}
