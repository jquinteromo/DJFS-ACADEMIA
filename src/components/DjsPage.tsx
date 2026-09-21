import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Search, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Datos (cuando tengas backend, reemplaza este arreglo por tu consulta)      */
/* -------------------------------------------------------------------------- */

type Dj = {
  id: number;
  name: string;
  image: string;
  city: string;
  bio: string;
};

const DEFAULT_BIO = "Electronic DJ blending club energy with smooth, high-impact mixes.";
const DEFAULT_CITY = "City Center, Colombia";
const LOGO = "/logos/DJFS_PRODUCCIONES_blanco.png";

const djs: Dj[] = [
  { id: 1, name: "DJ Nova", image: "/perfiles_img/ad.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 2, name: "Pulse Harbor", image: "/perfiles_img/ar.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 3, name: "DJ Nova Mix", image: "/perfiles_img/Perfil_jaider_mix.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 4, name: "John Carter", image: "/perfiles_img/jc.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 5, name: "DJ Wren", image: "/perfiles_img/wl.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 6, name: "William Stone", image: "/perfiles_img/williian.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
  { id: 7, name: "DJ North", image: "/perfiles_img/jn.png", city: DEFAULT_CITY, bio: DEFAULT_BIO },
];

const PROFILE_PATH = "/dj-profile"; // cuando haya un perfil por DJ: `/dj-profile/${dj.id}`

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/* -------------------------------------------------------------------------- */
/*  Estilos compartidos                                                        */
/* -------------------------------------------------------------------------- */

const focus = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

const pill = `rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`;

/* -------------------------------------------------------------------------- */
/*  Piezas del sitio                                                           */
/* -------------------------------------------------------------------------- */

function VerifiedBadge({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="-5 -5 110 110" className="absolute inset-0 h-full w-full fill-current text-white" aria-hidden>
        <path
          d="M 97 50 L 92.5 61.4 L 90.7 73.5 L 81.1 81.1 L 73.5 90.7 L 61.4 92.5 L 50 97 L 38.6 92.5 L 26.5 90.7 L 18.9 81.1 L 9.3 73.5 L 7.5 61.4 L 3 50 L 7.5 38.6 L 9.3 26.5 L 18.9 18.9 L 26.5 9.3 L 38.6 7.5 L 50 3 L 61.4 7.5 L 73.5 9.3 L 81.1 18.9 L 90.7 26.5 L 92.5 38.6 Z"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      </svg>
      <Check className="relative z-10 h-1/2 w-1/2 stroke-[4] text-black" />
      <span className="sr-only">Perfil verificado</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tarjeta de DJ (la misma de "DJs destacados" del home)                      */
/* -------------------------------------------------------------------------- */

function DjCard({ dj }: { dj: Dj }) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-black transition hover:border-white/25">
      <div className="relative h-[180px] overflow-hidden bg-black">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat opacity-50 blur-md"
          style={{ backgroundImage: `url('${dj.image}')` }}
        />
        <img
          src={dj.image}
          alt={dj.name}
          loading="lazy"
          draggable={false}
          className="relative z-10 h-full w-full object-contain"
        />
        <img
          src={LOGO}
          alt=""
          className="absolute bottom-2 left-1/2 z-20 h-8 w-8 -translate-x-1/2 object-contain"
        />
      </div>

      <div className="relative z-10 bg-black p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[13px] font-semibold uppercase text-white">{dj.name}</h3>
          <VerifiedBadge />
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/50">
          <MapPin size={12} aria-hidden />
          {dj.city}
        </p>

        <p className="mt-3 text-[12px] leading-5 text-white/70">{dj.bio}</p>

        <Link
          to={PROFILE_PATH}
          aria-label={`Ver perfil de ${dj.name}`}
          className={`mt-4 flex w-full items-center justify-center rounded-md border border-white/40 bg-white/5 py-2 text-[11px] font-medium text-white/85 transition hover:bg-white/10 ${focus}`}
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                     */
/* -------------------------------------------------------------------------- */

export default function DjsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return djs;
    return djs.filter((dj) => normalize(dj.name).includes(q));
  }, [query]);

  const countLabel = query.trim()
    ? `${filtered.length} de ${djs.length} DJs`
    : `${djs.length} ${djs.length === 1 ? "DJ" : "DJs"}`;

  return (
    <>
      <main>
        {/* Encabezado + buscador */}
        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-[1600px] px-6 pb-8 pt-6">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white ${focus}`}
            >
              <ArrowLeft size={14} aria-hidden />
              Volver
            </Link>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">
                  Todos los DJs
                </p>
                <h1 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
                  DJs DJFS
                </h1>
                <p className="mt-3 max-w-[460px] text-[12px] leading-5 text-white/60">
                  Artistas que están llevando la música electrónica a otro nivel. Descubre sus nuevos
                  lanzamientos y sus nuevos sonidos.
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <div role="search" className="flex items-center gap-3 rounded-md border border-white/10 py-1 text-sm">
                  <label htmlFor="dj-search" className="sr-only">Buscar DJ por nombre</label>
                  <input
                    id="dj-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busca un DJ por nombre..."
                    className="w-full min-w-0 border-0 bg-transparent px-4 py-1.5 text-white placeholder:text-white/30 focus:outline-none md:w-72"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Borrar búsqueda"
                      className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white ${focus}`}
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <Search size={16} className="mr-3 text-white/30" aria-hidden />
                  )}
                </div>
                <p className="text-[11px] text-white/50" aria-live="polite">
                  {countLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Listado */}
        <section className="bg-black py-10">
          <div className="mx-auto max-w-[1600px] px-6">
            {filtered.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-white/60">
                  No encontramos ningún DJ con “{query.trim()}”. Prueba con otro nombre.
                </p>
                <button type="button" onClick={() => setQuery("")} className={pill}>
                  Ver todos los DJs
                </button>
              </div>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((dj) => (
                  <li key={dj.id}>
                    <DjCard dj={dj} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Invitación a la academia */}
        <section className="border-t border-white/10 bg-black py-10">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">Comunidad</p>
              <h2 className="text-[22px] font-normal leading-tight tracking-tight text-white">
                Haz parte de nuestra comunidad
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Demuestra tu talento y sé parte de nuestra academia DJ.
              </p>
            </div>
            <button type="button" className={`${pill} self-start md:self-auto`}>
              Contáctanos
            </button>
          </div>
        </section>
      </main>

    </>
  );
}