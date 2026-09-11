import { useState, useEffect, useCallback, useMemo } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { gallery, company } from '../data/site';
import { img } from '../assets/images';

export default function Gallery() {
  const [filtro, setFiltro] = useState('Todas');
  const [indiceLightbox, setIndiceLightbox] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const categorias = gallery.categories || ['Todas', 'Topografía', 'Maquinaria', 'Obras viales', 'Edificaciones', 'Grenco Soldadura'];

  const itemsFiltrados = useMemo(() => {
    if (filtro === 'Todas') return gallery.items;
    return gallery.items.filter((item) => item.tag === filtro);
  }, [filtro]);

  // Si está en "Todas" y no ha expandido, solo muestra las primeras 6 fotos para ahorrar espacio
  const itemsAMostrar = useMemo(() => {
    if (filtro === 'Todas' && !mostrarTodas) {
      return itemsFiltrados.slice(0, 6);
    }
    return itemsFiltrados;
  }, [filtro, mostrarTodas, itemsFiltrados]);

  const abrirLightbox = (idx) => {
    setIndiceLightbox(idx);
  };

  const cerrarLightbox = useCallback(() => {
    setIndiceLightbox(null);
  }, []);

  const fotoAnterior = useCallback(() => {
    if (itemsAMostrar.length === 0) return;
    setIndiceLightbox((prev) => (prev > 0 ? prev - 1 : itemsAMostrar.length - 1));
  }, [itemsAMostrar.length]);

  const fotoSiguiente = useCallback(() => {
    if (itemsAMostrar.length === 0) return;
    setIndiceLightbox((prev) => (prev < itemsAMostrar.length - 1 ? prev + 1 : 0));
  }, [itemsAMostrar.length]);

  // Teclado para lightbox y bloqueo absoluto de scroll y cursor de fondo
  useEffect(() => {
    if (indiceLightbox === null) return;

    // Bloquear scroll de fondo y cursor en body y html
    const scrollOriginalBody = document.body.style.overflow;
    const scrollOriginalHtml = document.documentElement.style.overflow;
    const touchOriginal = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') cerrarLightbox();
      else if (e.key === 'ArrowLeft') fotoAnterior();
      else if (e.key === 'ArrowRight') fotoSiguiente();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = scrollOriginalBody;
      document.documentElement.style.overflow = scrollOriginalHtml;
      document.body.style.touchAction = touchOriginal;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [indiceLightbox, cerrarLightbox, fotoAnterior, fotoSiguiente]);

  const itemActivo = indiceLightbox !== null ? itemsAMostrar[indiceLightbox] : null;

  return (
    <section id="galeria" className="section">
      <Reveal className="headrow">
        <div>
          <div className="eyebrow">{gallery.eyebrow}</div>
          <h2 className="h2">{gallery.title}</h2>
          <p className="lead" style={{ marginTop: '12px', maxWidth: '60ch' }}>
            {gallery.text}
          </p>
        </div>

        {/* Botones de acceso directo a redes sociales oficiales */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
          aria-label="Redes sociales oficiales de GRENCO"
        >
          {company.socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--sm btn--secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              aria-label={`Visitar canal oficial de GRENCO en ${s.name}`}
            >
              <Icon name={s.icon} size={16} />
              <span>{s.name}</span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* Barra de filtros por categoría */}
      <Reveal className="gallery__filters" role="group" aria-label="Filtrar galería por categoría">
        {categorias.map((cat) => {
          const isActive = filtro === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`gallery__filter-btn ${isActive ? 'is-active' : ''}`}
              aria-pressed={isActive}
              onClick={() => {
                setFiltro(cat);
                setIndiceLightbox(null);
                setMostrarTodas(false);
              }}
            >
              {cat}
            </button>
          );
        })}
      </Reveal>

      {/* Cuadrícula de fotos adaptativa según cantidad de resultados */}
      {(() => {
        const total = itemsAMostrar.length;
        const isSingle = total === 1;
        const isDouble = total === 2;
        const singleIsPortrait = isSingle && itemsAMostrar[0].w < itemsAMostrar[0].h;

        const galleryClass = [
          'gallery',
          isSingle ? `gallery--single ${singleIsPortrait ? 'is-portrait' : 'is-landscape'}` : '',
          isDouble ? 'gallery--double' : '',
          total >= 3 ? 'gallery--multi' : '',
        ].filter(Boolean).join(' ');

        return (
          <div className={galleryClass}>
            {itemsAMostrar.map((g, i) => (
              <Reveal
                key={`${g.img}-${filtro}`}
                delay={(i % 3) * 60}
                className="card card--lift gallery__item"
                style={total >= 3 ? { gridRow: `span ${g.span}` } : undefined}
                onClick={() => abrirLightbox(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrirLightbox(i);
                  }
                }}
                aria-label={`Ampliar imagen: ${g.alt}`}
              >
                <div className="media">
                  <img
                    src={img(g.img)}
                    alt={g.alt}
                    width={g.w}
                    height={g.h}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Icono indicador de ampliación al pasar el cursor */}
                <div className="gallery__zoom-hint" aria-hidden="true">
                  <Icon name="camera" size={18} strokeWidth={1.8} />
                </div>

                {g.tag && (
                  <span
                    className="tag"
                    style={{
                      position: 'absolute',
                      bottom: '22px',
                      left: '22px',
                      zIndex: 2,
                      backdropFilter: 'blur(8px)',
                      background: 'rgba(15, 23, 42, 0.78)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                    }}
                  >
                    {g.tag}
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        );
      })()}

      {/* Botón neumórfico con relieve para ver más fotos */}
      {filtro === 'Todas' && itemsFiltrados.length > 6 && (
        <Reveal className="gallery__more-wrap">
          <button
            type="button"
            className="btn-neumorph-relief"
            onClick={() => setMostrarTodas((prev) => !prev)}
            aria-expanded={mostrarTodas}
          >
            <Icon name={mostrarTodas ? 'chevronUp' : 'chevronDown'} size={18} strokeWidth={2.4} />
            <span>{mostrarTodas ? 'Ver menos fotos' : 'Ver más fotos'}</span>
          </button>
        </Reveal>
      )}

      {/* Visor modal / Lightbox interactivo con animación suave y navegación */}
      {itemActivo && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de fotos de obra GRENCO"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="lightbox__backdrop" onClick={cerrarLightbox} aria-hidden="true" />

          <div className="lightbox__dialog">
            {/* Barra superior con metadatos y botón cerrar */}
            <div className="lightbox__top">
              <div className="lightbox__meta">
                <span className="tag" style={{ background: 'var(--brand)', color: '#111', fontWeight: 700 }}>
                  {itemActivo.tag}
                </span>
                <span className="lightbox__count">
                  {String(indiceLightbox + 1).padStart(2, '0')} / {String(itemsFiltrados.length).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                className="lightbox__close"
                onClick={cerrarLightbox}
                aria-label="Cerrar visor"
              >
                <Icon name="x" size={22} strokeWidth={2} />
              </button>
            </div>

            {/* Marco de imagen y botones de navegación lateral */}
            <div className="lightbox__frame">
              {itemsFiltrados.length > 1 && (
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    fotoAnterior();
                  }}
                  aria-label="Foto anterior"
                >
                  <Icon name="chevronLeft" size={24} strokeWidth={2.4} />
                </button>
              )}

              <img
                key={itemActivo.img}
                src={img(itemActivo.img)}
                alt={itemActivo.alt}
                className="lightbox__image"
              />

              {itemsFiltrados.length > 1 && (
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    fotoSiguiente();
                  }}
                  aria-label="Siguiente foto"
                >
                  <Icon name="chevronRight" size={24} strokeWidth={2.4} />
                </button>
              )}
            </div>

            {/* Pie con descripción de la toma */}
            <div className="lightbox__caption">
              {itemActivo.alt}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
