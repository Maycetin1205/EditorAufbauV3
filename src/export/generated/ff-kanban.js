(function(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m){var h=e.css`
  ::slotted(:not([hat-reiter])) { margin-top: 24px; }
  slot { display: contents; }
`;function g(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var _=`frei · hierher ziehen`,v=`ff-zimmer-inhalt`,y=class extends t.BasicBlock{constructor(...e){super(...e),this.heading=`Neues Zimmer`,this.leerHinweis=``}static{this.blockType=`kanban-zimmer`}static{this.tagName=`ff-kanban-zimmer`}static{this.displayName=`Kanban-Zimmer`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[n.CardBlock.blockType]}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban-spalte`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={heading:`Neues Zimmer`}}static{this.styles=[t.BasicBlock.styles,r.leerStil,h,o.zielStil,e.css`
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
    `]}onSlotChange(){this.dispatchEvent(new CustomEvent(v,{bubbles:!0,composed:!0}))}render(){return e.html`<div class="zimmer ${o.ZIEL_KLASSE}">
      <div
        class="kopf"
        data-ff-editable
        @dblclick=${e=>this.inlineEdit(e,`heading`)}
      >${this.heading}</div>
      <div class="body">
        <slot @slotchange=${this.onSlotChange}></slot>
        ${(0,r.leerZustand)(this.leerHinweis)}
      </div>
    </div>`}};g([(0,i.property)()],y.prototype,`heading`,void 0),g([(0,i.property)({attribute:!1})],y.prototype,`leerHinweis`,void 0),t.BasicBlock.defineAndRegister(y);var b=class extends t.BasicBlock{static{this.blockType=`kanban-spalte`}static{this.tagName=`ff-kanban-spalte`}static{this.displayName=`Kanban-Spalte`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[n.CardBlock.blockType,y.blockType]}static{this.addChildButton={label:`Zimmer`,childType:y.blockType}}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={variant:`info`,heading:`Neue Spalte`,auffang:`nein`,zimmerField:``}}static{this.customProperties=[(0,s.statusVariantProperty)(`variant`,`Bedeutung der Spalte — bestimmt ihre Farbwelt (Kopf, Fläche, Rahmen).`),(0,a.jaNeinProperty)(`auffang`,`Auffangspalte`,`Einträge ohne passenden Spaltentitel landen hier.`,{requiresDataSource:!0,exclusiveAmongSiblings:!0}),{attributeName:`zimmerField`,name:`Unterteilen nach`,description:`Feld, das das Zimmer bestimmt. Wirkt nur mit Zimmern.`,kind:`field`}]}static{this.styles=[t.BasicBlock.styles,r.leerStil,h,o.zielStil,e.css`

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
        background: var(--col-soft);
        border-radius: var(--se-r-lg);
        font-family: var(--se-font);
      }

      .col.v-info { --col-strong: var(--se-blue); --col-soft: var(--se-blue-soft); }
      .col.v-success { --col-strong: var(--se-green); --col-soft: var(--se-green-soft); }
      .col.v-warning { --col-strong: var(--se-amber); --col-soft: var(--se-amber-soft); }
      .col.v-danger { --col-strong: var(--se-red); --col-soft: var(--se-red-soft); }

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
        background: var(--col-strong);
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
        border: var(--se-border) solid var(--col-strong);
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

    `]}constructor(){super(),this.variant=`info`,this.heading=`Neue Spalte`,this.leerHinweis=``,this._count=0,this.addEventListener(v,()=>this.zaehle())}zaehle(){this._count=Array.from(this.querySelectorAll(n.CardBlock.tagName)).filter(e=>!e.hasAttribute(`data-ff-editor-helper`)).length}render(){let t=(0,s.coerceStatusVariant)(this.variant);return e.html`<div class="col ${o.ZIEL_KLASSE} v-${t}">
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
    </div>`}};g([(0,i.property)()],b.prototype,`variant`,void 0),g([(0,i.property)()],b.prototype,`heading`,void 0),g([(0,i.property)({attribute:!1})],b.prototype,`leerHinweis`,void 0),g([(0,i.state)()],b.prototype,`_count`,void 0),t.BasicBlock.defineAndRegister(b);function x(e,t){let n=e.trim().toLowerCase();if(n!==``)for(let e=0;e<t.length;e++){let r=t[e].trim().toLowerCase();if(r!==``&&r===n)return e}return-1}function S(e){return e.findIndex(e=>(e??``).trim()===`ja`)}var C=new WeakMap,w=b.tagName,T=y.tagName,E=n.CardBlock.tagName;function D(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===w)}function O(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===E)}function k(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===T)}function A(e){return[e,...k(e)]}function j(e,t){let n=e.getAttribute(`leertext`)??r.LEER_TEXT_STANDARD,i=(e,t)=>{e.leerHinweis=t};for(let e of t){let t=k(e);for(let e of t)i(e,O(e).length===0?_:``);i(e,t.length===0&&O(e).length===0?n:``)}}function M(e){return(0,l.getAllBlockDefinitions)().find(t=>t.tagName===e.toLowerCase())?.bindableSpots??[]}function N(e,t){let n=k(e);if(n.length===0)return null;let r=e.getAttribute(`zimmerfield`)??``;if(r===``)return n[0];let i=n.map(e=>e.getAttribute(`heading`)??y.defaultProps.heading),a=x((0,u.getField)(t,r),i);return a>=0?n[a]:n[0]}function P(e){I?.board===e&&H();let t=e.getAttribute(`statusfield`)??``,n=(0,p.holeDatenVorspann)(e);if(!n)return;let r=D(e);if(r.length===0)return;let i=C.get(e);if(!i){let t=e.querySelector(`template[data-ff-template]`)?.content.firstElementChild??e.querySelector(E);t&&(i=t.cloneNode(!0),C.set(e,i))}if(!i)return;let a=n.zeilen,o=r.map(e=>e.getAttribute(`heading`)??b.defaultProps.heading),s=M(i.tagName),l=S(r.map(e=>e.getAttribute(`auffang`))),f=n.lies;for(let e of r)for(let t of A(e))O(t).forEach(e=>e.remove());for(let e of a){let a=i.cloneNode(!0),d=t===``?-1:x((0,u.getField)(e,t),o),p=d>=0?r[d]:l>=0?r[l]:r[0];(N(p,e)??p).appendChild(a);for(let t of s){let n=a.getAttribute((0,c.bindingAttr)(t.prop))??``;n!==``&&(a[t.prop]=f(e,n))}let m=(0,u.satzIndexVon)(n.quelle,e);F.set(a,{row:e,pindex:m}),a.draggable=!0}j(e,r);let m=r.flatMap(e=>A(e).flatMap(O)),h=(0,d.auswahlWiederfinden)((0,d.geberIdVon)(e),m,e=>F.get(e)?.row);for(let e of h)m[e].setAttribute(`data-ff-auswahl`,``)}var F=new WeakMap,I=null,L=new WeakSet,R=`data-ff-zieht`,z=`data-ff-ziel`,B=null;function V(e){B!==e&&(B?.removeAttribute(z),B=e,B?.setAttribute(z,``))}function H(){I?.card.removeAttribute(R),I=null,V(null)}function U(e,t,n){for(let r of t.composedPath())if(r instanceof HTMLElement&&r.tagName.toLowerCase()===n&&e.contains(r))return r;return null}function W(e,t){return U(e,t,w)}function G(e,t,n){if(!I||I.board!==e)return;let r=F.get(I.card);if(!r)return;let i=t.getAttribute(`heading`)??``,a=n?.getAttribute(`heading`)??``;(0,m.runEvent)(e,`onCardDrop`,{PINDEX:r.pindex,VALUE:i,ZIMMER:a}).catch(m.meldeKettenFehler)}function K(e){L.has(e)||(L.add(e),e.addEventListener(`click`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&F.has(e))??null;if(!n)return;let r=F.get(n);r&&(0,d.waehleAuswahl)((0,d.geberIdVon)(e),r.row),(0,m.runEvent)(e,`onCardClick`,{PINDEX:r?.pindex??``}).catch(m.meldeKettenFehler)}),e.addEventListener(`dragstart`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&F.has(e))??null;n&&(I={card:n,board:e},t.dataTransfer?.setData(`text/plain`,F.get(n)?.pindex??``),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`),setTimeout(()=>{I?.card===n&&n.setAttribute(R,``)},0))}),e.addEventListener(`dragend`,H),e.addEventListener(`dragover`,t=>{let n=W(e,t);if(I?.board!==e||!n){V(null);return}t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`move`),V(U(e,t,T)??n)}),e.addEventListener(`dragleave`,t=>{let n=t.relatedTarget;(!(n instanceof Node)||!e.contains(n))&&V(null)}),e.addEventListener(`drop`,t=>{let n=W(e,t);n&&(t.preventDefault(),G(e,n,U(e,t,T)),H())}))}var q=(0,f.macheDatenAnschluss)({hydriere:P,verdrahte:K}),J=q.connect,Y=q.disconnect,X=b.blockType,Z=class extends t.BasicBlock{static{this.blockType=`kanban`}static{this.tagName=`ff-kanban`}static{this.displayName=`Kanban`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[X]}static{this.childDirection=`row`}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.addChildButton={label:`Spalte`,childType:X}}static{this.templateChild={type:n.CardBlock.blockType,label:`Muster`}}static{this.resizableHeight=!0}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.blockEvents=[{key:`onCardClick`,name:`Karte angeklickt`},{key:`onCardDrop`,name:`Karte verschoben`}]}static{this.defaultProps={width:`fill`,height:`fill`,source:``,statusField:``,tagField:``,leerText:r.LEER_TEXT_STANDARD}}static{this.raster={startW:24,startH:20,minW:6,minH:8}}static{this.customProperties=[{attributeName:`statusField`,name:`Einsortieren nach`,description:`Feld, das die Spalte bestimmt. Leer: alle in die Auffang-Spalte.`,kind:`field`},{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Einträge des gewählten Tages.`,kind:`field`},(0,r.leerTextProperty)()]}static{this.defaultChildren=[{type:X,props:{heading:`Offen`,variant:`warning`},children:[{type:n.CardBlock.blockType}]},{type:X,props:{heading:`In Arbeit`,variant:`info`}},{type:X,props:{heading:`Fertig`,variant:`success`}}]}static{this.styles=[t.BasicBlock.styles,e.css`

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
    `]}render(){return e.html`<div class="board"><slot></slot></div>`}connectedCallback(){super.connectedCallback(),J(this)}disconnectedCallback(){super.disconnectedCallback(),Y(this)}};t.BasicBlock.defineAndRegister(Z)})(FF.lit,FF.blocks$base$BasicBlock,FF.blocks$card$CardBlock,FF.blocks$shared$leerZustand,FF.lit$decorators$js,FF.blocks$shared$jaNeinProperty,FF.blocks$shared$zielStil,FF.blocks$shared$statusVariant,FF.core$blocks$BlockDefinition,FF.core$blocks$blockRegistry,FF.softengine$data,FF.blocks$shared$auswahl,FF.blocks$shared$datenAnschluss,FF.blocks$shared$datenVorspann,FF.blocks$shared$seAktionen);