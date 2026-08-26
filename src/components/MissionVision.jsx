import { useState } from 'react';
import Reveal from './Reveal';
import { missionVision } from '../data/site';

const KEYS = ['mision', 'vision'];

/** Control segmentado Misión / Visión. */
export default function MissionVision() {
  const [active, setActive] = useState('mision');
  const data = missionVision[active];

  return (
    <section className="section">
      <Reveal>
        <div className="segment" role="tablist" aria-label="Misión y visión">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={active === key}
              aria-controls={`panel-${key}`}
              onClick={() => setActive(key)}
            >
              {missionVision[key].label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mv">
        <Reveal id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
          <p className="mv__title">{data.title}</p>
          <p className="mv__body">{data.body}</p>
        </Reveal>

        <Reveal as="ul" delay={90} className="pillars">
          {data.pillars.map((text, i) => (
            <li key={text}>
              <i>{String(i + 1).padStart(2, '0')}</i>
              <span>{text}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
