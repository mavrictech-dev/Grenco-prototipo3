import { useRef } from 'react';
import Icon from './Icon';
import Reveal from './Reveal';
import { services } from '../data/site';

function ServiceCard({ item, delay }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Reveal
      as="article"
      delay={delay}
      className="card card--lift service"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => {
        const v = videoRef.current;
        if (v) {
          if (v.paused) v.play().catch(() => {});
          else v.pause();
        }
      }}
    >
      {item.video && (
        <div className="service__thumb">
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="service__video"
          />
          <div className="service__badge">
            <Icon name={item.icon} size={19} strokeWidth={1.8} />
          </div>
        </div>
      )}

      <div className="service__body">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="servicios" className="section">
      <Reveal style={{ maxWidth: '60ch' }}>
        <div className="eyebrow">{services.eyebrow}</div>
        <h2 className="h2">{services.title}</h2>
      </Reveal>

      <div className="grid-auto services__grid">
        {services.items.map((item, i) => (
          <ServiceCard key={item.title} item={item} delay={(i % 3) * 80} />
        ))}
      </div>
    </section>
  );
}
