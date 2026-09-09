(function(e,t,n,r,i){function a(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function o(e){for(let t of Array.from(e.querySelectorAll(`*`))){if(t instanceof HTMLElement&&t.matches(`input,select,textarea,button,a[href],[tabindex]:not([tabindex="-1"])`)&&!t.hasAttribute(`disabled`))return t;let e=t.shadowRoot?o(t.shadowRoot):null;if(e)return e}return null}var s=class extends n.BasicBlock{constructor(...e){super(...e),this.name=`Popup`,this.breite=520,this.hoehe=380,this.offen=!1}static{this.blockType=`popup`}static{this.tagName=`ff-popup`}static{this.displayName=`Popup`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.showInPalette=!1}static{this.allowedParentTypes=[r.ROOT_TYPE]}static{this.pageBlock=!0}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.defaultProps={name:`Popup`,breite:520,hoehe:380}}static{this.styles=[n.BasicBlock.styles,e.css`

      :host { display: none; }
      :host([offen]),
      :host([data-ff-editor]) {
        display: block;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: 10;
        font-family: var(--se-font);
      }

      .titel {
        display: block;
        min-height: 1.4em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .rumpf {
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        padding: 12px;
        ${(0,e.unsafeCSS)((0,i.rasterFlaecheCss)())};
      }

      .rumpf slot { display: contents; }
    `]}onClose(){this.imEditor||this.removeAttribute(`offen`)}updated(e){super.updated(e),e.has(`offen`)&&this.offen&&(this.imEditor||this.updateComplete.then(()=>{this.offen&&this.isConnected&&(o(this)??(this.shadowRoot?o(this.shadowRoot):null))?.focus()}))}render(){return e.html`<ff-dialog-rahmen
        .breite=${this.breite}
        .hoehe=${this.hoehe}
        ?escape-schliesst=${this.offen&&!this.imEditor}
        @ff-dialog-schliessen=${this.onClose}
      >
        <span
          slot="titel"
          class="titel"
          data-ff-editable
          @dblclick=${e=>this.inlineEdit(e,`name`)}
        >${this.name}</span>
        <div class="rumpf"><slot></slot></div>
      </ff-dialog-rahmen>`}};a([(0,t.property)()],s.prototype,`name`,void 0),a([(0,t.property)()],s.prototype,`breite`,void 0),a([(0,t.property)()],s.prototype,`hoehe`,void 0),a([(0,t.property)({type:Boolean,reflect:!0})],s.prototype,`offen`,void 0),n.BasicBlock.defineAndRegister(s)})(FF.lit,FF.lit$decorators$js,FF.blocks$base$BasicBlock,FF.core$blocks$BlockData,FF.core$blocks$rasterLayout);