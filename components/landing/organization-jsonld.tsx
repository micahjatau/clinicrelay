const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClinicRelay",
  url: "https://www.clinicrelay.co",
  email: "hello@clinicrelay.co",
  slogan: "Coordinate Care. Reduce Chaos.",
  description:
    "ClinicRelay is a front-desk orchestration platform for clinics, helping teams coordinate bookings, reduce missed appointments, and recover cancelled slots.",
} as const;

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
