import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Disc3, GraduationCap, Headphones } from "lucide-react";
import { LOGO, focus } from ".//SiteLayout";

/* -------------------------------------------------------------------------- */
/*  Contenido (edita los textos aquí)                                          */
/* -------------------------------------------------------------------------- */

const pillars: { icon: ReactNode; title: string; note: string; text: string }[] = [
  {
    icon: <Disc3 size={18} aria-hidden />,
    title: "Remix",
    note: "Desde $5.000",
    text: "Versiones hechas por nuestros DJs para poner a bailar tu evento. Escúchalas, compra la que te guste y descárgala.",
  },
  {
    icon: <Headphones size={18} aria-hidden />,
    title: "Mix",
    note: "Gratis",
    text: "Sets completos para escuchar y descargar sin costo. Son mixes no limpios que llevan el sello del DJ y no se pueden editar.",
  },
  {
    icon: <GraduationCap size={18} aria-hidden />,
    title: "Academia DJFS",
    note: "Escríbenos para unirte",
    text: "Un espacio para quienes quieren aprender y mostrar su talento como DJ. Si quieres ser parte, cuéntanos.",
  },
];

const steps = [
  {
    title: "Explora y escucha",
    text: "Busca por remix, mix o DJ y pon play para escuchar antes de decidir.",
  },
  {
    title: "Compra o descarga",
    text: "Los remix se compran desde $5.000. Los mixes se descargan gratis.",
  },
  {
    title: "Disfruta en tu evento",
    text: "Llévate la música lista para tu pista y haz que tu evento sea inolvidable.",
  },
];

const djs = [
  { name: "DJ Nova", image: "/perfiles_img/ad.png" },
  { name: "Pulse Harbor", image: "/perfiles_img/ar.png" },
  { name: "DJ Nova Mix", image: "/perfiles_img/Perfil_jaider_mix.png" },
  { name: "John Carter", image: "/perfiles_img/jc.png" },
  { name: "DJ Wren", image: "/perfiles_img/wl.png" },
  { name: "William Stone", image: "/perfiles_img/williian.png" },
  { name: "DJ North", image: "/perfiles_img/jn.png" },
];

/* -------------------------------------------------------------------------- */
/*  Piezas                                                                     */
/* -------------------------------------------------------------------------- */

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="pr-4">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
        {eyebrow}
      </div>
      <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
        {title}
      </h2>
      {children && (
        <p className="mt-3 max-w-[200px] text-[10px] font-medium leading-5 tracking-[0.12em] text-white/60">
          {children}
        </p>
      )}
    </div>
  );
}

const primaryBtn = `inline-flex items-center gap-3 rounded-xl border border-white/20 px-6 py-3 text-lg font-light text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition hover:bg-white/10 ${focus}`;

const pill = `rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`;

/* -------------------------------------------------------------------------- */
/*  Página                                                                     */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <>
      {/* -------------------------------- Hero -------------------------------- */}
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-6 pb-12 pt-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Sobre nosotros
            </p>
            <h1 className="max-w-[560px] text-3xl font-normal uppercase leading-[1.1] tracking-tight md:text-5xl">
              Música electrónica del Huila para tus eventos
            </h1>
            <p className="mt-6 max-w-[460px] text-sm leading-6 text-white/70">
              DJFS Producciones reúne remix y mixes de DJs del Huila en un solo
              lugar. Compra, descarga y disfruta música lista para que tu
              evento sea inolvidable.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/" className={primaryBtn}>
                Explorar tienda<span aria-hidden="true">→</span>
              </Link>
              <Link to="/dj-profile" className={pill}>
                Conocer a los DJs
              </Link>
            </div>
          </div>

          <div className="relative h-[260px] w-full overflow-hidden rounded-lg border border-white/10 bg-black md:h-[420px]">
            <img
              src="/Banner/Banner.png"
              alt="DJ mezclando en un evento de DJFS Producciones"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
            <img
              src={LOGO}
              alt=""
              className="absolute bottom-4 right-4 h-12 w-12 object-contain"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------ Qué ofrecemos ------------------------- */}
      <section className="border-b border-white/10 bg-black py-10">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid gap-8 md:grid-cols-[0.4fr_1fr_1fr_1fr]">
            <SectionIntro eyebrow="Qué hacemos" title={<>Tres formas de<br />vivir la música</>}>
              Todo en un mismo lugar.
            </SectionIntro>

            {pillars.map((pillar) => (
              <article key={pillar.title} className="space-y-4 md:border-l md:border-white/10 md:pl-6">
                {/* <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#111111] text-white">
                  {pillar.icon}
                </div> */}
                <div>
                  <h3 className="text-sm font-semibold text-white">{pillar.title}</h3>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      pillar.note === "Gratis" ? "text-[#b5f7c4]" : "text-white/50"
                    }`}
                  >
                    {pillar.note}
                  </p>
                </div>
                <p className="max-w-[300px] text-sm leading-6 text-white/70">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Cómo funciona ------------------------- */}
      <section className="border-b border-white/10 bg-black py-10">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid gap-8 md:grid-cols-[0.4fr_3fr]">
            <SectionIntro eyebrow="Cómo funciona" title={<>Compra,<br />descarga<br />y disfruta</>} />

            <ol className="grid gap-6 md:grid-cols-3 md:border-l md:border-white/10 md:pl-6">
              {steps.map((step, index) => (
                <li key={step.title} className="border-t border-white/20 pt-4">
                  <span className="text-sm tabular-nums text-white/40">{index + 1}</span>
                  <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-[280px] text-sm leading-6 text-white/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* -------------------------------- DJs --------------------------------- */}
      <section className="border-b border-white/10 bg-black py-10">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid gap-8 md:grid-cols-[0.4fr_3fr]">
            <SectionIntro eyebrow="Nuestros DJs" title={<>DJs<br />DJFS</>}>
              Artistas de Isnos, Huila, con lo mejor del crossover.
            </SectionIntro>

            <ul className="flex flex-wrap gap-x-6 gap-y-6 md:border-l md:border-white/10 md:pl-6">
              {djs.map((dj) => (
                <li key={dj.name}>
                  <Link
                    to="/dj-profile"
                    className={`group flex w-24 flex-col items-center gap-3 text-center ${focus}`}
                  >
                    <span className="relative h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-[#111111] transition group-hover:border-white/50">
                      <img
                        src={dj.image}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-white/70 transition group-hover:text-white">
                      {dj.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------- Cierre ------------------------------ */}
      <section className="bg-black py-10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
              ¿Tienes un evento o quieres ser DJ?
            </h2>
            <p className="mt-3 max-w-[440px] text-sm leading-6 text-white/60">
              Escríbenos y te contamos cómo contratar a uno de nuestros DJs o
              cómo unirte a la Academia DJFS.
            </p>
          </div>

          <Link to="/contacto" className={`${primaryBtn} w-fit`}>
            Escríbenos
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}