/**
 * Barril de imagenes. Vite resuelve el glob en build time, les pone hash de
 * contenido y las sirve con cache inmutable. Importarlas asi (en vez de
 * dejarlas en public/) es lo que permite cachearlas para siempre.
 */
const photos = import.meta.glob('./images/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** @param {string} name nombre del archivo sin extension, p.ej. 'hero-1' */
export function img(name) {
  const url = photos[`./images/${name}.webp`];
  if (!url && import.meta.env.DEV) {
    console.warn(`[images] no existe src/assets/images/${name}.webp`);
  }
  return url;
}

/**
 * Banco de fotos de obra: las convierte `npm run fotos` desde los HEIC del
 * movil. Alimenta la bitacora y la tira de fotos del portal.
 */
const obra = import.meta.glob('./obra/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** @param {string} name p.ej. 'obra-1012'; devuelve null si no existe. */
export function fotoObra(name) {
  return obra[`./obra/${name}.webp`] ?? null;
}

/** Todas las fotos de obra, ordenadas por nombre. Para tiras y rejillas. */
export const fotosObra = Object.keys(obra)
  .sort()
  .map((k) => ({ id: k.slice('./obra/'.length, -'.webp'.length), url: obra[k] }));

export { default as lockupLight } from './brand/grenco-lockup-light.webp';
export { default as lockupDark } from './brand/grenco-lockup-dark.webp';
export { default as mark } from './brand/grenco-mark.webp';
