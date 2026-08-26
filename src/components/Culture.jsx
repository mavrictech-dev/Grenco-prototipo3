import Reveal from './Reveal';
import { culture } from '../data/site';
import { img } from '../assets/images';

export default function Culture() {
  return (
    <section className="section">
      <Reveal>
        <div className="eyebrow">{culture.eyebrow}</div>
        <h2 className="h2">{culture.title}</h2>
      </Reveal>

      <div className="culture__grid">
        {culture.people.map((p, i) => (
          <Reveal
            as="figure"
            key={p.name}
            delay={i * 80}
            className="card card--lift culture__card"
          >
            <div className="media">
              <img src={img(p.img)} alt={p.name} width="800" height="800" loading="lazy" decoding="async" />
            </div>
            <figcaption className="culture__cap">
              <b>{p.name}</b>
              <span>{p.role}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>

      <div className="values">
        {culture.values.map((v, i) => (
          <Reveal key={v.title} delay={i * 90} className="value">
            <h4>{v.title}</h4>
            <p>{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
