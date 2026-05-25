export function ManifestoSection() {
  return (
    <section className="bg-[#0d1f1d] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-[--cr-teal] uppercase mb-6">Our Point of View</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight tracking-tight mb-10">
          ClinicRelay is front-desk orchestration for modern clinics.<br className="hidden sm:block" /> Digital solved the booking problem. It left the coordination problem untouched.
        </h2>
        <div className="space-y-6 text-white/70 text-lg leading-relaxed">
          <p>
            Patients can find your clinic online. They can book appointments, fill intake forms, and receive reminders. That infrastructure is increasingly common.
          </p>
          <p>
            What it does not do is coordinate what happens inside your practice — when a confirmed appointment cancels, when a waitlisted patient needs to be reached, when missed appointments start to stack up, or when patient communication gets stuck between tasks.
          </p>
          <p>
            ClinicRelay is built for that gap. Not the website. Not the booking widget. The front-desk work that keeps schedules moving, cancelled-slot recovery active, and front-desk chaos from becoming the default.
          </p>
        </div>
      </div>
    </section>
  );
}
