import { useMemo, useRef } from 'react';
import Icon from './Icon';
import Reveal from './Reveal';
import { projects } from '../data/site';
import { img } from '../assets/images';

function ProjectCard({ project, delay }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Reveal as="article" delay={delay} className="card card--lift project">
      <div
        className="media project__media"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {project.video ? (
          <>
            <video
              ref={videoRef}
              src={project.video}
              poster={project.poster || img(project.img)}
              muted
              loop
              playsInline
              preload="metadata"
              className="project__video"
            />
            {project.badge && (
              <span className="project__badge">
                <Icon name="camera" size={13} strokeWidth={2} />
                {project.badge}
              </span>
            )}
          </>
        ) : (
          <img src={img(project.img)} alt={project.title} width="1200" height="800" loading="lazy" decoding="async" />
        )}
      </div>
      <div className="project__meta">
        <span>{project.kind}</span>
        <span>·</span>
        <span>{project.place}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.text}</p>
      <a className="btn btn--sm btn--secondary btn--block" href="#contacto">
        Ver caso
      </a>
    </Reveal>
  );
}

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

      <div className={`projects__grid ${orden.length === 1 ? 'projects__grid--single' : ''}`}>
        {orden.map((p, i) => (
          <ProjectCard key={p.title} project={p} delay={i * 110} />
        ))}
      </div>
    </section>
  );
}

