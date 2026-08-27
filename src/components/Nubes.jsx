/**
 * Nubes de acuarela, cubriendo todo el cielo.
 *
 * Las formas salen de `feTurbulence` (ruido fractal), no de figuras CSS. Un
 * ovalo con `border-radius` siempre se lee como algo solido y de canto duro;
 * el ruido fractal da manchas irregulares que se deshilachan en los bordes,
 * que es como se ve una nube de verdad.
 *
 * Como funciona el filtro:
 *   1. feTurbulence genera ruido fractal (una textura de manchas).
 *   2. feColorMatrix lo convierte en un canal ALFA: donde el ruido es claro la
 *      nube es transparente, donde es oscuro es opaca. `contraste` controla lo
 *      abrupto del corte y `umbral` cuanto cielo se cubre.
 *   3. feComponentTransfer sube los tonos intermedios. Sin este paso el cuerpo
 *      de la nube sale lavado, porque fractalNoise reparte sus valores muy
 *      cerca del medio y casi nunca toca los extremos. Se hace aqui y no
 *      subiendo el umbral porque el umbral engorda la nube hasta taparlo todo.
 *   4. feComposite recorta un rectangulo de `currentColor` contra ese alfa.
 *
 * El paso 4 es lo que permite que el color venga de CSS: `currentColor` hereda
 * el `color` de .nubes, que sale de `--amb-nube`. Asi las mismas nubes salen
 * blancas en Piura y color durazno en el atardecer de Trujillo, sin duplicar
 * nada.
 *
 * POR QUE VA EN BANDAS Y CON `slice`:
 * el cielo mide 170vh y su proporcion cambia muchisimo entre escritorio (casi
 * cuadrado) y movil (muy alto y estrecho). Con una sola capa estirada el ruido
 * se deformaba hasta salir como chorretones verticales.
 *
 * Se arregla en dos pasos. Las BANDAS reparten el alto en trozos anchos, y
 * `preserveAspectRatio="xMidYMid slice"` hace que el SVG se escale conservando
 * su proporcion y RECORTE lo que sobra, en vez de estirarse. Asi la nube tiene
 * la misma forma en un movil que en un monitor: lo unico que cambia es cuanto
 * trozo de cielo se ve.
 *
 * Las semillas son distintas para que no se note el patron repetido, y las
 * escalas alternan para dar sensacion de profundidad.
 */

const BANDAS = [
  { id: 'b1', top: 0, semilla: 11, frecuencia: '0.0026 0.009', contraste: 3.0, umbral: 1.42 },
  { id: 'b2', top: 23, semilla: 27, frecuencia: '0.005 0.014', contraste: 3.4, umbral: 1.52 },
  { id: 'b3', top: 46, semilla: 5, frecuencia: '0.0028 0.0095', contraste: 3.0, umbral: 1.44 },
  { id: 'b4', top: 69, semilla: 41, frecuencia: '0.0046 0.013', contraste: 3.3, umbral: 1.5 },
];

function Banda({ id, top, semilla, frecuencia, contraste, umbral }) {
  return (
    <svg
      className="nubes__capa"
      style={{ top: `${top}%` }}
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <filter id={`nube-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frecuencia}
          numOctaves="5"
          seed={semilla}
          result="ruido"
        />
        <feColorMatrix
          in="ruido"
          type="matrix"
          values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-contraste} 0 0 0 ${umbral}`}
          result="alfa"
        />
        <feComponentTransfer in="alfa" result="alfaDensa">
          <feFuncA type="gamma" exponent="0.45" amplitude="1" offset="0" />
        </feComponentTransfer>
        <feComposite in="SourceGraphic" in2="alfaDensa" operator="in" />
      </filter>

      <rect width="1200" height="420" fill="currentColor" filter={`url(#nube-${id})`} />
    </svg>
  );
}

export default function Nubes() {
  return (
    <div className="nubes" aria-hidden="true">
      {BANDAS.map((b) => (
        <Banda key={b.id} {...b} />
      ))}
    </div>
  );
}
