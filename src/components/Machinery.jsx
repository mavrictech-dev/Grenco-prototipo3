import Reveal from './Reveal';
import { machinery } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';

export default function Machinery({ sede }) {
  const titulo = contenidoDeSede(sede).machinery.title;

  return (
    <section id="maquinaria" className="section">
      <Reveal className="headrow">
        <div>
          <div className="eyebrow">{machinery.eyebrow}</div>
          <h2 className="h2">{titulo}</h2>
          <p className="lead" style={{ marginTop: '12px', maxWidth: '65ch' }}>
            {machinery.text}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a className="btn btn--sm btn--secondary" href="#galeria">
            Ver fotos en Galería
          </a>
          <a className="btn btn--sm btn--primary" href="#contacto">
            Cotizar alquiler
          </a>
        </div>
      </Reveal>

      <div className="machines">
        {machinery.items.map((m, i) => (
          <Reveal as="article" key={m.name} delay={i * 110} className="card card--lift machine">
            <div className="machine__head" style={{ marginTop: 0 }}>
              <div>
                <h3>{m.name}</h3>
                <span className="tag" style={{ marginTop: '6px', display: 'inline-block' }}>
                  {m.tag}
                </span>
              </div>
            </div>

            <ul className="specs">
              {m.specs.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </li>
              ))}
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '20px' }}>
              <a
                className="btn btn--sm btn--secondary"
                href="#galeria"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                Ver en Galería
              </a>
              <a
                className="btn btn--sm btn--primary"
                href="#contacto"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                Alquilar
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
