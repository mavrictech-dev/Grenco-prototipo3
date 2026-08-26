import Reveal from './Reveal';
import ContactForm from './ContactForm';
import { contact, sedes } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';

export default function Contact({ sede }) {
  const texto = contenidoDeSede(sede).contact;

  return (
    <section id="contacto" className="section">
      <div className="contact__grid">
        <Reveal>
          <div className="eyebrow">{contact.eyebrow}</div>
          <h2 className="h2">{texto.title}</h2>
          <p className="lead" style={{ maxWidth: '52ch' }}>
            {texto.text}
          </p>

          <div className="sedes">
            {sedes.map((s) => (
              <div key={s.id} className={s.id === sede ? 'sede is-active' : 'sede'}>
                <div className="sede__head">
                  <h3>{s.name}</h3>
                  {s.principal && <span className="sede__badge">Principal</span>}
                </div>
                <p>
                  {s.address}
                  <br />
                  {s.hours}
                </p>
                <div className="sede__links">
                  <a href={`tel:${s.tel}`}>{s.phone}</a>
                  <a href={`mailto:${s.email}`}>{s.email}</a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm sede={sede} />
        </Reveal>
      </div>
    </section>
  );
}
