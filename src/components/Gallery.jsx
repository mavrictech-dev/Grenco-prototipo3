import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { gallery, company } from '../data/site';
import { img } from '../assets/images';

export default function Gallery() {
  const [filtro, setFiltro] = useState('Todas');
  const [indiceLightbox, setIndiceLightbox] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // Estados de Zoom interactivo en Lightbox
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const frameRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, moved: false, active: false });
  const lastTouchDistanceRef = useRef(null);
  const lastTapRef = useRef(0);

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

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    if (dragStartRef.current) {
      dragStartRef.current.active = false;
      dragStartRef.current.moved = false;
    }
  }, []);

  const abrirLightbox = (idx) => {
    resetZoom();
    setIndiceLightbox(idx);
  };

  const cerrarLightbox = useCallback(() => {
    resetZoom();
    setIndiceLightbox(null);
  }, [resetZoom]);

  const fotoAnterior = useCallback(() => {
    if (itemsAMostrar.length === 0) return;
    resetZoom();
    setIndiceLightbox((prev) => (prev > 0 ? prev - 1 : itemsAMostrar.length - 1));
  }, [itemsAMostrar.length, resetZoom]);

  const fotoSiguiente = useCallback(() => {
    if (itemsAMostrar.length === 0) return;
    resetZoom();
    setIndiceLightbox((prev) => (prev < itemsAMostrar.length - 1 ? prev + 1 : 0));
  }, [itemsAMostrar.length, resetZoom]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(4, +(prev + 0.5).toFixed(2)));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(1, +(prev - 0.5).toFixed(2));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleZoom = useCallback((clientX, clientY) => {
    setZoom((prev) => {
      if (prev > 1) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      const targetZoom = 2.4;
      if (frameRef.current && clientX !== undefined && clientY !== undefined) {
        const rect = frameRef.current.getBoundingClientRect();
        const offsetX = clientX - (rect.left + rect.width / 2);
        const offsetY = clientY - (rect.top + rect.height / 2);
        const targetPanX = -offsetX * (targetZoom - 1);
        const targetPanY = -offsetY * (targetZoom - 1);
        const maxPanX = Math.max(0, (rect.width * (targetZoom - 1)) / 2);
        const maxPanY = Math.max(0, (rect.height * (targetZoom - 1)) / 2);
        setPan({
          x: Math.min(maxPanX, Math.max(-maxPanX, targetPanX)),
          y: Math.min(maxPanY, Math.max(-maxPanY, targetPanY)),
        });
      }
      return targetZoom;
    });
  }, []);

  // Zoom con rueda de ratón (wheel event no-pasivo en el marco para evitar interferencias)
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || indiceLightbox === null) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? 0.35 : -0.35;
      setZoom((prev) => {
        const next = Math.min(4, Math.max(1, +(prev + delta).toFixed(2)));
        if (next === 1) {
          setPan({ x: 0, y: 0 });
        }
        return next;
      });
    };

    frame.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      frame.removeEventListener('wheel', handleWheel);
    };
  }, [indiceLightbox]);

  // Arrastre (Pan) con Mouse cuando zoom > 1
  const handleMouseDown = (e) => {
    if (e.button !== 0 || zoom <= 1) return;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
      active: true,
    };
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragStartRef.current.active || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 3) {
      dragStartRef.current.moved = true;
    }
    const rect = frameRef.current?.getBoundingClientRect();
    const maxPanX = rect ? Math.max(0, (rect.width * (zoom - 1)) / 2 + 50) : 400;
    const maxPanY = rect ? Math.max(0, (rect.height * (zoom - 1)) / 2 + 50) : 300;

    setPan({
      x: Math.min(maxPanX, Math.max(-maxPanX, dragStartRef.current.panX + dx)),
      y: Math.min(maxPanY, Math.max(-maxPanY, dragStartRef.current.panY + dy)),
    });
  }, [zoom]);

  const handleMouseUp = useCallback(() => {
    if (dragStartRef.current.active) {
      dragStartRef.current.active = false;
      setIsDragging(false);
    }
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Gestos táctiles: Pinch-to-zoom y pan en móviles
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistanceRef.current = dist;
      dragStartRef.current.active = false;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        e.preventDefault();
        toggleZoom(e.touches[0].clientX, e.touches[0].clientY);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      if (zoom > 1) {
        dragStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          panX: pan.x,
          panY: pan.y,
          moved: false,
          active: true,
        };
        setIsDragging(true);
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistanceRef.current) {
      e.preventDefault();
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = newDist / lastTouchDistanceRef.current;
      lastTouchDistanceRef.current = newDist;
      setZoom((prev) => {
        const next = Math.min(4, Math.max(1, +(prev * factor).toFixed(2)));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    } else if (e.touches.length === 1 && dragStartRef.current.active && zoom > 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      dragStartRef.current.moved = true;
      const rect = frameRef.current?.getBoundingClientRect();
      const maxPanX = rect ? Math.max(0, (rect.width * (zoom - 1)) / 2 + 50) : 400;
      const maxPanY = rect ? Math.max(0, (rect.height * (zoom - 1)) / 2 + 50) : 300;

      setPan({
        x: Math.min(maxPanX, Math.max(-maxPanX, dragStartRef.current.panX + dx)),
        y: Math.min(maxPanY, Math.max(-maxPanY, dragStartRef.current.panY + dy)),
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistanceRef.current = null;
    dragStartRef.current.active = false;
    setIsDragging(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (dragStartRef.current.moved) {
      dragStartRef.current.moved = false;
      return;
    }
    toggleZoom(e.clientX, e.clientY);
  };

  // Teclado para lightbox, controles de zoom y bloqueo de scroll
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
      if (e.key === 'Escape') {
        if (zoom > 1) resetZoom();
        else cerrarLightbox();
      } else if (e.key === 'ArrowLeft' && zoom <= 1) {
        fotoAnterior();
      } else if (e.key === 'ArrowRight' && zoom <= 1) {
        fotoSiguiente();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = scrollOriginalBody;
      document.documentElement.style.overflow = scrollOriginalHtml;
      document.body.style.touchAction = touchOriginal;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [indiceLightbox, cerrarLightbox, fotoAnterior, fotoSiguiente, zoom, resetZoom, zoomIn, zoomOut]);

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
            {/* Barra superior con metadatos, controles de zoom y botón cerrar */}
            <div className="lightbox__top">
              <div className="lightbox__meta">
                <span className="tag" style={{ background: 'var(--brand)', color: '#111', fontWeight: 700 }}>
                  {itemActivo.tag}
                </span>
                <span className="lightbox__count">
                  {String(indiceLightbox + 1).padStart(2, '0')} / {String(itemsFiltrados.length).padStart(2, '0')}
                </span>
              </div>

              {/* Barra neumórfica de aumento (Zoom Controls) */}
              <div className="lightbox__zoom-bar" role="toolbar" aria-label="Controles de zoom">
                <button
                  type="button"
                  className="lightbox__zoom-btn"
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  title="Alejar (-)"
                  aria-label="Alejar foto"
                >
                  <Icon name="zoomOut" size={17} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  className={`lightbox__zoom-badge ${zoom > 1 ? 'is-active' : ''}`}
                  onClick={() => (zoom > 1 ? resetZoom() : toggleZoom())}
                  title="Restablecer o alternar aumento (0)"
                  aria-label={`Aumento actual: ${Math.round(zoom * 100)}%`}
                >
                  {Math.round(zoom * 100)}%
                </button>

                <button
                  type="button"
                  className="lightbox__zoom-btn"
                  onClick={zoomIn}
                  disabled={zoom >= 4}
                  title="Acercar (+)"
                  aria-label="Acercar foto"
                >
                  <Icon name="zoomIn" size={17} strokeWidth={2.2} />
                </button>

                {zoom > 1 && (
                  <button
                    type="button"
                    className="lightbox__zoom-btn lightbox__zoom-btn--reset"
                    onClick={resetZoom}
                    title="Restablecer tamaño original (Esc o 0)"
                    aria-label="Restablecer zoom al 100%"
                  >
                    <Icon name="rotateCcw" size={15} strokeWidth={2.2} />
                  </button>
                )}
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

            {/* Marco de imagen con soporte interactivo de zoom, arrastre y gestos táctiles */}
            <div
              ref={frameRef}
              className={`lightbox__frame ${zoom > 1 ? 'lightbox__frame--zoomed' : ''}`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {itemsFiltrados.length > 1 && zoom <= 1 && (
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
                className={`lightbox__image ${isDragging ? 'is-dragging' : ''}`}
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                }}
                onClick={handleImageClick}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  toggleZoom(e.clientX, e.clientY);
                }}
                draggable={false}
              />

              {itemsFiltrados.length > 1 && zoom <= 1 && (
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

              {/* Píldora de ayuda interactiva */}
              <div className="lightbox__zoom-hint">
                {zoom > 1 ? 'Arrastra para explorar • Clic para restablecer' : 'Clic o rueda del mouse para hacer zoom'}
              </div>
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
