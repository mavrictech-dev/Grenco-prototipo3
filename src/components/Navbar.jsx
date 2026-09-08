import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { nav, sedes } from '../data/site';
import { lockupDark, lockupLight } from '../assets/images';

/**
 * Barra flotante responsive.
 * En escritorio: logo, enlaces y selector en una fila compacta.
 * En móvil: cabecera delgada con logo, selector y botón hamburguesa;
 * al pulsar despliega un menú neumórfico suave con los enlaces y botón de cotizar.
 */
export default function Navbar({ hidden, theme, sede, setSede, seccionActiva }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navRef = useRef(null);

  // Cerrar menú si el usuario hace scroll hacia abajo y la barra se oculta
  useEffect(() => {
    if (hidden && menuAbierto) {
      setMenuAbierto(false);
    }
  }, [hidden, menuAbierto]);

  // Cerrar menú con la tecla Escape o click fuera
  useEffect(() => {
    if (!menuAbierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuAbierto]);

  return (
    <div className={hidden ? 'navwrap is-hidden' : 'navwrap'} ref={navRef}>
      <nav className={`nav ${menuAbierto ? 'is-menu-open' : ''}`} aria-label="Principal">
        <a className="nav__logo" href="#inicio" onClick={() => setMenuAbierto(false)}>
          <img
            src={theme === 'dark' ? lockupDark : lockupLight}
            alt="GRENCO — Grupo Enriquez Construcciones"
            width="480"
            height="226"
            fetchPriority="high"
          />
        </a>

        {/* Enlaces para pantalla mediana / grande */}
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
              onChange={(e) => {
                setSede(e.target.value);
                setMenuAbierto(false);
              }}
            >
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={15} strokeWidth={2} className="select__chevron" />
          </div>

          <a className="btn btn--sm btn--primary hide-sm" href="#contacto">
            Cotizar obra
          </a>

          {/* Botón hamburguesa exclusivo para móvil */}
          <button
            type="button"
            className={`nav__toggle ${menuAbierto ? 'is-active' : ''}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            <Icon name={menuAbierto ? 'x' : 'menu'} size={20} strokeWidth={2} />
          </button>
        </div>
      </nav>

      {/* Menú desplegable neumórfico para móvil */}
      <div
        className={`nav__mobile ${menuAbierto ? 'is-open' : ''}`}
        aria-hidden={!menuAbierto}
      >
        <ul className="nav__mobile-links">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={seccionActiva === item.id ? 'is-current' : ''}
                aria-current={seccionActiva === item.id ? 'page' : undefined}
                onClick={() => setMenuAbierto(false)}
              >
                <span>{item.label}</span>
                <span className="nav__mobile-indicator" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__mobile-footer">
          <a
            className="btn btn--primary nav__mobile-cta"
            href="#contacto"
            onClick={() => setMenuAbierto(false)}
          >
            Cotizar obra
          </a>
        </div>
      </div>
    </div>
  );
}
