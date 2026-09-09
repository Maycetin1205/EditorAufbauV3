(function(e,t,n,r){var i=e.css`

      .card {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 11px 13px 12px;
        background: var(--se-card-bg);
        border: var(--se-border) solid var(--se-card-line);
        border-radius: var(--se-r-md);
        font-family: var(--se-font);
        transition: border-color var(--se-move);
      }

      .card:hover { border-color: var(--se-faint); }

      :host([data-ff-auswahl]) .card {
        border-color: var(--se-accent);
        background: var(--se-accent-soft);
      }

      :host([data-ff-zieht]) .card {
        opacity: 0.45;
      }

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

      .datum,
      .zeit {
        flex: none;
        color: var(--se-muted);
        font-size: var(--se-fs-sm);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .fuss .chip { flex: none; margin-left: auto; }

      :host([data-ff-editor]) [data-ff-spot]:empty::before {
        content: '—';
        color: var(--se-faint);
      }
`;function a(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var o=class extends n.BasicBlock{constructor(...e){super(...e),this.chipVariant=`info`,this.heading=``,this.heading2=``,this.time=``,this.date=``,this.meta=``,this.text=``,this.chipText=``,this.headingField=``,this.heading2Field=``,this.timeField=``,this.dateField=``,this.metaField=``,this.textField=``,this.chipTextField=``}static{this.blockType=`card`}static{this.tagName=`ff-card`}static{this.displayName=`Karte`}static{this.category=`anzeige`}static{this.allowedParentTypes=[`kanban-spalte`,`kanban-zimmer`]}static{this.showInPalette=!1}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={chipVariant:`info`,heading:``,heading2:``,time:``,date:``,meta:``,text:``,chipText:``,headingField:``,heading2Field:``,timeField:``,dateField:``,metaField:``,textField:``,chipTextField:``}}static{this.bindableSpots=[{prop:`time`,label:`Zeit`},{prop:`date`,label:`Datum`},{prop:`heading`,label:`Titel`},{prop:`heading2`,label:`Titel 2`},{prop:`meta`,label:`Unterzeile`},{prop:`text`,label:`Textzeile`},{prop:`chipText`,label:`Chip`}]}static{this.customProperties=[(0,r.statusVariantProperty)(`chipVariant`,`Bedeutung des Chips auf der Karte — bestimmt die Chip-Farbe.`)]}static{this.styles=[n.BasicBlock.styles,r.chipStyles,i]}stelle(t,n){return e.html`<span
      class=${n}
      data-ff-editable
      data-ff-spot=${t}
      ?data-ff-bound=${this[`${t}Field`]!==``}
      @dblclick=${e=>this.inlineEdit(e,t)}
    >${this[t]}</span>`}render(){let t=(0,r.coerceStatusVariant)(this.chipVariant),n=this.imEditor,i=e=>n||e.trim()!==``,a=i(this.heading2)||i(this.date)||i(this.time)||i(this.chipText);return e.html`<div class="card">
      ${i(this.heading)?this.stelle(`heading`,`name`):e.nothing}
      ${i(this.meta)?this.stelle(`meta`,`zusatz`):e.nothing}
      ${i(this.text)?this.stelle(`text`,`grund`):e.nothing}
      ${a?e.html`<div class="fuss">
            ${i(this.heading2)?this.stelle(`heading2`,`fussl`):e.nothing}
            ${i(this.date)?this.stelle(`date`,`datum`):e.nothing}
            ${i(this.time)?this.stelle(`time`,`zeit`):e.nothing}
            ${i(this.chipText)?e.html`<span
                  class="chip v-${t}"
                  data-ff-editable
                  data-ff-spot="chipText"
                  ?data-ff-bound=${this.chipTextField!==``}
                  @dblclick=${e=>this.inlineEdit(e,`chipText`)}
                >${this.chipText}</span>`:e.nothing}
          </div>`:e.nothing}
    </div>`}};a([(0,t.property)()],o.prototype,`chipVariant`,void 0),a([(0,t.property)()],o.prototype,`heading`,void 0),a([(0,t.property)()],o.prototype,`heading2`,void 0),a([(0,t.property)()],o.prototype,`time`,void 0),a([(0,t.property)()],o.prototype,`date`,void 0),a([(0,t.property)()],o.prototype,`meta`,void 0),a([(0,t.property)()],o.prototype,`text`,void 0),a([(0,t.property)()],o.prototype,`chipText`,void 0),a([(0,t.property)()],o.prototype,`headingField`,void 0),a([(0,t.property)()],o.prototype,`heading2Field`,void 0),a([(0,t.property)()],o.prototype,`timeField`,void 0),a([(0,t.property)()],o.prototype,`dateField`,void 0),a([(0,t.property)()],o.prototype,`metaField`,void 0),a([(0,t.property)()],o.prototype,`textField`,void 0),a([(0,t.property)()],o.prototype,`chipTextField`,void 0),n.BasicBlock.defineAndRegister(o),window.FF=window.FF||{},FF.blocks$card$CardBlock={CardBlock:o}})(FF.lit,FF.lit$decorators$js,FF.blocks$base$BasicBlock,FF.blocks$shared$statusVariant);