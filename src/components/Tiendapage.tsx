import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Pause,
  Play,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Datos (cuando tengas backend, reemplaza este arreglo por tu consulta)      */
/* -------------------------------------------------------------------------- */

type Remix = {
  id: number;
  title: string;
  dj: string;
  duration: string; // "m:ss"
  price: number; // COP
  publishedAt: string; // AAAA-MM-DD
  previewUrl?: string; // vista previa de audio (opcional)
};

const remixes: Remix[] = [
  { id: 1, title: "Luna Vibes Torfato", dj: "DJ Nova Mix", duration: "5:26", price: 17500, publishedAt: "2026-09-14" },
  { id: 2, title: "Neon Drift", dj: "DJ Nova Mix", duration: "6:12", price: 5000, publishedAt: "2026-09-12" },
  { id: 3, title: "Night Pulse", dj: "DJ Nova", duration: "4:09", price: 5000, publishedAt: "2026-09-11" },
  { id: 4, title: "Remix Shift", dj: "Pulse Harbor", duration: "5:35", price: 8500, publishedAt: "2026-09-09" },
  { id: 5, title: "Afterglow", dj: "John Carter", duration: "4:48", price: 6500, publishedAt: "2026-09-07" },
  { id: 6, title: "Night Drive", dj: "DJ Wren", duration: "5:10", price: 9000, publishedAt: "2026-09-05" },
  { id: 7, title: "Rhythm Shift", dj: "William Stone", duration: "4:38", price: 7000, publishedAt: "2026-09-03" },
  { id: 8, title: "Coastal Bounce", dj: "DJ North", duration: "5:33", price: 5000, publishedAt: "2026-09-01" },
  { id: 9, title: "Solar Run", dj: "DJ Nova", duration: "4:57", price: 6000, publishedAt: "2026-08-28" },
  { id: 10, title: "Midnight Circuit", dj: "Pulse Harbor", duration: "5:48", price: 12000, publishedAt: "2026-08-25" },
  { id: 11, title: "Deep Groove", dj: "John Carter", duration: "6:30", price: 10000, publishedAt: "2026-08-20" },
  { id: 12, title: "Velvet Club", dj: "DJ Wren", duration: "4:20", price: 5000, publishedAt: "2026-08-15" },
];

const PROFILE_PATH = "/dj-profile"; // cuando haya un perfil por DJ: `/dj-profile/${slug}`
const CART_KEY = "djfs-cart";

type SortKey = "recent" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
];

/* -------------------------------------------------------------------------- */
/*  Utilidades                                                                 */
/* -------------------------------------------------------------------------- */

const formatPrice = (price: number) => (price === 0 ? "Gratis" : `$${price.toLocaleString("es-CO")}`);

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const loadCart = (): number[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === "number" && remixes.some((r) => r.id === id));
  } catch {
    return [];
  }
};

/* -------------------------------------------------------------------------- */
/*  Estilos compartidos                                                        */
/* -------------------------------------------------------------------------- */

const focus = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

const pill = `rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`;

const roundBtn = `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 ${focus}`;




/* -------------------------------------------------------------------------- */
/*  Fila de remix                                                              */
/* -------------------------------------------------------------------------- */

type RemixRowProps = {
  remix: Remix;
  inCart: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleCart: () => void;
};

function RemixRow({ remix, inCart, isPlaying, onTogglePlay, onToggleCart }: RemixRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl bg-white/[0.02] px-2 py-2 sm:flex-nowrap">
      <button
        type="button"
        onClick={onTogglePlay}
        aria-pressed={isPlaying}
        aria-label={`${isPlaying ? "Pausar" : "Escuchar"} vista previa de ${remix.title}`}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white transition hover:bg-white/10 ${focus}`}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </button>

      <div className="min-w-0 flex-1 basis-[55%] sm:basis-auto">
        <div className="truncate text-sm font-medium text-white">{remix.title}</div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
          <span>{remix.duration}</span>
          <Link
            to={PROFILE_PATH}
            className={`truncate uppercase tracking-[0.12em] transition hover:text-white hover:underline ${focus}`}
          >
            {remix.dj}
          </Link>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-4 pl-[3.75rem] sm:w-auto sm:justify-end sm:pl-0">
        <span className="text-base font-semibold text-white sm:w-20 sm:text-right">{formatPrice(remix.price)}</span>

        <button
          type="button"
          onClick={onToggleCart}
          aria-pressed={inCart}
          aria-label={inCart ? `Quitar ${remix.title} del carrito` : `Agregar ${remix.title} al carrito`}
          className={`inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${focus} ${
            inCart
              ? "border-[#b5f7c4]/40 bg-[#e8f9eb]/10 text-[#b5f7c4] hover:bg-[#e8f9eb]/20"
              : "border-white bg-white text-black hover:bg-white/80"
          }`}
        >
          {inCart ? <Check size={16} aria-hidden /> : <ShoppingCart size={16} aria-hidden />}
          {inCart ? "En el carrito" : "Agregar"}
        </button>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel del carrito                                                          */
/* -------------------------------------------------------------------------- */

type CartDrawerProps = {
  open: boolean;
  items: Remix[];
  total: number;
  onClose: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onCheckout: () => void;
};

function CartDrawer({ open, items, total, onClose, onRemove, onClear, onCheckout }: CartDrawerProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-black"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 id="cart-title" className="text-[22px] font-normal uppercase leading-none tracking-tight">
            Tu carrito
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} className={roundBtn} aria-label="Cerrar carrito">
            <X size={14} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-base text-white">Tu carrito está vacío.</p>
            <p className="text-sm text-white/60">Agrega remixes desde la tienda para verlos aquí.</p>
            <button type="button" onClick={onClose} className={`${pill} mt-4`}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 truncate text-[11px] uppercase tracking-[0.12em] text-slate-400">{item.dj}</p>
                  </div>
                  <span className="text-sm font-semibold text-white">{formatPrice(item.price)}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className={roundBtn}
                    aria-label={`Quitar ${item.title} del carrito`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-center justify-between text-base">
                <span className="text-white/70">Total</span>
                <span className="text-xl font-semibold text-white">{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={onCheckout}
                className={`mt-4 flex w-full items-center justify-center rounded-xl border border-white bg-white py-3.5 text-base font-medium text-black transition hover:bg-white/85 ${focus}`}
              >
                Ir a pagar
              </button>
              <button type="button" onClick={onClear} className={`${pill} mt-3 w-full`}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                     */
/* -------------------------------------------------------------------------- */

export default function TiendaPage() {
  const [query, setQuery] = useState("");
  const [djFilter, setDjFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const [cartIds, setCartIds] = useState<number[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();

  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const djNames = useMemo(() => Array.from(new Set(remixes.map((r) => r.dj))).sort(), []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    const list = remixes.filter((r) => {
      const matchesDj = djFilter === "all" || r.dj === djFilter;
      const matchesQuery = !q || normalize(r.title).includes(q) || normalize(r.dj).includes(q);
      return matchesDj && matchesQuery;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price || a.title.localeCompare(b.title);
        case "price-desc":
          return b.price - a.price || a.title.localeCompare(b.title);
        case "name":
          return a.title.localeCompare(b.title, "es");
        default:
          return b.publishedAt.localeCompare(a.publishedAt);
      }
    });
  }, [query, djFilter, sort]);

  const cartItems = useMemo(
    () => cartIds.map((id) => remixes.find((r) => r.id === id)).filter((r): r is Remix => Boolean(r)),
    [cartIds],
  );
  const cartTotal = useMemo(() => cartItems.reduce((sum, r) => sum + r.price, 0), [cartItems]);

  const hasFilters = query.trim() !== "" || djFilter !== "all";

  /* --- Carrito: se guarda en el navegador para no perderlo al cambiar de página --- */
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartIds));
    } catch {
      /* si el navegador bloquea el almacenamiento, el carrito sigue funcionando en memoria */
    }
  }, [cartIds]);

  useEffect(() => {
    const state = location.state as { openCart?: boolean } | null;
    if (state?.openCart) {
      setCartOpen(true);
    }
  }, [location.state]);

  const toggleCart = (id: number) =>
    setCartIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const removeFromCart = (id: number) => setCartIds((current) => current.filter((x) => x !== id));
  const clearCart = () => setCartIds([]);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const handleCheckout = () => {
    // TODO: aquí conectas tu pasarela de pago o navegas a tu página de checkout.
    // Ejemplo: navigate("/checkout");
  };

  /* --- Vista previa: reproduce previewUrl si existe; si no, solo marca el estado --- */
  const togglePlay = (remix: Remix) => {
    const audio = audioRef.current;
    if (playingId === remix.id) {
      audio?.pause();
      setPlayingId(null);
      return;
    }
    setPlayingId(remix.id);
    if (audio && remix.previewUrl) {
      audio.src = remix.previewUrl;
      audio.play().catch(() => setPlayingId(null));
    } else {
      audio?.pause();
    }
  };

  const clearFilters = () => {
    setQuery("");
    setDjFilter("all");
  };

  const chipClass = (selected: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition ${focus} ${
      selected
        ? "border-white bg-white font-medium text-black"
        : "border-white/20 bg-white/[0.04] text-white/80 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-black text-white">
     
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <main className={cartItems.length > 0 && !cartOpen ? "pb-24" : ""}>
        {/* Encabezado + buscador */}
        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-[1100px] px-6 pb-8 pt-6">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white ${focus}`}
            >
              <ArrowLeft size={14} aria-hidden />
              Volver
            </Link>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
                  Tienda remix
                </h1>
                <p className="mt-3 max-w-[460px] text-[12px] leading-5 text-white/60">
                  Los remixes de todos nuestros DJs en un solo lugar. Compra, descarga y disfruta en tus eventos.
                </p>
              </div>

              <div role="search" className="flex items-center gap-3 rounded-md border border-white/10 py-1 text-sm">
                <label htmlFor="store-search" className="sr-only">Buscar remix o DJ</label>
                <input
                  id="store-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca un remix o un DJ..."
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
            </div>
          </div>
        </section>

        {/* Filtros + lista */}
        <section className="bg-black py-8">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div role="group" aria-label="Filtrar por DJ" className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
                <button
                  type="button"
                  aria-pressed={djFilter === "all"}
                  onClick={() => setDjFilter("all")}
                  className={chipClass(djFilter === "all")}
                >
                  Todos los DJs
                </button>
                {djNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={djFilter === name}
                    onClick={() => setDjFilter(name)}
                    className={chipClass(djFilter === name)}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="shrink-0">
                <label htmlFor="store-sort" className="mb-1 block text-[11px] text-white/50">Ordenar por</label>
                <select
                  id="store-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-full rounded-md border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none md:w-56"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mb-4 mt-6 text-[12px] text-white/50" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "remix" : "remixes"}
              {hasFilters ? ` de ${remixes.length}` : ""}
            </p>

            {filtered.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 px-6 text-center">
                <p className="text-sm text-white/60">No encontramos remixes con esos filtros.</p>
                <button type="button" onClick={clearFilters} className={pill}>
                  Ver todos los remixes
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((remix) => (
                  <RemixRow
                    key={remix.id}
                    remix={remix}
                    inCart={cartIds.includes(remix.id)}
                    isPlaying={playingId === remix.id}
                    onTogglePlay={() => togglePlay(remix)}
                    onToggleCart={() => toggleCart(remix.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      

      {/* Barra fija para no perder de vista lo que llevas */}
      {cartItems.length > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-black/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-3">
            <p className="text-sm text-white/80">
              <span className="font-medium text-white">
                {cartItems.length} {cartItems.length === 1 ? "remix" : "remixes"}
              </span>{" "}
              en tu carrito, total{" "}
              <span className="font-semibold text-white">{formatPrice(cartTotal)}</span>
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={`rounded-lg border border-white bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/85 ${focus}`}
            >
              Ver carrito
            </button>
          </div>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        total={cartTotal}
        onClose={closeCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}