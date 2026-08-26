import Reveal from './Reveal';
import { contenidoDeSede } from '../data/sede-contenido';
import { fotoObra } from '../assets/images';

/**
 * El titular de la marca, que antes iba encima del video del hero.
 *
 * Va justo despues de las tarjetas destacadas: primero el impacto visual de
 * las tomas de obra, luego las tres pruebas rapidas, y aqui la declaracion.
 * Es el primer bloque a ancho completo de la pagina, y el sitio natural para
 * el <h1> ahora que el hero se quedo sin texto.
 *
 * La foto del costado cambia con la sede para que diga lo mismo que el texto:
 * movimiento de tierras en Piura, vialidad en Trujillo.
 */
export default function Manifiesto({ sede }) {
  const { hero } = contenidoDeSede(sede);
  const foto = fotoObra(hero.foto);

  return (
    <section className="section manifiesto">
      <div className="manifiesto__grid">
        <Reveal className="manifiesto__caja">
          {/* La key remonta el bloque al cambiar de sede, para que la entrada
              escalonada se vuelva a disparar con el texto nuevo. */}
          <h1 className="manifiesto__titulo" key={sede}>
            {hero.title.map((line, i) => (
              <span key={line}>
                {line}
                {i < hero.title.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="manifiesto__texto">{hero.text}</p>

          <a className="btn btn--primary" href="#contacto">
            Solicitar cotización
          </a>
        </Reveal>

        {foto && (
          <Reveal delay={140} className="manifiesto__foto" data-px="0.04">
            <div className="media">
              <img
                src={foto}
                alt={hero.fotoAlt}
                width="1000"
                height="1250"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
