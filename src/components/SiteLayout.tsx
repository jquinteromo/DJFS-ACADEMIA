import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import {
  FileHeadphone,
  Menu,
  Search,
  ShoppingCart,
  UserRoundKey,
  X,
} from "lucide-react";
import AuthModal, { type AuthMode } from "./Authmodal";

export const LOGO = "/logos/DJFS_PRODUCCIONES_blanco.png";
export const focus =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

export const SITE = {
  name: "DJFS Producciones",
  whatsapp: "573001234567",
  whatsappDisplay: "+57 300 123 4567",
  email: "hola@djfsproducciones.com",
  location: "Ibagué, Colombia",
  hours: "Lun - Sab · 9:00 AM - 7:00 PM",
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
};

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Tienda", to: "/tienda" },
  { label: "DJs", to: "/djs" },
  { label: "Sobre nosotros", to: "/sobre-nosotros" },
  { label: "Contacto", to: "/contacto" },
  { label: "Mi perfil", to: "/dj-profile" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const openAuth = (mode: AuthMode) => {
    setMenuOpen(false);
    setAuthMode(mode);
  };

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  useEffect(() => {
    setMenuOpen(false);
    setAuthMode(null);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const socials = [
    { label: "Instagram", href: SITE.socials.instagram, icon: <SiInstagram size={20} /> },
    { label: "YouTube", href: SITE.socials.youtube, icon: <SiYoutube size={20} /> },
    { label: "Facebook", href: SITE.socials.facebook, icon: <SiFacebook size={20} /> },
    { label: "TikTok", href: SITE.socials.tiktok, icon: <SiTiktok size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center border-b border-white/10 bg-black px-4 py-3 text-center text-xs font-normal text-white/70">
        <span className="inline-flex items-center gap-2">
          <FileHeadphone size={14} aria-hidden />
          <span>Remix a partir de $5.000</span>
        </span>
      </div>

      <header className="border-b border-gray-800 bg-black">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-3 sm:py-4">
          <Link to="/" className={`flex shrink-0 items-center gap-3 ${focus}`}>
            <img
              src={LOGO}
              alt="DJFS Producciones"
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
            <div className="leading-none">
              <div className="text-[12px] font-medium uppercase tracking-[0.35em] text-white">
                DJFS
              </div>
              <div className="text-[12px] uppercase tracking-[0.28em] text-white/60">
                Producciones
              </div>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-5 text-sm font-semibold lg:flex xl:gap-7"
            aria-label="Principal"
          >
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap transition hover:text-white ${focus} ${
                    active ? "text-white" : "text-white/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 text-sm sm:gap-3">
            {isHome && (
              <label className="hidden items-center gap-3 rounded-md border border-white/10 py-1 text-xs text-white/70 xl:flex">
                <span className="sr-only">Buscar</span>
                <input
                  type="text"
                  placeholder="Busca remix, mix, Djs..."
                  className="w-40 border-0 bg-transparent px-4 text-white/60 placeholder:text-white/30 focus:outline-none 2xl:w-56"
                />
                <Search size={16} className="mr-3 text-white/30" aria-hidden />
              </label>
            )}

            {pathname === "/tienda" && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/tienda", { state: { openCart: true } });
                }}
                aria-label={`Abrir carrito, ${1} ${1 === 1 ? "remix" : "remixes"}`}
                className={`relative flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/10 ${focus}`}
              >
                <ShoppingCart size={18} aria-hidden />
                <span className="hidden sm:inline">Carrito</span>
                {1 > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold tabular-nums text-black">
                    {1}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => openAuth("login")}
              className={`hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-white transition hover:bg-white/10 sm:inline-flex xl:px-4 ${focus}`}
            >
              <UserRoundKey size={20} aria-hidden />
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className={`hidden whitespace-nowrap rounded-md border border-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/10 sm:inline-block ${focus}`}
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 lg:hidden ${focus}`}
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-white/10 lg:hidden">
            <div className="mx-auto max-w-[1600px] px-6 py-4">
              {isHome && (
                <label className="mb-4 flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm">
                  <span className="sr-only">Buscar</span>
                  <Search size={16} className="shrink-0 text-white/30" aria-hidden />
                  <input
                    type="search"
                    placeholder="Busca remix, mix, Djs..."
                    className="min-w-0 flex-1 bg-transparent text-white/80 placeholder:text-white/30 focus:outline-none"
                  />
                </label>
              )}

              <nav aria-label="Principal móvil" className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-md px-3 py-3 text-base font-medium transition hover:bg-white/10 hover:text-white ${focus} ${
                        active ? "bg-white/5 text-white" : "text-white/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:hidden">
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-white transition hover:bg-white/10 ${focus}`}
                >
                  <UserRoundKey size={20} aria-hidden />
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className={`rounded-md border border-white/20 px-4 py-3 font-medium text-white transition hover:bg-white/10 ${focus}`}
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black text-white">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-6 lg:grid-cols-[0.9fr_1.5fr_1fr] lg:gap-8">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <img src={LOGO} alt="DJFS Producciones" className="h-14 w-14" />
            <div className="text-[14px] font-semibold uppercase">
              ACADEMIA
              <br />
              DJFS
            </div>
          </div>

          <nav
            aria-label="Pie de página"
            className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/80"
          >
            <Link to="/" className={`hover:text-white ${focus}`}>Inicio</Link>
            <Link to="/tienda" className={`hover:text-white ${focus}`}>Tienda</Link>
            <Link to="/contacto" className={`hover:text-white ${focus}`}>Contacto</Link>
            <Link to="/sobre-nosotros" className={`hover:text-white ${focus}`}>Sobre nosotros</Link>
          </nav>

          <div className="flex flex-row items-center justify-center gap-2 text-white/75 lg:justify-end">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:text-white ${focus}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-1 px-6 py-4 text-center text-xs font-light text-white/75 sm:flex-row sm:justify-between sm:text-left">
            <span>© 2026 DJFS Producciones</span>
            <span>Todos los derechos reservados</span>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authMode !== null}
        mode={authMode ?? "login"}
        onModeChange={setAuthMode}
        onClose={() => setAuthMode(null)}
      />
    </div>
  );
}