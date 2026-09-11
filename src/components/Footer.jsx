import Icon from './Icon';
import { company, footer, sedes } from '../data/site';
import { lockupDark, lockupLight } from '../assets/images';

export default function Footer({ theme }) {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <img
            src={theme === 'dark' ? lockupDark : lockupLight}
            alt={company.name}
            width="480"
            height="226"
            loading="lazy"
          />
          <p className="footer__blurb">{company.tagline}</p>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4>Sedes</h4>
          <ul>
            {sedes.map((s) => (
              <li key={s.id}>{s.address}</li>
            ))}
            <li>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
          </ul>

          <h4 style={{ marginTop: '20px' }}>Redes Oficiales</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            {company.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GRENCO en ${s.name}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--sunk)',
                  boxShadow: 'var(--nuins)',
                  color: 'var(--ink)',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                }}
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__legal">
        <span>
          © {new Date().getFullYear()} {company.legal}
        </span>
        <span>Piura — Trujillo, Perú</span>
      </div>
    </footer>
  );
}
