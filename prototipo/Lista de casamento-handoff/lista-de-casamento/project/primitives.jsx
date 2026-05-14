// primitives.jsx — shared design tokens, palettes, icons, placeholders

const PALETTES = {
  bege: {
    name: 'Bege & Dourado',
    bg: '#F7F2EA',
    surface: '#FBF7F0',
    card: '#FFFFFF',
    ink: '#2A2520',
    inkSoft: '#7A6E5F',
    inkMuted: '#A89B89',
    accent: '#B89968',
    accentDeep: '#8B7448',
    line: 'rgba(42,37,32,0.10)',
    placeholder: '#E8DFCF',
    placeholderStripe: '#DCCFB7',
  },
  oliva: {
    name: 'Oliva & Linho',
    bg: '#EFEDE3',
    surface: '#F6F4EB',
    card: '#FFFFFF',
    ink: '#22281C',
    inkSoft: '#5F6852',
    inkMuted: '#959A88',
    accent: '#7C8966',
    accentDeep: '#586148',
    line: 'rgba(34,40,28,0.10)',
    placeholder: '#DDDFCB',
    placeholderStripe: '#C9CDB3',
  },
  terracota: {
    name: 'Terracota',
    bg: '#F4ECE3',
    surface: '#FAF3EA',
    card: '#FFFFFF',
    ink: '#2C2018',
    inkSoft: '#7A5F4F',
    inkMuted: '#AE9A88',
    accent: '#B7704F',
    accentDeep: '#8C4F33',
    line: 'rgba(44,32,24,0.10)',
    placeholder: '#EAD9C7',
    placeholderStripe: '#D8BFA6',
  },
  noite: {
    name: 'Noite & Champanhe',
    bg: '#1F2128',
    surface: '#252830',
    card: '#2E3138',
    ink: '#F2EFE6',
    inkSoft: '#B8B0A0',
    inkMuted: '#7D7669',
    accent: '#C9A977',
    accentDeep: '#A88A5A',
    line: 'rgba(242,239,230,0.10)',
    placeholder: '#363841',
    placeholderStripe: '#42454F',
  },
};

const FONTS = {
  display: "'Cormorant Garamond', 'Times New Roman', serif",
  body: "'Manrope', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Caps lockup with wide tracking — mirrors save-the-date "SAVE THE DATE"
function CapsLine({ children, size = 12, color, weight = 400, style = {} }) {
  return (
    <div style={{
      fontFamily: FONTS.display,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: size > 20 ? '0.32em' : '0.28em',
      textTransform: 'uppercase',
      color,
      textIndent: '0.28em', // optical centering vs letterSpacing
      ...style,
    }}>{children}</div>
  );
}

// Thin gold rule used as a divider, optionally with a tiny ornament
function GoldRule({ color, width = 80, ornament = false, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, ...style }}>
      <div style={{ width, height: 1, background: color, opacity: 0.55 }} />
      {ornament && <Sprig size={10} color={color} />}
      {ornament && <div style={{ width, height: 1, background: color, opacity: 0.55 }} />}
    </div>
  );
}

// Monogram M ✿ R
function Monogram({ size = 48, color, style = {} }) {
  return (
    <div style={{
      fontFamily: FONTS.display, fontWeight: 400,
      fontSize: size, color, lineHeight: 1,
      display: 'inline-flex', alignItems: 'center', gap: size * 0.12,
      letterSpacing: '0.02em',
      ...style,
    }}>
      <span>M</span>
      <Sprig size={size * 0.34} color={color} />
      <span>R</span>
    </div>
  );
}

// Tiny 4-point sprig / star ornament
function Sprig({ size = 12, color = '#B89968' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z" fill={color} opacity="0.9" />
      <circle cx="12" cy="12" r="0.8" fill={color} />
    </svg>
  );
}

// Decorative botanical sprig (single line drawing) — used sparingly
function Botanical({ size = 80, color, opacity = 0.5, style = {} }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" style={{ display: 'block', ...style }}>
      <g stroke={color} strokeWidth="0.9" fill="none" opacity={opacity} strokeLinecap="round">
        <path d="M40 110 Q 40 60 40 4" />
        {/* leaves left */}
        <path d="M40 92 Q 22 88 14 78" />
        <path d="M40 92 Q 24 92 14 78 Q 22 88 40 92 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 74 Q 24 70 18 60" />
        <path d="M40 74 Q 26 74 18 60 Q 24 70 40 74 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 56 Q 26 52 22 44" />
        <path d="M40 56 Q 28 56 22 44 Q 26 52 40 56 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 38 Q 28 34 26 28" />
        <path d="M40 38 Q 30 38 26 28 Q 28 34 40 38 Z" fill={color} fillOpacity="0.18" stroke="none" />
        {/* leaves right */}
        <path d="M40 84 Q 56 80 64 70" />
        <path d="M40 84 Q 54 84 64 70 Q 56 80 40 84 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 66 Q 54 62 60 54" />
        <path d="M40 66 Q 52 66 60 54 Q 54 62 40 66 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 48 Q 52 44 56 38" />
        <path d="M40 48 Q 50 48 56 38 Q 52 44 40 48 Z" fill={color} fillOpacity="0.18" stroke="none" />
        <path d="M40 30 Q 50 26 52 22" />
        <path d="M40 30 Q 48 30 52 22 Q 50 26 40 30 Z" fill={color} fillOpacity="0.18" stroke="none" />
        {/* top bud */}
        <circle cx="40" cy="6" r="2.5" fill={color} opacity="0.5" stroke="none" />
      </g>
    </svg>
  );
}

// Striped SVG placeholder with a monospace caption — used for gift photos
function Placeholder({ width = '100%', height = 200, label = 'foto', palette, radius = 0, style = {} }) {
  const p = palette;
  const stripeId = React.useId();
  return (
    <div style={{ position: 'relative', width, height, borderRadius: radius, overflow: 'hidden', background: p.placeholder, ...style }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <defs>
          <pattern id={stripeId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={p.placeholderStripe} strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${stripeId})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONTS.mono, fontSize: 10, color: p.inkSoft,
        background: 'rgba(255,255,255,0.55)', mixBlendMode: 'normal',
        padding: '2px 8px', textAlign: 'center',
      }}>
        <span style={{ background: 'rgba(255,255,255,0.85)', padding: '4px 8px', borderRadius: 2, letterSpacing: '0.08em' }}>{label}</span>
      </div>
    </div>
  );
}

// Status bar with palette-aware ink (replaces default black/white only)
function StatusBar({ palette, time = '21:06' }) {
  const c = palette.ink;
  return (
    <div style={{
      display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
      padding: '21px 24px 19px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 1.5 }}>
        <span style={{ fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 590, fontSize: 17, lineHeight: '22px', color: c }}>{time}</span>
      </div>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 1, paddingRight: 1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// Phone shell with palette-aware background and status bar
function Phone({ palette, children, width = 390, height = 844, time, hideHomeIndicator = false, statusInk }) {
  const p = palette;
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden', position: 'relative',
      background: p.bg, fontFamily: FONTS.body, color: p.ink,
      boxShadow: '0 30px 60px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.10)',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#0F0E0C', zIndex: 50,
      }} />
      {/* status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <StatusBar palette={statusInk ? { ...p, ink: statusInk } : p} time={time} />
      </div>
      {/* content */}
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        {children}
      </div>
      {/* home indicator */}
      {!hideHomeIndicator && <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 8, pointerEvents: 'none',
      }}>
        <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.28)' }} />
      </div>}
    </div>
  );
}

// Primary button — gold fill
function ButtonPrimary({ children, palette, style = {}, subtle = false }) {
  const p = palette;
  return (
    <div style={{
      height: 54, borderRadius: 999,
      background: subtle ? 'transparent' : p.accent,
      color: subtle ? p.accent : '#fff',
      border: subtle ? `1px solid ${p.accent}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.display, fontSize: 16, letterSpacing: '0.22em', textTransform: 'uppercase',
      textIndent: '0.22em',
      fontWeight: 500,
      boxShadow: subtle ? 'none' : '0 8px 18px -8px rgba(0,0,0,0.25)',
      ...style,
    }}>{children}</div>
  );
}

// Pill (chip) — used for categories
function Pill({ children, active, palette, style = {} }) {
  const p = palette;
  return (
    <div style={{
      height: 30, padding: '0 14px', borderRadius: 999,
      background: active ? p.ink : 'transparent',
      color: active ? p.bg : p.inkSoft,
      border: active ? 'none' : `1px solid ${p.line}`,
      display: 'inline-flex', alignItems: 'center',
      fontFamily: FONTS.body, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</div>
  );
}

// Gifts data
const GIFTS = [
  { id: 'jantar', title: 'Jantar romântico', desc: 'Uma noite só nossa, com vinho e vista pro mar de Jericoacoara.', price: 300, category: 'Lua de mel', badge: 'Mais escolhido' },
  { id: 'cafe', title: 'Café da manhã na cama', desc: 'O primeiro café da manhã como casados — preguiçoso, doce, devagar.', price: 80, category: 'Lua de mel' },
  { id: 'passeio', title: 'Passeio de buggy', desc: 'Dunas, lagoas e o vento despenteando os votos.', price: 220, category: 'Lua de mel' },
  { id: 'massagem', title: 'Massagem a dois', desc: 'Relaxar depois de meses de planilhas e provas de bolo.', price: 450, category: 'Lua de mel' },
  { id: 'champanhe', title: 'Brinde de champanhe', desc: 'Pra abrir na primeira noite da viagem.', price: 180, category: 'Lua de mel', badge: 'Favorito do noivo' },
  { id: 'panelas', title: 'Jogo de panelas', desc: 'Pra inaugurar a cozinha e os jantares de domingo.', price: 600, category: 'Casa nova' },
  { id: 'jogo-cama', title: 'Jogo de cama de linho', desc: 'O ninho onde a vida em comum começa de verdade.', price: 350, category: 'Casa nova' },
  { id: 'plantas', title: 'Plantas pra varanda', desc: 'Costela-de-adão, samambaia e uma jiboia teimosa.', price: 120, category: 'Casa nova' },
  { id: 'livros', title: 'Livros pra estante', desc: 'Pra ler em voz alta nas tardes de domingo.', price: 90, category: 'Casa nova' },
  { id: 'cinema', title: 'Sessão de cinema', desc: 'Pipoca, refrigerante e um filme que a gente nem precisa concordar.', price: 60, category: 'Pra nós' },
];

Object.assign(window, {
  PALETTES, FONTS, CapsLine, GoldRule, Monogram, Sprig, Botanical,
  Placeholder, StatusBar, Phone, ButtonPrimary, Pill, GIFTS,
});
