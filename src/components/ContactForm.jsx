import { useState } from 'react';
import Icon from './Icon';
import { company, contact, sedes } from '../data/site';

/**
 * Formulario de contacto real.
 *
 * Envia por POST a VITE_FORM_ENDPOINT (Formspree, Web3Forms, Basin o una
 * funcion propia: cualquiera que acepte JSON). Si esa variable no esta puesta
 * cae a un mailto prellenado, para que el formulario nunca sea decorativo.
 * En el export original el submit solo mostraba el mensaje de exito y tiraba
 * los datos.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY || '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'Dinos cómo te llamas.';
  if (!values.email.trim()) errors.email = 'Necesitamos un correo para responderte.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Ese correo no parece válido.';
  if (values.mensaje.trim().length < 10)
    errors.mensaje = 'Cuéntanos algo más: ubicación y alcance aproximado.';
  return errors;
}

const EMPTY = {
  nombre: '',
  email: '',
  telefono: '',
  servicio: contact.serviceOptions[0],
  mensaje: '',
};

export default function ContactForm({ sede }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;

    // Trampa antispam: si un bot rellena el campo oculto, fingimos exito y no
    // enviamos nada. Asi no aprende que fue detectado.
    if (e.target.elements.empresa?.value) {
      setStatus('ok');
      setValues(EMPTY);
      return;
    }

    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    const payload = {
      ...values,
      sede: sedes.find((s) => s.id === sede)?.name ?? sede,
      origen: company.url,
      _subject: `Nueva solicitud de cotización — ${values.nombre}`,
    };

    if (!ENDPOINT) {
      // Sin endpoint configurado: abrimos el cliente de correo con todo puesto.
      const body = [
        `Nombre: ${payload.nombre}`,
        `Correo: ${payload.email}`,
        `Teléfono: ${payload.telefono || '—'}`,
        `Servicio: ${payload.servicio}`,
        `Sede: ${payload.sede}`,
        '',
        payload.mensaje,
      ].join('\n');
      window.location.href =
        `mailto:${company.email}?subject=${encodeURIComponent(payload._subject)}` +
        `&body=${encodeURIComponent(body)}`;
      setStatus('ok');
      setValues(EMPTY);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(ACCESS_KEY ? { access_key: ACCESS_KEY, ...payload } : payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('ok');
      setValues(EMPTY);
      setErrors({});
    } catch (err) {
      if (import.meta.env.DEV) console.error('[contacto] fallo el envio:', err);
      setStatus('error');
    }
  }

  const fieldClass = (name) => (errors[name] ? 'field field--invalid' : 'field');

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__stack">
        <div className={fieldClass('nombre')}>
          <input
            id="f-nombre"
            name="nombre"
            type="text"
            placeholder=" "
            autoComplete="name"
            value={values.nombre}
            onChange={set('nombre')}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? 'err-nombre' : undefined}
          />
          <label htmlFor="f-nombre">Nombre y apellido</label>
          {errors.nombre && (
            <span className="field__error" id="err-nombre">
              {errors.nombre}
            </span>
          )}
        </div>

        <div className="form__row">
          <div className={fieldClass('email')}>
            <input
              id="f-mail"
              name="email"
              type="email"
              placeholder=" "
              autoComplete="email"
              value={values.email}
              onChange={set('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-mail' : undefined}
            />
            <label htmlFor="f-mail">Correo</label>
            {errors.email && (
              <span className="field__error" id="err-mail">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <input
              id="f-tel"
              name="telefono"
              type="tel"
              placeholder=" "
              autoComplete="tel"
              value={values.telefono}
              onChange={set('telefono')}
            />
            <label htmlFor="f-tel">Teléfono</label>
          </div>
        </div>

        <div className="select">
          <select
            name="servicio"
            aria-label="Servicio requerido"
            value={values.servicio}
            onChange={set('servicio')}
          >
            {contact.serviceOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <Icon name="chevron" size={16} strokeWidth={2} className="select__chevron" />
        </div>

        <div className={fieldClass('mensaje')}>
          <textarea
            id="f-msg"
            name="mensaje"
            rows="4"
            placeholder=" "
            value={values.mensaje}
            onChange={set('mensaje')}
            aria-invalid={!!errors.mensaje}
            aria-describedby={errors.mensaje ? 'err-msg' : undefined}
          />
          <label htmlFor="f-msg">Ubicación y alcance de la obra</label>
          {errors.mensaje && (
            <span className="field__error" id="err-msg">
              {errors.mensaje}
            </span>
          )}
        </div>

        {/* Campo trampa: oculto por CSS, sin tabindex y fuera del lector. */}
        <input
          className="hp"
          type="text"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
        </button>

        {status === 'ok' && (
          <p className="notice notice--ok" role="status">
            <Icon name="check" size={18} strokeWidth={2} />
            Solicitud registrada. Te escribimos dentro de 24 horas hábiles.
          </p>
        )}

        {status === 'error' && (
          <p className="notice notice--err" role="alert">
            <Icon name="alert" size={18} strokeWidth={2} />
            No pudimos enviar la solicitud. Escríbenos a {company.email} o por WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
