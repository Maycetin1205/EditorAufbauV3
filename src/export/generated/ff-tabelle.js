(function(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,ee,te){function v(e,t,n=new Set){let r=e=>e.versteckt===!0||n.has(e.kennung);if(t||!e.some(r))return{spalten:e,plaetze:e.map((e,t)=>t)};let i=[],a=[];return e.forEach((e,t)=>{r(e)||(i.push(e),a.push(t))}),i.length===0&&e.length>0?{spalten:[e[0]],plaetze:[0]}:{spalten:i,plaetze:a}}var y=`Spalte {n}`;function ne(e){return y.replace(`{n}`,String(e+1))}function b(e){return{kennung:``,titel:ne(e),feld:``}}function x(e){let t=(0,f.kennungenVergeben)(e.map(e=>e.kennung));return e.map((e,n)=>e.kennung===t[n]?e:{...e,kennung:t[n]})}function S(){return x([b(0)])}function re(e){let t=typeof e==`number`?e:Number(e);if(!Number.isFinite(t))return;let n=Math.round(t);return n<40?40:n}function ie(e,t){if(e&&typeof e==`object`){let n=e,r=n.breite===void 0?void 0:re(n.breite),i=(0,p.formelVonRoh)(n.formel);return{kennung:typeof n.kennung==`string`?n.kennung.trim():``,titel:typeof n.titel==`string`?n.titel:ne(t),feld:typeof n.feld==`string`?n.feld:``,...r===void 0?{}:{breite:r},...typeof n.summe==`boolean`?{summe:n.summe}:{},...typeof n.versteckt==`boolean`?{versteckt:n.versteckt}:{},...i===void 0?{}:{formel:i}}}return typeof e==`string`?{...b(t),titel:e}:b(t)}function C(e){let t;if(Array.isArray(e))t=e.map((e,t)=>ie(e,t));else if(typeof e==`number`&&Number.isFinite(e)||typeof e==`string`&&/^\d+$/.test(e)){let n=Math.max(1,Math.floor(Number(e)));t=[...Array(n).keys()].map(e=>b(e))}else t=S();return t.length<1&&(t=[b(0)]),x(t)}function w(e){try{return C(JSON.parse(e))}catch{return S()}}function ae(e,t=()=>void 0){let n=e.map((e,n)=>t(n)??e.breite),r=n.filter(e=>e!==void 0),i=r.length===0?1:Math.max(1,Math.round(r.reduce((e,t)=>e+t,0)/r.length));return n.map(e=>`minmax(0, ${e??i}fr)`).join(` `)}function oe(e){return x([...e,b(e.length)])}function se(e,t){if(e.length<=1||t<0||t>=e.length)return e;let n=new Set([e[t].kennung]);return e.filter((e,n)=>n!==t).map(e=>{if(e.formel===void 0)return e;let t=(0,p.ohneGliederAuf)(e.formel,n);if(t===e.formel)return e;let r={...e};return delete r.formel,t===void 0?r:{...r,formel:t}})}function ce(e,t,n){if(t<0||t>=e.length)return e;let r=Math.max(0,Math.min(n,e.length-1));if(r===t)return e;let i=[...e],[a]=i.splice(t,1);return i.splice(r,0,a),i}function le(e,t){(0,s.definitionFuerTag)(e.tagName)?.haeltGesendete===!0&&e.pruefeAnkunft(t===null?null:{zeilen:t.zeilen,satzVon:e=>(0,l.satzIndexVon)(t.quelle,e),lies:t.lies})}function ue(e){return w(e.getAttribute(`spalten`)??``)}function T(e,t){let n=(0,l.findRuntimeDataSource)((0,c.seGlobal)().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return n?(0,l.satzIndexVon)(n,t):``}function de(e){let t=(0,l.findRuntimeDataSource)((0,c.seGlobal)().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return t!==void 0&&t.indexField!==``}function fe(e,t){let n=(0,d.holeDatenVorspann)(e);if(t&&le(e,n),!n){e.datenzeilen=[];return}let r=ue(e),{rows:a,gefiltert:o}=(0,i.zeilenNachAuswahl)(e,n.zeilen);(0,i.auswahlWiederfinden)((0,i.geberIdVon)(e),a,e=>e);let s=n.lies;e.datenGeliefert=!0,e.rohzeilen=a,e.durchAuswahlGefiltert=o,e.datenzeilen=a.map(e=>r.map(t=>t.feld===``?``:s(e,t.feld)))}var E=(0,u.macheDatenAnschluss)({hydriere:fe}),D=E.connect,O=E.disconnect;function pe(e){return{rohzeilen:e.map(e=>e.rohzeile),datenzeilen:e.map(e=>[...e.zellen])}}var me=4;function he(e){return e??me}function ge(e,t,n){return Math.max(1,Math.floor((e-t)/n))}function _e(e,t,n){let r=ge(e,t,n),i=e-t;return i<n?{passen:r,zeilenHoehe:n}:{passen:r,zeilenHoehe:Math.floor(i/r*100)/100}}function ve(e,t){return e===null?null:Math.max(0,e-t)}function ye({sichtbar:e,hatQuelle:t,platzhalterZeilen:n}){return t?{seiten:1,seite:0,zeilen:[...e]}:{seiten:1,seite:0,zeilen:Array.from({length:n},()=>null)}}function be({sichtbar:e,hatQuelle:t,proSeite:n,wunschSeite:r,platzhalterZeilen:i}){let a=t?Math.max(1,Math.ceil(e.length/n)):1,o=Math.min(Math.max(r,0),a-1);return t?{seiten:a,seite:o,zeilen:[...e.slice(o*n,(o+1)*n)]}:{seiten:a,seite:o,zeilen:Array.from({length:i},()=>null)}}function k(e){if(!e.hasAttribute(`fuellt`))return-1;let t=e.renderRoot.querySelector(`.koerper`);return t instanceof HTMLElement?t.clientHeight:-1}function xe(e){let t=e.renderRoot.querySelector(`.kopf`);return t instanceof HTMLElement?t.offsetHeight:0}function Se(e,t){let n=k(e);if(n===-1)return{mass:null,hoehe:n,kopf:0};let r=xe(e);return{mass:_e(n,r,t),hoehe:n,kopf:r}}function Ce(e,t){if(typeof ResizeObserver>`u`)return null;let n=e.renderRoot.querySelector(`.koerper`);if(!n)return null;let r=new ResizeObserver(t);return r.observe(n),r}var we=`ff-zeile-aktiviert`,A=`data-ff-roh`;function Te(e,t){e.dispatchEvent(new CustomEvent(we,{detail:t,bubbles:!0,composed:!0}))}var Ee=class{constructor(e){this.eigenesMerkmal=``,this.letzterPlatz=null,this.baustein=e}get geberId(){return(0,i.geberIdVon)(this.baustein)}get merkmal(){let e=this.geberId;return e===``?this.eigenesMerkmal:(0,i.merkmalVon)((0,i.auswahlFuer)(e))}platzIn(e){let t=this.merkmal;if(t===``)return-1;let n=this.letzterPlatz;if(n!==null&&n.zeilen===e&&n.merkmal===t)return n.platz;let r=e.findIndex(e=>(0,i.merkmalVon)(e)===t);return this.letzterPlatz={zeilen:e,merkmal:t,platz:r},r}schalte(e){let t=(0,i.merkmalVon)(e),n=this.geberId;return n===``?(this.eigenesMerkmal=this.eigenesMerkmal===t?``:t,this.eigenesMerkmal!==``):((0,i.waehleAuswahl)(n,e),t!==``&&(0,i.merkmalVon)((0,i.auswahlFuer)(n))===t)}vergiss(){this.eigenesMerkmal=``,this.letzterPlatz=null}};function De(e){let t=e?.activeElement;if(!(t instanceof HTMLElement))return;let n=t.closest(`.zeile`);if(!n)return;let r=n.getAttribute(A);return r===null||r===``?null:Number(r)}function Oe(e,t){if(!(e instanceof HTMLElement))return!1;let n=e.closest(`.zeile`),r=n?.parentElement;if(!n||!r)return!1;let i=[...r.querySelectorAll(`.zeile[${A}]`)],a=i.indexOf(n),o=a===-1?void 0:i[a+t];return o?(o.focus(),o.scrollIntoView?.({block:`nearest`}),!0):!1}function ke(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.zeile[${A}]`);return t?(t.focus(),!0):!1}function Ae(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.suchzeile input`);return t?(t.focus(),!0):!1}function je(e,t){e&&((t===null?null:e.querySelector(`.zeile[data-ff-roh="${t}"]`))??e.querySelector(`.zeile[data-ff-roh]`)??e.querySelector(`.koerper`))?.focus()}function Me(e,t,n,r,i){if(r===null||e.hasAttribute(`data-ff-editor`))return;let a=n[r];if(a!==void 0){if(!t.schalte(a)){Te(e,{rohzeile:a,rohIndex:-1,ansichtIndex:i});return}Te(e,{rohzeile:a,rohIndex:r,ansichtIndex:i}),(0,m.runEvent)(e,`onRowClick`,{PINDEX:T(e,a)}).catch(m.meldeKettenFehler)}}function Ne(e,t,n){if(n===null||e.hasAttribute(`data-ff-editor`))return;let r=t[n];r!==void 0&&(0,m.runEvent)(e,`onRowDblClick`,{PINDEX:T(e,r)}).catch(m.meldeKettenFehler)}function Pe(e,t){let n=typeof document>`u`?``:document.title,r=t.getAttribute(h.ACTION_VALUE_ID_ATTR);if(r!==null&&r!==``)return`${e}${n}|${r}`;let i=Array.from(t.ownerDocument?.querySelectorAll(t.tagName)??[]);return`${e}${n}|#${Math.max(0,i.indexOf(t))}`}function j(e,t){let n=new Map;return{lies:r=>{let i=Pe(e,r);if(n.has(i))return n.get(i)??null;try{let e=localStorage.getItem(i);return e===null?null:t(JSON.parse(e))}catch{return null}},merke:(t,r)=>{let i=Pe(e,t);n.set(i,r);try{r===null?localStorage.removeItem(i):localStorage.setItem(i,JSON.stringify(r))}catch{}}}}var Fe=1,Ie=/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$|^-?\d+(,\d+)?$|^-?\d+(\.\d+)?$/,Le=/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/,Re=/^(\d{4})-(\d{2})-(\d{2})$/;function M(e){let t=e.trim();if(t===``||!Ie.test(t))return null;let n=t.includes(`,`)?t.replace(/\./g,``).replace(`,`,`.`):/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t)?t.replace(/\./g,``):t,r=Number(n);return Number.isFinite(r)?r:null}function N(e){let t=e.trim();if(t===``)return null;let n=Re.exec(t);if(n){let[,e,t,r]=n;return P(Number(e),Number(t),Number(r))}let r=Le.exec(t);if(r){let[,e,t,n]=r,i=Number(n);return P(n.length===2?i<=69?2e3+i:1900+i:i,Number(t),Number(e))}return null}function P(e,t,n){if(t<1||t>12||n<1||n>31)return null;let r=new Date(e,t-1,n);return r.getFullYear()!==e||r.getMonth()!==t-1||r.getDate()!==n?null:r.getTime()}function ze(e){let t=0,n=0,r=0;for(let i of e)i.trim()!==``&&(t++,M(i)!==null&&n++,N(i)!==null&&r++);return t===0?`text`:r===t?`datum`:n===t?`zahl`:`text`}var Be=new Intl.Collator(`de`,{numeric:!0,sensitivity:`base`});function Ve(e,t,n){if(t<0||e.length===0)return e.map((e,t)=>t);let r=n=>e[n][t]??``,i=ze(e.map(e=>e[t]??``)),a=n?1:-1;return e.map((e,t)=>t).sort((e,t)=>{let n=r(e).trim(),o=r(t).trim();if(n===``&&o===``)return e-t;if(n===``)return Fe;if(o===``)return-1;let s=i===`zahl`?(M(n)??0)-(M(o)??0):i===`datum`?(N(n)??0)-(N(o)??0):Be.compare(n,o);return s===0?e-t:s*a})}function He(e){if(typeof e!=`object`||!e)return null;let t=e,n=typeof t.kennung==`string`?t.kennung.trim():``;return n===``?null:{kennung:n,auf:t.auf!==!1}}var F=j(`ff_sortierung_`,He);function Ue(e,t,n){let r=0,i=0;for(let t of e){let e=M(t);e!==null&&(r+=e,i++)}return i===0?``:r.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:n})}var I={min:0,max:3},We=class{constructor(e){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._gemerkteGelesen=!1,this._seite=0,this._mass=null,this._beobachter=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0,this._fokusZeile=null,this._fokusHolen=!1,this.wirt=e}get suchtext(){return this._suchtext}get suchtAktiv(){return this._suchtext.trim()!==``}holeGemerkte(){if(this._gemerkteGelesen||(this._gemerkteGelesen=!0,!this.wirt.merktSortierung()))return;let e=F.lies(this.wirt.baustein);if(e===null)return;let t=this.wirt.spalten().findIndex(t=>t.kennung===e.kennung);t<0||(this._sortSpalte=t,this._sortAuf=e.auf)}merkeSortierung(){if(!this.wirt.merktSortierung())return;let e=this.wirt.spalten()[this._sortSpalte]?.kennung??``;F.merke(this.wirt.baustein,this._sortSpalte<0||e===``?null:{kennung:e,auf:this._sortAuf})}get sortSpalte(){return this.holeGemerkte(),this._sortSpalte}get sortAuf(){return this.holeGemerkte(),this._sortAuf}get seite(){return this._seite}get mass(){return this._mass}setzeSuchtext(e){this.merkeZeilenFokus(),this._suchtext=e,this._seite=0,this.wirt.melde()}klickSortiere(e){this.wirt.editable()||(this.merkeZeilenFokus(),this.holeGemerkte(),this._sortSpalte===e?this._sortAuf=!this._sortAuf:(this._sortSpalte=e,this._sortAuf=!0),this._seite=0,this.merkeSortierung(),this.wirt.melde())}blaettere(e){this.merkeZeilenFokus(),this._seite=e,this.wirt.melde()}fokussiereSuche(){let e=this.wirt.baustein.shadowRoot?.querySelector(`.suchzeile input`);return e?(e.focus(),!0):!1}merkeZeilenFokus(){let e=De(this.wirt.baustein.shadowRoot);this._fokusHolen=e!==void 0,this._fokusZeile=e??null}messeRumpf(){let e=this.wirt.zeilenHoehe();this._taktGemessen=e;let{mass:t,hoehe:n,kopf:r}=Se(this.wirt.baustein,e);this._rumpfGemessen=n,this._kopfGemessen=r,(t?.passen!==this._mass?.passen||t?.zeilenHoehe!==this._mass?.zeilenHoehe)&&(this._mass=t,this.wirt.melde())}beobachte(){this._beobachter||(this._beobachter=Ce(this.wirt.baustein,()=>this.messeRumpf()),this._beobachter&&this.messeRumpf())}nachRendern(){(this._taktGemessen!==this.wirt.zeilenHoehe()||this._rumpfGemessen!==k(this.wirt.baustein)||this._kopfGemessen!==xe(this.wirt.baustein))&&this.messeRumpf(),this._fokusHolen&&(this._fokusHolen=!1,je(this.wirt.baustein.shadowRoot,this._fokusZeile))}loese(){this._beobachter?.disconnect(),this._beobachter=null}nachPush(){this._seite=0,this._mass=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0}zuruecksetzen(){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._gemerkteGelesen=!0,this.merkeSortierung(),this.nachPush(),this._fokusZeile=null,this._fokusHolen=!1}};function L(e,t,n){let r=40-e,i=t-40,a=r>i?0:Math.min(i,Math.max(r,Math.round(n)));return{links:Math.round(e+a),rechts:Math.round(t-a)}}function Ge(e,t,n){if(e.button!==0)return;let r=[...e.currentTarget?.parentElement?.children??[]].filter(e=>e instanceof HTMLElement&&e.tagName===`DIV`),i=r[t],a=r[t+1];if(!i||!a)return;e.stopPropagation(),e.preventDefault();let o=e.clientX,s=i.getBoundingClientRect().width,c=a.getBoundingClientRect().width,l=L(s,c,0),u=()=>{window.removeEventListener(`pointermove`,p),window.removeEventListener(`pointerup`,m),window.removeEventListener(`pointercancel`,h),window.removeEventListener(`keydown`,g),window.removeEventListener(`blur`,h)},d=r.map(e=>Math.max(1,Math.round(e.getBoundingClientRect().width))),f=()=>d.map((e,n)=>n===t?{index:n,breite:l.links}:n===t+1?{index:n,breite:l.rechts}:{index:n,breite:e});function p(e){l=L(s,c,e.clientX-o),n.zeige(f())}function m(){u(),n.uebernimm(f())}function h(){u(),n.verwirf()}function g(e){e.key===`Escape`&&(e.preventDefault(),h())}window.addEventListener(`pointermove`,p),window.addEventListener(`pointerup`,m),window.addEventListener(`pointercancel`,h),window.addEventListener(`keydown`,g),window.addEventListener(`blur`,h)}function Ke(t,n){return Array.from({length:Math.max(0,t-1)},(t,r)=>e.html`<span
    class="breite-griff"
    role="presentation"
    style="grid-row: 1; grid-column: ${r+1}"
    title="Linie ziehen: links breiter, rechts schmaler"
    @pointerdown=${e=>Ge(e,r,n)}
    @click=${e=>e.stopPropagation()}
    @dblclick=${e=>e.stopPropagation()}
  ></span>`)}var qe=class{constructor(e){this._breiten=new Map,this._vorZug=null,this.wirt=e}breiteVon(e){return this._breiten.get(e)}vergessen(){this._breiten.clear()}voll(e){return e.map(e=>({index:this.wirt.vollerPlatz(e.index),breite:e.breite}))}wirtFuerZug(){return{zeige:e=>{let t=this.voll(e);this._vorZug===null&&(this._vorZug=new Map(t.map(e=>[e.index,this._breiten.get(e.index)])));for(let e of t)this._breiten.set(e.index,e.breite);this.wirt.melde()},uebernimm:e=>{let t=this.voll(e);if(this._vorZug=null,!this.wirt.imEditor()){for(let e of t)this._breiten.set(e.index,e.breite);this.wirt.melde();return}let n=this.wirt.spaltenListe();for(let e of t)e.index>=n.length||(this._breiten.delete(e.index),n[e.index]={...n[e.index],breite:e.breite});this.wirt.schreibeSpalten(n)},verwirf:()=>{let e=this._vorZug;if(this._vorZug=null,e){for(let[t,n]of e)n===void 0?this._breiten.delete(t):this._breiten.set(t,n);this.wirt.melde()}}}}};function Je(e){if(!Array.isArray(e))return null;let t=e.filter(e=>typeof e==`string`);return t.length===0?null:t}var R=j(`ff_spaltenwahl_`,Je);function Ye(t,n){if(t===null)return e.nothing;let r=t.waehlbar.filter(e=>!t.weg.has(e.kennung)).length;return e.html`<div class="sw-schirm" @pointerdown=${n.schliesse}></div>
    <div
      class="spaltenwahl"
      role="dialog"
      aria-label="Spalten zeigen oder verbergen"
      style="left: ${t.links}px; top: ${t.oben}px"
      @pointerdown=${e=>e.stopPropagation()}
      @contextmenu=${e=>e.preventDefault()}
    >
      <p class="sw-titel">Spalten</p>
      ${t.waehlbar.map(i=>{let a=!t.weg.has(i.kennung),o=a&&r<=1;return e.html`<button
          class=${a?`sw-zeile an`:`sw-zeile`}
          type="button"
          role="menuitemcheckbox"
          aria-checked=${a?`true`:`false`}
          ?disabled=${o}
          title=${o?`Die letzte Spalte bleibt stehen.`:``}
          @click=${()=>n.schalte(i.kennung)}
        ><span class="sw-haken">${a?`✓`:``}</span>${i.titel}</button>`})}
      ${t.weg.size===0?e.nothing:e.html`<button
        class="sw-alle"
        type="button"
        @click=${n.alleZeigen}
      >Alle zeigen</button>`}
    </div>`}var Xe=new Set,Ze=class{constructor(e){this._weg=null,this._offen=null,this.nimmTaste=e=>{e.key===`Escape`&&this.schliesse()},this.wirt=e}get offen(){return this._offen}weg(){return this.wirt.an()?(this._weg===null&&(this._weg=new Set(R.lies(this.wirt.baustein)??[])),this._weg):Xe}oeffne(e,t){e.preventDefault(),e.stopPropagation(),this._offen={links:Math.max(4,Math.min(e.clientX-t.left,Math.max(4,t.width-170))),oben:Math.max(4,Math.min(e.clientY-t.top,Math.max(4,t.height-60)))},window.addEventListener(`keydown`,this.nimmTaste),this.wirt.melde()}schliesse(){this._offen!==null&&(this._offen=null,window.removeEventListener(`keydown`,this.nimmTaste),this.wirt.melde())}schalte(e){let t=new Set(this.weg());t.has(e)?t.delete(e):t.add(e),this.merke(t)}alleZeigen(){this.merke(new Set)}merke(e){this._weg=e,R.merke(this.wirt.baustein,e.size===0?null:[...e]),this.wirt.breitenVergessen(),this.wirt.melde()}loese(){window.removeEventListener(`keydown`,this.nimmTaste),this._offen=null}};function Qe(e,t){let n=[];return e.spalten.forEach((r,i)=>{if(r.summe!==!0)return;let a=Ue(t.map(t=>e.wertVon(t,i)),I.min,I.max);a!==``&&n.push({titel:r.titel,text:a})}),n}function $e(e){return e.datenzeilen.map((t,n)=>e.spalten.map((t,r)=>e.wertVon(n,r)))}function et(e){let t=$e(e),n=nt(t,e.suchtext);return e.sortSpalte<0?n:Ve(n.map(e=>t[e]),e.sortSpalte,e.sortAuf).map(e=>n[e])}function tt(e){let t=e.gezeichnet??e.spalten,n=e.plaetze??t.map((e,t)=>t),r={gridTemplateColumns:ae(t,t=>e.breiteVon?.(n[t]??t))},i=e.gemessen?.zeilenHoehe??28,a=e.hatQuelle,o=e.belegteZeilen>0?!1:it(a,e.datenGeliefert,e.datenzeilen.length),s=et(e),c=e.belegteZeilen,l=e.gemessen===null?null:Math.max(1,e.gemessen.passen-c),u={sichtbar:s,hatQuelle:a,proSeite:l??Math.max(1,10-c),wunschSeite:e.wunschSeite,platzhalterZeilen:he(l)},{seiten:d,seite:f,zeilen:p}=e.blaettert?be(u):ye(u);return{cols:r,takt:28,zeilenHoehe:i,hatQuelle:a,leer:o,gesamt:s.length,seiten:d,seite:f,zeilen:p,linealTakte:ve(l,p.length),summen:Qe(e,s)}}function nt(e,t){let n=[];return e.forEach((e,r)=>{(0,g.zeilePasst)(e,t)&&n.push(r)}),n}function rt(e,t){return!e&&t.trim()!==``}function it(e,t,n){return e&&t&&n===0}function at(e){if(!e.hatQuelle)return`— Datensätze`;let t=e.auswahlAktiv?` · durch Auswahl gefiltert`:``,n=e=>e===1?`Datensatz`:`Datensätze`,r=e=>e===1?`Datensatz`:`Datensätzen`;return e.suchtAktiv?e.sichtbar===0?`Kein Treffer von ${e.gesamt} ${r(e.gesamt)}`+t:`${e.sichtbar} von ${e.gesamt} ${r(e.gesamt)}`+t:(e.gesamt===0?`Keine Datensätze`:`${e.gesamt} ${n(e.gesamt)}`)+t}var z=[(0,_.jaNeinProperty)(`suche`,`Suchzeile`,`Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.`,{requiresDataSource:!0}),(0,_.jaNeinProperty)(`blaettern`,`Blättern`,`Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.`),(0,_.jaNeinProperty)(`kopfzeile`,`Kopfzeile`,`Aus: keine Titelzeile, kein Sortieren per Titelklick.`),(0,_.jaNeinProperty)(`spaltenwahl`,`Spaltenwahl`,`In der Maske: Rechtsklick auf eine Spaltenüberschrift nimmt Spalten weg und holt sie zurück. Braucht die Kopfzeile.`),{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.`,kind:`field`},(0,a.leerTextProperty)()],B={prop:`spalten`,titelKey:`titel`,feldKey:`feld`,kennungKey:`kennung`,standardTitel:y,eintragNeu:e=>{let t=C(e.spalten);return t.length>=16?{}:{spalten:oe(t)}},eintragWeg:(e,t)=>{let n=C(e.spalten),r=se(n,t);return r===n?{}:{spalten:[...r]}},eintragVerschieben:(e,t,n)=>{let r=C(e.spalten),i=ce(r,t,n);return i===r?{}:{spalten:[...i]}},eintragStellen:`[data-ff-eintrag]`,eintragsSchalter:[{key:`summe`,label:`Summe in der Fußzeile`,kurz:`Summe`},{key:`versteckt`,label:`In der Maske ausblenden`,kurz:`ausgeblendet`}]},ot=/[.*+?^${}()|[\]\\]/g;function st(t,n){let r=(0,g.woerterVon)(n);if(r.length===0||t===``)return t;let i;try{i=RegExp(`(${r.map(e=>e.replace(ot,`\\$&`)).join(`|`)})`,`ig`)}catch{return t}let a=t.split(i);return a.length<=1?t:e.html`${a.map((t,n)=>n%2==1?e.html`<mark>${t}</mark>`:t)}`}function ct(t){if(t.linealTakte===0)return e.nothing;let r=t.linealTakte===null?t.cols:{...t.cols,flex:`0 1 auto`,height:`calc(var(--zeilen-hoehe) * ${t.linealTakte})`};return e.html`<div class="lineal" role="presentation" style=${(0,n.styleMap)(r)}>
          ${t.spalten.map(()=>e.html`<div></div>`)}
        </div>`}function lt(t,r,i,a){let o=i!==null&&!t.imEditor,s=t.schmuck(i);return e.html`<div
    class="zeile${a%2==1?` zebra`:``}${i!==null&&t.hatQuelle?` waehlbar`:``}${i!==null&&i===t.auswahlIndex?` gewaehlt`:``}${s.klasse===``?``:` `+s.klasse}"
    role="row"
    data-status=${s.status===``?e.nothing:s.status}
    title=${s.titel===``?e.nothing:s.titel}
    data-ff-roh=${i??e.nothing}
    tabindex=${o?`0`:e.nothing}
    aria-selected=${t.auswahlSemantik&&i!==null?String(i===t.auswahlIndex):e.nothing}
    style=${(0,n.styleMap)(t.cols)}
    @click=${()=>{r.aktiviereZeile(i,a)}}
    @dblclick=${e=>{e.target.closest(`.zell-eingabe`)||r.zeileDoppelt(i)}}
    @keydown=${e=>{if(!e.target.closest(`.zell-eingabe, button`)){if(e.key===`ArrowDown`||e.key===`ArrowUp`){let t=e.key===`ArrowUp`;(Oe(e.target,t?-1:1)||t&&Ae(e.target))&&e.preventDefault();return}if(s.taste(e)){e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),r.aktiviereZeile(i,a))}}}
  >
    ${t.spalten.map((n,r)=>{let o=t.plaetze[r],c=i===null?`—`:t.wertVon(i,o),l=i===null?null:s.zelle(o,n,c);if(l!==null)return l;let u=t.imEditor&&!t.zeigeKopf&&t.editable,d=[n.versteckt===!0?`versteckt`:``,i!==null&&M(c)!==null?`zahl`:``].filter(e=>e!==``).join(` `),f=r===0&&s.fehltext!==``?e.html`<span class="fehltext">${s.fehltext}</span>`:e.nothing;return e.html`<div
        class=${d===``?e.nothing:d}
        role="cell"
        data-ff-editable=${u?``:e.nothing}
        data-ff-eintrag=${u&&a===0?o:e.nothing}
      >${st(c,t.suchtext)}${f}</div>`})}
    ${s.rechts}
  </div>`}function ut(t,r){let i=t.zeilen.indexOf(null);return e.html`
      ${t.zeigeSuche?e.html`<div class="suchzeile">
        <input
          type="search"
          placeholder="Tabelle durchsuchen…"
          aria-label="Tabelle durchsuchen"
          .value=${t.suchtext}
          @input=${e=>r.setzeSuchtext(e.target.value)}
          @keydown=${e=>{e.key===`ArrowDown`&&ke(e.target)&&e.preventDefault()}}
        />
      </div>`:``}
      <div class="koerper" role=${t.leer?e.nothing:`table`} tabindex="-1">
      ${t.zeigeKopf?e.html`<div class="kopf" role="row" style=${(0,n.styleMap)(t.cols)}>
        ${t.spalten.map((n,i)=>e.html`<div
            class=${[n.versteckt===!0?`versteckt`:``,n.summe===!0?`z`:``].filter(e=>e!==``).join(` `)||e.nothing}
            role="columnheader"
            data-ff-editable
            data-ff-eintrag=${t.imEditor?t.plaetze[i]:e.nothing}
            style="grid-row: 1; grid-column: ${i+1}"
            @click=${()=>r.klickKopf(t.plaetze[i])}
            @contextmenu=${t.spaltenwahlAn?e=>r.oeffneSpaltenwahl(e):e.nothing}
          ><span class="kopf-text">${n.titel}</span>${!t.editable&&t.sortSpalte===t.plaetze[i]?e.html`<span class="sort-pfeil">${t.sortAuf?` ▲`:` ▼`}</span>`:``}</div>`)}
        ${Ke(t.spalten.length,r.breiten)}
      </div>`:e.nothing}
        ${t.leer?(0,a.leerZustand)(t.leerText,!0):e.html`
        ${t.zeilen.map((n,a)=>e.html`${a===i?t.unten:e.nothing}${lt(t,r,n,a)}`)}
        ${i===-1?t.unten:e.nothing}
        ${ct(t)}`}
      </div>
      ${Ye(t.spaltenwahl,r.spaltenwahl)}
    `}function dt(t,n){return t.leer?e.nothing:e.html`<div class="fusszeile">
    <div class="seiten-info">${at({hatQuelle:t.hatQuelle,sichtbar:t.sichtbar,gesamt:t.gesamt,suchtAktiv:t.suchtAktiv,auswahlAktiv:t.auswahlAktiv})}</div>
    ${t.summen.length===0?e.nothing:e.html`<div class="summen">
      ${t.summen.map(t=>e.html`<span class="summe">
        <span class="summe-titel">${t.titel}</span>
        <b>${t.text}</b>
      </span>`)}
    </div>`}
    <div class="fuss-rechts">
      ${t.blaettert?e.html`<div class="seiten-nav">
        <button
          aria-label="Seite zurück"
          ?disabled=${t.seite<=0}
          @click=${()=>n.blaettere(t.seite-1)}
        >‹</button>
        <span>Seite ${t.seite+1} von ${t.seiten}</span>
        <button
          aria-label="Seite vor"
          ?disabled=${t.seite>=t.seiten-1}
          @click=${()=>n.blaettere(t.seite+1)}
        >›</button>
      </div>`:e.nothing}
    </div>
  </div>`}var ft=e.css`
      :host { min-width: 0; height: 100%; }

      .tabelle {
        --se-zell-x: 10px;
        --se-eingabe-x: 4px;

        --kopf-hoehe: 36px;

        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-lg);
        box-shadow: var(--se-schatten);
        overflow: hidden;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
      }

      .suchzeile {
        padding: 5px 8px;
        border-bottom: var(--se-border) solid var(--se-line);
        background: var(--se-panel-2);
      }
      .suchzeile input {
        box-sizing: border-box;

        width: 100%;
        max-width: 15rem;
        height: 24px;
        padding: 0 8px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        color: var(--se-ink);
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
      }
      .suchzeile input:focus {
        outline: none;
        border-color: var(--se-accent);
      }

      .kopf {
        display: grid;
        height: var(--kopf-hoehe);
        box-sizing: border-box;
      }
      .zeile {
        display: grid;
        height: var(--zeilen-hoehe);
        box-sizing: border-box;
      }

      .kopf {
        position: sticky;
        top: 0;
        z-index: 1;
        flex: none;
        background: var(--se-panel-2);
        border-bottom: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-kopf);
        font-weight: 600;
        color: var(--se-muted);
      }

      .koerper {
        flex: 1 1 auto;
        overflow: auto;

        /* Kein Gutter: reservierter Platz stuende bei kurzen Listen als Luecke
           neben der letzten Spalte. */
        scrollbar-width: thin;
        display: flex;
        flex-direction: column;
      }

      .koerper > .zeile { flex: none; }

      .lineal {
        flex: 1 1 auto;
        min-height: 0;

        background-image:
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(var(--zeilen-hoehe) - 1px),
            var(--se-line-soft) calc(var(--zeilen-hoehe) - 1px),
            var(--se-line-soft) var(--zeilen-hoehe)
          );
        background-position: 0 0;

        display: grid;
      }

      .koerper > .leer--tafel {
        flex: 1 1 auto;
        align-content: center;
      }
      .zeile {
        border-bottom: 1px solid var(--se-line-soft);
        background: var(--se-panel);
        transition: background-color var(--se-move);
      }

      /* Getoent wird nach der Nummer in der Ansicht, nicht per nth-child: ohne
         Kopfzeile oder mit vorangestellter Erfassungszeile kippte die Toenung. */
      .zeile.zebra {
        background: var(--se-zebra);
      }

      /* Nur eine Zeile OHNE Status faerbt sich unter der Maus: die Kennfarbe
         IST die Auskunft. */
      .koerper > .zeile:not([data-status]):hover {
        background: var(--se-hover);
      }

      .koerper > .zeile.waehlbar { cursor: pointer; }

      .koerper:focus { outline: none; }
      .koerper > .zeile:focus {
        outline: var(--se-border) solid var(--se-accent);
        outline-offset: calc(-1 * var(--se-border));
      }
      .koerper > .zeile:focus:not(:focus-visible) { outline: none; }

      .zeile.gewaehlt,
      .zeile:focus-visible,
      .koerper > .zeile.gewaehlt:not([data-status]):hover,
      .koerper > .zeile:not([data-status]):focus-visible:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div,
      .zeile:focus-visible > div { color: var(--se-ink); }
      /* Die Textkante jeder Zelle; eine Zelle mit Eingabefeld gibt ihr Polster
         an das Feld ab (.tippbar). */
      .kopf > div,
      .zeile > div {
        padding: 0 var(--se-zell-x);
        line-height: calc(var(--zeilen-hoehe) - 1px);
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .zeile > div.zahl {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .kopf > div.z { justify-content: flex-end; text-align: right; }

      .kopf > div {
        display: flex;
        align-items: center;
        line-height: 1.25;
        white-space: normal;
        cursor: pointer;
        user-select: none;

        position: relative;
      }
      .kopf-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        overflow-wrap: break-word;
        -webkit-hyphens: auto;
        hyphens: auto;
      }

      /* Der Greifstreifen ist ein eigenes Gitter-Kind in der Spur der Kopfzelle
         und haengt ueber die Linie: eine 1px-Linie trifft die Maus nicht. In der
         Kopfzelle schnitte deren overflow ihn ab. */
      .breite-griff {
        position: relative;
        z-index: 2;
        justify-self: end;
        width: 11px;
        margin-right: -5px;
        cursor: col-resize;

        /* Sonst rollt der Finger die Tabelle, statt zu ziehen. */
        touch-action: none;
      }
      .breite-griff:hover {
        background: linear-gradient(
          to right,
          transparent 4px,
          var(--se-accent) 4px,
          var(--se-accent) 7px,
          transparent 7px
        );
      }

      .sort-pfeil { font-size: 9px; color: var(--se-muted); }

      /* Nur im Editor: gedaempft, aber voll bedienbar — es ist eine echte Spalte. */
      :host([data-ff-editor]) .versteckt { opacity: 0.45; }

      /* Das Wahlfenster liegt IN der Tabelle: die schneidet ihren Ueberhang ab. */
      .sw-schirm {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: 4;
      }
      .spaltenwahl {
        position: absolute;
        z-index: 5;
        display: flex;
        flex-direction: column;
        min-width: 160px;
        max-width: 260px;
        max-height: 70%;
        overflow-y: auto;
        padding: 3px;
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-md);
        box-shadow: var(--se-schatten);
      }
      .sw-titel {
        margin: 0;
        padding: 3px 8px 5px;
        font-size: var(--se-fs-sm);
        font-weight: 600;
        color: var(--se-muted);
      }
      .sw-zeile,
      .sw-alle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 4px 8px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        text-align: left;
        color: var(--se-ink);
        background: none;
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
      }
      .sw-zeile:hover:not(:disabled),
      .sw-alle:hover { background: var(--se-hover); }
      .sw-zeile:disabled { cursor: default; opacity: 0.55; }
      .sw-zeile:not(.an) { color: var(--se-muted); }
      .sw-haken {
        flex: none;
        width: 12px;
        color: var(--se-accent);
      }
      .sw-alle {
        margin-top: 3px;
        padding-top: 6px;
        border-top: var(--se-border) solid var(--se-line);
        color: var(--se-accent);
      }

      .zeile > div { color: var(--se-ink); }

      .fusszeile {
        display: flex;
        align-items: center;
        gap: 14px;
        min-height: 30px;
        padding: 3px 10px;
        border-top: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-sm);
        color: var(--se-muted);
        white-space: nowrap;
        overflow: hidden;
      }
      .seiten-info { flex: none; }
      .fuss-rechts {
        flex: none;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
      }
      .seiten-nav {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      mark {
        padding: 0 1px;
        color: inherit;
        background: var(--se-amber-soft);
        border-radius: 2px;
      }

      .summen {
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .summe-titel { color: var(--se-muted); }
      .summen b {
        color: var(--se-ink);
        font-variant-numeric: tabular-nums;
      }

      .seiten-nav button {
        box-sizing: border-box;
        height: 22px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        padding: 2px 6px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        color: var(--se-ink);
        cursor: pointer;
      }
      .seiten-nav button:disabled {
        opacity: 0.3;
        cursor: default;
      }
`;function V(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var H=class extends r.BasicBlock{constructor(...e){super(...e),this.spalten=S(),this.source=``,this.suche=`ja`,this.blaettern=`ja`,this.kopfzeile=`ja`,this.spaltenwahl=`nein`,this.leerText=a.LEER_TEXT_STANDARD,this.datenzeilen=[],this.rohzeilen=[],this.durchAuswahlGefiltert=!1,this.datenGeliefert=!1,this._besitz=`softengine`,this._breiten=new qe({imEditor:()=>this.imEditor,vollerPlatz:e=>v(this.spaltenListe(),this.imEditor,this._wahl.weg()).plaetze[e]??e,spaltenListe:()=>this.spaltenListe(),schreibeSpalten:e=>this.aendere(e),melde:()=>this.requestUpdate()}),this._ansicht=new We({baustein:this,editable:()=>this.editable,zeilenHoehe:()=>this.zeilenHoehe,melde:()=>this.requestUpdate(),spalten:()=>this.spaltenListe(),merktSortierung:()=>!this.imEditor}),this._wahl=new Ze({baustein:this,an:()=>this.spaltenwahlAn,melde:()=>this.requestUpdate(),breitenVergessen:()=>this._breiten.vergessen()}),this._zeilenWahl=new Ee(this)}static{this.blockType=`tabelle`}static{this.tagName=`ff-tabelle`}static{this.displayName=`Tabelle`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.kannAuswahlFolgen=!0}static{this.blockEvents=[{key:`onRowClick`,name:`Zeile gewählt`},{key:`onRowDblClick`,name:`Zeile doppelt geklickt`}]}static{this.listenBindung=B}static{this.defaultProps={width:`fill`,source:``,spalten:S(),suche:`ja`,blaettern:`ja`,kopfzeile:`ja`,spaltenwahl:`nein`,tagField:``,leerText:a.LEER_TEXT_STANDARD}}static{this.customProperties=z}static{this.raster={startW:24,startH:14,minW:6,minH:4}}static{this.styles=[r.BasicBlock.styles,a.leerStil,ft]}get besitz(){return this._besitz}set besitz(e){e!==this._besitz&&(this._besitz=e,this.setzeAbgeleitetesZurueck(),this.isConnected&&(e===`provided`?O(this):D(this)),this.requestUpdate())}set bereitgestellteZeilen(e){let t=pe(e);this.rohzeilen=t.rohzeilen,this.datenzeilen=t.datenzeilen,this.datenGeliefert=!0,this._zeilenWahl.vergiss(),this.durchAuswahlGefiltert=!1,this._ansicht.nachPush(),this.requestUpdate()}setzeAbgeleitetesZurueck(){this.rohzeilen=[],this.datenzeilen=[],this.datenGeliefert=!1,this._zeilenWahl.vergiss(),this.durchAuswahlGefiltert=!1,this._ansicht.zuruecksetzen()}fokussiereSuche(){return this._ansicht.fokussiereSuche()}setzeSuchtext(e){this._ansicht.setzeSuchtext(e),this.requestUpdate()}get hatQuelle(){return this._besitz===`provided`||rt(this.imEditor,this.source)}spaltenListe(){return C(this.spalten)}get zeilenHoehe(){return 28}zellWert(e,t){return this.datenzeilen[e]?.[t]??``}zeilenSchmuck(){return()=>o.OHNE_SCHMUCK}unterZeilen(){return null}aendere(e){this.meldeProp(`spalten`,e)}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this._besitz===`softengine`&&D(this),this._ansicht.beobachte()}firstUpdated(){this._ansicht.beobachte()}willUpdate(e){super.willUpdate(e),e.has(`spalten`)&&this._breiten.vergessen()}updated(){this._ansicht.nachRendern()}disconnectedCallback(){super.disconnectedCallback(),this._wahl.loese(),this._ansicht.loese(),O(this)}get spaltenwahlAn(){return this.spaltenwahl===`ja`&&this.kopfzeile===`ja`&&!this.imEditor}oeffneSpaltenwahl(e){let t=this.shadowRoot?.querySelector(`.tabelle`)?.getBoundingClientRect();t&&this._wahl.oeffne(e,t)}render(){let t=this.spaltenListe(),r=v(t,this.imEditor,this._wahl.weg()),a=this.unterZeilen(),o=tt({spalten:t,gezeichnet:r.spalten,plaetze:r.plaetze,breiteVon:e=>this._breiten.breiteVon(e),hatQuelle:this.hatQuelle,datenGeliefert:this.datenGeliefert,datenzeilen:this.datenzeilen,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,wunschSeite:this._ansicht.seite,gemessen:this._ansicht.mass,belegteZeilen:a?.anzahl??0,wertVon:(e,t)=>this.zellWert(e,t),blaettert:this.blaettern===`ja`});return e.html`<div class="tabelle" style=${(0,n.styleMap)({"--takt":`${o.takt}px`,"--zeilen-hoehe":`${o.zeilenHoehe}px`})}>
      ${ut({spalten:r.spalten,plaetze:r.plaetze,cols:o.cols,editable:this.editable,imEditor:this.imEditor,zeigeKopf:this.kopfzeile===`ja`,spaltenwahlAn:this.spaltenwahlAn,spaltenwahl:this._wahl.offen===null?null:{waehlbar:t.filter(e=>e.versteckt!==!0),weg:this._wahl.weg(),links:this._wahl.offen.links,oben:this._wahl.offen.oben},auswahlSemantik:(0,i.geberIdVon)(this)!==``,zeigeSuche:this.suche===`ja`,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,zeilen:o.zeilen,wertVon:(e,t)=>this.zellWert(e,t),linealTakte:o.linealTakte,hatQuelle:o.hatQuelle,auswahlIndex:this._zeilenWahl.platzIn(this.rohzeilen),leer:o.leer,leerText:this.leerText,schmuck:this.zeilenSchmuck(),unten:a===null?e.nothing:a.zeichne({sicht:r,cols:o.cols,linealTakte:o.linealTakte})},{setzeSuchtext:e=>this._ansicht.setzeSuchtext(e),oeffneSpaltenwahl:e=>this.oeffneSpaltenwahl(e),spaltenwahl:{schalte:e=>this._wahl.schalte(e),alleZeigen:()=>this._wahl.alleZeigen(),schliesse:()=>this._wahl.schliesse()},breiten:this._breiten.wirtFuerZug(),klickKopf:e=>{this.editable||this._ansicht.klickSortiere(e)},aktiviereZeile:(e,t)=>{Me(this,this._zeilenWahl,this.rohzeilen,e,t),this.requestUpdate()},zeileDoppelt:e=>Ne(this,this.rohzeilen,e)})}
      ${dt({hatQuelle:o.hatQuelle,sichtbar:o.gesamt,gesamt:this.datenzeilen.length,suchtAktiv:this._ansicht.suchtAktiv,auswahlAktiv:this.durchAuswahlGefiltert,seite:o.seite,seiten:o.seiten,blaettert:this.blaettern===`ja`,summen:o.summen,leer:o.leer},{blaettere:e=>this._ansicht.blaettere(e)})}
    </div>`}};V([(0,t.property)({converter:{fromAttribute:e=>e?w(e):S(),toAttribute:e=>JSON.stringify(e)}})],H.prototype,`spalten`,void 0),V([(0,t.property)()],H.prototype,`source`,void 0),V([(0,t.property)()],H.prototype,`suche`,void 0),V([(0,t.property)()],H.prototype,`blaettern`,void 0),V([(0,t.property)()],H.prototype,`kopfzeile`,void 0),V([(0,t.property)()],H.prototype,`spaltenwahl`,void 0),V([(0,t.property)()],H.prototype,`leerText`,void 0),V([(0,t.property)({attribute:!1})],H.prototype,`datenzeilen`,void 0),V([(0,t.property)({attribute:!1})],H.prototype,`rohzeilen`,void 0),V([(0,t.property)({attribute:!1})],H.prototype,`durchAuswahlGefiltert`,void 0),V([(0,t.property)({attribute:!1})],H.prototype,`datenGeliefert`,void 0),r.BasicBlock.defineAndRegister(H);function pt(){return e.html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
      <line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></line>
    </svg>`}function mt(e){return Math.min(900,Math.max(520,160+180*e))}function ht(t){return e.html`<div class="nachschlag">
    <input
      class="ctrl"
      type="text"
      .value=${t.wert}
      @input=${e=>t.onTippen(e.target.value)}
      @keydown=${t.onTaste}
      @blur=${()=>t.onVerlassen()}
    />
    <button
      class="lupe"
      type="button"
      aria-label="Nachschlagen"
      title="Nachschlagen"
      @click=${()=>t.onLupe()}
    >${pt()}</button>
    ${t.liste}
  </div>`}var gt={prop:`nachschlagSpalten`,titelKey:`titel`,feldKey:`feld`,standardTitel:y,quelleProp:`nachschlagQuelle`};function U(e){if(typeof e==`string`)try{e=JSON.parse(e)}catch{return[]}return Array.isArray(e)&&e.length>0?C(e):[]}function W(e,t){let n=U(e);return n.length>0?n:t()}function G(e,t){let n=e[0];return n===void 0?t:n.feld}function K(e,t){let n=e.trim();return n===``||n===t.trim()}function q(e,t,n){let r=t.trim(),i=[],a=K(t,n),o=new Set;for(let t of e){let e=(0,l.getField)(t,n).trim(),s=r===``?e:(0,l.getField)(t,r).trim();if(s!==``||e!==``){if(a){if(o.has(e))continue;o.add(e)}i.push({anzeige:s,wert:e,satz:t})}}return i}function _t(e,t,n,r){return q((0,i.zeilenNachAuswahl)(e,t).rows,n,r)}function J(e){let t=(0,l.findRuntimeDataSource)((0,c.seGlobal)().FF_DATA_SOURCES,e);return t?(0,l.rowsFor)((0,c.seGlobal)().SEDATA,t.name,t.tableId,t.offenerSatz):null}function Y(e){if(e.quelleId===``||e.speicherFeld===``)return{ok:!1,grund:`unvollstaendig`};let t=J(e.quelleId);if(t===null)return{ok:!1,grund:`quelleFehlt`};let n=G(U([...e.spalten]),e.speicherFeld);return{ok:!0,eintraege:_t(e.el,t,n,e.speicherFeld)}}function vt(e,t){return t&&e.length===1?e[0]:null}function yt(e,t){let{rows:n,gefiltert:r}=(0,i.zeilenNachAuswahl)(e,[t]);return!r||n.length>0}function bt(e,t,n){return e===``?t===``&&n===``?`nichts`:`leeren`:e===t?`nichts`:`zurueck`}var X=null,Z=null,Q=null;function xt(e){return e.shadowRoot?.querySelector(`.lupe`)??null}function $(e=!0){let t=e?Q:null;Q=null,X?.remove(),X=null,Z=null,t?.focus()}function St(e){Z===e&&$(!1)}function Ct(e){return[{kennung:``,titel:e.speicherTitel===``?`Wert`:e.speicherTitel,feld:e.speicherFeld}]}function wt(t){let n=e=>e.stopPropagation(),r=t.editor;return e.html`<ff-dialog-rahmen
    viewport
    escape-schliesst
    ?ziehbar=${r!==void 0}
    ?data-ff-nachschlagen=${r===void 0}
    style=${r===void 0?e.nothing:`z-index:40`}
    .titel=${t.titel===``?`Nachschlagen`:t.titel}
    .breite=${t.breite}
    .hoehe=${t.hoehe}
    @ff-dialog-groesse=${r===void 0?e.nothing:e=>{e.stopPropagation(),r.onGroesse(e.detail)}}
    @ff-dialog-schliessen=${e=>{r!==void 0&&e.stopPropagation(),t.onSchliessen()}}
    @click=${n}
    @pointerdown=${r===void 0?e.nothing:n}
    @dblclick=${r===void 0?e.nothing:n}
  >${t.inhalt}</ff-dialog-rahmen>`}function Tt(t,n){let r=U([...t.spalten]),i=K(G(r,t.speicherFeld),t.speicherFeld);return e.html`<ff-tabelle
    fuellt
    suche="ja"
    spaltenwahl="ja"
    style="--se-r-lg:0px"
    .besitz=${`provided`}
    .spalten=${W(r,()=>Ct(t))}
    .leerText=${`Diese Quelle hat keine Sätze.`}
    .bereitgestellteZeilen=${n.map(e=>({rohzeile:e.satz,zellen:r.length>0?r.map(t=>t.feld===``?``:(0,l.getField)(e.satz,t.feld)):i?[e.wert]:[e.anzeige,e.wert]}))}
  ></ff-tabelle>`}function Et(t){let n=t.eintraege;if(n===void 0){let e=Y(t);if(!e.ok){(0,ee.meldeFehler)(e.grund===`unvollstaendig`?`Nachschlagen braucht an diesem Feld eine Quelle und „Gespeichert wird".`:`Die Nachschlage-Quelle dieses Feldes ist in der Maske nicht vorhanden.`);return}n=e.eintraege}$(!1);let r=document.createElement(`div`);r.style.display=`contents`,(0,e.render)(wt({titel:t.titel,breite:t.breite,hoehe:t.hoehe,inhalt:Tt(t,n),onSchliessen:()=>$()}),r);let i=r.querySelector(te.DIALOG_RAHMEN_TAG),a=r.querySelector(`ff-tabelle`);a?.addEventListener(we,e=>{let r=e.detail,i=n[r.rohIndex];i&&($(),t.onUebernehmen(i.anzeige,i.wert,i.satz))}),Q=t.rueckFokus??xt(t.el),document.body.appendChild(r),X=r,Z=t.el;let o=t.suchtext??``;a&&o!==``&&a.setzeSuchtext(o),i&&a&&Promise.all([i.updateComplete,a.updateComplete]).then(()=>{i.isConnected&&a.fokussiereSuche()})}function Dt(t){return wt({titel:t.titel,breite:t.breite,hoehe:t.hoehe,onSchliessen:t.onSchliessen,editor:{onGroesse:t.onGroesse},inhalt:e.html`<ff-tabelle
      data-ff-editor
      fuellt
      suche="ja"
      style="--se-r-lg:0px"
      .spalten=${[...t.spalten]}
      .editable=${!0}
      @ff-prop-change=${e=>{e.stopPropagation();let n=e.detail;n?.attr===`spalten`&&t.onAendern(C(n.value))}}
      @ff-listen-bind=${e=>{e.stopPropagation();let n=e.detail;typeof n?.index==`number`&&t.onFeldWahl({index:n.index,top:n.top??0,left:n.left??0,...Array.isArray(n.liste)?{liste:n.liste}:{}})}}
    ></ff-tabelle>`})}window.FF=window.FF||{},FF.blocks$tabelle$TabelleBlock={TabelleBlock:H},FF.blocks$tabelle$nachschlagen={FENSTER_BREITE:520,FENSTER_HOEHE:380,NACHSCHLAG_SPALTEN_BINDUNG:gt,automatikSpalten:Ct,coerceNachschlagSpalten:U,einzigenTrefferFinden:vt,fensterBreiteFuer:mt,fensterSpaltenOder:W,folgeBeimVerlassen:bt,holeEintraege:Y,nachschlagEintraege:q,nachschlagFeldTpl:ht,oeffneNachschlagen:Et,quellenZeilen:J,satzPasstZurAuswahl:yt,schliesseNachschlagenFuer:St,spaltenStellenTpl:Dt},FF.blocks$tabelle$seRuntime={hatSatzNummer:de,zeilenIndexVon:T},FF.blocks$tabelle$sortierung={alsZahl:M},FF.blocks$tabelle$spalten={ZELLE_PLATZHALTER:`—`,coerceSpalten:C,standardSpalten:S},FF.blocks$tabelle$tabelleEigenschaften={SPALTEN_BINDUNG:B,TABELLE_EIGENSCHAFTEN:z}})(FF.lit,FF.lit$decorators$js,FF.lit$directives$style$map$js,FF.blocks$base$BasicBlock,FF.blocks$shared$auswahl,FF.blocks$shared$leerZustand,FF.blocks$shared$zeilenNaehte,FF.core$blocks$blockRegistry,FF.softengine$bridge,FF.softengine$data,FF.blocks$shared$datenAnschluss,FF.blocks$shared$datenVorspann,FF.core$blocks$listenBindung,FF.core$data$rechnung,FF.blocks$shared$seAktionen,FF.core$data$aktionen,FF.blocks$shared$textSuche,FF.blocks$shared$jaNeinProperty,FF.softengine$meldung,FF.blocks$shared$DialogRahmen);