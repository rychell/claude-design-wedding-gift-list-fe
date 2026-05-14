// app.jsx — main composition: DesignCanvas + Tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "paletteKey": "bege",
  "cardLayout": "grade"
}/*EDITMODE-END*/;

// Each palette renders as a swatch chip in TweakColor.
const PALETTE_SWATCHES = Object.entries(PALETTES).map(([key, p]) => ({
  key,
  swatch: [p.bg, p.accent, p.ink, p.surface],
}));

function App() {
  // useTweaks returns a tuple [values, setTweak] — destructure it
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const paletteKey = t.paletteKey || 'bege';
  const palette = PALETTES[paletteKey] || PALETTES.bege;
  const cardLayout = t.cardLayout || 'grade';

  const activeSwatch = PALETTE_SWATCHES.find((s) => s.key === paletteKey)?.swatch || PALETTE_SWATCHES[0].swatch;

  const onPickPalette = (arr) => {
    const found = PALETTE_SWATCHES.find((s) => JSON.stringify(s.swatch) === JSON.stringify(arr));
    if (found) setTweak('paletteKey', found.key);
  };

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="entry" title="Convite & Boas-vindas" subtitle="A primeira tela que o convidado recebe pelo WhatsApp. Discreta, emocional, com chamada clara pra lista.">
          <DCArtboard id="capa" label="Capa" width={390} height={844}>
            <ScreenCapa palette={palette} />
          </DCArtboard>
          <DCArtboard id="evento" label="Evento" width={390} height={844}>
            <ScreenEvento palette={palette} />
          </DCArtboard>
          <DCArtboard id="historia" label="Nossa história" width={390} height={844}>
            <ScreenHistoria palette={palette} />
          </DCArtboard>
        </DCSection>

        <DCSection id="fluxo" title="Fluxo de presentear" subtitle="Lista → Detalhe → Confirmação → Pagamento. Sem login, sem fricção.">
          <DCArtboard id="lista" label={`Lista · ${cardLayout}`} width={390} height={844}>
            <ScreenLista palette={palette} layout={cardLayout} />
          </DCArtboard>
          <DCArtboard id="detalhe" label="Detalhe do presente" width={390} height={844}>
            <ScreenDetalhe palette={palette} />
          </DCArtboard>
          <DCArtboard id="livre" label="Presente livre" width={390} height={844}>
            <ScreenLivre palette={palette} />
          </DCArtboard>
          <DCArtboard id="confirmar" label="Confirmação" width={390} height={844}>
            <ScreenConfirmar palette={palette} />
          </DCArtboard>
          <DCArtboard id="loading" label="Redirecionando" width={390} height={844}>
            <ScreenLoading palette={palette} />
          </DCArtboard>
          <DCArtboard id="obrigado" label="Agradecimento" width={390} height={844}>
            <ScreenObrigado palette={palette} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Paleta">
          <TweakColor
            label="Tons"
            value={activeSwatch}
            options={PALETTE_SWATCHES.map((s) => s.swatch)}
            onChange={onPickPalette}
          />
          <TweakSelect
            label="Nome"
            value={paletteKey}
            options={Object.entries(PALETTES).map(([k, p]) => ({ value: k, label: p.name }))}
            onChange={(v) => setTweak('paletteKey', v)}
          />
        </TweakSection>

        <TweakSection label="Layout da lista">
          <TweakRadio
            label="Cards"
            value={cardLayout}
            options={[
              { value: 'grade', label: 'Grade' },
              { value: 'lista', label: 'Lista' },
              { value: 'editorial', label: 'Editorial' },
            ]}
            onChange={(v) => setTweak('cardLayout', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
