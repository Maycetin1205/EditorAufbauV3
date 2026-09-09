(function(e,t,n,r,i,a,o){function s(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var c=[{wert:`sonne`,name:`Sonnengelb`},{wert:`salbei`,name:`Salbeigrün`},{wert:`himmel`,name:`Himmelblau`},{wert:`flieder`,name:`Flieder`},{wert:`koralle`,name:`Koralle`}],l=class extends t.BasicBlock{static{this.blockType=`navi-eintrag`}static{this.tagName=`ff-navi-eintrag`}static{this.displayName=`Navi-Eintrag`}static{this.category=`layout`}static{this.acceptsChildren=!1}static{this.showInPalette=!1}static{this.allowedParentTypes=[`navi`]}static{this.resizableWidth=!1}static{this.defaultProps={seite:``,seitename:``,ton:`sonne`}}static{this.customProperties=[{attributeName:`seite`,name:`Seite`,description:`Welche Seite dieser Maske der Eintrag zeigt.`,kind:`seite`,klarnameProp:`seitename`,nurImEditor:!0},{attributeName:`ton`,name:`Farbe`,description:`Farbe des Zeichens vor dem Namen.`,kind:`select`,options:c.map(e=>({value:e.wert,label:e.name}))}]}static{this.styles=[t.BasicBlock.styles,e.css`
      :host {
        --ton: var(--se-amber);
        display: flex;
        align-items: center;
        gap: 13px;
        box-sizing: border-box;
        margin: 2px 6px;
        padding: 10px 11px;
        border-radius: var(--se-r-md);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;
        color: var(--se-bg);
        white-space: nowrap;
        cursor: pointer;
      }
      :host(:hover) { background: var(--se-muted); }

      :host([aktiv]) { background: var(--se-accent); color: var(--se-panel); }

      .zeichen {
        width: 22px;
        height: 22px;
        flex: none;
        border-radius: 50%;
        background: var(--ton);
      }
      :host([aktiv]) .zeichen { background: var(--se-panel); }

      :host([ton='salbei'])  { --ton: var(--se-green); }
      :host([ton='himmel'])  { --ton: var(--se-blue); }
      :host([ton='flieder']) { --ton: var(--se-violet); }
      :host([ton='koralle']) { --ton: var(--se-accent); }

      .name { display: none; }
      :host([breit]) .name {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `]}constructor(){super(),this.seite=``,this.seitename=``,this.ton=`sonne`,this.addEventListener(`click`,()=>this.melde())}melde(){let e={ansicht:this.seitename};this.dispatchEvent(new CustomEvent(a.SEITEN_WECHSEL_EVENT,{detail:e,bubbles:!0,composed:!0}))}render(){return e.html`<span class="zeichen"></span>
      <span class="name">${this.seitename===``?`—`:this.seitename}</span>`}};s([(0,i.property)()],l.prototype,`seite`,void 0),s([(0,i.property)()],l.prototype,`seitename`,void 0),s([(0,i.property)({reflect:!0})],l.prototype,`ton`,void 0),t.BasicBlock.defineAndRegister(l);var u=`aktiv`;function d(e){return Array.from(e.querySelectorAll(l.tagName))}function f(e,t){let n=d(e),r=t??n.find(e=>e.hasAttribute(u))??n[0];for(let e of n)e===r?e.setAttribute(u,``):e.removeAttribute(u)}function p(e){let t=e.hasAttribute(`offen`);for(let n of d(e))n.toggleAttribute(`breit`,t)}function m(e){return e.getAttribute(`name`)??String(o.AnsichtBlock.defaultProps.name)}function h(e,t){let n=e;for(;n&&n.parentElement!==t;)n=n.parentElement;return n}function g(e,t){let n=e.ownerDocument,r=Array.from(n.querySelectorAll(o.AnsichtBlock.tagName)),i=r[0]?.parentElement??null;if(!i)return;let a=h(e,i);if(!a)return;let s=r.find(e=>m(e)===t)??null;for(let e of Array.from(i.children))e!==a&&((r.includes(e)?e===s:s===null)?e.removeAttribute(`hidden`):e.setAttribute(`hidden`,``))}var _=new WeakSet;function v(e){e.addEventListener(a.SEITEN_WECHSEL_EVENT,t=>{let n=t.detail;n&&(f(e,t.target instanceof Element?t.target:void 0),e.removeAttribute(`offen`),p(e),!e.hasAttribute(`data-ff-editor`)&&g(e,n.ansicht))})}function y(e){if(f(e),p(e),e.hasAttribute(`data-ff-editor`)||_.has(e))return;let t=d(e)[0];if(!t)return;_.add(e);let n=()=>g(e,t.seitename);e.ownerDocument.readyState===`loading`?e.ownerDocument.addEventListener(`DOMContentLoaded`,n,{once:!0}):queueMicrotask(n)}var b=l.blockType,x=class extends t.BasicBlock{static{this.blockType=`navi`}static{this.tagName=`ff-navi`}static{this.displayName=`Navi`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[b]}static{this.addChildButton={label:`Eintrag`,childType:b}}static{this.containerHint=!1}static{this.defaultProps={}}static{this.customProperties=[]}static{this.maskenRand=!0}static{this.allowedParentTypes=[n.ROOT_TYPE]}static{this.styles=[t.BasicBlock.styles,e.css`
      :host {
        height: 100%;
        width: ${r.RAND.breite}px;
        transition: width var(--se-move);
      }
      :host([offen]) { width: ${r.RAND.breiteOffen}px; }
      .leiste {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        background: var(--se-ink);
        color: var(--se-bg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: var(--se-font);
      }
      :host([offen]) .leiste {
        background: color-mix(in oklab, var(--se-ink) 88%, transparent);
      }

      .kopf {
        flex: none;
        display: flex;
        align-items: center;
        padding: 8px;
      }
      .schalter {
        flex: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 40px;
        height: 32px;
        padding: 0 11px;
        border: none;
        border-radius: var(--se-r-md);
        background: none;
        color: inherit;
        cursor: pointer;
      }
      .schalter:hover { background: var(--se-muted); }
      .balken {
        height: 2px;
        background: currentColor;
      }
      .eintraege {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px 0;
        overflow-y: auto;
      }
      .eintraege slot { display: contents; }
    `]}connectedCallback(){super.connectedCallback(),v(this)}klappen(){this.toggleAttribute(`offen`),p(this)}render(){return e.html`<div class="leiste">
        <div class="kopf">
          <button
            class="schalter"
            type="button"
            aria-label="Navi auf- und zuklappen"
            @click=${()=>this.klappen()}
          >
            <span class="balken"></span>
            <span class="balken"></span>
            <span class="balken"></span>
          </button>
        </div>
        <div class="eintraege">
          <slot @slotchange=${()=>y(this)}></slot>
        </div>
      </div>`}};t.BasicBlock.defineAndRegister(x)})(FF.lit,FF.blocks$base$BasicBlock,FF.core$blocks$BlockData,FF.core$blocks$maskenRand,FF.lit$decorators$js,FF.core$blocks$seitenWechsel,FF.blocks$ansicht$AnsichtBlock);