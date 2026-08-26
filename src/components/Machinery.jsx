import Reveal from './Reveal';
import { machinery } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';
import { img } from '../assets/images';

export default function Machinery({ sede }) {
  const titulo = contenidoDeSede(sede).machinery.title;

  return (
    <section id="maquinaria" className="section">
      <Reveal className="headrow">
        <div>
          <div className="eyebrow">{machinery.eyebrow}</div>
          <h2 className="h2">{titulo}</h2>
        </div>
        <a className="btn btn--sm btn--secondary" href="#contacto">
          Ver ficha técnica
        </a>
      </Reveal>

      <div className="machines">
        {machinery.items.map((m, i) => (
          <Reveal as="article" key={m.name} delay={i * 110} className="card card--lift machine">
            <div className="media">
              <img src={img(m.img)} alt={m.name} width="1000" height="750" loading="lazy" decoding="async" />
            </div>

            <div className="machine__head">
              <h3>{m.name}</h3>
              <span className="tag">{m.tag}</span>
            </div>

            <ul className="specs">
              {m.specs.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </li>
              ))}
            </ul>

            <a className="btn btn--sm btn--secondary btn--block" href="#contacto">
              Consultar disponibilidad
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
