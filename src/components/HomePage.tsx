import { useRef } from "react";
import type { ReactNode } from "react";

import {
  ArrowDownToLine,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Datos                                                                      */
/* -------------------------------------------------------------------------- */

type Track = {
  title: string;
  artist: string;
  dj: string; // nombre que se muestra en la fila
  time: string;
  price?: string;
};

const topCharts: Track[] = [
  { title: "Rhythm Shift", artist: "Deep Groove", dj: "DJ Nova", time: "6:30", price: "$9.90" },
  { title: "Luna Vibe", artist: "Resp Remix", dj: "Pulse Harbor", time: "5:26", price: "$7.50" },
  { title: "Remix Shift", artist: "Tech Remix", dj: "DJ Nova", time: "5:35", price: "$8.20" },
  { title: "Rhythm Shift", artist: "Deep Remix", dj: "DJ Wren", time: "4:38", price: "$6.90" },
];

const latestReleases: Track[] = [
  { title: "Luna Vibes Torfato", artist: "Resp Remix", dj: "DJ Nova Mix", time: "5:26", price: "$17.500" },
  { title: "Remix Shift", artist: "Tech Remix", dj: "Wave Echo", time: "5:35", price: "$8.20" },
  { title: "Afterglow", artist: "Velvet Club", dj: "North Pulse", time: "4:48", price: "$6.40" },
  { title: "Night Drive", artist: "City Echo", dj: "James Drift", time: "5:10", price: "$9.20" },
];

const latestMixes: Track[] = [
  { title: "Neon Drift", artist: "Pulse Lab", dj: "DJ Nova", time: "6:12", price: "Gratis" },
  { title: "Midnight Circuit", artist: "Nova Echo", dj: "Pulse Harbor", time: "5:48", price: "Gratis" },
  { title: "Solar Run", artist: "Milo Frame", dj: "DJ North", time: "4:57", price: "Gratis" },
  { title: "Coastal Bounce", artist: "Riviera FM", dj: "Wave Echo", time: "5:33", price: "Gratis" },
];

const artistCards = [
  { name: "DJ Nova", image: "/perfiles_img/ad.png" },
  { name: "Pulse Harbor", image: "/perfiles_img/ar.png" },
  { name: "DJ Nova Mix", image: "/perfiles_img/Perfil_jaider_mix.png" },
  { name: "John Carter", image: "/perfiles_img/jc.png" },
  { name: "DJ Wren", image: "/perfiles_img/wl.png" },
  { name: "William Stone", image: "/perfiles_img/williian.png" },
  { name: "DJ North", image: "/perfiles_img/jn.png" },
];

/* -------------------------------------------------------------------------- */
/*  Piezas reutilizables                                                       */
/* -------------------------------------------------------------------------- */

const focus =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

const pill = `rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`;

/** Fila de canción. En móvil el DJ va bajo el título; desde xl va a la derecha. */
function TrackRow({ track, variant }: { track: Track; variant: "buy" | "free" }) {
  const isFree = variant === "free";

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-2">
      <button
        type="button"
        aria-label={`Reproducir ${track.title}`}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#111111] text-xs font-bold text-white transition hover:bg-white/10 sm:h-12 sm:w-12 ${focus}`}
      >
        ▶
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">{track.title}</div>
        <div className="mt-1 flex min-w-0 items-center gap-2 text-[11px] text-slate-400">
          <span className="shrink-0">{track.time}</span>
          <span className="truncate text-[10px] uppercase tracking-[0.12em] text-slate-300 xl:hidden">
            {track.dj}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400 sm:gap-3">
        <span
          className={`min-w-[3.5rem] text-right text-sm font-semibold ${
            isFree ? "text-[#b5f7c4]" : "text-white"
          }`}
        >
          {track.price}
        </span>

        {isFree ? (
          <button
            type="button"
            aria-label={`Descargar ${track.title}`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#e8f9eb] text-black transition hover:bg-white sm:h-8 sm:w-8 ${focus}`}
          >
            <ArrowDownToLine size={14} />
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Agregar ${track.title} al carrito`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white text-black transition hover:bg-white/80 sm:h-8 sm:w-8 ${focus}`}
          >
            <ShoppingCart size={14} />
          </button>
        )}

        <span className="hidden min-w-[56px] shrink-0 text-right text-[10px] uppercase tracking-[0.15em] text-slate-300 xl:block">
          {track.dj}
        </span>
      </div>
    </li>
  );
}

/**
 * Columna de canciones.
 * - "first": muestra "Ver más" desde tablet (md).
 * - "second": en móvil muestra un único "Ver más" al final de las dos listas.
 */
function TrackColumn({
  tracks,
  variant,
  position,
  className = "",
}: {
  tracks: Track[];
  variant: "buy" | "free";
  position: "first" | "second";
  className?: string;
}) {
  const moreButton = (
    <button type="button" className={pill}>
      Ver más
    </button>
  );

  return (
    <div className={`min-w-0 space-y-3 ${className}`}>
      <ul className="space-y-3">
        {tracks.map((track) => (
          <TrackRow key={`${track.title}-${track.dj}`} track={track} variant={variant} />
        ))}
      </ul>

      {position === "first" ? (
        <div className="mt-4 hidden border-t border-white/10 pt-3 md:block">{moreButton}</div>
      ) : (
        <>
          <div className="mt-4 border-t border-white/10 pt-3 md:hidden">{moreButton}</div>
          <div aria-hidden className="mt-4 hidden border-t border-white/10 pt-3 md:block" />
        </>
      )}
    </div>
  );
}

/** Bloque de título de cada sección (izquierda en escritorio, arriba en móvil). */
function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pr-4 md:col-span-2 xl:col-span-1">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
        {eyebrow}
      </div>
      <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-[240px] text-[10px] font-medium leading-5 tracking-[0.12em] text-white/60">
        {children}
      </p>
    </div>
  );
}

const listGrid = "grid gap-6 bg-black pb-2 md:grid-cols-2 xl:grid-cols-[0.4fr_1.25fr_1.25fr]";
const firstColumn = "xl:border-l xl:border-white/10 xl:pl-6";
const secondColumn = "md:border-l md:border-white/10 md:pl-6";

/* -------------------------------------------------------------------------- */
/*  Página                                                                     */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Las flechas (solo pantallas sm en adelante) avanzan exactamente una tarjeta.
  // En móvil no hay JavaScript de por medio: el desplazamiento es 100 % nativo.
  const scrollArtistCards = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("article");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : 320;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {/* ------------------------------- Hero + Remix ------------------------------- */}
      <section className="relative overflow-hidden border-b border-black/10 bg-black">
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-10 md:pb-12">
          <div className="mb-6 flex flex-col gap-6 border-b border-white/10 pb-6 lg:mb-8 lg:min-h-[400px] lg:flex-row lg:gap-12">
            <div className="flex flex-col justify-center pb-2 pt-8 lg:pb-16 lg:pt-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 sm:tracking-[0.45em]">
                Tu música, tu talento, tu espacio
              </p>

              <button
                type="button"
                className={`mt-6 inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-white/20 px-5 py-3 text-base font-light text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition hover:bg-white/10 sm:mt-8 sm:px-6 sm:py-4 sm:text-xl ${focus}`}
              >
                Explorar tienda remix<span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Banner: en móvil/tablet el mensaje va debajo de la imagen; en lg va encima */}
            <div className="relative flex w-full flex-col overflow-hidden lg:min-h-[420px] lg:w-[86%] lg:translate-x-8 lg:justify-self-end">
              <div className="relative h-[220px] sm:h-[320px] lg:absolute lg:inset-0 lg:h-full">
                <img
                  src="/Banner/Banner.png"
                  alt="Banner DJ"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 bg-black px-3 py-4 sm:gap-4 sm:px-4 lg:absolute lg:right-8 lg:top-[42%] lg:-translate-y-1/2 lg:gap-0 lg:border-0 lg:bg-transparent lg:p-0">
                <img
                  src="/logos/DJFS_PRODUCCIONES_blanco_letras.png"
                  alt="DJFS Producciones"
                  className="h-12 w-12 shrink-0 sm:h-20 sm:w-20 lg:h-36 lg:w-36"
                />
                <div className="min-w-0 text-[11px] uppercase leading-5 tracking-[0.15em] text-white/70 sm:text-xs sm:tracking-[0.2em] lg:tracking-[0.25em]">
                  HAZ QUE TUS EVENTOS
                  <br />
                  SEAN INOLVIABLES.
                  <br />
                  COMPRA, DESCARGA
                  <br />
                  Y DISFRUTA
                </div>
              </div>
            </div>
          </div>

          <div className={listGrid}>
            <SectionIntro eyebrow="NUEVO" title={<>REMIX<br />RECIENTES</>}>
              Descubre las últimas creaciones de nuestra comunidad.
            </SectionIntro>

            <TrackColumn tracks={topCharts} variant="buy" position="first" className={firstColumn} />
            <TrackColumn
              tracks={latestReleases}
              variant="buy"
              position="second"
              className={secondColumn}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------- Mixes ---------------------------------- */}
      <section className="border-b border-white/10 bg-black py-6">
        <div className="mx-auto max-w-[1600px] px-6 pb-6 md:pb-8">
          <div className={listGrid}>
            <SectionIntro eyebrow="MIX" title={<>MIX<br />RECIENTES</>}>
              Mixes no limpios, usan el sello del DJ, prohibida su edición.
            </SectionIntro>

            <TrackColumn
              tracks={latestMixes.slice(0, 2)}
              variant="free"
              position="first"
              className={firstColumn}
            />
            <TrackColumn
              tracks={latestMixes.slice(2, 4)}
              variant="free"
              position="second"
              className={secondColumn}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------- DJs destacados ----------------------------- */}
      <section className="bg-black pb-8 pt-10 md:pt-16">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-6">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">
              DJs destacados
            </p>
            <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
              DJs DJFS
            </h2>
            <p className="mt-2 max-w-[400px] text-[10px] font-medium leading-5 text-white/60">
              Artistas que están lanzando la música electrónica a otro nivel.
              <br className="hidden sm:block" /> Espera sus nuevas y descubre sus nuevos sonidos.
            </p>
          </div>

          <div className="relative">
            {/* Flechas: solo en pantallas medianas en adelante; en móvil se desliza con el dedo */}
            <button
              type="button"
              aria-label="Mover para atrás"
              className={`absolute -left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white shadow-lg transition hover:bg-white/10 sm:flex ${focus}`}
              onClick={() => scrollArtistCards("left")}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              aria-label="Mover para adelante"
              className={`absolute -right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white shadow-lg transition hover:bg-white/10 sm:flex ${focus}`}
              onClick={() => scrollArtistCards("right")}
            >
              <ChevronRight size={18} />
            </button>

            {/*
              Carrusel 100 % nativo. Importante: NO agregar `touch-action`
              (ni style={{ touchAction }} ni clases touch-pan-*), porque
              bloquea un eje del deslizamiento con el dedo.
            */}
            <div
              ref={scrollRef}
              className="-mx-6 flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-pl-6 px-6 pb-4 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {artistCards.map((artist) => (
                <article
                  key={`${artist.name}-${artist.image}`}
                  className="group relative w-[78vw] max-w-[280px] shrink-0 snap-start overflow-visible rounded-lg border border-white/10 bg-black"
                >
                  <div className="relative h-[140px] overflow-hidden bg-black">
                    <div
                      className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat opacity-50 blur-md"
                      style={{ backgroundImage: `url('${artist.image}')` }}
                    />

                    <img
                      src={artist.image}
                      alt={artist.name}
                      draggable={false}
                      className="relative z-10 h-full w-full object-contain"
                    />

                    <div className="absolute left-1/2 top-28 z-20 -translate-x-1/2">
                      <img
                        src="/logos/DJFS_PRODUCCIONES_blanco.png"
                        className="h-8 w-8 object-contain"
                        alt="Logo DJFS"
                      />
                    </div>
                  </div>

                  <div className="relative z-10 w-full bg-black p-4">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-[13px] font-semibold uppercase text-white">
                        {artist.name}
                      </p>
                      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                        <svg
                          viewBox="-5 -5 110 110"
                          className="absolute inset-0 h-full w-full fill-current text-[#ffff]"
                          aria-hidden
                        >
                          <path
                            d="M 97 50 L 92.5 61.4 L 90.7 73.5 L 81.1 81.1 L 73.5 90.7 L 61.4 92.5 L 50 97 L 38.6 92.5 L 26.5 90.7 L 18.9 81.1 L 9.3 73.5 L 7.5 61.4 L 3 50 L 7.5 38.6 L 9.3 26.5 L 18.9 18.9 L 26.5 9.3 L 38.6 7.5 L 50 3 L 61.4 7.5 L 73.5 9.3 L 81.1 18.9 L 90.7 26.5 L 92.5 38.6 Z"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <Check className="relative z-10 h-2.5 w-2.5 stroke-[4] text-black" />
                        <span className="sr-only">Perfil verificado</span>
                      </div>
                    </div>

                    <p className="mb-3 mt-1 text-[11px] leading-4 text-white/70">
                      DJ de Isnos Huila Colombia, con lo mejor del crossover.
                    </p>

                    <button
                      type="button"
                      className={`relative z-20 inline-flex w-full items-center justify-center rounded-md border border-white/50 bg-white/5 px-4 py-2 text-[10px] font-medium text-white/80 transition hover:bg-white/10 sm:w-auto sm:px-12 sm:py-1.5 ${focus}`}
                    >
                      Ver perfil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <button type="button" className={pill}>
              Ver todos
            </button>
          </div>
        </div>
      </section>
    </>
  );
}