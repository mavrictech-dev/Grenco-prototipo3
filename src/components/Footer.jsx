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
