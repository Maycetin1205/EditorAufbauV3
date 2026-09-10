(function(e,t,n,r,i,a,o,s,c,l,u,d,f,p){var m=`ziel`,h=e.css`
  :host([data-ff-ziel]) .ziel {
    background: var(--se-accent-soft);
    outline: var(--se-border) solid var(--se-accent);
    outline-offset: calc(-1 * var(--se-border));
  }
`,g=e.css`
  ::slotted(*) { margin-top: 24px; }
  slot { display: contents; }
`;function _(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var v=`frei · hierher ziehen`,y=`ff-zimmer-inhalt`,b=class extends t.BasicBlock{constructor(...e){super(...e),this.heading=`Neues Zimmer`,this.wert=``,this.leerHinweis=``}static{this.blockType=`kanban-zimmer`}static{this.tagName=`ff-kanban-zimmer`}static{this.displayName=`Kanban-Zimmer`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[n.CardBlock.blockType]}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban-spalte`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={heading:`Neues Zimmer`,wert:``}}static{this.customProperties=[{attributeName:`wert`,name:`Wert im ERP`,description:`Steht im Feld der Unterteilung, wenn eine Karte hier liegt. Leer: der Titel.`,kind:`text`}]}static{this.styles=[t.BasicBlock.styles,r.leerStil,g,h,e.css`
      :host { display: block; }

      .kopf {
        padding: 2px 2px 0;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--se-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .body {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      .zimmer {
        border-radius: var(--se-r-md);
      }
    `]}onSlotChange(){this.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0}))}render(){return e.html`<div class="zimmer ${m}">
      <div
        class="kopf"
        data-ff-editable
        @dblclick=${e=>this.inlineEdit(e,`heading`)}
      >${this.heading}</div>
      <div class="body">
        <slot @slotchange=${this.onSlotChange}></slot>
        ${(0,r.leerZustand)(this.leerHinweis)}
      </div>
    </div>`}};_([(0,i.property)()],b.prototype,`heading`,void 0),_([(0,i.property)()],b.prototype,`wert`,void 0),_([(0,i.property)({attribute:!1})],b.prototype,`leerHinweis`,void 0),t.BasicBlock.defineAndRegister(b);var x=class extends t.BasicBlock{static{this.blockType=`kanban-spalte`}static{this.tagName=`ff-kanban-spalte`}static{this.displayName=`Kanban-Spalte`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[n.CardBlock.blockType,b.blockType]}static{this.addChildButton={label:`Zimmer`,childType:b.blockType}}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={variant:`info`,heading:`Neue Spalte`,wert:``,auffang:`nein`,zimmerField:``}}static{this.customProperties=[(0,o.statusVariantProperty)(`variant`,`Bedeutung der Spalte — bestimmt ihre Farbwelt (Kopf, Fläche, Rahmen).`),(0,a.jaNeinProperty)(`auffang`,`Auffangspalte`,`Einträge ohne passenden Wert landen hier.`,{requiresDataSource:!0,exclusiveAmongSiblings:!0}),{attributeName:`wert`,name:`Wert im ERP`,description:`Steht im Statusfeld, wenn eine Karte hier liegt. Leer: der Titel.`,kind:`text`},{attributeName:`zimmerField`,name:`Unterteilen nach`,description:`Feld, das das Zimmer bestimmt. Wirkt nur mit Zimmern.`,kind:`field`}]}static{this.styles=[t.BasicBlock.styles,r.leerStil,g,h,o.farbweltStil,e.css`

      :host {
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .col {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden;
        background: var(--fw-sanft);
        border-radius: var(--se-r-lg);
        font-family: var(--se-font);
      }

      .head {
        flex: none;
        display: flex;
        align-items: center;
        gap: var(--se-gap-sm);
        padding: 10px 12px;
      }

      .dot {
        flex: none;
        width: 8px;
        height: 8px;
        background: var(--fw-stark);
      }

      .title {
        color: var(--se-ink);
        font-size: var(--se-fs);
        font-weight: 600;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .count {
        margin-left: auto;
        min-width: 22px;
        padding: 1px 8px;
        line-height: 1;
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        border: var(--se-border) solid var(--fw-stark);
        text-align: center;
        font-family: var(--se-mono);
        font-size: var(--se-fs-sm);
        font-weight: 600;
        color: var(--se-ink);
      }

      .body {
        padding: 0 10px 12px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
      }

    `]}constructor(){super(),this.variant=`info`,this.heading=`Neue Spalte`,this.wert=``,this.leerHinweis=``,this._count=0,this.addEventListener(y,()=>this.zaehle())}zaehle(){this._count=Array.from(this.querySelectorAll(n.CardBlock.tagName)).filter(e=>!e.hasAttribute(`data-ff-editor-helper`)).length}render(){let t=(0,o.coerceStatusVariant)(this.variant);return e.html`<div class="col ${m} v-${t}">
      <div class="head">
        <span class="dot"></span>
        <span
          class="title"
          data-ff-editable
          @dblclick=${e=>this.inlineEdit(e,`heading`)}
        >${this.heading}</span>
        <span class="count">${this._count}</span>
      </div>
      <div class="body">
        <slot @slotchange=${this.zaehle}></slot>
        ${(0,r.leerZustand)(this.leerHinweis)}
      </div>
    </div>`}};_([(0,i.property)()],x.prototype,`variant`,void 0),_([(0,i.property)()],x.prototype,`heading`,void 0),_([(0,i.property)()],x.prototype,`wert`,void 0),_([(0,i.property)({attribute:!1})],x.prototype,`leerHinweis`,void 0),_([(0,i.state)()],x.prototype,`_count`,void 0),t.BasicBlock.defineAndRegister(x);function S(e,t){let n=e.trim().toLowerCase();if(n!==``)for(let e=0;e<t.length;e++){let r=t[e].trim().toLowerCase();if(r!==``&&r===n)return e}return-1}function C(e){return e.findIndex(e=>(e??``).trim()===`ja`)}var w=new WeakMap,T=x.tagName,E=b.tagName,D=n.CardBlock.tagName;function O(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===T)}function k(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===D)}function A(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===E)}function j(e){return[e,...A(e)]}function M(e,t){let n=e.getAttribute(`leertext`)??r.LEER_TEXT_STANDARD,i=(e,t)=>{e.leerHinweis=t};for(let e of t){let t=A(e);for(let e of t)i(e,k(e).length===0?v:``);i(e,t.length===0&&k(e).length===0?n:``)}}function N(e){return(0,c.getAllBlockDefinitions)().find(t=>t.tagName===e.toLowerCase())?.bindableSpots??[]}function P(e,t){let n=(e.getAttribute(`wert`)??``).trim();return n===``?e.getAttribute(`heading`)??t:n}function F(e,t){let n=A(e);if(n.length===0)return null;let r=e.getAttribute(`zimmerfield`)??``;if(r===``)return n[0];let i=n.map(e=>P(e,b.defaultProps.heading)),a=S((0,l.getField)(t,r),i);return a>=0?n[a]:n[0]}function I(e){R?.board===e&&W();let t=e.getAttribute(`statusfield`)??``,n=(0,f.holeDatenVorspann)(e);if(!n)return;let r=O(e);if(r.length===0)return;let i=w.get(e);if(!i){let t=e.querySelector(`template[data-ff-template]`)?.content.firstElementChild??e.querySelector(D);t&&(i=t.cloneNode(!0),w.set(e,i))}if(!i)return;let a=n.zeilen,o=r.map(e=>P(e,x.defaultProps.heading)),c=N(i.tagName),d=C(r.map(e=>e.getAttribute(`auffang`))),p=n.lies;for(let e of r)for(let t of j(e))k(t).forEach(e=>e.remove());for(let e of a){let a=i.cloneNode(!0),u=t===``?-1:S((0,l.getField)(e,t),o),f=u>=0?r[u]:d>=0?r[d]:r[0];(F(f,e)??f).appendChild(a);for(let t of c){let n=a.getAttribute((0,s.bindingAttr)(t.prop))??``;n!==``&&(a[t.prop]=p(e,n))}let m=(0,l.satzIndexVon)(n.quelle,e);L.set(a,{row:e,pindex:m}),a.draggable=!0}M(e,r);let m=r.flatMap(e=>j(e).flatMap(k)),h=(0,u.auswahlWiederfinden)((0,u.geberIdVon)(e),m,e=>L.get(e)?.row);for(let e of h)m[e].setAttribute(`data-ff-auswahl`,``)}var L=new WeakMap,R=null,z=new WeakSet,B=`data-ff-zieht`,V=`data-ff-ziel`,H=null;function U(e){H!==e&&(H?.removeAttribute(V),H=e,H?.setAttribute(V,``))}function W(){R?.card.removeAttribute(B),R=null,U(null)}function G(e,t,n){for(let r of t.composedPath())if(r instanceof HTMLElement&&r.tagName.toLowerCase()===n&&e.contains(r))return r;return null}function K(e,t){return G(e,t,T)}function q(e,t,n){if(!R||R.board!==e)return;let r=L.get(R.card);if(!r)return;let i=P(t,x.defaultProps.heading),a=n?P(n,b.defaultProps.heading):``;(0,p.runEvent)(e,`onCardDrop`,{PINDEX:r.pindex,VALUE:i,ZIMMER:a}).catch(p.meldeKettenFehler)}function J(e){z.has(e)||(z.add(e),e.addEventListener(`click`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&L.has(e))??null;if(!n)return;let r=L.get(n);r&&(0,u.waehleAuswahl)((0,u.geberIdVon)(e),r.row),(0,p.runEvent)(e,`onCardClick`,{PINDEX:r?.pindex??``}).catch(p.meldeKettenFehler)}),e.addEventListener(`dragstart`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&L.has(e))??null;n&&(R={card:n,board:e},t.dataTransfer?.setData(`text/plain`,L.get(n)?.pindex??``),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`),setTimeout(()=>{R?.card===n&&n.setAttribute(B,``)},0))}),e.addEventListener(`dragend`,W),e.addEventListener(`dragover`,t=>{let n=K(e,t);if(R?.board!==e||!n){U(null);return}t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`move`),U(G(e,t,E)??n)}),e.addEventListener(`dragleave`,t=>{let n=t.relatedTarget;(!(n instanceof Node)||!e.contains(n))&&U(null)}),e.addEventListener(`drop`,t=>{let n=K(e,t);n&&(t.preventDefault(),q(e,n,G(e,t,E)),W())}))}var Y=(0,d.macheDatenAnschluss)({hydriere:I,verdrahte:J}),X=Y.connect,Z=Y.disconnect,Q=x.blockType,$=class extends t.BasicBlock{static{this.blockType=`kanban`}static{this.tagName=`ff-kanban`}static{this.displayName=`Kanban`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[Q]}static{this.childDirection=`row`}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.addChildButton={label:`Spalte`,childType:Q}}static{this.templateChild={type:n.CardBlock.blockType,label:`Muster`}}static{this.resizableHeight=!0}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.blockEvents=[{key:`onCardClick`,name:`Karte angeklickt`},{key:`onCardDrop`,name:`Karte verschoben`}]}static{this.defaultProps={width:`fill`,height:`fill`,source:``,statusField:``,tagField:``,leerText:r.LEER_TEXT_STANDARD}}static{this.raster={startW:48,startH:20,minW:12,minH:8}}static{this.customProperties=[{attributeName:`statusField`,name:`Einsortieren nach`,description:`Feld, das die Spalte bestimmt. Leer: alle in die Auffang-Spalte.`,kind:`field`},{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Einträge des gewählten Tages.`,kind:`field`},(0,r.leerTextProperty)()]}static{this.defaultChildren=[{type:Q,props:{heading:`Offen`,variant:`warning`},children:[{type:n.CardBlock.blockType}]},{type:Q,props:{heading:`In Arbeit`,variant:`info`}},{type:Q,props:{heading:`Fertig`,variant:`success`}}]}static{this.styles=[t.BasicBlock.styles,e.css`

      :host { min-width: 0; height: 100%; }
      .board {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: var(--se-gap-lg);
        height: 100%;
        box-sizing: border-box;
      }
      .board slot { display: contents; }
    `]}render(){return e.html`<div class="board"><slot></slot></div>`}connectedCallback(){super.connectedCallback(),X(this)}disconnectedCallback(){super.disconnectedCallback(),Z(this)}};t.BasicBlock.defineAndRegister($)})(FF.lit,FF.blocks$base$BasicBlock,FF.blocks$card$CardBlock,FF.blocks$shared$leerZustand,FF.lit$decorators$js,FF.blocks$shared$jaNeinProperty,FF.blocks$shared$statusVariant,FF.core$blocks$BlockDefinition,FF.core$blocks$blockRegistry,FF.softengine$data,FF.blocks$shared$auswahl,FF.blocks$shared$datenAnschluss,FF.blocks$shared$datenVorspann,FF.blocks$shared$seAktionen);