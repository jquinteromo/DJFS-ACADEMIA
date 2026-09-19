import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Check, Clock, Mail, MapPin, Send } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";
import { SITE, focus } from ".//SiteLayout";

/* -------------------------------------------------------------------------- */
/*  Datos                                                                      */
/* -------------------------------------------------------------------------- */

type ReasonId = "booking" | "remix" | "compra" | "academia" | "otro";

const reasons: { id: ReasonId; label: string }[] = [
  { id: "booking", label: "Contratar un DJ" },
  { id: "remix", label: "Remix a medida" },
//   { id: "compra", label: "Ayuda con una compra" },
//   { id: "academia", label: "Academia DJ" },
//   { id: "otro", label: "Otro tema" },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  reason: ReasonId;
  eventDate: string;
  eventPlace: string;
  message: string;
};

type Errors = Partial<Record<"name" | "contact" | "message", string>>;

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  reason: "booking",
  eventDate: "",
  eventPlace: "",
  message: "",
};

const channels: { icon: ReactNode; label: string; value: string; href?: string }[] = [
  {
    icon: <SiWhatsapp size={16} aria-hidden />,
    label: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: `https://wa.me/${SITE.whatsapp}`,
  },
  {
    icon: <Mail size={16} aria-hidden />,
    label: "Correo",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  { icon: <MapPin size={16} aria-hidden />, label: "Ubicación", value: SITE.location },
  { icon: <Clock size={16} aria-hidden />, label: "Horario", value: SITE.hours },
];

const socials = [
  { label: "Instagram", href: SITE.socials.instagram, icon: <SiInstagram size={18} /> },
  { label: "YouTube", href: SITE.socials.youtube, icon: <SiYoutube size={18} /> },
  { label: "Facebook", href: SITE.socials.facebook, icon: <SiFacebook size={18} /> },
  { label: "TikTok", href: SITE.socials.tiktok, icon: <SiTiktok size={18} /> },
];

/* -------------------------------------------------------------------------- */
/*  Utilidades                                                                 */
/* -------------------------------------------------------------------------- */

const inputClass =
  "w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";

const labelClass = "mb-1 block text-[11px] text-white/50";

const errorClass = "mt-1 text-xs text-red-300";

const buildMessage = (form: FormState) => {
  const reason = reasons.find((r) => r.id === form.reason)?.label ?? "";
  const lines = [
    `Hola ${SITE.name}, soy ${form.name.trim()}.`,
    `Tema: ${reason}`,
  ];

  if (form.reason === "booking") {
    if (form.eventDate) lines.push(`Fecha del evento: ${form.eventDate}`);
    if (form.eventPlace.trim()) lines.push(`Lugar: ${form.eventPlace.trim()}`);
  }

  lines.push("", form.message.trim(), "");
  if (form.phone.trim()) lines.push(`WhatsApp: ${form.phone.trim()}`);
  if (form.email.trim()) lines.push(`Correo: ${form.email.trim()}`);

  return lines.join("\n");
};

const whatsappUrl = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

const mailUrl = (text: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent("Consulta desde la web")}&body=${encodeURIComponent(text)}`;

/* -------------------------------------------------------------------------- */
/*  Componente                                                                 */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sentText, setSentText] = useState<string | null>(null);

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const next: Errors = {};
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!form.name.trim()) next.name = "Escribe tu nombre.";
    if (!phone && !email) {
      next.contact = "Déjanos un WhatsApp o un correo para poder responderte.";
    } else if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      next.contact = "Revisa el correo: parece incompleto.";
    }
    if (form.message.trim().length < 10) {
      next.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Aquí puedes reemplazar WhatsApp por una llamada a tu backend:
    // await fetch("/api/contacto", { method: "POST", body: JSON.stringify(form) })
    const text = buildMessage(form);
    setSentText(text);
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  const sendAnother = () => {
    setForm(emptyForm);
    setErrors({});
    setSentText(null);
  };

  return (
    <>
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-12 pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          {/* ------------------------- Canales directos ------------------------- */}
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Contacto
            </p>
            <h1 className="text-3xl font-normal uppercase leading-[1.1] tracking-tight md:text-4xl">
              Hablemos de tu evento
            </h1>
            <p className="mt-5 max-w-[420px] text-sm leading-6 text-white/70">
              Cuéntanos qué necesitas: un DJ para tu fiesta, un remix a tu medida
              o ayuda con una compra. Escríbenos por el canal que prefieras.
            </p>

            <ul className="mt-8 space-y-3">
              {channels.map((channel) => {
                const content = (
                  <>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white">
                      {channel.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-400">{channel.label}</div>
                      <div className="mt-1 truncate text-sm font-medium text-white">
                        {channel.value}
                      </div>
                    </div>
                  </>
                );

                return (
                  <li key={channel.label}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-xl bg-white/[0.02] px-2 py-2 transition hover:bg-white/[0.06] ${focus}`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-2 py-2">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="mb-3 text-[11px] text-white/50">Síguenos</p>
              <div className="flex items-center gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`text-white/75 transition hover:text-white ${focus}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------------------- Formulario ---------------------------- */}
          <div className="rounded-lg border border-white/10 bg-black p-6 md:p-8">
            {sentText ? (
              <div role="status" className="flex flex-col items-start gap-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f9eb] text-black">
                  <Check size={18} aria-hidden />
                </div>
                <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight">
                  Tu mensaje está listo
                </h2>
                <p className="max-w-[440px] text-sm leading-6 text-white/70">
                  Abrimos WhatsApp con tu mensaje escrito. Solo falta que pulses
                  enviar. Si no se abrió, usa uno de estos botones.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappUrl(sentText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80 ${focus}`}
                  >
                    <SiWhatsapp size={16} aria-hidden />
                    Abrir WhatsApp
                  </a>
                  <a
                    href={mailUrl(sentText)}
                    className={`inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 ${focus}`}
                  >
                    <Mail size={16} aria-hidden />
                    Enviar por correo
                  </a>
                  <button
                    type="button"
                    onClick={sendAnother}
                    className={`rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`}
                  >
                    Escribir otro mensaje
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight">
                  Escríbenos
                </h2>
                <p className="mt-2 text-[11px] text-white/50">
                  Los campos con * son obligatorios.
                </p>

                <fieldset className="mt-6">
                  <legend className={labelClass}>¿Sobre qué quieres hablar?</legend>
                  <div className="flex flex-wrap gap-2">
                    {reasons.map((reason) => {
                      const selected = form.reason === reason.id;
                      return (
                        <label key={reason.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="reason"
                            value={reason.id}
                            checked={selected}
                            onChange={() =>
                              setForm((current) => ({ ...current, reason: reason.id }))
                            }
                            className="peer sr-only"
                          />
                          <span
                            className={`block rounded-full border px-4 py-2 text-xs transition peer-focus-visible:ring-1 peer-focus-visible:ring-white/60 ${
                              selected
                                ? "border-white bg-white font-medium text-black"
                                : "border-white/15 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {reason.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className={labelClass}>Nombre *</label>
                    <input
                      id="c-name"
                      value={form.name}
                      onChange={update("name")}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "c-name-error" : undefined}
                      className={inputClass}
                    />
                    {errors.name && (
                      <p id="c-name-error" role="alert" className={errorClass}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="c-phone" className={labelClass}>WhatsApp</label>
                    <input
                      id="c-phone"
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      autoComplete="tel"
                      placeholder="300 000 0000"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="c-email" className={labelClass}>Correo</label>
                    <input
                      id="c-email"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      autoComplete="email"
                      placeholder="tucorreo@ejemplo.com"
                      aria-invalid={Boolean(errors.contact)}
                      aria-describedby="c-contact-help"
                      className={inputClass}
                    />
                    <p
                      id="c-contact-help"
                      role={errors.contact ? "alert" : undefined}
                      className={errors.contact ? errorClass : "mt-1 text-[11px] text-white/40"}
                    >
                      {errors.contact ?? "Déjanos al menos uno: WhatsApp o correo."}
                    </p>
                  </div>

                  {form.reason === "booking" && (
                    <>
                      <div>
                        <label htmlFor="c-date" className={labelClass}>Fecha del evento</label>
                        <input
                          id="c-date"
                          type="date"
                          value={form.eventDate}
                          onChange={update("eventDate")}
                          className={`${inputClass} [color-scheme:dark]`}
                        />
                      </div>
                      <div>
                        <label htmlFor="c-place" className={labelClass}>Lugar del evento</label>
                        <input
                          id="c-place"
                          value={form.eventPlace}
                          onChange={update("eventPlace")}
                          placeholder="Ciudad o municipio"
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}

                  <div className="sm:col-span-2">
                    <label htmlFor="c-message" className={labelClass}>Mensaje *</label>
                    <textarea
                      id="c-message"
                      value={form.message}
                      onChange={update("message")}
                      rows={5}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "c-message-error" : undefined}
                      placeholder="Cuéntanos de qué se trata tu evento o qué necesitas."
                      className={`${inputClass} resize-none leading-6`}
                    />
                    {errors.message && (
                      <p id="c-message-error" role="alert" className={errorClass}>
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80 ${focus}`}
                  >
                    <Send size={16} aria-hidden />
                    Enviar por WhatsApp
                  </button>
                  <p className="text-[11px] text-white/40">
                    Se abre WhatsApp con tu mensaje listo para enviar.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}