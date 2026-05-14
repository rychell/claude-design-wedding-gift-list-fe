// screens.jsx — all wedding site screens

// ─────────────────────────────────────────────────────────────
// 1) CAPA / HOME
// ─────────────────────────────────────────────────────────────
function ScreenCapa({ palette: p }) {
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 28px 34px', display: 'flex', flexDirection: 'column' }}>
        {/* top tag */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <CapsLine size={11} color={p.inkSoft} weight={400}>Casamento</CapsLine>
          <GoldRule color={p.accent} width={18} />
        </div>

        {/* names */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 400, color: p.ink, lineHeight: 1.02, letterSpacing: '-0.01em' }}>
            Mayara
          </div>
          <div style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 28, fontWeight: 300, color: p.accent, margin: '4px 0' }}>
            &amp;
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 400, color: p.ink, lineHeight: 1.02, letterSpacing: '-0.01em' }}>
            Rychell
          </div>
        </div>

        {/* photo placeholder, oval */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <Placeholder width={210} height={260} radius={130} palette={p} label="foto do casal" />
        </div>

        {/* date */}
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, fontFamily: FONTS.display, color: p.ink }}>
            <span style={{ fontSize: 13, letterSpacing: '0.32em', color: p.inkSoft }}>SAB</span>
            <span style={{ width: 1, height: 22, background: p.line }} />
            <span style={{ fontSize: 22, fontWeight: 400 }}>21 · 06 · 2026</span>
            <span style={{ width: 1, height: 22, background: p.line }} />
            <span style={{ fontSize: 13, letterSpacing: '0.32em', color: p.inkSoft }}>FOR</span>
          </div>
          {/* countdown — discreet */}
          <div style={{ marginTop: 14, fontFamily: FONTS.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.inkMuted }}>
            faltam 38 dias
          </div>
        </div>

        {/* spacer + CTAs */}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ButtonPrimary palette={p}>Ver lista de presentes</ButtonPrimary>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 26,
            fontFamily: FONTS.body, fontSize: 12, color: p.inkSoft, paddingTop: 8,
          }}>
            <span style={{ borderBottom: `1px solid ${p.line}`, paddingBottom: 3 }}>Evento</span>
            <span style={{ borderBottom: `1px solid ${p.line}`, paddingBottom: 3 }}>Nossa história</span>
            <span style={{ borderBottom: `1px solid ${p.line}`, paddingBottom: 3 }}>Compartilhar</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 2) LISTA DE PRESENTES
// ─────────────────────────────────────────────────────────────
function ScreenLista({ palette: p, layout = 'grade' }) {
  const cats = ['Todos', 'Lua de mel', 'Casa nova', 'Pra nós'];

  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '64px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Monogram size={22} color={p.accent} />
            <div style={{
              width: 36, height: 36, borderRadius: 999, border: `1px solid ${p.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <CapsLine size={10} color={p.accent}>Lista de presentes</CapsLine>
            <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, lineHeight: 1.05, color: p.ink, margin: '8px 0 6px', letterSpacing: '-0.01em' }}>
              Pequenos <em style={{ fontStyle: 'italic', color: p.accent, fontWeight: 300 }}>gestos</em><br/>pra começar a dois.
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 13, lineHeight: 1.5, color: p.inkSoft, margin: 0, maxWidth: 280 }}>
              Escolha um presente simbólico — cada um nos ajuda a construir um pedacinho dessa vida nova.
            </p>
          </div>
          {/* pills */}
          <div style={{ display: 'flex', gap: 6, marginTop: 18, overflow: 'hidden' }}>
            {cats.map((c, i) => <Pill key={c} active={i === 0} palette={p}>{c}</Pill>)}
          </div>
        </div>

        {/* gifts */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '20px 24px 100px', marginTop: 4 }}>
          {layout === 'grade' && <GiftsGrid palette={p} />}
          {layout === 'lista' && <GiftsList palette={p} />}
          {layout === 'editorial' && <GiftsEditorial palette={p} />}
        </div>
      </div>
    </Phone>
  );
}

// Horizontal "surprise us" card — distinct from regular gift tiles.
// Uses an asymmetric editorial layout, gold-on-dark feel, with a botanical sprig.
function SurpreendaCard({ palette: p, style = {} }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 16, padding: '20px 22px 20px 20px',
      background: `linear-gradient(135deg, ${p.surface} 0%, ${p.card} 100%)`,
      border: `1px solid ${p.accent}55`,
      display: 'flex', alignItems: 'stretch', gap: 16,
      ...style,
    }}>
      {/* large botanical hugging the left edge */}
      <div style={{ position: 'relative', width: 70, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: '-10px -10px -10px -10px', borderRadius: '50%',
          background: `radial-gradient(circle, ${p.accent}1f 0%, transparent 70%)`,
        }} />
        <Botanical size={56} color={p.accent} opacity={0.85} />
      </div>
      {/* text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: p.accent, fontWeight: 500 }}>
          ★  Presente livre
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontStyle: 'italic', fontWeight: 400, color: p.ink, marginTop: 4, lineHeight: 1.05 }}>
          Nos surpreenda.
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: p.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
          Contribua com o valor que fizer sentido pra você.
        </div>
      </div>
      {/* arrow chip */}
      <div style={{
        alignSelf: 'center', flexShrink: 0,
        width: 38, height: 38, borderRadius: 999,
        background: p.accent, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 6px 14px -4px ${p.accent}80`,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {/* corner gold rule */}
      <div style={{
        position: 'absolute', top: 14, right: 14, fontFamily: FONTS.display,
        fontSize: 9, letterSpacing: '0.22em', color: p.accent, textTransform: 'uppercase', opacity: 0.7,
      }}>R$ — ——</div>
    </div>
  );
}

function GiftsGrid({ palette: p }) {
  const items = GIFTS.slice(0, 6);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {items.map((g) => (
        <div key={g.id} style={{ background: p.card, borderRadius: 14, padding: 10, border: `1px solid ${p.line}` }}>
          <div style={{ position: 'relative' }}>
            <Placeholder height={120} radius={10} palette={p} label={g.id} />
            {g.badge && (
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(255,255,255,0.92)', color: p.accentDeep,
                fontFamily: FONTS.display, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '4px 8px', borderRadius: 999, fontWeight: 500,
              }}>★ {g.badge.split(' ')[0]}</div>
            )}
          </div>
          <div style={{ padding: '10px 4px 4px' }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 17, lineHeight: 1.15, color: p.ink, fontWeight: 400 }}>{g.title}</div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: p.accentDeep }}>R$ {g.price}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 10, color: p.inkMuted, letterSpacing: '0.06em' }}>→</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1' }}>
        <SurpreendaCard palette={p} />
      </div>
    </div>
  );
}

function GiftsList({ palette: p }) {
  const items = GIFTS.slice(0, 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((g) => (
        <div key={g.id} style={{ display: 'flex', gap: 14, background: p.card, borderRadius: 12, padding: 10, border: `1px solid ${p.line}`, alignItems: 'center' }}>
          <Placeholder width={86} height={86} radius={8} palette={p} label={g.id} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {g.badge && (
              <div style={{ fontFamily: FONTS.display, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accentDeep, marginBottom: 4 }}>
                ★ {g.badge}
              </div>
            )}
            <div style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 400, color: p.ink, lineHeight: 1.15 }}>{g.title}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, color: p.inkSoft, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.desc}</div>
            <div style={{ marginTop: 6, fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: p.accentDeep }}>R$ {g.price}</div>
          </div>
        </div>
      ))}
      <SurpreendaCard palette={p} />
    </div>
  );
}

function GiftsEditorial({ palette: p }) {
  const items = GIFTS.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <SurpreendaCard palette={p} />
      {items.map((g, i) => (
        <div key={g.id}>
          <Placeholder height={210} radius={14} palette={p} label={g.id} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12, gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.inkSoft }}>
                Nº {String(i + 1).padStart(2, '0')}  ·  {g.category}
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 400, color: p.ink, lineHeight: 1.1, marginTop: 4 }}>{g.title}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: p.inkSoft, marginTop: 6, lineHeight: 1.5 }}>{g.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: '0.22em', color: p.inkMuted }}>R$</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 28, color: p.accentDeep }}>{g.price}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) DETALHE DO PRESENTE
// ─────────────────────────────────────────────────────────────
function ScreenDetalhe({ palette: p }) {
  const g = GIFTS[0];
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* hero image */}
        <div style={{ position: 'relative', height: 360 }}>
          <Placeholder width="100%" height={360} palette={p} label={g.id} />
          {/* back button */}
          <div style={{
            position: 'absolute', top: 60, left: 20,
            width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {/* badge */}
          <div style={{
            position: 'absolute', top: 60, right: 20,
            background: 'rgba(255,255,255,0.92)', padding: '6px 12px', borderRadius: 999,
            fontFamily: FONTS.display, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.accentDeep,
          }}>★ Mais escolhido</div>
        </div>

        {/* content card */}
        <div style={{
          marginTop: -24, borderRadius: '24px 24px 0 0', background: p.bg,
          padding: '26px 24px 24px', flex: 1, position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
        }}>
          <CapsLine size={10} color={p.accent}>{g.category}</CapsLine>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 32, color: p.ink, margin: '8px 0 10px', lineHeight: 1.1, letterSpacing: '-0.005em' }}>
            {g.title}
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.55, color: p.inkSoft, margin: '0 0 18px' }}>
            {g.desc} Uma noite que a gente vai contar pros nossos filhos, em algum domingo de chuva, anos depois.
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 14, color: p.inkSoft }}>R$</span>
            <span style={{ fontFamily: FONTS.display, fontSize: 44, color: p.ink, fontWeight: 400, lineHeight: 1 }}>300</span>
          </div>

          {/* identify toggle */}
          <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 14, background: p.surface, border: `1px solid ${p.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: p.ink }}>Quero me identificar</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11, color: p.inkMuted, marginTop: 2 }}>Opcional — assim a gente sabe que foi você</div>
              </div>
              {/* toggle on */}
              <div style={{ width: 42, height: 24, borderRadius: 999, background: p.accent, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: 999, background: '#fff' }} />
              </div>
            </div>
            {/* inputs revealed */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px 12px', borderRadius: 10, background: '#fff', border: `1px solid ${p.line}`, fontFamily: FONTS.body, fontSize: 13, color: p.ink }}>
                Camila Andrade
              </div>
              <div style={{ padding: '10px 12px', borderRadius: 10, background: '#fff', border: `1px solid ${p.line}`, fontFamily: FONTS.body, fontSize: 13, color: p.inkSoft, minHeight: 56 }}>
                Que essa noite seja só o começo de muitas. Amo vocês. ✨
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <ButtonPrimary palette={p} style={{ marginTop: 16 }}>Presentear · R$ 300</ButtonPrimary>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 4) MODAL DE CONFIRMAÇÃO
// ─────────────────────────────────────────────────────────────
function ScreenConfirmar({ palette: p }) {
  return (
    <Phone palette={p}>
      {/* dimmed list behind */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ filter: 'blur(2px)', opacity: 0.7, transform: 'scale(1)' }}>
          <ScreenListaInner palette={p} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,22,16,0.45)' }} />
      </div>

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: p.bg, borderRadius: '28px 28px 0 0',
        padding: '24px 24px 30px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: p.line, margin: '0 auto 22px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Sprig size={26} color={p.accent} />
          <h3 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 26, color: p.ink, margin: '12px 0 6px', textAlign: 'center', lineHeight: 1.15 }}>
            Confirmar presente
          </h3>
          <p style={{ fontFamily: FONTS.body, fontSize: 12.5, color: p.inkSoft, textAlign: 'center', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
            Você vai ser redirecionada pro Mercado Pago em um instante.
          </p>
        </div>

        <div style={{ marginTop: 22, padding: '16px 16px', background: p.surface, borderRadius: 14, border: `1px solid ${p.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px solid ${p.line}` }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, color: p.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Presente</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, color: p.ink, marginTop: 2 }}>Jantar romântico</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, color: p.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Valor</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, color: p.accentDeep, marginTop: 2 }}>R$ 300</div>
            </div>
          </div>
          <div style={{ paddingTop: 12 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, color: p.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>De</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, color: p.ink, marginTop: 2 }}>Camila Andrade</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ButtonPrimary palette={p}>Ir pro pagamento</ButtonPrimary>
          <div style={{ textAlign: 'center', fontFamily: FONTS.body, fontSize: 13, color: p.inkSoft, padding: '12px 0' }}>
            Voltar
          </div>
        </div>
      </div>
    </Phone>
  );
}

// inner used only for blur backdrop
function ScreenListaInner({ palette: p }) {
  return (
    <div style={{ width: 390, height: 844, padding: '64px 24px 0', background: p.bg }}>
      <CapsLine size={10} color={p.accent}>Lista de presentes</CapsLine>
      <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 32, lineHeight: 1.05, color: p.ink, margin: '8px 0 16px' }}>
        Pequenos <em style={{ fontStyle: 'italic', color: p.accent }}>gestos</em>
      </h1>
      <GiftsGrid palette={p} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5) LOADING / REDIRECT
// ─────────────────────────────────────────────────────────────
function ScreenLoading({ palette: p }) {
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        {/* spinner */}
        <div style={{ width: 80, height: 80, position: 'relative' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" stroke={p.line} strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="40" r="32" stroke={p.accent} strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeDasharray="50 150" transform="rotate(-90 40 40)">
              <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="1.4s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprig size={20} color={p.accent} />
          </div>
        </div>
        <div style={{ marginTop: 28, fontFamily: FONTS.display, fontSize: 22, color: p.ink, textAlign: 'center', lineHeight: 1.2, fontStyle: 'italic', fontWeight: 300 }}>
          Levando você ao<br />pagamento…
        </div>
        <div style={{ marginTop: 12, fontFamily: FONTS.body, fontSize: 12, color: p.inkSoft, textAlign: 'center', maxWidth: 240 }}>
          Mercado Pago em uma janela segura.
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 6) AGRADECIMENTO
// ─────────────────────────────────────────────────────────────
function ScreenObrigado({ palette: p }) {
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 28px 34px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ marginTop: 30 }}>
          <Botanical size={70} color={p.accent} opacity={0.7} />
        </div>
        <CapsLine size={11} color={p.accent} style={{ marginTop: 20 }}>De coração</CapsLine>
        <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 44, color: p.ink, margin: '14px 0 0', lineHeight: 1.05 }}>
          Obrigado,<br /><em style={{ fontStyle: 'italic', color: p.accent, fontWeight: 300 }}>Camila</em>.
        </h1>
        <GoldRule color={p.accent} width={36} style={{ marginTop: 22 }} />
        <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: p.inkSoft, marginTop: 22, lineHeight: 1.45, maxWidth: 280 }}>
          Cada gesto vira lembrança — e a gente vai lembrar de você no jantar mais bonito da nossa lua de mel.
        </p>
        <div style={{ marginTop: 14, fontFamily: FONTS.body, fontSize: 13, color: p.ink }}>
          com amor, <span style={{ fontFamily: FONTS.display, fontStyle: 'italic' }}>Mayara &amp; Rychell</span>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ButtonPrimary palette={p}>Voltar pra lista</ButtonPrimary>
          <ButtonPrimary palette={p} subtle>Compartilhar no WhatsApp</ButtonPrimary>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 7) EVENTO
// ─────────────────────────────────────────────────────────────
function ScreenEvento({ palette: p }) {
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* hero */}
        <div style={{ position: 'relative' }}>
          <Placeholder height={300} palette={p} label="local do evento" />
          <div style={{
            position: 'absolute', top: 60, left: 20,
            width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: `linear-gradient(180deg, transparent, ${p.bg})`,
          }} />
        </div>

        <div style={{ padding: '8px 28px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CapsLine size={10} color={p.accent}>O grande dia</CapsLine>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: p.ink, margin: '8px 0 0', lineHeight: 1.05 }}>
            21 <em style={{ fontStyle: 'italic', color: p.accent }}>de junho</em> de 2026
          </h2>

          {/* details grid */}
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 0, border: `1px solid ${p.line}`, borderRadius: 14, overflow: 'hidden', background: p.surface }}>
            <EventRow palette={p} label="Horário" value="16h00" caption="Cerimônia · jardim externo" />
            <EventRow palette={p} label="Local" value="Villa Saint-Tropez" caption="Eusébio · CE" />
            <EventRow palette={p} label="Recepção" value="A partir das 18h" caption="No mesmo endereço" />
            <EventRow palette={p} label="Dress code" value="Esporte fino" caption="Tons claros são bem-vindos" last />
          </div>

          {/* map preview */}
          <div style={{ marginTop: 18, borderRadius: 14, overflow: 'hidden', border: `1px solid ${p.line}`, position: 'relative', height: 130 }}>
            <MapTile palette={p} />
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              padding: '10px 12px', background: 'rgba(255,255,255,0.95)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backdropFilter: 'blur(6px)',
            }}>
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, color: p.ink }}>Rua das Acácias, 1280</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 10.5, color: p.inkSoft, marginTop: 1 }}>Eusébio · CE</div>
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, color: p.accent, letterSpacing: '0.06em' }}>Abrir no mapa →</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ marginTop: 16, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 14, color: p.inkSoft, textAlign: 'center' }}>
            A gente vai te esperar no fim daquele corredor de flores.
          </div>
        </div>
      </div>
    </Phone>
  );
}

function EventRow({ palette: p, label, value, caption, last }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${p.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.inkSoft, width: 90 }}>
        {label}
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, color: p.ink, lineHeight: 1.15 }}>{value}</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: p.inkMuted, marginTop: 2 }}>{caption}</div>
      </div>
    </div>
  );
}

function MapTile({ palette: p }) {
  // stylized abstract map
  return (
    <svg viewBox="0 0 320 130" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', background: p.placeholder }}>
      <defs>
        <pattern id="mapdots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill={p.placeholderStripe} />
        </pattern>
      </defs>
      <rect width="320" height="130" fill="url(#mapdots)" />
      <path d="M0 60 Q 60 50 120 70 T 240 60 T 360 80" stroke={p.placeholderStripe} strokeWidth="14" fill="none" opacity="0.6" />
      <path d="M0 60 Q 60 50 120 70 T 240 60 T 360 80" stroke="#fff" strokeWidth="2" strokeDasharray="3 4" fill="none" />
      <path d="M40 0 L60 130" stroke={p.placeholderStripe} strokeWidth="22" opacity="0.5" />
      <path d="M40 0 L60 130" stroke="#fff" strokeWidth="2" strokeDasharray="3 4" />
      {/* marker */}
      <g transform="translate(180, 50)">
        <circle r="14" fill={p.accent} opacity="0.18" />
        <circle r="8" fill={p.accent} />
        <circle r="3" fill="#fff" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 8) NOSSA HISTÓRIA
// ─────────────────────────────────────────────────────────────
function ScreenHistoria({ palette: p }) {
  const milestones = [
    { year: '2019', when: 'agosto', title: 'Onde tudo começou', body: '[texto aqui — como vocês se conheceram]' },
    { year: '2020', when: 'fevereiro', title: 'O primeiro sim', body: '[texto aqui — o primeiro encontro, a primeira viagem…]' },
    { year: '2023', when: 'dezembro', title: 'O pedido', body: '[texto aqui — onde foi, como foi]' },
    { year: '2026', when: 'junho', title: 'O grande dia', body: '[texto aqui — convite final]' },
  ];
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '64px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <Monogram size={22} color={p.accent} />
            <div style={{ width: 38 }} />
          </div>
          <div style={{ marginTop: 22 }}>
            <CapsLine size={10} color={p.accent}>Nossa história</CapsLine>
            <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: p.ink, lineHeight: 1.05, margin: '8px 0 6px' }}>
              Sete <em style={{ fontStyle: 'italic', color: p.accent, fontWeight: 300 }}>anos</em> em quatro<br />capítulos.
            </h1>
          </div>
        </div>

        {/* timeline */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '22px 24px 28px', position: 'relative' }}>
          {/* vertical rule */}
          <div style={{ position: 'absolute', left: 38, top: 22, bottom: 28, width: 1, background: p.line }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                <div style={{ width: 28, paddingTop: 6, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 999, background: p.accent, margin: '0 auto', boxShadow: `0 0 0 4px ${p.bg}` }} />
                </div>
                <div style={{ flex: 1, paddingBottom: 6 }}>
                  <div style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.inkSoft }}>
                    {m.year} · {m.when}
                  </div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, color: p.ink, margin: '4px 0 6px', lineHeight: 1.15 }}>
                    {m.title}
                  </div>
                  <Placeholder height={110} radius={10} palette={p} label={`foto ${i + 1}`} style={{ marginBottom: 10 }} />
                  <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: p.inkMuted, padding: '6px 0', borderTop: `1px dashed ${p.line}`, borderBottom: `1px dashed ${p.line}` }}>
                    {m.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 9) PRESENTE LIVRE / NOS SURPREENDA
// ─────────────────────────────────────────────────────────────
function ScreenLivre({ palette: p }) {
  return (
    <Phone palette={p}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '64px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <Monogram size={22} color={p.accent} />
            <div style={{ width: 38 }} />
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px 28px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Botanical size={56} color={p.accent} opacity={0.6} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <CapsLine size={11} color={p.accent}>Presente livre</CapsLine>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 36, color: p.ink, margin: '10px 0 0', lineHeight: 1.1 }}>
              Nos <em style={{ fontStyle: 'italic', color: p.accent, fontWeight: 300 }}>surpreenda.</em>
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 13.5, color: p.inkSoft, marginTop: 10, lineHeight: 1.55, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
              Contribua com o valor que fizer sentido pra você — qualquer gesto cabe.
            </p>
          </div>

          {/* big amount input */}
          <div style={{ marginTop: 26, padding: '22px 18px', background: p.surface, borderRadius: 16, border: `1px solid ${p.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontFamily: FONTS.display, fontSize: 22, color: p.inkSoft }}>R$</span>
              <span style={{ fontFamily: FONTS.display, fontSize: 64, color: p.ink, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em' }}>
                150<span style={{ fontSize: 32, color: p.inkMuted }}>,00</span>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {[50, 100, 150, 250, 500].map((v) => (
                <div key={v} style={{
                  padding: '7px 12px', borderRadius: 999,
                  border: v === 150 ? `1px solid ${p.accent}` : `1px solid ${p.line}`,
                  background: v === 150 ? p.accent + '15' : 'transparent',
                  fontFamily: FONTS.body, fontSize: 12, color: v === 150 ? p.accentDeep : p.inkSoft, fontWeight: 500,
                }}>R$ {v}</div>
              ))}
            </div>
          </div>

          {/* mini message */}
          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: p.card, border: `1px solid ${p.line}` }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, color: p.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Mensagem (opcional)</div>
            <div style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 16, color: p.inkSoft, marginTop: 6, lineHeight: 1.4 }}>
              Que esse comecinho de vida a dois seja como vocês — gentil e divertido.
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <ButtonPrimary palette={p} style={{ marginTop: 16 }}>Presentear · R$ 150</ButtonPrimary>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenCapa, ScreenLista, ScreenDetalhe, ScreenConfirmar,
  ScreenLoading, ScreenObrigado, ScreenEvento, ScreenHistoria, ScreenLivre,
});
