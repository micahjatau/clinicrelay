export function ManifestoSection() {
  return (
    <section className="bg-[#0d1f1d] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-[--cr-teal] uppercase mb-6">Our Point of View</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight tracking-tight mb-10">
          Digital solved the discovery problem.<br className="hidden sm:block" /> It left the operations problem untouched.
        </h2>
        <div className="space-y-6 text-white/70 text-lg leading-relaxed">
          <p>
            Patients can find your clinic online. They can book appointments, fill intake forms, and receive automated reminders. That infrastructure is increasingly common.
          </p>
          <p>
            What it does not do is coordinate what happens inside your practice — when a confirmed appointment cancels, when insurance flags at the wrong moment, when a waitlisted patient needs to be reached before the slot fills itself, when intake sits incomplete two days before the visit.
          </p>
          <p>
            ClinicRelay is built for that gap. Not the website. Not the booking widget. The operational work that happens between the calendar entry and the patient walk-in — and the staff time it quietly costs every single day.
          </p>
        </div>
      </div>
    </section>
  );
}
