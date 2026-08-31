(function(){var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:ee}=Object,te=globalThis,ne=te.trustedTypes,re=ne?ne.emptyScript:``,ie=te.reactiveElementPolyfillSupport,ae=(e,t)=>e,oe={toAttribute(e,t){switch(t){case Boolean:e=e?re:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},se=(e,t)=>!l(e,t),ce={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:se};Symbol.metadata??=Symbol(`metadata`),te.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(ae(`elementProperties`)))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ae(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ae(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?oe:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?oe:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??se)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};m.elementStyles=[],m.shadowRootOptions={mode:`open`},m[ae(`elementProperties`)]=new Map,m[ae(`finalized`)]=new Map,ie?.({ReactiveElement:m}),(te.reactiveElementVersions??=[]).push(`2.1.2`);var le=globalThis,ue=e=>e,de=le.trustedTypes,fe=de?de.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,pe=`$lit$`,h=`lit$${Math.random().toFixed(9).slice(2)}$`,me=`?`+h,he=`<${me}>`,g=document,ge=()=>g.createComment(``),_e=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ve=Array.isArray,ye=e=>ve(e)||typeof e?.[Symbol.iterator]==`function`,be=`[ 	
\f\r]`,xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Se=/-->/g,Ce=/>/g,_=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),we=/'/g,Te=/"/g,Ee=/^(?:script|style|textarea|title)$/i,De=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),v=De(1),Oe=De(2),y=Symbol.for(`lit-noChange`),b=Symbol.for(`lit-nothing`),ke=new WeakMap,x=g.createTreeWalker(g,129);function Ae(e,t){if(!ve(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return fe===void 0?t:fe.createHTML(t)}var je=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=xe;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===xe?c[1]===`!--`?o=Se:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=_):(Ee.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=_):o=Ce:o===_?c[0]===`>`?(o=i??xe,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?_:c[3]===`"`?Te:we):o===Te||o===we?o=_:o===Se||o===Ce?o=xe:(o=_,i=void 0);let d=o===_&&e[t+1].startsWith(`/>`)?` `:``;a+=o===xe?n+he:l>=0?(r.push(s),n.slice(0,l)+pe+n.slice(l)+h+d):n+h+(l===-2?t:d)}return[Ae(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Me=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=je(t,n);if(this.el=e.createElement(l,r),x.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=x.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(pe)){let t=u[o++],n=i.getAttribute(e).split(h),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ie:r[1]===`?`?Le:r[1]===`@`?Re:Fe}),i.removeAttribute(e)}else e.startsWith(h)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ee.test(i.tagName)){let e=i.textContent.split(h),t=e.length-1;if(t>0){i.textContent=de?de.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],ge()),x.nextNode(),c.push({type:2,index:++a});i.append(e[t],ge())}}}else if(i.nodeType===8)if(i.data===me)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(h,e+1))!==-1;)c.push({type:7,index:a}),e+=h.length-1}a++}}static createElement(e,t){let n=g.createElement(`template`);return n.innerHTML=e,n}};function S(e,t,n=e,r){if(t===y)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=_e(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=S(e,i._$AS(e,t.values),i,r)),t}var Ne=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??g).importNode(t,!0);x.currentNode=r;let i=x.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Pe(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new ze(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=x.nextNode(),a++)}return x.currentNode=g,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Pe=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),_e(e)?e===b||e==null||e===``?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==y&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ye(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(g.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Me.createElement(Ae(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ne(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=ke.get(e.strings);return t===void 0&&ke.set(e.strings,t=new Me(e)),t}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(ge()),this.O(ge()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=ue(e).nextSibling;ue(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Fe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=b}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=S(this,e,t,0),a=!_e(e)||e!==this._$AH&&e!==y,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=S(this,r[n+o],t,o),s===y&&(s=this._$AH[o]),a||=!_e(s)||s!==this._$AH[o],s===b?e=b:e!==b&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ie=class extends Fe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Le=class extends Fe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Re=class extends Fe{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??b)===y)return;let n=this._$AH,r=e===b&&n!==b||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==b&&(n===b||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ze=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}},Be=le.litHtmlPolyfillSupport;Be?.(Me,Pe),(le.litHtmlVersions??=[]).push(`3.3.3`);var Ve=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Pe(t.insertBefore(ge(),e),e,void 0,n??{})}return i._$AI(e),i},He=globalThis,C=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return y}};C._$litElement$=!0,C.finalized=!0,He.litElementHydrateSupport?.({LitElement:C});var Ue=He.litElementPolyfillSupport;Ue?.({LitElement:C}),(He.litElementVersions??=[]).push(`4.2.2`);var We={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:se},Ge=(e=We,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function w(e){return(t,n)=>typeof n==`object`?Ge(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function T(e){return w({...e,state:!0,attribute:!1})}var Ke=new Map;function qe(e){Ke.has(e.type)&&console.warn(`Block-Typ "${e.type}" wird ueberschrieben.`),Ke.set(e.type,e)}function Je(){return Array.from(Ke.values())}var Ye={width:`auto`};function Xe(e){return Object.entries(e).map(([e,t])=>`${e.replace(/[A-Z]/g,e=>`-`+e.toLowerCase())}:${t}`).join(`;`)}var Ze={spalten:24,spaltePx:40,zeilePx:12,gapPx:8},Qe={rasterX:0,rasterY:0,rasterW:Ze.spalten,rasterH:1};function $e(){return{display:`grid`,gridTemplateColumns:`repeat(${Ze.spalten}, 1fr)`,gridAutoRows:`${Ze.zeilePx}px`,gap:`${Ze.gapPx}px`,alignContent:`start`}}function et(){return Xe($e())}var tt=`weitereQuellen`,nt={[tt]:[]},rt=`folgtAuswahl`,it={[rt]:[]};function at(e,t){let n=e.textContent??``,r=Array.from(e.childNodes),i=r.map(e=>e.textContent??``);e.setAttribute(`contenteditable`,`plaintext-only`),e.focus();let a=window.getSelection(),o=document.createRange();o.selectNodeContents(e),a?.removeAllRanges(),a?.addRange(o);let s=()=>{e.replaceChildren(...r),r.forEach((e,t)=>{e.textContent!==i[t]&&(e.textContent=i[t])})},c=e.closest(`button`)!==null,l=()=>{let t=e.getRootNode().getSelection?.()??window.getSelection(),n=t?.rangeCount?t.getRangeAt(0):null;if(!t||!n||!e.contains(n.startContainer))return;n.collapsed||n.deleteContents();let r=n.startContainer;if(r instanceof Text){let e=n.startOffset;r.insertData(e,` `),t.collapse(r,e+1)}else{let e=document.createTextNode(` `);n.insertNode(e),t.collapse(e,1)}},u=!1,d=r=>{u||(u=!0,e.removeAttribute(`contenteditable`),e.removeEventListener(`blur`,f),e.removeEventListener(`keydown`,p),r&&t((e.textContent??``).trim(),n)||s())},f=()=>d(!0),p=t=>{if(t.key===`Enter`)t.preventDefault(),e.blur();else if(t.key===`Escape`)t.preventDefault(),d(!1);else if(t.key===` `&&c){if(t.ctrlKey||t.metaKey||t.altKey||t.isComposing)return;t.preventDefault(),l()}};e.addEventListener(`blur`,f),e.addEventListener(`keydown`,p)}function E(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var D=class extends C{constructor(...e){super(...e),this.editable=!1}static{this.styles=o`
    :host { display: block; }
    :host([hidden]) { display: none; }

    :host([fuellt]) { height: 100%; box-sizing: border-box; }
    [data-ff-editable] { cursor: text; }
    :host(:not([data-editable])) [data-ff-editable] { cursor: inherit; }
    :host([data-ff-editor]) [data-ff-bound] {
      text-decoration: underline dotted var(--se-accent);
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
    :host([data-ff-editor][data-editable]) [data-ff-bound] { cursor: pointer; }
  `}static{this.customProperties=[]}get customProperties(){return this.constructor.customProperties}inlineEdit(e,t){if(!this.editable)return;let n=e.currentTarget;n&&(n.hasAttribute(`data-ff-bound`)||(e.stopPropagation(),e.preventDefault(),at(n,(e,n)=>(e!==n&&this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:t,value:e},bubbles:!0,composed:!0})),!0))))}static defineAndRegister(e){customElements.get(e.tagName)||customElements.define(e.tagName,e),qe({type:e.blockType,tagName:e.tagName,displayName:e.displayName,category:e.category,defaultProps:{...Ye,...Qe,...e.acceptsDataSource?nt:null,...e.kannAuswahlFolgen?it:null,...e.defaultProps},customProperties:e.customProperties,acceptsChildren:e.acceptsChildren??!1,resizableWidth:e.resizableWidth??!0,resizableHeight:e.resizableHeight??!1,allowedChildTypes:e.allowedChildTypes,allowedParentTypes:e.allowedParentTypes,lockedWidth:e.lockedWidth,defaultChildren:e.defaultChildren,childDirection:e.childDirection,showInPalette:e.showInPalette,templateChild:e.templateChild,containerHint:e.containerHint,addChildButton:e.addChildButton,acceptsDataSource:e.acceptsDataSource,satzWahl:e.satzWahl,kannAuswahlFolgen:e.kannAuswahlFolgen,kannErfassen:e.kannErfassen,aenderungsSchluessel:e.aenderungsSchluessel,kannLoeschen:e.kannLoeschen,bindableSpots:e.bindableSpots,actionValueSpots:e.actionValueSpots,listenBindung:e.listenBindung,blockEvents:e.blockEvents,pageBlock:e.pageBlock,flaechenSeite:e.flaechenSeite,maskenRand:e.maskenRand,raster:e.raster})}};E([w({type:Boolean,reflect:!0,attribute:`data-editable`})],D.prototype,`editable`,void 0);var ot=`root`,st=class extends D{static{this.blockType=`ansicht`}static{this.tagName=`ff-ansicht`}static{this.displayName=`Ansicht`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.showInPalette=!1}static{this.allowedParentTypes=[ot]}static{this.pageBlock=!0}static{this.flaechenSeite=!0}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.defaultProps={name:`Ansicht`}}static{this.styles=[D.styles,o`

      :host { display: contents; }
    `]}render(){return v`<slot></slot>`}};D.defineAndRegister(st);var ct=class extends D{constructor(...e){super(...e),this.quelle=``}static{this.blockType=`bild`}static{this.tagName=`ff-bild`}static{this.displayName=`Bild`}static{this.category=`anzeige`}static{this.defaultProps={quelle:``}}static{this.raster={startW:6,startH:6,minW:1,minH:1}}static{this.customProperties=[{attributeName:`quelle`,name:`Bild`,description:`Wird in die Maske eingebettet; grosse Bilder werden verkleinert.`,kind:`bild`}]}static{this.styles=[D.styles,o`
      :host { display: block; }

      .flaeche {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .platzhalter { display: none; }
      :host([data-ff-editor]) .platzhalter {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        min-height: 48px;
        box-sizing: border-box;
        padding: var(--se-gap-sm);
        border: var(--se-border) dashed var(--se-line);
        border-radius: var(--se-r-md);
        color: var(--se-faint);
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        text-align: center;
      }
    `]}render(){return v`<div class="flaeche">
      ${this.quelle===``?v`<div class="platzhalter">Bild</div>`:v`<img src=${this.quelle} alt="">`}
    </div>`}};E([w()],ct.prototype,`quelle`,void 0),D.defineAndRegister(ct);var lt=`data-ff-block-id`,ut=[`fixed`,`context`,`data_field`,`block_value`,`gewaehlte_zeile`,`erfassungszelle`,`aenderungszelle`,`loeschzelle`,`previous_result`,`step_result`,`se_variable`,`aus`];function dt(e){return!!e&&typeof e==`object`&&!Array.isArray(e)}function ft(e){return!dt(e)||typeof e.source!=`string`||!ut.includes(e.source)||typeof e.value!=`string`||e.dataSourceId!==void 0&&typeof e.dataSourceId!=`string`||e.blockId!==void 0&&typeof e.blockId!=`string`||e.ergebnisFeld!==void 0&&typeof e.ergebnisFeld!=`string`?null:{source:e.source,value:e.value,...typeof e.dataSourceId==`string`?{dataSourceId:e.dataSourceId}:{},...typeof e.blockId==`string`?{blockId:e.blockId}:{},...e.source===`step_result`&&typeof e.ergebnisFeld==`string`?{ergebnisFeld:e.ergebnisFeld}:{}}}function pt(e){if(!dt(e)||typeof e.type!=`string`||typeof e.resultKey!=`string`)return null;if(e.type===`START_TOOL`)return typeof e.toolNr!=`string`||!Array.isArray(e.toolParams)||e.toolParams.some(e=>typeof e!=`string`)?null:{type:`START_TOOL`,resultKey:e.resultKey,toolNr:e.toolNr,toolParams:[...e.toolParams]};if(e.type===`BW_LINK`)return typeof e.befehl==`string`?{type:`BW_LINK`,resultKey:e.resultKey,befehl:e.befehl}:null;if(e.type===`POPUP_OPEN`||e.type===`POPUP_CLOSE`){let t=typeof e.popupId==`string`?e.popupId:void 0,n=typeof e.popup==`string`?e.popup:void 0;return t===void 0&&n===void 0?null:{type:e.type,resultKey:e.resultKey,...t===void 0?{}:{popupId:t},...n===void 0?{}:{popup:n}}}if(e.type===`RELATION`){if(typeof e.relationId!=`string`||!Array.isArray(e.extraParams)||!Array.isArray(e.params)&&!dt(e.bindings))return null;let t=[];if(Array.isArray(e.params))for(let n of e.params){let e=ft(n);if(!e)return null;t.push(e)}let n=[];for(let t of e.extraParams){let e=ft(t);if(!e)return null;n.push(e)}return{type:`RELATION`,resultKey:e.resultKey,relationId:e.relationId,params:t,extraParams:n}}return null}function mt(e){if(!e)return{};let t;try{t=JSON.parse(e)}catch{return{}}if(!dt(t))return{};let n={};for(let[e,r]of Object.entries(t)){if(!Array.isArray(r)||r.length===0)continue;let t=[],i=!1;for(let e of r){let n=pt(e);if(!n){i=!0;break}t.push(n)}!i&&t.length>0&&(n[e]=t)}return n}Object.values({idb:{id:`idb`,name:`IDB-Tabelle`,tabellenId:``,felderEinzeln:!1,kennungLabel:`Kennung`,kennungBeispiel:`ID0001`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[]},adressstamm:{id:`adressstamm`,name:`Adressstamm`,tabellenId:`ADR`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[]},artikelstamm:{id:`artikelstamm`,name:`Artikelstamm`,tabellenId:`ART`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[]},beleg:{id:`beleg`,name:`Beleg`,tabellenId:`BEL`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[{code:`0_11`,label:`Satzschlüssel`},{code:`2_1`,label:`Belegart`},{code:`3_8`,label:`Belegnummer`},{code:`11_8`,label:`Kundennummer`},{code:`19_10`,label:`Belegdatum`},{code:`393_12`,label:`Warenwert`},{code:`441_12`,label:`MwSt-Betrag`},{code:`453_12`,label:`Gesamtbetrag`},{code:`3440_60`,label:`Name`}]},belegposition:{id:`belegposition`,name:`Belegpositionen`,tabellenId:`POS`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!0,kopfsatzStandard:`BEL_0_11`,relationLadenMoeglich:!0,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[{code:`2_1`,label:`Belegart`},{code:`3_8`,label:`Belegnummer`},{code:`11_6`,label:`Positionsnummer`},{code:`17_1`,label:`Zeilenart`},{code:`18_25`,label:`Artikelnummer`},{code:`45_60`,label:`Bezeichnung`},{code:`164_8`,label:`Menge`},{code:`246_9`,label:`Einzelpreis`},{code:`280_12`,label:`Gesamtpreis`},{code:`372_5`,label:`MwSt-Satz`},{code:`645_10`,label:`Satznummer`},{code:`689_5`,label:`Mengeneinheit`},{code:`1401_12`,label:`Rohertrag`},{code:`2558_1`,label:`Farbkennzeichen`},{code:`3164_12`,label:`Rabatt`}]},datei:{id:`datei`,name:`Andere Datei`,tabellenId:``,felderEinzeln:!0,kennungLabel:`Kennung`,kennungBeispiel:`SERPOS`,kopfsatzMoeglich:!0,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!1,standardFelder:[]},erpabfrage:{id:`erpabfrage`,name:`ERP-Abfrage`,tabellenId:``,felderEinzeln:!0,kennungLabel:`Kennung`,kennungBeispiel:`LIEFERADRESSE.GET`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!1,varMoeglich:!1,bestellBlock:`erpapicall`,spaltenNamen:!1,idbKurzform:!0,feldVorsatzMoeglich:!0,standardFelder:[]},dataset:{id:`dataset`,name:`DataSet`,tabellenId:``,felderEinzeln:!0,kennungLabel:`DataSet-ID`,kennungBeispiel:`ID0001`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!1,varMoeglich:!1,bestellBlock:`dataset`,spaltenNamen:!0,idbKurzform:!1,feldVorsatzMoeglich:!1,standardFelder:[]}}).map(e=>e.id);var ht=/^\d+_\d+$/,gt=/^\d+$/;function _t(e){if(!e||typeof e!=`object`)return null;let t=e,n=e=>typeof e==`string`?e.trim():``,r=n(t.nr),i=n(t.geberQuelleId),a=n(t.belegartFeld),o=n(t.belegnummerFeld),s=n(t.jahrFeld),c=n(t.archivFeld),l=Array.isArray(t.endeFelder)?t.endeFelder.filter(e=>typeof e==`string`&&ht.test(e)):[];return!gt.test(r)||i===``||!ht.test(a)||!ht.test(o)||s!==``&&!ht.test(s)||c!==``&&!ht.test(c)||l.length===0?null:{nr:r,geberQuelleId:i,belegartFeld:a,belegnummerFeld:o,jahrFeld:s,archivFeld:c,endeFelder:l}}var vt=new Map;function yt(e,t){e!==``&&vt.set(e,t)}function bt(e){return vt.get(e)}function O(e){return typeof e==`object`&&!!e}function k(e,t){if(!(!Array.isArray(e)||t===``))for(let n of e){if(!O(n)||n.id!==t||typeof n.name!=`string`||typeof n.tableId!=`string`)continue;let e,r=_t(n.ladeRelation);if(r&&O(n.ladeRelation)){let t=n.ladeRelation.zusatzFelder,i=Array.isArray(t)?t.filter(e=>typeof e==`string`&&ht.test(e)):[];e={...r,zusatzFelder:i}}return{id:t,name:n.name,tableId:n.tableId,indexField:typeof n.indexField==`string`?n.indexField:``,offenerSatz:n.offenerSatz===!0,...e?{ladeRelation:e}:{}}}}function xt(e){return e==null?``:String(e).trim()}function A(e,t){if(!O(e)||t===``)return``;let n=t.trim(),r=xt(e[n]);if(r!==``)return r;for(let t of Object.keys(e))if(t===n||t.startsWith(`${n}_`)||t.endsWith(`_${n}`)){let n=xt(e[t]);if(n!==``)return n}let i=/^(\d+)_(\d+)$/.exec(n);if(!i)return``;let a=e.SATZNEU??e.SATZ??e.satzneu??e.satz??e.RAW??e.raw,o=a==null?``:String(a);if(o===``)return``;let s=Number(i[1]),c=Number(i[2]);return c<=0?``:o.substring(s,s+c).trim()}function St(e,t){return e.indexField===``?``:A(t,e.indexField)}function Ct(e,t,n){if(!O(e)||t===``)return!1;let r=t.trim(),i=!1;for(let t of Object.keys(e))(t===r||t.startsWith(`${r}_`)||t.endsWith(`_${r}`))&&(e[t]=n,i=!0);let a=/^(\d+)_(\d+)$/.exec(r);if(a){let t=[`SATZNEU`,`SATZ`,`satzneu`,`satz`,`RAW`,`raw`].find(t=>typeof e[t]==`string`);if(t){let r=e[t],o=Number(a[1]),s=Number(a[2]);if(s>0){let a=n.length>s?n.slice(0,s):n.padEnd(s,` `),c=r.length<o?r.padEnd(o,` `):r;e[t]=c.slice(0,o)+a+c.slice(o+s),i=!0}}}return i}function wt(e){if(!O(e))return Array.isArray(e)?e:[];let t=[e.Zeilen,e.zeilen,e.Saetze,e.saetze,e.Rows,e.rows,e.Daten,e.daten];for(let e of t){if(Array.isArray(e))return e;if(typeof e==`string`)try{let t=JSON.parse(e);if(Array.isArray(t))return t}catch{}}return[]}function j(e,t){return xt(e).toLowerCase()===t.trim().toLowerCase()}function Tt(e){for(let t of[`Var`,`VAR`,`var`]){let n=e[t];if(O(n))return n}}function Et(e,t){if(!O(e)||!O(e.Daten))return[];let n=t.trim();if(n===``)return[];let r=Tt(e.Daten);if(!r)return[];let i={},a=r.WINDOW_VARIABLE??r.Window_Variable;if(O(a)){let e=n.toUpperCase()+`_`;for(let t of Object.keys(a))t.toUpperCase().startsWith(e)&&(i[t]=a[t])}let o=r[n]??r[n.toUpperCase()];if(O(o))for(let e of Object.keys(o))(xt(o[e])!==``||!(e in i))&&(i[e]=o[e]);return Object.keys(i).length===0?[]:[i]}function Dt(e,t,n,r=!1){if(!O(e)||!O(e.Daten))return[];if(r)return Et(e,n);let i=e.Daten,a=i.SEFileLoop;if(Array.isArray(a)){for(let e of a)if(O(e)&&(j(e.ALIAS,t)||j(e.alias,t))){let t=wt(e);if(t.length>0)return t}}else if(O(a))for(let e of Object.keys(a)){let n=a[e];if(j(e,t)||O(n)&&(j(n.ALIAS,t)||j(n.alias,t))){let e=wt(n);if(e.length>0)return e}}for(let e of[`ErpApiCall`,`ERPAPICALL`,`erpapicall`]){let n=i[e];if(O(n))for(let e of Object.keys(n)){if(!j(e,t))continue;let r=wt(n[e]);if(r.length>0)return r}}let o=i.Tabellen;if(O(o)){let e=[t,t.toUpperCase(),t.toLowerCase(),n];for(let t of e)if(t!==``&&t in o){let e=wt(o[t]);if(e.length>0)return e}for(let e of Object.keys(o))if(j(e,t)){let t=wt(o[e]);if(t.length>0)return t}}return bt(t)??[]}function Ot(e){let t=e;if(typeof t==`string`)try{t=JSON.parse(t)}catch{return}if(!O(t)||!O(t.Daten))return;let n=t.Daten;if(!(!n.SEFileLoop&&!n.Tabellen&&!n.ErpApiCall&&!Tt(n)))return n}function kt(e){let t=e;if(typeof t==`string`)try{t=JSON.parse(t)}catch{return}if(!(!O(t)||!O(t.MSG)))return t.MSG.DATA}function At(e,t,n,r={}){let i=e.getAttribute(t)??``;if(i===``)return[];try{let e=JSON.parse(i);if(!Array.isArray(e))return[];let t=[];for(let i of e){if(!i||typeof i!=`object`)continue;let e=i,a=e[n];if(typeof a!=`string`||a===``)continue;let o=[];for(let t of Array.isArray(e.keyPairs)?e.keyPairs:[]){if(!t||typeof t!=`object`)continue;let e=t;typeof e.fromField!=`string`||typeof e.toField!=`string`||e.fromField.trim()===``||e.toField.trim()===``||o.push({fromField:e.fromField,toField:e.toField})}if(o.length===0&&r.ohnePaareBehalten!==!0)continue;let s=typeof e.partnerId==`string`&&e.partnerId!==a?e.partnerId:``;t.push({id:a,partnerId:s,keyPairs:o})}return t}catch{return[]}}function jt(e){if(e==null)return``;try{return JSON.stringify(e)??``}catch{return``}}var M=new Map,Mt=new Set,Nt=new Set,Pt=0,Ft=!1,It=!1;function Lt(){if(Ft){It=!0;return}Ft=!0;try{do It=!1,Mt.forEach(e=>e());while(It)}finally{Ft=!1}}function Rt(e){Mt.add(e)}function zt(e){return M.get(e)?.zeile}function Bt(e){return M.get(e)?.merkmal??``}function Vt(e){return M.get(e)?.nummer??0}function N(e){return e.getAttribute(`data-ff-id`)??``}function Ht(e,t,n){if(e===``)return[];let r=Bt(e);if(r===``)return[];let i=[];return t.forEach((e,t)=>{jt(n(e))===r&&i.push(t)}),i.length===0&&Gt(e),i}function Ut(e,t){if(e===``)return;let n=jt(t);if(n===``)return;let r=M.get(e);r&&r.merkmal===n?M.delete(e):M.set(e,{zeile:t,merkmal:n,nummer:++Pt}),Lt()}function Wt(e,t){if(e===``)return;let n=jt(t);n!==``&&M.get(e)?.merkmal!==n&&(M.set(e,{zeile:t,merkmal:n,nummer:++Pt}),Lt())}function Gt(e){M.has(e)&&(M.delete(e),Lt())}function Kt(e){Nt.add(e)}var qt=rt.toLowerCase();function Jt(e){return At(e,qt,`geberId`).map(e=>({geberId:e.id,keyPairs:e.keyPairs}))}function Yt(e,t){let n=t,r=!1;for(let t of Jt(e)){let e=zt(t.geberId);e!==void 0&&(r=!0,n=n.filter(n=>t.keyPairs.every(t=>{let r=A(e,t.fromField);return r!==``&&r===A(n,t.toField)})))}return{rows:n,gefiltert:r}}function Xt(e,t){if(Jt(e).length===0)return t[0];let{rows:n,gefiltert:r}=Yt(e,t);return r?n[0]:void 0}var Zt=`ff-dialog-rahmen`,Qt=`ff-dialog-schliessen`,$t=`ff-dialog-groesse`;function en(e,t){let n=Number(e);return Number.isFinite(n)&&n>0?n:t}var P=class extends C{constructor(...e){super(...e),this.titel=`Dialog`,this.breite=520,this.hoehe=380,this.viewport=!1,this.escapeSchliesst=!1,this.ohneModal=!1,this.inhaltFest=!1,this.ziehbar=!1,this.escapeRegistriert=!1,this.aufTaste=e=>{e.key===`Escape`&&(e.stopPropagation(),this.schliesse())}}static{this.styles=o`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      font-family: var(--se-font);
      font-size: var(--se-fs);
      color: var(--se-ink);
    }

    :host([viewport]) {
      position: fixed;
      z-index: 2147483646;
    }
    .abdunklung,
    .buehne {
      position: absolute;
      inset: 0;
    }
    .abdunklung { background: var(--se-scrim); }
    .buehne {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fenster {
      position: relative;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      max-width: calc(100% - ${24}px);
      max-height: calc(100% - ${24}px);
      overflow: hidden;
      background: var(--se-panel);
      border: var(--se-border) solid var(--se-line);
      border-radius: var(--se-r-lg);
    }
    .kopf {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 12px;
      background: var(--se-panel-2);
      border-bottom: var(--se-border) solid var(--se-line-soft);
    }
    .titel {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      color: var(--se-ink);

      font-family: var(--se-font-schmuck);
      font-size: var(--se-fs-lg);
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .schliessen {
      flex: none;
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      border-radius: var(--se-r-sm);
      background: none;
      color: var(--se-muted);
      font: inherit;
      font-size: 15px;
      line-height: 1;
      cursor: pointer;
    }
    .schliessen:hover {
      background: var(--se-line-soft);
      color: var(--se-ink);
    }
    .inhalt {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
    }

    :host([inhalt-fest]) .inhalt { overflow: hidden; }

    .anfasser {
      position: absolute;
      border-radius: 4px;
      background: var(--se-accent);
      touch-action: none;
      z-index: 2;
    }
    .anfasser.breit {
      top: 50%;
      right: -3px;
      width: 7px;
      height: 26px;
      transform: translateY(-50%);
      cursor: ew-resize;
    }
    .anfasser.hoch {
      left: 50%;
      bottom: -3px;
      width: 26px;
      height: 7px;
      transform: translateX(-50%);
      cursor: ns-resize;
    }
  `}aktualisiereEscape(){let e=this.isConnected&&this.escapeSchliesst;e!==this.escapeRegistriert&&(e?document.addEventListener(`keydown`,this.aufTaste,!0):document.removeEventListener(`keydown`,this.aufTaste,!0),this.escapeRegistriert=e)}ziehe(e,t){if(!this.ziehbar)return;e.preventDefault(),e.stopPropagation();let n=t===`breite`?en(this.breite,520):en(this.hoehe,380),r=t===`breite`?240:160,i=t===`breite`?e.clientX:e.clientY,a=Math.max(r,Math.round(n)),o=!1,s=(e,n)=>{this.dispatchEvent(new CustomEvent($t,{detail:{achse:t,wert:e,geste:n},bubbles:!0,composed:!0}))},c=e=>{let c=t===`breite`?e.clientX:e.clientY,l=Math.max(r,Math.round(n+(c-i)*2));l!==a&&(a=l,s(l,o?`laeuft`:`beginn`),o=!0)},l=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l),window.removeEventListener(`blur`,l),o&&s(a,`ende`)};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l),window.addEventListener(`blur`,l)}aufStandard(e,t){this.ziehbar&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent($t,{detail:{achse:t,wert:0,geste:`standard`},bubbles:!0,composed:!0})))}schliesse(){this.dispatchEvent(new CustomEvent(Qt,{bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this.aktualisiereEscape()}updated(e){e.has(`escapeSchliesst`)&&this.aktualisiereEscape()}disconnectedCallback(){this.escapeRegistriert&&=(document.removeEventListener(`keydown`,this.aufTaste,!0),!1),super.disconnectedCallback()}render(){let e=en(this.breite,520),t=en(this.hoehe,380);return v`
      <div class="abdunklung"></div>
      <div class="buehne">
        <section
          class="fenster"
          role="dialog"
          aria-modal=${this.ohneModal?b:`true`}
          aria-labelledby="dialog-titel"
          style="width:${e}px;height:${t}px"
        >
          <header class="kopf">
            <div class="titel" id="dialog-titel"><slot name="titel">${this.titel}</slot></div>
            <button
              class="schliessen"
              type="button"
              aria-label="Schließen"
              title="Schließen"
              @click=${this.schliesse}
            >✕</button>
          </header>
          <div class="inhalt"><slot></slot></div>
          ${this.ziehbar?v`
            <div
              class="anfasser breit"
              title="Breite ziehen · Doppelklick: Standard"
              @pointerdown=${e=>this.ziehe(e,`breite`)}
              @dblclick=${e=>this.aufStandard(e,`breite`)}
            ></div>
            <div
              class="anfasser hoch"
              title="Höhe ziehen · Doppelklick: Standard"
              @pointerdown=${e=>this.ziehe(e,`hoehe`)}
              @dblclick=${e=>this.aufStandard(e,`hoehe`)}
            ></div>
          `:b}
        </section>
      </div>
    `}};E([w()],P.prototype,`titel`,void 0),E([w({type:Number})],P.prototype,`breite`,void 0),E([w({type:Number})],P.prototype,`hoehe`,void 0),E([w({type:Boolean,reflect:!0})],P.prototype,`viewport`,void 0),E([w({type:Boolean,attribute:`escape-schliesst`})],P.prototype,`escapeSchliesst`,void 0),E([w({type:Boolean,attribute:`ohne-modal`})],P.prototype,`ohneModal`,void 0),E([w({type:Boolean,reflect:!0,attribute:`inhalt-fest`})],P.prototype,`inhaltFest`,void 0),E([w({type:Boolean,reflect:!0})],P.prototype,`ziehbar`,void 0),customElements.get(`ff-dialog-rahmen`)||customElements.define(Zt,P);var tn=`input,select,textarea,button,a[href],[tabindex]:not([tabindex="-1"])`;function nn(e){for(let t of Array.from(e.querySelectorAll(`*`))){if(t instanceof HTMLElement&&t.matches(tn)&&!t.hasAttribute(`disabled`))return t;let e=t.shadowRoot?nn(t.shadowRoot):null;if(e)return e}return null}var F=class extends D{constructor(...e){super(...e),this.name=`Popup`,this.breite=520,this.hoehe=380,this.offen=!1}static{this.blockType=`popup`}static{this.tagName=`ff-popup`}static{this.displayName=`Popup`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.showInPalette=!1}static{this.allowedParentTypes=[ot]}static{this.pageBlock=!0}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.defaultProps={name:`Popup`,breite:520,hoehe:380}}static{this.styles=[D.styles,o`

      :host { display: none; }
      :host([offen]),
      :host([data-ff-editor]) {
        display: block;
        position: absolute;
        inset: 0;
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
        ${a(et())};
      }

      .rumpf slot { display: contents; }
    `]}onClose(){this.hasAttribute(`data-ff-editor`)||this.removeAttribute(`offen`)}updated(e){super.updated(e),!(!e.has(`offen`)||!this.offen)&&(this.hasAttribute(`data-ff-editor`)||this.updateComplete.then(()=>{!this.offen||!this.isConnected||(nn(this)??(this.shadowRoot?nn(this.shadowRoot):null))?.focus()}))}render(){return v`<ff-dialog-rahmen
        .breite=${this.breite}
        .hoehe=${this.hoehe}
        ohne-modal
        inhalt-fest
        @ff-dialog-schliessen=${this.onClose}
      >
        <span
          slot="titel"
          class="titel"
          data-ff-editable
          @dblclick=${e=>this.inlineEdit(e,`name`)}
        >${this.name}</span>
        <div class="rumpf"><slot></slot></div>
      </ff-dialog-rahmen>`}};E([w()],F.prototype,`name`,void 0),E([w()],F.prototype,`breite`,void 0),E([w()],F.prototype,`hoehe`,void 0),E([w({type:Boolean,reflect:!0})],F.prototype,`offen`,void 0),D.defineAndRegister(F);var rn=[`GET_RELATION`,`PUT_RELATION`,`PUTADD_RELATION`];function an(e){return`${String(e.getDate()).padStart(2,`0`)}.${String(e.getMonth()+1).padStart(2,`0`)}.${e.getFullYear()}`}function on(e,t){return e.params.map(e=>e.replace(/\{([A-Za-z0-9_]+)\}/g,(e,n)=>String(t[n]??``)))}var sn=8e3,I=null,cn=null;function ln(){let e=document.createElement(`div`);return e.setAttribute(`data-ff-meldung`,``),e.setAttribute(`role`,`alert`),e.style.cssText=[`position:fixed`,`top:0`,`left:0`,`right:0`,`z-index:2147483647`,`padding:7px 12px`,`background:var(--se-red-soft,#fbe7e6)`,`color:var(--se-red,#c0201a)`,`border-bottom:1px solid var(--se-red,#c0201a)`,`font:500 12px/1.4 system-ui,sans-serif`,`cursor:pointer`].join(`;`),e.title=`Klicken zum Schließen`,e.addEventListener(`click`,un),e}function un(){cn&&=(clearTimeout(cn),null),I?.remove(),I=null}function L(e){typeof document>`u`||!document.body||(I||(I=ln(),document.body.appendChild(I)),I.textContent=e,cn&&clearTimeout(cn),cn=setTimeout(un,sn))}function R(){return globalThis}function dn(){let e=R();return O(e.SEDATA)&&O(e.SEDATA.Daten)}function fn(){let e=R();try{e.selib?.Json?.InitializeERPConnection?.()}catch{}try{typeof e.InitialisiereSchnittstelle==`function`&&e.InitialisiereSchnittstelle()}catch{}}function pn(){let e=R();try{typeof e.ResetDataBasis==`function`&&e.ResetDataBasis()}catch{}try{typeof e.InitialisiereDatenBasis==`function`&&e.InitialisiereDatenBasis()}catch{}}var mn=new Set,hn=new Set,gn=800,_n=!1,vn=!1,yn=null;function bn(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function xn(){let e=bn();return e instanceof HTMLElement?e.isContentEditable||e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement:!1}function Sn(){yn===null&&(yn=setInterval(()=>{if(xn()||(Cn(),!_n))return;_n=!1;let e=vn;vn=!1,mn.forEach(t=>{t(e)})},gn))}function Cn(){yn!==null&&(clearInterval(yn),yn=null)}function wn(e){mn.add(e)}function Tn(e){return hn.add(e),()=>{hn.delete(e)}}function z(e){if(e&&(vn=!0),xn()){_n=!0,Sn();return}_n=!1;let t=vn;vn=!1,mn.forEach(e=>e(t))}function En(){z(!0)}function Dn(){pn(),z(!1)}function On(){let e=R(),t=O(e.SEDATA)?e.SEDATA.Daten:void 0;if(!O(t))return!1;let n=Mn(t);return n!==``&&n===jn?!1:(jn=n,!0)}function kn(e){hn.forEach(t=>{try{t(e)}catch{}})}var An=2e6,jn=``;function Mn(e){try{let t=JSON.stringify(e);return t.length>An?``:t}catch{return``}}function Nn(e){let t=Ot(e);if(!t){kn(e);return}let n=R();O(n.SEDATA)||(n.SEDATA={}),n.SEDATA.Daten=t,pn();let r=Mn(t);r!==``&&r===jn||(jn=r,z(!0))}function Pn(e=0){let t=R();if(typeof t.basisHTML_REGISTER==`function`){try{t.basisHTML_SetConsoleLog?.(!0,!0)}catch{}try{t.basisHTML_REGISTER(e=>{Nn(e)},document.title,`1.0`)}catch(e){L(`SoftEngine-Anmeldung fehlgeschlagen: `+(e instanceof Error?e.message:String(e)))}return}e<400?setTimeout(()=>{Pn(e+1)},25):L(`SoftEngine-Anschluss nicht gefunden — die Maske bleibt ohne Daten.`)}var Fn=`ff-se-fokus`;function In(){R().basisHTML_DoSetFocusToHTML=()=>{let e=new CustomEvent(Fn,{cancelable:!0});return document.dispatchEvent(e),e.defaultPrevented}}var Ln=!1;function Rn(){if(Ln)return;Ln=!0,fn();let e=R();e.Erstellen=()=>{pn(),z(On())},e.initData=e.Erstellen,e.ReloadData=()=>{z(On())},In(),Pn(),window.addEventListener(`message`,e=>{if(typeof R().basisHTML_REGISTER==`function`)return;let t=kt(e.data);t!==void 0&&Nn(t)},!0);let t=0,n=setInterval(()=>{t+=1,dn()?(clearInterval(n),pn(),z(On())):t>100&&(clearInterval(n),L(`Keine Daten von SoftEngine empfangen — die Maske zeigt nichts an.`))},300)}function zn(e){return e instanceof Error?e.message:String(e)}function Bn(e,t){if(!(!Array.isArray(e)||t===``)){for(let n of e)if(!(!O(n)||n.id!==t)&&!(typeof n.verb!=`string`||!rn.includes(n.verb))&&!(typeof n.nr!=`string`||n.nr===``)&&!(!Array.isArray(n.params)||n.params.some(e=>typeof e!=`string`)))return{id:t,verb:n.verb,nr:n.nr,params:n.params}}}var Vn=[`RESULT`,`result`,`PINDEX`,`pindex`,`INDEX`,`index`,`0_10`,`KEY`,`key`,`ID`,`id`,`VALUE`,`value`];function Hn(e){if(typeof e!=`string`)return e;try{return JSON.parse(e)}catch{return}}function Un(e){if(typeof e==`string`){let t=e.trim();return t===``?void 0:t}if(typeof e==`number`||typeof e==`boolean`)return String(e)}function Wn(e,t){if(t>12)return;let n=Un(e);if(n!==void 0)return n;if(Array.isArray(e)){for(let n of e){let e=Wn(n,t+1);if(e!==void 0)return e}return}if(O(e)){for(let n of Vn){if(!(n in e))continue;let r=Wn(e[n],t+1);if(r!==void 0)return r}for(let n of Object.values(e)){let e=Wn(n,t+1);if(e!==void 0)return e}}}function Gn(e){let t=Hn(e);if(O(t)){for(let e of Vn){if(!(e in t))continue;let n=Wn(t[e],0);if(n!==void 0)return n}for(let e of Object.values(t))if(Array.isArray(e))for(let t of e){let e=Gn(t);if(e!==void 0)return e}else if(O(e)){let t=Gn(e);if(t!==void 0)return t}}}var Kn=[`RESULT`,`result`];function qn(e,t=0){if(t>12)return;let n=typeof e==`string`?Hn(e):e;if(Array.isArray(n)){for(let e of n){let n=qn(e,t+1);if(n!==void 0)return n}return}if(O(n)){for(let e of Kn){let t=n[e];if(typeof t==`string`)return t;if(typeof t==`number`||typeof t==`boolean`)return String(t)}for(let e of Object.values(n)){let n=qn(e,t+1);if(n!==void 0)return n}}}function Jn(e,t,n=0){if(t.trim()===``||n>12)return``;let r=typeof e==`string`?Hn(e):e;if(Array.isArray(r)){for(let e of r){let r=Jn(e,t,n+1);if(r!==``)return r}return``}if(!O(r))return``;let i=A(r,t);if(i!==``)return i;for(let e of Object.values(r)){let r=Jn(e,t,n+1);if(r!==``)return r}return``}function Yn(e){return O(e)?Object.keys(e).filter(e=>/^Message\d+$/.test(e)):[]}function Xn(e,t,n=!1){if(!O(e))return;let r=Yn(e).filter(e=>!t.has(e)).sort((e,t)=>Number(t.slice(7))-Number(e.slice(7)));for(let t of r){let r=n?qn(e[t]):Gn(e[t]);if(r!==void 0)return{wert:r,roh:e[t]}}}var Zn=[],Qn=!1,$n=6e3,er=100;function tr(){if(Qn||Zn.length===0)return;Qn=!0;let e=Zn.shift(),t=R(),n=new Set(Yn(t.SEDATA)),r=!1,i=(t,n,i)=>{r||(r=!0,o(),clearInterval(s),clearTimeout(l),Qn=!1,e.resolve(i===void 0?{wert:t,roh:n}:{wert:t,roh:n,fehler:i}),queueMicrotask(tr))},a=e.optionen.satzAntwort===!0,o=Tn(e=>{let t=a?qn(e):Gn(e);t!==void 0&&i(t,e)}),s=setInterval(()=>{let e=Xn(R().SEDATA,n,a);e!==void 0&&i(e.wert,e.roh)},er),c=t=>{e.optionen.still||L(t),i(``,void 0,t)},l=setTimeout(()=>{c(`Daten laden: SoftEngine hat nicht geantwortet (Relation Nr. ${e.template.nr}).`)},$n);if(typeof t.basisHTML_SND_MSG!=`function`){c(`Daten laden nicht möglich: keine Verbindung zu SoftEngine.`);return}try{t.basisHTML_SND_MSG(`GET_RELATION`,{NR:e.template.nr,PARAMS:e.params})}catch(t){c(`Daten laden fehlgeschlagen (Relation Nr. ${e.template.nr}): ${zn(t)}`)}}function nr(e,t,n={}){Rn();let r=R();if(e.verb!==`GET_RELATION`){if(typeof r.basisHTML_SND_MSG!=`function`){let e=`Speichern nicht möglich: keine Verbindung zu SoftEngine. Die Eingabe wurde NICHT übernommen.`;return L(e),Promise.resolve({wert:``,roh:void 0,fehler:e})}try{r.basisHTML_SND_MSG(e.verb,{NR:e.nr,PARAMS:[...t]})}catch(t){let n=`Speichern fehlgeschlagen (Relation Nr. ${e.nr}): ${zn(t)}`;return L(n),Promise.resolve({wert:``,roh:void 0,fehler:n})}return Promise.resolve({wert:``,roh:void 0})}return new Promise(r=>{Zn.push({template:e,params:[...t],resolve:r,optionen:n}),tr()})}function rr(e,t){if(!O(t))return``;let n=t.document;if(!n||typeof n.querySelectorAll!=`function`)return``;let r=Array.from(n.querySelectorAll(`[${lt}]`)).find(t=>t.getAttribute(lt)===e.blockId);if(!r)return``;let i=r[e.value];return i==null?``:String(i)}function ir(e,t,n=R()){if(e.source===`aus`)return``;if(e.source===`fixed`)return e.value;if(e.source===`context`)return t.context[e.value]??``;if(e.source===`previous_result`)return t.previousResult;if(e.source===`step_result`){let n=Number(e.value);if(!Number.isInteger(n)||n<0)return``;let r=e.ergebnisFeld??``;return r===``?t.stepResults?.[n]??``:Jn(t.stepRohErgebnisse?.[n],r)}if(e.source===`block_value`)return rr(e,n);if(e.source===`erfassungszelle`||e.source===`aenderungszelle`||e.source===`loeschzelle`){let n=Number(e.value);return!Number.isInteger(n)||n<0?``:t.zeilenZelle?.(e.blockId??``,n)??``}if(e.source===`gewaehlte_zeile`){let n=t.gewaehlteZeile?.(e.blockId??``);return n===void 0?``:A(n,e.value)}if(!O(n))return``;if(e.source===`se_variable`){let t=n.SEDATA;if(!O(t)||!O(t.Daten)||!O(t.Daten.VARArrays))return``;let r=t.Daten.VARArrays[e.value];return r==null?``:String(r)}let r=k(n.FF_DATA_SOURCES,e.dataSourceId??``);if(!r)return``;let i=Dt(n.SEDATA,r.name,r.tableId,r.offenerSatz),a=t.context.PINDEX??``,o=a!==``&&r.indexField!==``?i.find(e=>A(e,r.indexField)===a):i[0];return o?A(o,e.value):``}function ar(e,t){let n=`0,START_TOOL,`+e;return t.length>0&&(n+=`,`+t.map(e=>encodeURIComponent(e)).join(`,`)),n}function or(e){let t=e.trim();if(t===``)return;let n=R();try{if(typeof n.sendBWLink==`function`){n.sendBWLink(t);return}}catch{}try{typeof n.sendBWLinkIntern==`function`&&n.sendBWLinkIntern(t)}catch{}}function sr(e,t){if(e.trim()===``)return;let n=R();try{if(typeof n.sendBWLinkIntern==`function`){n.sendBWLinkIntern(ar(e,t));return}}catch{}try{if(typeof n.basisHTML_SND_MSG==`function`){let r={NR:e};t.length>0&&(r.PARAMS=[...t]),n.basisHTML_SND_MSG(`START_TOOL`,r)}}catch{}}function cr(e,t,n){if(t.trim()===``)return;let r=Array.from(e.querySelectorAll(F.tagName)),i=r.filter(e=>(e.getAttribute(`name`)??F.defaultProps.name)===t);if(i.length===0){L(`Fenster „`+t+`“ gibt es in dieser Maske nicht.`);return}if(i.length>1){L(`Fenster „`+t+`“ gibt es mehrfach — keines ist gemeint.`);return}let a=i[0];if(!n){a.removeAttribute(`offen`);return}for(let e of r)e!==a&&e.removeAttribute(`offen`);a.setAttribute(`offen`,``)}var lr=new WeakMap;function B(e){L(`Aktionskette fehlgeschlagen: `+(e instanceof Error?e.message:String(e)))}var ur={erfassungszelle:`erfasst`,aenderungszelle:`geaendert`,loeschzelle:`geloescht`};function dr(e){if(e.type!==`RELATION`)return null;let t=null;for(let n of[...e.params,...e.extraParams]){let e=ur[n.source],r=n.blockId??``;if(!(e===void 0||r===``)){if(t&&(t.art!==e||t.blockId!==r))return{art:e,blockId:``};t={art:e,blockId:r}}}return t}function fr(e){let t=[];for(let[n,r]of e.entries()){let e=dr(r),i=t[t.length-1];if(e===null){i?i.plaetze.add(n):t.push({art:`einmal`,blockId:``,plaetze:new Set([n])});continue}if(i&&i.art===e.art&&i.blockId===e.blockId){i.plaetze.add(n);continue}t.push({art:e.art,blockId:e.blockId,plaetze:new Set([n])})}return t}function pr(e,t){return Array.from(e.querySelectorAll(`[${lt}]`)).find(e=>e.getAttribute(lt)===t)}function mr(e,t){if(t===`erfasst`){let t=e.erfassteZeilen;if(!Array.isArray(t))return;let n=e.erfassteSchluessel;return t.map((e,t)=>({satz:``,schluessel:Array.isArray(n)?n[t]??String(t):String(t),werte:e}))}let n=t===`geaendert`?e.geaenderteZeilen:e.geloeschteZeilen;if(Array.isArray(n))return n.map(e=>({satz:e.satz,schluessel:e.satz,werte:e.werte}))}function hr(e,t,n){return n.satz===``?e:t===`geloescht`?{...e,PINDEX:n.satz,DROP_PINDEX:n.satz}:{...e,PINDEX:n.satz}}async function gr(e,t,n,r,i,a){let o=!1,s={...a?.values,...n,NOW_DATE:an(new Date)},c=a?.previousResult??``,l=t.map((e,t)=>a?.stepResults[t]??``),u=t.map((e,t)=>a?.rohErgebnisse[t]),d=()=>({values:s,stepResults:l,rohErgebnisse:u,previousResult:c});for(let[n,a]of t.entries()){if(i&&!i.has(n))continue;if(a.type===`START_TOOL`){sr(a.toolNr,on({params:a.toolParams},s));continue}if(a.type===`BW_LINK`){or(on({params:[a.befehl]},s)[0]??``);continue}if(a.type===`POPUP_OPEN`||a.type===`POPUP_CLOSE`){cr(e.ownerDocument??document,a.popup??``,a.type===`POPUP_OPEN`);continue}let t=Bn(R().FF_RELATIONS,a.relationId);if(!t)continue;let f={context:s,previousResult:c,stepResults:l,stepRohErgebnisse:u,gewaehlteZeile:zt,...r?{zeilenZelle:r}:{}},p=await nr(t,[...a.params,...a.extraParams].map(e=>ir(e,f))),ee=p.wert;if(l[n]=ee,u[n]=p.roh,t.verb===`GET_RELATION`?c=ee:o=!0,p.fehler!==void 0&&p.fehler!==``)return{geschrieben:o,fehler:p.fehler,mitschrift:d()};a.resultKey!==``&&(s[a.resultKey]=ee)}return{geschrieben:o,fehler:``,mitschrift:d()}}async function V(e,t,n){if(e.hasAttribute(`data-ff-editor`))return;let r=mt(e.getAttribute(`data-ff-aktionen`))[t];if(!r||r.length===0)return;let i=lr.get(e);if(i||(i=new Set,lr.set(e,i)),!i.has(t)){i.add(t);try{let t=fr(r),i=[],a=!1,o=!1,s;for(let c of t){if(c.art===`einmal`){let t=await gr(e,r,n,void 0,c.plaetze,s);if(s=t.mitschrift,t.geschrieben&&(a=!0),t.fehler!==``){o=!0;break}continue}if(c.blockId===``){L(`Ein Schritt liest Zellen aus zwei verschiedenen Listen — das geht nicht.`);break}let t=pr(e.ownerDocument??document,c.blockId),l=t&&mr(t,c.art);if(!t||!l){L(`Den Baustein, dessen Zellen die Kette liest, gibt es in dieser Maske nicht.`);break}if(l.length===0)continue;let u={traeger:t,art:c.art,fertige:[]};i.push(u);for(let i of l){t.zeileSchreibt?.(c.art,i.schluessel);let l=await gr(e,r,hr(n,c.art,i),(e,t)=>e===c.blockId?String(i.werte[t]??``):``,c.plaetze,s);if(l.geschrieben&&(a=!0),l.fehler!==``){t.zeileGescheitert?.(c.art,i.schluessel,l.fehler),o=!0;break}u.fertige.push(i.schluessel)}if(o)break}for(let{traeger:e,art:t,fertige:n}of i)e.laufFertig?.(t,n);a&&Dn()}finally{i.delete(t)}}}var _r=new WeakSet;function vr(e,t){if(e.hasAttribute(`data-ff-editor`)||!e.hasAttribute(`data-ff-aktionen`)||_r.has(e))return;_r.add(e);let n=mt(e.getAttribute(`data-ff-aktionen`));Object.values(n).some(e=>e.some(e=>e.type===`RELATION`))&&Rn(),e.addEventListener(`click`,()=>{V(e,t,{}).catch(B)})}var yr=`ff-vormerkungen`;function br(e,t,n){let r=[];return e>0&&r.push(e===1?`1 neue Zeile`:`${e} neue Zeilen`),t>0&&r.push(t===1?`1 geänderte Zeile`:`${t} geänderte Zeilen`),n>0&&r.push(n===1?`1 Löschung`:`${n} Löschungen`),r.length===0?``:`${r.join(`, `)} vorgemerkt`}function xr(e){return e.erfasst+e.geaendert+e.geloescht}function Sr(e,t){return t===`erfasst`?e.erfassteZeilen?.length??0:t===`geaendert`?e.geaenderteZeilen?.length??0:e.geloeschteZeilen?.length??0}function Cr(e,t){let n=mt(e.getAttribute(`data-ff-aktionen`))[t];if(!n||n.length===0)return;let r={erfasst:0,geaendert:0,geloescht:0},i=new Set;for(let t of fr(n)){if(t.art===`einmal`||t.blockId===``)continue;let n=t.art+` `+t.blockId;if(i.has(n))continue;let a=pr(e.ownerDocument??document,t.blockId);a&&(i.add(n),r[t.art]+=Sr(a,t.art))}return i.size===0?void 0:r}var wr=new WeakMap;function Tr(e){let t=[Sr(e,`erfasst`),Sr(e,`geaendert`),Sr(e,`geloescht`)].join(` `);wr.get(e)!==t&&(wr.set(e,t),e.dispatchEvent(new CustomEvent(yr,{bubbles:!0,composed:!0})))}var Er=class extends D{constructor(...e){super(...e),this.label=`Klick mich`,this.vormerkungen=void 0,this.zaehleVormerkungen=()=>{this.vormerkungen=Cr(this,`onClick`)}}static{this.blockType=`button`}static{this.tagName=`ff-button`}static{this.displayName=`Schaltfläche`}static{this.category=`eingabe`}static{this.defaultProps={label:`Klick mich`}}static{this.resizableWidth=!1}static{this.blockEvents=[{key:`onClick`,name:`Klick`}]}static{this.raster={startW:4,startH:2,minW:2,minH:2}}static{this.customProperties=[]}static{this.styles=[D.styles,o`
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

      button:disabled { cursor: default; opacity: 0.5; }
      button:disabled:hover { background: var(--se-accent); border-color: var(--se-accent); }

      :host([fuellt]) button { width: 100%; height: 100%; }
    `]}render(){let e=this.vormerkungen,t=e===void 0?0:xr(e);return v`<button
      data-ff-editable
      ?disabled=${e!==void 0&&t===0}
      title=${e===void 0||t===0?b:br(e.erfasst,e.geaendert,e.geloescht)}
      @dblclick=${e=>this.inlineEdit(e,`label`)}
    >${e===void 0?this.label:`${this.label} (${t})`}</button>`}connectedCallback(){super.connectedCallback(),vr(this,`onClick`),!this.hasAttribute(`data-ff-editor`)&&(document.addEventListener(yr,this.zaehleVormerkungen),this.zaehleVormerkungen())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(yr,this.zaehleVormerkungen)}};E([w()],Er.prototype,`label`,void 0),E([w({attribute:!1})],Er.prototype,`vormerkungen`,void 0),D.defineAndRegister(Er);var Dr=[`info`,`success`,`warning`,`danger`];function Or(e){return Dr.includes(e)?e:`info`}var kr=[{wert:`info`,name:`Hinweis`},{wert:`success`,name:`Erfolg`},{wert:`warning`,name:`Warnung`},{wert:`danger`,name:`Fehler`}];function Ar(e,t){return{attributeName:e,name:`Bedeutung`,description:t,kind:`select`,options:kr.map(e=>({value:e.wert,label:e.name}))}}var jr=o`

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px 5px 9px;
    border-radius: var(--se-r-sm);

    clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%);
    font-family: var(--se-font);
    font-size: var(--se-fs-sm);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.02em;
    color: var(--se-ink);
    background: var(--se-panel-2);
    white-space: nowrap;
  }

  .chip::before {
    content: '';
    flex: none;
    width: 6px;
    height: 6px;
    background: var(--chip-punkt, var(--se-faint));
  }
  .chip.v-info { background: var(--se-blue-soft); --chip-punkt: var(--se-blue); }
  .chip.v-success { background: var(--se-green-soft); --chip-punkt: var(--se-green); }
  .chip.v-warning { background: var(--se-amber-soft); --chip-punkt: var(--se-amber); }
  .chip.v-danger {
    background: var(--se-red);
    color: var(--se-panel);
    --chip-punkt: var(--se-panel);
  }
`,Mr=Oe`<circle cx="6.8" cy="9.6" r="1.9"></circle><circle cx="10.4" cy="7.2" r="1.9"></circle><circle cx="14.6" cy="7.2" r="1.9"></circle><circle cx="18.2" cy="9.6" r="1.9"></circle><path d="M12.5 11.2c-2.9 0-5.3 2.1-5.3 4.4 0 1.7 1.3 2.9 3.1 2.9.9 0 1.5-.3 2.2-.3s1.3.3 2.2.3c1.8 0 3.1-1.2 3.1-2.9 0-2.3-2.4-4.4-5.3-4.4z"></path>`;function Nr(){return v`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${Mr}</svg>`}var Pr={hund:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABgFBMVEUAAADjhTlGJxb868rdgjj+9tU5HBDPeDI9IBSxZipVAACRVydYMxpCJBVoOxzGbChzRyVSNibt17Y+AAA8IRR/AADqlUk7IBQsGhXskT0zHBRAIxU5IRWtWyKJSRw9IRM2HRNyQR16ZVM/PwDuuYjRw6ngfi+8cjKCTiQ4HhNwWUjzxZWbiXWLd2S6qJBcQzPvtHzDs5w7IRSsm4XszKiHcVzr3cAZGRmhjnk+IhTMvKTtq25CHQwkJCRAIxVoUD/94r01IxWdUR6jkXzd0bb/AADnnWEnCAB/f38AADPxolfmjkXAr5jWoHTck1WjVB6CbVqfYSzlroFnTkBgPCBVVVVVVQBKLiBAJBZIJAAzM2Y/Pz85HxIA//8AVVUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwq9e+AAAAgHRSTlMA/vz+/v79/v3+A/380P3+/f7+BI8C/nIT/i6wTf3+rlP9/QT+/v7+/W79/v7+/v3+/jj+/v7+Cv7M/v79B5z+/hb+/f4B/v4DBf7+//7+/v3+/vz+AwP6fgcFBJgBAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhSaaIAAAWySURBVHja7Zhnd+MqEIYBS4AsVN17T3Gcns3Wu73d3nv5/z/jzgCSbMdxkj1nv2WSE1kyPLwMw2gIIfd2b5/ZypVKbelz+dMoFXv96yEhX2S08h1ETCqVSbmMSprdxvNOEDCwIOhUG2dNzaqYdtuYywO2G5rArUm8YZ0ussivf2/VhyM1zxpVsG53gBDJwnjP1xaPFJMcpO0PnwdgnT+6r5bmv6yGkIe6uzXOQn9X0MIc4e0pzqxMrW9o+q2paeJcQIRSCjG+hjiF6VsvBETo78Wh0ddoE1LLV5bUEMPgK+V7wqF7ko+EgdBlSfrWY1zhGKAPh2XVdqEKroiRoQctHepxHmM3etWQJTTJMfpAOuuckZrltB/DZEIvbxhSugljUHSXwUB2tmIPUVVNKpN9wCiLgYlxJq7lIIr6XHpwsSifSfYPUDSH+RajBfnbOEhSoFk3NihYyy5GHnCExTs4HBOUbgd5WpLWb5zBHsMmeowcoZ/iFwo9fZNhIyfD6sGHZIhTEU4GAk9622dmvKQnQY0olFQl1WJieRN6Ewgc+SPNukBfxTokYGHhIIeGhehtpBEf5SD4jWVAbFAUQ/m3AXl5jFgQI9JGlwk2aLB7M4jigN4aaFWRz5WTh/A1e0Q3zF2QgwIZ0kzQ7VzkrCyKvgvBRwFTNk2shLXw/U2r5/meWfFdJntatV4lxQZLy49hLaWZui8hu/pXtMSY0rQTHb1NTAybOGpot5lHO6EWrH2OidBbA8X4WCrjFs4iuxmoJyGy24zvWUU00hnEOA+7rG0WxyRhIxrG6gu74cBhkN4KJ4nXmYtGS6AdMLGzo9ecWaG45xkkQmFmp1hASDE34YVSL4UeAnvAJqT1k4OLi4PpewooZRSZNjC37z3HBl8D30Awa71OvR4MYieBrwv+C915n7rWSlNYKik13iwg5mYPoTA+zOw3WDccOupBBs4XyvGV8h16AAAw8yet091YhdkKOErKvteLBMgf6PzfBLnwxOtLqVZip54CwaDw4rrTFd/3QF6/1+vDpY1JuwwpibHRaxDIesugKShxS+fjOEmS+HDmGlGFRX3wF1PQbWheSGX9MoIfPorEmpxSzLNX70LfL4mKImUqgmH2YgNNpmDoF6Cn2jHuOU8SePOqJGEs1U/Sr5dALKh2Gs3itQ0TPOt2mSwUnVgvn7PEClJJah1fXwJ1yOrrX3+EPJCBnhoPQ6/EkJKEH2bP0hzE2GDy51pBUqvUIMQtqF6ynUruTHMU4+NSZtniRR7u1cl6WTPBPOBF0KAFE9MLbnwyRlTyxtyZAXByLSeC9e9erZAqpAuBGTktAOkFSxep7Tvmj2xMzt7oy1No0xIR7MhXmyo22CvgpFarVX+JoEcfHtlYPOSn9tP8wxP86oDWW7AXoD4itU0l20DPDUC60xGf2+4P+JHdJAm7yECO8CXbv+oiXd1AAAhRN6BS6Zgv3GWQ6475WH9AEApizY3FaA0kSdgkLbNo7hPGD/Ue0yDXTefcxBKChOhzEFTZDMLCxBN1akPvNOHHixn66Mi9nC3g7q354gQ8BOk1aNauKbOhVJKhEHRqnZOOoeJM5sfsxTyBrH+YhddXwIExu+S6oh39zYFUz4LYnR0eQzGMvy8Wb7OMkiJHQjBeX/y/awZAiqJpHtluKX3yzdHpLHXd/Nl3mjPY7KA8mIAEfkrdYkfYVJvf/xRh2Tj4r7b9VNPsQKu+eFn0XDV36uE7pnqLA1IV05x/4W5AgbJv+1gQ75PaLUiY5jh7MCutTgns8ih+hiV6m9zm4FYmDxv65JL8cD67zH2Uni7muHwsGBJyuwMgttoPzCno9+Of5+PxeB4n9kw06H55l8Ms1t9VncjZM33we2YOfngaIuU7n2jhLFrtBMbgKNrGPfruzkfkWp4h/v34MU/In3xen+RnscmkfP8PjHv73PY/Vudos2soPWAAAAAASUVORK5CYII=`,katze:`data:image/png;base64,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`,kaninchen:`data:image/png;base64,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`,hamster:`data:image/png;base64,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`,meerschweinchen:`data:image/png;base64,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`,vogel:`data:image/png;base64,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`,schildkroete:`data:image/png;base64,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`,fisch:`data:image/png;base64,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`,schlange:`data:image/png;base64,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`,pferd:`data:image/png;base64,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`},Fr=[[`welpe`,`hund`],[`hund`,`hund`],[`kater`,`katze`],[`katze`,`katze`],[`kaninchen`,`kaninchen`],[`hase`,`kaninchen`],[`meerschwein`,`meerschweinchen`],[`hamster`,`hamster`],[`ratte`,`hamster`],[`maus`,`hamster`],[`wellensittich`,`vogel`],[`sittich`,`vogel`],[`papagei`,`vogel`],[`vogel`,`vogel`],[`schildkr`,`schildkroete`],[`schlange`,`schlange`],[`natter`,`schlange`],[`python`,`schlange`],[`echse`,`schlange`],[`gecko`,`schlange`],[`reptil`,`schlange`],[`fisch`,`fisch`],[`koi`,`fisch`],[`pferd`,`pferd`],[`pony`,`pferd`],[`fohlen`,`pferd`]];function Ir(e){let t=e.toLowerCase();for(let[e,n]of Fr)if(t.includes(e))return n;return``}function Lr(e){let t=Ir(e),n=t===``?void 0:Pr[t];if(n!==void 0)return v`<img src=${n} alt="" aria-hidden="true" />`}function Rr(e){return Lr(e)??Nr()}var zr=o`

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
      .avatar img,
      .avatar svg {
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
`,H=class extends D{constructor(...e){super(...e),this.chipVariant=`info`,this.heading=``,this.heading2=``,this.time=``,this.date=``,this.avatar=``,this.meta=``,this.text=``,this.chipText=``,this.headingField=``,this.heading2Field=``,this.timeField=``,this.dateField=``,this.avatarField=``,this.metaField=``,this.textField=``,this.chipTextField=``}static{this.blockType=`card`}static{this.tagName=`ff-card`}static{this.displayName=`Karte`}static{this.category=`anzeige`}static{this.allowedParentTypes=[`kanban-spalte`,`kanban-zimmer`]}static{this.showInPalette=!1}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={chipVariant:`info`,heading:``,heading2:``,time:``,date:``,avatar:``,meta:``,text:``,chipText:``,headingField:``,heading2Field:``,timeField:``,dateField:``,avatarField:``,metaField:``,textField:``,chipTextField:``}}static{this.bindableSpots=[{prop:`time`,label:`Zeit`},{prop:`date`,label:`Datum`},{prop:`avatar`,label:`Avatar`},{prop:`heading`,label:`Titel`},{prop:`heading2`,label:`Titel 2`},{prop:`meta`,label:`Unterzeile`},{prop:`text`,label:`Textzeile`},{prop:`chipText`,label:`Chip`}]}static{this.customProperties=[Ar(`chipVariant`,`Bedeutung des Chips auf der Karte — bestimmt die Chip-Farbe.`)]}static{this.styles=[D.styles,jr,zr]}stelle(e,t){return v`<span
      class=${t}
      data-ff-editable
      data-ff-spot=${e}
      ?data-ff-bound=${this[`${e}Field`]!==``}
      @dblclick=${t=>this.inlineEdit(t,e)}
    >${this[e]}</span>`}hatReiter(){return this.hasAttribute(`data-ff-editor`)||this.date.trim()!==``||this.time.trim()!==``}updated(e){super.updated(e),this.toggleAttribute(`hat-reiter`,this.hatReiter())}render(){let e=Or(this.chipVariant),t=this.hasAttribute(`data-ff-editor`),n=e=>t||e.trim()!==``,r=this.hatReiter(),i=n(this.avatar)||n(this.heading)||n(this.meta),a=n(this.heading2)||n(this.chipText);return v`<div class="card v-${e}${r?``:` ohne-reiter`}">
      ${r?v`<span class="reiter">
            ${n(this.date)?this.stelle(`date`,`datum`):b}
            ${n(this.time)?this.stelle(`time`,`zeit`):b}
          </span>`:b}
      ${i?v`<div class="kopf">
            ${n(this.avatar)?v`<span
                  class="avatar"
                  data-ff-spot="avatar"
                  ?data-ff-bound=${this.avatarField!==``}
                >${this.avatar.trim()===``?b:Rr(this.avatar)}</span>`:b}
            <div class="namen">
              ${n(this.heading)?this.stelle(`heading`,`name`):b}
              ${n(this.meta)?this.stelle(`meta`,`zusatz`):b}
            </div>
          </div>`:b}
      ${n(this.text)?this.stelle(`text`,`grund`):b}
      ${a?v`<div class="fuss">
            ${n(this.heading2)?this.stelle(`heading2`,`fussl`):b}
            ${n(this.chipText)?v`<span
                  class="chip v-${e}"
                  data-ff-editable
                  data-ff-spot="chipText"
                  ?data-ff-bound=${this.chipTextField!==``}
                  @dblclick=${e=>this.inlineEdit(e,`chipText`)}
                >${this.chipText}</span>`:b}
          </div>`:b}
    </div>`}};E([w()],H.prototype,`chipVariant`,void 0),E([w()],H.prototype,`heading`,void 0),E([w()],H.prototype,`heading2`,void 0),E([w()],H.prototype,`time`,void 0),E([w()],H.prototype,`date`,void 0),E([w()],H.prototype,`avatar`,void 0),E([w()],H.prototype,`meta`,void 0),E([w()],H.prototype,`text`,void 0),E([w()],H.prototype,`chipText`,void 0),E([w()],H.prototype,`headingField`,void 0),E([w()],H.prototype,`heading2Field`,void 0),E([w()],H.prototype,`timeField`,void 0),E([w()],H.prototype,`dateField`,void 0),E([w()],H.prototype,`avatarField`,void 0),E([w()],H.prototype,`metaField`,void 0),E([w()],H.prototype,`textField`,void 0),E([w()],H.prototype,`chipTextField`,void 0),D.defineAndRegister(H);function Br(e){let t=String(e??``).trim();if(t===``)return``;let n=/^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(t);if(n)return`${n[3]}-${n[2].padStart(2,`0`)}-${n[1].padStart(2,`0`)}`;let r=/^(\d{4})-(\d{2})-(\d{2})/.exec(t);return r?`${r[1]}-${r[2]}-${r[3]}`:``}function Vr(e){let t=String(e.getMonth()+1).padStart(2,`0`),n=String(e.getDate()).padStart(2,`0`);return`${e.getFullYear()}-${t}-${n}`}function Hr(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n)return``;let r=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return r.setDate(r.getDate()+t),Vr(r)}var Ur=``,Wr=new Set;function Gr(){return Ur}function Kr(e){let t=Br(e);t!==Ur&&(Ur=t,Wr.forEach(e=>e()))}function qr(e){return Wr.add(e),()=>{Wr.delete(e)}}var Jr=class extends D{constructor(...e){super(...e),this.tag=``,this.tagAbmelden=null}static{this.blockType=`datum`}static{this.tagName=`ff-datum`}static{this.displayName=`Datum`}static{this.category=`anzeige`}static{this.defaultProps={}}static{this.customProperties=[]}static{this.raster={startW:9,startH:2,minW:5,minH:2}}static{this.styles=[D.styles,o`

      .waehler {
        --tag-h: 34px;

        --tag-feld-min: 112px;
        display: flex;
        align-items: stretch;
        gap: var(--se-gap-sm);
        height: var(--tag-h);
        font-family: var(--se-font);
      }

      .riegel {
        box-sizing: border-box;
        display: flex;
        align-items: stretch;
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 2px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
      }

      .pfeil {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        padding: 0;
        border: none;
        border-radius: var(--se-r-sm);
        background: transparent;
        color: var(--se-muted);
        font-family: var(--se-font);
        font-size: var(--se-fs-lg);
        line-height: 1;
        cursor: pointer;
      }
      .pfeil:hover { background: var(--se-panel-2); color: var(--se-ink); }

      .feld {
        box-sizing: border-box;

        flex: 1;
        min-width: var(--tag-feld-min);
        border: none;
        background: transparent;
        padding: 0 2px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;
        color: var(--se-ink);
        text-align: center;
      }
      .feld:focus { outline: none; }

      .heute {
        box-sizing: border-box;
        flex: none;
        height: 100%;
        padding: 0 9px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        color: var(--se-ink);
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        font-weight: 550;
        white-space: nowrap;
        cursor: pointer;
      }
      .heute:hover { border-color: var(--se-accent); color: var(--se-accent); }

      :host { container-type: inline-size; }
      @container (max-width: 210px) {
        .heute { display: none; }
      }
      @container (max-width: 160px) {
        .waehler { --tag-feld-min: 80px; }
      }

      :host([data-ff-editor]) .feld,
      :host([data-ff-editor]) .pfeil,
      :host([data-ff-editor]) .heute { pointer-events: none; }

      :host([fuellt]) .waehler { height: 100%; }
    `]}setzeTag(e){Kr(e),this.tag=Gr()}render(){return v`<div class="waehler">
      <div class="riegel">
        <button class="pfeil" title="Vortag" @click=${()=>this.setzeTag(Hr(this.tag,-1))}>‹</button>
        <input
          class="feld"
          type="date"
          .value=${this.tag}
          @change=${e=>this.setzeTag(e.target.value)}
        />
        <button class="pfeil" title="Folgetag" @click=${()=>this.setzeTag(Hr(this.tag,1))}>›</button>
      </div>
      <button class="heute" @click=${()=>this.setzeTag(Vr(new Date))}>Heute</button>
    </div>`}connectedCallback(){super.connectedCallback(),this.tag=Gr()||Vr(new Date),!this.hasAttribute(`data-ff-editor`)&&(this.setzeTag(this.tag),this.tagAbmelden?.(),this.tagAbmelden=qr(()=>{this.tag=Gr()}))}disconnectedCallback(){super.disconnectedCallback(),this.tagAbmelden?.(),this.tagAbmelden=null}};E([T()],Jr.prototype,`tag`,void 0),D.defineAndRegister(Jr);function Yr(e){return e.trim().toLowerCase().split(/\s+/).filter(e=>e!==``)}function Xr(e,t){let n=Yr(t);if(n.length===0)return!0;let r=e.join(` `).toLowerCase();return n.every(e=>r.includes(e))}function Zr(e,t,n=8){if(t.trim()===``)return[];let r=[];for(let i of e)if(Xr([i.anzeige,i.wert],t)&&(r.push(i),r.length>=n))break;return r}function Qr(e,t,n){return t<=0?0:((e+n)%t+t)%t}function $r(e,t){return t<=0||e<0||e>=t?0:e}function ei(e,t){return e===`ArrowDown`?t.listeOffen?`marke-runter`:`nichts`:e===`ArrowUp`?t.listeOffen?`marke-hoch`:`nichts`:e===`Escape`?t.listeOffen?`liste-zu`:`nichts`:e===`Enter`?t.listeOffen?t.markeVonHand||t.treffer===1?`uebernehmen`:`fenster`:t.feldLeer?`fenster`:`nichts`:`nichts`}function ti(e){return v`<ul
    class="vorschlaege"
    @mousedown=${e=>e.preventDefault()}
  >${e.eintraege.map((t,n)=>v`<li
      class=${n===e.marke?`vorschlag marke`:`vorschlag`}
      @click=${()=>e.onWaehlen(n)}
      @mouseenter=${()=>e.onMarke(n)}
    ><span class="vorschlag-anzeige">${t.anzeige===``?t.wert:t.anzeige}</span>${t.wert!==``&&t.wert!==t.anzeige?v`<span class="vorschlag-wert">${t.wert}</span>`:b}</li>`)}</ul>`}var ni=o`
  .vorschlaege {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 3;
    max-height: 240px;
    overflow: auto;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    background: var(--se-panel);
    border: var(--se-border) solid var(--se-accent);
    border-radius: var(--se-r-md);
    font-family: var(--se-font);
    font-size: var(--se-fs);
    color: var(--se-ink);
  }

  .vorschlag {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--se-gap);
    padding: 4px 10px;
    white-space: nowrap;
    cursor: pointer;
  }
  .vorschlag + .vorschlag { border-top: 1px solid var(--se-line-soft); }

  .vorschlag-anzeige { overflow: hidden; text-overflow: ellipsis; }

  .vorschlag-wert {
    flex: none;
    color: var(--se-muted);
    font-size: var(--se-fs-sm);
  }

  .vorschlag.marke { background: var(--se-accent-soft); }
`;function U(e,t,n,r){return{attributeName:e,name:t,description:n,kind:`segment`,options:[{value:`nein`,label:`Nein`},{value:`ja`,label:`Ja`}],...r}}var ri={attributeName:`fieldType`,equals:`nachschlagen`},ii=[{attributeName:`fieldType`,name:`Feldtyp`,description:`Welche Art Eingabe das Feld annimmt.`,kind:`select`,options:[{value:`text`,label:`Text`},{value:`number`,label:`Zahl`},{value:`textarea`,label:`Mehrzeilig`},{value:`select`,label:`Auswahl`},{value:`date`,label:`Datum`},{value:`time`,label:`Uhrzeit`},{value:`checkbox`,label:`Ankreuzfeld`},{value:`nachschlagen`,label:`Nachschlagen`}]},{attributeName:`options`,name:`Auswahl-Optionen`,description:`Einträge durch Komma getrennt, z. B. "Zimmer 1, Zimmer 2".`,kind:`text`,visibleWhen:{attributeName:`fieldType`,equals:`select`}},{attributeName:`nachschlagQuelle`,name:`Quelle`,description:`Quelle, aus der der Bediener eine Zeile wählt.`,kind:`quelle`,visibleWhen:ri},{attributeName:`speicherFeld`,name:`Gespeichert wird`,description:`Feld, dessen Wert die Maske sich merkt (z. B. die Nummer).`,kind:`field`,quelleProp:`nachschlagQuelle`,klarnameProp:`speicherTitel`,visibleWhen:ri},U(`einzigerTreffer`,`Einzigen Treffer übernehmen`,`Bleibt genau ein Satz übrig, übernimmt das Feld ihn von selbst.`,{visibleWhen:ri}),{attributeName:`valueField`,name:`Feld`,description:`Feld, dessen Wert angezeigt wird.`,kind:`field`,visibleWhen:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]}}];function ai(e){let t=e.split(`::`);if(t.length!==2)return{quelleId:``,code:e};let[n,r]=t;return n===``||r===``?{quelleId:``,code:e}:{quelleId:n,code:r}}function oi(e,t){let n=t[e.key];return typeof n==`string`&&e.optionen.some(e=>e.wert===n)?n:e.standard}function si(e,t){let n=t[e.key];return typeof n==`boolean`?n:e.standard===!0}function ci(e,t){let n=e.eintragsSchalter??[],r=e.eintragsWahl,i=r?oi(r,t):void 0,a=t[e.feldKey],o=typeof a==`string`&&ai(a).quelleId!==``;return n.filter(e=>e.nurEigeneQuelle===!0&&o?!1:e.nurBeiWahl===void 0||i===void 0||e.nurBeiWahl.includes(i))}function li(e){return`${e.toLowerCase()}field`}var ui=999,di=`0`,fi=`255`,pi=new Map;function mi(e){let t=bt(e);yt(e,[]),t!==void 0&&t.length>0&&En()}async function hi(e,t,n,r,i){return(await nr({id:`relation-lader`,verb:`GET_RELATION`,nr:e.nr,params:[]},[t.belegart,r,i,t.belegnummer,t.jahr,t.archiv,``,String(n),``,``,``,``],{still:!0,satzAntwort:!0})).wert}function gi(e,t,n){let r=(pi.get(e.id)??0)+1;if(pi.set(e.id,r),n===void 0){mi(e.name);return}let i={belegart:A(n,t.belegartFeld),belegnummer:A(n,t.belegnummerFeld),jahr:t.jahrFeld===``?``:A(n,t.jahrFeld),archiv:t.archivFeld===``?``:A(n,t.archivFeld)};if(i.belegart===``||i.belegnummer===``){mi(e.name);return}mi(e.name),(async()=>{let n=[],a=!1;for(let o=1;o<=ui;o+=1){let s=await hi(t,i,o,di,fi);if(pi.get(e.id)!==r)return;if(t.endeFelder.every(e=>A({SATZ:s},e)===``)){a=!0;break}let c={SATZ:s};for(let n of t.zusatzFelder){let a=n.indexOf(`_`),s=await hi(t,i,o,n.slice(0,a),n.slice(a+1));if(pi.get(e.id)!==r)return;c[n]=s}n.push(c)}a||L(`Positionen laden: nach ${ui} Zeilen ohne Ende-Kennung abgebrochen (Relation Nr. ${t.nr}) — die Liste ist wahrscheinlich unvollständig, vermutlich passen Relationsnummer oder Ende-Felder nicht.`),pi.get(e.id)===r&&(yt(e.name,n),En())})()}var _i=new Map,vi=!1;function yi(){let e=new Map;for(let t of Je())t.satzWahl&&e.set(t.tagName.toLowerCase(),(t.satzWahl.quelleProp??`source`).toLowerCase());return e}function bi(e,t,n=typeof document>`u`?void 0:document){if(e===``||n===void 0)return;let r=null;for(let i of Array.from(n.querySelectorAll(`[data-ff-id]`))){let n=t.get(i.tagName.toLowerCase());if(n===void 0||i.getAttribute(n)!==e)continue;let a=i.getAttribute(`data-ff-id`)??``,o=zt(a);if(o===void 0)continue;let s=Vt(a);(r===null||s>r.nummer)&&(r={zeile:o,nummer:s})}return r?.zeile}function xi(){let e=R().FF_DATA_SOURCES;if(!Array.isArray(e))return;let t=yi();for(let n of e){if(!O(n)||typeof n.id!=`string`)continue;let r=k(e,n.id);if(!r?.ladeRelation)continue;let i=bi(r.ladeRelation.geberQuelleId,t),a=jt(i);_i.get(r.id)!==a&&(_i.set(r.id,a),gi(r,r.ladeRelation,i))}}function Si(){vi||(vi=!0,Rt(xi),Kt(()=>_i.clear()))}function Ci(e){let t=new Set,n=!1,r=n=>{dn()&&t.forEach(t=>{e.hydriere(t,n)})};return{connect:i=>{i.hasAttribute(`data-ff-editor`)||(t.add(i),e.verdrahte?.(i),n||(n=!0,wn(r),qr(()=>{r(!1)}),Rt(()=>{r(!1)}),Si()),Rn(),dn()&&e.hydriere(i,!1))},disconnect:e=>{t.delete(e)}}}var wi=tt.toLowerCase(),Ti=``;function Ei(e){if(e.length===0)return``;let t=[];for(let n of e){let e=n.trim();if(e===``)return``;t.push(e)}return t.join(Ti)}function Di(e){return At(e,wi,`quelleId`,{ohnePaareBehalten:!0}).map(e=>({quelleId:e.id,partnerId:e.partnerId,keyPairs:e.keyPairs}))}function Oi(e){let t=Di(e);if(t.length===0)return(e,t)=>A(e,ai(t).code);let n=R().SEDATA,r=R().FF_DATA_SOURCES,i=new Map;for(let e of t){if(e.keyPairs.length===0)continue;let t=k(r,e.quelleId);if(!t)continue;let a=Dt(n,t.name,t.tableId,t.offenerSatz),o=new Map;for(let t of a){let n=Ei(e.keyPairs.map(e=>A(t,e.toField)));n!==``&&!o.has(n)&&o.set(n,t)}i.set(e.quelleId,{nachSchluessel:o,partnerId:e.partnerId,hierFelder:e.keyPairs.map(e=>e.fromField)})}let a=(e,t,n)=>{if(e===``)return t;let r=i.get(e);if(!r||n.has(e))return;n.add(e);let o=a(r.partnerId,t,n);if(n.delete(e),o===void 0)return;let s=Ei(r.hierFelder.map(e=>A(o,e)));return s===``?void 0:r.nachSchluessel.get(s)};return(e,t)=>{let{quelleId:n,code:r}=ai(t);if(n===``)return A(e,r);let i=a(n,e,new Set);return i===void 0?``:A(i,r)}}function ki(e,t){let n=e.getAttribute(`source`)??``,r=e.getAttribute(t)??``;if(n===``||r===``)return{art:`ungebunden`};let i=k(R().FF_DATA_SOURCES,n);if(!i)return{art:`ohneQuelle`};let a=Xt(e,Dt(R().SEDATA,i.name,i.tableId,i.offenerSatz));if(a===void 0)return{art:`ohneZeile`};let{quelleId:o,code:s}=ai(r);return{art:`wert`,wert:o===``?A(a,s):Oi(e)(a,r),zeile:a,quelle:i,quelleId:o,reinerCode:s}}var Ai=new WeakMap,ji=new WeakSet;function Mi(e){let t=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(e);return t?`${t[3]}-${t[2]}-${t[1]}`:e}function Ni(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}.${t[2]}.${t[1]}`:e}function Pi(e){return typeof e.value==`string`?e.value:``}function Fi(e){if(e.pruefeEigenenWert?.(),e.getAttribute(`fieldtype`)===`nachschlagen`){Ai.delete(e);return}let t=ki(e,li(`value`));if(t.art!==`wert`){Ai.delete(e),t.art===`ohneZeile`&&(e.value=``);return}let{zeile:n,quelle:r,quelleId:i,reinerCode:a,wert:o}=t,s=St(r,n);i===``?Ai.set(e,{row:n,code:a,pindex:s}):Ai.delete(e),e.value=o}function Ii(e){let t=Ai.get(e);return t&&Ct(t.row,t.code,Pi(e)),t}function Li(e){ji.has(e)||(ji.add(e),e.addEventListener(`input`,()=>{Ii(e)}),e.addEventListener(`change`,()=>{let t=Ii(e);V(e,`onChange`,{VALUE:Pi(e),PINDEX:t?.pindex??``}).catch(B)}))}var Ri=Ci({hydriere:Fi,verdrahte:Li}),zi=Ri.connect,Bi=Ri.disconnect,Vi=o`
  .feld {
    font-family: var(--se-font);

    --feld-pad-y: 7px;
    --feld-pad-x: 10px;
    --feld-rand: var(--se-border);
  }

  .huelle { position: relative; }

  .ctrl {
    box-sizing: border-box;
    width: 100%;
    padding: var(--feld-pad-y) var(--feld-pad-x);
    border: var(--feld-rand) solid var(--se-line);
    background: var(--se-panel);
    border-radius: var(--se-r-md);
    font-family: var(--se-font);
    font-size: var(--se-fs);

    line-height: 1.4;
    color: var(--se-ink);
  }
  .ctrl:focus {
    outline: none;
    border-color: var(--se-accent);
    box-shadow: 0 0 0 var(--se-border) var(--se-accent);
  }
  textarea.ctrl {
    display: block;
    resize: vertical;
    min-height: 64px;
  }
  select.ctrl { padding: calc(var(--feld-pad-y) - 1px) calc(var(--feld-pad-x) - 2px); }

  .ph {
    position: absolute;
    top: calc(var(--feld-pad-y) + var(--feld-rand));
    left: calc(var(--feld-pad-x) + var(--feld-rand));
    right: calc(var(--feld-pad-x) + var(--feld-rand));
    color: var(--se-faint);
    font-size: var(--se-fs);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }
  .ph[hidden] { display: none; }

  .ph-select {
    top: calc(var(--feld-pad-y) - 1px + var(--feld-rand));
    left: calc(var(--feld-pad-x) - 2px + var(--feld-rand));
    right: 25px;
  }

  /* Gleiches Recht wie .ph-select: der Platzhalter endet am Innenrand des
     Feldes (padding-right 34px) und laesst die 30px-Lupe frei — im Editor
     ist er klickbar und wuerde sie sonst fast ganz verdecken. */
  .ph-nachschlag { right: 34px; }

  .huelle.leer input[type="date"]:not(:focus)::-webkit-datetime-edit,
  .huelle.leer input[type="time"]:not(:focus)::-webkit-datetime-edit { opacity: 0; }
  .huelle.leer.tippt .ph-nativ { display: none; }

  .zeile {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--se-fs);
    color: var(--se-ink);
  }
  input[type='checkbox'].ctrl {
    width: 15px;
    height: 15px;
    padding: 0;
    flex: none;
    accent-color: var(--se-accent);
  }

  .nachschlag { position: relative; }
  .nachschlag .ctrl { padding-right: 34px; border-style: dashed; }

  /* Die offene Vorschlagsliste haengt unten aus dem Feld heraus. Raster-
     Kinder stapeln in DOM-Reihenfolge — ohne diesen Vorrang laege die Liste
     unter dem naechsten Baustein. Nur solange sie offen ist (das Attribut
     setzt der Baustein in updated()), also ohne Nebenwirkung auf das Raster. */
  :host([data-ff-liste]) { position: relative; z-index: 5; }

  .lupe {
    position: absolute;
    top: var(--feld-rand);
    bottom: var(--feld-rand);
    right: var(--feld-rand);
    width: 30px;
    display: grid;
    place-items: center;
    padding: 0;
    border: none;
    background: none;
    color: var(--se-muted);
    cursor: pointer;
    transition: background var(--se-move);
  }
  .lupe:hover { background: var(--se-accent-soft); color: var(--se-ink); }
  .lupe:focus-visible { outline: 2px solid var(--se-accent); outline-offset: -2px; }

  :host([data-ff-editor]) .ctrl { pointer-events: none; }
  /* Die Lupe bleibt im Editor bedienbar: sie oeffnet das Spalten-Stellen. */
  :host([data-ff-editor]) .ph { pointer-events: auto; cursor: text; }
  :host([data-ff-editor]) .huelle[data-ff-bound] .ctrl {
    border-style: dotted;
    border-color: var(--se-accent);
  }

  :host([data-ff-editor]) [data-ff-editable]:empty::before { content: 'Text …'; opacity: 0.6; }

  :host(:not([data-ff-editor])) .zeile .text { cursor: pointer; user-select: none; }

  :host([fuellt]) .feld,
  :host([fuellt]) .huelle { height: 100%; }
  :host([fuellt]) .huelle .ctrl { height: 100%; }
`,Hi=[`text`,`number`,`textarea`,`select`,`date`,`time`,`checkbox`,`nachschlagen`];function Ui(e){return Hi.includes(e)?e:`text`}var Wi=[`text`,`number`,`textarea`,`select`,`nachschlagen`,`date`,`time`],Gi={select:`ph-select`,date:`ph-nativ`,time:`ph-nativ`,nachschlagen:`ph-nachschlag`};function Ki(){return v`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
      <line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></line>
    </svg>`}var qi=4;function Ji(e){return e??qi}function Yi(e,t,n){return Math.max(1,Math.floor((e-t)/n))}function Xi(e,t,n){let r=Yi(e,t,n),i=e-t;return i<n?{passen:r,zeilenHoehe:n}:{passen:r,zeilenHoehe:Math.floor(i/r*100)/100}}function Zi(e,t){return e===null?null:Math.max(0,e-t)}function Qi({sichtbar:e,hatQuelle:t,platzhalterZeilen:n}){return t?{seiten:1,seite:0,zeilen:[...e]}:{seiten:1,seite:0,zeilen:Array.from({length:n},()=>null)}}function $i({sichtbar:e,hatQuelle:t,proSeite:n,wunschSeite:r,platzhalterZeilen:i}){let a=t?Math.max(1,Math.ceil(e.length/n)):1,o=Math.min(Math.max(r,0),a-1);return t?{seiten:a,seite:o,zeilen:[...e.slice(o*n,(o+1)*n)]}:{seiten:a,seite:o,zeilen:Array.from({length:i},()=>null)}}var ea=1,ta=/^-?\d{1,3}(\.\d{3})*(,\d+)?$|^-?\d+(,\d+)?$|^-?\d+(\.\d+)?$/,na=/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/,ra=/^(\d{4})-(\d{2})-(\d{2})$/;function ia(e){let t=e.trim();if(t===``||!ta.test(t))return null;let n=t.includes(`,`)?t.replace(/\./g,``).replace(`,`,`.`):/^-?\d{1,3}(\.\d{3})+$/.test(t)?t.replace(/\./g,``):t,r=Number(n);return Number.isFinite(r)?r:null}function aa(e){let t=e.trim();if(t===``)return null;let n=ra.exec(t);if(n){let[,e,t,r]=n;return oa(Number(e),Number(t),Number(r))}let r=na.exec(t);if(r){let[,e,t,n]=r,i=Number(n);return oa(n.length===2?i<=69?2e3+i:1900+i:i,Number(t),Number(e))}return null}function oa(e,t,n){if(t<1||t>12||n<1||n>31)return null;let r=new Date(e,t-1,n);return r.getFullYear()!==e||r.getMonth()!==t-1||r.getDate()!==n?null:r.getTime()}function sa(e){let t=0,n=0,r=0;for(let i of e)i.trim()!==``&&(t++,ia(i)!==null&&n++,aa(i)!==null&&r++);return t===0?`text`:r===t?`datum`:n===t?`zahl`:`text`}var ca=new Intl.Collator(`de`,{numeric:!0,sensitivity:`base`});function la(e,t,n){if(t<0||e.length===0)return e.map((e,t)=>t);let r=n=>e[n][t]??``,i=sa(e.map(e=>e[t]??``)),a=n?1:-1;return e.map((e,t)=>t).sort((e,t)=>{let n=r(e).trim(),o=r(t).trim();if(n===``&&o===``)return e-t;if(n===``)return ea;if(o===``)return-1;let s=i===`zahl`?(ia(n)??0)-(ia(o)??0):i===`datum`?(aa(n)??0)-(aa(o)??0):ca.compare(n,o);return s===0?e-t:s*a})}function ua(e,t,n){let r=ia(e);return r===null?e:r.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:n})}var da={min:0,max:3},fa={min:2,max:2};function pa(e,t,n){let r=0,i=0;for(let t of e){let e=ia(t);e!==null&&(r+=e,i++)}return i===0?``:r.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:n})}function ma(e,t){let n=t.trim().toLowerCase();return e.find(e=>e.wert.trim().toLowerCase()===n)}var ha=`text`,ga=`status`,_a=`bild`,va=`zahl`,ya=`betrag`,ba=`bild`,xa=`unter`,Sa=[{wert:ha,name:`Text`,spur:`minmax(0, 1fr)`,klasse:``,aenderbar:!0,zelle:e=>e},{wert:va,name:`Zahl`,spur:`90px`,klasse:`zahl`,summe:da,aenderbar:!0,zelle:e=>ua(e,da.min,da.max)},{wert:ya,name:`Betrag`,spur:`100px`,klasse:`zahl`,summe:fa,aenderbar:!0,zelle:e=>ua(e,fa.min,fa.max)},{wert:`datum`,name:`Datum`,spur:`100px`,klasse:`zahl`,aenderbar:!0,zelle:e=>e},{wert:ga,name:`Status`,spur:`120px`,klasse:`status`,zelle:(e,t)=>{let n=ma(t,e);return n?v`<span class="chip v-${Or(n.bedeutung)}">${n.name.trim()===``?e:n.name}</span>`:v`<span class="chip">${e}</span>`}},{wert:_a,name:`Bild + Name`,spur:`minmax(0, 1fr)`,klasse:`bild`,zusatzFelder:[{key:ba,label:`Bild`},{key:xa,label:`Unterzeile`}],hoehe:e=>(e[ba]??``)!==``||(e[xa]??``)!==``?44:28,zelle:(e,t,n)=>{let r=Lr(n[ba]??``),i=n[xa]??``;return v`<div class="bild-name">
        ${r===void 0?b:v`<span class="bild-zeichen">${r}</span>`}
        <div class="bild-text">
          <div class="bild-titel">${e}</div>
          ${i===``?b:v`<div class="bild-unter">${i}</div>`}
        </div>
      </div>`}}];function Ca(e){return e.reduce((e,t)=>{let n=W(t.art);return Math.max(e,n.hoehe?.(t.felder??{})??28)},28)}var wa=Sa.filter(e=>e.summe!==void 0).map(e=>e.wert),Ta=Sa.filter(e=>e.aenderbar===!0).map(e=>e.wert);function Ea(e,t){let n=e.zelle(t,[],{});return typeof n==`string`?n:t}function W(e){return Sa.find(t=>t.wert===e)??Sa[0]}var Da=Sa.map(e=>({wert:e.wert,name:e.name,...e.zusatzFelder?{felder:e.zusatzFelder}:{}})),Oa=`felder`,ka=`Spalte {n}`;function Aa(e){return ka.replace(`{n}`,String(e+1))}function ja(e){return{titel:Aa(e),feld:``,art:ha}}function Ma(){return[0,1,2].map(e=>ja(e))}function Na(e){return Array.isArray(e)?e.filter(e=>!!e&&typeof e==`object`).map(e=>({wert:typeof e.wert==`string`?e.wert:``,name:typeof e.name==`string`?e.name:``,bedeutung:typeof e.bedeutung==`string`?e.bedeutung:``})).filter(e=>e.wert.trim()!==``):[]}function Pa(e){if(!e||typeof e!=`object`||Array.isArray(e))return{};let t={};for(let[n,r]of Object.entries(e))typeof r==`string`&&r!==``&&(t[n]=r);return t}function Fa(e,t){if(e&&typeof e==`object`){let n=e,r=Na(n.zuordnung),i=Pa(n.felder);return{titel:typeof n.titel==`string`?n.titel:Aa(t),feld:typeof n.feld==`string`?n.feld:``,art:typeof n.art==`string`?n.art:ha,...r.length>0?{zuordnung:r}:{},...Object.keys(i).length>0?{felder:i}:{},...typeof n.summe==`boolean`?{summe:n.summe}:{},...typeof n.aenderbar==`boolean`?{aenderbar:n.aenderbar}:{},...typeof n.fuellFeld==`string`&&n.fuellFeld.trim()!==``?{fuellFeld:n.fuellFeld.trim()}:{}}}return typeof e==`string`?{...ja(t),titel:e}:ja(t)}function Ia(e){let t;if(Array.isArray(e))t=e.map((e,t)=>Fa(e,t));else if(typeof e==`number`&&Number.isFinite(e)||typeof e==`string`&&/^\d+$/.test(e)){let n=Math.max(1,Math.floor(Number(e)));t=[...Array(n).keys()].map(e=>ja(e))}else t=Ma();return t.length>16&&(t=t.slice(0,16)),t.length<1&&(t=[ja(0)]),t}function La(e){try{return Ia(JSON.parse(e))}catch{return Ma()}}var Ra={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},za=e=>(...t)=>({_$litDirective$:e,values:t}),Ba=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},Va=`important`,Ha=` !important`,G=za(class extends Ba{constructor(e){if(super(e),e.type!==Ra.ATTRIBUTE||e.name!==`style`||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,n)=>{let r=e[n];return r==null?t:t+`${n=n.includes(`-`)?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,`-$&`).toLowerCase()}:${r};`},``)}update(e,[t]){let{style:n}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let e of this.ft)t[e]??(this.ft.delete(e),e.includes(`-`)?n.removeProperty(e):n[e]=null);for(let e in t){let r=t[e];if(r!=null){this.ft.add(e);let t=typeof r==`string`&&r.endsWith(Ha);e.includes(`-`)||t?n.setProperty(e,t?r.slice(0,-11):r,t?Va:``):n[e]=r}}return y}}),Ua=`Keine Datensätze.`;function Wa(){return{attributeName:`leerText`,name:`Text ohne Datensätze`,description:`Text, wenn die Quelle keine Zeilen liefert. Leer: gar nichts.`,kind:`text`,requiresDataSource:!0}}function Ga(e,t=!1){return e.trim()===``?b:v`<div class="leer${t?` leer--tafel`:``}">
    ${Nr()}
    <span>${e}</span>
  </div>`}var Ka=o`
  .leer {
    display: grid;
    justify-items: center;
    gap: 7px;
    padding: 22px 14px 24px;
    border: var(--se-border) dashed var(--se-line);
    border-radius: var(--se-r-md);
    color: var(--se-muted);
    font-size: var(--se-fs);
    line-height: 1.4;
    text-align: center;
  }

  .leer svg {
    width: 22px;
    height: 22px;
    fill: var(--se-faint);
    transform: rotate(-12deg);
  }

  .leer--tafel {
    border: none;
    padding: 44px 20px 48px;
  }
`;function qa(e,t){let n=(e?.fuellFeld??``).trim(),r=n===``?(e?.feld??``).trim():n;if(r===``)return{art:`frei`,quelleId:``,code:``};let{quelleId:i,code:a}=ai(r);return i===``?{art:`eigen`,quelleId:t,code:a}:{art:`verknuepft`,quelleId:i,code:a}}function K(e,t){return qa(e.spalten[t],e.quelleId)}function Ja(e){let t=[];for(let n of e.spalten){let r=qa(n,e.quelleId);r.art!==`verknuepft`||r.quelleId===``||t.includes(r.quelleId)||t.push(r.quelleId)}return t}function Ya(e,t){let n=K(e,t);if(!(n.quelleId===``||n.code===``))for(let r=0;r<e.spalten.length;r++){if(r===t)continue;let i=e.spalten[r],a=qa(i,e.quelleId);if(a.quelleId===n.quelleId&&!(a.code===``||a.code===n.code))return{titel:i.titel,code:a.code}}}function Xa(e,t){let n=K(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=[];for(let t of e.spalten){let i=qa(t,e.quelleId);i.quelleId!==n.quelleId||i.code===``||r.some(e=>e.feld===i.code)||r.push({titel:t.titel,feld:i.code,art:t.art,...t.zuordnung?{zuordnung:t.zuordnung}:{}})}return r}function Za(e,t,n){let r=e.map(e=>({toField:e.toField,soll:t(e.fromField)})).filter(e=>e.soll!==void 0);return r.length===0?[...n]:n.filter(e=>r.every(t=>t.soll!==``&&t.soll===A(e,t.toField)))}function Qa(e,t,n){return v`<input
    class="erf-eingabe"
    type="text"
    placeholder=${e.spalten[n]?.titel??``}
    .value=${e.wert(n)}
    @input=${e=>t.tippen(n,e.target.value)}
    @keydown=${e=>t.taste(n,e)}
    @blur=${()=>t.verlassen(n)}
  />`}function $a(e,t,n,r){if(r)return Qa(e,t,n);let i=e.tippSpalte===n&&e.vorschlaege.length>0;return v`<div class=${e.listeNachOben?`erf-halter nach-oben`:`erf-halter`}>
    ${Qa(e,t,n)}
    ${i?ti({eintraege:e.vorschlaege,marke:e.marke,onWaehlen:e=>t.waehleVorschlag(e),onMarke:e=>t.setzeMarke(e)}):b}
  </div>`}function eo(e,t){return v`<div class="zeile erfassung" role="row" style=${G(e.cols)}>
    ${e.spalten.map((n,r)=>{let i=W(n.art).klasse;return e.imEditor?v`<div class=${i} role="cell">${`—`}</div>`:v`<div class=${i} role="cell">${$a(e,t,r,qa(n,e.quelleId).art===`frei`)}</div>`})}
  </div>`}function to(e,t,n){let r=e.lauf.vorschlaege[n];r!==void 0&&(e.lauf.uebernimm(e.umfeld(),t,r.satz),e.melde())}function no(e,t){let n=e.umfeld(),r=n.spalten[t],i=K(n,t);if(r===void 0||i.quelleId===``||i.code===``)return;let a=Xa(n,t);Ps({el:e.baustein,quelleId:i.quelleId,speicherFeld:i.code,speicherTitel:r.titel,spalten:a,titel:r.titel,breite:fs(a.length),hoehe:380,eintraege:e.lauf.eintraege(n,t),rueckFokus:null,suchtext:e.lauf.wertVon(n,t),onUebernehmen:(n,r,i)=>{e.lauf.uebernimm(e.umfeld(),t,i),e.melde(),ro(e,t,`Enter`)}})}function ro(e,t,n){let r=e.umfeld();if(n===`Tab`){let n=t+1;return n<r.spalten.length?(e.fokussiere(n),!0):e.erfasseZeile()}let i=e.lauf.naechsteLeere(r,t);return i===-1?n===`Enter`&&e.erfasseZeile():e.fokussiere(i),!0}function io(e,t,n){if(n.key===`Tab`&&n.shiftKey)return;let r=n.key===`ArrowDown`&&n.altKey?`F4`:n.key,i=e.lauf.entscheideTaste(e.umfeld(),t,r);if(i===`nichts`){n.key===`Enter`&&n.preventDefault();return}let a=!0;i===`uebernehmen`?(to(e,t,e.lauf.marke),a=ro(e,t,n.key)):i===`fenster`?no(e,t):i===`liste-auf`?e.lauf.oeffneListe(t):i===`weiter`?a=ro(e,t,n.key):i===`leeren`&&e.lauf.leere(e.umfeld(),t),a&&n.preventDefault(),e.melde()}function ao(e,t,n){let r=e.umfeld();return eo({spalten:r.spalten,quelleId:r.quelleId,cols:t,imEditor:e.baustein.hasAttribute(`data-ff-editor`),wert:t=>e.lauf.wertVon(r,t),tippSpalte:e.lauf.tippSpalte,vorschlaege:e.lauf.vorschlaege,marke:e.lauf.marke,listeNachOben:n},{tippen:(t,n)=>{e.lauf.tippe(t,n),e.melde()},taste:(t,n)=>io(e,t,n),verlassen:t=>{e.lauf.verlasse(t),e.melde()},waehleVorschlag:t=>to(e,e.lauf.tippSpalte,t),setzeMarke:t=>{e.lauf.setzeMarke(t),e.melde()}})}var oo=class{constructor(){this.getippt=new Map,this.gewaehlt=new Map,this.vonHand=new Set,this._tippSpalte=-1,this._marke=0,this._listeZu=!1,this._listeAuf=-1,this._markeVonHand=!1,this._vorschlaege=[]}get tippSpalte(){return this._tippSpalte}get marke(){return this._marke}get vorschlaege(){return this._vorschlaege}wertVon(e,t){let n=this.getippt.get(t);if(n!==void 0)return n;let r=K(e,t);if(r.quelleId===``||r.code===``)return``;let i=this.gewaehlt.get(r.quelleId);return i===void 0?``:A(i,r.code)}tippe(e,t){this.getippt.set(e,t),this._tippSpalte=e,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}verlasse(e){this._tippSpalte===e&&(this._tippSpalte=-1,this._listeZu=!1,this._listeAuf=-1,this._marke=0,this._markeVonHand=!1)}entscheideTaste(e,t,n){let r=this._tippSpalte===t&&this._vorschlaege.length>0;if(n===`Tab`){if(!r)return`weiter`;n=`Enter`}if(n===`F4`)return K(e,t).art===`frei`||this.eintraege(e,t).length===0?`nichts`:`fenster`;let i=this.wertVon(e,t);if(n===`Escape`&&!r)return i===``?`nichts`:`leeren`;if(K(e,t).art===`frei`)return n===`Enter`?`weiter`:`nichts`;if(n===`ArrowDown`&&!r)return K(e,t).art===`verknuepft`?`liste-auf`:`nichts`;let a=ei(n,{listeOffen:r,feldLeer:i===``,treffer:this._vorschlaege.length,markeVonHand:this._markeVonHand});if(a===`marke-hoch`||a===`marke-runter`){let e=a===`marke-hoch`?-1:1;this._marke=Qr(this._marke,this._vorschlaege.length,e),this._markeVonHand=!0}else if(a===`liste-zu`)this._listeZu=!0,this._listeAuf=-1;else if(a===`fenster`&&this.eintraege(e,t).length===0)return`weiter`;else if(a===`nichts`&&n===`Enter`&&i!==``&&(this.getippt.get(t)===void 0||K(e,t).art!==`verknuepft`))return`weiter`;return a}oeffneListe(e){this._tippSpalte=e,this._listeZu=!1,this._listeAuf=e,this._marke=0,this._markeVonHand=!0}naechsteLeere(e,t){for(let n=t+1;n<e.spalten.length;n++)if(this.wertVon(e,n)===``)return n;return-1}leere(e,t){this.getippt.delete(t);let n=K(e,t);n.quelleId!==``&&this.gewaehlt.has(n.quelleId)&&this.setze(e,n.quelleId,void 0),this._listeZu=!1,this._marke=0,this._markeVonHand=!1}setzeMarke(e){this._marke=e}uebernimm(e,t,n){let r=K(e,t);if(r.quelleId!==``){if(this.setze(e,r.quelleId,n),this.vonHand.add(r.quelleId),r.art===`eigen`)for(let t of[...this.gewaehlt.keys()])t!==r.quelleId&&this.setze(e,t,void 0);this.gleicheAb(e),this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}}setze(e,t,n){n===void 0?(this.gewaehlt.delete(t),this.vonHand.delete(t)):this.gewaehlt.set(t,n);for(let n=0;n<e.spalten.length;n++)qa(e.spalten[n],e.quelleId).quelleId===t&&this.getippt.delete(n)}schluesselWert(e,t,n,r){if(t!==``&&t!==e.quelleId){let e=this.gewaehlt.get(t);return e===void 0?void 0:A(e,n)}let i=this.gewaehlt.get(e.quelleId);if(i!==void 0)return A(i,n);for(let t of Ja(e)){if(t===r||!this.vonHand.has(t))continue;let i=e.partnerVon(t);if(i!==``&&i!==e.quelleId)continue;let a=this.gewaehlt.get(t);if(a!==void 0)for(let r of e.paareZu(t)){if(r.fromField!==n)continue;let e=A(a,r.toField);if(e!==``)return e}}}moegliche(e,t,n){let r=e.partnerVon(t);return Za(e.paareZu(t),n=>this.schluesselWert(e,r,n,t),n)}gleicheAb(e){let t=Ja(e);for(let n=0;n<=t.length;n++){let n=!1;for(let r of t){let t=e.paareZu(r);if(t.length===0)continue;let i=e.partnerVon(r),a=this.gewaehlt.get(r);if(a!==void 0){t.every(t=>{let n=this.schluesselWert(e,i,t.fromField,r);return n===void 0||n!==``&&n===A(a,t.toField)})||(this.setze(e,r,void 0),n=!0);continue}if(!t.some(t=>this.schluesselWert(e,i,t.fromField,r)!==void 0))continue;let o=bs(r);if(o===null)continue;let s=this.moegliche(e,r,o);s.length===1&&(this.setze(e,r,s[0]),this.vonHand.delete(r),n=!0)}if(!n)break}}uebernimmWerte(e){this.zuruecksetzen(),e.forEach((e,t)=>{e!==``&&this.getippt.set(t,e)})}zuruecksetzen(){this.getippt.clear(),this.gewaehlt.clear(),this.vonHand.clear(),this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1,this._listeAuf=-1,this._vorschlaege=[]}aktualisiereVorschlaege(e){this._vorschlaege=this.berechne(e),this._marke=$r(this._marke,this._vorschlaege.length)}berechne(e){let t=this._tippSpalte;if(this._listeZu||K(e,t).art===`frei`)return[];let n=this.getippt.get(t)??``;return n===``?this._listeAuf===t?this.eintraege(e,t).slice(0,8):[]:Zr(this.eintraege(e,t),n)}eintraege(e,t){let n=K(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=bs(n.quelleId);return r===null?[]:vs(this.moegliche(e,n.quelleId,r),Ya(e,t)?.code??``,n.code)}},so=class{constructor(){this.lauf=new oo,this._zeilen=[],this.naechsteKennung=1,this._zurueck=null}get zeilen(){return this._zeilen.map(e=>e.werte)}vormerkungen(e){let t=this._zeilen.filter(e=>e.geschrieben!==!0).map(e=>({kennung:e.kennung,werte:e.werte})),n=this._zurueck;if(!n)return t;let r=e.spalten.map((t,n)=>this.lauf.wertVon(e,n));if(r.every(e=>e===``))return t;let i=this._zeilen.slice(0,n.platz).filter(e=>e.geschrieben!==!0).length;return[...t.slice(0,i),{kennung:n.kennung,werte:r},...t.slice(i)]}istGeschrieben(e){return this._zeilen[e]?.geschrieben===!0}get schluessel(){return this._zeilen.map(e=>e.kennung)}umfeld(e,t,n){let r=Di(e);return{spalten:t,quelleId:n,paareZu:e=>r.find(t=>t.quelleId===e)?.keyPairs??[],partnerVon:e=>r.find(t=>t.quelleId===e)?.partnerId??``}}erfasse(e){let t=e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),n=this._zurueck;return t.every(e=>e===``)?n?(this._zurueck=null,this.lauf.zuruecksetzen(),!0):!1:(n?(this._zeilen=[...this._zeilen.slice(0,n.platz),{kennung:n.kennung,werte:t},...this._zeilen.slice(n.platz)],this._zurueck=null):(this._zeilen=[...this._zeilen,{kennung:`e${this.naechsteKennung}`,werte:t}],this.naechsteKennung+=1),this.lauf.zuruecksetzen(),!0)}zurueckholen(e,t){let n=this._zeilen[t];if(!n||n.geschrieben===!0)return!1;this.erfasse(e);let r=this._zeilen.indexOf(n);return r===-1?!1:(this._zeilen=this._zeilen.filter((e,t)=>t!==r),this._zurueck={kennung:n.kennung,platz:r},this.lauf.uebernimmWerte(n.werte),!0)}entferne(e){return e<0||e>=this._zeilen.length?!1:(this._zeilen=this._zeilen.filter((t,n)=>n!==e),!0)}markiereGeschrieben(e,t){if(t.length===0)return!1;let n=!1;this._zeilen=this._zeilen.map(e=>e.geschrieben===!0||!t.includes(e.kennung)?e:(n=!0,{...e,geschrieben:!0}));let r=this._zurueck;return r!==null&&t.includes(r.kennung)&&(this._zeilen=[...this._zeilen.slice(0,r.platz),{kennung:r.kennung,werte:e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),geschrieben:!0},...this._zeilen.slice(r.platz)],this._zurueck=null,this.lauf.zuruecksetzen(),n=!0),n}vergissGeschriebene(){let e=this._zeilen.filter(e=>e.geschrieben!==!0);return e.length===this._zeilen.length?!1:(this._zeilen=e,!0)}zuruecksetzen(){this._zeilen=[],this._zurueck=null,this.lauf.zuruecksetzen()}},co=o`
      .zeile.erfassung {
        flex: none;
        background: var(--se-panel-2);
        border-top: var(--se-border) solid var(--se-line);
      }

      /* Die Liste haengt aus der Zelle heraus; ohne sichtbaren Ueberlauf
         schnitte die Zelle sie ab. Gilt fuer jede Zelle, weil jede gebundene
         Spalte eine Liste zeigen kann.

         Das Polster steht in tabelleStil (.tippbar) — es ist dieselbe
         Rechnung wie fuer jede andere Zelle mit Eingabefeld. */
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

      /* .erf-eingabe wird zusammen mit .zell-eingabe in tabelleStil gesetzt:
         es ist dieselbe Sache — eine Zelle, in die getippt wird. */

      /* Im Editor zeigt die Zelle keine Eingabe, sondern Striche. */
      :host([data-ff-editor]) .zeile.erfassung > div { color: var(--se-muted); }

      /* Erfasste, noch nicht geschriebene Zeilen (G4): wie Datenzeilen, nur
         links markiert — erst der Knopf macht aus ihnen echte Positionen.
         Die Markierung selbst macht der Statusbalken (tabelleStil).

         Ein Klick holt sie zum Korrigieren zurueck in die Erfassungszeile,
         darum der Zeigefinger. Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie
         an der gebuchten Zeile: absolut rechts, erst bei Hover. Vorher sass
         es mitten in der ERSTEN Zelle und schob deren Wert um rund 20px nach
         rechts — die erfasste Zeile stand darum sichtbar versetzt unter den
         gebuchten (Nutzer-Befund 2026-08-28). */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`;function lo(e){return{rohzeilen:e.map(e=>e.rohzeile),datenzeilen:e.map(e=>[...e.zellen]),zusatzzeilen:e.map(e=>(e.zusatz??[]).map(e=>({...e})))}}function uo(e,t,n){return t===``||n===``?[...e]:e.filter(e=>Br(A(e,t))===n)}function fo(e){let t=e.getAttribute(`source`)??``;if(t===``)return null;let n=k(R().FF_DATA_SOURCES,t);return n?{quelle:n,zeilen:uo(Dt(R().SEDATA,n.name,n.tableId,n.offenerSatz),e.getAttribute(`tagfield`)??``,Gr()),lies:Oi(e)}:null}function po(e){return La(e.getAttribute(`spalten`)??``)}function mo(e,t,n){let r={};for(let i of W(e.art).zusatzFelder??[]){let a=e.felder?.[i.key]??``;a!==``&&(r[i.key]=n(t,a))}return r}function ho(e,t){let n=k(R().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return n?St(n,t):``}function go(e){let t=k(R().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return t!==void 0&&t.indexField!==``}function _o(e,t){t&&e.vergissGeschriebene();let n=fo(e);if(!n){e.datenzeilen=[],e.zusatzzeilen=[];return}let r=po(e),{rows:i,gefiltert:a}=Yt(e,n.zeilen),o=Ht(N(e),i,e=>e)[0]??-1,s=n.lies;e.datenGeliefert=!0,e.rohzeilen=i,e.auswahlIndex=o,e.durchAuswahlGefiltert=a,e.datenzeilen=i.map(e=>r.map(t=>t.feld===``?``:s(e,t.feld))),e.zusatzzeilen=i.map(e=>r.map(t=>mo(t,e,s)))}var vo=Ci({hydriere:_o}),yo=vo.connect,bo=vo.disconnect;function xo(e,t){let n=[];return e.forEach((e,r)=>{Xr(e,t)&&n.push(r)}),n}function So(e,t){return!e&&t.trim()!==``}function Co(e,t,n){return e&&t&&n===0}function wo(e){if(!e.hatQuelle)return`— Datensätze`;let t=e.auswahlAktiv?` · durch Auswahl gefiltert`:``,n=e=>e===1?`Datensatz`:`Datensätze`,r=e=>e===1?`Datensatz`:`Datensätzen`;return e.suchtAktiv?e.sichtbar===0?`Kein Treffer von ${e.gesamt} ${r(e.gesamt)}`+t:`${e.sichtbar} von ${e.gesamt} ${r(e.gesamt)}`+t:(e.gesamt===0?`Keine Datensätze`:`${e.gesamt} ${n(e.gesamt)}`)+t}function To(e,t,n){return v`<div class="steuerung">
    <button
      title="Letzte Spalte entfernen"
      @click=${r=>{n(r);let i=e();i.length>1&&(i.pop(),t(i))}}
    >−</button>
    <button
      title="Spalte hinzufügen"
      @click=${r=>{n(r);let i=e();i.length<16&&(i.push(ja(i.length)),t(i))}}
    >+</button>
  </div>`}function Eo(e,t){let n=e.currentTarget;n&&(e.stopPropagation(),e.preventDefault(),at(n,(e,n)=>e===``||e===n.trim()?!1:(t(e),!0)))}function Do(e,t,n,r){Eo(e,e=>{let i=n();t>=i.length||(i[t]={...i[t],titel:e},r(i))})}var Oo=220,ko=new WeakMap;function Ao(e){let t=ko.get(e);t!==void 0&&(clearTimeout(t),ko.delete(e))}function jo(e){return{dblklickKopf:(t,n)=>{e.editable()&&(Ao(e.baustein),Do(t,n,e.liste,e.aendere))},klickKopf:(t,n)=>{e.editable()&&Mo(e.baustein,t,{prop:e.prop,index:n,liste:e.liste}),e.sortiere(n)}}}function Mo(e,t,n){t.stopPropagation();let r=t.currentTarget.getBoundingClientRect();Ao(e),ko.set(e,setTimeout(()=>{ko.delete(e),e.dispatchEvent(new CustomEvent(`ff-listen-bind`,{detail:{prop:n.prop,index:n.index,top:r.bottom+4,left:r.left,...n.liste?{liste:n.liste()}:{}},bubbles:!0,composed:!0}))},Oo))}var No=`\0`;function Po(e,t){return e+No+String(t)}var Fo=class{constructor(){this.werte=new Map}setze(e,t,n){if(e===``)return!1;let r=Po(e,t);return this.werte.get(r)===n?!1:(this.werte.set(r,n),!0)}nimmZurueck(e,t){return this.werte.delete(Po(e,t))}wert(e,t){return e===``?void 0:this.werte.get(Po(e,t))}get anzahl(){return this.werte.size}proSatz(){let e=[];for(let[t,n]of this.werte){let[r,i]=t.split(No),a=Number(i),o=e.find(e=>e.satz===r),s={satz:r,spalte:a,wert:n};o?o.aenderungen.push(s):e.push({satz:r,aenderungen:[s]})}return e}nimmSatzZurueck(e){let t=!1;for(let n of[...this.werte.keys()])n.slice(0,n.indexOf(No))===e&&this.werte.delete(n)&&(t=!0);return t}},Io=class{constructor(e){this.aenderungen=new Fo,this.geloescht=new Set,this.wirt=e}get geaenderteZeilen(){if(this.aenderungen.anzahl===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let{satz:r}of this.aenderungen.proSatz()){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}get geloeschteZeilen(){if(this.geloescht.size===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let r of this.geloescht){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}austragen(e,t){let n=!1;for(let r of t)n=e===`geaendert`?this.aenderungen.nimmSatzZurueck(r)||n:this.geloescht.delete(r)||n;n&&this.wirt.melde()}vorgemerkteAenderungen(){return this.geaenderteZeilen.length}vorgemerkteLoeschungen(){return this.geloeschteZeilen.length}statusVon(e){let t=this.satzVon(e);if(t===``)return{status:`gebucht`,titel:``};if(this.geloescht.has(t))return this.wirt.lauf.zeigt(`geloescht`,t,`loeschung`);let n=this.wirt.spalten().some((e,n)=>this.aenderungen.wert(t,n)!==void 0);return this.wirt.lauf.zeigt(`geaendert`,t,n?`geaendert`:`gebucht`)}satzPlaetze(){let e=new Map;return this.wirt.rohzeilen().forEach((t,n)=>{let r=ho(this.wirt.baustein,t);r!==``&&!e.has(r)&&e.set(r,n)}),e}satzVon(e){let t=this.wirt.rohzeilen()[e];return t===void 0?``:ho(this.wirt.baustein,t)}zellAnzeige(e,t){let n=this.wirt.spalten()[e];return n===void 0?t:Ea(W(n.art),t)}schalteLoeschung(e){let t=this.satzVon(e);t!==``&&(this.geloescht.has(t)?this.geloescht.delete(t):(this.geloescht.add(t),this.wirt.spalten().forEach((e,n)=>{this.aenderungen.nimmZurueck(t,n)})),this.wirt.melde())}istGeloescht(e){let t=this.satzVon(e);return t!==``&&this.geloescht.has(t)}zellWert(e,t){let n=this.aenderungen.wert(this.satzVon(e),t);return n===void 0?this.zellAnzeige(t,this.wirt.datenzeilen()[e]?.[t]??``):n}istGeaendert(e,t){return this.aenderungen.wert(this.satzVon(e),t)!==void 0}tippeZelle(e,t,n){this.aenderungen.setze(this.satzVon(e),t,n)&&this.wirt.melde()}verlasseZelle(e,t,n){let r=this.satzVon(e),i=this.zellAnzeige(t,n);(i===this.zellAnzeige(t,this.wirt.datenzeilen()[e]?.[t]??``)?this.aenderungen.nimmZurueck(r,t):this.aenderungen.setze(r,t,i))&&this.wirt.melde()}zelleNachbar(e,t,n,r){let i=Array.from(this.wirt.baustein.shadowRoot?.querySelectorAll(`.koerper > .zeile:not(.erfassung) .zell-eingabe[data-spalte="${e}"]`)??[]),a=i.indexOf(t);if(a<0)return;let o=a+n;if(o>i.length-1){if(r&&this.wirt.erfassungAn()){this.wirt.fokussiereErfassungsZelle(0);return}o=i.length-1}o<0&&(o=0);let s=i[o];!s||s===t||(s.focus(),s.select(),s.scrollIntoView({block:`nearest`}))}tasteZelle(e,t,n){let r=n.target;if(n.key===`Escape`){n.preventDefault(),n.stopPropagation(),this.aenderungen.nimmZurueck(this.satzVon(e),t)&&this.wirt.melde();return}let i={Enter:1,ArrowDown:1,ArrowUp:-1,PageDown:10,PageUp:-10}[n.key];i!==void 0&&(n.preventDefault(),n.stopPropagation(),this.zelleNachbar(t,r,i,n.key===`Enter`))}},Lo={gebucht:``,erfasst:`Neue Zeile — noch nicht geschrieben`,geaendert:`Geändert — noch nicht geschrieben`,loeschung:`Zum Löschen vorgemerkt — noch nicht geschrieben`,schreibt:`Wird geschrieben …`,geschrieben:`Hinausgeschickt — bleibt stehen, bis neue Daten kommen`,fehler:`Nicht geschrieben`},Ro=class{constructor(e){this.schreibend=new Map,this.fehler=new Map,this.melde=e}schreibt(e,t){this.fehler.get(e)?.delete(t);let n=this.schreibend.get(e)??new Set;n.add(t),this.schreibend.set(e,n),this.melde()}gescheitert(e,t,n){this.schreibend.get(e)?.delete(t);let r=this.fehler.get(e)??new Map;r.set(t,n),this.fehler.set(e,r),this.melde()}fertig(e,t){this.schreibend.get(e)?.clear();let n=this.fehler.get(e);if(n)for(let e of t)n.delete(e);this.melde()}zeigt(e,t,n){let r=this.fehler.get(e)?.get(t);return r===void 0?this.schreibend.get(e)?.has(t)===!0?{status:`schreibt`,titel:Lo.schreibt}:{status:n,titel:Lo[n]}:{status:`fehler`,titel:Lo.fehler+`: `+r}}};function zo(e){if(!e.hasAttribute(`fuellt`))return-1;let t=e.renderRoot.querySelector(`.koerper`);return t instanceof HTMLElement?t.clientHeight:-1}function Bo(e,t){let n=zo(e);if(n===-1)return{mass:null,hoehe:n};let r=e.renderRoot.querySelector(`.kopf`);return{mass:Xi(n,r instanceof HTMLElement?r.offsetHeight:0,t),hoehe:n}}function Vo(e,t){if(typeof ResizeObserver>`u`)return null;let n=e.renderRoot.querySelector(`.koerper`);if(!n)return null;let r=new ResizeObserver(t);return r.observe(n),r}var Ho=`ff-zeile-aktiviert`,Uo=`data-ff-roh`;function Wo(e,t){e.dispatchEvent(new CustomEvent(Ho,{detail:t,bubbles:!0,composed:!0}))}function Go(e){let t=e?.activeElement;if(!(t instanceof HTMLElement))return;let n=t.closest(`.zeile`);if(!n)return;let r=n.getAttribute(Uo);return r===null||r===``?null:Number(r)}function Ko(e,t){if(!(e instanceof HTMLElement))return!1;let n=e.closest(`.zeile`),r=n?.parentElement;if(!n||!r)return!1;let i=[...r.querySelectorAll(`.zeile[${Uo}]`)],a=i.indexOf(n),o=a===-1?void 0:i[a+t];return o?(o.focus(),!0):!1}function qo(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.zeile[${Uo}]`);return t?(t.focus(),!0):!1}function Jo(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.suchzeile input`);return t?(t.focus(),!0):!1}function Yo(e,t){e&&((t===null?null:e.querySelector(`.zeile[data-ff-roh="${t}"]`))??e.querySelector(`.zeile[data-ff-roh]`)??e.querySelector(`.koerper`))?.focus()}var Xo=class{constructor(e){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._seite=0,this._mass=null,this._beobachter=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._fokusZeile=null,this._fokusHolen=!1,this.wirt=e}get suchtext(){return this._suchtext}get suchtAktiv(){return this._suchtext.trim()!==``}get sortSpalte(){return this._sortSpalte}get sortAuf(){return this._sortAuf}get seite(){return this._seite}get mass(){return this._mass}setzeSuchtext(e){this.merkeZeilenFokus(),this._suchtext=e,this._seite=0,this.wirt.melde()}klickSortiere(e){this.wirt.editable()||(this.merkeZeilenFokus(),this._sortSpalte===e?this._sortAuf=!this._sortAuf:(this._sortSpalte=e,this._sortAuf=!0),this._seite=0,this.wirt.melde())}blaettere(e){this.merkeZeilenFokus(),this._seite=e,this.wirt.melde()}fokussiereSuche(){let e=this.wirt.baustein.shadowRoot?.querySelector(`.suchzeile input`);return e?(e.focus(),!0):!1}merkeZeilenFokus(){let e=Go(this.wirt.baustein.shadowRoot);this._fokusHolen=e!==void 0,this._fokusZeile=e??null}messeRumpf(){let e=this.wirt.zeilenHoehe();this._taktGemessen=e;let{mass:t,hoehe:n}=Bo(this.wirt.baustein,e);this._rumpfGemessen=n,!(t?.passen===this._mass?.passen&&t?.zeilenHoehe===this._mass?.zeilenHoehe)&&(this._mass=t,this.wirt.melde())}beobachte(){this._beobachter||(this._beobachter=Vo(this.wirt.baustein,()=>this.messeRumpf()),this._beobachter&&this.messeRumpf())}nachRendern(){(this._taktGemessen!==this.wirt.zeilenHoehe()||this._rumpfGemessen!==zo(this.wirt.baustein))&&this.messeRumpf(),this._fokusHolen&&(this._fokusHolen=!1,Yo(this.wirt.baustein.shadowRoot,this._fokusZeile))}loese(){this._beobachter?.disconnect(),this._beobachter=null}nachPush(){this._seite=0,this._mass=null,this._taktGemessen=0,this._rumpfGemessen=-1}zuruecksetzen(){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this.nachPush(),this._fokusZeile=null,this._fokusHolen=!1}};function Zo(e,t,n,r){if(n===null||e.hasAttribute(`data-ff-editor`))return;let i=t[n];i!==void 0&&(Wo(e,{rohzeile:i,rohIndex:n,ansichtIndex:r}),$o(e,i),V(e,`onRowClick`,{PINDEX:ho(e,i)}).catch(B))}function Qo(e,t,n){if(n===null||e.hasAttribute(`data-ff-editor`))return;let r=t[n];r!==void 0&&V(e,`onRowDblClick`,{PINDEX:ho(e,r)}).catch(B)}function $o(e,t){let n=N(e);n!==``&&Ut(n,t)}var es={prop:`spalten`,titelKey:`titel`,feldKey:`feld`,standardTitel:ka,eintragsWahl:{key:`art`,label:`Darstellung`,optionen:Da,standard:ha,felderKey:Oa},eintragsSchalter:[{key:`summe`,label:`Summe in der Fußzeile`,kurz:`Summe`,nurBeiWahl:wa},{key:`aenderbar`,label:`In der Zeile änderbar`,kurz:`änderbar`,nurBeiWahl:Ta,standard:!0,nurEigeneQuelle:!0}],herkunftProp:`spaltenHerkunft`,eintragsFeldWahl:[{key:`fuellFeld`,label:`Nachschlagen`,hinweis:`Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.`,nurFremdeQuellen:!0}],eintragsZuordnung:{key:`zuordnung`,label:`Status-Zuordnung`,nurBeiWahl:ga,wertLabel:`Datenwert`,nameLabel:`Klarname`,bedeutungLabel:`Bedeutung`,bedeutungen:kr}};function ts(e){let t=e,n=es.eintragsSchalter?.find(e=>e.key===`aenderbar`);return n!==void 0&&e.feld!==``&&ci(es,t).includes(n)&&si(n,t)}function ns(e,t){let n=[];return e.spalten.forEach((r,i)=>{let a=W(r.art).summe;if(r.summe!==!0||a===void 0)return;let o=pa(t.map(t=>e.wertVon(t,i)),a.min,a.max);o!==``&&n.push({titel:r.titel,text:o})}),n}function rs(e){let t=xo(e.datenzeilen,e.suchtext);return e.sortSpalte<0?t:la(t.map(t=>e.datenzeilen[t]),e.sortSpalte,e.sortAuf).map(e=>t[e])}function is(e){let t={gridTemplateColumns:e.spalten.map(e=>W(e.art).spur).join(` `)},n=Ca(e.spalten),r=e.gemessen?.zeilenHoehe??n,i=e.hatQuelle,a=!e.erfassungAn&&Co(i,e.datenGeliefert,e.datenzeilen.length),o=rs(e),s=e.erfassungAn?1+e.erfassteAnzahl:0,c=e.gemessen===null?null:Math.max(1,e.gemessen.passen-s),l={sichtbar:o,hatQuelle:i,proSeite:c??Math.max(1,10-s),wunschSeite:e.wunschSeite,platzhalterZeilen:Ji(c)},{seiten:u,seite:d,zeilen:f}=e.blaettert?$i(l):Qi(l);return{cols:t,takt:n,zeilenHoehe:r,hatQuelle:i,leer:a,gesamt:o.length,seiten:u,seite:d,zeilen:f,linealTakte:Zi(c,f.length),summen:ns(e,o)}}var as=[U(`suche`,`Suchzeile`,`Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.`,{requiresDataSource:!0}),U(`erfassung`,`Erfassungszeile`,`Eine leere Zeile zum Tippen neuer Positionen.`),U(`loeschbar`,`Zeilen löschbar`,`Kreuz an jeder Zeile: merkt sie zum Löschen vor.`,{requiresDataSource:!0}),U(`blaettern`,`Blättern`,`Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.`),U(`kopfzeile`,`Kopfzeile`,`Aus: keine Titelzeile, kein Sortieren per Titelklick.`),{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.`,kind:`field`},Wa()];function os(e,t){let n=e.erfasst+e.geaendert+e.geloescht,r=e.seiten>1||e.summen.length>0||n>0||e.suchtAktiv||e.auswahlAktiv;return e.leer||!r?b:v`<div class="fusszeile">
    <div class="seiten-info">${wo({hatQuelle:e.hatQuelle,sichtbar:e.sichtbar,gesamt:e.gesamt,suchtAktiv:e.suchtAktiv,auswahlAktiv:e.auswahlAktiv})}</div>
    ${n===0?b:v`<div class="vorgemerkt">${br(e.erfasst,e.geaendert,e.geloescht)}</div>`}
    ${e.summen.length===0?b:v`<div class="summen">
      ${e.summen.map(e=>v`<span class="summe">
        <span class="summe-titel">${e.titel}</span>
        <b>${e.text}</b>
      </span>`)}
    </div>`}
    ${e.blaettert?v`<div class="seiten-nav">
      <button
        aria-label="Seite zurück"
        ?disabled=${e.seite<=0}
        @click=${()=>t.blaettere(e.seite-1)}
      >‹</button>
      <span>Seite ${e.seite+1} von ${e.seiten}</span>
      <button
        aria-label="Seite vor"
        ?disabled=${e.seite>=e.seiten-1}
        @click=${()=>t.blaettere(e.seite+1)}
      >›</button>
    </div>`:b}
  </div>`}var ss=/[.*+?^${}()|[\]\\]/g;function cs(e,t){let n=Yr(t);if(n.length===0||e===``)return e;let r;try{r=RegExp(`(${n.map(e=>e.replace(ss,`\\$&`)).join(`|`)})`,`ig`)}catch{return e}let i=e.split(r);return i.length<=1?e:v`${i.map((e,t)=>t%2==1?v`<mark>${e}</mark>`:e)}`}function ls(e){return e.linealTakte===0?b:v`<div class="lineal" role="presentation" style=${G(e.linealTakte===null?e.cols:{...e.cols,flex:`0 1 auto`,height:`calc(var(--zeilen-hoehe) * ${e.linealTakte})`})}>
          ${e.spalten.map(()=>v`<div></div>`)}
        </div>`}function us(e,t){return v`
      ${e.zeigeSuche?v`<div class="suchzeile">
        <input
          type="search"
          placeholder="Tabelle durchsuchen…"
          aria-label="Tabelle durchsuchen"
          .value=${e.suchtext}
          @input=${e=>t.setzeSuchtext(e.target.value)}
          @keydown=${e=>{e.key===`ArrowDown`&&qo(e.target)&&e.preventDefault()}}
        />
      </div>`:``}
      <div class="koerper" role=${e.leer?b:`table`} tabindex="-1">
      ${e.zeigeKopf?v`<div class="kopf" role="row" style=${G(e.cols)}>
        ${e.spalten.map((n,r)=>v`<div
            class="${W(n.art).klasse}${e.imEditor&&(e.herkunft[r]??``)!==``?` mit-herkunft`:``}"
            role="columnheader"
            data-ff-editable
            @dblclick=${e=>t.dblklickKopf(e,r)}
            @click=${e=>t.klickKopf(e,r)}
          >${e.imEditor&&(e.herkunft[r]??``)!==``?v`<span class="kopf-titel">${n.titel}</span><span
                  class="kopf-herkunft"
                  title=${`Diese Spalte holt ihren Wert aus: ${e.herkunft[r]}`}
                >${e.herkunft[r]}</span>`:n.titel}${!e.editable&&e.sortSpalte===r?v`<span class="sort-pfeil">${e.sortAuf?` ▲`:` ▼`}</span>`:``}</div>`)}
      </div>`:b}
        ${``}
        ${e.leer?Ga(e.leerText,!0):v`
        ${e.hatQuelle?b:e.erfassung}
        ${e.zeilen.map((n,r)=>{let i=n!==null&&!e.imEditor,a=n!==null&&e.zeilenStand.istGeloescht(n),o=n===null?{status:`gebucht`,titel:``}:e.zeilenStand.statusVon(n);return v`<div
            class="zeile${r%2==1?` zebra`:``}${n!==null&&e.hatQuelle?` waehlbar`:``}${n!==null&&n===e.auswahlIndex?` gewaehlt`:``}${a?` geloescht`:``}"
            role="row"
            data-status=${o.status===`gebucht`?b:o.status}
            title=${o.titel===``?b:o.titel}
            data-ff-roh=${n??b}
            tabindex=${i?`0`:b}
            aria-selected=${e.auswahlSemantik&&n!==null?String(n===e.auswahlIndex):b}
            style=${G(e.cols)}
            @click=${()=>t.aktiviereZeile(n,r)}
            @dblclick=${e=>{e.target.closest(`.zell-eingabe`)||t.zeileDoppelt(n)}}
            @keydown=${e=>{if(!e.target.closest(`.zell-eingabe`)){if(e.key===`ArrowDown`||e.key===`ArrowUp`){let t=e.key===`ArrowUp`;(Ko(e.target,t?-1:1)||t&&Jo(e.target))&&e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),t.aktiviereZeile(n,r))}}}
          >
            ${``}
            ${e.spalten.map((r,i)=>{let a=W(r.art),o=n===null?`—`:e.datenzeilen[n]?.[i]??``,s=n===null?{}:e.zusatzzeilen[n]?.[i]??{},c=e.imEditor&&!e.zeigeKopf&&e.editable;if(e.aendernMoeglich&&n!==null&&ts(r)){let t=e.zeilenStand;return v`<div class="${a.klasse} tippbar" role="cell">
                <input
                  class=${t.istGeaendert(n,i)?`zell-eingabe geaendert`:`zell-eingabe`}
                  type="text"
                  data-spalte=${i}
                  aria-label=${r.titel}
                  .value=${t.zellWert(n,i)}
                  @input=${e=>t.tippeZelle(n,i,e.target.value)}
                  @blur=${e=>t.verlasseZelle(n,i,e.target.value)}
                  @keydown=${e=>t.tasteZelle(n,i,e)}
                />
              </div>`}let l=a.zelle(o,r.zuordnung??[],s);return v`<div
                class=${a.klasse}
                role="cell"
                data-ff-editable=${c?``:b}
                @click=${c?e=>t.klickKopf(e,i):b}
              >${typeof l==`string`?cs(l,e.suchtext):l}</div>`})}
            ${e.loeschbar&&n!==null&&!e.imEditor?v`<button
                  class="zeile-weg"
                  type="button"
                  title=${a?`Löschen zurücknehmen`:`Diese Position zum Löschen vormerken`}
                  aria-label=${a?`Löschen zurücknehmen`:`Position zum Löschen vormerken`}
                  @click=${e=>{e.stopPropagation(),t.schalteLoeschung(n)}}
                >${a?`↺`:`✕`}</button>`:b}
          </div>`})}
        ${e.erfasste.map((n,r)=>{let i=e.erfasstStand(r),a=i.status===`geschrieben`;return v`<div
          class="zeile erfasst"
          role="row"
          data-status=${i.status}
          title=${e.imEditor||a?i.titel:`${i.titel} — zum Korrigieren anklicken`}
          style=${G(e.cols)}
          @click=${e.imEditor||a?b:()=>t.holeErfassteZeile(r)}
        >
          ${e.spalten.map((e,t)=>{let r=W(e.art);return v`<div class=${r.klasse} role="cell">${r.zelle(n[t]??``,e.zuordnung??[],{})}</div>`})}
          ${e.imEditor?b:v`<button
              class="zeile-weg"
              type="button"
              title=${a?`Aus der Ansicht nehmen — geschrieben ist sie schon`:`Diese erfasste Zeile wieder wegnehmen`}
              aria-label="Erfasste Zeile wegnehmen"
              @click=${e=>{e.stopPropagation(),t.nimmErfassteZeile(r)}}
            >&#x2715;</button>`}
        </div>`})}
        ${e.hatQuelle?e.erfassung:b}
        ${ls(e)}`}
      </div>
    `}var ds=o`
      :host { min-width: 0; height: 100%; }

      .tabelle {
        /* Die zwei Zahlen, aus denen sich jedes Zell-Polster ergibt. Nur
           hier stehen sie. */
        --se-zell-x: 10px;
        --se-eingabe-x: 4px;

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
        height: var(--takt);
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
        font-size: var(--se-fs-sm);
        font-weight: 600;
      }

      .koerper {
        flex: 1 1 auto;
        overflow: auto;

        /* Die Kopfzeile klebt IM Rumpf, teilt sich also jede Breite mit den
           Zeilen: die Leiste kann keine Spalte gegen den Kopf verschieben.
           Darum kein Gutter — reservierter Platz waere eine Luecke, die bei
           kurzen Listen dauerhaft neben der letzten Spalte steht. */
        scrollbar-width: thin;
        display: flex;
        flex-direction: column;
      }

      .koerper > .zeile { flex: none; }

      /* Die Erfassungszeile klebt unten, IMMER. Vorher hing die Regel an einer
         Klasse, die es nur bei „Blaettern = Nein" gab — bei der Voreinstellung
         rollte die Zeile also weg, sobald mehr Zeilen da waren als in den
         Rumpf passen, und der Bediener tippte ins Unsichtbare.
         Die Kopfzeile klebt ohnehin schon bedingungslos (.kopf). */
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
      .lineal > div { border-right: 1px solid var(--se-line-soft); }
      .lineal > div:last-child { border-right: none; }

      .zeile {
        border-bottom: 1px solid var(--se-line-soft);
        background: var(--se-panel);
        transition: background-color var(--se-move);
      }

      /* Zebra: jede zweite Datenzeile leicht getoent. Die Zeile bringt die
         Klasse mit, gezaehlt wird nach ihrer NUMMER in der Ansicht. Vorher
         zaehlte nth-child alle Kinder des Rumpfes mit — die Toenung kippte
         also um eine Zeile, sobald die Kopfzeile abgeschaltet war oder die
         Erfassungszeile (ohne Quelle) vorne stand.

         Bewusst ohne den Rumpf-Vorsatz: so bleibt die Regel gleich stark wie
         die Status-Farben weiter unten, und die stehen spaeter — eine
         vorgemerkte Zeile behaelt damit ihre Kennfarbe. */
      .zeile.zebra {
        background: var(--se-zebra);
      }

      /* Nur eine Zeile OHNE Status faerbt sich unter der Maus. Sonst wischte
         der Hover die Kennfarbe genau in dem Moment weg, in dem der Bediener
         mit dem Zeiger hinfaehrt, um sie anzusehen — die Farbe IST die
         Auskunft. Dasselbe Muster wie bei .gewaehlt weiter unten. */
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
      .koerper > .zeile.gewaehlt:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div { color: var(--se-ink); }
      /* Die Textkante JEDER Zelle — eine Zahl, eine Stelle. Eine Zelle mit
         Eingabefeld gibt ihr Polster an das Feld ab (siehe .tippbar weiter
         unten); dessen eigenes Polster plus sein Rahmen ergeben wieder
         dieselbe Kante. Vorher stand der Text einer tippbaren Zelle 15px vom
         Rand, der ihrer Nachbarin 10px — in derselben Zeile. */
      .kopf > div,
      .zeile > div {
        padding: 0 var(--se-zell-x);
        line-height: calc(var(--zeilen-hoehe) - 1px);
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: 1px solid var(--se-line-soft);
      }

      .kopf > div { line-height: calc(var(--takt) - 1px); }

      /* Die Herkunfts-Zeile unter dem Spaltentitel — NUR im Editor.
         Die Kopfzeile traegt oben eine FESTE Hoehe (var(--takt)); ohne das hier
         schneidet sie die zweite Zeile schlicht ab. Der Kopf darf darum im
         Editor wachsen; die Zeilenrechnung traegt das, weil sie die Kopfhoehe
         misst (rumpfMessung liest offsetHeight). In der exportierten Maske
         bleibt alles, wie es war — dort gibt es die Zeile gar nicht. */
      :host([data-ff-editor]) .kopf {
        height: auto;
        min-height: var(--takt);
      }
      .kopf > div.mit-herkunft {
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.3;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      /* Beide Zeilen kuerzen sich selbst. Als Flex-Kinder greift das
         text-overflow der Zelle nicht mehr auf sie durch. */
      .kopf-titel,
      .kopf-herkunft {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kopf-herkunft {
        font-size: var(--se-fs-sm);
        font-weight: 400;
        color: var(--se-faint);
      }
      .kopf > div:last-child,
      .zeile > div:last-child { border-right: none; }
      .kopf > div { cursor: pointer; user-select: none; }
      .sort-pfeil { font-size: 9px; color: var(--se-muted); }

      .zeile > div { color: var(--se-ink); }

      .kopf > div.zahl,
      .zeile > div.zahl {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .zeile > div.status {
        display: flex;
        align-items: center;
      }

      .zeile > div.bild {
        display: flex;
        align-items: center;
      }
      .bild-name {
        display: flex;
        align-items: center;

        gap: var(--se-gap);
        min-width: 0;
      }

      .bild-zeichen {
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        flex: none;
      }
      .bild-zeichen img {
        width: 100%;
        height: 100%;
        display: block;

        object-fit: contain;
      }
      .bild-text { min-width: 0; }

      .bild-titel,
      .bild-unter {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bild-titel {
        font-size: var(--se-fs-lg);
        font-weight: 600;
        line-height: 1.25;
      }
      .bild-unter {
        color: var(--se-muted);
        font-size: var(--se-fs-sm);
        line-height: 1.35;
      }

      .fusszeile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 10px;
        border-top: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-sm);
        color: var(--se-muted);
      }
      .seiten-nav {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      /* Die Summen stehen rechts neben der Zaehlzeile — Titel blass, Wert
         kraeftig, Ziffern in fester Breite, damit die Kante steht. */
      /* Aenderbare Zelle: ruhig, bis die Zeile darunter liegt — wie in der
         Handmaske (dort .zi.still). Vorgemerkt = bernstein, damit man auf
         einen Blick sieht, was noch nicht geschrieben ist. */
      /* Zum Loeschen vorgemerkt: durchgestrichen und blass — die Zeile ist
         noch da, aber sie geht. Zurueckgenommen wird sie am selben Kreuz. */
      .zeile.geloescht > div { text-decoration: line-through; color: var(--se-muted); }

      /* Der Zeilen-Status ist EIN Balken links, sonst nichts: keine Worte in
         der Zeile (Nutzer-Vorgabe). Er steht NACH .gewaehlt, weil er den
         Auswahl-Balken schlagen muss — was noch nicht geschrieben ist, ist
         die dringendere Auskunft. Der Klartext haengt im title. */
      .zeile[data-status="erfasst"] {
        box-shadow: inset 3px 0 0 var(--se-accent);
        background: var(--se-accent-soft);
      }
      .zeile[data-status="geaendert"],
      .zeile[data-status="loeschung"] { box-shadow: inset 3px 0 0 var(--se-amber); }
      .zeile[data-status="loeschung"] { background: var(--se-red-shell); }
      .zeile[data-status="schreibt"] {
        box-shadow: inset 3px 0 0 var(--se-accent);
        animation: se-schreibt 1.1s ease-in-out infinite;
      }
      /* Hinausgeschickt: derselbe Balken wie eine Vormerkung, nur blass — die
         Zeile ist erledigt, aber noch unbestaetigt. Kein Wort in der Zeile. */
      .zeile[data-status="geschrieben"] {
        box-shadow: inset 3px 0 0 var(--se-faint);
        color: var(--se-muted);
      }
      .zeile[data-status="fehler"] {
        box-shadow: inset 3px 0 0 var(--se-red);
        background: var(--se-red-shell);
      }
      @keyframes se-schreibt { 50% { opacity: 0.55; } }
      @media (prefers-reduced-motion: reduce) {
        .zeile[data-status="schreibt"] { animation: none; }
      }

      /* Das Kreuz sitzt am rechten Rand der Zeile, ueber dem letzten Feld. */
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

      /* Treffer der Suchzeile: gelb hinterlegt, Schriftfarbe bleibt — wie in
         der Handmaske (dort <mark> mit #ffedb0). */
      mark {
        padding: 0 1px;
        color: inherit;
        background: var(--se-amber-soft);
        border-radius: 2px;
      }

      /* Eine tippbare Zelle ist eine ZELLE, kein Formularfeld — weder im
         Ruhezustand noch unter der Maus noch mit der Schreibmarke darin.
         Dass man "drin" ist, sagt allein die blinkende Marke, wie in einer
         Tabellenkalkulation (Nutzer-Ansage 2026-08-28: "weg damit"). Vorher
         zog Hover einen Rahmen und Fokus einen zweiten in Akzentfarbe; in
         einer Zeile mit sechs tippbaren Spalten flackerte beim Ueberfahren
         die halbe Zeile.

         Der transparente Rahmen BLEIBT: er haelt die Hoehe. Ohne ihn springt
         der Text um einen Pixel, sobald die Zelle den Zustand wechselt.

         Gilt fuer die gebuchte Zeile (.zell-eingabe) und die Erfassungszeile
         (.erf-eingabe) gemeinsam — es ist dieselbe Sache, und zwei Kopien
         liefen beim ersten Aendern auseinander. */
      /* Die Zelle, die ein Eingabefeld traegt, gibt ihr Polster an das Feld
         ab — zusammen ergeben sie wieder --se-zell-x. Ohne diese Regel steht
         der Text einer tippbaren Zelle um Feld-Polster plus Rahmen weiter
         rechts als der ihrer Nachbarin. */
      .zeile > div.tippbar,
      .zeile.erfassung > div {
        padding: 0 calc(var(--se-zell-x) - var(--se-eingabe-x) - var(--se-border));
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
      .zeile > div.zahl .zell-eingabe,
      .zeile > div.zahl .erf-eingabe { text-align: right; }
      .erf-eingabe::placeholder { color: var(--se-faint); }

      /* Die Vormerkung ist etwas anderes als ein Eingabefeld: sie sagt, dass
         hier etwas UNGESCHRIEBENES steht, und muss sichtbar bleiben. */
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
        margin-left: auto;
        padding-left: 12px;
      }
      .summen + .seiten-nav { padding-left: 12px; }
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

      .steuerung { display: none; }
      :host([data-ff-editor]) .steuerung {
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 2;
        display: inline-flex;
        gap: 4px;
      }
      .steuerung button {
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        padding: 3px 7px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        color: var(--se-muted);
        cursor: pointer;
      }
      .steuerung button:hover {
        border-color: var(--se-accent);
        color: var(--se-accent);
      }
`,q=class e extends D{constructor(...e){super(...e),this.spalten=Ma(),this.spaltenHerkunft=[],this.source=``,this.suche=`ja`,this.erfassung=`nein`,this.blaettern=`ja`,this.loeschbar=`nein`,this.kopfzeile=`ja`,this.leerText=Ua,this.datenzeilen=[],this.zusatzzeilen=[],this.rohzeilen=[],this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this.datenGeliefert=!1,this._besitz=`softengine`,this._ansicht=new Xo({baustein:this,editable:()=>this.editable,zeilenHoehe:()=>this.zeilenHoehe,melde:()=>this.requestUpdate()}),this._erfassung=new so,this._lauf=new Ro(()=>this.requestUpdate()),this._zeilen=new Io({baustein:this,spalten:()=>this.spaltenListe(),rohzeilen:()=>this.rohzeilen,datenzeilen:()=>this.datenzeilen,melde:()=>this.requestUpdate(),lauf:this._lauf,erfassungAn:()=>this.erfassungAn,fokussiereErfassungsZelle:e=>this.fokussiereErfassungsZelle(e)}),this.nimmSeFokus=e=>{e.defaultPrevented||!this.erfassungAn||this.hasAttribute(`data-ff-editor`)||(e.preventDefault(),this.fokussiereErfassungsZelle(0))}}static{this.blockType=`tabelle`}static{this.tagName=`ff-tabelle`}static{this.displayName=`Tabelle`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.kannAuswahlFolgen=!0}static{this.kannErfassen={wenn:{attributeName:`erfassung`,equals:`ja`}}}static{this.aenderungsSchluessel=`aenderbar`}static{this.kannLoeschen={wenn:{attributeName:`loeschbar`,equals:`ja`}}}static{this.blockEvents=[{key:`onRowClick`,name:`Zeile gewählt`},{key:`onRowDblClick`,name:`Zeile doppelt geklickt`}]}static{this.listenBindung=es}static{this.defaultProps={width:`fill`,source:``,spalten:Ma(),suche:`ja`,erfassung:`nein`,blaettern:`ja`,loeschbar:`nein`,kopfzeile:`ja`,tagField:``,leerText:Ua}}static{this.customProperties=as}static{this.raster={startW:14,startH:8,minW:6,minH:4}}get besitz(){return this._besitz}set besitz(e){e!==this._besitz&&(this._besitz=e,this.setzeAbgeleitetesZurueck(),this.isConnected&&(e===`provided`?bo(this):yo(this)),this.requestUpdate())}set bereitgestellteZeilen(e){let t=lo(e);this.rohzeilen=t.rohzeilen,this.datenzeilen=t.datenzeilen,this.zusatzzeilen=t.zusatzzeilen,this.datenGeliefert=!0,this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this._ansicht.nachPush(),this.requestUpdate()}setzeAbgeleitetesZurueck(){this.rohzeilen=[],this.datenzeilen=[],this.zusatzzeilen=[],this.datenGeliefert=!1,this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this._ansicht.zuruecksetzen(),this._erfassung.zuruecksetzen()}get erfassteZeilen(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.werte)}get erfassteSchluessel(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.kennung)}get geaenderteZeilen(){return this._zeilen.geaenderteZeilen}get geloeschteZeilen(){return this._zeilen.geloeschteZeilen}zeileSchreibt(e,t){this._lauf.schreibt(e,t)}zeileGescheitert(e,t,n){this._lauf.gescheitert(e,t,n)}laufFertig(e,t){if(this._lauf.fertig(e,t),e===`erfasst`){this._erfassung.markiereGeschrieben(this.erfassungsUmfeld(),t)&&this.requestUpdate();return}this._zeilen.austragen(e,t)}vergissGeschriebene(){this._erfassung.vergissGeschriebene()&&this.requestUpdate()}erfasstStand(e){return this._lauf.zeigt(`erfasst`,this._erfassung.schluessel[e]??``,this._erfassung.istGeschrieben(e)?`geschrieben`:`erfasst`)}erfasseZeile(){return this._erfassung.erfasse(this.erfassungsUmfeld())?(this.requestUpdate(),this.fokussiereErfassungsZelle(0),this.zeigeLetzteErfasste(),!0):!1}zeigeLetzteErfasste(){this.updateComplete.then(()=>{let e=this.shadowRoot?.querySelector(`.koerper`);e&&(e.scrollTop=e.scrollHeight)})}fokussiereSuche(){return this._ansicht.fokussiereSuche()}setzeSuchtext(e){this._ansicht.setzeSuchtext(e),this.requestUpdate()}get hatQuelle(){return this._besitz===`provided`||So(this.hasAttribute(`data-ff-editor`),this.source)}spaltenListe(){return Ia(this.spalten)}get zeilenHoehe(){return Ca(this.spaltenListe())}get erfassungAn(){return this.erfassung===`ja`}erfassungsWirt(){return{baustein:this,lauf:this._erfassung.lauf,umfeld:()=>this.erfassungsUmfeld(),melde:()=>this.requestUpdate(),fokussiere:e=>this.fokussiereErfassungsZelle(e),erfasseZeile:()=>this.erfasseZeile()}}fokussiereErfassungsZelle(e){this.updateComplete.then(()=>{let t=this.shadowRoot?.querySelectorAll(`.zeile.erfassung .erf-eingabe`)?.[e];t&&(t.focus(),t.scrollIntoView({block:`nearest`}))})}erfassungsUmfeld(){return this._erfassung.umfeld(this,this.spaltenListe(),this.source)}aendere(e){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:`spalten`,value:e},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this._besitz===`softengine`&&yo(this),document.addEventListener(Fn,this.nimmSeFokus),this._ansicht.beobachte()}firstUpdated(){this._ansicht.beobachte()}willUpdate(e){super.willUpdate(e),!(!this.erfassungAn||this.hasAttribute(`data-ff-editor`))&&this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())}updated(){this._ansicht.nachRendern(),Tr(this)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(Fn,this.nimmSeFokus),Ao(this),this._ansicht.loese(),As(this),bo(this)}static{this.styles=[D.styles,jr,Ka,ds,ni,co]}render(){let t=this.spaltenListe(),n=e=>e.stopPropagation(),r=is({spalten:t,hatQuelle:this.hatQuelle,datenGeliefert:this.datenGeliefert,datenzeilen:this.datenzeilen,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,wunschSeite:this._ansicht.seite,gemessen:this._ansicht.mass,erfassungAn:this.erfassungAn,erfassteAnzahl:this._erfassung.zeilen.length,wertVon:(e,t)=>this._zeilen.zellWert(e,t),blaettert:this.blaettern===`ja`});return v`<div class="tabelle" style=${G({"--takt":`${r.takt}px`,"--zeilen-hoehe":`${r.zeilenHoehe}px`})}>
      ${To(()=>this.spaltenListe(),e=>this.aendere(e),n)}
      ${us({spalten:t,cols:r.cols,editable:this.editable,imEditor:this.hasAttribute(`data-ff-editor`),zeigeKopf:this.kopfzeile===`ja`,herkunft:this.spaltenHerkunft,auswahlSemantik:N(this)!==``,zeigeSuche:this.suche===`ja`,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,zeilen:r.zeilen,linealTakte:r.linealTakte,datenzeilen:this.datenzeilen,zusatzzeilen:this.zusatzzeilen,hatQuelle:r.hatQuelle,auswahlIndex:this.auswahlIndex,aendernMoeglich:!this.hasAttribute(`data-ff-editor`)&&r.hatQuelle&&go(this),loeschbar:this.loeschbar===`ja`&&!this.hasAttribute(`data-ff-editor`)&&r.hatQuelle&&go(this),zeilenStand:this._zeilen,leer:r.leer,leerText:this.leerText,erfasste:this._erfassung.zeilen,erfasstStand:e=>this.erfasstStand(e),erfassung:this.erfassungAn?ao(this.erfassungsWirt(),r.cols,(r.linealTakte??1)<=0):b},{setzeSuchtext:e=>this._ansicht.setzeSuchtext(e),...jo({baustein:this,editable:()=>this.editable,prop:e.listenBindung.prop,liste:()=>this.spaltenListe(),aendere:e=>this.aendere(e),sortiere:e=>this._ansicht.klickSortiere(e)}),aktiviereZeile:(e,t)=>Zo(this,this.rohzeilen,e,t),zeileDoppelt:e=>Qo(this,this.rohzeilen,e),nimmErfassteZeile:e=>{this._erfassung.entferne(e)&&this.requestUpdate()},holeErfassteZeile:e=>{this._erfassung.zurueckholen(this.erfassungsUmfeld(),e)&&(this.requestUpdate(),this.fokussiereErfassungsZelle(0))},schalteLoeschung:e=>this._zeilen.schalteLoeschung(e)})}
      ${os({hatQuelle:r.hatQuelle,sichtbar:r.gesamt,gesamt:this.datenzeilen.length,suchtAktiv:this._ansicht.suchtAktiv,auswahlAktiv:this.durchAuswahlGefiltert,seite:r.seite,seiten:r.seiten,blaettert:this.blaettern===`ja`,summen:r.summen,erfasst:this._erfassung.zeilen.length,geaendert:this._zeilen.vorgemerkteAenderungen(),geloescht:this._zeilen.vorgemerkteLoeschungen(),leer:r.leer},{blaettere:e=>this._ansicht.blaettere(e)})}
    </div>`}};E([w({converter:{fromAttribute:e=>e?La(e):Ma(),toAttribute:e=>JSON.stringify(e)}})],q.prototype,`spalten`,void 0),E([w({attribute:!1})],q.prototype,`spaltenHerkunft`,void 0),E([w()],q.prototype,`source`,void 0),E([w()],q.prototype,`suche`,void 0),E([w()],q.prototype,`erfassung`,void 0),E([w()],q.prototype,`blaettern`,void 0),E([w()],q.prototype,`loeschbar`,void 0),E([w()],q.prototype,`kopfzeile`,void 0),E([w()],q.prototype,`leerText`,void 0),E([w({attribute:!1})],q.prototype,`datenzeilen`,void 0),E([w({attribute:!1})],q.prototype,`zusatzzeilen`,void 0),E([w({attribute:!1})],q.prototype,`rohzeilen`,void 0),E([w({attribute:!1})],q.prototype,`auswahlIndex`,void 0),E([w({attribute:!1})],q.prototype,`durchAuswahlGefiltert`,void 0),E([w({attribute:!1})],q.prototype,`datenGeliefert`,void 0),D.defineAndRegister(q);function fs(e){return Math.min(900,Math.max(520,160+180*e))}function ps(e){return v`<div class="nachschlag">
    <input
      class="ctrl"
      type="text"
      .value=${e.wert}
      @input=${t=>e.onTippen(t.target.value)}
      @keydown=${e.onTaste}
      @blur=${()=>e.onVerlassen()}
    />
    <button
      class="lupe"
      type="button"
      aria-label="Nachschlagen"
      title="Nachschlagen"
      @click=${()=>e.onLupe()}
    >${Ki()}</button>
    ${e.liste}
  </div>`}var ms={prop:`nachschlagSpalten`,titelKey:`titel`,feldKey:`feld`,standardTitel:ka,quelleProp:`nachschlagQuelle`};function hs(e){if(typeof e==`string`)try{e=JSON.parse(e)}catch{return[]}return Array.isArray(e)&&e.length>0?Ia(e):[]}function gs(e,t){let n=e[0];return n===void 0?t:n.feld}function _s(e,t){let n=e.trim();return n===``||n===t.trim()}function vs(e,t,n){let r=t.trim(),i=[],a=_s(t,n),o=new Set;for(let t of e){let e=A(t,n).trim(),s=r===``?e:A(t,r).trim();if(!(s===``&&e===``)){if(a){if(o.has(e))continue;o.add(e)}i.push({anzeige:s,wert:e,satz:t})}}return i}function ys(e,t,n,r){return vs(Yt(e,t).rows,n,r)}function bs(e){let t=k(R().FF_DATA_SOURCES,e);return t?Dt(R().SEDATA,t.name,t.tableId,t.offenerSatz):null}function xs(e){if(e.quelleId===``||e.speicherFeld===``)return{ok:!1,grund:`unvollstaendig`};let t=bs(e.quelleId);if(t===null)return{ok:!1,grund:`quelleFehlt`};let n=gs(hs([...e.spalten]),e.speicherFeld);return{ok:!0,eintraege:ys(e.el,t,n,e.speicherFeld)}}function Ss(e,t){return t&&e.length===1?e[0]:null}function Cs(e,t){let{rows:n,gefiltert:r}=Yt(e,[t]);return!r||n.length>0}function ws(e,t,n){return e===``?t===``&&n===``?`nichts`:`leeren`:e===t?`nichts`:`zurueck`}var Ts=null,Es=null,Ds=null;function Os(e){return e.shadowRoot?.querySelector(`.lupe`)??null}function ks(e=!0){let t=e?Ds:null;Ds=null,Ts?.remove(),Ts=null,Es=null,t?.focus()}function As(e){Es===e&&ks(!1)}function js(e){return[{titel:e.speicherTitel===``?`Wert`:e.speicherTitel,feld:e.speicherFeld,art:ha}]}function Ms(e){let t=e=>e.stopPropagation(),n=e.editor;return v`<ff-dialog-rahmen
    viewport
    escape-schliesst
    ohne-modal
    inhalt-fest
    ?ziehbar=${n!==void 0}
    ?data-ff-nachschlagen=${n===void 0}
    style=${n===void 0?b:`z-index:40`}
    .titel=${e.titel===``?`Nachschlagen`:e.titel}
    .breite=${e.breite}
    .hoehe=${e.hoehe}
    @ff-dialog-groesse=${n===void 0?b:e=>{e.stopPropagation(),n.onGroesse(e.detail)}}
    @ff-dialog-schliessen=${t=>{n!==void 0&&t.stopPropagation(),e.onSchliessen()}}
    @click=${t}
    @pointerdown=${n===void 0?b:t}
    @dblclick=${n===void 0?b:t}
  >${e.inhalt}</ff-dialog-rahmen>`}function Ns(e,t){let n=hs([...e.spalten]),r=_s(gs(n,e.speicherFeld),e.speicherFeld);return v`<ff-tabelle
    fuellt
    suche="ja"
    style="--se-r-lg:0px"
    .besitz=${`provided`}
    .spalten=${n.length>0?n:js(e)}
    .leerText=${`Diese Quelle hat keine Sätze.`}
    .bereitgestellteZeilen=${t.map(e=>({rohzeile:e.satz,zellen:n.length>0?n.map(t=>t.feld===``?``:A(e.satz,t.feld)):r?[e.wert]:[e.anzeige,e.wert]}))}
  ></ff-tabelle>`}function Ps(e){let t=e.eintraege;if(t===void 0){let n=xs(e);if(!n.ok){L(n.grund===`unvollstaendig`?`Nachschlagen braucht an diesem Feld eine Quelle und „Gespeichert wird".`:`Die Nachschlage-Quelle dieses Feldes ist in der Maske nicht vorhanden.`);return}t=n.eintraege}ks(!1);let n=document.createElement(`div`);n.style.display=`contents`,Ve(Ms({titel:e.titel,breite:e.breite,hoehe:e.hoehe,inhalt:Ns(e,t),onSchliessen:()=>ks()}),n);let r=n.querySelector(Zt),i=n.querySelector(q.tagName);i?.addEventListener(Ho,n=>{let r=n.detail,i=t[r.rohIndex];i&&(ks(),e.onUebernehmen(i.anzeige,i.wert,i.satz))}),Ds=e.rueckFokus??Os(e.el),document.body.appendChild(n),Ts=n,Es=e.el;let a=e.suchtext??``;i&&a!==``&&i.setzeSuchtext(a),r&&i&&Promise.all([r.updateComplete,i.updateComplete]).then(()=>{r.isConnected&&i.fokussiereSuche()})}function Fs(e){return Ms({titel:e.titel,breite:e.breite,hoehe:e.hoehe,onSchliessen:e.onSchliessen,editor:{onGroesse:e.onGroesse},inhalt:v`<ff-tabelle
      data-ff-editor
      fuellt
      suche="ja"
      style="--se-r-lg:0px"
      .spalten=${[...e.spalten]}
      .editable=${!0}
      @ff-prop-change=${t=>{t.stopPropagation();let n=t.detail;n?.attr===`spalten`&&e.onAendern(Ia(n.value))}}
      @ff-listen-bind=${t=>{t.stopPropagation();let n=t.detail;typeof n?.index==`number`&&e.onFeldWahl({index:n.index,top:n.top??0,left:n.left??0,...Array.isArray(n.liste)?{liste:n.liste}:{}})}}
    ></ff-tabelle>`})}var J=class e extends D{constructor(...e){super(...e),this.fieldType=`text`,this.placeholder=`Feldname`,this.options=``,this.source=``,this.value=``,this.valueField=``,this.nachschlagQuelle=``,this.speicherFeld=``,this.speicherTitel=``,this.nachschlagSpalten=[],this.fensterBreite=520,this.fensterHoehe=380,this.einzigerTreffer=`nein`,this.spaltenDialog=!1,this.anzeige=``,this.getippt=null,this.marke=0,this.markeVonHand=!1,this.listeZu=!1,this.vorschlaege=[],this.satz=void 0,this.angehakt=!1,this.imSteuerelement=!1}static{this.blockType=`formfeld`}static{this.tagName=`ff-formfeld`}static{this.displayName=`Formularfeld`}static{this.category=`eingabe`}static{this.acceptsDataSource={wenn:{attributeName:`fieldType`,notEquals:`nachschlagen`}}}static{this.kannAuswahlFolgen=!0}static{this.satzWahl={quelleProp:`nachschlagQuelle`,wenn:{attributeName:`fieldType`,equals:`nachschlagen`}}}static{this.listenBindung=ms}static{this.bindableSpots=[{prop:`value`,label:`Wert`,wenn:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]},vorschauProp:`placeholder`}]}static{this.actionValueSpots=[{prop:`value`,label:`Wert`}]}static{this.blockEvents=[{key:`onChange`,name:`Wert geändert`}]}static{this.defaultProps={width:240,fieldType:`text`,placeholder:`Feldname`,options:``,source:``,value:``,valueField:``,nachschlagQuelle:``,speicherFeld:``,speicherTitel:``,nachschlagSpalten:[],fensterBreite:520,fensterHoehe:380,einzigerTreffer:`nein`}}static{this.raster={startW:6,startH:2,minW:2,minH:2}}static{this.customProperties=ii}static{this.styles=[D.styles,Vi,ni]}onInput(e){let t=e.target;this.value=Ui(this.fieldType)===`date`?Ni(t.value):t.value}onChange(){this.dispatchEvent(new Event(`change`))}textTpl(e,t=!1){return v`<span
      class=${e}
      ?hidden=${t}
      data-ff-editable
      @click=${this.onTextClick}
      @dblclick=${e=>this.inlineEdit(e,`placeholder`)}
    >${this.placeholder}</span>`}onTextClick(){this.hasAttribute(`data-ff-editor`)||this.setzeHaken(!this.angehakt)}setzeHaken(e){this.angehakt!==e&&(this.angehakt=e,this.dispatchEvent(new Event(`change`)))}controlTpl(e){switch(e){case`textarea`:return v`<textarea class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}></textarea>`;case`select`:{let e=this.options.split(`,`).map(e=>e.trim()).filter(e=>e!==``),t=this.value!==``&&!e.includes(this.value);return v`<select class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}>
          <option value="" disabled hidden></option>
          ${t?v`<option value=${this.value} hidden>${this.value}</option>`:b}
          ${e.length===0?v`<option disabled>(keine Optionen)</option>`:e.map(e=>v`<option value=${e}>${e}</option>`)}
        </select>`}case`nachschlagen`:return ps({wert:this.getippt??this.anzeige,onTippen:e=>{this.getippt=e,this.marke=0,this.markeVonHand=!1,this.listeZu=!1},onTaste:e=>this.onNachschlagTaste(e),onVerlassen:()=>this.onNachschlagVerlassen(),onLupe:()=>this.onLupe(),liste:this.vorschlaege.length===0?b:ti({eintraege:this.vorschlaege,marke:this.marke,onWaehlen:e=>this.uebernimmVorschlag(e),onMarke:e=>{this.marke=e}})});default:return v`<input
          class="ctrl"
          type=${e}
          .value=${e===`date`?Mi(this.value):this.value}
          @input=${this.onInput}
          @change=${this.onChange}
          @focus=${()=>{this.imSteuerelement=!0}}
          @blur=${()=>{this.imSteuerelement=!1}}
        />`}}onLupe(e=``){if(this.hasAttribute(`data-ff-editor`)){this.spaltenDialog=!0;return}Ps({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel,spalten:this.nachschlagSpalten,titel:this.placeholder,breite:this.fensterBreite,hoehe:this.fensterHoehe,suchtext:e,onUebernehmen:(e,t,n)=>this.uebernimmUndMelde(e,t,n)})}spaltenEffektiv(){let e=hs(this.nachschlagSpalten);return e.length>0?e:js({speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel})}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}spaltenDialogTpl(){return Fs({titel:this.placeholder,spalten:this.spaltenEffektiv(),breite:this.fensterBreite,hoehe:this.fensterHoehe,onGroesse:t=>{let n=t.achse===`breite`?`fensterBreite`:`fensterHoehe`;if(t.geste===`standard`){this.meldeProp(n,e.defaultProps[n]);return}this.meldeProp(n,t.wert,t.geste===`laeuft`?void 0:t.geste)},onAendern:e=>{this.meldeProp(`nachschlagSpalten`,e)},onFeldWahl:e=>{this.dispatchEvent(new CustomEvent(`ff-listen-bind`,{detail:{prop:`nachschlagSpalten`,...e},bubbles:!0,composed:!0}))},onSchliessen:()=>{this.spaltenDialog=!1}})}willUpdate(e){super.willUpdate(e),e.has(`fieldType`)&&Ui(this.fieldType)!==`nachschlagen`&&(this.spaltenDialog=!1),this.vorschlaege=this.berechneVorschlaege(),this.marke=$r(this.marke,this.vorschlaege.length)}updated(e){super.updated(e),this.toggleAttribute(`data-ff-liste`,this.vorschlaege.length>0)}berechneVorschlaege(){if(this.getippt===null||this.listeZu||Ui(this.fieldType)!==`nachschlagen`||this.hasAttribute(`data-ff-editor`))return[];let e=xs({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});return e.ok?Zr(e.eintraege,this.getippt):[]}onNachschlagTaste(e){if(this.hasAttribute(`data-ff-editor`))return;let t=this.vorschlaege.length,n=ei(e.key,{listeOffen:t>0,feldLeer:(this.getippt??this.anzeige)===``,treffer:t,markeVonHand:this.markeVonHand});if(n===`nichts`){e.key===`Enter`&&e.preventDefault();return}e.preventDefault(),n===`marke-hoch`||n===`marke-runter`?(this.marke=Qr(this.marke,t,n===`marke-hoch`?-1:1),this.markeVonHand=!0):n===`uebernehmen`?this.uebernimmVorschlag(this.marke):n===`liste-zu`?this.listeZu=!0:this.onLupe(this.getippt??``)}uebernimmVorschlag(e){let t=this.vorschlaege[e];t&&this.uebernimmUndMelde(t.anzeige,t.wert,t.satz)}leereNachschlagen(){this.satz=void 0,this.anzeige=``,this.value=``,Gt(N(this))}uebernimmUndMelde(e,t,n){this.getippt=null,this.listeZu=!1,this.marke=0,this.markeVonHand=!1,this.uebernimmSatz(e,t,n),this.dispatchEvent(new Event(`change`))}uebernimmSatz(e,t,n){this.anzeige=e===``?t:e,this.value=t,this.satz=n,Wt(N(this),n)}onNachschlagVerlassen(){if(this.hasAttribute(`data-ff-editor`))return;let e=ws(this.getippt??this.anzeige,this.anzeige,this.value);this.getippt=null,this.listeZu=!1,this.marke=0,this.markeVonHand=!1,e===`leeren`&&(this.leereNachschlagen(),this.dispatchEvent(new Event(`change`)))}pruefeEigenenWert(){Ui(this.fieldType)===`nachschlagen`&&(this.getippt!==null&&this.requestUpdate(),this.satz!==void 0&&!Cs(this,this.satz)&&this.leereNachschlagen(),this.uebernimmEinzigenTreffer())}uebernimmEinzigenTreffer(){if(this.einzigerTreffer!==`ja`)return;let e=xs({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});if(!e.ok)return;let t=Ss(e.eintraege,this.satz===void 0);t&&this.uebernimmSatz(t.anzeige,t.wert,t.satz)}render(){let e=Ui(this.fieldType);if(e===`checkbox`)return v`<div class="feld">
        <div class="zeile">
          <input
            class="ctrl"
            type="checkbox"
            .checked=${this.angehakt}
            @change=${e=>this.setzeHaken(e.target.checked)}
          />
          ${this.textTpl(`text`)}
        </div>
      </div>`;let t=e!==`nachschlagen`,n=(t?this.value:this.getippt??this.anzeige)===``;return v`<div class="feld">
      <div
        class=${`huelle${n?` leer`:``}${this.imSteuerelement?` tippt`:``}`}
        data-ff-spot=${t?`value`:b}
        ?data-ff-bound=${t&&this.valueField!==``}
      >
        ${this.controlTpl(e)}
        ${Wi.includes(e)?this.textTpl(`ph ${Gi[e]??``}`.trim(),!n):b}
      </div>
      ${this.spaltenDialog&&this.hasAttribute(`data-ff-editor`)?this.spaltenDialogTpl():b}
    </div>`}connectedCallback(){super.connectedCallback(),zi(this)}disconnectedCallback(){super.disconnectedCallback(),Bi(this),As(this)}};E([w()],J.prototype,`fieldType`,void 0),E([w()],J.prototype,`placeholder`,void 0),E([w()],J.prototype,`options`,void 0),E([w()],J.prototype,`source`,void 0),E([w()],J.prototype,`value`,void 0),E([w()],J.prototype,`valueField`,void 0),E([w()],J.prototype,`nachschlagQuelle`,void 0),E([w()],J.prototype,`speicherFeld`,void 0),E([w()],J.prototype,`speicherTitel`,void 0),E([w({converter:{fromAttribute:e=>hs(e??``),toAttribute:e=>JSON.stringify(e)}})],J.prototype,`nachschlagSpalten`,void 0),E([w({type:Number})],J.prototype,`fensterBreite`,void 0),E([w({type:Number})],J.prototype,`fensterHoehe`,void 0),E([w()],J.prototype,`einzigerTreffer`,void 0),E([T()],J.prototype,`spaltenDialog`,void 0),E([T()],J.prototype,`anzeige`,void 0),E([T()],J.prototype,`getippt`,void 0),E([T()],J.prototype,`marke`,void 0),E([T()],J.prototype,`listeZu`,void 0),E([T()],J.prototype,`angehakt`,void 0),E([T()],J.prototype,`imSteuerelement`,void 0),D.defineAndRegister(J);var Is=`ziel`,Ls=o`
  :host([data-ff-ziel]) .ziel {
    background: var(--se-accent-soft);
    outline: var(--se-border) solid var(--se-accent);
    outline-offset: calc(-1 * var(--se-border));
  }
`,Rs=o`
  ::slotted(:not([hat-reiter])) { margin-top: 24px; }
  slot { display: contents; }
`,zs=`frei · hierher ziehen`,Bs=`ff-zimmer-inhalt`,Y=class extends D{constructor(...e){super(...e),this.heading=`Neues Zimmer`,this.leerHinweis=``}static{this.blockType=`kanban-zimmer`}static{this.tagName=`ff-kanban-zimmer`}static{this.displayName=`Kanban-Zimmer`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[H.blockType]}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban-spalte`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={heading:`Neues Zimmer`}}static{this.styles=[D.styles,Ka,Rs,Ls,o`
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
    `]}onSlotChange(){this.dispatchEvent(new CustomEvent(Bs,{bubbles:!0,composed:!0}))}render(){return v`<div class="zimmer ${Is}">
      <div
        class="kopf"
        data-ff-editable
        @dblclick=${e=>this.inlineEdit(e,`heading`)}
      >${this.heading}</div>
      <div class="body">
        <slot @slotchange=${this.onSlotChange}></slot>
        ${Ga(this.leerHinweis)}
      </div>
    </div>`}};E([w()],Y.prototype,`heading`,void 0),E([w({attribute:!1})],Y.prototype,`leerHinweis`,void 0),D.defineAndRegister(Y);var X=class extends D{static{this.blockType=`kanban-spalte`}static{this.tagName=`ff-kanban-spalte`}static{this.displayName=`Kanban-Spalte`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[H.blockType,Y.blockType]}static{this.addChildButton={label:`Zimmer`,childType:Y.blockType}}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={variant:`info`,heading:`Neue Spalte`,auffang:`nein`,zimmerField:``}}static{this.customProperties=[Ar(`variant`,`Bedeutung der Spalte — bestimmt ihre Farbwelt (Kopf, Fläche, Rahmen).`),U(`auffang`,`Auffangspalte`,`Einträge ohne passenden Spaltentitel landen hier.`,{requiresDataSource:!0,exclusiveAmongSiblings:!0}),{attributeName:`zimmerField`,name:`Unterteilen nach`,description:`Feld, das das Zimmer bestimmt. Wirkt nur mit Zimmern.`,kind:`field`}]}static{this.styles=[D.styles,Ka,Rs,Ls,o`

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

    `]}constructor(){super(),this.variant=`info`,this.heading=`Neue Spalte`,this.leerHinweis=``,this._count=0,this.addEventListener(Bs,()=>this.zaehle())}zaehle(){this._count=Array.from(this.querySelectorAll(H.tagName)).filter(e=>!e.hasAttribute(`data-ff-editor-helper`)).length}render(){return v`<div class="col ${Is} v-${Or(this.variant)}">
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
        ${Ga(this.leerHinweis)}
      </div>
    </div>`}};E([w()],X.prototype,`variant`,void 0),E([w()],X.prototype,`heading`,void 0),E([w({attribute:!1})],X.prototype,`leerHinweis`,void 0),E([T()],X.prototype,`_count`,void 0),D.defineAndRegister(X);function Vs(e,t){let n=e.trim().toLowerCase();if(n!==``)for(let e=0;e<t.length;e++){let r=t[e].trim().toLowerCase();if(r!==``&&r===n)return e}return-1}function Hs(e){return e.findIndex(e=>(e??``).trim()===`ja`)}var Us=new WeakMap,Ws=X.tagName,Gs=Y.tagName,Ks=H.tagName;function qs(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===Ws)}function Js(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===Ks)}function Ys(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===Gs)}function Xs(e){return[e,...Ys(e)]}function Zs(e,t){let n=e.getAttribute(`leertext`)??`Keine Datensätze.`,r=(e,t)=>{e.leerHinweis=t};for(let e of t){let t=Ys(e);for(let e of t)r(e,Js(e).length===0?zs:``);r(e,t.length===0&&Js(e).length===0?n:``)}}function Qs(e){return Je().find(t=>t.tagName===e.toLowerCase())?.bindableSpots??[]}function $s(e,t){let n=Ys(e);if(n.length===0)return null;let r=e.getAttribute(`zimmerfield`)??``;if(r===``)return n[0];let i=n.map(e=>e.getAttribute(`heading`)??Y.defaultProps.heading),a=Vs(A(t,r),i);return a>=0?n[a]:n[0]}function ec(e){Q?.board===e&&oc();let t=e.getAttribute(`statusfield`)??``,n=fo(e);if(!n)return;let r=qs(e);if(r.length===0)return;let i=Us.get(e);if(!i){let t=e.querySelector(`template[data-ff-template]`)?.content.firstElementChild??e.querySelector(Ks);t&&(i=t.cloneNode(!0),Us.set(e,i))}if(!i)return;let a=n.zeilen,o=r.map(e=>e.getAttribute(`heading`)??X.defaultProps.heading),s=Qs(i.tagName),c=Hs(r.map(e=>e.getAttribute(`auffang`))),l=n.lies;for(let e of r)for(let t of Xs(e))Js(t).forEach(e=>e.remove());for(let e of a){let a=i.cloneNode(!0),u=t===``?-1:Vs(A(e,t),o),d=u>=0?r[u]:c>=0?r[c]:r[0];($s(d,e)??d).appendChild(a);for(let t of s){let n=a.getAttribute(li(t.prop))??``;n!==``&&(a[t.prop]=l(e,n))}let f=St(n.quelle,e);Z.set(a,{row:e,pindex:f}),a.draggable=!0}Zs(e,r);let u=r.flatMap(e=>Xs(e).flatMap(Js)),d=Ht(N(e),u,e=>Z.get(e)?.row);for(let e of d)u[e].setAttribute(`data-ff-auswahl`,``)}var Z=new WeakMap,Q=null,tc=new WeakSet,nc=`data-ff-zieht`,rc=`data-ff-ziel`,ic=null;function ac(e){ic!==e&&(ic?.removeAttribute(rc),ic=e,ic?.setAttribute(rc,``))}function oc(){Q?.card.removeAttribute(nc),Q=null,ac(null)}function sc(e,t,n){for(let r of t.composedPath())if(r instanceof HTMLElement&&r.tagName.toLowerCase()===n&&e.contains(r))return r;return null}function cc(e,t){return sc(e,t,Ws)}function lc(e,t,n){if(!Q||Q.board!==e)return;let r=Z.get(Q.card);if(!r)return;let i=t.getAttribute(`heading`)??``,a=n?.getAttribute(`heading`)??``;V(e,`onCardDrop`,{PINDEX:r.pindex,VALUE:i,ZIMMER:a}).catch(B)}function uc(e){tc.has(e)||(tc.add(e),e.addEventListener(`click`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&Z.has(e))??null;if(!n)return;let r=Z.get(n);r&&Ut(N(e),r.row),V(e,`onCardClick`,{PINDEX:r?.pindex??``}).catch(B)}),e.addEventListener(`dragstart`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&Z.has(e))??null;n&&(Q={card:n,board:e},t.dataTransfer?.setData(`text/plain`,Z.get(n)?.pindex??``),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`),setTimeout(()=>{Q?.card===n&&n.setAttribute(nc,``)},0))}),e.addEventListener(`dragend`,oc),e.addEventListener(`dragover`,t=>{let n=cc(e,t);if(Q?.board!==e||!n){ac(null);return}t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`move`),ac(sc(e,t,Gs)??n)}),e.addEventListener(`dragleave`,t=>{let n=t.relatedTarget;(!(n instanceof Node)||!e.contains(n))&&ac(null)}),e.addEventListener(`drop`,t=>{let n=cc(e,t);n&&(t.preventDefault(),lc(e,n,sc(e,t,Gs)),oc())}))}var dc=Ci({hydriere:ec,verdrahte:uc}),fc=dc.connect,pc=dc.disconnect,mc=X.blockType,hc=class extends D{static{this.blockType=`kanban`}static{this.tagName=`ff-kanban`}static{this.displayName=`Kanban`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[mc]}static{this.childDirection=`row`}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.addChildButton={label:`Spalte`,childType:mc}}static{this.templateChild={type:H.blockType,label:`Muster`}}static{this.resizableHeight=!0}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.blockEvents=[{key:`onCardClick`,name:`Karte angeklickt`},{key:`onCardDrop`,name:`Karte verschoben`}]}static{this.defaultProps={width:`fill`,height:`fill`,source:``,statusField:``,tagField:``,leerText:Ua}}static{this.raster={startW:24,startH:20,minW:6,minH:8}}static{this.customProperties=[{attributeName:`statusField`,name:`Einsortieren nach`,description:`Feld, das die Spalte bestimmt. Leer: alle in die Auffang-Spalte.`,kind:`field`},{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Einträge des gewählten Tages.`,kind:`field`},Wa()]}static{this.defaultChildren=[{type:mc,props:{heading:`Offen`,variant:`warning`},children:[{type:H.blockType}]},{type:mc,props:{heading:`In Arbeit`,variant:`info`}},{type:mc,props:{heading:`Fertig`,variant:`success`}}]}static{this.styles=[D.styles,o`

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
    `]}render(){return v`<div class="board"><slot></slot></div>`}connectedCallback(){super.connectedCallback(),fc(this)}disconnectedCallback(){super.disconnectedCallback(),pc(this)}};D.defineAndRegister(hc);var gc={breite:56,breiteOffen:224},_c=`ff-seiten-wechsel`,vc=[{wert:`sonne`,name:`Sonnengelb`},{wert:`salbei`,name:`Salbeigrün`},{wert:`himmel`,name:`Himmelblau`},{wert:`flieder`,name:`Flieder`},{wert:`koralle`,name:`Koralle`}],yc=class extends D{static{this.blockType=`navi-eintrag`}static{this.tagName=`ff-navi-eintrag`}static{this.displayName=`Navi-Eintrag`}static{this.category=`layout`}static{this.acceptsChildren=!1}static{this.showInPalette=!1}static{this.allowedParentTypes=[`navi`]}static{this.resizableWidth=!1}static{this.defaultProps={seite:``,seitename:``,ton:`sonne`}}static{this.customProperties=[{attributeName:`seite`,name:`Seite`,description:`Welche Seite dieser Maske der Eintrag zeigt.`,kind:`seite`,klarnameProp:`seitename`,nurImEditor:!0},{attributeName:`ton`,name:`Farbe`,description:`Farbe des Zeichens vor dem Namen.`,kind:`select`,options:vc.map(e=>({value:e.wert,label:e.name}))}]}static{this.styles=[D.styles,o`
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

      :host([ton='sonne'])   { --ton: var(--se-amber); }
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
    `]}constructor(){super(),this.seite=``,this.seitename=``,this.ton=`sonne`,this.addEventListener(`click`,()=>this.melde())}melde(){let e={ansicht:this.seitename};this.dispatchEvent(new CustomEvent(_c,{detail:e,bubbles:!0,composed:!0}))}render(){return v`<span class="zeichen"></span>
      <span class="name">${this.seitename===``?`—`:this.seitename}</span>`}};E([w()],yc.prototype,`seite`,void 0),E([w()],yc.prototype,`seitename`,void 0),E([w({reflect:!0})],yc.prototype,`ton`,void 0),D.defineAndRegister(yc);var bc=`aktiv`;function xc(e){return Array.from(e.querySelectorAll(yc.tagName))}function Sc(e,t){let n=xc(e),r=t??n.find(e=>e.hasAttribute(bc))??n[0];for(let e of n)e===r?e.setAttribute(bc,``):e.removeAttribute(bc)}function Cc(e){let t=e.hasAttribute(`offen`);for(let n of xc(e))n.toggleAttribute(`breit`,t)}function wc(e){return e.getAttribute(`name`)??String(st.defaultProps.name)}function Tc(e,t){let n=e;for(;n&&n.parentElement!==t;)n=n.parentElement;return n}function Ec(e,t){let n=e.ownerDocument,r=Array.from(n.querySelectorAll(st.tagName)),i=r[0]?.parentElement??null;if(!i)return;let a=Tc(e,i);if(!a)return;let o=r.find(e=>wc(e)===t)??null;for(let e of Array.from(i.children))e!==a&&((r.includes(e)?e===o:o===null)?e.removeAttribute(`hidden`):e.setAttribute(`hidden`,``))}var Dc=new WeakMap,Oc=new WeakSet;function kc(e){let t=t=>{let n=t.detail;n&&(Sc(e,t.target instanceof Element?t.target:void 0),e.removeAttribute(`offen`),Cc(e),!e.hasAttribute(`data-ff-editor`)&&Ec(e,n.ansicht))};e.addEventListener(_c,t),Dc.set(e,t)}function Ac(e){let t=Dc.get(e);t&&(e.removeEventListener(_c,t),Dc.delete(e))}function jc(e){if(Sc(e),Cc(e),e.hasAttribute(`data-ff-editor`)||Oc.has(e))return;let t=xc(e)[0];if(!t)return;Oc.add(e);let n=()=>Ec(e,t.seitename);e.ownerDocument.readyState===`loading`?e.ownerDocument.addEventListener(`DOMContentLoaded`,n,{once:!0}):queueMicrotask(n)}var Mc=yc.blockType,Nc=class extends D{static{this.blockType=`navi`}static{this.tagName=`ff-navi`}static{this.displayName=`Navi`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[Mc]}static{this.addChildButton={label:`Eintrag`,childType:Mc}}static{this.containerHint=!1}static{this.defaultProps={}}static{this.customProperties=[]}static{this.maskenRand=!0}static{this.allowedParentTypes=[ot]}static{this.raster={startW:5,startH:24,minW:3,minH:3}}static{this.styles=[D.styles,o`
      :host {
        height: 100%;
        width: ${gc.breite}px;
        transition: width var(--se-move);
      }
      :host([offen]) { width: ${gc.breiteOffen}px; }
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
    `]}connectedCallback(){super.connectedCallback(),kc(this)}disconnectedCallback(){super.disconnectedCallback(),Ac(this)}klappen(){this.toggleAttribute(`offen`),Cc(this)}render(){return v`<div class="leiste">
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
          <slot @slotchange=${()=>jc(this)}></slot>
        </div>
      </div>`}};D.defineAndRegister(Nc);var Pc=li(`text`);function Fc(e){let t=e.getAttribute(`source`)??``,n=e.getAttribute(Pc)??``;return t===``||n===``?void 0:{sourceId:t,code:n}}function Ic(e){let t=ki(e,Pc);t.art!==`ungebunden`&&(e.text=t.art===`wert`?t.wert:``)}function Lc(e){Fc(e)&&(e.text=``)}var Rc=Ci({hydriere:Ic,verdrahte:Lc}),zc=Rc.connect,Bc=Rc.disconnect,Vc=6,Hc=96,Uc=14,Wc={duenn:`300`,normal:`400`,fett:`700`},Gc={links:`left`,mitte:`center`,rechts:`right`},Kc={standard:`var(--se-ink)`,gedaempft:`var(--se-muted)`,akzent:`var(--se-accent)`,erfolg:`var(--se-green)`,warnung:`var(--se-amber)`,fehler:`var(--se-red)`},qc=`standard`;function Jc(e){if(e===`ueberschrift`)return 15;if(e===`klein`)return 12;let t=typeof e==`number`?e:Number.parseFloat(String(e??``));return Number.isFinite(t)?Math.min(Hc,Math.max(Vc,t)):Uc}function Yc(e){return typeof e==`string`&&e in Wc?e:`normal`}function Xc(e){return typeof e==`string`&&e in Gc?e:`links`}function Zc(e){return typeof e==`string`&&e in Kc?e:qc}var $=class extends D{constructor(...e){super(...e),this.groesse=Uc,this.gewicht=`normal`,this.ausrichtung=`links`,this.farbe=qc,this.text=`Text`,this.source=``,this.textField=``}static{this.blockType=`text`}static{this.tagName=`ff-text`}static{this.displayName=`Text`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.kannAuswahlFolgen=!0}static{this.bindableSpots=[{prop:`text`,label:`Text`}]}static{this.defaultProps={width:`fill`,groesse:Uc,gewicht:`normal`,ausrichtung:`links`,farbe:qc,text:`Text`,source:``,textField:``}}static{this.raster={startW:6,startH:2,minW:1,minH:1}}static{this.customProperties=[{attributeName:`groesse`,name:`Größe`,description:`Schriftgröße in Pixeln.`,kind:`number`,unit:`px`,min:Vc,max:Hc,inspectorRow:`Text-Stil`},{attributeName:`gewicht`,name:`Gewicht`,description:`Strichstärke der Schrift.`,kind:`segment`,options:[{value:`duenn`,label:`Dünn`},{value:`normal`,label:`Normal`},{value:`fett`,label:`Fett`}],inspectorRow:`Text-Stil`},{attributeName:`ausrichtung`,name:`Ausrichtung`,description:`Wo der Text in seiner Breite sitzt.`,kind:`segment`,options:[{value:`links`,label:`Links`},{value:`mitte`,label:`Mitte`},{value:`rechts`,label:`Rechts`}],inspectorRow:`Text-Stil`},{attributeName:`farbe`,name:`Farbe`,description:`Textfarbe aus den Farben der Maske.`,kind:`select`,options:[{value:`standard`,label:`Standard`},{value:`gedaempft`,label:`Gedämpft`},{value:`akzent`,label:`Akzent`},{value:`erfolg`,label:`Erfolg`},{value:`warnung`,label:`Warnung`},{value:`fehler`,label:`Fehler`}]}]}static{this.styles=[D.styles,o`
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
    `]}render(){return v`<div
      class="text"
      style=${G({fontSize:`${Jc(this.groesse)}px`,fontWeight:Wc[Yc(this.gewicht)],textAlign:Gc[Xc(this.ausrichtung)],color:Kc[Zc(this.farbe)]})}
      data-ff-editable
      data-ff-spot="text"
      ?data-ff-bound=${this.textField!==``}
      @dblclick=${e=>this.inlineEdit(e,`text`)}
    >${this.text}</div>`}connectedCallback(){super.connectedCallback(),zc(this)}disconnectedCallback(){super.disconnectedCallback(),Bc(this)}};E([w({type:Number})],$.prototype,`groesse`,void 0),E([w()],$.prototype,`gewicht`,void 0),E([w()],$.prototype,`ausrichtung`,void 0),E([w()],$.prototype,`farbe`,void 0),E([w()],$.prototype,`text`,void 0),E([w()],$.prototype,`source`,void 0),E([w()],$.prototype,`textField`,void 0),D.defineAndRegister($);var Qc=[`waagerecht`,`senkrecht`],$c=`waagerecht`;function el(e){return Qc.includes(e)?e:$c}var tl=class extends D{constructor(...e){super(...e),this.richtung=$c}static{this.blockType=`trenner`}static{this.tagName=`ff-trenner`}static{this.displayName=`Trennlinie`}static{this.category=`layout`}static{this.defaultProps={width:`fill`,richtung:$c}}static{this.resizableWidth=!1}static{this.raster={startW:24,startH:1,minW:1,minH:1,varianten:[{wenn:{attributeName:`richtung`,equals:`senkrecht`},startW:1,startH:6,breiteZiehbar:!1}]}}static{this.customProperties=[{attributeName:`richtung`,name:`Richtung`,description:`Waagerecht trennt oben von unten, senkrecht links von rechts.`,kind:`select`,options:[{value:`waagerecht`,label:`Waagerecht`},{value:`senkrecht`,label:`Senkrecht`}]}]}static{this.styles=[D.styles,o`

      .flaeche {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      .waagerecht { padding: var(--se-gap-sm) 0; }
      .senkrecht {
        padding: 0 var(--se-gap-sm);

        min-height: 24px;
      }
      .linie { background: var(--se-line); }
      .waagerecht .linie { width: 100%; height: 1px; }
      .senkrecht .linie { width: 1px; height: 100%; }
    `]}render(){return v`<div class="flaeche ${el(this.richtung)}"><div class="linie"></div></div>`}};E([w()],tl.prototype,`richtung`,void 0),D.defineAndRegister(tl),typeof window<`u`&&window.addEventListener(`unhandledrejection`,e=>{let t=e.reason;L(`Unerwarteter Fehler in der Maske: `+(t instanceof Error?t.message:String(t)))})})();