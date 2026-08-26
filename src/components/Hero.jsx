import HeroWall from './HeroWall';
import { contenidoDeSede } from '../data/sede-contenido';
import { mark } from '../assets/images';

/**
 * Hero: solo el triptico de video, la marca de agua, el logo y un boton.
 *
 * El titular y el parrafo se movieron a la seccion Manifiesto, justo debajo.
 * Encima del video competian con las tomas —que son lo que hay que ver aqui— y
 * obligaban a una tarjeta de vidrio tan ancha que tapaba dos de los tres
 * paneles.
 *
 * Ojo: el <h1> de la pagina vive ahora en Manifiesto. Esta seccion no debe
 * recuperar uno, o habria dos y se rompe la jerarquia del documento.
 */
export default function Hero({ sede }) {
  const { hero } = contenidoDeSede(sede);

  return (
    <section id="inicio" className="hero">
      <div className="hero__frame">
        <HeroWall />

        {/* Lavado de legibilidad + tinte de sede */}
        <div className="hero__overlay" />

        {/* Marca de agua sobre las tomas */}
        <div className="hero__agua" aria-hidden="true">
          <img src={mark} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="hero__body">
          <div className="hero__centro">
            <img
              className="hero__marca"
              src={mark}
              alt="GRENCO — Grupo Enriquez Construcciones"
              width="380"
              height="517"
            />

            <p className="hero__sede">{hero.eyebrow}</p>

            <a className="btn btn--primary hero__boton" href="#proyectos">
              Ver proyectos
            </a>
          </div>

          <div className="hero__foot">
            <span className="hero__hint hide-sm">{hero.hint}</span>

            <div className="hero__scroll hide-sm" aria-hidden="true">
              <span>Scroll</span>
              <div className="hero__scrollrail">
                <i />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
