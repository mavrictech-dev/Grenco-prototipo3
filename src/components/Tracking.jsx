import { useEffect, useState } from 'react';
import Icon from './Icon';
import Reveal from './Reveal';
import { useReveal } from '../hooks/useReveal';
import { tracking } from '../data/site';

/** Barras que crecen al entrar en viewport, compartidas por los dos mockups. */
function useBarras() {
  const rv = useReveal(0);
  const [llenas, setLlenas] = useState(false);

  useEffect(() => {
    if (!rv.shown) return;
    const t = setTimeout(() => setLlenas(true), 280);
    return () => clearTimeout(t);
  }, [rv.shown]);

  return { rv, llenas };
}

/** Maqueta de la app movil. El marco es CSS, no una imagen: escala solo. */
function Telefono({ llenas }) {
  const { kicker, title, status, bars, cuadrillas } = tracking.app;

  return (
    <div className="mock-tel">
      <div className="mock-tel__notch" aria-hidden="true" />
      <div className="mock-tel__pantalla">
        <div className="mock-tel__barra">
          <span>GRENCO Tracking</span>
          <span className="mock-tel__punto" aria-hidden="true" />
        </div>

        <div className="mock-tel__cuerpo">
          <div className="panel__kicker">{kicker}</div>
          <div className="mock-tel__obra">
            <b>{title}</b>
            <span className="chip chip--sm">{status}</span>
          </div>

          <ul className="bars bars--compact">
            {bars.map((bar, i) => (
              <li key={bar.label}>
                <div className="bar__head">
                  <span>{bar.label}</span>
                  <b>{bar.pct}%</b>
                </div>
                <div
                  className="bar__track"
                  role="progressbar"
                  aria-label={bar.label}
                  aria-valuenow={bar.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <i
                    className="bar__fill"
                    style={{ width: llenas ? `${bar.pct}%` : 0, transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="mock-tel__seccion">Cuadrillas de hoy</div>
          <ul className="mock-cuadrillas">
            {cuadrillas.map((c) => (
              <li key={c.nombre}>
                <span className="mock-cuadrillas__ini" aria-hidden="true">
                  {c.personas}
                </span>
                <span>
                  <b>{c.nombre}</b>
                  <em>{c.equipo}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Maqueta del panel web (portal del cliente). */
function Dashboard({ llenas, fotos }) {
  const { bars, tiles } = tracking.app;

  return (
    <div className="mock-web">
      <div className="mock-web__crom" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>grenco.pe/portal</span>
      </div>

      <div className="mock-web__cuerpo">
        <div className="minitiles">
          {tiles.map((t) => (
            <div key={t.label} className={t.accent ? 'minitile minitile--accent' : 'minitile'}>
              <b>{t.value}</b>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        <ul className="bars bars--compact" style={{ marginTop: 18 }}>
          {bars.slice(0, 2).map((bar, i) => (
            <li key={bar.label}>
              <div className="bar__head">
                <span>{bar.label}</span>
                <b>{bar.pct}%</b>
              </div>
              <div className="bar__track" aria-hidden="true">
                <i
                  className="bar__fill"
                  style={{ width: llenas ? `${bar.pct}%` : 0, transitionDelay: `${i * 140}ms` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mock-tel__seccion">Fotos de campo · hoy</div>
        <div className="mock-tira">
          {fotos.map((src, i) => (
            <span key={i} className="mock-tira__foto">
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Tracking({ fotos = [] }) {
  const { rv, llenas } = useBarras();

  return (
    <section id="tracking" className="section">
      <Reveal style={{ maxWidth: '62ch' }}>
        <div className="eyebrow">{tracking.eyebrow}</div>
        <div className="tracking__titulo">
          <h2 className="h2">{tracking.title}</h2>
          <span className="badge-pronto">{tracking.badge}</span>
        </div>
        <p className="lead">{tracking.text}</p>
      </Reveal>

      <div ref={rv.ref} className={`${rv.className} tracking__mocks`} style={rv.style}>
        <Telefono llenas={llenas} />
        <Dashboard llenas={llenas} fotos={fotos.slice(0, 5)} />
      </div>

      <div className="grid-auto tracking__features">
        {tracking.features.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} className="card tracking__feature">
            <div className="service__icon">
              <Icon name={f.icon} size={22} strokeWidth={1.5} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
