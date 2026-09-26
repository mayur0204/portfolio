import './ProjectVisual.css';

/*
 * Illustrated schematics for each project (not screenshots).
 * They sketch what the project is — a chat storefront, a web platform,
 * a ride-booking chat — in the site's own ink-and-vermilion style.
 */

const INK = 'var(--ink)';
const ACC = 'var(--accent)';
const MONO = { fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--ink-3)', letterSpacing: '0.04em' };

function Commerce() {
  return (
    <>
      {/* phone */}
      <rect x="120" y="18" width="160" height="266" rx="18" fill="var(--paper-lift)" stroke={INK} strokeWidth="1.5" />
      <rect x="120" y="18" width="160" height="34" rx="18" fill={INK} />
      <rect x="120" y="36" width="160" height="16" fill={INK} />
      <circle cx="140" cy="36" r="6" fill={ACC} />
      <rect x="152" y="31" width="52" height="4" rx="2" fill="var(--paper)" />
      <rect x="152" y="39" width="30" height="3" rx="1.5" fill="var(--paper)" opacity=".5" />

      {/* bot bubble */}
      <g className="pv-pop" style={{ '--pv-d': '0.1s' }}>
        <rect x="132" y="64" width="104" height="30" rx="8" fill="var(--paper-deep)" />
        <rect x="140" y="72" width="80" height="4" rx="2" fill={INK} opacity=".7" />
        <rect x="140" y="81" width="54" height="4" rx="2" fill={INK} opacity=".35" />
      </g>

      {/* carousel of product cards */}
      <clipPath id="pv-clip-c">
        <rect x="126" y="102" width="148" height="112" />
      </clipPath>
      <g clipPath="url(#pv-clip-c)">
        <g className="pv-slide">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${132 + i * 88} 104)`}>
              <rect width="80" height="106" rx="7" fill="var(--paper)" stroke={INK} strokeWidth="1" />
              <rect x="6" y="6" width="68" height="44" rx="4" fill={i === 1 ? ACC : 'var(--paper-deep)'} />
              <path
                d={`M14 ${40} l12 -14 l10 9 l8 -6 l16 11`}
                fill="none"
                stroke={i === 1 ? 'var(--paper)' : INK}
                strokeWidth="1.2"
                opacity=".6"
              />
              <rect x="6" y="58" width="52" height="4" rx="2" fill={INK} opacity=".8" />
              <text x="6" y="75" style={{ ...MONO, fill: INK, fontSize: 9 }}>
                ₹ ———
              </text>
              <rect x="6" y="86" width="68" height="14" rx="3" fill="none" stroke={INK} strokeWidth=".9" />
              <text x="40" y="96" textAnchor="middle" style={{ ...MONO, fontSize: 7, fill: INK }}>
                ORDER NOW
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* user reply */}
      <g className="pv-pop" style={{ '--pv-d': '0.6s' }}>
        <rect x="190" y="224" width="78" height="22" rx="8" fill={INK} />
        <text x="229" y="238" textAnchor="middle" style={{ ...MONO, fill: 'var(--paper)', fontSize: 8 }}>
          ORDER_2
        </text>
      </g>
      <rect x="132" y="258" width="136" height="16" rx="8" fill="none" stroke="var(--rule)" />

      {/* state labels */}
      <g style={MONO}>
        <text x="18" y="84">
          STATE
        </text>
        <text x="18" y="98" style={{ ...MONO, fill: ACC }}>
          PRODUCTS
        </text>
        <path d="M86 94 H126" stroke={ACC} strokeDasharray="3 3" className="pv-dash" />
        <text x="298" y="232">
          → ORDER_NAME
        </text>
        <text x="298" y="246">
          → PINCODE
        </text>
        <text x="298" y="260">
          → PAYMENT
        </text>
      </g>
    </>
  );
}

function Web() {
  return (
    <>
      {/* browser */}
      <rect x="16" y="26" width="262" height="246" rx="6" fill="var(--paper-lift)" stroke={INK} strokeWidth="1.5" />
      <path d="M16 48 H278" stroke={INK} />
      {[30, 42, 54].map((x) => (
        <circle key={x} cx={x} cy="37" r="3.5" fill="none" stroke={INK} />
      ))}
      <rect x="72" y="32" width="150" height="10" rx="5" fill="var(--paper-deep)" />

      {/* nav + hero */}
      <rect x="30" y="60" width="40" height="6" rx="3" fill={INK} />
      {[180, 206, 232].map((x) => (
        <rect key={x} x={x} y="61" width="18" height="4" rx="2" fill={INK} opacity=".4" />
      ))}
      <g className="pv-pop" style={{ '--pv-d': '0.05s' }}>
        <rect x="30" y="84" width="150" height="14" rx="2" fill={INK} />
        <rect x="30" y="104" width="112" height="14" rx="2" fill={INK} />
        <rect x="30" y="128" width="130" height="4" rx="2" fill={INK} opacity=".35" />
        <rect x="30" y="137" width="100" height="4" rx="2" fill={INK} opacity=".35" />
        <rect x="30" y="152" width="62" height="18" rx="2" fill={ACC} />
        <text x="61" y="164" textAnchor="middle" style={{ ...MONO, fill: 'var(--paper)', fontSize: 7 }}>
          BOOK A RIDE
        </text>
      </g>
      <rect x="196" y="84" width="68" height="86" rx="3" fill="var(--paper-deep)" />
      <path
        d="M206 150 q14 -40 48 -46"
        fill="none"
        stroke={ACC}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="pv-dash"
      />
      <circle cx="206" cy="150" r="4" fill={INK} />
      <circle cx="254" cy="104" r="4" fill={ACC} />

      {/* vehicle cards */}
      {[0, 1, 2].map((i) => (
        <g key={i} className="pv-pop" style={{ '--pv-d': `${0.2 + i * 0.12}s` }}>
          <rect x={30 + i * 80} y="186" width="72" height="72" rx="3" fill="none" stroke={INK} />
          <rect x={38 + i * 80} y="194" width="56" height="30" rx="2" fill="var(--paper-deep)" />
          <rect x={38 + i * 80} y="232" width="36" height="4" rx="2" fill={INK} />
          <rect x={38 + i * 80} y="241" width="24" height="3" rx="1.5" fill={INK} opacity=".4" />
        </g>
      ))}

      {/* stack column */}
      <g style={MONO}>
        {[
          ['NGINX', 46],
          ['EXPRESS', 116],
          ['MONGODB', 186],
        ].map(([t, y], i) => (
          <g key={t}>
            <rect
              x="300"
              y={y}
              width="86"
              height="40"
              rx={i === 2 ? 12 : 2}
              fill={i === 1 ? INK : 'var(--paper-lift)'}
              stroke={INK}
            />
            <text x="343" y={y + 24} textAnchor="middle" style={{ ...MONO, fill: i === 1 ? 'var(--paper)' : INK }}>
              {t}
            </text>
          </g>
        ))}
        <path d="M343 86 V116 M343 156 V186" stroke={ACC} strokeWidth="1.5" strokeDasharray="3 3" className="pv-dash" />
        <path d="M278 66 H300" stroke={ACC} strokeWidth="1.5" strokeDasharray="3 3" className="pv-dash" />
        <text x="300" y="246">
          /api/*
        </text>
        <text x="300" y="260">
          JWT · CASHFREE
        </text>
      </g>
    </>
  );
}

function Ride() {
  const route = 'M218 238 C 250 200, 236 170, 280 150 S 330 96, 360 70';
  return (
    <>
      {/* map */}
      <rect x="196" y="24" width="190" height="252" rx="4" fill="var(--paper-deep)" />
      <g stroke="var(--rule)" strokeWidth="6" fill="none">
        <path d="M196 120 H386" />
        <path d="M196 200 H386" />
        <path d="M250 24 V276" />
        <path d="M330 24 V276" />
        <path d="M196 60 L386 250" strokeWidth="4" />
      </g>
      <path
        d={route}
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        className="pv-dash"
      />
      <circle cx="218" cy="238" r="7" fill="var(--paper)" stroke={INK} strokeWidth="2" />
      <g transform="translate(360 70)">
        <path d="M0 0 C -9 -10, -9 -22, 0 -24 C 9 -22, 9 -10, 0 0 Z" fill={ACC} />
        <circle cy="-15" r="3.5" fill="var(--paper)" />
      </g>
      <rect width="14" height="9" rx="2" fill={INK} className="pv-car" style={{ offsetPath: `path('${route}')` }} />
      <text x="206" y="264" style={MONO}>
        PICKUP
      </text>
      <text x="330" y="40" style={{ ...MONO, fill: ACC }}>
        DROP
      </text>

      {/* chat column */}
      <rect x="14" y="24" width="168" height="252" rx="14" fill="var(--paper-lift)" stroke={INK} strokeWidth="1.5" />
      <g className="pv-pop" style={{ '--pv-d': '0.05s' }}>
        <rect x="26" y="40" width="112" height="24" rx="7" fill="var(--paper-deep)" />
        <text x="34" y="55" style={{ ...MONO, fill: INK }}>
          SHARE PICKUP
        </text>
      </g>
      <g className="pv-pop" style={{ '--pv-d': '0.3s' }}>
        <rect x="70" y="72" width="100" height="40" rx="7" fill={INK} />
        <rect x="78" y="80" width="84" height="16" rx="3" fill="var(--paper)" opacity=".18" />
        <text x="78" y="106" style={{ ...MONO, fill: 'var(--paper)', fontSize: 8 }}>
          LOCATION
        </text>
      </g>
      <g className="pv-pop" style={{ '--pv-d': '0.55s' }}>
        <rect x="26" y="122" width="124" height="80" rx="7" fill="var(--paper-deep)" />
        {['Mini', 'Sedan', 'SUV'].map((v, i) => (
          <g key={v}>
            <rect x="34" y={132 + i * 22} width="108" height="16" rx="3" fill={i === 1 ? ACC : 'var(--paper)'} />
            <text x="42" y={143 + i * 22} style={{ ...MONO, fill: i === 1 ? 'var(--paper)' : INK, fontSize: 8 }}>
              {v.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
      <g className="pv-pop" style={{ '--pv-d': '0.8s' }}>
        <rect x="26" y="212" width="144" height="34" rx="7" fill="var(--paper-deep)" />
        <text x="34" y="226" style={{ ...MONO, fill: INK, fontSize: 8 }}>
          DRIVER ASSIGNED
        </text>
        <text x="34" y="238" style={{ ...MONO, fill: ACC, fontSize: 8 }}>
          OTP ••••
        </text>
      </g>
      <rect x="26" y="254" width="144" height="12" rx="6" fill="none" stroke="var(--rule)" />
    </>
  );
}

const VISUALS = { commerce: Commerce, web: Web, ride: Ride };

export default function ProjectVisual({ kind, title, className = '' }) {
  const Art = VISUALS[kind];
  if (!Art) return null;
  return (
    <svg
      className={`pv ${className}`}
      viewBox="0 0 400 300"
      role="img"
      aria-label={`Illustration for ${title}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="400" height="300" fill="var(--paper)" />
      <Art />
    </svg>
  );
}
