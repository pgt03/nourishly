export default function FoodIllustration() {
  return (
    <svg viewBox="0 0 440 400" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto drop-shadow-2xl select-none pointer-events-none"
      aria-label="Healthy food bowl illustration">

      {/* ── Floating ingredient dots (background depth) ── */}
      <circle cx="52" cy="88" r="14" fill="#4ade80" opacity="0.5" />
      <circle cx="78" cy="62" r="9" fill="#f87171" opacity="0.45" />
      <circle cx="38" cy="130" r="7" fill="#fb923c" opacity="0.4" />
      <circle cx="380" cy="72" r="12" fill="#fbbf24" opacity="0.5" />
      <circle cx="408" cy="100" r="8" fill="#a3e635" opacity="0.45" />
      <circle cx="392" cy="145" r="10" fill="#6ee7b7" opacity="0.4" />
      <circle cx="60" cy="290" r="8" fill="#c084fc" opacity="0.3" />
      <circle cx="395" cy="280" r="9" fill="#fb923c" opacity="0.3" />

      {/* ── Herb sprigs (top corners) ── */}
      <g stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round">
        <line x1="100" y1="50" x2="108" y2="30" />
        <ellipse cx="104" cy="40" rx="6" ry="10" fill="#4ade80" opacity="0.7" transform="rotate(-15 104 40)" />
        <ellipse cx="112" cy="33" rx="5" ry="8" fill="#22c55e" opacity="0.6" transform="rotate(10 112 33)" />
      </g>
      <g stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round">
        <line x1="340" y1="48" x2="332" y2="28" />
        <ellipse cx="336" cy="38" rx="6" ry="10" fill="#4ade80" opacity="0.7" transform="rotate(15 336 38)" />
        <ellipse cx="328" cy="31" rx="5" ry="8" fill="#22c55e" opacity="0.6" transform="rotate(-10 328 31)" />
      </g>

      {/* ── Bowl shadow ── */}
      <ellipse cx="220" cy="355" rx="155" ry="18" fill="rgba(0,0,0,0.12)" />

      {/* ── Bowl body ── */}
      <path d="M 65 195 Q 62 340 220 348 Q 378 340 375 195 Z"
        fill="white" stroke="#e2e8f0" strokeWidth="2.5" />

      {/* ── Bowl rim ── */}
      <ellipse cx="220" cy="195" rx="155" ry="26"
        fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2.5" />
      {/* Rim highlight */}
      <ellipse cx="220" cy="192" rx="130" ry="16" fill="white" opacity="0.6" />

      {/* ── Bowl interior base (grain/quinoa layer) ── */}
      <ellipse cx="220" cy="220" rx="118" ry="18" fill="#fef3c7" />
      <ellipse cx="218" cy="218" rx="100" ry="14" fill="#fde68a" opacity="0.7" />

      {/* ── Leafy greens base ── */}
      <ellipse cx="220" cy="210" rx="115" ry="16" fill="#86efac" opacity="0.9" />

      {/* ── Avocado fan slices ── */}
      <g transform="rotate(-25 178 205)">
        <ellipse cx="178" cy="205" rx="28" ry="16" fill="#a7f3d0" />
        <ellipse cx="178" cy="205" rx="19" ry="10" fill="#6ee7b7" />
        <ellipse cx="178" cy="205" rx="8" ry="4" fill="#7c3aed" opacity="0.3" />
      </g>
      <g transform="rotate(-10 164 208)">
        <ellipse cx="164" cy="208" rx="24" ry="13" fill="#bbf7d0" opacity="0.8" />
        <ellipse cx="164" cy="208" rx="14" ry="8" fill="#86efac" opacity="0.8" />
      </g>

      {/* ── Cherry tomatoes cluster ── */}
      <circle cx="262" cy="198" r="13" fill="#fca5a5" />
      <circle cx="262" cy="198" r="11" fill="#f87171" />
      <circle cx="262" cy="195" r="4" fill="#fecaca" opacity="0.6" />
      <circle cx="281" cy="207" r="11" fill="#ef4444" />
      <circle cx="281" cy="205" r="3.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="249" cy="210" r="10" fill="#f87171" />

      {/* ── Cucumber ribbons ── */}
      <g transform="rotate(20 300 210)">
        <ellipse cx="300" cy="210" rx="11" ry="18" fill="#bbf7d0" stroke="#6ee7b7" strokeWidth="1" />
        <ellipse cx="300" cy="210" rx="5" ry="9" fill="#4ade80" opacity="0.5" />
      </g>
      <g transform="rotate(-10 312 220)">
        <ellipse cx="312" cy="220" rx="9" ry="15" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="1" />
      </g>

      {/* ── Carrot sticks ── */}
      <rect x="137" y="188" width="9" height="30" rx="4.5" fill="#fb923c"
        transform="rotate(20 137 188)" />
      <rect x="125" y="192" width="9" height="26" rx="4.5" fill="#f97316"
        transform="rotate(8 125 192)" />
      {/* Carrot tops */}
      <path d="M 145 185 L 143 176 M 141 183 L 137 175" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Chickpeas ── */}
      {[[240,225],[255,230],[228,233],[268,222],[248,238]].map(([cx,cy],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="7" ry="5.5" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" />
      ))}

      {/* ── Purple cabbage shreds ── */}
      <path d="M 195 215 Q 205 205 215 215 Q 205 225 195 215" fill="#c084fc" opacity="0.6" />
      <path d="M 185 222 Q 193 213 200 222 Q 193 230 185 222" fill="#a855f7" opacity="0.5" />

      {/* ── Lemon wedge ── */}
      <path d="M 308 195 Q 326 183 334 200 Q 326 214 308 195" fill="#fef08a" />
      <path d="M 308 195 Q 320 185 334 200" stroke="#fde047" strokeWidth="1" />
      <line x1="321" y1="188" x2="321" y2="208" stroke="#fde047" strokeWidth="0.8" opacity="0.5" />

      {/* ── Sesame / seed sprinkle ── */}
      {[[218,205],[232,200],[207,212],[243,210],[225,218]].map(([cx,cy],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="2.5" ry="1.5" fill="#f5f5f4"
          transform={`rotate(${i*35} ${cx} ${cy})`} opacity="0.8" />
      ))}

      {/* ── Olive oil drizzle ── */}
      <path d="M 195 198 Q 225 192 252 200" stroke="#fbbf24" strokeWidth="2.5"
        strokeLinecap="round" fill="none" opacity="0.7" />

      {/* ── Fresh herbs on top ── */}
      <g>
        <circle cx="220" cy="185" r="5" fill="#4ade80" />
        <circle cx="212" cy="183" r="4" fill="#22c55e" />
        <circle cx="228" cy="182" r="4" fill="#4ade80" />
        <circle cx="216" cy="178" r="3" fill="#16a34a" />
        <circle cx="224" cy="177" r="3" fill="#22c55e" />
      </g>

      {/* ── Steam lines ── */}
      <g stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M 180 168 Q 174 150 180 134 Q 186 150 180 168" />
        <path d="M 218 162 Q 212 140 218 122 Q 224 140 218 162" />
        <path d="M 256 166 Q 250 148 256 132 Q 262 148 256 166" />
      </g>

      {/* ── Fork (left) ── */}
      <g fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round">
        <line x1="32" y1="165" x2="32" y2="280" />
        <path d="M 24 165 L 24 185 Q 28 192 32 185 Q 36 192 40 185 L 40 165" />
      </g>

      {/* ── Spoon (right) ── */}
      <g fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round">
        <line x1="408" y1="195" x2="408" y2="295" />
        <ellipse cx="408" cy="182" rx="8" ry="13" stroke="#cbd5e1" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
