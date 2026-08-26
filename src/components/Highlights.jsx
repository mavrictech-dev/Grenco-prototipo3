import Icon from './Icon';
import Reveal from './Reveal';
import { highlights } from '../data/site';

/** Tres tarjetas que solapan el borde inferior del hero. */
export default function Highlights() {
  return (
    <section className="highlights">
      <div className="grid-auto">
        {highlights.map((item, i) => (
          <Reveal as="article" key={item.title} delay={i * 90} className="card card--lift highlight">
            <Icon name={item.icon} size={26} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
