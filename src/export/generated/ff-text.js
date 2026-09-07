(function(e,t,n,r,i,a,o){var s=(0,i.bindingAttr)(`text`);function c(e){let t=e.getAttribute(`source`)??``,n=e.getAttribute(s)??``;return t===``||n===``?void 0:{sourceId:t,code:n}}function l(e){let t=(0,o.leseGebundeneStelle)(e,s);t.art!==`ungebunden`&&(e.text=t.art===`wert`?t.wert:``)}function u(e){c(e)&&(e.text=``)}var d=(0,a.macheDatenAnschluss)({hydriere:l,verdrahte:u}),f=d.connect,p=d.disconnect;function m(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var h=6,g=96,_=14,v={duenn:`300`,normal:`400`,fett:`700`},y={links:`left`,mitte:`center`,rechts:`right`},b={standard:`var(--se-ink)`,gedaempft:`var(--se-muted)`,akzent:`var(--se-accent)`,erfolg:`var(--se-green)`,warnung:`var(--se-amber)`,fehler:`var(--se-red)`},x=`standard`;function S(e){if(e===`ueberschrift`)return 15;if(e===`klein`)return 12;let t=typeof e==`number`?e:Number.parseFloat(String(e??``));return Number.isFinite(t)?Math.min(g,Math.max(h,t)):_}function C(e){return typeof e==`string`&&e in v?e:`normal`}function w(e){return typeof e==`string`&&e in y?e:`links`}function T(e){return typeof e==`string`&&e in b?e:x}var E=class extends r.BasicBlock{constructor(...e){super(...e),this.groesse=_,this.gewicht=`normal`,this.ausrichtung=`links`,this.farbe=x,this.text=`Text`,this.source=``,this.textField=``}static{this.blockType=`text`}static{this.tagName=`ff-text`}static{this.displayName=`Text`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.kannAuswahlFolgen=!0}static{this.bindableSpots=[{prop:`text`,label:`Text`}]}static{this.defaultProps={width:`fill`,groesse:_,gewicht:`normal`,ausrichtung:`links`,farbe:x,text:`Text`,source:``,textField:``}}static{this.raster={startW:6,startH:2,minW:1,minH:1}}static{this.customProperties=[{attributeName:`groesse`,name:`Größe`,description:`Schriftgröße in Pixeln.`,kind:`number`,unit:`px`,min:h,max:g,inspectorRow:`Text-Stil`},{attributeName:`gewicht`,name:`Gewicht`,description:`Strichstärke der Schrift.`,kind:`segment`,options:[{value:`duenn`,label:`Dünn`},{value:`normal`,label:`Normal`},{value:`fett`,label:`Fett`}],inspectorRow:`Text-Stil`},{attributeName:`ausrichtung`,name:`Ausrichtung`,description:`Wo der Text in seiner Breite sitzt.`,kind:`segment`,options:[{value:`links`,label:`Links`},{value:`mitte`,label:`Mitte`},{value:`rechts`,label:`Rechts`}],inspectorRow:`Text-Stil`},{attributeName:`farbe`,name:`Farbe`,description:`Textfarbe aus den Farben der Maske.`,kind:`select`,options:[{value:`standard`,label:`Standard`},{value:`gedaempft`,label:`Gedämpft`},{value:`akzent`,label:`Akzent`},{value:`erfolg`,label:`Erfolg`},{value:`warnung`,label:`Warnung`},{value:`fehler`,label:`Fehler`}]}]}static{this.styles=[r.BasicBlock.styles,e.css`
      .text {
        font-family: var(--se-font);

        color: var(--se-ink);

        --text-zeilenhoehe: var(--se-lh);
        line-height: var(--text-zeilenhoehe);
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .text:empty { min-height: calc(1em * var(--text-zeilenhoehe)); }

      :host([data-ff-editor]) .text:empty::before {
        content: 'Text …';
        color: var(--se-faint);
      }
    `]}render(){let t={fontSize:`${S(this.groesse)}px`,fontWeight:v[C(this.gewicht)],textAlign:y[w(this.ausrichtung)],color:b[T(this.farbe)]};return e.html`<div
      class="text"
      style=${(0,n.styleMap)(t)}
      data-ff-editable
      data-ff-spot="text"
      ?data-ff-bound=${this.textField!==``}
      @dblclick=${e=>this.inlineEdit(e,`text`)}
    >${this.text}</div>`}connectedCallback(){super.connectedCallback(),f(this)}disconnectedCallback(){super.disconnectedCallback(),p(this)}};m([(0,t.property)({type:Number})],E.prototype,`groesse`,void 0),m([(0,t.property)()],E.prototype,`gewicht`,void 0),m([(0,t.property)()],E.prototype,`ausrichtung`,void 0),m([(0,t.property)()],E.prototype,`farbe`,void 0),m([(0,t.property)()],E.prototype,`text`,void 0),m([(0,t.property)()],E.prototype,`source`,void 0),m([(0,t.property)()],E.prototype,`textField`,void 0),r.BasicBlock.defineAndRegister(E)})(FF.lit,FF.lit$decorators$js,FF.lit$directives$style$map$js,FF.blocks$base$BasicBlock,FF.core$blocks$BlockDefinition,FF.blocks$shared$datenAnschluss,FF.blocks$shared$gebundeneStelle);