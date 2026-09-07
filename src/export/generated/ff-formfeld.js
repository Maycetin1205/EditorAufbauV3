(function(e,t,n,r,i,a,o,s,c,l,u,d,f){var p={attributeName:`fieldType`,equals:`nachschlagen`},m=[{attributeName:`fieldType`,name:`Feldtyp`,description:`Welche Art Eingabe das Feld annimmt.`,kind:`select`,options:[{value:`text`,label:`Text`},{value:`number`,label:`Zahl`},{value:`textarea`,label:`Mehrzeilig`},{value:`select`,label:`Auswahl`},{value:`date`,label:`Datum`},{value:`time`,label:`Uhrzeit`},{value:`checkbox`,label:`Ankreuzfeld`},{value:`nachschlagen`,label:`Nachschlagen`}]},{attributeName:`options`,name:`Auswahl-Optionen`,description:`Einträge durch Komma getrennt, z. B. "Zimmer 1, Zimmer 2".`,kind:`text`,visibleWhen:{attributeName:`fieldType`,equals:`select`}},{attributeName:`nachschlagQuelle`,name:`Quelle`,description:`Quelle, aus der der Bediener eine Zeile wählt.`,kind:`quelle`,visibleWhen:p},{attributeName:`speicherFeld`,name:`Gespeichert wird`,description:`Feld, dessen Wert die Maske sich merkt (z. B. die Nummer).`,kind:`field`,quelleProp:`nachschlagQuelle`,klarnameProp:`speicherTitel`,visibleWhen:p},(0,o.jaNeinProperty)(`einzigerTreffer`,`Einzigen Treffer übernehmen`,`Bleibt genau ein Satz übrig, übernimmt das Feld ihn von selbst.`,{visibleWhen:p}),{attributeName:`valueField`,name:`Feld`,description:`Feld, dessen Wert angezeigt wird.`,kind:`field`,visibleWhen:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]}},{attributeName:`darstellung`,name:`Darstellung`,description:`Kasten oder dezente Linie (z. B. Unterschriftsbereich).`,kind:`select`,options:[{value:`standard`,label:`Standard (Kasten)`},{value:`linie`,label:`Linie (Unterstrichen)`}],visibleWhen:{attributeName:`fieldType`,keinesVon:[`checkbox`]}}],h=new WeakMap,g=new WeakSet;function _(e){let t=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(e);return t?`${t[3]}-${t[2]}-${t[1]}`:e}function v(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}.${t[2]}.${t[1]}`:e}function y(e){return typeof e.value==`string`?e.value:``}function b(e){if(e.pruefeEigenenWert?.(),e.getAttribute(`fieldtype`)===`nachschlagen`){h.delete(e);return}let t=(0,u.leseGebundeneStelle)(e,(0,s.bindingAttr)(`value`));if(t.art!==`wert`){h.delete(e),(0,r.klareAuswahl)((0,r.geberIdVon)(e)),t.art===`ohneZeile`&&(e.value=``);return}let{zeile:n,quelle:i,quelleId:a,reinerCode:o,wert:l}=t,d=(0,c.satzIndexVon)(i,n);a===``?h.set(e,{row:n,code:o,pindex:d}):h.delete(e),e.value=l,(0,r.setzeAuswahl)((0,r.geberIdVon)(e),n)}function x(e){let t=h.get(e);return t&&(0,c.setField)(t.row,t.code,y(e)),t}function S(e){g.has(e)||(g.add(e),e.addEventListener(`input`,()=>{x(e)}),e.addEventListener(`change`,()=>{let t=x(e);(0,d.runEvent)(e,`onChange`,{VALUE:y(e),PINDEX:t?.pindex??``}).catch(d.meldeKettenFehler)}))}var C=(0,l.macheDatenAnschluss)({hydriere:b,verdrahte:S}),w=C.connect,T=C.disconnect,E=e.css`
  .feld {
    font-family: var(--se-font);

    --feld-pad-y: 7px;
    --feld-pad-x: 10px;
    --feld-rand: var(--se-border);
  }

  .huelle { position: relative; }

  .ctrl {
    box-sizing: border-box;
    width: 100%;
    padding: var(--feld-pad-y) var(--feld-pad-x);
    border: var(--feld-rand) solid var(--se-line);
    background: var(--se-panel);
    border-radius: var(--se-r-md);
    font-family: var(--se-font);
    font-size: var(--se-fs);

    line-height: 1.4;
    color: var(--se-ink);
  }
  .ctrl:focus {
    outline: none;
    border-color: var(--se-accent);
    box-shadow: 0 0 0 var(--se-border) var(--se-accent);
  }
  textarea.ctrl {
    display: block;
    resize: vertical;
    min-height: 64px;
  }
  select.ctrl { padding: calc(var(--feld-pad-y) - 1px) calc(var(--feld-pad-x) - 2px); }

  .feld.linie .ctrl,
  :host([data-ff-editor]) .feld.linie .ctrl,
  :host([data-ff-editor]) .feld.linie .huelle[data-ff-bound] .ctrl,
  :host([data-ff-editor]) .feld.linie .nachschlag .ctrl {
    border: none !important;
    border-bottom: 1.5px solid var(--se-line) !important;
    border-radius: 0 !important;
    background: transparent !important;
    padding-left: 2px;
    padding-right: 2px;
    box-shadow: none !important;
    outline: none !important;
  }
  .feld.linie .ctrl:focus {
    outline: none !important;
    border-bottom-color: var(--se-accent) !important;
    box-shadow: none !important;
  }
  .feld.linie [data-ff-bound] {
    text-decoration: none !important;
  }
  .feld.linie .ph {
    left: 2px;
    right: 2px;
  }

  .ph {
    position: absolute;
    top: calc(var(--feld-pad-y) + var(--feld-rand));
    left: calc(var(--feld-pad-x) + var(--feld-rand));
    right: calc(var(--feld-pad-x) + var(--feld-rand));
    color: var(--se-faint);
    font-size: var(--se-fs);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }
  .ph[hidden] { display: none; }

  .ph-select {
    top: calc(var(--feld-pad-y) - 1px + var(--feld-rand));
    left: calc(var(--feld-pad-x) - 2px + var(--feld-rand));
    right: 25px;
  }

  /* Der Platzhalter laesst die Lupe frei: im Editor ist er klickbar und wuerde
     sie sonst fast ganz verdecken. */
  .ph-nachschlag { right: 34px; }

  .huelle.leer input[type="date"]:not(:focus)::-webkit-datetime-edit,
  .huelle.leer input[type="time"]:not(:focus)::-webkit-datetime-edit { opacity: 0; }
  .huelle.leer.tippt .ph-nativ { display: none; }

  .zeile {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--se-fs);
    color: var(--se-ink);
  }
  input[type='checkbox'].ctrl {
    width: 15px;
    height: 15px;
    padding: 0;
    flex: none;
    accent-color: var(--se-accent);
  }

  .nachschlag { position: relative; }
  .nachschlag .ctrl { padding-right: 34px; border-style: dashed; }

  /* Die offene Vorschlagsliste haengt unten aus dem Feld heraus; Raster-Kinder
     stapeln in DOM-Reihenfolge, ohne diesen Vorrang laege sie unter dem
     naechsten Baustein. */
  :host([data-ff-liste]) { position: relative; z-index: 5; }

  .lupe {
    position: absolute;
    top: var(--feld-rand);
    bottom: var(--feld-rand);
    right: var(--feld-rand);
    width: 30px;
    display: grid;
    place-items: center;
    padding: 0;
    border: none;
    background: none;
    color: var(--se-muted);
    cursor: pointer;
    transition: background var(--se-move);
  }
  .lupe:hover { background: var(--se-accent-soft); color: var(--se-ink); }
  .lupe:focus-visible { outline: 2px solid var(--se-accent); outline-offset: -2px; }

  :host([data-ff-editor]) .ctrl { pointer-events: none; }
  /* Die Lupe bleibt im Editor bedienbar: sie oeffnet das Spalten-Stellen. */
  :host([data-ff-editor]) .ph { pointer-events: auto; cursor: text; }
  :host([data-ff-editor]) .feld:not(.linie) .huelle[data-ff-bound] .ctrl {
    border-style: dotted;
    border-color: var(--se-accent);
  }

  :host([data-ff-editor]) [data-ff-editable]:empty::before { content: 'Text …'; opacity: 0.6; }

  :host(:not([data-ff-editor])) .zeile .text { cursor: pointer; user-select: none; }

  :host([fuellt]) .feld,
  :host([fuellt]) .huelle { height: 100%; }
  :host([fuellt]) .huelle .ctrl { height: 100%; }
`,D=[`text`,`number`,`textarea`,`select`,`date`,`time`,`checkbox`,`nachschlagen`];function O(e){return D.includes(e)?e:`text`}var k=[`text`,`number`,`textarea`,`select`,`nachschlagen`,`date`,`time`],A={select:`ph-select`,date:`ph-nativ`,time:`ph-nativ`,nachschlagen:`ph-nachschlag`};function j(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var M=class t extends n.BasicBlock{constructor(...e){super(...e),this.fieldType=`text`,this.placeholder=`Feldname`,this.options=``,this.source=``,this.value=``,this.valueField=``,this.nachschlagQuelle=``,this.speicherFeld=``,this.speicherTitel=``,this.nachschlagSpalten=[],this.fensterBreite=f.FENSTER_BREITE,this.fensterHoehe=f.FENSTER_HOEHE,this.einzigerTreffer=`nein`,this.darstellung=`standard`,this.spaltenDialog=!1,this.anzeige=``,this.getippt=null,this.liste=new a.VorschlagStand,this.satz=void 0,this.angehakt=!1,this.imSteuerelement=!1}static{this.blockType=`formfeld`}static{this.tagName=`ff-formfeld`}static{this.displayName=`Formularfeld`}static{this.category=`eingabe`}static{this.acceptsDataSource={wenn:{attributeName:`fieldType`,notEquals:`nachschlagen`}}}static{this.kannAuswahlFolgen=!0}static{this.satzWahl={quelleProp:`nachschlagQuelle`,wenn:{attributeName:`fieldType`,equals:`nachschlagen`}}}static{this.listenBindung=f.NACHSCHLAG_SPALTEN_BINDUNG}static{this.bindableSpots=[{prop:`value`,label:`Wert`,wenn:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]},vorschauProp:`placeholder`}]}static{this.actionValueSpots=[{prop:`value`,label:`Wert`}]}static{this.blockEvents=[{key:`onChange`,name:`Wert geändert`}]}static{this.defaultProps={width:240,fieldType:`text`,placeholder:`Feldname`,options:``,source:``,value:``,valueField:``,nachschlagQuelle:``,speicherFeld:``,speicherTitel:``,nachschlagSpalten:[],fensterBreite:f.FENSTER_BREITE,fensterHoehe:f.FENSTER_HOEHE,einzigerTreffer:`nein`,darstellung:`standard`}}static{this.raster={startW:6,startH:2,minW:2,minH:2}}static{this.customProperties=m}static{this.styles=[n.BasicBlock.styles,E,i.vorschlagStil]}onInput(e){let t=e.target;this.value=O(this.fieldType)===`date`?v(t.value):t.value}onChange(){this.dispatchEvent(new Event(`change`))}textTpl(t,n=!1,r=!1){return e.html`<span
      class=${t}
      ?hidden=${n}
      ?data-ff-bound=${r}
      data-ff-editable
      @click=${this.onTextClick}
      @dblclick=${e=>this.inlineEdit(e,`placeholder`)}
    >${this.placeholder}</span>`}onTextClick(){this.imEditor||this.setzeHaken(!this.angehakt)}setzeHaken(e){this.angehakt!==e&&(this.angehakt=e,this.dispatchEvent(new Event(`change`)))}controlTpl(t){switch(t){case`textarea`:return e.html`<textarea class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}></textarea>`;case`select`:{let t=this.options.split(`,`).map(e=>e.trim()).filter(e=>e!==``),n=this.value!==``&&!t.includes(this.value);return e.html`<select class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}>
          <option value="" disabled hidden></option>
          ${n?e.html`<option value=${this.value} hidden>${this.value}</option>`:e.nothing}
          ${t.length===0?e.html`<option disabled>(keine Optionen)</option>`:t.map(t=>e.html`<option value=${t}>${t}</option>`)}
        </select>`}case`nachschlagen`:return(0,f.nachschlagFeldTpl)({wert:this.getippt??this.anzeige,onTippen:e=>{this.getippt=e,this.liste.vonVorn()},onTaste:e=>this.onNachschlagTaste(e),onVerlassen:()=>this.onNachschlagVerlassen(),onLupe:()=>this.onLupe(),liste:this.liste.offen?(0,i.vorschlagListeTpl)({eintraege:this.liste.treffer,marke:this.liste.marke,onWaehlen:e=>this.uebernimmVorschlag(e),onMarke:e=>{this.liste.setzeMarke(e),this.requestUpdate()}}):e.nothing});default:return e.html`<input
          class="ctrl"
          type=${t}
          .value=${t===`date`?_(this.value):this.value}
          @input=${this.onInput}
          @change=${this.onChange}
          @focus=${()=>{this.imSteuerelement=!0}}
          @blur=${()=>{this.imSteuerelement=!1}}
        />`}}onLupe(e=``){if(this.imEditor){this.spaltenDialog=!0;return}(0,f.oeffneNachschlagen)({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel,spalten:this.nachschlagSpalten,titel:this.placeholder,breite:this.fensterBreite,hoehe:this.fensterHoehe,suchtext:e,onUebernehmen:(e,t,n)=>this.uebernimmUndMelde(e,t,n)})}spaltenEffektiv(){return(0,f.fensterSpaltenOder)(this.nachschlagSpalten,()=>(0,f.automatikSpalten)({speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel}))}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}spaltenDialogTpl(){return(0,f.spaltenStellenTpl)({titel:this.placeholder,spalten:this.spaltenEffektiv(),breite:this.fensterBreite,hoehe:this.fensterHoehe,onGroesse:e=>{let n=e.achse===`breite`?`fensterBreite`:`fensterHoehe`;if(e.geste===`standard`){this.meldeProp(n,t.defaultProps[n]);return}this.meldeProp(n,e.wert,e.geste===`laeuft`?void 0:e.geste)},onAendern:e=>{this.meldeProp(`nachschlagSpalten`,e)},onFeldWahl:e=>{this.dispatchEvent(new CustomEvent(`ff-listen-bind`,{detail:{prop:`nachschlagSpalten`,...e},bubbles:!0,composed:!0}))},onSchliessen:()=>{this.spaltenDialog=!1}})}willUpdate(e){super.willUpdate(e),e.has(`fieldType`)&&O(this.fieldType)!==`nachschlagen`&&(this.spaltenDialog=!1),this.liste.zeige(this.berechneVorschlaege())}updated(e){super.updated(e),this.toggleAttribute(`data-ff-liste`,this.liste.offen)}berechneVorschlaege(){if(this.getippt===null||this.liste.zugemacht||O(this.fieldType)!==`nachschlagen`||this.imEditor)return[];let e=(0,f.holeEintraege)({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});return e.ok?(0,i.passendeVorschlaege)(e.eintraege,this.getippt):[]}onNachschlagTaste(e){if(this.imEditor)return;let t=this.liste.folgeFuer(e.key,{listeOffen:this.liste.offen,feldLeer:(this.getippt??this.anzeige)===``});if(t===`nichts`){e.key===`Enter`&&e.preventDefault();return}e.preventDefault(),t===`uebernehmen`?this.uebernimmVorschlag(this.liste.marke):t===`fenster`&&this.onLupe(this.getippt??``),this.requestUpdate()}uebernimmVorschlag(e){let t=this.liste.treffer[e];t&&this.uebernimmUndMelde(t.anzeige,t.wert,t.satz)}leereNachschlagen(){this.satz=void 0,this.anzeige=``,this.value=``,(0,r.klareAuswahl)((0,r.geberIdVon)(this))}uebernimmUndMelde(e,t,n){this.getippt=null,this.liste.ruhe(),this.uebernimmSatz(e,t,n),this.dispatchEvent(new Event(`change`))}uebernimmSatz(e,t,n){this.anzeige=e===``?t:e,this.value=t,this.satz=n,(0,r.setzeAuswahl)((0,r.geberIdVon)(this),n,!0)}onNachschlagVerlassen(){if(this.imEditor)return;let e=(0,f.folgeBeimVerlassen)(this.getippt??this.anzeige,this.anzeige,this.value);this.getippt=null,this.liste.ruhe(),e===`leeren`&&(this.leereNachschlagen(),this.dispatchEvent(new Event(`change`)))}pruefeEigenenWert(){O(this.fieldType)===`nachschlagen`&&(this.getippt!==null&&this.requestUpdate(),this.satz!==void 0&&!(0,f.satzPasstZurAuswahl)(this,this.satz)&&this.leereNachschlagen(),this.uebernimmEinzigenTreffer())}uebernimmEinzigenTreffer(){if(this.einzigerTreffer!==`ja`)return;let e=(0,f.holeEintraege)({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});if(!e.ok)return;let t=(0,f.einzigenTrefferFinden)(e.eintraege,this.satz===void 0);t&&this.uebernimmSatz(t.anzeige,t.wert,t.satz)}render(){let t=O(this.fieldType);if(t===`checkbox`)return e.html`<div class="feld">
        <div class="zeile">
          <input
            class="ctrl"
            type="checkbox"
            .checked=${this.angehakt}
            @change=${e=>this.setzeHaken(e.target.checked)}
          />
          ${this.textTpl(`text`)}
        </div>
      </div>`;let n=t!==`nachschlagen`,r=(n?this.value:this.getippt??this.anzeige)===``,i=`huelle${r?` leer`:``}${this.imSteuerelement?` tippt`:``}`,a=`feld${this.darstellung===`linie`?` linie`:``}`;return e.html`<div class=${a}>
      <div
        class=${i}
        data-ff-spot=${n?`value`:e.nothing}
        ?data-ff-bound=${n&&this.valueField!==``}
      >
        ${this.controlTpl(t)}
        ${k.includes(t)?this.textTpl(`ph ${A[t]??``}`.trim(),!r,n&&this.valueField!==``):e.nothing}
      </div>
      ${this.spaltenDialog&&this.imEditor?this.spaltenDialogTpl():e.nothing}
    </div>`}connectedCallback(){super.connectedCallback(),w(this)}disconnectedCallback(){super.disconnectedCallback(),T(this),(0,f.schliesseNachschlagenFuer)(this)}};j([(0,t.property)()],M.prototype,`fieldType`,void 0),j([(0,t.property)()],M.prototype,`placeholder`,void 0),j([(0,t.property)()],M.prototype,`options`,void 0),j([(0,t.property)()],M.prototype,`source`,void 0),j([(0,t.property)()],M.prototype,`value`,void 0),j([(0,t.property)()],M.prototype,`valueField`,void 0),j([(0,t.property)()],M.prototype,`nachschlagQuelle`,void 0),j([(0,t.property)()],M.prototype,`speicherFeld`,void 0),j([(0,t.property)()],M.prototype,`speicherTitel`,void 0),j([(0,t.property)({converter:{fromAttribute:e=>(0,f.coerceNachschlagSpalten)(e??``),toAttribute:e=>JSON.stringify(e)}})],M.prototype,`nachschlagSpalten`,void 0),j([(0,t.property)({type:Number})],M.prototype,`fensterBreite`,void 0),j([(0,t.property)({type:Number})],M.prototype,`fensterHoehe`,void 0),j([(0,t.property)()],M.prototype,`einzigerTreffer`,void 0),j([(0,t.property)()],M.prototype,`darstellung`,void 0),j([(0,t.state)()],M.prototype,`spaltenDialog`,void 0),j([(0,t.state)()],M.prototype,`anzeige`,void 0),j([(0,t.state)()],M.prototype,`getippt`,void 0),j([(0,t.state)()],M.prototype,`angehakt`,void 0),j([(0,t.state)()],M.prototype,`imSteuerelement`,void 0),n.BasicBlock.defineAndRegister(M)})(FF.lit,FF.lit$decorators$js,FF.blocks$base$BasicBlock,FF.blocks$shared$auswahl,FF.blocks$shared$vorschlagListe,FF.blocks$shared$vorschlagStand,FF.blocks$shared$jaNeinProperty,FF.core$blocks$BlockDefinition,FF.softengine$data,FF.blocks$shared$datenAnschluss,FF.blocks$shared$gebundeneStelle,FF.blocks$shared$seAktionen,FF.blocks$tabelle$nachschlagen);