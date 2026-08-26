import Reveal from './Reveal';
import { gallery } from '../data/site';
import { img } from '../assets/images';

export default function Gallery() {
  return (
    <section id="galeria" className="section">
      <Reveal>
        <div className="eyebrow">{gallery.eyebrow}</div>
        <h2 className="h2">{gallery.title}</h2>
      </Reveal>

      <div className="gallery">
        {gallery.items.map((g, i) => (
          <Reveal
            key={g.img}
            delay={(i % 3) * 70}
            className="card card--lift gallery__item"
            style={{ gridRow: `span ${g.span}` }}
          >
            <div className="media">
              <img
                src={img(g.img)}
                alt={g.alt}
                width={g.w}
                height={g.h}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
