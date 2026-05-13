# Legal Pages Update Response

Done.

Changed:
- `/home/ubuntu/projects/clinicrelay/app/privacy/page.tsx`
- `/home/ubuntu/projects/clinicrelay/app/terms/page.tsx`

What I added:
- Full Privacy Notice with:
  - scope
  - collected information
  - usage
  - HIPAA/PIPEDA-sensitive workflow handling
  - patient communications and consent
  - subprocessors/sharing
  - retention
  - security
  - international processing
  - rights/choices
  - children
  - contact/update language

- Full Terms of Service with:
  - agreement/authority language
  - service description
  - pilot/pre-launch limitations
  - clinic responsibilities
  - patient communications/SMS consent duties
  - data/privacy/regulated-information boundaries
  - access/security restrictions
  - fees
  - IP
  - third-party services
  - confidentiality
  - disclaimers
  - liability limits
  - termination
  - governing-law placeholder
  - contact/update language

Research basis:
- FTC health privacy guidance
- OPC PIPEDA fair information principles
- CRTC CASL messaging/consent themes
- Existing ClinicRelay positioning: privacy-aware workflow boundaries, no hard HIPAA/PIPEDA compliance claim, operational coordination rather than medical advice

Safety/copy stance:
- I avoided hard “HIPAA compliant” or “PIPEDA compliant” claims.
- I made the copy explicitly pre-launch/pilot-safe.
- I included counsel-review language because this should not be treated as attorney-approved final legal text.

Verification:
- GitNexus impact before editing:
  - PrivacyPage: LOW risk, 0 direct callers, 0 affected processes
  - TermsPage: LOW risk, 0 direct callers, 0 affected processes
- `npm run lint`: passed
- `npm run build`: passed
- `npx gitnexus detect-changes`: reported MEDIUM overall because the worktree also contained existing pricing-related modifications outside this task.

Note:
- At the time, the worktree also had unrelated modified files:
  - `app/pricing/page.tsx`
  - `components/landing/pricing-cta-button.tsx`
  - `components/landing/pricing-section.tsx`
  - `lib/content/clinicrelay-landing.ts`
  - untracked `.pi/`
- I only changed the privacy and terms pages for that task.
