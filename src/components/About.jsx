import Icon from './Icon';
import Reveal from './Reveal';
import { about } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';
import { fotoObra } from '../assets/images';

/**
 * El panel de "Control de obra · semana 14" que estaba aqui se promovio a su
 * propia seccion (Tracking): dejo de ser un adorno para pasar a ser el
 * adelanto del portal del cliente. En su lugar va una foto de obra real.
 *
 * El relato (titulo y parrafo) cambia con la sede; los datos de empresa
 * —puntos de metodo y cifras— son los mismos en las dos.
 */
export default function About({ sede }) {
  const foto = fotoObra('obra-1728') ?? fotoObra('obra-0082');
  const texto = contenidoDeSede(sede).about;

  return (
    <section id="nosotros" className="section">
      <div className="split">
        <Reveal>
          <div className="eyebrow">{texto.eyebrow}</div>
          <h2 className="h2">{texto.title}</h2>
          <p className="lead" style={{ maxWidth: '56ch' }}>
            {texto.text}
          </p>

          <ul className="checklist">
            {about.points.map((p) => (
              <li key={p.title}>
                <Icon name="check" size={20} strokeWidth={1.8} />
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="stats">
            {about.stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__num">{s.num}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} data-px="0.05">
          <div className="panel">
            <div className="media media--retrato">
              {foto && (
                <img
                  src={foto}
                  alt="Volquete descargando material en el frente de trabajo"
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
