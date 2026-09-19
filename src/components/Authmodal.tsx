import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

export type AuthMode = "login" | "register";
export type SocialProvider = "google" | "facebook";
export type EmailCredentials = { name?: string; email: string; password: string };

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  /** Conecta aquí tu login con correo. Si lanza un Error, su mensaje se muestra en el modal. */
  onEmailSubmit?: (mode: AuthMode, credentials: EmailCredentials) => Promise<void> | void;
  /** Conecta aquí Google / Facebook (Firebase, Supabase, Auth0, tu backend...). */
  onSocialLogin?: (provider: SocialProvider) => Promise<void> | void;
  onForgotPassword?: () => void;
};

type Busy = "email" | SocialProvider | null;
type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

/* -------------------------------------------------------------------------- */
/*  Constantes                                                                 */
/* -------------------------------------------------------------------------- */

// Se repite aquí (en vez de importarlo de SiteLayout) para evitar un import circular.
const LOGO = "/logos/DJFS_PRODUCCIONES_blanco.png";
const focus =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

const TERMS_URL = "/terminos"; // TODO: ajusta a tus rutas reales
const PRIVACY_URL = "/politicas-y-privacidad";

const copy = {
  login: {
    title: "Bienvenido de vuelta",
    subtitle: "Inicia sesión para comprar remix y descargar tus mixes.",
    submit: "Iniciar sesión",
    busy: "Entrando…",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: "Compra remix y descarga mixes gratis en DJFS Producciones.",
    submit: "Crear cuenta",
    busy: "Creando cuenta…",
  },
} as const;

const socialButton = `flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`;

const inputClass = (invalid: boolean) =>
  `w-full rounded-md border bg-transparent px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none sm:text-sm ${
    invalid ? "border-red-400/60 focus:border-red-300" : "border-white/10 focus:border-white/40"
  }`;

const labelClass = "mb-1 block text-[11px] text-white/50";
const errorClass = "mt-1 text-xs text-red-300";

const GENERIC_ERROR = "No pudimos completar la solicitud. Inténtalo de nuevo.";

/* -------------------------------------------------------------------------- */
/*  Piezas pequeñas                                                            */
/* -------------------------------------------------------------------------- */

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contenido (se reinicia cada vez que cambias entre iniciar sesión / crear)  */
/* -------------------------------------------------------------------------- */

type ContentProps = Pick<
  AuthModalProps,
  "mode" | "onClose" | "onEmailSubmit" | "onSocialLogin" | "onForgotPassword"
>;

function AuthContent({ mode, onClose, onEmailSubmit, onSocialLogin, onForgotPassword }: ContentProps) {
  const isRegister = mode === "register";
  const c = copy[mode];

  const formRef = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState({ name: "", email: "", password: "", accepted: false });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<Busy>(null);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const disabled = busy !== null;

  const validate = (): Errors => {
    const next: Errors = {};
    if (isRegister && !values.name.trim()) next.name = "Escribe tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      next.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    }
    if (isRegister) {
      if (values.password.length < 8) next.password = "Usa al menos 8 caracteres.";
      if (!values.accepted) next.terms = "Acepta los términos para crear tu cuenta.";
    } else if (!values.password) {
      next.password = "Escribe tu contraseña.";
    }
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Lleva el foco al primer campo con error (útil en móvil)
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(),
      );
      return;
    }

    setBusy("email");
    try {
      if (onEmailSubmit) {
        await onEmailSubmit(mode, {
          name: isRegister ? values.name.trim() : undefined,
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        console.warn("[AuthModal] Falta conectar onEmailSubmit.");
      }
      onClose();
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : GENERIC_ERROR);
    } finally {
      setBusy(null);
    }
  };

  const handleSocial = async (provider: SocialProvider) => {
    setFormError("");
    setBusy(provider);
    try {
      if (onSocialLogin) {
        await onSocialLogin(provider);
      } else {
        console.warn(`[AuthModal] Falta conectar onSocialLogin (${provider}).`);
      }
      onClose();
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : GENERIC_ERROR);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div role="tabpanel" id="auth-panel" aria-labelledby={`auth-tab-${mode}`}>
      <div className="mt-6">
        <h2
          id="auth-title"
          className="text-[22px] font-normal uppercase leading-tight tracking-tight text-white"
        >
          {c.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{c.subtitle}</p>
      </div>

      {/* Acceso rápido con redes */}
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          disabled={disabled}
          className={socialButton}
        >
          {busy === "google" ? <Spinner /> : <FcGoogle size={20} aria-hidden />}
          Continuar con Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial("facebook")}
          disabled={disabled}
          className={socialButton}
        >
          {busy === "facebook" ? <Spinner /> : <SiFacebook size={20} className="text-[#1877F2]" aria-hidden />}
          Continuar con Facebook
        </button>
      </div>

      {isRegister && (
        <p className="mt-3 text-center text-[11px] leading-5 text-white/40">
          Al continuar con Google o Facebook aceptas los{" "}
          <a href={TERMS_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white/70">
            términos
          </a>{" "}
          y la{" "}
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white/70">
            política de privacidad
          </a>
          .
        </p>
      )}

      <div className="my-5 flex items-center gap-3 text-[11px] text-white/40">
        <span className="h-px flex-1 bg-white/10" />
        o con tu correo
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Correo y contraseña */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4">
        {isRegister && (
          <div>
            <label htmlFor="auth-name" className={labelClass}>Nombre</label>
            <input
              id="auth-name"
              data-autofocus
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "auth-name-error" : undefined}
              className={inputClass(Boolean(errors.name))}
            />
            {errors.name && <p id="auth-name-error" role="alert" className={errorClass}>{errors.name}</p>}
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className={labelClass}>Correo</label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            data-autofocus={isRegister ? undefined : true}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "auth-email-error" : undefined}
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && <p id="auth-email-error" role="alert" className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <label htmlFor="auth-password" className="block text-[11px] text-white/50">
              Contraseña
            </label>
            {!isRegister && (
              <button
                type="button"
                onClick={onForgotPassword}
                className={`text-[11px] text-white/60 underline-offset-4 transition hover:text-white hover:underline ${focus}`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              autoComplete={isRegister ? "new-password" : "current-password"}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "auth-password-error" : isRegister ? "auth-password-hint" : undefined}
              className={`${inputClass(Boolean(errors.password))} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className={`absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-white/50 transition hover:text-white ${focus}`}
            >
              {showPassword ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
            </button>
          </div>

          {errors.password ? (
            <p id="auth-password-error" role="alert" className={errorClass}>{errors.password}</p>
          ) : (
            isRegister && (
              <p id="auth-password-hint" className="mt-1 text-[11px] text-white/40">
                Mínimo 8 caracteres.
              </p>
            )
          )}
        </div>

        {isRegister && (
          <div>
            <label className="flex items-start gap-3 text-xs leading-5 text-white/60">
              <input
                type="checkbox"
                checked={values.accepted}
                onChange={(e) => setValues((v) => ({ ...v, accepted: e.target.checked }))}
                aria-invalid={Boolean(errors.terms)}
                aria-describedby={errors.terms ? "auth-terms-error" : undefined}
                className="mt-0.5 h-4 w-4 shrink-0 accent-white"
              />
              <span>
                Acepto los{" "}
                <a href={TERMS_URL} target="_blank" rel="noreferrer" className="text-white underline underline-offset-2">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="text-white underline underline-offset-2">
                  política de privacidad
                </a>
                .
              </span>
            </label>
            {errors.terms && <p id="auth-terms-error" role="alert" className={errorClass}>{errors.terms}</p>}
          </div>
        )}

        {formError && (
          <p role="alert" className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
        >
          {busy === "email" && <Spinner />}
          {busy === "email" ? c.busy : c.submit}
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                      */
/* -------------------------------------------------------------------------- */

export default function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
  onEmailSubmit,
  onSocialLogin,
  onForgotPassword,
}: AuthModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const pressStartedOnBackdrop = useRef(false);

  // <dialog> nativo: atrapa el foco, cierra con Escape y devuelve el foco al botón que lo abrió
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // En móvil no enfocamos el campo para que el teclado no tape el modal
      if (window.matchMedia("(pointer: fine)").matches) {
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Evita que la página de fondo se desplace mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-title"
      onClose={() => {
        if (open) onClose();
      }}
      // Cierra al tocar el fondo, pero no si el usuario arrastró desde dentro (p. ej. seleccionando texto)
      onMouseDown={(e) => {
        pressStartedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressStartedOnBackdrop.current && e.target === e.currentTarget) onClose();
      }}
      className="mx-auto mb-0 mt-auto max-h-[92dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-2xl border border-white/10 bg-black p-0 text-white shadow-[0_0_60px_rgba(255,255,255,0.06)] backdrop:bg-black/80 backdrop:backdrop-blur-sm sm:my-auto sm:rounded-2xl"
    >
      {open && (
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="" className="h-10 w-10" />
              <div className="leading-none">
                <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-white">DJFS</div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">Producciones</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 ${focus}`}
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Acceso a tu cuenta"
            className="mt-6 flex overflow-hidden rounded-xl border border-white/25"
          >
            {(["login", "register"] as const).map((tab, i) => {
              const selected = mode === tab;
              return (
                <button
                  key={tab}
                  id={`auth-tab-${tab}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="auth-panel"
                  onClick={() => onModeChange(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${focus} ${
                    i === 1 ? "border-l border-white/25" : ""
                  } ${selected ? "bg-white text-black" : "bg-white/[0.06] text-white hover:bg-white/15"}`}
                >
                  {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              );
            })}
          </div>

          <AuthContent
            key={mode}
            mode={mode}
            onClose={onClose}
            onEmailSubmit={onEmailSubmit}
            onSocialLogin={onSocialLogin}
            onForgotPassword={onForgotPassword}
          />
        </div>
      )}
    </dialog>
  );
}