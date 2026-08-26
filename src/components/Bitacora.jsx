import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import { getPosts, formatearFecha } from '../data/bitacora';
import { fotoObra, fotosObra } from '../assets/images';
import { sedes } from '../data/site';

/**
 * Feed de actualizaciones de obra.
 *
 * Consume `getPosts()`, que es asincrona, para que cambiar los datos locales
 * por un CMS o una API no toque este componente. Por eso hay estados de carga,
 * vacio y error aunque hoy la promesa resuelva al instante: si se enchufa un
 * fetch de verdad, ya estan cubiertos.
 */

const POR_PAGINA = 3;

/** Si a un post le falta la foto, se le asigna una del banco de forma estable
 *  (mismo post -> misma foto) para que el feed nunca muestre un hueco. */
function fotoDe(post, indice) {
  const propia = fotoObra(post.foto);
  if (propia) return propia;
  if (!fotosObra.length) return null;
  return fotosObra[indice % fotosObra.length].url;
}

export default function Bitacora() {
  const [estado, setEstado] = useState('cargando'); // cargando | listo | error
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [visibles, setVisibles] = useState(POR_PAGINA);

  useEffect(() => {
    let vigente = true;
    getPosts()
      .then((data) => {
        if (!vigente) return;
        setPosts(data);
        setEstado('listo');
      })
      .catch((e) => {
        if (!vigente) return;
        if (import.meta.env.DEV) console.error('[bitacora] no se pudo cargar el feed:', e);
        setEstado('error');
      });
    // Evita el aviso de "setState en componente desmontado" si el fetch tarda
    // mas de lo que dura la visita a la seccion.
    return () => {
      vigente = false;
    };
  }, []);

  const filtrados = useMemo(
    () => (filtro === 'todas' ? posts : posts.filter((p) => p.sede === filtro)),
    [posts, filtro]
  );

  // Al cambiar de filtro se vuelve a la primera pagina: si no, un filtro con
  // menos resultados que la pagina actual se veria vacio.
  function cambiarFiltro(valor) {
    setFiltro(valor);
    setVisibles(POR_PAGINA);
  }

  return (
    <section id="bitacora" className="section">
      <Reveal className="headrow">
        <div>
          <div className="eyebrow">Bitácora de obra</div>
          <h2 className="h2">Lo que pasó esta semana en campo.</h2>
        </div>

        <div className="segment" role="group" aria-label="Filtrar por sede">
          <button
            type="button"
            aria-pressed={filtro === 'todas'}
            aria-selected={filtro === 'todas'}
            onClick={() => cambiarFiltro('todas')}
          >
            Todas
          </button>
          {sedes.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={filtro === s.id}
              aria-selected={filtro === s.id}
              onClick={() => cambiarFiltro(s.id)}
            >
              {s.id}
            </button>
          ))}
        </div>
      </Reveal>

      {estado === 'cargando' && (
        <div className="feed" aria-busy="true">
          {Array.from({ length: POR_PAGINA }, (_, i) => (
            <div key={i} className="card post post--esqueleto" aria-hidden="true">
              <div className="post__foto" />
              <div className="post__cuerpo">
                <span className="esq esq--corta" />
                <span className="esq esq--titulo" />
                <span className="esq" />
                <span className="esq esq--corta" />
              </div>
            </div>
          ))}
          <p className="sr-only">Cargando la bitácora…</p>
        </div>
      )}

      {estado === 'error' && (
        <p className="notice notice--err" role="alert" style={{ marginTop: 32 }}>
          No pudimos cargar la bitácora. Vuelve a intentarlo en un momento.
        </p>
      )}

      {estado === 'listo' && filtrados.length === 0 && (
        <p className="notice" style={{ marginTop: 32 }}>
          Todavía no hay entradas para esta sede.
        </p>
      )}

      {estado === 'listo' && filtrados.length > 0 && (
        <>
          <div className="feed">
            {filtrados.slice(0, visibles).map((post, i) => {
              const foto = fotoDe(post, i);
              return (
                <Reveal
                  as="article"
                  key={post.id}
                  delay={(i % 3) * 90}
                  className="card card--lift post"
                >
                  {foto && (
                    <div className="post__foto">
                      <img
                        src={foto}
                        alt={post.titulo}
                        width="1200"
                        height="900"
                        loading="lazy"
                        decoding="async"
                      />
                      <time className="post__fecha" dateTime={post.fecha}>
                        {formatearFecha(post.fecha)}
                      </time>
                    </div>
                  )}

                  <div className="post__cuerpo">
                    <div className="post__meta">
                      <span>{post.lugar}</span>
                    </div>
                    <h3>{post.titulo}</h3>
                    <p>{post.resumen}</p>
                    <ul className="post__tags">
                      {post.etiquetas.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {visibles < filtrados.length && (
            <div className="feed__mas">
              <button
                type="button"
                className="btn btn--sm btn--secondary"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
              >
                Ver más entradas ({filtrados.length - visibles})
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
