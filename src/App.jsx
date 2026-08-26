import { useEffect, useLayoutEffect, useMemo } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Manifiesto from './components/Manifiesto';
import About from './components/About';
import Tracking from './components/Tracking';
import Services from './components/Services';
import Machinery from './components/Machinery';
import MissionVision from './components/MissionVision';
import Culture from './components/Culture';
import Projects from './components/Projects';
import Bitacora from './components/Bitacora';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { StickyCta, WhatsappFab, VolverArriba } from './components/Floating';

import { useSettings } from './hooks/useSettings';
import { useScrollFx } from './hooks/useScrollFx';
import { useScrollSpy } from './hooks/useScrollSpy';
import { nav } from './data/site';
import { fotosObra, mark } from './assets/images';

export default function App() {
  const { theme, toggleTheme, sede, setSede } = useSettings();
  const { navHidden, pastHero, progreso } = useScrollFx();

  const ids = useMemo(() => nav.map((n) => n.id), []);
  const seccionActiva = useScrollSpy(ids);

  // Fotos para la tira del portal. Se toman del banco convertido; si aun no se
  // ha corrido `npm run fotos`, la tira simplemente sale vacia.
  const fotosPortal = useMemo(() => fotosObra.slice(0, 5).map((f) => f.url), []);

  // Las entradas escalonadas solo se activan una vez montado: si data-anim
  // estuviera en el HTML, el contenido quedaria invisible si JS falla.
  useEffect(() => {
    document.documentElement.setAttribute('data-anim', '1');
  }, []);

  // Enlaces profundos (grenco.pe/#contacto). El navegador intenta saltar al
  // ancla antes de que React monte, cuando la seccion todavia no existe en el
  // DOM, y se queda arriba. Repetimos el salto ya montado.
  //
  // Va en useLayoutEffect a proposito: React corre los efectos de los hijos
  // antes que los del padre, y useReveal mide su posicion en el suyo. Con un
  // useEffect normal los hijos medirian con la pagina aun en el tope y las
  // secciones enlazadas se quedarian en opacity:0.
  useLayoutEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, []);

  return (
    <>
      <a className="skip" href="#inicio">
        Saltar al contenido
      </a>

{/* Isotipo transparentado, fijo y del mismo tamano en toda la pagina.
          Sin transform ligado al scroll: se queda quieto. */}
      <div className="marca-fondo" aria-hidden="true">
        <img src={mark} alt="" width="760" height="1035" decoding="async" />
      </div>

      {/* Cielo ambiental. Su caracter lo marca la sede (Piura = dia soleado,
          Trujillo = atardecer) y su luminosidad el tema. */}
      <div className="ambient" aria-hidden="true">
        <div className="ambient__sol" />
        <span className="nube nube--1" />
        <span className="nube nube--2" />
        <span className="nube nube--3" />
        <span className="nube nube--4" />
      </div>

      <div className="progreso" style={{ width: `${progreso}%` }} aria-hidden="true" />

      <Navbar
        hidden={navHidden}
        theme={theme}
        toggleTheme={toggleTheme}
        sede={sede}
        setSede={setSede}
        seccionActiva={seccionActiva}
      />

      <div className="page">
        <main>
          <Hero sede={sede} />
          <Highlights />
          <Manifiesto sede={sede} />
          <About sede={sede} />
          <Tracking fotos={fotosPortal} />
          <Services />
          <Machinery sede={sede} />
          <MissionVision />
          <Culture />
          <Projects sede={sede} />
          <Bitacora />
          <Gallery />
          <Contact sede={sede} />
        </main>
        <Footer theme={theme} />
      </div>

      <StickyCta visible={pastHero} />
      <VolverArriba visible={pastHero} />
      <WhatsappFab />
    </>
  );
}
