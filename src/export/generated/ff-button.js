(function(e,t,n,r,i){function a(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var o=class extends n.BasicBlock{constructor(...e){super(...e),this.label=`Schaltfläche`,this.vormerkungen=void 0,this.zaehleVormerkungen=()=>{this.vormerkungen=(0,i.vormerkStandVon)(this,`onClick`)}}static{this.blockType=`button`}static{this.tagName=`ff-button`}static{this.displayName=`Schaltfläche`}static{this.category=`eingabe`}static{this.defaultProps={label:`Schaltfläche`}}static{this.resizableWidth=!1}static{this.blockEvents=[{key:`onClick`,name:`Klick`}]}static{this.raster={startW:4,startH:2,minW:2,minH:2}}static{this.customProperties=[]}static{this.styles=[n.BasicBlock.styles,e.css`
      button {
        box-sizing: border-box;
        padding: 7px 16px;
        cursor: pointer;
        border-radius: var(--se-r-md);
        border: var(--se-border) solid var(--se-accent);
        background: var(--se-accent);
        color: var(--se-panel);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;

        line-height: 1.2;

        transition: background-color var(--se-move), border-color var(--se-move);
      }
      button:hover { background: var(--se-accent-dark); border-color: var(--se-accent-dark); }

      button:active { background: var(--se-accent-dark); border-color: var(--se-ink); }
      button:focus-visible { outline: 2px solid var(--se-accent); outline-offset: 2px; }

      :host([fuellt]) button { width: 100%; height: 100%; }
    `]}render(){let t=this.vormerkungen,n=t===void 0?0:(0,i.vormerkSumme)(t);return e.html`<button
      data-ff-editable
      @dblclick=${e=>this.inlineEdit(e,`label`)}
    >${n===0?this.label:`${this.label} (${n})`}</button>`}connectedCallback(){super.connectedCallback(),(0,r.connectClickAktionen)(this,`onClick`),!this.imEditor&&(document.addEventListener(i.VORMERK_EVENT,this.zaehleVormerkungen),this.zaehleVormerkungen())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(i.VORMERK_EVENT,this.zaehleVormerkungen)}};a([(0,t.property)()],o.prototype,`label`,void 0),a([(0,t.property)({attribute:!1})],o.prototype,`vormerkungen`,void 0),n.BasicBlock.defineAndRegister(o)})(FF.lit,FF.lit$decorators$js,FF.blocks$base$BasicBlock,FF.blocks$shared$seAktionen,FF.blocks$shared$vormerkStand);