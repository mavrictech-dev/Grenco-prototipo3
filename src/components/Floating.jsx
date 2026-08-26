import Icon, { WhatsappIcon } from './Icon';
import { company } from '../data/site';

/** Vuelve al inicio. Aparece con el mismo umbral que el CTA flotante. */
export function VolverArriba({ visible }) {
  return (
    <button
      type="button"
      className={visible ? 'arriba is-on' : 'arriba'}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon name="arrowUp" size={19} strokeWidth={1.9} />
    </button>
  );
}

/** Barra de llamada a la accion que aparece pasado el hero. */
export function StickyCta({ visible }) {
  return (
    <div className={visible ? 'stickycta is-on' : 'stickycta'} aria-hidden={!visible}>
      <div className="stickycta__inner">
        <span className="hide-sm">¿Tienes un terreno por mover?</span>
        <a className="btn btn--primary" href="#contacto" tabIndex={visible ? 0 : -1}>
          Cotizar obra
        </a>
      </div>
    </div>
  );
}

export function WhatsappFab() {
  return (
    <a
      className="wa"
      href={`https://wa.me/${company.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
    >
      <span className="wa__pulse" />
      <WhatsappIcon />
      <span className="wa__tip">Escríbenos por WhatsApp</span>
    </a>
  );
}
