"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { MAKES, MAKE_MODELS, EXTERIOR_COLORS, INTERIOR_COLORS, PREFECTURES } from "@/lib/site";
import {
  VEHICLE_STATUSES,
  BODY_TYPE_VALUES,
  BODY_TYPE_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
  FUELS,
  FUEL_LABELS,
  DRIVETRAINS,
  STEERINGS,
  SOURCE_TYPES,
} from "@/lib/vehicle-constants";
import { digitsOnly, formatDigitsWithCommas } from "@/lib/format";
import {
  buildVehicleMetaDescription,
  buildVehicleMetaTitle,
  resolveVehicleMetaDescription,
  resolveVehicleMetaTitle,
} from "@/lib/seo";

type FormState = {
  make: string;
  model: string;
  variant: string;
  year: string;
  registrationMonth: string;
  price: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  steering: string;
  bodyType: string;
  engineCc: string;
  exteriorColor: string;
  interiorColor: string;
  location: string;
  vin: string;
  description: string;
  features: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
  featured: boolean;
  sourceType: string;
  sourceUrl: string;
  sourceListingId: string;
  availabilityCheckLocked: boolean;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR + 1 - i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const EMPTY: FormState = {
  make: "",
  model: "",
  variant: "",
  year: String(CURRENT_YEAR),
  registrationMonth: "",
  price: "",
  mileage: "",
  transmission: "AUTOMATIC",
  fuelType: "PETROL",
  drivetrain: "",
  steering: "RHD",
  bodyType: "",
  engineCc: "",
  exteriorColor: "",
  interiorColor: "",
  location: "",
  vin: "",
  description: "",
  features: "",
  metaTitle: "",
  metaDescription: "",
  status: "DRAFT",
  featured: false,
  sourceType: "",
  sourceUrl: "",
  sourceListingId: "",
  availabilityCheckLocked: false,
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  NEEDS_REVIEW: "Needs review",
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
  UNAVAILABLE: "Unavailable",
  ARCHIVED: "Archived",
};

const DRIVETRAIN_LABELS: Record<string, string> = {
  FWD: "FWD",
  RWD: "RWD",
  AWD: "AWD",
  FOUR_WD: "4WD",
};

const STEERING_LABELS: Record<string, string> = {
  RHD: "Right-hand drive (RHD)",
  LHD: "Left-hand drive (LHD)",
};

function titleCaseEnum(value: string): string {
  return value
    .split("_")
    .map((w) => (w ? w.charAt(0) + w.slice(1).toLowerCase() : w))
    .join(" ");
}

function statusColor(status: string): { bg: string; color: string } {
  switch (status) {
    case "AVAILABLE":
      return { bg: "rgba(168,132,26,0.14)", color: "var(--gold-soft)" };
    case "RESERVED":
      return { bg: "rgba(20,18,15,0.08)", color: "var(--ink)" };
    case "SOLD":
      return { bg: "rgba(176,32,58,0.12)", color: "var(--crimson)" };
    case "NEEDS_REVIEW":
      return { bg: "rgba(176,32,58,0.08)", color: "var(--crimson)" };
    case "UNAVAILABLE":
      return { bg: "rgba(176,32,58,0.16)", color: "var(--crimson)" };
    case "ARCHIVED":
      return { bg: "rgba(20,18,15,0.05)", color: "var(--muted)" };
    default:
      return { bg: "rgba(20,18,15,0.06)", color: "var(--muted)" };
  }
}

function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function vehicleToForm(v: Vehicle): FormState {
  return {
    make: v.make,
    model: v.model,
    variant: v.variant || "",
    year: String(v.year),
    registrationMonth: v.registrationMonth ? String(v.registrationMonth) : "",
    price: String(v.price),
    mileage: String(v.mileage),
    transmission: v.transmission || "AUTOMATIC",
    fuelType: v.fuelType || "PETROL",
    drivetrain: v.drivetrain || "",
    steering: v.steering || "RHD",
    bodyType: v.bodyType || "",
    engineCc: v.engineCc ? String(v.engineCc) : "",
    exteriorColor: v.exteriorColor || "",
    interiorColor: v.interiorColor || "",
    location: v.location || "",
    vin: v.vin || "",
    description: v.description,
    features: v.features.join(", "),
    metaTitle: v.metaTitle || "",
    metaDescription: v.metaDescription || "",
    status: v.status,
    featured: v.featured,
    sourceType: v.sourceType || "",
    sourceUrl: v.sourceUrl || "",
    sourceListingId: v.sourceListingId || "",
    availabilityCheckLocked: v.availabilityCheckLocked,
  };
}

export function AdminDashboard({ initialVehicleId }: { initialVehicleId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [autosaveMsg, setAutosaveMsg] = useState<string | null>(null);
  const [list, setList] = useState<Vehicle[]>([]);
  const formSectionRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skipAutosaveRef = useRef(false);

  const loadList = useCallback(async () => {
    const res = await fetch("/api/vehicles");
    if (res.ok) setList((await res.json()).items);
  }, []);

  useEffect(() => {
    // Initial inventory load for admin list.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount fetch
    void loadList();
  }, [loadList]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function startEdit(v: Vehicle) {
    skipAutosaveRef.current = true;
    setEditingId(v.id);
    setEditingVehicle(v);
    setForm(vehicleToForm(v));
    setImages([...v.images]);
    setErrors({});
    setMessage(null);
    setAutosaveMsg(null);
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    if (!initialVehicleId) return;
    (async () => {
      const res = await fetch(`/api/vehicles/${initialVehicleId}`);
      if (res.ok) {
        const { vehicle } = await res.json();
        startEdit(vehicle);
      }
    })();
  }, [initialVehicleId]);

  async function uploadFiles(files: FileList | File[]) {
    const toUpload = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (toUpload.length === 0) {
      setMessage({ type: "err", text: "Please drop image files only (JPEG, PNG, WebP, AVIF)." });
      return;
    }
    setUploading(true);
    setMessage(null);
    const fd = new FormData();
    toUpload.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { urls } = await res.json();
      setImages((prev) => [...prev, ...urls]);
      setMessage({ type: "ok", text: `Uploaded ${urls.length} photo${urls.length === 1 ? "" : "s"}.` });
    } else {
      setMessage({ type: "err", text: (await res.json()).error || "Upload failed" });
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
    e.target.value = "";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setDragOver(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (uploading) return;
    const files = e.dataTransfer.files;
    if (files?.length) await uploadFiles(files);
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function setCover(index: number) {
    setImages((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    skipAutosaveRef.current = false;
    setEditingId(null);
    setEditingVehicle(null);
    setForm({ ...EMPTY });
    setImages([]);
    setErrors({});
    setAutosaveMsg(null);
  }

  function cancelEdit() {
    resetForm();
    setMessage(null);
  }

  function buildPayload(explicitStatus?: string) {
    return {
      ...form,
      status: explicitStatus || form.status,
      images,
    };
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.make.trim()) errs.make = "Make is required.";
    if (!form.model.trim()) errs.model = "Model is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.price) errs.price = "Total price is required.";
    if (!form.mileage) errs.mileage = "Mileage is required.";
    if (!form.year) errs.year = "Year is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function save(explicitStatus?: string) {
    if (!validate()) {
      setMessage({ type: "err", text: "Please fix the highlighted fields." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(explicitStatus)),
    });
    setSaving(false);
    if (res.ok) {
      const { vehicle } = await res.json();
      setMessage({
        type: "ok",
        text: explicitStatus === "AVAILABLE" ? "Vehicle published." : "Draft saved.",
      });
      startEdit(vehicle);
      loadList();
    } else {
      setMessage({ type: "err", text: (await res.json()).error || "Failed to save" });
    }
  }

  async function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save();
  }

  async function restoreFromUnavailable() {
    if (!editingId) return;
    setRestoring(true);
    const res = await fetch(`/api/vehicles/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restoreFromUnavailable: true }),
    });
    setRestoring(false);
    if (res.ok) {
      const { vehicle } = await res.json();
      startEdit(vehicle);
      loadList();
      setMessage({ type: "ok", text: "Vehicle restored from unavailable." });
    } else {
      setMessage({ type: "err", text: "Failed to restore." });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this vehicle?")) return;
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === id) resetForm();
      loadList();
    }
  }

  async function toggleFeatured(v: Vehicle) {
    await fetch(`/api/vehicles/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !v.featured }),
    });
    loadList();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // Autosave: debounced PATCH while editing an existing vehicle.
  useEffect(() => {
    if (!editingId) return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/vehicles/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        if (res.ok) {
          setAutosaveMsg(`Autosaved at ${new Date().toLocaleTimeString()}`);
          loadList();
        }
      } catch {
        // silent — autosave failures shouldn't interrupt editing
      }
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, images, editingId]);

  const inputProps = (key: keyof FormState) => ({
    className: "input",
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      set(key, e.target.value as never),
  });

  const numberProps = (key: "price" | "mileage" | "engineCc", placeholder: string, required?: boolean) => ({
    className: "input",
    type: "text" as const,
    inputMode: "numeric" as const,
    required,
    placeholder,
    value: form[key] ? formatDigitsWithCommas(form[key]) : "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, digitsOnly(e.target.value) as never),
  });

  function fieldError(key: keyof FormState) {
    return errors[key] ? (
      <span style={{ color: "var(--crimson)", fontSize: 12 }}>{errors[key]}</span>
    ) : null;
  }

  const seoSource = {
    year: form.year,
    make: form.make,
    model: form.model,
    variant: form.variant,
    description: form.description,
    mileage: form.mileage,
    price: form.price,
  };
  const generatedMetaTitle = buildVehicleMetaTitle(seoSource);
  const generatedMetaDescription = buildVehicleMetaDescription(seoSource);
  const previewMetaTitle = resolveVehicleMetaTitle({ ...seoSource, metaTitle: form.metaTitle });
  const previewMetaDescription = resolveVehicleMetaDescription({
    ...seoSource,
    metaDescription: form.metaDescription,
  });

  function generateMetaFromListing() {
    set("metaTitle", generatedMetaTitle);
    set("metaDescription", generatedMetaDescription);
  }

  const isAutomation = editingVehicle?.createdByType === "AUTOMATION";
  const showRestore = editingVehicle?.status === "UNAVAILABLE";

  return (
    <main className="container" style={{ paddingBlock: 48 }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="heading" style={{ fontSize: 36, margin: "8px 0 0" }}>
            Vehicle manager
          </h1>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          Sign out
        </button>
      </div>

      <form
        ref={formSectionRef}
        onSubmit={onFormSubmit}
        className="glass"
        style={{
          padding: 28,
          borderRadius: 0,
          marginBottom: 40,
          outline: editingId ? "2px solid var(--gold)" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 className="heading" style={{ fontSize: 24, marginTop: 0, marginBottom: 4 }}>
              {editingId ? "Edit vehicle" : "Add a vehicle"}
            </h2>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6, maxWidth: 640, fontSize: 14 }}>
              Listings are sourced from across Japan — we do not hold stock on site. Enter where the
              vehicle is located or being sourced from.
            </p>
          </div>
          {autosaveMsg ? (
            <span className="muted" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
              {autosaveMsg}
            </span>
          ) : null}
        </div>

        {isAutomation ? (
          <div
            className="glass"
            style={{
              marginTop: 18,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid rgba(168,132,26,0.35)",
              background: "rgba(168,132,26,0.08)",
              color: "var(--gold-soft)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Created by Hermes — review before publishing
          </div>
        ) : null}

        {/* Vehicle identity */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Vehicle identity
        </h3>
        <div className="form-grid">
          <div className="field">
            <label>Make *</label>
            <input list="makes" {...inputProps("make")} required placeholder="Mercedes-AMG" />
            <datalist id="makes">
              {MAKES.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {fieldError("make")}
          </div>
          <div className="field">
            <label>Model *</label>
            <input list="models" {...inputProps("model")} required placeholder="C-Class" />
            <datalist id="models">
              {(MAKE_MODELS[form.make] || []).map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {fieldError("model")}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Variant / grade</label>
            <input {...inputProps("variant")} placeholder="C43 4MATIC Wagon" />
          </div>
          <div className="field">
            <label>Year *</label>
            <select {...inputProps("year")} required>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
              {form.year && !YEAR_OPTIONS.includes(Number(form.year)) ? (
                <option value={form.year}>{form.year}</option>
              ) : null}
            </select>
            {fieldError("year")}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Registration month</label>
            <select {...inputProps("registrationMonth")}>
              <option value="">—</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div />
        </div>

        {/* Price */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Price
        </h3>
        <div className="form-grid">
          <div className="field">
            <label>Total price (JPY) *</label>
            <input {...numberProps("price", "8,850,000", true)} />
            {fieldError("price")}
          </div>
          <div />
        </div>

        {/* Specifications */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Specifications
        </h3>
        <div className="form-grid">
          <div className="field">
            <label>Mileage (km) *</label>
            <input {...numberProps("mileage", "3,900", true)} />
            {fieldError("mileage")}
          </div>
          <div className="field">
            <label>Engine (cc)</label>
            <input {...numberProps("engineCc", "3,000")} />
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Transmission</label>
            <select {...inputProps("transmission")}>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {TRANSMISSION_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Fuel</label>
            <select {...inputProps("fuelType")}>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {FUEL_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Drivetrain</label>
            <select {...inputProps("drivetrain")}>
              <option value="">—</option>
              {DRIVETRAINS.map((d) => (
                <option key={d} value={d}>
                  {DRIVETRAIN_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Steering</label>
            <select {...inputProps("steering")}>
              {STEERINGS.map((s) => (
                <option key={s} value={s}>
                  {STEERING_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field" style={{ marginTop: 16, maxWidth: 320 }}>
          <label>Body type</label>
          <select {...inputProps("bodyType")}>
            <option value="">—</option>
            {BODY_TYPE_VALUES.map((b) => (
              <option key={b} value={b}>
                {BODY_TYPE_LABELS[b]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Exterior colour</label>
            <select {...inputProps("exteriorColor")}>
              <option value="">—</option>
              {form.exteriorColor && !EXTERIOR_COLORS.includes(form.exteriorColor) ? (
                <option value={form.exteriorColor}>{form.exteriorColor}</option>
              ) : null}
              {EXTERIOR_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Interior colour</label>
            <select {...inputProps("interiorColor")}>
              <option value="">—</option>
              {form.interiorColor && !INTERIOR_COLORS.includes(form.interiorColor) ? (
                <option value={form.interiorColor}>{form.interiorColor}</option>
              ) : null}
              {INTERIOR_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Location (prefecture)</label>
            <select {...inputProps("location")}>
              <option value="">—</option>
              {form.location && !PREFECTURES.includes(form.location) ? (
                <option value={form.location}>{form.location}</option>
              ) : null}
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Frame / chassis number</label>
            <input {...inputProps("vin")} />
          </div>
        </div>

        {/* Condition and description */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Condition and description
        </h3>
        <div className="field">
          <label>Description * (used for SEO — be descriptive)</label>
          <textarea
            className="textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            placeholder="Describe condition, history, options, driving character..."
            style={{ minHeight: 140 }}
          />
          {fieldError("description")}
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>Features / equipment (comma or newline separated)</label>
          <textarea
            className="textarea"
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
            placeholder="Panoramic sunroof, Burmester sound, Heated seats"
          />
        </div>

        {/* Source information */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Source information
        </h3>
        <div className="glass" style={{ padding: 20, borderRadius: 12 }}>
          <div className="form-grid">
            <div className="field">
              <label>Source type</label>
              <select {...inputProps("sourceType")}>
                <option value="">—</option>
                {SOURCE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {titleCaseEnum(s)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Source listing ID</label>
              <input {...inputProps("sourceListingId")} placeholder="e.g. auction lot number" />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Source URL</label>
              <input {...inputProps("sourceUrl")} placeholder="https://" />
            </div>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              {form.sourceUrl ? (
                <a
                  className="btn btn-outline"
                  href={form.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ alignSelf: "flex-start" }}
                >
                  Open original listing
                </a>
              ) : (
                <span className="muted" style={{ fontSize: 13 }}>
                  Add a source URL to enable the original listing link.
                </span>
              )}
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Last availability check</label>
              <input className="input mono" value={formatDateTime(editingVehicle?.lastAvailabilityCheckAt)} readOnly disabled />
            </div>
            <div className="field">
              <label>Last availability result</label>
              <input className="input mono" value={editingVehicle?.lastAvailabilityResult || "—"} readOnly disabled />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Consecutive unavailable checks</label>
              <input
                className="input mono"
                value={editingVehicle ? String(editingVehicle.consecutiveUnavailableChecks) : "—"}
                readOnly
                disabled
              />
            </div>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.availabilityCheckLocked}
                  onChange={(e) => set("availabilityCheckLocked", e.target.checked)}
                />
                Lock automated availability checks
              </label>
            </div>
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label>Availability evidence</label>
            <textarea
              className="textarea mono"
              value={editingVehicle?.availabilityEvidence || "—"}
              readOnly
              disabled
              style={{ minHeight: 80, fontSize: 12 }}
            />
          </div>

          {showRestore ? (
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ borderColor: "var(--crimson)", color: "var(--crimson)" }}
                onClick={restoreFromUnavailable}
                disabled={restoring}
              >
                {restoring ? "Restoring…" : "Restore from UNAVAILABLE"}
              </button>
            </div>
          ) : null}
        </div>

        {/* Photos */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Photos
        </h3>
        <div className="field">
          <label>Photos (first image is the cover)</label>
          <div
            className={`photo-dropzone${dragOver ? " is-dragover" : ""}${uploading ? " is-uploading" : ""}`}
            onDragOver={onDragOver}
            onDragEnter={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!uploading) fileInputRef.current?.click();
              }
            }}
            aria-label="Upload photos"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              onChange={onUpload}
              disabled={uploading}
              className="photo-dropzone-input"
            />
            <div className="photo-dropzone-icon" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V5" />
                <path d="M8 9l4-4 4 4" />
                <path d="M4 19h16" />
              </svg>
            </div>
            <p className="photo-dropzone-title">
              {uploading ? "Uploading…" : dragOver ? "Drop photos here" : "Drag & drop photos here"}
            </p>
            <p className="photo-dropzone-hint muted">
              {uploading ? "Please wait" : "or click to browse — JPEG, PNG, WebP, AVIF · max 8MB each"}
            </p>
          </div>
          {images.length > 0 ? (
            <div className="carousel-thumbs" style={{ marginTop: 12, flexWrap: "wrap" }}>
              {images.map((src, i) => (
                <div key={src} style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    style={{ width: 108, aspectRatio: "16/10", objectFit: "cover", borderRadius: 0, border: "1px solid var(--line)" }}
                  />
                  {i === 0 ? <span className="photo-cover-badge">Cover</span> : null}
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 4,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      title="Move left"
                      style={{ border: "1px solid var(--line)", background: "#fff", cursor: i === 0 ? "default" : "pointer", width: 22, height: 22, fontSize: 11 }}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setCover(i)}
                      disabled={i === 0}
                      title="Set as cover"
                      style={{ border: "1px solid var(--line)", background: "#fff", cursor: i === 0 ? "default" : "pointer", width: 22, height: 22, fontSize: 11 }}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      title="Move right"
                      style={{ border: "1px solid var(--line)", background: "#fff", cursor: i === images.length - 1 ? "default" : "pointer", width: 22, height: 22, fontSize: 11 }}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Remove image"
                      aria-label="Remove image"
                      style={{ border: "1px solid var(--crimson)", background: "var(--crimson)", color: "#fff", cursor: "pointer", width: 22, height: 22, fontSize: 11 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Advanced SEO */}
        <details style={{ marginTop: 28 }}>
          <summary className="heading" style={{ fontSize: 16, cursor: "pointer" }}>
            Advanced SEO
          </summary>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, maxWidth: 560 }}>
                Leave blank to auto-use title + description. Or generate and edit.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "8px 14px", fontSize: 13 }}
                onClick={generateMetaFromListing}
              >
                Generate from listing
              </button>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Meta title (optional)</label>
                <input {...inputProps("metaTitle")} placeholder={generatedMetaTitle} />
              </div>
              <div className="field">
                <label>Meta description (optional)</label>
                <input {...inputProps("metaDescription")} placeholder={generatedMetaDescription} />
              </div>
            </div>
            <div className="glass" style={{ marginTop: 12, padding: 14, borderRadius: 12 }}>
              <div className="muted" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Preview (what Google sees)
              </div>
              <div style={{ fontSize: 16, color: "#1a0dab", fontWeight: 500, lineHeight: 1.3 }}>
                {previewMetaTitle}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                {previewMetaDescription}
              </div>
            </div>
          </div>
        </details>

        {/* Publishing */}
        <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>
          Publishing
        </h3>
        <div className="form-grid">
          <div className="field">
            <label>Status</label>
            <select {...inputProps("status")}>
              {VEHICLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s] || s}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ justifyContent: "flex-end" }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Feature on homepage
            </label>
          </div>
        </div>

        {message ? (
          <p style={{ color: message.type === "ok" ? "var(--gold)" : "var(--crimson)", marginTop: 16 }}>
            {message.text}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => save("DRAFT")}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            className="btn btn-gold"
            type="button"
            onClick={() => save("AVAILABLE")}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & publish"}
          </button>
          {editingVehicle?.slug ? (
            <a
              className="btn btn-outline"
              href={`/stock/${editingVehicle.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview
            </a>
          ) : null}
          {editingId ? (
            <button className="btn btn-outline" type="button" onClick={cancelEdit} disabled={saving}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {/* Existing */}
      <h2 className="heading" style={{ fontSize: 24 }}>
        Listings ({list.length})
      </h2>
      <div className="stack" style={{ gap: 10, marginTop: 16 }}>
        {list.map((v) => {
          const colors = statusColor(v.status);
          return (
            <div
              key={v.id}
              className="glass"
              style={{ padding: "14px 18px", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong>
                    {v.year} {v.make} {v.model} {v.variant}
                  </strong>
                  <span className="pill" style={{ background: colors.bg, color: colors.color, borderColor: "transparent", padding: "3px 10px", fontSize: 11 }}>
                    {STATUS_LABELS[v.status] || v.status}
                  </span>
                  {v.createdByType === "AUTOMATION" ? (
                    <span
                      className="pill"
                      style={{ background: "rgba(168,132,26,0.14)", color: "var(--gold-soft)", borderColor: "transparent", padding: "3px 10px", fontSize: 11 }}
                    >
                      Hermes
                    </span>
                  ) : null}
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  /stock/{v.slug}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-outline" onClick={() => startEdit(v)} style={{ padding: "8px 14px" }}>
                  Edit
                </button>
                <Link className="btn btn-outline" href={`/admin/vehicles/${v.id}`} style={{ padding: "8px 14px" }}>
                  Open
                </Link>
                <button className="btn btn-outline" onClick={() => toggleFeatured(v)} style={{ padding: "8px 14px" }}>
                  {v.featured ? "★ Featured" : "☆ Feature"}
                </button>
                <a className="btn btn-outline" href={`/stock/${v.slug}`} target="_blank" rel="noreferrer" style={{ padding: "8px 14px" }}>
                  View
                </a>
                <button className="btn btn-outline" onClick={() => remove(v.id)} style={{ padding: "8px 14px", borderColor: "var(--crimson)", color: "var(--crimson)" }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 ? <p className="muted">No vehicles yet.</p> : null}
      </div>
    </main>
  );
}
