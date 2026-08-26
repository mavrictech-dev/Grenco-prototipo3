import { useMemo } from 'react';
import Reveal from './Reveal';
import { projects } from '../data/site';
import { img } from '../assets/images';

export default function Projects({ sede }) {
  // Los proyectos de la sede activa van primero. No se ocultan los otros: son
  // obra de la misma empresa y sirven de referencia igual.
  const orden = useMemo(() => {
    const propios = projects.items.filter((p) => p.sede === sede);
    const resto = projects.items.filter((p) => p.sede !== sede);
    return [...propios, ...resto];
  }, [sede]);

  return (
    <section id="proyectos" className="section">
      <Reveal>
        <div className="eyebrow">{projects.eyebrow}</div>
        <h2 className="h2">{projects.title}</h2>
      </Reveal>

      <div className="projects__grid">
        {orden.map((p, i) => (
          <Reveal as="article" key={p.title} delay={i * 110} className="card card--lift project">
            <div className="media">
              <img src={img(p.img)} alt={p.title} width="1200" height="800" loading="lazy" decoding="async" />
            </div>
            <div className="project__meta">
              <span>{p.kind}</span>
              <span>·</span>
              <span>{p.place}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <a className="btn btn--sm btn--secondary btn--block" href="#contacto">
              Ver caso
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
