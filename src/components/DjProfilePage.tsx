import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowLeft,
  Camera,
  Check,
  MapPin,
  Music,
  Pause,
  Pencil,
  Play,
  Plus,
  ShoppingCart,
  Trash2,
  Upload,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Tipos y datos                                                              */
/* -------------------------------------------------------------------------- */

type TrackType = "mix" | "remix";

type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string; // "m:ss"
  price: number; // 0 = gratis (COP)
  type: TrackType;
  audioUrl?: string; // URL local del audio subido (luego será la URL de tu servidor)
  fileName?: string;
  fileSize?: number;
};

type Draft = {
  title: string;
  artist: string;
  duration: string;
  price: string;
  audioUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
};

const DEFAULT_AVATAR = "/perfiles_img/";
const LOGO = "/logos/DJFS_PRODUCCIONES_blanco.png";
const DEFAULT_DJ = "DJ Nova Mix";

const initialTracks: Track[] = [
  { id: 1, title: "Neon Drift", artist: DEFAULT_DJ, duration: "6:12", price: 5000, type: "remix" },
  { id: 2, title: "Night Pulse", artist: DEFAULT_DJ, duration: "4:09", price: 5000, type: "remix" },
  { id: 3, title: "Midnight Circuit", artist: DEFAULT_DJ, duration: "5:48", price: 0, type: "mix" },
  { id: 4, title: "Solar Run", artist: DEFAULT_DJ, duration: "4:57", price: 0, type: "mix" },
];

const emptyDraft = (artist: string): Draft => ({
  title: "",
  artist,
  duration: "4:00",
  price: "0",
  audioUrl: null,
  fileName: null,
  fileSize: null,
});

const formatPrice = (price: number) => (price === 0 ? "Gratis" : `$${price.toLocaleString("es-CO")}`);

const formatDuration = (seconds: number) => {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/* -------------------------------------------------------------------------- */
/*  Estilos (los mismos que usas en el home)                                   */
/* -------------------------------------------------------------------------- */

const focus = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60";

const pill = `rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 ${focus}`;

const roundBtn = `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 ${focus}`;

const inputClass =
  "w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";

const labelClass = "mb-1 block text-[11px] text-white/50";

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
/*  Fila de canción (igual a las del home)                                     */
/* -------------------------------------------------------------------------- */

type TrackRowProps = {
  track: Track;
  isEditing: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function TrackRow({ track, isEditing, isPlaying, onTogglePlay, onEdit, onDelete }: TrackRowProps) {
  const isFree = track.price === 0;

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-2 py-2">
      <button
        type="button"
        onClick={onTogglePlay}
        aria-pressed={isPlaying}
        aria-label={`${isPlaying ? "Pausar" : "Reproducir"} ${track.title}`}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white transition hover:bg-white/10 ${focus}`}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">{track.title}</div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
          <span>{track.duration}</span>
          <span className="truncate uppercase tracking-[0.12em]">{track.artist}</span>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <span className={`w-16 shrink-0 text-sm font-semibold ${isFree ? "text-[#b5f7c4]" : "text-white"}`}>
          {formatPrice(track.price)}
        </span>

        {isEditing ? (
          <>
            <button type="button" onClick={onEdit} className={roundBtn} aria-label={`Editar ${track.title}`}>
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className={`${roundBtn} hover:!bg-red-500/20`}
              aria-label={`Eliminar ${track.title}`}
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : isFree ? (
          <button
            type="button"
            aria-label={`Descargar ${track.title}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#e8f9eb] text-black transition hover:bg-white"
          >
            <ArrowDownToLine size={14} />
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Agregar ${track.title} al carrito`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white text-black transition hover:bg-white/80"
          >
            <ShoppingCart size={14} />
          </button>
        )}
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                     */
/* -------------------------------------------------------------------------- */

export default function DjProfilePage() {
  const [profileName, setProfileName] = useState(DEFAULT_DJ);
  const [profileBio, setProfileBio] = useState(
    "Electronic DJ blending club energy with smooth, high-impact mixes and a direct connection to the dance floor.",
  );
  const [profileLocation, setProfileLocation] = useState("City Center, Colombia");
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState<TrackType>("remix"); // remix por defecto
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft(DEFAULT_DJ));
  const [formError, setFormError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [playingId, setPlayingId] = useState<number | null>(null);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const catalogRef = useRef<HTMLElement | null>(null);
  const photoUrlRef = useRef<string | null>(null);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;

  const visibleTracks = useMemo(() => tracks.filter((t) => t.type === activeTab), [tracks, activeTab]);
  const counts = useMemo(
    () => ({
      remix: tracks.filter((t) => t.type === "remix").length,
      mix: tracks.filter((t) => t.type === "mix").length,
    }),
    [tracks],
  );

  const noun = activeTab === "remix" ? "remix" : "mix";

  /* --- Al entrar, baja hasta la mitad para que se vea el catálogo --- */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const el = catalogRef.current;
      if (!el || window.scrollY > 50) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.max(0, top - window.innerHeight * 0.5),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  /* --- Limpieza de URLs locales al salir --- */
  useEffect(() => {
    return () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      tracksRef.current.forEach((t) => t.audioUrl && URL.revokeObjectURL(t.audioUrl));
    };
  }, []);

  /* --- Reproducción: usa el audio subido; los tracks de ejemplo solo marcan estado --- */
  const togglePlay = (track: Track) => {
    const audio = audioRef.current;
    if (playingId === track.id) {
      audio?.pause();
      setPlayingId(null);
      return;
    }
    setPlayingId(track.id);
    if (audio && track.audioUrl) {
      audio.src = track.audioUrl;
      audio.play().catch(() => setPlayingId(null));
    } else {
      audio?.pause();
    }
  };

  /* --- Formulario --- */
  const discardPendingAudio = () => {
    const existing = editingId !== null ? tracks.find((t) => t.id === editingId)?.audioUrl : undefined;
    if (draft.audioUrl && draft.audioUrl !== existing) URL.revokeObjectURL(draft.audioUrl);
  };

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormError("");
    setDraft(emptyDraft(profileName));
  };

  const closeForm = () => {
    discardPendingAudio();
    resetForm();
  };

  const openNew = () => {
    if (formOpen) discardPendingAudio();
    setEditingId(null);
    setFormError("");
    setDraft(emptyDraft(profileName));
    setFormOpen(true);
  };

  const editTrack = (track: Track) => {
    if (formOpen) discardPendingAudio();
    setEditingId(track.id);
    setFormError("");
    setDraft({
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      price: String(track.price),
      audioUrl: track.audioUrl ?? null,
      fileName: track.fileName ?? null,
      fileSize: track.fileSize ?? null,
    });
    setFormOpen(true);
  };

  const selectTab = (type: TrackType) => {
    if (type === activeTab) return;
    if (formOpen) closeForm();
    setActiveTab(type);
  };

  const handleAudioFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setFormError("Sube un archivo de audio (MP3, WAV, etc.).");
      return;
    }
    setFormError("");
    discardPendingAudio();

    const url = URL.createObjectURL(file);
    setDraft((d) => ({
      ...d,
      audioUrl: url,
      fileName: file.name,
      fileSize: file.size,
      title: d.title || file.name.replace(/\.[^/.]+$/, ""),
    }));

    // Lee la duración real del audio
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = url;
    probe.onloadedmetadata = () => {
      if (Number.isFinite(probe.duration)) {
        setDraft((d) => (d.audioUrl === url ? { ...d, duration: formatDuration(probe.duration) } : d));
      }
    };
  };

  const removeDraftAudio = () => {
    discardPendingAudio();
    setDraft((d) => ({ ...d, audioUrl: null, fileName: null, fileSize: null }));
  };

  const saveTrack = (event: FormEvent) => {
    event.preventDefault();

    const title = draft.title.trim();
    if (editingId === null && !draft.audioUrl) {
      setFormError("Sube el archivo de audio para continuar.");
      return;
    }
    if (!title) {
      setFormError("Escribe el título para continuar.");
      return;
    }
    if (!/^\d{1,2}:[0-5]\d$/.test(draft.duration.trim())) {
      setFormError("La duración debe tener el formato m:ss, por ejemplo 4:30.");
      return;
    }

    const values = {
      title,
      artist: draft.artist.trim() || profileName,
      duration: draft.duration.trim(),
      price: Number(draft.price.replace(/\D/g, "")) || 0,
      audioUrl: draft.audioUrl ?? undefined,
      fileName: draft.fileName ?? undefined,
      fileSize: draft.fileSize ?? undefined,
    };

    if (editingId !== null) {
      const previous = tracks.find((t) => t.id === editingId);
      if (previous?.audioUrl && previous.audioUrl !== draft.audioUrl) URL.revokeObjectURL(previous.audioUrl);
      setTracks((current) => current.map((t) => (t.id === editingId ? { ...t, ...values } : t)));
    } else {
      setTracks((current) => [{ id: Date.now(), type: activeTab, ...values }, ...current]);
    }
    resetForm();
  };

  const deleteTrack = (id: number) => {
    const track = tracks.find((t) => t.id === id);
    if (editingId === id) closeForm();
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    if (track?.audioUrl) URL.revokeObjectURL(track.audioUrl);
    setTracks((current) => current.filter((t) => t.id !== id));
  };

  /* --- Perfil --- */
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    const url = URL.createObjectURL(file);
    photoUrlRef.current = url;
    setProfileImage(url);
  };

  const toggleEditing = () => {
    if (isEditing && formOpen) closeForm();
    setIsEditing((v) => !v);
  };

  /* ------------------------------------------------------------------------ */

  return (
    <>
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-[1600px] px-6 pb-10 pt-6">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white ${focus}`}
            >
              <ArrowLeft size={14} aria-hidden />
              Volver
            </Link>

            <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="flex flex-col justify-center md:w-[38%]">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">Perfil DJ</p>

                {isEditing ? (
                  <>
                    <label htmlFor="dj-name" className="sr-only">Nombre artístico</label>
                    <input
                      id="dj-name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border-b border-white/20 bg-transparent pb-1 text-3xl font-normal uppercase tracking-tight text-white focus:border-white/50 focus:outline-none md:text-4xl"
                    />
                  </>
                ) : (
                  <h1 className="flex items-center gap-2 text-3xl font-normal uppercase tracking-tight md:text-4xl">
                    {profileName}
                    <VerifiedBadge className="h-5 w-5" />
                  </h1>
                )}

                {isEditing ? (
                  <div className="mt-3 flex items-center gap-2">
                    <MapPin size={14} aria-hidden className="shrink-0 text-white/60" />
                    <label htmlFor="dj-location" className="sr-only">Lugar donde vive el DJ</label>
                    <input
                      id="dj-location"
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                      placeholder="Ciudad, departamento, país"
                      className="w-full max-w-[320px] border-b border-white/20 bg-transparent pb-1 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                    <MapPin size={14} aria-hidden />
                    {profileLocation}
                  </p>
                )}

                {isEditing ? (
                  <>
                    <label htmlFor="dj-bio" className="sr-only">Descripción</label>
                    <textarea
                      id="dj-bio"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      rows={4}
                      className={`${inputClass} mt-5 max-w-[440px] resize-none leading-6`}
                    />
                  </>
                ) : (
                  <p className="mt-5 max-w-[440px] text-sm leading-6 text-white/70">{profileBio}</p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {isEditing ? (
                    <>
                      <button type="button" className={pill}>Publicar cambios</button>
                      <button type="button" onClick={toggleEditing} className={pill}>Salir de edición</button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-3 rounded-xl border border-white/20 px-6 py-3 text-lg font-light text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition hover:bg-white/10 ${focus}`}
                      >
                        Contactar para bookings<span aria-hidden="true">→</span>
                      </button>
                      <button type="button" onClick={toggleEditing} className={pill}>Editar perfil</button>
                    </>
                  )}
                </div>
              </div>

              {/* Imagen: mismo tratamiento que las tarjetas de "DJs destacados" */}
              <div className="relative h-[260px] w-full overflow-hidden rounded-lg border border-white/10 bg-black md:h-[340px] md:flex-1">
                <div
                  className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat opacity-50 blur-md"
                  style={{ backgroundImage: `url('${profileImage}')` }}
                />
                <img
                  src={profileImage}
                  alt={profileName}
                  draggable={false}
                  className="relative z-10 h-full w-full object-contain"
                />
                <img
                  src={LOGO}
                  alt=""
                  className="absolute bottom-3 left-1/2 z-20 h-9 w-9 -translate-x-1/2 object-contain"
                />

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white text-black transition hover:bg-white/80"
                      aria-label="Cambiar foto de perfil"
                    >
                      <Camera size={15} />
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------- Catálogo DJ ------------------------- */}
  <section id="catalogo" ref={catalogRef} className="border-b border-white/10 bg-black py-6">
  <div className="mx-auto max-w-[820px] px-6 pb-8">
    {/* Título centrado */}
    <div className="mb-10 text-center">
      <h2 className="text-[22px] font-normal uppercase leading-none tracking-tight text-white">
        Catálogo DJ {profileName}
      </h2>
      {/* <p className="mt-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-white/70">
        {profileName}
        <VerifiedBadge />
      </p> */}
    </div>

    {/* Tabs arriba, centrados */}
    <div className="mb-6 flex flex-col items-center gap-4">
      <div
        role="tablist"
        aria-labelledby="tabs-label"
        className="flex w-full max-w-[420px] overflow-hidden rounded-xl border border-white/25"
      >
        {(["remix", "mix"] as const).map((type, i) => {
          const selected = activeTab === type;
          return (
            <button
              key={type}
              id={`tab-${type}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="catalogo-panel"
              onClick={() => selectTab(type)}
              className={`flex flex-1 items-center justify-center gap-2 px-5 py-3 text-base font-medium transition ${focus} ${
                i === 1 ? "border-l border-white/25" : ""
              } ${selected ? "bg-white text-black" : "bg-white/[0.06] text-white hover:bg-white/15"}`}
            >
              {type === "remix" ? "Remix" : "Mix"}
              <span
                className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs tabular-nums ${
                  selected ? "bg-black/10 text-black" : "bg-white/15 text-white"
                }`}
              >
                {counts[type]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botón "Nuevo" centrado debajo de los tabs */}
      {isEditing && (
        <button
          type="button"
          onClick={openNew}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#b5f7c4]/40 bg-[#e8f9eb] px-5 py-3 text-base font-medium text-black transition hover:bg-white ${focus}`}
        >
          <Plus size={18} aria-hidden />
          Nuevo {noun}
        </button>
      )}
    </div>

    {/* Lista debajo, más ancha */}
    <div
      id="catalogo-panel"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      className="mx-auto w-full"
    >
      {/* <p className="mb-6 text-center text-[11px] font-medium leading-5 tracking-[0.08em] text-white/60">
        {activeTab === "remix"
          ? "Descubre las creaciones de este DJ para tus eventos."
          : "Mixes no limpios, usan el sello del DJ, prohibida su edición."}
      </p> */}

      {/* Formulario con subida de audio */}
      {isEditing && formOpen && (
        <form onSubmit={saveTrack} className="mb-8 border-b border-white/10 pb-8">
          <div className="mb-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              {editingId !== null ? `Editar ${noun}` : `Nuevo ${noun}`}
            </div>
            <p className="mt-2 text-sm text-white/60">
              Catálogo DJ <span className="uppercase tracking-[0.12em] text-white">{profileName}</span>
            </p>
          </div>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              handleAudioFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {draft.audioUrl && draft.fileName ? (
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white">
                <Music size={16} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{draft.fileName}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {draft.fileSize ? `${formatSize(draft.fileSize)}  ` : ""}
                  {draft.duration}
                </p>
              </div>
              <button type="button" onClick={() => audioInputRef.current?.click()} className={pill}>
                Cambiar
              </button>
              <button type="button" onClick={removeDraftAudio} className={roundBtn} aria-label="Quitar audio">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleAudioFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-9 text-center transition ${focus} ${
                isDragging ? "border-white/60 bg-white/5" : "border-white/20 hover:bg-white/[0.03]"
              }`}
            >
              <Upload size={20} className="text-white/70" aria-hidden />
              <span className="text-sm text-white">Arrastra tu audio aquí o haz clic para elegirlo</span>
              <span className="text-[11px] text-white/50">MP3, WAV o cualquier formato de audio</span>
            </button>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_110px_150px]">
            <div>
              <label htmlFor="t-title" className={labelClass}>Título</label>
              <input
                id="t-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="t-artist" className={labelClass}>Nombre del DJ</label>
              <input
                id="t-artist"
                value={draft.artist}
                onChange={(e) => setDraft((d) => ({ ...d, artist: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="t-duration" className={labelClass}>Duración</label>
              <input
                id="t-duration"
                value={draft.duration}
                onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))}
                placeholder="4:00"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="t-price" className={labelClass}>Precio (0 = gratis)</label>
              <input
                id="t-price"
                inputMode="numeric"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          {formError && (
            <p role="alert" className="mt-3 text-xs text-red-300">
              {formError}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button type="submit" className={pill}>
              {editingId !== null ? "Guardar cambios" : `Publicar ${noun}`}
            </button>
            <button type="button" onClick={closeForm} className={pill}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Lista */}
      {visibleTracks.length === 0 ? (
        <p className="py-4 text-center text-sm text-white/50">
          {isEditing
            ? `Aún no has subido ningún ${noun}.`
            : `Este DJ todavía no ha publicado ${noun === "remix" ? "remixes" : "mixes"}.`}
        </p>
      ) : (
        <ul className="space-y-3">
          {visibleTracks.map((track) => (
            <TrackRow
              key={track.id}
              track={track}
              isEditing={isEditing}
              isPlaying={playingId === track.id}
              onTogglePlay={() => togglePlay(track)}
              onEdit={() => editTrack(track)}
              onDelete={() => deleteTrack(track.id)}
            />
          ))}
        </ul>
      )}
    </div>
  </div>
</section>
      </main>
    </>
  );
}