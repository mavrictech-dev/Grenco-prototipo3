import Icon from './Icon';
import Reveal from './Reveal';
import { services } from '../data/site';

export default function Services() {
  return (
    <section id="servicios" className="section">
      <Reveal style={{ maxWidth: '60ch' }}>
        <div className="eyebrow">{services.eyebrow}</div>
        <h2 className="h2">{services.title}</h2>
      </Reveal>

      <div className="grid-auto services__grid">
        {services.items.map((item, i) => (
          <Reveal
            as="article"
            key={item.title}
            delay={(i % 3) * 80}
            className="card card--lift service"
          >
            <div className="service__icon">
              <Icon name={item.icon} size={24} strokeWidth={1.5} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
