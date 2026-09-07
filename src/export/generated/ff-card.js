(function(e,t,n,r){var i=Object.defineProperty,a=(e,t)=>{let n={};for(var r in e)i(n,r,{get:e[r],enumerable:!0});return t||i(n,Symbol.toStringTag,{value:`Module`}),n},o=e.css`

      .card {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow: visible;
        padding: 11px 13px 12px;
        background: var(--se-card-bg);
        border: var(--se-border) solid var(--se-card-line);
        border-radius: 0 var(--se-r-md) var(--se-r-md) var(--se-r-md);
        font-family: var(--se-font);
        transition: border-color var(--se-move);
      }
      .card.ohne-reiter { border-radius: var(--se-r-md); }

      :host { display: flow-root; }
      :host([hat-reiter]) { margin-top: 24px; }

      .card:hover { border-color: var(--se-faint); }

      .card.v-danger {
        border-color: var(--se-accent);
        background: var(--se-red-soft);
      }
      .card.v-danger:hover { border-color: var(--se-accent-dark); }

      :host([data-ff-auswahl]) .card {
        border-color: var(--se-accent);
        background: var(--se-accent-soft);
      }

      :host([data-ff-zieht]) .card {
        opacity: 0.45;
      }

      .reiter {
        position: absolute;
        left: calc(-1 * var(--se-border));
        bottom: calc(100% - 3px);
        display: flex;
        align-items: baseline;
        gap: 7px;
        padding: 3px 11px 6px;
        background: var(--se-card-bg);
        border: var(--se-border) solid var(--se-card-line);
        border-bottom: none;
        border-radius: var(--se-r-sm) var(--se-r-sm) 0 0;
        font-size: var(--se-fs-sm);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: 0.04em;
        color: var(--se-muted);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .card:hover .reiter { border-color: var(--se-faint); }
      .card.v-danger .reiter,
      .card.v-danger:hover .reiter {
        background: var(--se-accent-dark);
        border-color: var(--se-accent-dark);
        color: var(--se-card-bg);
      }

      .kopf {
        display: flex;
        align-items: center;
        gap: var(--se-gap);
        min-width: 0;
      }

      .avatar {
        box-sizing: border-box;
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        flex: none;
        color: var(--se-accent);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
      }
      .namen { min-width: 0; }

      .name,
      .zusatz {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .name {
        color: var(--se-ink);
        font-size: var(--se-fs-lg);
        font-weight: 700;
        line-height: 1.25;
      }
      .zusatz {
        color: var(--se-muted);
        font-size: var(--se-fs-sm);
      }

      .grund {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-top: 9px;
        color: var(--se-ink);
        font-size: var(--se-fs);
        line-height: 1.45;
      }

      .fuss {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 10px;
      }
      .fussl {
        min-width: 0;
        color: var(--se-muted);
        font-size: var(--se-fs-sm);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .fuss .chip { flex: none; margin-left: auto; }

      :host([data-ff-editor]) [data-ff-spot]:empty::before {
        content: '—';
        color: var(--se-faint);
      }
      :host([data-ff-editor]) .avatar:empty {
        border: var(--se-border) dashed var(--se-faint);
        border-radius: var(--se-r-sm);
      }
      :host([data-ff-editor]) .avatar:empty::before {
        content: none;
      }
`;function s(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var c=a({CardBlock:()=>l}),l=class extends n.BasicBlock{constructor(...e){super(...e),this.chipVariant=`info`,this.heading=``,this.heading2=``,this.time=``,this.date=``,this.avatar=``,this.meta=``,this.text=``,this.chipText=``,this.headingField=``,this.heading2Field=``,this.timeField=``,this.dateField=``,this.avatarField=``,this.metaField=``,this.textField=``,this.chipTextField=``}static{this.blockType=`card`}static{this.tagName=`ff-card`}static{this.displayName=`Karte`}static{this.category=`anzeige`}static{this.allowedParentTypes=[`kanban-spalte`,`kanban-zimmer`]}static{this.showInPalette=!1}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={chipVariant:`info`,heading:``,heading2:``,time:``,date:``,avatar:``,meta:``,text:``,chipText:``,headingField:``,heading2Field:``,timeField:``,dateField:``,avatarField:``,metaField:``,textField:``,chipTextField:``}}static{this.bindableSpots=[{prop:`time`,label:`Zeit`},{prop:`date`,label:`Datum`},{prop:`avatar`,label:`Avatar`},{prop:`heading`,label:`Titel`},{prop:`heading2`,label:`Titel 2`},{prop:`meta`,label:`Unterzeile`},{prop:`text`,label:`Textzeile`},{prop:`chipText`,label:`Chip`}]}static{this.customProperties=[(0,r.statusVariantProperty)(`chipVariant`,`Bedeutung des Chips auf der Karte — bestimmt die Chip-Farbe.`)]}static{this.styles=[n.BasicBlock.styles,r.chipStyles,o]}stelle(t,n){return e.html`<span
      class=${n}
      data-ff-editable
      data-ff-spot=${t}
      ?data-ff-bound=${this[`${t}Field`]!==``}
      @dblclick=${e=>this.inlineEdit(e,t)}
    >${this[t]}</span>`}hatReiter(){return this.imEditor||this.date.trim()!==``||this.time.trim()!==``}updated(e){super.updated(e),this.toggleAttribute(`hat-reiter`,this.hatReiter())}render(){let t=(0,r.coerceStatusVariant)(this.chipVariant),n=this.imEditor,i=e=>n||e.trim()!==``,a=this.hatReiter(),o=i(this.avatar)||i(this.heading)||i(this.meta),s=i(this.heading2)||i(this.chipText);return e.html`<div class="card v-${t}${a?``:` ohne-reiter`}">
      ${a?e.html`<span class="reiter">
            ${i(this.date)?this.stelle(`date`,`datum`):e.nothing}
            ${i(this.time)?this.stelle(`time`,`zeit`):e.nothing}
          </span>`:e.nothing}
      ${o?e.html`<div class="kopf">
            ${i(this.avatar)?e.html`<span
                  class="avatar"
                  data-ff-spot="avatar"
                  ?data-ff-bound=${this.avatarField!==``}
                >${this.avatar.trim()===``?e.nothing:e.html`<img
                      src=${this.avatar}
                      alt=""
                      aria-hidden="true"
                      @error=${e=>{e.target.hidden=!0}}
                    />`}</span>`:e.nothing}
            <div class="namen">
              ${i(this.heading)?this.stelle(`heading`,`name`):e.nothing}
              ${i(this.meta)?this.stelle(`meta`,`zusatz`):e.nothing}
            </div>
          </div>`:e.nothing}
      ${i(this.text)?this.stelle(`text`,`grund`):e.nothing}
      ${s?e.html`<div class="fuss">
            ${i(this.heading2)?this.stelle(`heading2`,`fussl`):e.nothing}
            ${i(this.chipText)?e.html`<span
                  class="chip v-${t}"
                  data-ff-editable
                  data-ff-spot="chipText"
                  ?data-ff-bound=${this.chipTextField!==``}
                  @dblclick=${e=>this.inlineEdit(e,`chipText`)}
                >${this.chipText}</span>`:e.nothing}
          </div>`:e.nothing}
    </div>`}};s([(0,t.property)()],l.prototype,`chipVariant`,void 0),s([(0,t.property)()],l.prototype,`heading`,void 0),s([(0,t.property)()],l.prototype,`heading2`,void 0),s([(0,t.property)()],l.prototype,`time`,void 0),s([(0,t.property)()],l.prototype,`date`,void 0),s([(0,t.property)()],l.prototype,`avatar`,void 0),s([(0,t.property)()],l.prototype,`meta`,void 0),s([(0,t.property)()],l.prototype,`text`,void 0),s([(0,t.property)()],l.prototype,`chipText`,void 0),s([(0,t.property)()],l.prototype,`headingField`,void 0),s([(0,t.property)()],l.prototype,`heading2Field`,void 0),s([(0,t.property)()],l.prototype,`timeField`,void 0),s([(0,t.property)()],l.prototype,`dateField`,void 0),s([(0,t.property)()],l.prototype,`avatarField`,void 0),s([(0,t.property)()],l.prototype,`metaField`,void 0),s([(0,t.property)()],l.prototype,`textField`,void 0),s([(0,t.property)()],l.prototype,`chipTextField`,void 0),n.BasicBlock.defineAndRegister(l),window.FF=window.FF||{},FF.blocks$card$CardBlock=c})(FF.lit,FF.lit$decorators$js,FF.blocks$base$BasicBlock,FF.blocks$shared$statusVariant);