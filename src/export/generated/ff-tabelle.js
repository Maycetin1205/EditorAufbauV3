(function(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,ee,te,_,v,ne,y,re){var ie=Object.defineProperty,ae=(e,t)=>{let n={};for(var r in e)ie(n,r,{get:e[r],enumerable:!0});return t||ie(n,Symbol.toStringTag,{value:`Module`}),n};function b(e,t,n=new Set){let r=e=>e.versteckt===!0||n.has(e.kennung);if(t||!e.some(r))return{spalten:e,plaetze:e.map((e,t)=>t)};let i=[],a=[];return e.forEach((e,t)=>{r(e)||(i.push(e),a.push(t))}),i.length===0&&e.length>0?{spalten:[e[0]],plaetze:[0]}:{spalten:i,plaetze:a}}var x=`Spalte {n}`;function oe(e){return x.replace(`{n}`,String(e+1))}function S(e){return{kennung:``,titel:oe(e),feld:``}}function C(e){let t=(0,p.kennungenVergeben)(e.map(e=>e.kennung));return e.map((e,n)=>e.kennung===t[n]?e:{...e,kennung:t[n]})}function se(e,t){let n=t.trim();return n===``?-1:e.findIndex(e=>e.kennung===n)}function w(){return C([S(0)])}function ce(e){let t=typeof e==`number`?e:Number(e);if(!Number.isFinite(t))return;let n=Math.round(t);return n<40?40:n}var le=120,ue=2e3;function T(e){if(e==null||e===``)return;let t=typeof e==`number`?e:Number(e);if(Number.isFinite(t))return Math.min(ue,Math.max(le,Math.round(t)))}function de(e,t){if(e&&typeof e==`object`){let n=e,r=n.breite===void 0?void 0:ce(n.breite);return{kennung:typeof n.kennung==`string`?n.kennung.trim():``,titel:typeof n.titel==`string`?n.titel:oe(t),feld:typeof n.feld==`string`?n.feld:``,...r===void 0?{}:{breite:r},...typeof n.summe==`boolean`?{summe:n.summe}:{},...typeof n.aenderbar==`boolean`?{aenderbar:n.aenderbar}:{},...typeof n.versteckt==`boolean`?{versteckt:n.versteckt}:{},...typeof n.fuellFeld==`string`&&n.fuellFeld.trim()!==``?{fuellFeld:n.fuellFeld.trim()}:{},...Array.isArray(n.fensterSpalten)&&n.fensterSpalten.length>0?{fensterSpalten:n.fensterSpalten.map((e,t)=>de(e,t))}:{},...T(n.fensterBreite)===void 0?{}:{fensterBreite:T(n.fensterBreite)},...T(n.fensterHoehe)===void 0?{}:{fensterHoehe:T(n.fensterHoehe)}}}return typeof e==`string`?{...S(t),titel:e}:S(t)}function E(e){let t;if(Array.isArray(e))t=e.map((e,t)=>de(e,t));else if(typeof e==`number`&&Number.isFinite(e)||typeof e==`string`&&/^\d+$/.test(e)){let n=Math.max(1,Math.floor(Number(e)));t=[...Array(n).keys()].map(e=>S(e))}else t=w();return t.length<1&&(t=[S(0)]),C(t)}function fe(e){try{return E(JSON.parse(e))}catch{return w()}}function pe(e,t=()=>void 0){let n=e.map((e,n)=>t(n)??e.breite),r=n.filter(e=>e!==void 0),i=r.length===0?1:Math.max(1,Math.round(r.reduce((e,t)=>e+t,0)/r.length));return n.map(e=>`minmax(0, ${e??i}fr)`).join(` `)}function me(e){return C([...e,S(e.length)])}function he(e,t,n){let r=(0,i.rechnungVonAttribut)(e);if(!r)return null;let a=new Set(n.map(e=>e.kennung)),o=t.map(e=>e.kennung).filter(e=>e!==``&&!a.has(e)),s=(0,i.ohneSpalten)(r,o);return s===r?null:(0,i.rechnungAlsAttribut)(s)}function ge(e,t){return e.length<=1||t<0||t>=e.length?e:e.filter((e,n)=>n!==t)}function _e(e,t,n){if(t<0||t>=e.length)return e;let r=Math.max(0,Math.min(n,e.length-1));if(r===t)return e;let i=[...e],[a]=i.splice(t,1);return i.splice(r,0,a),i}function ve(e){return fe(e.getAttribute(`spalten`)??``)}function D(e,t){let n=(0,l.findRuntimeDataSource)((0,r.seGlobal)().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return n?(0,l.satzIndexVon)(n,t):``}function ye(e){let t=(0,l.findRuntimeDataSource)((0,r.seGlobal)().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return t!==void 0&&t.indexField!==``}function be(e,t){t&&e.vergissGeschriebene();let n=(0,g.holeDatenVorspann)(e);if(!n){e.datenzeilen=[];return}let r=ve(e),{rows:i,gefiltert:a}=(0,o.zeilenNachAuswahl)(e,n.zeilen);(0,o.auswahlWiederfinden)((0,o.geberIdVon)(e),i,e=>e);let s=n.lies;e.datenGeliefert=!0,e.rohzeilen=i,e.durchAuswahlGefiltert=a,e.datenzeilen=i.map(e=>r.map(t=>t.feld===``?``:s(e,t.feld)))}var xe=(0,h.macheDatenAnschluss)({hydriere:be}),O=xe.connect,k=xe.disconnect;function Se(e){return{rohzeilen:e.map(e=>e.rohzeile),datenzeilen:e.map(e=>[...e.zellen])}}var A=`ff-zeile-aktiviert`,j=`data-ff-roh`;function M(e,t){e.dispatchEvent(new CustomEvent(A,{detail:t,bubbles:!0,composed:!0}))}var Ce=class{constructor(e){this.eigenesMerkmal=``,this.letzterPlatz=null,this.baustein=e}get geberId(){return(0,o.geberIdVon)(this.baustein)}get merkmal(){let e=this.geberId;return e===``?this.eigenesMerkmal:(0,o.merkmalVon)((0,o.auswahlFuer)(e))}platzIn(e){let t=this.merkmal;if(t===``)return-1;let n=this.letzterPlatz;if(n!==null&&n.zeilen===e&&n.merkmal===t)return n.platz;let r=e.findIndex(e=>(0,o.merkmalVon)(e)===t);return this.letzterPlatz={zeilen:e,merkmal:t,platz:r},r}schalte(e){let t=(0,o.merkmalVon)(e),n=this.geberId;return n===``?(this.eigenesMerkmal=this.eigenesMerkmal===t?``:t,this.eigenesMerkmal!==``):((0,o.waehleAuswahl)(n,e),t!==``&&(0,o.merkmalVon)((0,o.auswahlFuer)(n))===t)}vergiss(){this.eigenesMerkmal=``,this.letzterPlatz=null}};function we(e){let t=e?.activeElement;if(!(t instanceof HTMLElement))return;let n=t.closest(`.zeile`);if(!n)return;let r=n.getAttribute(j);return r===null||r===``?null:Number(r)}function Te(e,t){if(!(e instanceof HTMLElement))return!1;let n=e.closest(`.zeile`),r=n?.parentElement;if(!n||!r)return!1;let i=[...r.querySelectorAll(`.zeile[${j}]`)],a=i.indexOf(n),o=a===-1?void 0:i[a+t];return o?(o.focus(),o.scrollIntoView?.({block:`nearest`}),!0):!1}function Ee(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.zeile[${j}]`);return t?(t.focus(),!0):!1}function De(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.suchzeile input`);return t?(t.focus(),!0):!1}function Oe(e,t){e&&((t===null?null:e.querySelector(`.zeile[data-ff-roh="${t}"]`))??e.querySelector(`.zeile[data-ff-roh]`)??e.querySelector(`.koerper`))?.focus()}function ke(e,t,n,r,i){if(r===null||e.hasAttribute(`data-ff-editor`))return;let a=n[r];if(a!==void 0){if(!t.schalte(a)){M(e,{rohzeile:a,rohIndex:-1,ansichtIndex:i});return}M(e,{rohzeile:a,rohIndex:r,ansichtIndex:i}),(0,m.runEvent)(e,`onRowClick`,{PINDEX:D(e,a)}).catch(m.meldeKettenFehler)}}function Ae(e,t,n){if(n===null||e.hasAttribute(`data-ff-editor`))return;let r=t[n];r!==void 0&&(0,m.runEvent)(e,`onRowDblClick`,{PINDEX:D(e,r)}).catch(m.meldeKettenFehler)}var je=ae({FENSTER_BREITE:()=>520,FENSTER_HOEHE:()=>380,NACHSCHLAG_SPALTEN_BINDUNG:()=>Ne,automatikSpalten:()=>Ue,coerceNachschlagSpalten:()=>P,einzigenTrefferFinden:()=>Re,fensterBreiteFuer:()=>N,folgeBeimVerlassen:()=>Be,holeEintraege:()=>Le,nachschlagEintraege:()=>F,nachschlagFeldTpl:()=>Me,oeffneNachschlagen:()=>Ke,quellenZeilen:()=>I,satzPasstZurAuswahl:()=>ze,schliesseNachschlagenFuer:()=>He,spaltenStellenTpl:()=>qe});function N(e){return Math.min(900,Math.max(520,160+180*e))}function Me(t){return e.html`<div class="nachschlag">
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
    >${(0,d.lupeZeichen)()}</button>
    ${t.liste}
  </div>`}var Ne={prop:`nachschlagSpalten`,titelKey:`titel`,feldKey:`feld`,standardTitel:x,quelleProp:`nachschlagQuelle`};function P(e){if(typeof e==`string`)try{e=JSON.parse(e)}catch{return[]}return Array.isArray(e)&&e.length>0?E(e):[]}function Pe(e,t){let n=e[0];return n===void 0?t:n.feld}function Fe(e,t){let n=e.trim();return n===``||n===t.trim()}function F(e,t,n){let r=t.trim(),i=[],a=Fe(t,n),o=new Set;for(let t of e){let e=(0,l.getField)(t,n).trim(),s=r===``?e:(0,l.getField)(t,r).trim();if(s!==``||e!==``){if(a){if(o.has(e))continue;o.add(e)}i.push({anzeige:s,wert:e,satz:t})}}return i}function Ie(e,t,n,r){return F((0,o.zeilenNachAuswahl)(e,t).rows,n,r)}function I(e){let t=(0,l.findRuntimeDataSource)((0,r.seGlobal)().FF_DATA_SOURCES,e);return t?(0,l.rowsFor)((0,r.seGlobal)().SEDATA,t.name,t.tableId,t.offenerSatz):null}function Le(e){if(e.quelleId===``||e.speicherFeld===``)return{ok:!1,grund:`unvollstaendig`};let t=I(e.quelleId);if(t===null)return{ok:!1,grund:`quelleFehlt`};let n=Pe(P([...e.spalten]),e.speicherFeld);return{ok:!0,eintraege:Ie(e.el,t,n,e.speicherFeld)}}function Re(e,t){return t&&e.length===1?e[0]:null}function ze(e,t){let{rows:n,gefiltert:r}=(0,o.zeilenNachAuswahl)(e,[t]);return!r||n.length>0}function Be(e,t,n){return e===``?t===``&&n===``?`nichts`:`leeren`:e===t?`nichts`:`zurueck`}var L=null,R=null,z=null;function Ve(e){return e.shadowRoot?.querySelector(`.lupe`)??null}function B(e=!0){let t=e?z:null;z=null,L?.remove(),L=null,R=null,t?.focus()}function He(e){R===e&&B(!1)}function Ue(e){return[{kennung:``,titel:e.speicherTitel===``?`Wert`:e.speicherTitel,feld:e.speicherFeld}]}function We(t){let n=e=>e.stopPropagation(),r=t.editor;return e.html`<ff-dialog-rahmen
    viewport
    escape-schliesst
    ohne-modal
    inhalt-fest
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
  >${t.inhalt}</ff-dialog-rahmen>`}function Ge(t,n){let r=P([...t.spalten]),i=Fe(Pe(r,t.speicherFeld),t.speicherFeld);return e.html`<ff-tabelle
    fuellt
    suche="ja"
    spaltenwahl="ja"
    style="--se-r-lg:0px"
    .besitz=${`provided`}
    .spalten=${r.length>0?r:Ue(t)}
    .leerText=${`Diese Quelle hat keine Sätze.`}
    .bereitgestellteZeilen=${n.map(e=>({rohzeile:e.satz,zellen:r.length>0?r.map(t=>t.feld===``?``:(0,l.getField)(e.satz,t.feld)):i?[e.wert]:[e.anzeige,e.wert]}))}
  ></ff-tabelle>`}function Ke(t){let n=t.eintraege;if(n===void 0){let e=Le(t);if(!e.ok){(0,u.meldeFehler)(e.grund===`unvollstaendig`?`Nachschlagen braucht an diesem Feld eine Quelle und „Gespeichert wird".`:`Die Nachschlage-Quelle dieses Feldes ist in der Maske nicht vorhanden.`);return}n=e.eintraege}B(!1);let r=document.createElement(`div`);r.style.display=`contents`,(0,e.render)(We({titel:t.titel,breite:t.breite,hoehe:t.hoehe,inhalt:Ge(t,n),onSchliessen:()=>B()}),r);let i=r.querySelector(f.DIALOG_RAHMEN_TAG),a=r.querySelector(`ff-tabelle`);a?.addEventListener(A,e=>{let r=e.detail,i=n[r.rohIndex];i&&(B(),t.onUebernehmen(i.anzeige,i.wert,i.satz))}),z=t.rueckFokus??Ve(t.el),document.body.appendChild(r),L=r,R=t.el;let o=t.suchtext??``;a&&o!==``&&a.setzeSuchtext(o),i&&a&&Promise.all([i.updateComplete,a.updateComplete]).then(()=>{i.isConnected&&a.fokussiereSuche()})}function qe(t){return We({titel:t.titel,breite:t.breite,hoehe:t.hoehe,onSchliessen:t.onSchliessen,editor:{onGroesse:t.onGroesse},inhalt:e.html`<ff-tabelle
      data-ff-editor
      fuellt
      suche="ja"
      style="--se-r-lg:0px"
      .spalten=${[...t.spalten]}
      .editable=${!0}
      @ff-prop-change=${e=>{e.stopPropagation();let n=e.detail;n?.attr===`spalten`&&t.onAendern(E(n.value))}}
      @ff-listen-bind=${e=>{e.stopPropagation();let n=e.detail;typeof n?.index==`number`&&t.onFeldWahl({index:n.index,top:n.top??0,left:n.left??0,...Array.isArray(n.liste)?{liste:n.liste}:{}})}}
    ></ff-tabelle>`})}function Je(t,n,r,i){return e.html`<input
    class=${t.automatisch(i)?`erf-eingabe auto`:`erf-eingabe`}
    type="text"
    data-spalte=${i}
    placeholder=${t.spalten[r]?.titel??``}
    .value=${t.wert(i)}
    @input=${e=>n.tippen(i,e.target.value)}
    @keydown=${e=>n.taste(i,e)}
    @blur=${()=>n.verlassen(i)}
  />`}function Ye(t,n,r,i,a){if(a)return e.html`<div class="erf-halter">
      ${Je(t,n,r,i)}
    </div>`;let o=t.tippSpalte===i&&t.vorschlaege.length>0;return e.html`<div class=${t.listeNachOben?`erf-halter nach-oben`:`erf-halter`}>
    ${Je(t,n,r,i)}
    ${o?(0,c.vorschlagListeTpl)({eintraege:t.vorschlaege,marke:t.marke,onWaehlen:e=>n.waehleVorschlag(e),onMarke:e=>n.setzeMarke(e)}):e.nothing}
  </div>`}function Xe(t,r){return e.html`<div class="zeile erfassung" role="row" style=${(0,n.styleMap)(t.cols)}>
    ${t.spalten.map((n,i)=>{if(t.imEditor)return e.html`<div
          class=${n.versteckt===!0?`versteckt`:e.nothing}
          role="cell"
        >${`—`}</div>`;let a=V(n,t.quelleId).art===`frei`;return e.html`<div role="cell">${Ye(t,r,i,t.plaetze[i],a)}</div>`})}
  </div>`}function V(e,t){let n=(e?.fuellFeld??``).trim(),r=n===``?(e?.feld??``).trim():n;if(r===``)return{art:`frei`,quelleId:``,code:``};let{quelleId:i,code:a}=(0,ee.zerlegeBindung)(r);return i===``?{art:`eigen`,quelleId:t,code:a}:{art:`verknuepft`,quelleId:i,code:a}}function H(e,t){return V(e.spalten[t],e.quelleId)}function Ze(e){let t=[];for(let n of e.spalten){let r=V(n,e.quelleId);r.art===`verknuepft`&&r.quelleId!==``&&(t.includes(r.quelleId)||t.push(r.quelleId))}return t}function Qe(e,t){let n=H(e,t);if(n.quelleId!==``&&n.code!==``)for(let r=0;r<e.spalten.length;r++){if(r===t)continue;let i=e.spalten[r],a=V(i,e.quelleId);if(a.quelleId===n.quelleId&&a.code!==``&&a.code!==n.code)return{titel:i.titel,code:a.code}}}function $e(e,t){let n=H(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=e.spalten[t]?.fensterSpalten;if(r!==void 0&&r.length>0)return r.map(e=>({...e}));let i=[];for(let t of e.spalten){let r=V(t,e.quelleId);r.quelleId===n.quelleId&&r.code!==``&&(i.some(e=>e.feld===r.code)||i.push({kennung:``,titel:t.titel,feld:r.code}))}return i}function et(e,t,n){let r=e.map(e=>({toField:e.toField,soll:t(e.fromField)})).filter(e=>e.soll!==void 0);return r.length===0?[...n]:n.filter(e=>r.every(t=>t.soll!==``&&t.soll===(0,l.getField)(e,t.toField)))}function U(e,t,n){let r=e.lauf.vorschlaege[n];r!==void 0&&(e.lauf.uebernimm(e.umfeld(),t,r.satz),e.melde())}function tt(e,t){let n=e.umfeld(),r=n.spalten[t],i=H(n,t);if(r===void 0||i.quelleId===``||i.code===``)return;let a=$e(n,t);Ke({el:e.baustein,quelleId:i.quelleId,speicherFeld:i.code,speicherTitel:r.titel,spalten:a,titel:r.titel,breite:r.fensterBreite??N(a.length),hoehe:r.fensterHoehe??380,eintraege:e.lauf.eintraege(n,t),rueckFokus:null,suchtext:e.lauf.wertVon(n,t),onUebernehmen:(n,r,i)=>{e.lauf.uebernimm(e.umfeld(),t,i),e.melde(),W(e,t,`Enter`)}})}function W(e,t,n){let r=e.umfeld();if(n===`Tab`){let n=e.lauf.nachbarPlatz(r,t,1);return n===-1?e.erfasseZeile():(e.fokussiere(n),!0)}let i=e.lauf.naechsteLeere(r,t);return i===-1?n===`Enter`&&e.erfasseZeile():e.fokussiere(i),!0}function nt(e,t,n){if(n.key===`Tab`&&n.shiftKey){let r=e.lauf.nachbarPlatz(e.umfeld(),t,-1);if(r===-1)return;n.preventDefault(),e.fokussiere(r),e.melde();return}let r=n.key===`ArrowDown`&&n.altKey?`F4`:n.key,i=e.lauf.entscheideTaste(e.umfeld(),t,r);if(i===`nichts`){n.key===`Enter`&&n.preventDefault();return}let a=!0;i===`uebernehmen`?(U(e,t,e.lauf.marke),a=W(e,t,n.key)):i===`fenster`?tt(e,t):i===`liste-auf`?e.lauf.oeffneListe(t):i===`weiter`?a=W(e,t,n.key):i===`leeren`&&e.lauf.leere(e.umfeld(),t),a&&n.preventDefault(),e.melde()}function rt(e,t,n,r){let i=e.umfeld();return Xe({spalten:r.spalten,plaetze:r.plaetze,quelleId:i.quelleId,cols:t,imEditor:e.baustein.hasAttribute(`data-ff-editor`),wert:t=>e.lauf.wertVon(i,t),automatisch:t=>e.lauf.istAutomatisch(i,t),tippSpalte:e.lauf.tippSpalte,vorschlaege:e.lauf.vorschlaege,marke:e.lauf.marke,listeNachOben:n},{tippen:(t,n)=>{e.lauf.tippe(t,n),e.melde()},taste:(t,n)=>nt(e,t,n),verlassen:t=>{e.lauf.verlasse(t),e.melde()},waehleVorschlag:t=>U(e,e.lauf.tippSpalte,t),setzeMarke:t=>{e.lauf.setzeMarke(t),e.melde()}})}var it=1,at=/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$|^-?\d+(,\d+)?$|^-?\d+(\.\d+)?$/,ot=/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/,st=/^(\d{4})-(\d{2})-(\d{2})$/;function G(e){let t=e.trim();if(t===``||!at.test(t))return null;let n=t.includes(`,`)?t.replace(/\./g,``).replace(`,`,`.`):/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t)?t.replace(/\./g,``):t,r=Number(n);return Number.isFinite(r)?r:null}function K(e){let t=e.trim();if(t===``)return null;let n=st.exec(t);if(n){let[,e,t,r]=n;return ct(Number(e),Number(t),Number(r))}let r=ot.exec(t);if(r){let[,e,t,n]=r,i=Number(n);return ct(n.length===2?i<=69?2e3+i:1900+i:i,Number(t),Number(e))}return null}function ct(e,t,n){if(t<1||t>12||n<1||n>31)return null;let r=new Date(e,t-1,n);return r.getFullYear()!==e||r.getMonth()!==t-1||r.getDate()!==n?null:r.getTime()}function lt(e){let t=0,n=0,r=0;for(let i of e)i.trim()!==``&&(t++,G(i)!==null&&n++,K(i)!==null&&r++);return t===0?`text`:r===t?`datum`:n===t?`zahl`:`text`}var ut=new Intl.Collator(`de`,{numeric:!0,sensitivity:`base`});function dt(e,t,n){if(t<0||e.length===0)return e.map((e,t)=>t);let r=n=>e[n][t]??``,i=lt(e.map(e=>e[t]??``)),a=n?1:-1;return e.map((e,t)=>t).sort((e,t)=>{let n=r(e).trim(),o=r(t).trim();if(n===``&&o===``)return e-t;if(n===``)return it;if(o===``)return-1;let s=i===`zahl`?(G(n)??0)-(G(o)??0):i===`datum`?(K(n)??0)-(K(o)??0):ut.compare(n,o);return s===0?e-t:s*a})}var ft=`ff_sortierung_`,q=new Map;function pt(e){let t=typeof document>`u`?``:document.title,n=e.getAttribute(_.ACTION_VALUE_ID_ATTR);if(n!==null&&n!==``)return`${ft}${t}|${n}`;let r=Array.from(e.ownerDocument?.querySelectorAll(e.tagName)??[]);return`${ft}${t}|#${Math.max(0,r.indexOf(e))}`}function mt(e){if(q.has(e))return q.get(e)??null;try{let t=localStorage.getItem(e);return t===null?null:ht(JSON.parse(t))}catch{return null}}function ht(e){if(typeof e!=`object`||!e)return null;let t=e,n=typeof t.kennung==`string`?t.kennung.trim():``;return n===``?null:{kennung:n,auf:t.auf!==!1}}function gt(e,t){q.set(e,t);try{t===null?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(t))}catch{}}function _t(e,t,n){let r=0,i=0;for(let t of e){let e=G(t);e!==null&&(r+=e,i++)}return i===0?``:r.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:n})}var vt={min:0,max:3},yt=class{constructor(){this.getippt=new Map,this.gewaehlt=new Map,this.vonHand=new Set,this._tippSpalte=-1,this._marke=0,this._listeZu=!1,this._listeAuf=-1,this._markeVonHand=!1,this._gerechnet=null,this._vorschlaege=[]}get tippSpalte(){return this._tippSpalte}get marke(){return this._marke}get vorschlaege(){return this._vorschlaege}wertVon(e,t){let n=this.getippt.get(t);if(n!==void 0&&n!==``)return n;if(this._gerechnet?.index===t)return this._gerechnet.wert;if(n!==void 0)return n;let r=H(e,t);if(r.quelleId===``||r.code===``)return``;let i=this.gewaehlt.get(r.quelleId);return i===void 0?``:(0,l.getField)(i,r.code)}gegebeneZahl(e,t){let n=this.getippt.get(t);if(n!==void 0){if(n.trim()===``)return null;let e=(0,i.zahlStreng)(n);return e===null?`fehler`:e}let r=H(e,t);if(r.quelleId===``||r.code===``)return null;let a=this.gewaehlt.get(r.quelleId);if(a===void 0)return null;let o=(0,l.getField)(a,r.code).trim();if(o===``)return null;let s=G(o);return s===null?`fehler`:s}rechne(e){this._gerechnet=null;let t=e.rechnung;if(!t)return;let n={},r={},a=new Set;for(let o of i.PLATZ_KEYS){let i=se(e.spalten,t[o].spalte);r[o]=i,n[o]=i===-1?null:this.gegebeneZahl(e,i),i!==-1&&a.add(o)}let o=(0,i.loeseRechnung)(t,n,a);o&&(this._gerechnet={index:r[o.platz],wert:(0,i.platzText)(o.wert,t[o.platz].runden.stellen)})}tippe(e,t){this.getippt.set(e,t),this._tippSpalte=e,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}verlasse(e){this._tippSpalte===e&&(this._tippSpalte=-1,this._listeZu=!1,this._listeAuf=-1,this._marke=0,this._markeVonHand=!1)}istAutomatisch(e,t){return!this.getippt.has(t)&&this.wertVon(e,t)!==``}entscheideTaste(e,t,n){let r=this._tippSpalte===t&&this._vorschlaege.length>0;if(n===`Tab`){if(r&&(this._markeVonHand||this._vorschlaege.length===1))n=`Enter`;else return`weiter`}if(n===`F4`)return H(e,t).art===`frei`||this.eintraege(e,t).length===0?`nichts`:`fenster`;let i=this.wertVon(e,t);if(n===`Escape`&&!r)return i===``?`nichts`:`leeren`;if(H(e,t).art===`frei`)return n===`Enter`?`weiter`:`nichts`;if(n===`ArrowDown`&&!r)return H(e,t).art===`verknuepft`?`liste-auf`:`nichts`;let a=(0,c.tastenFolge)(n,{listeOffen:r,feldLeer:i===``,treffer:this._vorschlaege.length,markeVonHand:this._markeVonHand});if(a===`marke-hoch`||a===`marke-runter`){let e=a===`marke-hoch`?-1:1;this._marke=(0,c.bewegteMarke)(this._marke,this._vorschlaege.length,e),this._markeVonHand=!0}else if(a===`liste-zu`)this._listeZu=!0,this._listeAuf=-1;else if(a===`fenster`&&i===``)return`weiter`;else if(a===`fenster`&&this.eintraege(e,t).length===0)return`weiter`;else if(a===`nichts`&&n===`Enter`&&i!==``&&(this.getippt.get(t)===void 0||H(e,t).art!==`verknuepft`))return`weiter`;return a}oeffneListe(e){this._tippSpalte=e,this._listeZu=!1,this._listeAuf=e,this._marke=0,this._markeVonHand=!0}naechsteLeere(e,t){for(let n=t+1;n<e.spalten.length;n++)if(e.spalten[n]?.versteckt!==!0&&this.wertVon(e,n)===``)return n;return-1}nachbarPlatz(e,t,n){for(let r=t+n;r>=0&&r<e.spalten.length;r+=n)if(e.spalten[r]?.versteckt!==!0)return r;return-1}leere(e,t){this.getippt.delete(t);let n=H(e,t);n.quelleId!==``&&this.gewaehlt.has(n.quelleId)&&this.setze(e,n.quelleId,void 0),this._listeZu=!1,this._marke=0,this._markeVonHand=!1}setzeMarke(e){this._marke=e}uebernimm(e,t,n){let r=H(e,t);if(r.quelleId!==``){if(this.setze(e,r.quelleId,n),this.vonHand.add(r.quelleId),r.art===`eigen`)for(let t of[...this.gewaehlt.keys()])t!==r.quelleId&&this.setze(e,t,void 0);this.gleicheAb(e),this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}}setze(e,t,n){n===void 0?(this.gewaehlt.delete(t),this.vonHand.delete(t)):this.gewaehlt.set(t,n);for(let n=0;n<e.spalten.length;n++)V(e.spalten[n],e.quelleId).quelleId===t&&this.getippt.delete(n)}schluesselWert(e,t,n,r){if(t!==``&&t!==e.quelleId){let e=this.gewaehlt.get(t);return e===void 0?void 0:(0,l.getField)(e,n)}let i=this.gewaehlt.get(e.quelleId);if(i!==void 0)return(0,l.getField)(i,n);for(let t of Ze(e)){if(t===r||!this.vonHand.has(t))continue;let i=e.partnerVon(t);if(i!==``&&i!==e.quelleId)continue;let a=this.gewaehlt.get(t);if(a!==void 0)for(let r of e.paareZu(t)){if(r.fromField!==n)continue;let e=(0,l.getField)(a,r.toField);if(e!==``)return e}}}moegliche(e,t,n){let r=e.partnerVon(t);return et(e.paareZu(t),n=>this.schluesselWert(e,r,n,t),n)}gleicheAb(e){let t=Ze(e);for(let n=0;n<=t.length;n++){let n=!1;for(let r of t){let t=e.paareZu(r);if(t.length===0)continue;let i=e.partnerVon(r),a=this.gewaehlt.get(r);if(a!==void 0){t.every(t=>{let n=this.schluesselWert(e,i,t.fromField,r);return n===void 0||n!==``&&n===(0,l.getField)(a,t.toField)})||(this.setze(e,r,void 0),n=!0);continue}if(!t.some(t=>this.schluesselWert(e,i,t.fromField,r)!==void 0))continue;let o=I(r);if(o===null)continue;let s=this.moegliche(e,r,o);s.length===1&&(this.setze(e,r,s[0]),this.vonHand.delete(r),n=!0)}if(!n)break}}uebernimmWerte(e,t){this.zuruecksetzen(),t.forEach((e,t)=>{e!==``&&this.getippt.set(t,e)}),this.gibDemGerechnetenPlatzSeineLuecke(e),this.rechne(e)}gibDemGerechnetenPlatzSeineLuecke(e){let t=e.rechnung;if(t)for(let n of i.PLATZ_KEYS){let r=se(e.spalten,t[n].spalte);if(r===-1)continue;let i=this.getippt.get(r);if(i!==void 0&&i!==``){if(this.getippt.delete(r),this.rechne(e),this._gerechnet?.index===r&&this._gerechnet.wert===i)return;this.getippt.set(r,i)}}}zuruecksetzen(){this.getippt.clear(),this.gewaehlt.clear(),this.vonHand.clear(),this._gerechnet=null,this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1,this._listeAuf=-1,this._vorschlaege=[]}aktualisiereVorschlaege(e){this.rechne(e),this._vorschlaege=this.berechne(e),this._marke=(0,c.gueltigeMarke)(this._marke,this._vorschlaege.length)}berechne(e){let t=this._tippSpalte;if(this._listeZu||H(e,t).art===`frei`)return[];let n=this.getippt.get(t)??``;return n===``?this._listeAuf===t?this.eintraege(e,t).slice(0,c.VORSCHLAEGE_MAX):[]:(0,c.passendeVorschlaege)(this.eintraege(e,t),n)}eintraege(e,t){let n=H(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=I(n.quelleId);return r===null?[]:F(this.moegliche(e,n.quelleId,r),Qe(e,t)?.code??``,n.code)}},bt=class{constructor(){this.lauf=new yt,this._zeilen=[],this.naechsteKennung=1,this._zurueck=null}get korrekturPlatz(){return this._zurueck===null?null:this._zurueck.platz}get zeilen(){return this._zeilen.map(e=>e.werte)}get obenKennung(){return`e${this.naechsteKennung}`}vormerkungen(e){let t=this._zeilen.filter(e=>e.geschrieben!==!0).map(e=>({kennung:e.kennung,werte:e.werte})),n=e.spalten.map((t,n)=>this.lauf.wertVon(e,n));if(n.every(e=>e===``))return t;let r=this._zurueck;if(!r)return[...t,{kennung:this.obenKennung,werte:n}];let i=this._zeilen.slice(0,r.platz).filter(e=>e.geschrieben!==!0).length;return[...t.slice(0,i),{kennung:r.kennung,werte:n},...t.slice(i)]}istGeschrieben(e){return this._zeilen[e]?.geschrieben===!0}get schluessel(){return this._zeilen.map(e=>e.kennung)}umfeld(e,t,n,r=null){let i=(0,te.verknuepfungenVon)(e);return{spalten:t,quelleId:n,paareZu:e=>i.find(t=>t.quelleId===e)?.keyPairs??[],partnerVon:e=>i.find(t=>t.quelleId===e)?.partnerId??``,rechnung:r}}erfasse(e){this.lauf.rechne(e);let t=e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),n=this._zurueck;return t.every(e=>e===``)?n?(this._zurueck=null,this.lauf.zuruecksetzen(),!0):!1:(n?(this._zeilen=[...this._zeilen.slice(0,n.platz),{kennung:n.kennung,werte:t},...this._zeilen.slice(n.platz)],this._zurueck=null):(this._zeilen=[...this._zeilen,{kennung:this.obenKennung,werte:t}],this.naechsteKennung+=1),this.lauf.zuruecksetzen(),!0)}zurueckholen(e,t){let n=this._zeilen[t];if(!n||n.geschrieben===!0)return!1;this.erfasse(e);let r=this._zeilen.indexOf(n);return r!==-1&&(this._zeilen=this._zeilen.filter((e,t)=>t!==r),this._zurueck={kennung:n.kennung,platz:r},this.lauf.uebernimmWerte(e,n.werte),!0)}entferne(e){return e<0||e>=this._zeilen.length?!1:(this._zeilen=this._zeilen.filter((t,n)=>n!==e),this._zurueck!==null&&e<this._zurueck.platz&&(this._zurueck={...this._zurueck,platz:this._zurueck.platz-1}),!0)}markiereGeschrieben(e,t){if(t.length===0)return!1;let n=!1;this._zeilen=this._zeilen.map(e=>e.geschrieben===!0||!t.includes(e.kennung)?e:(n=!0,{...e,geschrieben:!0}));let r=this._zurueck;if(r!==null&&t.includes(r.kennung))this._zeilen=[...this._zeilen.slice(0,r.platz),{kennung:r.kennung,werte:e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),geschrieben:!0},...this._zeilen.slice(r.platz)],this._zurueck=null,this.lauf.zuruecksetzen(),n=!0;else if(r===null&&t.includes(this.obenKennung)){let t=e.spalten.map((t,n)=>this.lauf.wertVon(e,n));t.every(e=>e===``)||(this._zeilen=[...this._zeilen,{kennung:this.obenKennung,werte:t,geschrieben:!0}],this.naechsteKennung+=1,this.lauf.zuruecksetzen(),n=!0)}return n}vergissGeschriebene(){let e=this._zeilen.filter(e=>e.geschrieben!==!0);return e.length!==this._zeilen.length&&(this._zeilen=e,!0)}zuruecksetzen(){this._zeilen=[],this._zurueck=null,this.lauf.zuruecksetzen()}},xt=class{constructor(e){this.aenderungen=new St,this.geloescht=new Set,this.wirt=e}get geaenderteZeilen(){if(this.aenderungen.anzahl===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let{satz:r}of this.aenderungen.proSatz()){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}get geloeschteZeilen(){if(this.geloescht.size===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let r of this.geloescht){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}austragen(e,t){let n=!1;for(let r of t)n=e===`geaendert`?this.aenderungen.nimmSatzZurueck(r)||n:this.geloescht.delete(r)||n;n&&this.wirt.melde()}vorgemerkteAenderungen(){return this.geaenderteZeilen.length}vorgemerkteLoeschungen(){return this.geloeschteZeilen.length}statusVon(e){let t=this.satzVon(e);if(t===``)return{status:`gebucht`,titel:``};if(this.geloescht.has(t))return this.wirt.lauf.zeigt(`geloescht`,t,`loeschung`);let n=this.wirt.spalten().some((e,n)=>this.aenderungen.wert(t,n)!==void 0);return this.wirt.lauf.zeigt(`geaendert`,t,n?`geaendert`:`gebucht`)}satzPlaetze(){let e=new Map;return this.wirt.rohzeilen().forEach((t,n)=>{let r=D(this.wirt.baustein,t);r!==``&&!e.has(r)&&e.set(r,n)}),e}satzVon(e){let t=this.wirt.rohzeilen()[e];return t===void 0?``:D(this.wirt.baustein,t)}schalteLoeschung(e){let t=this.satzVon(e);t!==``&&(this.geloescht.has(t)?this.geloescht.delete(t):(this.geloescht.add(t),this.wirt.spalten().forEach((e,n)=>{this.aenderungen.nimmZurueck(t,n)})),this.wirt.melde())}istGeloescht(e){let t=this.satzVon(e);return t!==``&&this.geloescht.has(t)}zellWert(e,t){let n=this.aenderungen.wert(this.satzVon(e),t);return n===void 0?this.wirt.datenzeilen()[e]?.[t]??``:n}istGeaendert(e,t){return this.aenderungen.wert(this.satzVon(e),t)!==void 0}tippeZelle(e,t,n){this.aenderungen.setze(this.satzVon(e),t,n)&&this.wirt.melde()}verlasseZelle(e,t,n){let r=this.satzVon(e);(n===(this.wirt.datenzeilen()[e]?.[t]??``)?this.aenderungen.nimmZurueck(r,t):this.aenderungen.setze(r,t,n))&&this.wirt.melde()}zelleNachbar(e,t,n,r){let i=Array.from(this.wirt.baustein.shadowRoot?.querySelectorAll(`.koerper > .zeile:not(.erfassung) .zell-eingabe[data-spalte="${e}"]`)??[]),a=i.indexOf(t);if(a<0)return;let o=a+n;if(o>i.length-1){if(r&&this.wirt.erfassungAn()){this.wirt.fokussiereErfassungsZelle(0);return}o=i.length-1}o<0&&(o=0);let s=i[o];s&&s!==t&&(s.focus(),s.select(),s.scrollIntoView({block:`nearest`}))}tasteZelle(e,t,n){let r=n.target;if(n.key===`Escape`){n.preventDefault(),n.stopPropagation(),this.aenderungen.nimmZurueck(this.satzVon(e),t)&&this.wirt.melde();return}let i={Enter:1,ArrowDown:1,ArrowUp:-1,PageDown:10,PageUp:-10}[n.key];i!==void 0&&(n.preventDefault(),n.stopPropagation(),this.zelleNachbar(t,r,i,n.key===`Enter`))}},J=`\0`;function Y(e,t){return e+J+String(t)}var St=class{constructor(){this.werte=new Map}setze(e,t,n){if(e===``)return!1;let r=Y(e,t);return this.werte.get(r)!==n&&(this.werte.set(r,n),!0)}nimmZurueck(e,t){return this.werte.delete(Y(e,t))}wert(e,t){return e===``?void 0:this.werte.get(Y(e,t))}get anzahl(){return this.werte.size}proSatz(){let e=[];for(let[t,n]of this.werte){let[r,i]=t.split(J),a=Number(i),o=e.find(e=>e.satz===r),s={satz:r,spalte:a,wert:n};o?o.aenderungen.push(s):e.push({satz:r,aenderungen:[s]})}return e}nimmSatzZurueck(e){let t=!1;for(let n of[...this.werte.keys()])n.slice(0,n.indexOf(J))===e&&this.werte.delete(n)&&(t=!0);return t}},X={gebucht:``,erfasst:`Neue Zeile — noch nicht geschrieben`,geaendert:`Geändert — noch nicht geschrieben`,loeschung:`Zum Löschen vorgemerkt — noch nicht geschrieben`,schreibt:`Wird geschrieben …`,geschrieben:`Hinausgeschickt — bleibt stehen, bis neue Daten kommen`,fehler:`Nicht geschrieben`},Ct=class{constructor(e){this.schreibend=new Map,this.fehler=new Map,this.melde=e}schreibt(e,t){this.fehler.get(e)?.delete(t);let n=this.schreibend.get(e)??new Set;n.add(t),this.schreibend.set(e,n),this.melde()}gescheitert(e,t,n){this.schreibend.get(e)?.delete(t);let r=this.fehler.get(e)??new Map;r.set(t,n),this.fehler.set(e,r),this.melde()}fertig(e,t){this.schreibend.get(e)?.clear();let n=this.fehler.get(e);if(n)for(let e of t)n.delete(e);this.melde()}zeigt(e,t,n){let r=this.fehler.get(e)?.get(t);return r===void 0?this.schreibend.get(e)?.has(t)===!0?{status:`schreibt`,titel:X.schreibt}:{status:n,titel:X[n]}:{status:`fehler`,titel:X.fehler+`: `+r}}},wt=4;function Tt(e){return e??wt}function Et(e,t,n){return Math.max(1,Math.floor((e-t)/n))}function Dt(e,t,n){let r=Et(e,t,n),i=e-t;return i<n?{passen:r,zeilenHoehe:n}:{passen:r,zeilenHoehe:Math.floor(i/r*100)/100}}function Ot(e,t){return e===null?null:Math.max(0,e-t)}function kt({sichtbar:e,hatQuelle:t,platzhalterZeilen:n}){return t?{seiten:1,seite:0,zeilen:[...e]}:{seiten:1,seite:0,zeilen:Array.from({length:n},()=>null)}}function At({sichtbar:e,hatQuelle:t,proSeite:n,wunschSeite:r,platzhalterZeilen:i}){let a=t?Math.max(1,Math.ceil(e.length/n)):1,o=Math.min(Math.max(r,0),a-1);return t?{seiten:a,seite:o,zeilen:[...e.slice(o*n,(o+1)*n)]}:{seiten:a,seite:o,zeilen:Array.from({length:i},()=>null)}}function jt(e){if(!e.hasAttribute(`fuellt`))return-1;let t=e.renderRoot.querySelector(`.koerper`);return t instanceof HTMLElement?t.clientHeight:-1}function Mt(e){let t=e.renderRoot.querySelector(`.kopf`);return t instanceof HTMLElement?t.offsetHeight:0}function Nt(e,t){let n=jt(e);if(n===-1)return{mass:null,hoehe:n,kopf:0};let r=Mt(e);return{mass:Dt(n,r,t),hoehe:n,kopf:r}}function Pt(e,t){if(typeof ResizeObserver>`u`)return null;let n=e.renderRoot.querySelector(`.koerper`);if(!n)return null;let r=new ResizeObserver(t);return r.observe(n),r}var Ft=class{constructor(e){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._gemerkteGelesen=!1,this._seite=0,this._mass=null,this._beobachter=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0,this._fokusZeile=null,this._fokusHolen=!1,this.wirt=e}get suchtext(){return this._suchtext}get suchtAktiv(){return this._suchtext.trim()!==``}holeGemerkte(){if(this._gemerkteGelesen||(this._gemerkteGelesen=!0,!this.wirt.merktSortierung()))return;let e=mt(pt(this.wirt.baustein));if(e===null)return;let t=this.wirt.spalten().findIndex(t=>t.kennung===e.kennung);t<0||(this._sortSpalte=t,this._sortAuf=e.auf)}merkeSortierung(){if(!this.wirt.merktSortierung())return;let e=this.wirt.spalten()[this._sortSpalte]?.kennung??``;gt(pt(this.wirt.baustein),this._sortSpalte<0||e===``?null:{kennung:e,auf:this._sortAuf})}get sortSpalte(){return this.holeGemerkte(),this._sortSpalte}get sortAuf(){return this.holeGemerkte(),this._sortAuf}get seite(){return this._seite}get mass(){return this._mass}setzeSuchtext(e){this.merkeZeilenFokus(),this._suchtext=e,this._seite=0,this.wirt.melde()}klickSortiere(e){this.wirt.editable()||(this.merkeZeilenFokus(),this.holeGemerkte(),this._sortSpalte===e?this._sortAuf=!this._sortAuf:(this._sortSpalte=e,this._sortAuf=!0),this._seite=0,this.merkeSortierung(),this.wirt.melde())}blaettere(e){this.merkeZeilenFokus(),this._seite=e,this.wirt.melde()}fokussiereSuche(){let e=this.wirt.baustein.shadowRoot?.querySelector(`.suchzeile input`);return e?(e.focus(),!0):!1}merkeZeilenFokus(){let e=we(this.wirt.baustein.shadowRoot);this._fokusHolen=e!==void 0,this._fokusZeile=e??null}messeRumpf(){let e=this.wirt.zeilenHoehe();this._taktGemessen=e;let{mass:t,hoehe:n,kopf:r}=Nt(this.wirt.baustein,e);this._rumpfGemessen=n,this._kopfGemessen=r,(t?.passen!==this._mass?.passen||t?.zeilenHoehe!==this._mass?.zeilenHoehe)&&(this._mass=t,this.wirt.melde())}beobachte(){this._beobachter||(this._beobachter=Pt(this.wirt.baustein,()=>this.messeRumpf()),this._beobachter&&this.messeRumpf())}nachRendern(){(this._taktGemessen!==this.wirt.zeilenHoehe()||this._rumpfGemessen!==jt(this.wirt.baustein)||this._kopfGemessen!==Mt(this.wirt.baustein))&&this.messeRumpf(),this._fokusHolen&&(this._fokusHolen=!1,Oe(this.wirt.baustein.shadowRoot,this._fokusZeile))}loese(){this._beobachter?.disconnect(),this._beobachter=null}nachPush(){this._seite=0,this._mass=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0}zuruecksetzen(){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._gemerkteGelesen=!0,this.merkeSortierung(),this.nachPush(),this._fokusZeile=null,this._fokusHolen=!1}};function It(e,t,n){let r=40-e,i=t-40,a=r>i?0:Math.min(i,Math.max(r,Math.round(n)));return{links:Math.round(e+a),rechts:Math.round(t-a)}}function Lt(e,t,n){if(e.button!==0)return;let r=[...e.currentTarget?.parentElement?.children??[]].filter(e=>e instanceof HTMLElement&&e.tagName===`DIV`),i=r[t],a=r[t+1];if(!i||!a)return;e.stopPropagation(),e.preventDefault();let o=e.clientX,s=i.getBoundingClientRect().width,c=a.getBoundingClientRect().width,l=It(s,c,0),u=()=>{window.removeEventListener(`pointermove`,p),window.removeEventListener(`pointerup`,m),window.removeEventListener(`pointercancel`,h),window.removeEventListener(`keydown`,g),window.removeEventListener(`blur`,h)},d=r.map(e=>Math.max(1,Math.round(e.getBoundingClientRect().width))),f=()=>d.map((e,n)=>n===t?{index:n,breite:l.links}:n===t+1?{index:n,breite:l.rechts}:{index:n,breite:e});function p(e){l=It(s,c,e.clientX-o),n.zeige(f())}function m(){u(),n.uebernimm(f())}function h(){u(),n.verwirf()}function g(e){e.key===`Escape`&&(e.preventDefault(),h())}window.addEventListener(`pointermove`,p),window.addEventListener(`pointerup`,m),window.addEventListener(`pointercancel`,h),window.addEventListener(`keydown`,g),window.addEventListener(`blur`,h)}function Rt(t,n){return Array.from({length:Math.max(0,t-1)},(t,r)=>e.html`<span
    class="breite-griff"
    role="presentation"
    style="grid-row: 1; grid-column: ${r+1}"
    title="Linie ziehen: links breiter, rechts schmaler"
    @pointerdown=${e=>Lt(e,r,n)}
    @click=${e=>e.stopPropagation()}
    @dblclick=${e=>e.stopPropagation()}
  ></span>`)}var zt=class{constructor(e){this._breiten=new Map,this._vorZug=null,this.wirt=e}breiteVon(e){return this._breiten.get(e)}vergessen(){this._breiten.clear()}voll(e){return e.map(e=>({index:this.wirt.vollerPlatz(e.index),breite:e.breite}))}wirtFuerZug(){return{zeige:e=>{let t=this.voll(e);this._vorZug===null&&(this._vorZug=new Map(t.map(e=>[e.index,this._breiten.get(e.index)])));for(let e of t)this._breiten.set(e.index,e.breite);this.wirt.melde()},uebernimm:e=>{let t=this.voll(e);if(this._vorZug=null,!this.wirt.imEditor()){for(let e of t)this._breiten.set(e.index,e.breite);this.wirt.melde();return}let n=this.wirt.spaltenListe();for(let e of t)e.index>=n.length||(this._breiten.delete(e.index),n[e.index]={...n[e.index],breite:e.breite});this.wirt.schreibeSpalten(n)},verwirf:()=>{let e=this._vorZug;if(this._vorZug=null,e){for(let[t,n]of e)n===void 0?this._breiten.delete(t):this._breiten.set(t,n);this.wirt.melde()}}}}},Bt=`ff_spaltenwahl_`,Vt=new Map;function Ht(e){let t=typeof document>`u`?``:document.title,n=e.getAttribute(_.ACTION_VALUE_ID_ATTR);if(n!==null&&n!==``)return`${Bt}${t}|${n}`;let r=Array.from(e.ownerDocument?.querySelectorAll(e.tagName)??[]);return`${Bt}${t}|#${Math.max(0,r.indexOf(e))}`}function Ut(e){let t=Vt.get(e);if(t)return new Set(t);try{let t=localStorage.getItem(e);if(t===null)return new Set;let n=JSON.parse(t);return Array.isArray(n)?new Set(n.filter(e=>typeof e==`string`)):new Set}catch{return new Set}}function Wt(e,t){let n=[...t];Vt.set(e,n);try{n.length===0?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(n))}catch{}}function Gt(t,n){if(t===null)return e.nothing;let r=t.waehlbar.filter(e=>!t.weg.has(e.kennung)).length;return e.html`<div class="sw-schirm" @pointerdown=${n.schliesse}></div>
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
    </div>`}var Kt=new Set,qt=class{constructor(e){this._weg=null,this._offen=null,this.nimmTaste=e=>{e.key===`Escape`&&this.schliesse()},this.wirt=e}get offen(){return this._offen}weg(){return this.wirt.an()?(this._weg===null&&(this._weg=Ut(Ht(this.wirt.baustein))),this._weg):Kt}oeffne(e,t){e.preventDefault(),e.stopPropagation(),this._offen={links:Math.max(4,Math.min(e.clientX-t.left,Math.max(4,t.width-170))),oben:Math.max(4,Math.min(e.clientY-t.top,Math.max(4,t.height-60)))},window.addEventListener(`keydown`,this.nimmTaste),this.wirt.melde()}schliesse(){this._offen!==null&&(this._offen=null,window.removeEventListener(`keydown`,this.nimmTaste),this.wirt.melde())}schalte(e){let t=new Set(this.weg());t.has(e)?t.delete(e):t.add(e),this.merke(t)}alleZeigen(){this.merke(new Set)}merke(e){this._weg=e,Wt(Ht(this.wirt.baustein),e),this.wirt.breitenVergessen(),this.wirt.melde()}loese(){window.removeEventListener(`keydown`,this.nimmTaste),this._offen=null}};function Jt(e,t){let n=[];return e.spalten.forEach((r,i)=>{if(r.summe!==!0)return;let a=_t(t.map(t=>e.wertVon(t,i)),vt.min,vt.max);a!==``&&n.push({titel:r.titel,text:a})}),n}function Yt(e){return e.datenzeilen.map((t,n)=>e.spalten.map((t,r)=>e.wertVon(n,r)))}function Xt(e){let t=Yt(e),n=Qt(t,e.suchtext);return e.sortSpalte<0?n:dt(n.map(e=>t[e]),e.sortSpalte,e.sortAuf).map(e=>n[e])}function Zt(e){let t=e.gezeichnet??e.spalten,n=e.plaetze??t.map((e,t)=>t),r={gridTemplateColumns:pe(t,t=>e.breiteVon?.(n[t]??t))},i=e.gemessen?.zeilenHoehe??28,a=e.hatQuelle,o=!e.erfassungAn&&en(a,e.datenGeliefert,e.datenzeilen.length),s=Xt(e),c=e.erfassungAn?1+e.erfassteAnzahl:0,l=e.gemessen===null?null:Math.max(1,e.gemessen.passen-c),u={sichtbar:s,hatQuelle:a,proSeite:l??Math.max(1,10-c),wunschSeite:e.wunschSeite,platzhalterZeilen:Tt(l)},{seiten:d,seite:f,zeilen:p}=e.blaettert?At(u):kt(u);return{cols:r,takt:28,zeilenHoehe:i,hatQuelle:a,leer:o,gesamt:s.length,seiten:d,seite:f,zeilen:p,linealTakte:Ot(l,p.length),summen:Jt(e,s)}}function Qt(e,t){let n=[];return e.forEach((e,r)=>{(0,ne.zeilePasst)(e,t)&&n.push(r)}),n}function $t(e,t){return!e&&t.trim()!==``}function en(e,t,n){return e&&t&&n===0}function tn(e){if(!e.hatQuelle)return`— Datensätze`;let t=e.auswahlAktiv?` · durch Auswahl gefiltert`:``,n=e=>e===1?`Datensatz`:`Datensätze`,r=e=>e===1?`Datensatz`:`Datensätzen`;return e.suchtAktiv?e.sichtbar===0?`Kein Treffer von ${e.gesamt} ${r(e.gesamt)}`+t:`${e.sichtbar} von ${e.gesamt} ${r(e.gesamt)}`+t:(e.gesamt===0?`Keine Datensätze`:`${e.gesamt} ${n(e.gesamt)}`)+t}var nn=[(0,y.jaNeinProperty)(`tabelleAnsicht`,`Suchzeile`,`Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.`,{requiresDataSource:!0}),(0,y.jaNeinProperty)(`erfassung`,`Erfassungszeile`,`Eine leere Zeile zum Tippen neuer Positionen.`),(0,y.jaNeinProperty)(`loeschbar`,`Zeilen löschbar`,`Kreuz an jeder Zeile: merkt sie zum Löschen vor.`,{requiresDataSource:!0}),(0,y.jaNeinProperty)(`blaettern`,`Blättern`,`Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.`),(0,y.jaNeinProperty)(`kopfzeile`,`Kopfzeile`,`Aus: keine Titelzeile, kein Sortieren per Titelklick.`),(0,y.jaNeinProperty)(`spaltenwahl`,`Spaltenwahl`,`In der Maske: Rechtsklick auf eine Spaltenüberschrift nimmt Spalten weg und holt sie zurück. Braucht die Kopfzeile.`),{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.`,kind:`field`},(0,s.leerTextProperty)()],Z={prop:`spalten`,titelKey:`titel`,feldKey:`feld`,kennungKey:`kennung`,standardTitel:x,eintragNeu:e=>{let t=E(e.spalten);return t.length>=16?{}:{spalten:me(t)}},eintragWeg:(e,t)=>{let n=E(e.spalten),r=ge(n,t);if(r===n)return{};let i=he(e.rechnung,n,r);return{spalten:[...r],...i===null?{}:{rechnung:i}}},eintragVerschieben:(e,t,n)=>{let r=E(e.spalten),i=_e(r,t,n);return i===r?{}:{spalten:[...i]}},eintragsUnterFenster:{label:`Suchfenster…`,hinweis:`Ohne Einstellung nimmt es die Spalten derselben Hilfsquelle.`,eigenschaft:`fensterDialogIndex`},eintragStellen:`[data-ff-eintrag]`,eintragsSchalter:[{key:`summe`,label:`Summe in der Fußzeile`,kurz:`Summe`},{key:`aenderbar`,label:`In der Zeile änderbar`,kurz:`änderbar`,standard:!0,nurEigeneQuelle:!0},{key:`versteckt`,label:`In der Maske ausblenden`,kurz:`ausgeblendet`}],herkunftProp:`spaltenHerkunft`,eintragsFeldWahl:[{key:`fuellFeld`,label:`Nachschlagen`,hinweis:`Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.`,nurFremdeQuellen:!0}]};function rn(e){let t=e,n=Z.eintragsSchalter?.find(e=>e.key===`aenderbar`);return n!==void 0&&e.feld!==``&&(0,p.schalterFuer)(Z,t).includes(n)&&(0,p.schalterAn)(n,t)}function an(t){if(t.linealTakte===0)return e.nothing;let r=t.linealTakte===null?t.cols:{...t.cols,flex:`0 1 auto`,height:`calc(var(--zeilen-hoehe) * ${t.linealTakte})`};return e.html`<div class="lineal" role="presentation" style=${(0,n.styleMap)(r)}>
          ${t.spalten.map(()=>e.html`<div></div>`)}
        </div>`}function on(t,r){return e.html`
      ${t.zeigeSuche?e.html`<div class="suchzeile">
        <input
          type="search"
          placeholder="Tabelle durchsuchen…"
          aria-label="Tabelle durchsuchen"
          .value=${t.suchtext}
          @input=${e=>r.setzeSuchtext(e.target.value)}
          @keydown=${e=>{e.key===`ArrowDown`&&Ee(e.target)&&e.preventDefault()}}
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
        ${Rt(t.spalten.length,r.breiten)}
      </div>`:e.nothing}
        ${``}
        ${t.leer?(0,s.leerZustand)(t.leerText,!0):e.html`
        ${t.hatQuelle||t.korrekturPlatz!==null?e.nothing:t.erfassung}
        ${t.zeilen.map((i,a)=>{let o=i!==null&&!t.imEditor,s=i!==null&&t.zeilenStand.istGeloescht(i),c=i===null?{status:`gebucht`,titel:``}:t.zeilenStand.statusVon(i);return e.html`<div
            class="zeile${a%2==1?` zebra`:``}${i!==null&&t.hatQuelle?` waehlbar`:``}${i!==null&&i===t.auswahlIndex?` gewaehlt`:``}${s?` geloescht`:``}"
            role="row"
            data-status=${c.status===`gebucht`?e.nothing:c.status}
            title=${c.titel===``?e.nothing:c.titel}
            data-ff-roh=${i??e.nothing}
            tabindex=${o?`0`:e.nothing}
            aria-selected=${t.auswahlSemantik&&i!==null?String(i===t.auswahlIndex):e.nothing}
            style=${(0,n.styleMap)(t.cols)}
            @click=${()=>{r.aktiviereZeile(i,a)}}
            @dblclick=${e=>{e.target.closest(`.zell-eingabe`)||r.zeileDoppelt(i)}}
            @keydown=${e=>{if(!e.target.closest(`.zell-eingabe, button`)){if(e.key===`ArrowDown`||e.key===`ArrowUp`){let t=e.key===`ArrowUp`;(Te(e.target,t?-1:1)||t&&De(e.target))&&e.preventDefault();return}if(e.key===`Delete`&&t.loeschbar&&i!==null&&!t.imEditor){e.preventDefault(),r.schalteLoeschung(i);return}e.key===`Enter`&&(e.preventDefault(),r.aktiviereZeile(i,a))}}}
          >
            ${``}
            ${t.spalten.map((n,r)=>{let o=t.plaetze[r],s=i===null?`—`:t.datenzeilen[i]?.[o]??``,l=t.imEditor&&!t.zeigeKopf&&t.editable;if(t.aendernMoeglich&&i!==null&&rn(n)){let r=t.zeilenStand;return e.html`<div class="tippbar" role="cell">
                <input
                  class=${r.istGeaendert(i,o)?`zell-eingabe geaendert`:`zell-eingabe`}
                  type="text"
                  data-spalte=${o}
                  aria-label=${n.titel}
                  .value=${r.zellWert(i,o)}
                  @input=${e=>r.tippeZelle(i,o,e.target.value)}
                  @blur=${e=>r.verlasseZelle(i,o,e.target.value)}
                  @keydown=${e=>r.tasteZelle(i,o,e)}
                />
              </div>`}let u=[n.versteckt===!0?`versteckt`:``,i!==null&&G(s)!==null?`zahl`:``].filter(e=>e!==``).join(` `),d=r===0&&c.status===`fehler`?e.html`<span class="fehltext">${c.titel}</span>`:e.nothing;return e.html`<div
                class=${u===``?e.nothing:u}
                role="cell"
                data-ff-editable=${l?``:e.nothing}
                data-ff-eintrag=${l&&a===0?o:e.nothing}
              >${(0,re.markiereTreffer)(s,t.suchtext)}${d}</div>`})}
            ${t.loeschbar&&i!==null&&!t.imEditor?e.html`<button
                  class="zeile-weg"
                  type="button"
                  title=${s?`Löschen zurücknehmen`:`Diese Position zum Löschen vormerken`}
                  aria-label=${s?`Löschen zurücknehmen`:`Position zum Löschen vormerken`}
                  @click=${e=>{e.stopPropagation(),r.schalteLoeschung(i)}}
                >${s?`↺`:`✕`}</button>`:e.nothing}
            ${t.loeschbar&&t.imEditor?e.html`<span
                  class="zeile-weg zeile-weg-anzeige"
                  title="Zeilen l\u00F6schbar \u2014 in der Maske per Kreuz oder Entf-Taste"
                >&#x2715;</span>`:e.nothing}
          </div>`})}
        ${t.erfasste.map((i,a)=>{let o=t.erfasstStand(a),s=o.status===`geschrieben`;return e.html`${a===t.korrekturPlatz?t.erfassung:e.nothing}<div
          class="zeile erfasst"
          role="row"
          data-status=${o.status}
          title=${t.imEditor||s?o.titel:`${o.titel} — zum Korrigieren anklicken`}
          style=${(0,n.styleMap)(t.cols)}
          @click=${t.imEditor||s?e.nothing:()=>r.holeErfassteZeile(a)}
        >
          ${t.spalten.map((n,r)=>{let a=i[t.plaetze[r]]??``,s=r===0&&o.status===`fehler`?e.html`<span class="fehltext">${o.titel}</span>`:e.nothing;return e.html`<div class=${G(a)===null?e.nothing:`zahl`} role="cell">${a}${s}</div>`})}
          ${t.imEditor?e.nothing:e.html`<button
              class="zeile-weg"
              type="button"
              title=${s?`Aus der Ansicht nehmen — geschrieben ist sie schon`:`Diese erfasste Zeile wieder wegnehmen`}
              aria-label="Erfasste Zeile wegnehmen"
              @click=${e=>{e.stopPropagation(),r.nimmErfassteZeile(a)}}
            >&#x2715;</button>`}
        </div>`})}
        ${t.korrekturPlatz!==null&&t.korrekturPlatz>=t.erfasste.length?t.erfassung:e.nothing}
        ${t.hatQuelle&&t.korrekturPlatz===null?t.erfassung:e.nothing}
        ${an(t)}`}
      </div>
      ${Gt(t.spaltenwahl,r.spaltenwahl)}
    `}function sn(t,n){let r=t.hatQuelle||t.erfassungAn||t.seiten>1||t.summen.length>0||t.suchtAktiv||t.auswahlAktiv;if(t.leer||!r)return e.nothing;let i=t.buchen;return e.html`<div class="fusszeile">
    <div class="seiten-info">${tn({hatQuelle:t.hatQuelle,sichtbar:t.sichtbar,gesamt:t.gesamt,suchtAktiv:t.suchtAktiv,auswahlAktiv:t.auswahlAktiv})}</div>
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
      ${i===null?e.nothing:e.html`<button
        class="buchen"
        type="button"
        ?disabled=${i.offen===0}
        title=${t.imEditor?`In der Maske: schreibt die erfassten Zeilen über die Kette „Buchen" (F5)`:`F5`}
        @click=${()=>n.buche()}
      >${i.offen>0?`Buchen (${i.offen})`:`Buchen`}</button>`}
    </div>
  </div>`}var cn=e.css`
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

      /* Die Erfassungszeile klebt bedingungslos unten, nicht nur bei
         „Blaettern = Nein": sonst tippte der Bediener ins Unsichtbare. */
      .koerper > .zeile.erfassung {
        position: sticky;
        bottom: 0;
        z-index: 1;
      }

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

      /* Platz vor der ersten Zelle fuer den Statuspunkt. */
      .kopf > div:first-of-type,
      .zeile > div:first-of-type { padding-left: calc(var(--se-zell-x) + 14px); }
      .zeile[data-status]::before {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--se-faint);
        pointer-events: none;
      }
      .fehltext {
        margin-left: 8px;
        font-size: var(--se-fs-sm);
        color: var(--se-red);
      }

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

      .buchen {
        height: 24px;
        padding: 0 12px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;
        line-height: 1;
        color: var(--se-panel);
        background: var(--se-accent);
        border: var(--se-border) solid var(--se-accent);
        border-radius: var(--se-r-md);
        cursor: pointer;
      }
      .buchen:hover { background: var(--se-accent-dark); border-color: var(--se-accent-dark); }
      .buchen:disabled { opacity: 0.5; cursor: default; }
      .buchen:disabled:hover { background: var(--se-accent); border-color: var(--se-accent); }

      .zeile.geloescht > div { text-decoration: line-through; color: var(--se-muted); }

      /* Der Zeilen-Status ist der Punkt vor der ersten Zelle; der Klartext
         haengt im title. */
      .zeile[data-status="erfasst"] { background: var(--se-accent-soft); }
      .zeile[data-status="erfasst"]::before,
      .zeile[data-status="schreibt"]::before { background: var(--se-accent); }
      .zeile[data-status="geaendert"]::before,
      .zeile[data-status="loeschung"]::before { background: var(--se-amber); }
      .zeile[data-status="loeschung"] { background: var(--se-red-shell); }
      .zeile[data-status="schreibt"] { animation: se-schreibt 1.1s ease-in-out infinite; }
      .zeile[data-status="geschrieben"] { color: var(--se-muted); }
      .zeile[data-status="fehler"] { background: var(--se-red-shell); }
      .zeile[data-status="fehler"]::before { background: var(--se-red); }
      @keyframes se-schreibt { 50% { opacity: 0.55; } }
      @media (prefers-reduced-motion: reduce) {
        .zeile[data-status="schreibt"] { animation: none; }
      }

      /* Traeger fuer das Kreuz am rechten Rand der Zeile. */
      .zeile { position: relative; }
      .zeile-weg {
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 4px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        color: var(--se-faint);
        background: var(--se-panel);
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
        opacity: 0;
      }
      .zeile:hover .zeile-weg,
      .zeile.geloescht .zeile-weg,
      .zeile-weg:focus { opacity: 1; }
      .zeile-weg:hover { color: var(--se-red); background: var(--se-red-soft); }

      .zeile-weg.zeile-weg-anzeige { opacity: 1; cursor: default; }

      mark {
        padding: 0 1px;
        color: inherit;
        background: var(--se-amber-soft);
        border-radius: 2px;
      }

      /* Eine tippbare Zelle bleibt eine ZELLE, kein Formularfeld: sechs davon in
         einer Zeile flackerten sonst beim Ueberfahren. Der transparente Rahmen
         bleibt, er haelt die Hoehe. */
      /* Die Zelle gibt ihr Polster an das Feld ab, zusammen ergeben sie wieder
         --se-zell-x. */
      .zeile > div.tippbar,
      .zeile.erfassung > div {
        padding: 0 calc(var(--se-zell-x) - var(--se-eingabe-x) - var(--se-border));
      }
      .zeile > div.tippbar:first-of-type,
      .zeile.erfassung > div:first-of-type {
        padding-left: calc(var(--se-zell-x) + 14px - var(--se-eingabe-x) - var(--se-border));
      }

      .erf-eingabe.auto {
        color: var(--se-accent);
        font-style: italic;
        background: var(--se-accent-soft);
      }

      .zell-eingabe,
      .erf-eingabe {
        box-sizing: border-box;
        width: 100%;
        height: calc(var(--zeilen-hoehe) - 8px);
        min-width: 0;
        padding: 0 var(--se-eingabe-x);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
        background: transparent;
        border: var(--se-border) solid transparent;
        border-radius: var(--se-r-sm);
      }
      .zell-eingabe:focus,
      .erf-eingabe:focus { outline: none; }
      /* Die Platzhalter erscheinen erst, wenn der Bediener in der Zelle steht. */
      .erf-eingabe::placeholder { color: transparent; }
      .zeile.erfassung:focus-within .erf-eingabe::placeholder { color: var(--se-faint); }

      .zell-eingabe.geaendert {
        background: var(--se-amber-shell);
        border-color: var(--se-amber-line);
        color: var(--se-ink);
        font-weight: 600;
      }

      .vorgemerkt {
        color: var(--se-amber);
        font-weight: 600;
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
`,ln=e.css`
      .zeile.erfassung {
        flex: none;
        background: var(--se-panel-2);
        border-top: var(--se-border) solid var(--se-line);
      }

      /* Die Vorschlagsliste haengt aus der Zelle heraus, darum sichtbarer
         Ueberlauf an jeder Zelle. */
      .zeile.erfassung > div {
        display: flex;
        align-items: center;
        overflow: visible;
      }

      .erf-halter {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
      }

      .erf-halter.nach-oben .vorschlaege {
        top: auto;
        bottom: 100%;
        margin: 0 0 2px;
      }

      :host([data-ff-editor]) .zeile.erfassung > div { color: var(--se-muted); }

      /* Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie an der gebuchten Zeile:
         absolut rechts, sonst schoebe es den Wert der ersten Zelle beiseite. */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`;function Q(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var $=class extends a.BasicBlock{constructor(...e){super(...e),this.spalten=w(),this.source=``,this.suche=`ja`,this.erfassung=`nein`,this.blaettern=`ja`,this.loeschbar=`nein`,this.kopfzeile=`ja`,this.spaltenwahl=`nein`,this.leerText=s.LEER_TEXT_STANDARD,this.rechnung=``,this.datenzeilen=[],this.rohzeilen=[],this.durchAuswahlGefiltert=!1,this.datenGeliefert=!1,this._besitz=`softengine`,this._breiten=new zt({imEditor:()=>this.imEditor,vollerPlatz:e=>b(this.spaltenListe(),this.imEditor,this._wahl.weg()).plaetze[e]??e,spaltenListe:()=>this.spaltenListe(),schreibeSpalten:e=>this.aendere(e),melde:()=>this.requestUpdate()}),this._ansicht=new Ft({baustein:this,editable:()=>this.editable,zeilenHoehe:()=>this.zeilenHoehe,melde:()=>this.requestUpdate(),spalten:()=>this.spaltenListe(),merktSortierung:()=>!this.imEditor}),this._erfassung=new bt,this._lauf=new Ct(()=>this.requestUpdate()),this._wahl=new qt({baustein:this,an:()=>this.spaltenwahlAn,melde:()=>this.requestUpdate(),breitenVergessen:()=>this._breiten.vergessen()}),this._zeilenWahl=new Ce(this),this._zeilen=new xt({baustein:this,spalten:()=>this.spaltenListe(),rohzeilen:()=>this.rohzeilen,datenzeilen:()=>this.datenzeilen,melde:()=>this.requestUpdate(),lauf:this._lauf,erfassungAn:()=>this.erfassungAn,fokussiereErfassungsZelle:e=>this.fokussiereErfassungsZelle(e)}),this.fensterDialogIndex=-1,this.nimmSeFokus=e=>{!e.defaultPrevented&&this.erfassungAn&&(this.imEditor||(e.preventDefault(),this.fokussiereErfassungsZelle(0)))},this.maskenTaste=e=>{if(this.imEditor||e.key!==`Insert`&&e.key!==`F5`)return;let t=Array.from(this.ownerDocument.querySelectorAll(`ff-tabelle`)),n=e.composedPath();(t.find(e=>n.includes(e))??t.find(e=>e.erfassungAn))===this&&(e.key===`Insert`&&this.erfassungAn?(e.preventDefault(),this.fokussiereErfassungsZelle(0)):e.key===`F5`&&this.buchenStand()!==null&&(e.preventDefault(),this.buche()))}}static{this.blockType=`tabelle`}static{this.tagName=`ff-tabelle`}static{this.displayName=`Tabelle`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.kannAuswahlFolgen=!0}static{this.kannErfassen={wenn:{attributeName:`erfassung`,equals:`ja`}}}static{this.aenderungsSchluessel=`aenderbar`}static{this.kannLoeschen={wenn:{attributeName:`loeschbar`,equals:`ja`}}}static{this.blockEvents=[{key:`onRowClick`,name:`Zeile gewählt`},{key:`onRowDblClick`,name:`Zeile doppelt geklickt`},{key:`onBuchen`,name:`Buchen`}]}static{this.listenBindung=Z}static{this.defaultProps={width:`fill`,source:``,spalten:w(),suche:`ja`,erfassung:`nein`,blaettern:`ja`,loeschbar:`nein`,kopfzeile:`ja`,spaltenwahl:`nein`,tagField:``,rechnung:``,leerText:s.LEER_TEXT_STANDARD}}static{this.customProperties=nn}static{this.raster={startW:24,startH:14,minW:6,minH:4}}get besitz(){return this._besitz}set besitz(e){e!==this._besitz&&(this._besitz=e,this.setzeAbgeleitetesZurueck(),this.isConnected&&(e===`provided`?k(this):O(this)),this.requestUpdate())}set bereitgestellteZeilen(e){let t=Se(e);this.rohzeilen=t.rohzeilen,this.datenzeilen=t.datenzeilen,this.datenGeliefert=!0,this._zeilenWahl.vergiss(),this.durchAuswahlGefiltert=!1,this._ansicht.nachPush(),this.requestUpdate()}setzeAbgeleitetesZurueck(){this.rohzeilen=[],this.datenzeilen=[],this.datenGeliefert=!1,this._zeilenWahl.vergiss(),this.durchAuswahlGefiltert=!1,this._ansicht.zuruecksetzen(),this._erfassung.zuruecksetzen()}get erfassteZeilen(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.werte)}get erfassteSchluessel(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.kennung)}get geaenderteZeilen(){return this._zeilen.geaenderteZeilen}get geloeschteZeilen(){return this._zeilen.geloeschteZeilen}zeileSchreibt(e,t){this._lauf.schreibt(e,t)}zeileGescheitert(e,t,n){this._lauf.gescheitert(e,t,n)}laufFertig(e,t){if(this._lauf.fertig(e,t),e===`erfasst`){this._erfassung.markiereGeschrieben(this.erfassungsUmfeld(),t)&&this.requestUpdate();return}this._zeilen.austragen(e,t)}vergissGeschriebene(){this._erfassung.vergissGeschriebene()&&this.requestUpdate()}erfasstStand(e){return this._lauf.zeigt(`erfasst`,this._erfassung.schluessel[e]??``,this._erfassung.istGeschrieben(e)?`geschrieben`:`erfasst`)}erfasseZeile(){return this._erfassung.erfasse(this.erfassungsUmfeld())?(this.requestUpdate(),this.fokussiereErfassungsZelle(0),this.zeigeLetzteErfasste(),!0):!1}zeigeLetzteErfasste(){this.updateComplete.then(()=>{let e=this.shadowRoot?.querySelector(`.koerper`);e&&(e.scrollTop=e.scrollHeight)})}fokussiereSuche(){return this._ansicht.fokussiereSuche()}setzeSuchtext(e){this._ansicht.setzeSuchtext(e),this.requestUpdate()}get hatQuelle(){return this._besitz===`provided`||$t(this.imEditor,this.source)}spaltenListe(){return E(this.spalten)}fensterSpaltenEffektiv(e){let t=this.spaltenListe()[e]?.fensterSpalten;return t!==void 0&&t.length>0?t.map(e=>({...e})):$e(this.erfassungsUmfeld(),e)}aendereSpalte(e,t){let n=this.spaltenListe();n[e]!==void 0&&this.aendere(n.map((n,r)=>r===e?{...n,...t}:n))}fensterDialogTpl(e){let t=this.spaltenListe()[e],n=this.fensterSpaltenEffektiv(e);return qe({titel:t?.titel??``,spalten:n,breite:t?.fensterBreite??N(n.length),hoehe:t?.fensterHoehe??380,onGroesse:t=>{let n=t.achse===`breite`?`fensterBreite`:`fensterHoehe`;this.aendereSpalte(e,{[n]:t.geste===`standard`?void 0:t.wert})},onAendern:t=>this.aendereSpalte(e,{fensterSpalten:t}),onFeldWahl:()=>{},onSchliessen:()=>{this.fensterDialogIndex=-1}})}get zeilenHoehe(){return 28}get erfassungAn(){return this.erfassung===`ja`}erfassungsWirt(){return{baustein:this,lauf:this._erfassung.lauf,umfeld:()=>this.erfassungsUmfeld(),melde:()=>this.requestUpdate(),fokussiere:e=>this.fokussiereErfassungsZelle(e),erfasseZeile:()=>this.erfasseZeile()}}fokussiereErfassungsZelle(e){this.updateComplete.then(()=>{let t=this.shadowRoot?.querySelector(`.zeile.erfassung .erf-eingabe[data-spalte="${e}"]`);t&&(t.focus(),t.scrollIntoView({block:`nearest`}))})}erfassungsUmfeld(){return this._erfassung.umfeld(this,this.spaltenListe(),this.source,(0,i.rechnungVonAttribut)(this.rechnung))}aendere(e){let t=he(this.rechnung,this.spaltenListe(),e);if(t===null){this.meldeProp(`spalten`,e);return}this.meldeProp(`rechnung`,t,`beginn`),this.meldeProp(`spalten`,e,`ende`)}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}buchenStand(){if(this.imEditor)return this.erfassungAn?{offen:0}:null;let e=(0,v.vormerkStandVon)(this,`onBuchen`);return e===void 0?null:{offen:(0,v.vormerkSumme)(e)}}buche(){this.imEditor||(0,m.runEvent)(this,`onBuchen`,{}).catch(m.meldeKettenFehler)}connectedCallback(){super.connectedCallback(),this._besitz===`softengine`&&O(this),document.addEventListener(r.SE_FOKUS_EVENT,this.nimmSeFokus),document.addEventListener(`keydown`,this.maskenTaste),this._ansicht.beobachte()}firstUpdated(){this._ansicht.beobachte()}willUpdate(e){super.willUpdate(e),e.has(`spalten`)&&this._breiten.vergessen(),this.erfassungAn&&!this.imEditor&&this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())}updated(){this._ansicht.nachRendern(),(0,v.meldeVormerkungen)(this)}disconnectedCallback(){super.disconnectedCallback(),this._wahl.loese(),document.removeEventListener(r.SE_FOKUS_EVENT,this.nimmSeFokus),document.removeEventListener(`keydown`,this.maskenTaste),this._ansicht.loese(),He(this),k(this)}static{this.styles=[a.BasicBlock.styles,s.leerStil,cn,c.vorschlagStil,ln]}get spaltenwahlAn(){return this.spaltenwahl===`ja`&&this.kopfzeile===`ja`&&!this.imEditor}oeffneSpaltenwahl(e){let t=this.shadowRoot?.querySelector(`.tabelle`)?.getBoundingClientRect();t&&this._wahl.oeffne(e,t)}render(){let t=this.spaltenListe(),r=b(t,this.imEditor,this._wahl.weg()),i=Zt({spalten:t,gezeichnet:r.spalten,plaetze:r.plaetze,breiteVon:e=>this._breiten.breiteVon(e),hatQuelle:this.hatQuelle,datenGeliefert:this.datenGeliefert,datenzeilen:this.datenzeilen,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,wunschSeite:this._ansicht.seite,gemessen:this._ansicht.mass,erfassungAn:this.erfassungAn,erfassteAnzahl:this._erfassung.zeilen.length,wertVon:(e,t)=>this._zeilen.zellWert(e,t),blaettert:this.blaettern===`ja`});return e.html`<div class="tabelle" style=${(0,n.styleMap)({"--takt":`${i.takt}px`,"--zeilen-hoehe":`${i.zeilenHoehe}px`})}>
      ${on({spalten:r.spalten,plaetze:r.plaetze,cols:i.cols,editable:this.editable,imEditor:this.imEditor,zeigeKopf:this.kopfzeile===`ja`,spaltenwahlAn:this.spaltenwahlAn,spaltenwahl:this._wahl.offen===null?null:{waehlbar:t.filter(e=>e.versteckt!==!0),weg:this._wahl.weg(),links:this._wahl.offen.links,oben:this._wahl.offen.oben},auswahlSemantik:(0,o.geberIdVon)(this)!==``,zeigeSuche:this.suche===`ja`,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,zeilen:i.zeilen,linealTakte:i.linealTakte,datenzeilen:this.datenzeilen,hatQuelle:i.hatQuelle,auswahlIndex:this._zeilenWahl.platzIn(this.rohzeilen),aendernMoeglich:!this.imEditor&&i.hatQuelle&&ye(this),loeschbar:this.loeschbar===`ja`&&!this.imEditor&&i.hatQuelle&&ye(this),zeilenStand:this._zeilen,leer:i.leer,leerText:this.leerText,erfasste:this._erfassung.zeilen,erfasstStand:e=>this.erfasstStand(e),korrekturPlatz:this.erfassungAn?this._erfassung.korrekturPlatz:null,erfassung:this.erfassungAn?rt(this.erfassungsWirt(),i.cols,this._erfassung.korrekturPlatz===null&&(i.linealTakte??1)<=0,r):e.nothing},{setzeSuchtext:e=>this._ansicht.setzeSuchtext(e),oeffneSpaltenwahl:e=>this.oeffneSpaltenwahl(e),spaltenwahl:{schalte:e=>this._wahl.schalte(e),alleZeigen:()=>this._wahl.alleZeigen(),schliesse:()=>this._wahl.schliesse()},breiten:this._breiten.wirtFuerZug(),klickKopf:e=>{this.editable||this._ansicht.klickSortiere(e)},aktiviereZeile:(e,t)=>{ke(this,this._zeilenWahl,this.rohzeilen,e,t),this.requestUpdate()},zeileDoppelt:e=>Ae(this,this.rohzeilen,e),nimmErfassteZeile:e=>{this._erfassung.entferne(e)&&this.requestUpdate()},holeErfassteZeile:e=>{this._erfassung.zurueckholen(this.erfassungsUmfeld(),e)&&(this.requestUpdate(),this.fokussiereErfassungsZelle(0))},schalteLoeschung:e=>this._zeilen.schalteLoeschung(e)})}
      ${sn({hatQuelle:i.hatQuelle,sichtbar:i.gesamt,gesamt:this.datenzeilen.length,suchtAktiv:this._ansicht.suchtAktiv,auswahlAktiv:this.durchAuswahlGefiltert,seite:i.seite,seiten:i.seiten,blaettert:this.blaettern===`ja`,summen:i.summen,leer:i.leer,erfassungAn:this.erfassungAn,imEditor:this.imEditor,buchen:this.buchenStand()},{blaettere:e=>this._ansicht.blaettere(e),buche:()=>this.buche()})}
      ${this.imEditor&&this.spaltenListe()[this.fensterDialogIndex]!==void 0?this.fensterDialogTpl(this.fensterDialogIndex):e.nothing}
    </div>`}};Q([(0,t.property)({converter:{fromAttribute:e=>e?fe(e):w(),toAttribute:e=>JSON.stringify(e)}})],$.prototype,`spalten`,void 0),Q([(0,t.property)()],$.prototype,`source`,void 0),Q([(0,t.property)()],$.prototype,`suche`,void 0),Q([(0,t.property)()],$.prototype,`erfassung`,void 0),Q([(0,t.property)()],$.prototype,`blaettern`,void 0),Q([(0,t.property)()],$.prototype,`loeschbar`,void 0),Q([(0,t.property)()],$.prototype,`kopfzeile`,void 0),Q([(0,t.property)()],$.prototype,`spaltenwahl`,void 0),Q([(0,t.property)()],$.prototype,`leerText`,void 0),Q([(0,t.property)()],$.prototype,`rechnung`,void 0),Q([(0,t.property)({attribute:!1})],$.prototype,`datenzeilen`,void 0),Q([(0,t.property)({attribute:!1})],$.prototype,`rohzeilen`,void 0),Q([(0,t.property)({attribute:!1})],$.prototype,`durchAuswahlGefiltert`,void 0),Q([(0,t.property)({attribute:!1})],$.prototype,`datenGeliefert`,void 0),Q([(0,t.property)({attribute:!1})],$.prototype,`fensterDialogIndex`,void 0),a.BasicBlock.defineAndRegister($),window.FF=window.FF||{},FF.blocks$tabelle$nachschlagen=je})(FF.lit,FF.lit$decorators$js,FF.lit$directives$style$map$js,FF.softengine$bridge,FF.core$data$rechnung,FF.blocks$base$BasicBlock,FF.blocks$shared$auswahl,FF.blocks$shared$leerZustand,FF.blocks$shared$vorschlagListe,FF.softengine$data,FF.softengine$meldung,FF.blocks$shared$lupeZeichen,FF.blocks$shared$DialogRahmen,FF.core$blocks$listenBindung,FF.blocks$shared$seAktionen,FF.blocks$shared$datenAnschluss,FF.blocks$shared$datenVorspann,FF.core$blocks$BlockDefinition,FF.blocks$shared$fremdeQuellen,FF.core$data$aktionen,FF.blocks$shared$vormerkStand,FF.blocks$shared$textSuche,FF.blocks$shared$jaNeinProperty,FF.blocks$shared$textMarke);