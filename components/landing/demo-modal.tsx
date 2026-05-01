"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react";
import { useDemoModal } from "@/context/demo-modal-context";

type State = "idle" | "loading" | "success" | "error";

export function DemoModal() {
  const { isOpen, close } = useDemoModal();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const fd = new FormData(e.currentTarget);
    const pain_points = fd.getAll("pain_points") as string[];
    const interest = fd.getAll("interest") as string[];
    const payload = {
      name: fd.get("name"),
      clinic_name: fd.get("clinic_name"),
      role: fd.get("role"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      clinic_type: fd.get("clinic_type"),
      location_count: fd.get("location_count"),
      website_url: fd.get("website_url"),
      message: fd.get("message"),
      pain_points,
      interest,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
      } else {
        const json = await res.json();
        setErrorMsg(json.error ?? "Unable to submit. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Unable to submit. Please try again.");
      setState("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            className="relative bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={close}
              className="absolute top-6 right-6 text-[--cr-muted] hover:text-[--cr-text] transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {state === "success" ? (
              <div className="text-center py-12">
                <CheckCircle size={48} weight="duotone" className="text-[--cr-teal] mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-2">We'll be in touch.</h2>
                <p className="text-[--cr-muted]">Expect to hear from us within one business day.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-[--cr-text] tracking-tight mb-1">Book a Demo</h2>
                <p className="text-[--cr-muted] mb-8 text-sm">Tell us about your clinic and we'll get back to you within one business day.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name *" name="name" required />
                    <Field label="Clinic Name *" name="clinic_name" required />
                    <Field label="Your Role" name="role" />
                    <Field label="Email *" name="email" type="email" required />
                    <Field label="Phone" name="phone" type="tel" />
                    <Field label="Current Website" name="website_url" type="url" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Clinic Type" name="clinic_type" options={["dental","family","eye","dermatology","physio","other"]} />
                    <SelectField label="Number of Locations" name="location_count" options={["1","2–5","6+"]} />
                  </div>

                  <CheckboxGroup
                    label="Biggest operational pain"
                    name="pain_points"
                    options={[
                      { value: "cancellations", label: "Cancellations" },
                      { value: "no-shows", label: "No-shows" },
                      { value: "missed-calls", label: "Missed calls" },
                      { value: "recall", label: "Recall gaps" },
                      { value: "website", label: "Website / online presence" },
                      { value: "staff-overload", label: "Staff overload" },
                    ]}
                  />

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

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[--cr-text]">Message</label>
                    <textarea
                      name="message"
                      rows={3}
                      className="border border-[--cr-border] rounded-xl px-4 py-3 text-sm text-[--cr-text] placeholder:text-[--cr-muted] focus:outline-none focus:border-[--cr-teal] resize-none"
                      placeholder="Anything else we should know?"
                    />
                  </div>

                  {state === "error" && (
                    <p className="text-red-600 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="bg-[--cr-teal] text-white px-5 py-3 rounded-xl font-semibold shadow-[0_12px_26px_rgba(13,148,136,0.22)] hover:bg-[--cr-teal-dark] active:-translate-y-px active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
                  >
                    {state === "loading" ? "Submitting…" : "Submit"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", required = false }: {
  label: string; name: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="border border-[--cr-border] rounded-xl px-4 py-3 text-sm text-[--cr-text] placeholder:text-[--cr-muted] focus:outline-none focus:border-[--cr-teal]"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[--cr-text]">{label}</label>
      <select
        name={name}
        className="border border-[--cr-border] rounded-xl px-4 py-3 text-sm text-[--cr-text] focus:outline-none focus:border-[--cr-teal] bg-white"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
      </select>
    </div>
  );
}

function CheckboxGroup({ label, name, options }: {
  label: string; name: string; options: Array<{ value: string; label: string }>;
}) {
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
