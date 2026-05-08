"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";
import { usePostHog } from "posthog-js/react";

type State = "idle" | "loading" | "success" | "error";
type FormErrors = { name?: string; clinic_name?: string; email?: string };

const modalCopy = {
  demo: {
    title: "Book a Demo",
    description: "See how ClinicRelay helps recover cancelled slots and coordinate front-desk workflows.",
    submit: "Book my demo",
    footer: "No commitment required. 20-minute walkthrough.",
  },
  audit: {
    title: "Request Workflow Audit",
    description: "Help us understand your current setup — we'll identify the highest-impact recovery and readiness gaps for your clinic.",
    submit: "Request my audit",
    footer: "No commitment required. 20-minute audit call.",
  },
  recovery: {
    title: "See Waitlist Recovery",
    description: "We'll walk you through the cancelled-slot recovery loop and staff confirmation workflow.",
    submit: "Show me recovery workflow",
    footer: "No commitment required. 20-minute walkthrough.",
  },
} as const;

const SCHEDULING_SYSTEMS = ["Dentrix", "Eaglesoft", "Curve Dental", "ClearDent", "Tracker", "ABELDent", "Open Dental", "Jane App", "Cliniko", "Other / not sure"];
const WAITLIST_PROCESSES = ["No formal process", "Spreadsheet or paper list", "EHR waitlist module", "Manual phone calls only", "Other"];

const demoPainOptions = [
  { value: "cancellations", label: "Cancellations" },
  { value: "no-shows", label: "No-shows" },
  { value: "missed-calls", label: "Missed calls" },
  { value: "recall", label: "Recall gaps" },
  { value: "website", label: "Website / online presence" },
  { value: "staff-overload", label: "Staff overload" },
];

const auditPainOptions = [
  { value: "cancellations", label: "Cancellations & no-shows" },
  { value: "front-desk-rework", label: "Front-desk rework" },
  { value: "intake-delays", label: "Intake delays" },
  { value: "insurance-readiness", label: "Insurance readiness" },
  { value: "recall", label: "Recall gaps" },
  { value: "staff-overload", label: "Staff overload" },
  { value: "response-delays", label: "Patient response delays" },
];

export function DemoModal() {
  const { isOpen, close, intent } = useDemoModal();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const posthog = usePostHog();
  const openFiredRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      setState("idle");
      setErrorMsg("");
      setFormErrors({});
      if (!openFiredRef.current) {
        openFiredRef.current = true;
        posthog?.capture("demo_modal_opened", { intent });
      }
    } else {
      openFiredRef.current = false;
    }
  }, [isOpen, intent, posthog]);

  function validate(fd: FormData) {
    const next: FormErrors = {};
    const name = String(fd.get("name") ?? "").trim();
    const clinic = String(fd.get("clinic_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!clinic) next.clinic_name = "Please enter your clinic name.";
    if (!email) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email.";

    setFormErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!validate(fd)) return;

    setState("loading");
    posthog?.capture("lead_form_submitted", { intent });

    const pain_points = fd.getAll("pain_points") as string[];
    const interest = fd.getAll("interest") as string[];
    const intentInterestMap = { demo: "demo", audit: "audit", recovery: "growth-system" } as const;
    const normalizedInterest = interest.length > 0 ? interest : [intentInterestMap[intent]];

    const rawMessage = String(fd.get("message") ?? "").trim();
    const schedulingSystem = intent === "audit" ? String(fd.get("scheduling_system") ?? "").trim() : "";
    const waitlistProcess = intent === "audit" ? String(fd.get("waitlist_process") ?? "").trim() : "";
    const messageParts = [
      schedulingSystem ? `Scheduling system: ${schedulingSystem}` : "",
      waitlistProcess ? `Waitlist process: ${waitlistProcess}` : "",
      rawMessage,
    ].filter(Boolean);
    const message = messageParts.join("\n\n") || undefined;

    const payload = {
      name: fd.get("name"),
      clinic_name: fd.get("clinic_name"),
      role: fd.get("role"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      clinic_type: fd.get("clinic_type"),
      location_count: fd.get("location_count"),
      website_url: intent !== "audit" ? fd.get("website_url") : undefined,
      message,
      company: fd.get("company"),
      pain_points,
      interest: normalizedInterest,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
        posthog?.capture("lead_form_succeeded", { intent });
      } else {
        const json = await res.json();
        setErrorMsg(json.error ?? "Unable to submit. Please try again.");
        setState("error");
        posthog?.capture("lead_form_failed", { intent });
      }
    } catch {
      setErrorMsg("Unable to submit. Please try again.");
      setState("error");
      posthog?.capture("lead_form_failed", { intent });
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            className="relative bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button onClick={close} className="absolute top-6 right-6 text-[--cr-muted] hover:text-[--cr-text] transition-colors" aria-label="Close">
              <X size={20} />
            </button>

            {state === "success" ? (
              <div className="text-center py-12">
                <CheckCircle size={48} weight="duotone" className="text-[--cr-teal] mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-2">We'll be in touch.</h2>
                <p className="text-[--cr-muted] mb-6">Expect to hear from us within one business day.</p>
                <button onClick={close} className="cr-btn cr-btn-primary">Done</button>
              </div>
            ) : (
              <>
                <h2 id="demo-modal-title" className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-1">{modalCopy[intent].title}</h2>
                <p className="text-[--cr-muted] mb-8 text-sm">{modalCopy[intent].description}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name *" name="name" required helperText={intent === "audit" ? "For your audit briefing." : "Used for your personalized demo briefing."} error={formErrors.name} />
                    <Field label="Clinic Name *" name="clinic_name" required helperText="Helps us tailor workflow recommendations." error={formErrors.clinic_name} />
                    <Field label="Your Role" name="role" />
                    <Field label="Email *" name="email" type="email" required helperText="We'll send your audit summary here." error={formErrors.email} />
                    <Field label={intent === "audit" ? "Preferred Contact Number" : "Phone"} name="phone" type="tel" />
                    {intent !== "audit" && <Field label="Current Website" name="website_url" type="url" />}
                  </div>

                  <input name="company" type="text" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Clinic Type" name="clinic_type" options={["dental", "family", "eye", "dermatology", "physio", "other"]} />
                    <SelectField label="Number of Providers / Locations" name="location_count" options={["1", "2–5", "6+"]} />
                  </div>

                  {intent === "audit" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField label="Current Scheduling System" name="scheduling_system" options={SCHEDULING_SYSTEMS} />
                      <SelectField label="Current Waitlist Process" name="waitlist_process" options={WAITLIST_PROCESSES} />
                    </div>
                  )}

                  <CheckboxGroup
                    label={intent === "audit" ? "Where does front-desk rework pile up most?" : "Biggest operational pain"}
                    name="pain_points"
                    options={intent === "audit" ? auditPainOptions : demoPainOptions}
                  />

                  {intent !== "audit" && (
                    <CheckboxGroup
                      label="I'm interested in"
                      name="interest"
                      options={[
                        { value: "demo", label: "Product demo" },
                        { value: "audit", label: "Workflow audit" },
                        { value: "website", label: "New website" },
                        { value: "growth-system", label: "Full growth system" },
                      ]}
                    />
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[--cr-text]" htmlFor="message">
                      {intent === "audit" ? "Anything else we should know?" : "Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="cr-input resize-none"
                      placeholder={intent === "audit" ? "e.g. We average 8 cancellations/week and our waitlist is a paper list." : "Anything else we should know?"}
                    />
                  </div>

                  {state === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

                  <button type="submit" disabled={state === "loading"} className="cr-btn cr-btn-primary disabled:opacity-60">
                    {state === "loading" ? "Submitting…" : modalCopy[intent].submit}
                  </button>
                  <p className="text-xs text-[--cr-muted]">{modalCopy[intent].footer}</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", required = false, helperText, error }: { label: string; name: string; type?: string; required?: boolean; helperText?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <input id={name} name={name} type={type} required={required} aria-invalid={!!error} className={`cr-input ${error ? "border-red-500" : ""}`} />
      {error ? <p className="text-xs text-red-600">{error}</p> : helperText ? <p className="text-xs text-[--cr-muted]">{helperText}</p> : null}
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <select id={name} name={name} className="cr-input bg-white">
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({ label, name, options }: { label: string; name: string; options: Array<{ value: string; label: string }> }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-[--cr-text]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm text-[--cr-muted] cursor-pointer">
            <input type="checkbox" name={name} value={o.value} className="accent-[--cr-teal] rounded" />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
