// ClinicRelay Mark — interlocking Celtic-knot cross.
//
// Two stroked rounded rectangles weaving over/under each other:
//   - Vertical bar:   x=22, y=2,  w=20, h=60, rx=10
//   - Horizontal bar: x=2,  y=22, w=60, h=20, rx=10
//
// The two stroked rectangles cross at 4 points (corners of the central
// 20×20 square): top-left (22,22), top-right (42,22), bottom-right (42,42),
// bottom-left (22,42).
//
// For a Celtic-knot weave, alternation goes around: at TL the horizontal
// passes OVER, at TR the vertical passes OVER, at BR the horizontal
// passes OVER, at BL the vertical passes OVER.
//
// Implemented by punching tiny rectangular "notches" in each bar's mask
// at the intersection points where THAT bar should appear to go UNDER.

window.CRMark = function CRMark({
  size = 64,
  color = 'var(--cr-teal)',
  strokeWidth = 5.5,
  className = '',
  ariaLabel = 'ClinicRelay mark',
  uid
}) {
  uid = uid || 'crm' + Math.random().toString(36).slice(2, 8);
  const sw = strokeWidth;
  // Notch size: a square covering the stroke at the crossing point.
  // Slightly larger than the stroke to fully erase it.
  const half = sw * 0.9;

  // Crossing points
  const TL = [22, 22];
  const TR = [42, 22];
  const BR = [42, 42];
  const BL = [22, 42];

  // Notches that should be cut from VERTICAL bar (where horizontal is OVER):
  // TL and BR
  const vNotches = [TL, BR];

  // Notches that should be cut from HORIZONTAL bar (where vertical is OVER):
  // TR and BL
  const hNotches = [TR, BL];

  const notchRect = ([x, y]) =>
    `<rect x="${x - half}" y="${y - half}" width="${half * 2}" height="${half * 2}" fill="black" />`;

  return `
    <svg
      class="${className}"
      width="${size}"
      height="${size}"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="${ariaLabel}"
    >
      <defs>
        <mask id="${uid}-vmask" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect x="0" y="0" width="64" height="64" fill="white" />
          ${vNotches.map(notchRect).join('')}
        </mask>
        <mask id="${uid}-hmask" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect x="0" y="0" width="64" height="64" fill="white" />
          ${hNotches.map(notchRect).join('')}
        </mask>
      </defs>

      <!-- Horizontal bar (notched at TR and BL where vertical is over) -->
      <rect x="2" y="22" width="60" height="20" rx="10" ry="10"
        stroke="${color}" stroke-width="${sw}" fill="none"
        mask="url(#${uid}-hmask)" />

      <!-- Vertical bar (notched at TL and BR where horizontal is over) -->
      <rect x="22" y="2" width="20" height="60" rx="10" ry="10"
        stroke="${color}" stroke-width="${sw}" fill="none"
        mask="url(#${uid}-vmask)" />
    </svg>
  `;
};

window.renderMark = function renderMark(el, opts = {}) {
  el.innerHTML = window.CRMark(opts);
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-cr-mark]').forEach((el) => {
    const size = parseFloat(el.dataset.size || el.getAttribute('data-cr-mark') || 64);
    const color = el.dataset.color || 'var(--cr-teal)';
    const strokeWidth = parseFloat(el.dataset.stroke || (size * 5.5 / 64));
    el.innerHTML = window.CRMark({ size, color, strokeWidth });
  });
});
