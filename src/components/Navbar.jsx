import Icon from './Icon';
import { nav, sedes } from '../data/site';
import { lockupDark, lockupLight } from '../assets/images';

/**
 * Barra flotante. Se auto-oculta al bajar y reaparece al subir.
 *
 * El logotipo se elige en JS en vez de alternar dos <img> con display:none,
 * que es lo que hacia el original: asi solo se descarga el que se ve.
 */
export default function Navbar({ hidden, theme, toggleTheme, sede, setSede, seccionActiva }) {
  return (
    <div className={hidden ? 'navwrap is-hidden' : 'navwrap'}>
      <nav className="nav" aria-label="Principal">
        <a className="nav__logo" href="#inicio">
          <img
            src={theme === 'dark' ? lockupDark : lockupLight}
            alt="GRENCO — Grupo Enriquez Construcciones"
            width="480"
            height="226"
            fetchPriority="high"
          />
        </a>

        <ul className="nav__links">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={seccionActiva === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <div className="select">
            <select
              aria-label="Elegir sede"
              value={sede}
              onChange={(e) => setSede(e.target.value)}
            >
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={15} strokeWidth={2} className="select__chevron" />
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} strokeWidth={1.8} />
          </button>

          <a className="btn btn--sm btn--primary hide-sm" href="#contacto">
            Cotizar obra
          </a>
        </div>
      </nav>
    </div>
  );
}
