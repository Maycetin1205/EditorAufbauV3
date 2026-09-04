(function(){var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:ee}=Object,m=globalThis,te=m.trustedTypes,ne=te?te.emptyScript:``,re=m.reactiveElementPolyfillSupport,ie=(e,t)=>e,ae={toAttribute(e,t){switch(t){case Boolean:e=e?ne:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},oe=(e,t)=>!l(e,t),se={attribute:!0,type:String,converter:ae,reflect:!1,useDefault:!1,hasChanged:oe};Symbol.metadata??=Symbol(`metadata`),m.litPropertyMetadata??=new WeakMap;var h=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??se}static _$Ei(){if(this.hasOwnProperty(ie(`elementProperties`)))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ie(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ie(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?ae:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?ae:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??oe)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};h.elementStyles=[],h.shadowRootOptions={mode:`open`},h[ie(`elementProperties`)]=new Map,h[ie(`finalized`)]=new Map,re?.({ReactiveElement:h}),(m.reactiveElementVersions??=[]).push(`2.1.2`);var ce=globalThis,le=e=>e,ue=ce.trustedTypes,de=ue?ue.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,fe=`$lit$`,g=`lit$${Math.random().toFixed(9).slice(2)}$`,pe=`?`+g,me=`<${pe}>`,_=document,he=()=>_.createComment(``),ge=e=>e===null||typeof e!=`object`&&typeof e!=`function`,_e=Array.isArray,ve=e=>_e(e)||typeof e?.[Symbol.iterator]==`function`,ye=`[ 	
\f\r]`,be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,Se=/>/g,v=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Ce=/'/g,we=/"/g,Te=/^(?:script|style|textarea|title)$/i,Ee=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),y=Ee(1),De=Ee(2),b=Symbol.for(`lit-noChange`),x=Symbol.for(`lit-nothing`),Oe=new WeakMap,S=_.createTreeWalker(_,129);function ke(e,t){if(!_e(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return de===void 0?t:de.createHTML(t)}var Ae=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=be;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===be?c[1]===`!--`?o=xe:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=v):(Te.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=v):o=Se:o===v?c[0]===`>`?(o=i??be,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?v:c[3]===`"`?we:Ce):o===we||o===Ce?o=v:o===xe||o===Se?o=be:(o=v,i=void 0);let d=o===v&&e[t+1].startsWith(`/>`)?` `:``;a+=o===be?n+me:l>=0?(r.push(s),n.slice(0,l)+fe+n.slice(l)+g+d):n+g+(l===-2?t:d)}return[ke(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},je=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Ae(t,n);if(this.el=e.createElement(l,r),S.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=S.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(fe)){let t=u[o++],n=i.getAttribute(e).split(g),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Fe:r[1]===`?`?Ie:r[1]===`@`?Le:Pe}),i.removeAttribute(e)}else e.startsWith(g)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Te.test(i.tagName)){let e=i.textContent.split(g),t=e.length-1;if(t>0){i.textContent=ue?ue.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],he()),S.nextNode(),c.push({type:2,index:++a});i.append(e[t],he())}}}else if(i.nodeType===8){if(i.data===pe)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(g,e+1))!==-1;)c.push({type:7,index:a}),e+=g.length-1}}a++}}static createElement(e,t){let n=_.createElement(`template`);return n.innerHTML=e,n}};function C(e,t,n=e,r){if(t===b)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=ge(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=C(e,i._$AS(e,t.values),i,r)),t}var Me=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??_).importNode(t,!0);S.currentNode=r;let i=S.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Ne(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Re(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=S.nextNode(),a++)}return S.currentNode=_,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Ne=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),ge(e)?e===x||e==null||e===``?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==b&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ve(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==x&&ge(this._$AH)?this._$AA.nextSibling.data=e:this.T(_.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=je.createElement(ke(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Me(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Oe.get(e.strings);return t===void 0&&Oe.set(e.strings,t=new je(e)),t}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(he()),this.O(he()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=le(e).nextSibling;le(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=C(this,e,t,0),a=!ge(e)||e!==this._$AH&&e!==b,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=C(this,r[n+o],t,o),s===b&&(s=this._$AH[o]),a||=!ge(s)||s!==this._$AH[o],s===x?e=x:e!==x&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Fe=class extends Pe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}},Ie=class extends Pe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}},Le=class extends Pe{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??x)===b)return;let n=this._$AH,r=e===x&&n!==x||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==x&&(n===x||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Re=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}},ze={M:fe,P:g,A:pe,C:1,L:Ae,R:Me,D:ve,V:C,I:Ne,H:Pe,N:Ie,U:Le,B:Fe,F:Re},Be=ce.litHtmlPolyfillSupport;Be?.(je,Ne),(ce.litHtmlVersions??=[]).push(`3.3.3`);var Ve=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Ne(t.insertBefore(he(),e),e,void 0,n??{})}return i._$AI(e),i},He=globalThis,Ue=class extends h{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};Ue._$litElement$=!0,Ue.finalized=!0,He.litElementHydrateSupport?.({LitElement:Ue});var We=He.litElementPolyfillSupport;We?.({LitElement:Ue}),(He.litElementVersions??=[]).push(`4.2.2`);var Ge={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:oe},Ke=(e=Ge,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function w(e){return(t,n)=>typeof n==`object`?Ke(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function T(e){return w({...e,state:!0,attribute:!1})}var qe=new Map;function Je(e){qe.has(e.type)&&console.warn(`Block-Typ "${e.type}" wird ueberschrieben.`),qe.set(e.type,e)}function Ye(){return Array.from(qe.values())}var Xe={width:`auto`};function Ze(e,t){if(!e)return!0;let n=t[e.attributeName];return e.keinesVon?!e.keinesVon.some(e=>Object.is(n,e)):`notEquals`in e?!Object.is(n,e.notEquals):Object.is(n,e.equals)}function Qe(e){return Object.entries(e).map(([e,t])=>`${e.replace(/[A-Z]/g,e=>`-`+e.toLowerCase())}:${t}`).join(`;`)}var $e={spalten:24,spaltePx:40,zeilePx:12,gapPx:8},et={rasterX:0,rasterY:0,rasterW:$e.spalten,rasterH:1};function tt(){return{display:`grid`,gridTemplateColumns:`repeat(${$e.spalten}, 1fr)`,gridAutoRows:`${$e.zeilePx}px`,gap:`${$e.gapPx}px`,alignContent:`start`}}function nt(){return Qe(tt())}var rt=`weitereQuellen`,it={[rt]:[]},at=`folgtAuswahl`,ot={[at]:[]};function st(e,t){let n=e.textContent??``,r=Array.from(e.childNodes),i=r.map(e=>e.textContent??``);e.setAttribute(`contenteditable`,`plaintext-only`),e.focus();let a=window.getSelection(),o=document.createRange();o.selectNodeContents(e),a?.removeAllRanges(),a?.addRange(o);let s=()=>{e.replaceChildren(...r),r.forEach((e,t)=>{e.textContent!==i[t]&&(e.textContent=i[t])})},c=e.closest(`button`)!==null,l=()=>{let t=e.getRootNode().getSelection?.()??window.getSelection(),n=t?.rangeCount?t.getRangeAt(0):null;if(!t||!n||!e.contains(n.startContainer))return;n.collapsed||n.deleteContents();let r=n.startContainer;if(r instanceof Text){let e=n.startOffset;r.insertData(e,` `),t.collapse(r,e+1)}else{let e=document.createTextNode(` `);n.insertNode(e),t.collapse(e,1)}},u=!1,d=r=>{u||(u=!0,e.removeAttribute(`contenteditable`),e.removeEventListener(`blur`,f),e.removeEventListener(`keydown`,p),r&&t((e.textContent??``).trim(),n)||s())},f=()=>d(!0),p=t=>{if(t.key===`Enter`)t.preventDefault(),e.blur();else if(t.key===`Escape`)t.preventDefault(),d(!1);else if(t.key===` `&&c){if(t.ctrlKey||t.metaKey||t.altKey||t.isComposing)return;t.preventDefault(),l()}};e.addEventListener(`blur`,f),e.addEventListener(`keydown`,p)}function E(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function ct(e){customElements.get(e.tagName)||customElements.define(e.tagName,e)}function lt(e){Je({type:e.blockType,tagName:e.tagName,displayName:e.displayName,category:e.category,defaultProps:{...Xe,...et,...e.acceptsDataSource?it:null,...e.kannAuswahlFolgen?ot:null,...e.defaultProps},customProperties:e.customProperties,acceptsChildren:e.acceptsChildren??!1,resizableWidth:e.resizableWidth??!0,resizableHeight:e.resizableHeight??!1,allowedChildTypes:e.allowedChildTypes,allowedParentTypes:e.allowedParentTypes,lockedWidth:e.lockedWidth,defaultChildren:e.defaultChildren,childDirection:e.childDirection,showInPalette:e.showInPalette,templateChild:e.templateChild,containerHint:e.containerHint,addChildButton:e.addChildButton,acceptsDataSource:e.acceptsDataSource,satzWahl:e.satzWahl,kannAuswahlFolgen:e.kannAuswahlFolgen,kannErfassen:e.kannErfassen,aenderungsSchluessel:e.aenderungsSchluessel,kannLoeschen:e.kannLoeschen,bindableSpots:e.bindableSpots,actionValueSpots:e.actionValueSpots,listenBindung:e.listenBindung,blockEvents:e.blockEvents,pageBlock:e.pageBlock,flaechenSeite:e.flaechenSeite,maskenRand:e.maskenRand,raster:e.raster})}var D=class extends Ue{constructor(...e){super(...e),this.editable=!1}static{this.styles=o`
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
  `}static{this.customProperties=[]}get customProperties(){return this.constructor.customProperties}get imEditor(){return this.hasAttribute(`data-ff-editor`)}inlineEdit(e,t){if(!this.editable)return;let n=e.currentTarget;n&&(n.hasAttribute(`data-ff-bound`)||(e.stopPropagation(),e.preventDefault(),st(n,(e,n)=>{if(e===n)return!0;let r={attr:t,value:e};return this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:r,bubbles:!0,composed:!0})),r.abgelehnt!==!0})))}static defineAndRegister(e){ct(e),lt(e)}};E([w({type:Boolean,reflect:!0,attribute:`data-editable`})],D.prototype,`editable`,void 0);var ut=`root`,dt=class extends D{static{this.blockType=`ansicht`}static{this.tagName=`ff-ansicht`}static{this.displayName=`Ansicht`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.showInPalette=!1}static{this.allowedParentTypes=[ut]}static{this.pageBlock=!0}static{this.flaechenSeite=!0}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.defaultProps={name:`Ansicht`}}static{this.styles=[D.styles,o`

      :host { display: contents; }
    `]}render(){return y`<slot></slot>`}};D.defineAndRegister(dt);var ft=class extends D{constructor(...e){super(...e),this.quelle=``}static{this.blockType=`bild`}static{this.tagName=`ff-bild`}static{this.displayName=`Bild`}static{this.category=`anzeige`}static{this.defaultProps={quelle:``}}static{this.raster={startW:6,startH:6,minW:1,minH:1}}static{this.customProperties=[{attributeName:`quelle`,name:`Bild`,description:`Wird in die Maske eingebettet; grosse Bilder werden verkleinert.`,kind:`bild`}]}static{this.styles=[D.styles,o`
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
    `]}render(){return y`<div class="flaeche">
      ${this.quelle===``?y`<div class="platzhalter">Bild</div>`:y`<img src=${this.quelle} alt="">`}
    </div>`}};E([w()],ft.prototype,`quelle`,void 0),D.defineAndRegister(ft);var O=`data-ff-block-id`,pt=[`fixed`,`context`,`data_field`,`block_value`,`gewaehlte_zeile`,`erfassungszelle`,`aenderungszelle`,`loeschzelle`,`previous_result`,`step_result`,`se_variable`,`aus`];function mt(e){return!!e&&typeof e==`object`&&!Array.isArray(e)}function ht(e){return!mt(e)||typeof e.source!=`string`||!pt.includes(e.source)||typeof e.value!=`string`||e.dataSourceId!==void 0&&typeof e.dataSourceId!=`string`||e.blockId!==void 0&&typeof e.blockId!=`string`||e.ergebnisFeld!==void 0&&typeof e.ergebnisFeld!=`string`?null:{source:e.source,value:e.value,...typeof e.dataSourceId==`string`?{dataSourceId:e.dataSourceId}:{},...typeof e.blockId==`string`?{blockId:e.blockId}:{},...e.source===`step_result`&&typeof e.ergebnisFeld==`string`?{ergebnisFeld:e.ergebnisFeld}:{}}}function gt(e){if(!mt(e)||typeof e.type!=`string`||typeof e.resultKey!=`string`)return null;if(e.type===`START_TOOL`)return typeof e.toolNr!=`string`||!Array.isArray(e.toolParams)||e.toolParams.some(e=>typeof e!=`string`)?null:{type:`START_TOOL`,resultKey:e.resultKey,toolNr:e.toolNr,toolParams:[...e.toolParams]};if(e.type===`BW_LINK`)return typeof e.befehl==`string`?{type:`BW_LINK`,resultKey:e.resultKey,befehl:e.befehl}:null;if(e.type===`POPUP_OPEN`||e.type===`POPUP_CLOSE`){let t=typeof e.popupId==`string`?e.popupId:void 0,n=typeof e.popup==`string`?e.popup:void 0;return t===void 0&&n===void 0?null:{type:e.type,resultKey:e.resultKey,...t===void 0?{}:{popupId:t},...n===void 0?{}:{popup:n}}}if(e.type===`RELATION`){if(typeof e.relationId!=`string`||!Array.isArray(e.extraParams)||!Array.isArray(e.params))return null;let t=[];for(let n of e.params){let e=ht(n);if(!e)return null;t.push(e)}let n=[];for(let t of e.extraParams){let e=ht(t);if(!e)return null;n.push(e)}return{type:`RELATION`,resultKey:e.resultKey,relationId:e.relationId,params:t,extraParams:n}}return null}function _t(e){if(!e)return{};let t;try{t=JSON.parse(e)}catch{return{}}if(!mt(t))return{};let n={};for(let[e,r]of Object.entries(t)){if(!Array.isArray(r)||r.length===0)continue;let t=[],i=!1;for(let e of r){let n=gt(e);if(!n){i=!0;break}t.push(n)}!i&&t.length>0&&(n[e]=t)}return n}Object.values({idb:{id:`idb`,name:`IDB-Tabelle`,tabellenId:``,felderEinzeln:!1,kennungLabel:`Kennung`,kennungBeispiel:`ID0001`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[]},adressstamm:{id:`adressstamm`,name:`Adressstamm`,tabellenId:`ADR`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[]},artikelstamm:{id:`artikelstamm`,name:`Artikelstamm`,tabellenId:`ART`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[]},beleg:{id:`beleg`,name:`Beleg`,tabellenId:`BEL`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[{code:`0_11`,label:`Satzschlüssel`},{code:`2_1`,label:`Belegart`},{code:`3_8`,label:`Belegnummer`},{code:`11_8`,label:`Kundennummer`},{code:`19_10`,label:`Belegdatum`},{code:`393_12`,label:`Warenwert`},{code:`441_12`,label:`MwSt-Betrag`},{code:`453_12`,label:`Gesamtbetrag`},{code:`3440_60`,label:`Name`}]},belegposition:{id:`belegposition`,name:`Belegpositionen`,tabellenId:`POS`,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!0,kopfsatzStandard:`BEL_0_11`,relationLadenMoeglich:!0,satzNummerMoeglich:!0,varMoeglich:!0,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[{code:`2_1`,label:`Belegart`},{code:`3_8`,label:`Belegnummer`},{code:`11_6`,label:`Positionsnummer`},{code:`17_1`,label:`Zeilenart`},{code:`18_25`,label:`Artikelnummer`},{code:`45_60`,label:`Bezeichnung`},{code:`164_8`,label:`Menge`},{code:`246_9`,label:`Einzelpreis`},{code:`280_12`,label:`Gesamtpreis`},{code:`372_5`,label:`MwSt-Satz`},{code:`645_10`,label:`Satznummer`},{code:`689_5`,label:`Mengeneinheit`},{code:`1401_12`,label:`Rohertrag`},{code:`2558_1`,label:`Farbkennzeichen`},{code:`3164_12`,label:`Rabatt`}]},datei:{id:`datei`,name:`Andere Datei`,tabellenId:``,felderEinzeln:!0,kennungLabel:`Kennung`,kennungBeispiel:`SERPOS`,kopfsatzMoeglich:!0,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!0,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[]},erpabfrage:{id:`erpabfrage`,name:`ERP-Abfrage`,tabellenId:``,felderEinzeln:!0,kennungLabel:`Kennung`,kennungBeispiel:`LIEFERADRESSE.GET`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!1,varMoeglich:!1,bestellBlock:`erpapicall`,spaltenNamen:!1,spaltenLabel:``,spaltenBeispiel:``,idbKurzform:!0,feldVorsatzMoeglich:!0,holWertMoeglich:!1,standardFelder:[]},dataset:{id:`dataset`,name:`DataSet`,tabellenId:``,felderEinzeln:!0,kennungLabel:`DataSet-ID`,kennungBeispiel:`ID0001`,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!1,varMoeglich:!1,bestellBlock:`dataset`,spaltenNamen:!0,spaltenLabel:`Spalte im DataSet`,spaltenBeispiel:`z. B. Chargennummer`,idbKurzform:!1,feldVorsatzMoeglich:!1,holWertMoeglich:!1,standardFelder:[]},relationswert:{id:`relationswert`,name:`Wert per Relation`,tabellenId:``,felderEinzeln:!0,kennungLabel:``,kennungBeispiel:``,kopfsatzMoeglich:!1,kopfsatzStandard:``,relationLadenMoeglich:!1,satzNummerMoeglich:!1,varMoeglich:!1,bestellBlock:`sefileloop`,spaltenNamen:!0,spaltenLabel:`Name in der Antwort`,spaltenBeispiel:`z. B. NUMMER`,idbKurzform:!1,feldVorsatzMoeglich:!1,holWertMoeglich:!0,standardFelder:[]}}).map(e=>e.id);var vt=[`fixed`,`data_field`,`se_variable`];function yt(e){return e===`aus`||vt.includes(e)}function bt(e){if(!e||typeof e!=`object`)return null;let t=e,n=typeof t.relationId==`string`?t.relationId.trim():``;if(n===``||!Array.isArray(t.params))return null;let r=[];for(let e of t.params){let t=ht(e);if(!t||!yt(t.source))return null;r.push(t)}return{relationId:n,params:r}}var xt=/^\d+_\d+$/,St=/^\d+$/;function Ct(e){if(!e||typeof e!=`object`)return null;let t=e,n=e=>typeof e==`string`?e.trim():``,r=n(t.nr),i=n(t.geberQuelleId),a=n(t.belegartFeld),o=n(t.belegnummerFeld),s=n(t.jahrFeld),c=n(t.archivFeld),l=Array.isArray(t.endeFelder)?t.endeFelder.filter(e=>typeof e==`string`&&xt.test(e)):[];return!St.test(r)||i===``||!xt.test(a)||!xt.test(o)||s!==``&&!xt.test(s)||c!==``&&!xt.test(c)||l.length===0?null:{nr:r,geberQuelleId:i,belegartFeld:a,belegnummerFeld:o,jahrFeld:s,archivFeld:c,endeFelder:l}}var wt=new Map;function Tt(e,t){e!==``&&wt.set(e,t)}function Et(e){return wt.get(e)}function k(e){return typeof e==`object`&&!!e}function A(e,t){if(Array.isArray(e)&&t!==``)for(let n of e){if(!k(n)||n.id!==t||typeof n.name!=`string`||typeof n.tableId!=`string`)continue;let e,r=Ct(n.ladeRelation);if(r&&k(n.ladeRelation)){let t=n.ladeRelation.zusatzFelder,i=Array.isArray(t)?t.filter(e=>typeof e==`string`&&xt.test(e)):[];e={...r,zusatzFelder:i}}let i,a=bt(n.holWert);if(a&&k(n.holWert)){let e=n.holWert.felder,t=Array.isArray(e)?e.filter(e=>typeof e==`string`&&e!==``):[];i={...a,felder:t}}return{id:t,name:n.name,tableId:n.tableId,indexField:typeof n.indexField==`string`?n.indexField:``,offenerSatz:n.offenerSatz===!0,...e?{ladeRelation:e}:{},...i?{holWert:i}:{}}}}function Dt(e){return e==null?``:String(e).trim()}function j(e,t){if(!k(e)||t===``)return``;let n=t.trim(),r=Dt(e[n]);if(r!==``)return r;for(let t of Object.keys(e))if(t===n||t.startsWith(`${n}_`)||t.endsWith(`_${n}`)){let n=Dt(e[t]);if(n!==``)return n}let i=/^(\d+)_(\d+)$/.exec(n);if(!i)return``;let a=e.SATZNEU??e.SATZ??e.satzneu??e.satz??e.RAW??e.raw,o=a==null?``:String(a);if(o===``)return``;let s=Number(i[1]),c=Number(i[2]);return c<=0?``:o.substring(s,s+c).trim()}function Ot(e,t){return e.indexField===``?``:j(t,e.indexField)}function kt(e,t,n){if(!k(e)||t===``)return!1;let r=t.trim(),i=!1;for(let t of Object.keys(e))(t===r||t.startsWith(`${r}_`)||t.endsWith(`_${r}`))&&(e[t]=n,i=!0);let a=/^(\d+)_(\d+)$/.exec(r);if(a){let t=[`SATZNEU`,`SATZ`,`satzneu`,`satz`,`RAW`,`raw`].find(t=>typeof e[t]==`string`);if(t){let r=e[t],o=Number(a[1]),s=Number(a[2]);if(s>0){let a=n.length>s?n.slice(0,s):n.padEnd(s,` `),c=r.length<o?r.padEnd(o,` `):r;e[t]=c.slice(0,o)+a+c.slice(o+s),i=!0}}}return i}function At(e){if(!k(e))return Array.isArray(e)?e:[];let t=[e.Zeilen,e.zeilen,e.Saetze,e.saetze,e.Rows,e.rows,e.Daten,e.daten];for(let e of t){if(Array.isArray(e))return e;if(typeof e==`string`)try{let t=JSON.parse(e);if(Array.isArray(t))return t}catch{}}return[]}function M(e,t){return Dt(e).toLowerCase()===t.trim().toLowerCase()}function jt(e){for(let t of[`Var`,`VAR`,`var`]){let n=e[t];if(k(n))return n}}function Mt(e,t){if(!k(e)||!k(e.Daten))return[];let n=t.trim();if(n===``)return[];let r=jt(e.Daten);if(!r)return[];let i={},a=r.WINDOW_VARIABLE??r.Window_Variable;if(k(a)){let e=n.toUpperCase()+`_`;for(let t of Object.keys(a))t.toUpperCase().startsWith(e)&&(i[t]=a[t])}let o=r[n]??r[n.toUpperCase()];if(k(o))for(let e of Object.keys(o))(Dt(o[e])!==``||!(e in i))&&(i[e]=o[e]);return Object.keys(i).length===0?[]:[i]}function Nt(e,t,n,r=!1){if(!k(e)||!k(e.Daten))return[];if(r)return Mt(e,n);let i=e.Daten,a=i.SEFileLoop;if(Array.isArray(a)){for(let e of a)if(k(e)&&(M(e.ALIAS,t)||M(e.alias,t))){let t=At(e);if(t.length>0)return t}}else if(k(a))for(let e of Object.keys(a)){let n=a[e];if(M(e,t)||k(n)&&(M(n.ALIAS,t)||M(n.alias,t))){let e=At(n);if(e.length>0)return e}}for(let e of[`ErpApiCall`,`ERPAPICALL`,`erpapicall`]){let n=i[e];if(k(n))for(let e of Object.keys(n)){if(!M(e,t))continue;let r=At(n[e]);if(r.length>0)return r}}let o=i.Tabellen;if(k(o)){let e=[t,t.toUpperCase(),t.toLowerCase(),n];for(let t of e)if(t!==``&&t in o){let e=At(o[t]);if(e.length>0)return e}for(let e of Object.keys(o))if(M(e,t)){let t=At(o[e]);if(t.length>0)return t}}return Et(t)??[]}function Pt(e){let t=e;if(typeof t==`string`)try{t=JSON.parse(t)}catch{return}if(!k(t)||!k(t.Daten))return;let n=t.Daten;if(n.SEFileLoop||n.Tabellen||n.ErpApiCall||jt(n))return n}function Ft(e){let t=e;if(typeof t==`string`)try{t=JSON.parse(t)}catch{return}if(k(t)&&k(t.MSG))return t.MSG.DATA}function It(e,t,n,r={}){let i=e.getAttribute(t)??``;if(i===``)return[];try{let e=JSON.parse(i);if(!Array.isArray(e))return[];let t=[];for(let i of e){if(!i||typeof i!=`object`)continue;let e=i,a=e[n];if(typeof a!=`string`||a===``)continue;let o=[];for(let t of Array.isArray(e.keyPairs)?e.keyPairs:[]){if(!t||typeof t!=`object`)continue;let e=t;typeof e.fromField==`string`&&typeof e.toField==`string`&&e.fromField.trim()!==``&&e.toField.trim()!==``&&o.push({fromField:e.fromField,toField:e.toField})}if(o.length===0&&r.ohnePaareBehalten!==!0)continue;let s=typeof e.partnerId==`string`&&e.partnerId!==a?e.partnerId:``;t.push({id:a,partnerId:s,keyPairs:o})}return t}catch{return[]}}function Lt(e){if(e==null)return``;try{return JSON.stringify(e)??``}catch{return``}}var N=new Map,Rt=new Set,zt=new Set,Bt=0,Vt=!1,Ht=!1,Ut=!1;function Wt(e){if(Vt){Ht=!0,Ut||=e;return}Vt=!0;let t=e;try{do Ht=!1,Ut=!1,Rt.forEach(e=>e(t)),t=Ut;while(Ht)}finally{Vt=!1}}function Gt(e){Rt.add(e)}function Kt(e){return N.get(e)?.zeile}function qt(e){return N.get(e)?.merkmal??``}function Jt(e){return N.get(e)?.nummer??0}function P(e){return e.getAttribute(`data-ff-block-id`)??``}function Yt(e,t,n){if(e===``)return[];let r=qt(e);if(r===``)return[];let i=[];return t.forEach((e,t)=>{Lt(n(e))===r&&i.push(t)}),i.length===0&&Qt(e),i}function Xt(e,t){if(e===``)return;let n=Lt(t);if(n===``)return;let r=N.get(e);r&&r.merkmal===n?N.delete(e):N.set(e,{zeile:t,merkmal:n,nummer:++Bt}),Wt(!0)}function Zt(e,t,n=!1){if(e===``)return;let r=Lt(t);r!==``&&N.get(e)?.merkmal!==r&&(N.set(e,{zeile:t,merkmal:r,nummer:++Bt}),Wt(n))}function Qt(e){N.has(e)&&(N.delete(e),Wt(!1))}function $t(e){zt.add(e)}var en=at.toLowerCase();function tn(e){return It(e,en,`geberId`).map(e=>({geberId:e.id,keyPairs:e.keyPairs}))}function nn(e,t){let n=t,r=!1;for(let t of tn(e)){let e=Kt(t.geberId);if(e===void 0)continue;let i=t.keyPairs.map(t=>({soll:j(e,t.fromField),toField:t.toField})).filter(e=>e.soll!==``);i.length!==0&&(r=!0,n=n.filter(e=>i.every(t=>t.soll===j(e,t.toField))))}return{rows:n,gefiltert:r}}function rn(e,t){if(tn(e).length===0)return t[0];let{rows:n,gefiltert:r}=nn(e,t);return r?n[0]:void 0}var an=`ff-dialog-rahmen`,on=`ff-dialog-schliessen`,sn=`ff-dialog-groesse`;function cn(e,t){let n=Number(e);return Number.isFinite(n)&&n>0?n:t}var F=class extends Ue{constructor(...e){super(...e),this.titel=`Dialog`,this.breite=520,this.hoehe=380,this.viewport=!1,this.escapeSchliesst=!1,this.ohneModal=!1,this.inhaltFest=!1,this.ziehbar=!1,this.escapeRegistriert=!1,this.aufTaste=e=>{e.key===`Escape`&&(e.stopPropagation(),this.schliesse())}}static{this.styles=o`
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
  `}aktualisiereEscape(){let e=this.isConnected&&this.escapeSchliesst;e!==this.escapeRegistriert&&(e?document.addEventListener(`keydown`,this.aufTaste,!0):document.removeEventListener(`keydown`,this.aufTaste,!0),this.escapeRegistriert=e)}ziehe(e,t){if(!this.ziehbar)return;e.preventDefault(),e.stopPropagation();let n=t===`breite`?cn(this.breite,520):cn(this.hoehe,380),r=t===`breite`?240:160,i=t===`breite`?e.clientX:e.clientY,a=Math.max(r,Math.round(n)),o=!1,s=(e,n)=>{this.dispatchEvent(new CustomEvent(sn,{detail:{achse:t,wert:e,geste:n},bubbles:!0,composed:!0}))},c=e=>{let c=t===`breite`?e.clientX:e.clientY,l=Math.max(r,Math.round(n+(c-i)*2));l!==a&&(a=l,s(l,o?`laeuft`:`beginn`),o=!0)},l=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l),window.removeEventListener(`blur`,l),o&&s(a,`ende`)};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l),window.addEventListener(`blur`,l)}aufStandard(e,t){this.ziehbar&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent(sn,{detail:{achse:t,wert:0,geste:`standard`},bubbles:!0,composed:!0})))}schliesse(){this.dispatchEvent(new CustomEvent(on,{bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this.aktualisiereEscape()}updated(e){e.has(`escapeSchliesst`)&&this.aktualisiereEscape()}disconnectedCallback(){this.escapeRegistriert&&=(document.removeEventListener(`keydown`,this.aufTaste,!0),!1),super.disconnectedCallback()}render(){let e=cn(this.breite,520),t=cn(this.hoehe,380);return y`
      <div class="abdunklung"></div>
      <div class="buehne">
        <section
          class="fenster"
          role="dialog"
          aria-modal=${this.ohneModal?x:`true`}
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
          ${this.ziehbar?y`
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
          `:x}
        </section>
      </div>
    `}};E([w()],F.prototype,`titel`,void 0),E([w({type:Number})],F.prototype,`breite`,void 0),E([w({type:Number})],F.prototype,`hoehe`,void 0),E([w({type:Boolean,reflect:!0})],F.prototype,`viewport`,void 0),E([w({type:Boolean,attribute:`escape-schliesst`})],F.prototype,`escapeSchliesst`,void 0),E([w({type:Boolean,attribute:`ohne-modal`})],F.prototype,`ohneModal`,void 0),E([w({type:Boolean,reflect:!0,attribute:`inhalt-fest`})],F.prototype,`inhaltFest`,void 0),E([w({type:Boolean,reflect:!0})],F.prototype,`ziehbar`,void 0),customElements.get(`ff-dialog-rahmen`)||customElements.define(an,F);var ln=`input,select,textarea,button,a[href],[tabindex]:not([tabindex="-1"])`;function un(e){for(let t of Array.from(e.querySelectorAll(`*`))){if(t instanceof HTMLElement&&t.matches(ln)&&!t.hasAttribute(`disabled`))return t;let e=t.shadowRoot?un(t.shadowRoot):null;if(e)return e}return null}var I=class extends D{constructor(...e){super(...e),this.name=`Popup`,this.breite=520,this.hoehe=380,this.offen=!1}static{this.blockType=`popup`}static{this.tagName=`ff-popup`}static{this.displayName=`Popup`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.showInPalette=!1}static{this.allowedParentTypes=[ut]}static{this.pageBlock=!0}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.defaultProps={name:`Popup`,breite:520,hoehe:380}}static{this.styles=[D.styles,o`

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
        ${a(nt())};
      }

      .rumpf slot { display: contents; }
    `]}onClose(){this.imEditor||this.removeAttribute(`offen`)}updated(e){super.updated(e),e.has(`offen`)&&this.offen&&(this.imEditor||this.updateComplete.then(()=>{this.offen&&this.isConnected&&(un(this)??(this.shadowRoot?un(this.shadowRoot):null))?.focus()}))}render(){return y`<ff-dialog-rahmen
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
      </ff-dialog-rahmen>`}};E([w()],I.prototype,`name`,void 0),E([w()],I.prototype,`breite`,void 0),E([w()],I.prototype,`hoehe`,void 0),E([w({type:Boolean,reflect:!0})],I.prototype,`offen`,void 0),D.defineAndRegister(I);var dn=[`GET_RELATION`,`PUT_RELATION`,`PUTADD_RELATION`];function fn(e){return`${String(e.getDate()).padStart(2,`0`)}.${String(e.getMonth()+1).padStart(2,`0`)}.${e.getFullYear()}`}function pn(e,t){return e.params.map(e=>e.replace(/\{([A-Za-z0-9_]+)\}/g,(e,n)=>String(t[n]??``)))}var mn=8e3,hn=null,gn=null;function _n(){let e=document.createElement(`div`);return e.setAttribute(`data-ff-meldung`,``),e.setAttribute(`role`,`alert`),e.style.cssText=[`position:fixed`,`top:0`,`left:0`,`right:0`,`z-index:2147483647`,`padding:7px 12px`,`background:var(--se-red-soft,#fbe7e6)`,`color:var(--se-red,#c0201a)`,`border-bottom:1px solid var(--se-red,#c0201a)`,`font:500 12px/1.4 system-ui,sans-serif`,`cursor:pointer`].join(`;`),e.title=`Klicken zum Schließen`,e.addEventListener(`click`,vn),e}function vn(){gn&&=(clearTimeout(gn),null),hn?.remove(),hn=null}function L(e){typeof document>`u`||!document.body||(hn||(hn=_n(),document.body.appendChild(hn)),hn.textContent=e,gn&&clearTimeout(gn),gn=setTimeout(vn,mn))}function R(){return globalThis}function yn(){let e=R();return k(e.SEDATA)&&k(e.SEDATA.Daten)}function bn(){let e=R();try{e.selib?.Json?.InitializeERPConnection?.()}catch{}try{typeof e.InitialisiereSchnittstelle==`function`&&e.InitialisiereSchnittstelle()}catch{}}function xn(){let e=R();try{typeof e.ResetDataBasis==`function`&&e.ResetDataBasis()}catch{}try{typeof e.InitialisiereDatenBasis==`function`&&e.InitialisiereDatenBasis()}catch{}}var Sn=new Set,Cn=new Set,wn=800,Tn=!1,En=!1,Dn=null;function On(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function kn(){let e=On();return e instanceof HTMLElement?e.isContentEditable||e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement:!1}function An(){Dn===null&&(Dn=setInterval(()=>{if(kn()||(jn(),!Tn))return;Tn=!1;let e=En;En=!1,Pn(e)},wn))}function jn(){Dn!==null&&(clearInterval(Dn),Dn=null)}function Mn(e){Sn.add(e)}function Nn(e){return Cn.add(e),()=>{Cn.delete(e)}}function Pn(e){let t=!0;Sn.forEach(n=>{try{n(e)}catch{t=!1}}),t&&Vn!==null&&(Bn=Vn),Vn=null}function z(e){if(e&&(En=!0),kn()){Tn=!0,An();return}Tn=!1;let t=En;En=!1,Pn(t)}function Fn(){z(!1)}function In(){xn(),z(!1)}function Ln(){let e=R(),t=k(e.SEDATA)?e.SEDATA.Daten:void 0;if(!k(t))return!1;let n=Hn(t);return n!==``&&n===Bn?!1:(Vn=n,!0)}function Rn(e){Cn.forEach(t=>{try{t(e)}catch{}})}var zn=2e6,Bn=``,Vn=null;function Hn(e){try{let t=JSON.stringify(e);return t.length>zn?``:t}catch{return``}}function Un(e){let t=Pt(e);if(!t){Rn(e);return}let n=R();k(n.SEDATA)||(n.SEDATA={}),n.SEDATA.Daten=t,xn();let r=Hn(t);(r===``||r!==Bn)&&(Vn=r,z(!0))}function Wn(e=0){let t=R();if(typeof t.basisHTML_REGISTER==`function`){try{t.basisHTML_SetConsoleLog?.(!0,!0)}catch{}try{t.basisHTML_REGISTER(e=>{Un(e)},document.title,`1.0`);return}catch(t){if(e>=400){L(`SoftEngine-Anmeldung fehlgeschlagen: `+(t instanceof Error?t.message:String(t)));return}}}e<400?setTimeout(()=>{Wn(e+1)},25):L(`SoftEngine-Anschluss nicht gefunden — die Maske bleibt ohne Daten.`)}var Gn=`ff-se-fokus`;function Kn(){R().basisHTML_DoSetFocusToHTML=()=>{let e=new CustomEvent(Gn,{cancelable:!0});return document.dispatchEvent(e),e.defaultPrevented}}var qn=!1;function Jn(){if(qn)return;qn=!0,bn();let e=R();e.Erstellen=()=>{xn(),z(Ln())},e.initData=e.Erstellen,e.ReloadData=()=>{z(Ln())},Kn(),Wn(),window.addEventListener(`message`,e=>{if(typeof R().basisHTML_REGISTER==`function`)return;let t=Ft(e.data);t!==void 0&&Un(t)},!0);let t=0,n=setInterval(()=>{t+=1,yn()?(clearInterval(n),xn(),z(Ln())):t>100&&(clearInterval(n),L(`Keine Daten von SoftEngine empfangen — die Maske zeigt nichts an.`))},300)}function Yn(e){return e instanceof Error?e.message:String(e)}function Xn(e,t){if(Array.isArray(e)&&t!==``){for(let n of e)if(k(n)&&n.id===t&&typeof n.verb==`string`&&dn.includes(n.verb)&&typeof n.nr==`string`&&n.nr!==``&&Array.isArray(n.params)&&!n.params.some(e=>typeof e!=`string`))return{id:t,verb:n.verb,nr:n.nr,params:n.params}}}var Zn=[`RESULT`,`result`],Qn=[`RESULT`,`result`,`PINDEX`,`pindex`,`INDEX`,`index`,`0_10`,`KEY`,`key`,`ID`,`id`,`VALUE`,`value`];function $n(e){if(typeof e!=`string`)return e;try{return JSON.parse(e)}catch{return}}function er(e){if(typeof e==`string`){let t=e.trim();return t===``?void 0:t}if(typeof e==`number`||typeof e==`boolean`)return String(e)}function tr(e,t){if(t>12)return;let n=er(e);if(n!==void 0)return n;if(Array.isArray(e)){for(let n of e){let e=tr(n,t+1);if(e!==void 0)return e}return}if(k(e)){for(let n of Qn){if(!(n in e))continue;let r=tr(e[n],t+1);if(r!==void 0)return r}for(let n of Object.values(e)){let e=tr(n,t+1);if(e!==void 0)return e}}}function nr(e){let t=$n(e);if(k(t)){for(let e of Qn){if(!(e in t))continue;let n=tr(t[e],0);if(n!==void 0)return n}for(let e of Zn)if(typeof t[e]==`string`)return``;for(let e of Object.values(t))if(Array.isArray(e))for(let t of e){let e=nr(t);if(e!==void 0)return e}else if(k(e)){let t=nr(e);if(t!==void 0)return t}}}function rr(e,t=0){if(t>12)return;let n=typeof e==`string`?$n(e):e;if(Array.isArray(n)){for(let e of n){let n=rr(e,t+1);if(n!==void 0)return n}return}if(k(n)){for(let e of Zn){let t=n[e];if(typeof t==`string`)return t;if(typeof t==`number`||typeof t==`boolean`)return String(t)}for(let e of Object.values(n)){let n=rr(e,t+1);if(n!==void 0)return n}}}function ir(e,t,n=0){if(t.trim()===``||n>12)return``;let r=typeof e==`string`?$n(e):e;if(Array.isArray(r)){for(let e of r){let r=ir(e,t,n+1);if(r!==``)return r}return``}if(!k(r))return``;let i=j(r,t);if(i!==``)return i;for(let e of Object.values(r)){let r=ir(e,t,n+1);if(r!==``)return r}return``}function ar(e){return k(e)?Object.keys(e).filter(e=>/^Message\d+$/.test(e)):[]}function or(e,t,n=!1){if(!k(e))return;let r=ar(e).filter(e=>!t.has(e)).sort((e,t)=>Number(t.slice(7))-Number(e.slice(7)));for(let t of r){let r=n?rr(e[t]):nr(e[t]);if(r!==void 0)return{wert:r,roh:e[t],schluessel:t}}}var sr=[],cr=!1,lr=2e4,ur=100,dr=lr,fr=0,pr=!1,mr=!1;function hr(){return Date.now()<fr}function gr(){if(cr||sr.length===0)return;cr=!0;let e=sr.shift(),t=R(),n=new Set(ar(t.SEDATA)),r=!1,i=!1,a=(t,n,i)=>{r||(r=!0,s(),clearInterval(c),clearTimeout(u),cr=!1,e.resolve(i===void 0?{wert:t,roh:n}:{wert:t,roh:n,fehler:i}),queueMicrotask(gr))},o=e.optionen.satzAntwort===!0,s=Nn(e=>{let t=o?rr(e):nr(e);if(t!==void 0){if(pr&&hr()){pr=!1,i=!0;return}a(t,e)}}),c=setInterval(()=>{let e=or(R().SEDATA,n,o);if(e!==void 0){if(mr&&hr()){mr=!1,i=!0,n.add(e.schluessel);return}a(e.wert,e.roh)}},ur),l=t=>{e.optionen.still||L(t),a(``,void 0,t)},u=setTimeout(()=>{i||(pr=!0,mr=!0,fr=Date.now()+dr),l(`Daten laden: SoftEngine hat nicht geantwortet (Relation Nr. ${e.template.nr}).`)},lr);if(typeof t.basisHTML_SND_MSG!=`function`){l(`Daten laden nicht möglich: keine Verbindung zu SoftEngine.`);return}try{t.basisHTML_SND_MSG(`GET_RELATION`,{NR:e.template.nr,PARAMS:e.params})}catch(t){l(`Daten laden fehlgeschlagen (Relation Nr. ${e.template.nr}): ${Yn(t)}`)}}function _r(e,t,n={}){Jn();let r=R();if(e.verb!==`GET_RELATION`){if(typeof r.basisHTML_SND_MSG!=`function`){let e=`Speichern nicht möglich: keine Verbindung zu SoftEngine. Die Eingabe wurde NICHT übernommen.`;return L(e),Promise.resolve({wert:``,roh:void 0,fehler:e})}try{r.basisHTML_SND_MSG(e.verb,{NR:e.nr,PARAMS:[...t]})}catch(t){let n=`Speichern fehlgeschlagen (Relation Nr. ${e.nr}): ${Yn(t)}`;return L(n),Promise.resolve({wert:``,roh:void 0,fehler:n})}return Promise.resolve({wert:``,roh:void 0})}return new Promise(r=>{sr.push({template:e,params:[...t],resolve:r,optionen:n}),gr()})}function vr(e,t){if(!k(t))return``;let n=t.document;if(!n||typeof n.querySelectorAll!=`function`)return``;let r=Array.from(n.querySelectorAll(`[${O}]`)).find(t=>t.getAttribute(O)===e.blockId);if(!r)return``;let i=r[e.value];return i==null?``:String(i)}function yr(e,t,n=R()){if(e.source===`aus`)return``;if(e.source===`fixed`)return e.value;if(e.source===`context`)return t.context[e.value]??``;if(e.source===`previous_result`)return t.previousResult;if(e.source===`step_result`){let n=Number(e.value);if(!Number.isInteger(n)||n<0)return``;let r=e.ergebnisFeld??``;return r===``?t.stepResults?.[n]??``:ir(t.stepRohErgebnisse?.[n],r)}if(e.source===`block_value`)return vr(e,n);if(e.source===`erfassungszelle`||e.source===`aenderungszelle`||e.source===`loeschzelle`){let n=Number(e.value);return!Number.isInteger(n)||n<0?``:t.zeilenZelle?.(e.blockId??``,n)??``}if(e.source===`gewaehlte_zeile`){let n=t.gewaehlteZeile?.(e.blockId??``);return n===void 0?``:j(n,e.value)}if(!k(n))return``;if(e.source===`se_variable`){let t=n.SEDATA;if(!k(t)||!k(t.Daten)||!k(t.Daten.VARArrays))return``;let r=t.Daten.VARArrays[e.value];return r==null?``:String(r)}let r=A(n.FF_DATA_SOURCES,e.dataSourceId??``);if(!r)return``;let i=Nt(n.SEDATA,r.name,r.tableId,r.offenerSatz),a=t.context.PINDEX??``,o=a!==``&&r.indexField!==``?i.find(e=>j(e,r.indexField)===a):i[0];return o?j(o,e.value):``}function br(e,t){let n=`0,START_TOOL,`+e;return t.length>0&&(n+=`,`+t.map(e=>encodeURIComponent(e)).join(`,`)),n}function xr(e){let t=e.trim();if(t===``)return!1;let n=R();try{if(typeof n.sendBWLink==`function`)return n.sendBWLink(t),!0}catch{}try{if(typeof n.sendBWLinkIntern==`function`)return n.sendBWLinkIntern(t),!0}catch{}return!1}function Sr(e,t){if(e.trim()===``)return!1;let n=R();try{if(typeof n.sendBWLinkIntern==`function`)return n.sendBWLinkIntern(br(e,t)),!0}catch{}try{if(typeof n.basisHTML_SND_MSG==`function`){let r={NR:e};return t.length>0&&(r.PARAMS=[...t]),n.basisHTML_SND_MSG(`START_TOOL`,r),!0}}catch{}return!1}function Cr(e,t,n){if(t.trim()===``)return;let r=Array.from(e.querySelectorAll(I.tagName)),i=r.filter(e=>(e.getAttribute(`name`)??I.defaultProps.name)===t);if(i.length===0){L(`Fenster „`+t+`“ gibt es in dieser Maske nicht.`);return}if(i.length>1){L(`Fenster „`+t+`“ gibt es mehrfach — keines ist gemeint.`);return}let a=i[0];if(!n){a.removeAttribute(`offen`);return}for(let e of r)e!==a&&e.removeAttribute(`offen`);a.setAttribute(`offen`,``)}var wr=new WeakMap;function B(e){L(`Aktionskette fehlgeschlagen: `+(e instanceof Error?e.message:String(e)))}var Tr={erfassungszelle:`erfasst`,aenderungszelle:`geaendert`,loeschzelle:`geloescht`};function Er(e){if(e.type!==`RELATION`)return null;let t=null;for(let n of[...e.params,...e.extraParams]){let e=Tr[n.source],r=n.blockId??``;if(e!==void 0&&r!==``){if(t&&(t.art!==e||t.blockId!==r))return{art:e,blockId:``};t={art:e,blockId:r}}}return t}function Dr(e){let t=[];for(let[n,r]of e.entries()){let e=Er(r),i=t[t.length-1];if(e===null){i?i.plaetze.add(n):t.push({art:`einmal`,blockId:``,plaetze:new Set([n])});continue}if(i&&i.art===e.art&&i.blockId===e.blockId){i.plaetze.add(n);continue}t.push({art:e.art,blockId:e.blockId,plaetze:new Set([n])})}return t}function Or(e,t){return Array.from(e.querySelectorAll(`[${O}]`)).find(e=>e.getAttribute(O)===t)}function kr(e,t){if(t===`erfasst`){let t=e.erfassteZeilen;if(!Array.isArray(t))return;let n=e.erfassteSchluessel;return t.map((e,t)=>({satz:``,schluessel:Array.isArray(n)?n[t]??String(t):String(t),werte:e}))}let n=t===`geaendert`?e.geaenderteZeilen:e.geloeschteZeilen;if(Array.isArray(n))return n.map(e=>({satz:e.satz,schluessel:e.satz,werte:e.werte}))}function Ar(e,t,n){return n.satz===``?e:t===`geloescht`?{...e,PINDEX:n.satz,DROP_PINDEX:n.satz}:{...e,PINDEX:n.satz}}async function jr(e,t,n,r,i,a){let o=!1,s={...a?.values,...n,NOW_DATE:fn(new Date)},c=a?.previousResult??``,l=t.map((e,t)=>a?.stepResults[t]??``),u=t.map((e,t)=>a?.rohErgebnisse[t]),d=()=>({values:s,stepResults:l,rohErgebnisse:u,previousResult:c});for(let[n,a]of t.entries()){if(i&&!i.has(n))continue;if(a.type===`START_TOOL`){if(!Sr(a.toolNr,pn({params:a.toolParams},s))){let e=a.toolNr.trim()===``?`Schritt ${n+1} der Kette: START_TOOL ohne Werkzeug-Nummer.`:`Schritt ${n+1} der Kette: START_TOOL ${a.toolNr} ging nicht hinaus — keine Verbindung zu SoftEngine.`;return L(e),{geschrieben:o,fehler:e,mitschrift:d()}}continue}if(a.type===`BW_LINK`){let e=pn({params:[a.befehl]},s)[0]??``;if(!xr(e)){let t=e.trim()===``?`Schritt ${n+1} der Kette: BW_LINK ohne Befehl.`:`Schritt ${n+1} der Kette: BW_LINK ging nicht hinaus — keine Verbindung zu SoftEngine.`;return L(t),{geschrieben:o,fehler:t,mitschrift:d()}}continue}if(a.type===`POPUP_OPEN`||a.type===`POPUP_CLOSE`){Cr(e.ownerDocument??document,a.popup??``,a.type===`POPUP_OPEN`);continue}let t=Xn(R().FF_RELATIONS,a.relationId);if(!t){let e=`Schritt ${n+1} der Kette: seine Relation fehlt in dieser Maske.`;return L(e),{geschrieben:o,fehler:e,mitschrift:d()}}if([...a.params,...a.extraParams].some(e=>e.source===`context`&&e.value===`PINDEX`)&&(s.PINDEX??``)===``){let e=`Schritt ${n+1} der Kette braucht die Satznummer der Zeile — sie fehlt (Relation Nr. ${t.nr}). Nichts geschrieben.`;return L(e),{geschrieben:o,fehler:e,mitschrift:d()}}let f={context:s,previousResult:c,stepResults:l,stepRohErgebnisse:u,gewaehlteZeile:Kt,...r?{zeilenZelle:r}:{}},p=await _r(t,[...a.params,...a.extraParams].map(e=>yr(e,f))),ee=p.wert;if(l[n]=ee,u[n]=p.roh,t.verb===`GET_RELATION`?c=ee:o=!0,p.fehler!==void 0&&p.fehler!==``)return{geschrieben:o,fehler:p.fehler,mitschrift:d()};a.resultKey!==``&&(s[a.resultKey]=ee)}return{geschrieben:o,fehler:``,mitschrift:d()}}async function V(e,t,n){if(e.hasAttribute(`data-ff-editor`))return;let r=_t(e.getAttribute(`data-ff-aktionen`))[t];if(!r||r.length===0)return;let i=wr.get(e);if(i||(i=new Set,wr.set(e,i)),!i.has(t)){i.add(t);try{let t=Dr(r),i=[],a=!1,o=!1,s;for(let c of t){if(c.art===`einmal`){let t=await jr(e,r,n,void 0,c.plaetze,s);if(s=t.mitschrift,t.geschrieben&&(a=!0),t.fehler!==``){o=!0;break}continue}if(c.blockId===``){L(`Ein Schritt liest Zellen aus zwei verschiedenen Listen — das geht nicht.`);break}let t=Or(e.ownerDocument??document,c.blockId),l=t&&kr(t,c.art);if(!t||!l){L(`Den Baustein, dessen Zellen die Kette liest, gibt es in dieser Maske nicht.`);break}if(l.length===0)continue;let u={traeger:t,art:c.art,fertige:[]};i.push(u);for(let i of l){t.zeileSchreibt?.(c.art,i.schluessel);let l=await jr(e,r,Ar(n,c.art,i),(e,t)=>e===c.blockId?String(i.werte[t]??``):``,c.plaetze,s);if(l.geschrieben&&(a=!0),l.fehler!==``){t.zeileGescheitert?.(c.art,i.schluessel,l.fehler),o=!0;break}u.fertige.push(i.schluessel)}if(o)break}for(let{traeger:e,art:t,fertige:n}of i)e.laufFertig?.(t,n);a&&In()}finally{i.delete(t)}}}var Mr=new WeakSet;function Nr(e,t){if(e.hasAttribute(`data-ff-editor`)||!e.hasAttribute(`data-ff-aktionen`)||Mr.has(e))return;Mr.add(e);let n=_t(e.getAttribute(`data-ff-aktionen`));Object.values(n).some(e=>e.some(e=>e.type===`RELATION`))&&Jn(),e.addEventListener(`click`,()=>{V(e,t,{}).catch(B)})}var Pr=`ff-vormerkungen`;function Fr(e){return e.erfasst+e.geaendert+e.geloescht}function Ir(e,t){return t===`erfasst`?e.erfassteZeilen?.length??0:t===`geaendert`?e.geaenderteZeilen?.length??0:e.geloeschteZeilen?.length??0}function Lr(e,t){let n=_t(e.getAttribute(`data-ff-aktionen`))[t];if(!n||n.length===0)return;let r={erfasst:0,geaendert:0,geloescht:0},i=new Set;for(let t of Dr(n)){if(t.art===`einmal`||t.blockId===``)continue;let n=t.art+` `+t.blockId;if(i.has(n))continue;let a=Or(e.ownerDocument??document,t.blockId);a&&(i.add(n),r[t.art]+=Ir(a,t.art))}return i.size===0?void 0:r}var Rr=new WeakMap;function zr(e){let t=[Ir(e,`erfasst`),Ir(e,`geaendert`),Ir(e,`geloescht`)].join(` `);Rr.get(e)!==t&&(Rr.set(e,t),e.dispatchEvent(new CustomEvent(Pr,{bubbles:!0,composed:!0})))}var Br=class extends D{constructor(...e){super(...e),this.label=`Klick mich`,this.vormerkungen=void 0,this.zaehleVormerkungen=()=>{this.vormerkungen=Lr(this,`onClick`)}}static{this.blockType=`button`}static{this.tagName=`ff-button`}static{this.displayName=`Schaltfläche`}static{this.category=`eingabe`}static{this.defaultProps={label:`Klick mich`}}static{this.resizableWidth=!1}static{this.blockEvents=[{key:`onClick`,name:`Klick`}]}static{this.raster={startW:4,startH:2,minW:2,minH:2}}static{this.customProperties=[]}static{this.styles=[D.styles,o`
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
    `]}render(){let e=this.vormerkungen,t=e===void 0?0:Fr(e);return y`<button
      data-ff-editable
      ?disabled=${e!==void 0&&t===0}
      @dblclick=${e=>this.inlineEdit(e,`label`)}
    >${e===void 0?this.label:`${this.label} (${t})`}</button>`}connectedCallback(){super.connectedCallback(),Nr(this,`onClick`),!this.imEditor&&(document.addEventListener(Pr,this.zaehleVormerkungen),this.zaehleVormerkungen())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(Pr,this.zaehleVormerkungen)}};E([w()],Br.prototype,`label`,void 0),E([w({attribute:!1})],Br.prototype,`vormerkungen`,void 0),D.defineAndRegister(Br);var Vr=[`info`,`success`,`warning`,`danger`];function Hr(e){return Vr.includes(e)?e:`info`}var Ur=[{wert:`info`,name:`Hinweis`},{wert:`success`,name:`Erfolg`},{wert:`warning`,name:`Warnung`},{wert:`danger`,name:`Fehler`}];function Wr(e,t){return{attributeName:e,name:`Bedeutung`,description:t,kind:`select`,options:Ur.map(e=>({value:e.wert,label:e.name}))}}var Gr=o`

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
`,Kr=De`<circle cx="6.8" cy="9.6" r="1.9"></circle><circle cx="10.4" cy="7.2" r="1.9"></circle><circle cx="14.6" cy="7.2" r="1.9"></circle><circle cx="18.2" cy="9.6" r="1.9"></circle><path d="M12.5 11.2c-2.9 0-5.3 2.1-5.3 4.4 0 1.7 1.3 2.9 3.1 2.9.9 0 1.5-.3 2.2-.3s1.3.3 2.2.3c1.8 0 3.1-1.2 3.1-2.9 0-2.3-2.4-4.4-5.3-4.4z"></path>`;function qr(){return y`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${Kr}</svg>`}var Jr={hund:`data:image/png;base64,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`,katze:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABgFBMVEUAAAD9qB3+7LZHJxY5GhP+tiP5qyD+8rr+98P+shz72pCUZxpsSBhVNRbRlR0oFQ49IBQyGhCreBo/PwC3hB0/AABVAAA9IRMwGQ/8y25SNiX94ZuDWhjvmxrq2ac8IBM4HRHGjByccBv7u0jKuI1VVQD/AADVxppAIhT90XN/AAB5VBmqmHRjSjWKdVhxWkM5HhG5qYVAJBX9w1B7Y0iahmhsUzwqCwRAHhFdQzDWmiBBJRU4IRY9JRd/fwC2o30WEwNhPxclDgaJZzUiEQjdoiYbAxO6jCvMtHT/wx7/wiE7HxLjzo3eoB48IRPczqLf0aZfQBmjbRkfEwz/0lxFLCKii2PEjSHErXiEb1QeDw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs7lIUAAAAgHRSTlMA/v79/f7+/v7+/f7+/v4v+Gv+BP4EA9BN/v79/v79sY7+/v79AwH91P4C/f3+/f6q/rH+/f3+/v/+/5lOdAL8Ef8i/R3+/v7+/v7P/v6T/v7//ij+/v7+/v4iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKSiMMcAAAanSURBVHjanViHWupKEGaT3U0PMUZKaKIoIIq96/H0Xm5v7/8gd2Y2IQkE1DMfQtzN/pn9p24qFZJqPaivwe965amyAX9rPT3YLA7XdRQcrD0JprYLMKNk0WxJrdKAAc7ha+1pUHuVSqOerAnyWq7BYOgi0gigXjwCs57C6I4DP9UCEHctFnkE1cioqq3v7O3ixe7O+not1b9S7SkYZskSICYttqUj1FEVb6/tLKiyCw8A3E2ECdrfLCE7ZRo1mwDVDnjCOtqysXnUq6OMeptrDTWINMDtvsW2bcFKgWx7m1m+m+yvsalMmZP6ZlXtyossJsb2ciB7LCxrK1vJQQIUvMiGgRyBd68Asu2m/OQnIIHnOmHU90Gi0Jl4egIWfYJd2SuAWrbdsrXWh1dkE9fxpSjIt2jiIZbnNLXVQC3Asc84mdaHlVIyEAk/dIEjkQvW4PE/GjzVbi0Fso2PMUcYSSgpEEMgSSKEPwngSVNNs1vLgbS/0OfbUtAilolkCRLq1QfH5Qeg/DIgTZvCHV4ftcmjzAMK4QT6VTzQyoHYWAN6uCtFsmApEGjle4AwMMqBkGbuiGUYBRHyFTA1OC0LEfEGcLYEe5IAixABf74r0yh8uj5KKRc86t0CkA6b5m3Bng4kJSxxF4EwogV7jlgqlApADRphzxQR8SJQkrND69lIbb4IhLn2+YIa5ZM5cBT4P4Fjgan1l7lkHPykQox5WMLW8zvrF4Asawnu3ITlcL1e2U13BmXBKxrWccJyi89PYIw0cgWbO/kHtTFFeyWktYP5CQsiZTPdWxWozu0M1aVSsaBPyQTSXc+5ozdv08yxKEHK4kTuZnTv/2YU5aPD6gfJ/W2rkJiyiQIPHpJUI6AjCteM0Nz9kLebdhcrJ1R0vwwISVIOsFfpYf5I8p9Uz6D7fRhsaqZhGKZpYyWZTcyFSco2GC0UCR1yFosEbpuGRmJqIpuwZokXygpYoFcAovKjSk7kYRWEIdvUNAMFfrRTpiaS4JZqhQLayYBSUcVL3kBnsg16mKbWBYENamYTSv47X6qKN1swA9pVQH4/iiJfVWn4Ap6boIgxuIhhN/H1FFQyNehW6FHw5dOC/k0GtINWc6JLThJ4WGWBKGAZqTlImpDLffzXQPNZUviuzhPxZ2STH02kswXitF3Pw03ZmmLZ3E+A4i79b5itpmQiDF5NHFoRCjL/xsyzc02HJWwzNZZmnnPqTYZmMmDgBkVGkdRTh1Sx5hOFCqelFqU6wZ3XP8wEhGSbZXZBl0hbTIp+mgECb5itbjcGajfmgF9ral/DofoFn0oMI9Efe0lDTZnWk9IhBr3tBOcXfqjUQCAlcZzsdxxSL+huSbWztJ1+ixHtvOeeE/7dGSdA3VgRY0KLMqCLB36hqDNa7KYfQvv2Piwk7R3qnKMQmzTB7DQo9i+vh8AKcMRjvDjW+XFKuSLajyI9l7NBXsPNk88WdVIpkGZMOT84jDk/Pr9UF+cpjgYmQbf8jL30y71cYVujIMW5DEgzjy/ggYdDky7is8EMR2lETM9snyDVkSZEYs0ZEAUafoEndNVFoqtNjSlGh35UPE3tvqUUit2I0HJipJ5JGWD2gFNyScSpV/aKBzn0SvKmHEnLRUC8iQn6/NvFkyU1EthBigJQCSoqBF0k4rwuO6OSTnokrFNzJZA5Bhw6sIxelx0396p6eoAaGyuAzLFlqSMixEat7Hyp2jYI4En/1DCXsGMaf7DwVzxleIXWKJMXWExc1gaoq8Db+gjWngeDYmJ8/dD26LAS+nNOXehtfmOsj1Dwif/dH84B/TieXtBRC4KywzpuVj4KghT1WQeKsOOpRHo5zesEsaeSse6GANNh+Y5m7shOHQBAsb5zcXBwOB3mmTa654cw+CaE8tgBYSHPt30Z19gBzOon2s2YI4m8HJNapzNrHxbZ3kGu22kJ3c4tn7e/XWwfNhZeUnzJarHUVgBpzRTIDUrMRtUtzG1sRYioVqcDjV0JEPpjqpF4JGSbmUYlHom1RFf9QfMRoJZMOk1IRnslDlkdqTcVzH4si0DdpjcyvVIckO/6lT7xxWP5yBizCJP12vI3Q40T8A0XYsNYCmYY3cEbDLdeddGtszxZqd5ioB2cD7oUo0aWYtX1cP8Myok++v77yldf+OqscncCoXalH5ydPwyGkPRBul376+Bhf3oY6zAzum2Qw6x+e0bzd/cnX3jyhiYmSV7d8NHJfbXyxNeDG+pZ1bv725MRvfLBT1A/ub2/U36zXrKp/wFIy5AOuedaLQAAAABJRU5ErkJggg==`,kaninchen:`data:image/png;base64,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`,hamster:`data:image/png;base64,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`,meerschweinchen:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABgFBMVEX+9t0AAAD++eJFKRrbhjzwqVf1tmY8IxfWiUfnlkZDKBr36c1SNiThjUD2sVyJVy35tpFvRym6eUviiTv0xo0+PgBQMR5VVQA0Gg/12bBVAABCKBqydjjDfU7MfDWTZDXWllI5IhYtGxKlaDA8JBc4IhX6wnfprGx/AACzppQzHhRAJhn/AAC2hknOxbI8JBhiPiT647qnmIbbmmr805mJeGmWhnZ/fwBtV0ddRDApGBB5Z1h5Uy7oqIWTZkgTFgjsy6TFvKnTpYTRqGykakTi3Mjhn3nb1sS9s6C8sZ/pkT9NLyA4Ixc0HxXd1L/AhmGgkn+7im28hD+qfmOfkoKfeEPcvYxgOR5AJxg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRHszQAAAAgHRSTlP+AP78/v7+/f7+0P79/v79/v39/v4E/QP+/gOy/v7+/f5vLf2LUf7+Av1LlAH9/a78/v3+/vz9Av39G/79/v0O/v79/f3+/v7+/v3/NnH+/vz+/P7+/v78ewQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPtUDeAAAAdYSURBVHja1Zhpe9u4EYAhgCQAESJFkaIoixJ12rJ1xLHXt+M4SbNNurtt92z7//9IZwBSIiU5m33aD+34sQ4cL2cGg8EIpPZfEvI/DDpqz2u1ZaddK7W0O3PzcdnptNtH2652ewmN7c4+qDSoYyAHn2tgnZ3BJRD0n0179Xq9NxrDN909no0WPWxD6fUWo9m9Hoqs2QIbpzNQqwKa187qrJApjj+b6gbOGWf5B5D64gyHTzdj2Q8VjTrYxVXg+36AvWcjTYGGtPXT+/V6/WG1avmB0qzRGDvPYax/Dh9elUDAiZl66guUlkZxFkwGVhjatkcooa89xw5DazAJjB5BS+SDefzK+Imgf87gCS3Rb6EIEQDGH8A8yxpIO6IExPHkAL4Dy4/hIYDIBz9yNtIk1OgtWNHSmD78wUODAVJQpP0aQTTyZN4SDnzGQaN8AjyWjY1G/0KFngTisVfxeFJgAOSgPmib3LSFqUrwwTge3mB1am0EdWqvmILmN02Qv8X8fLDlWNJYRsixvW0MrYCzFQ5/I1qgUh1jAE2rg9Gtpu5QSWCVpGF3DYh+Y4tyu8/Vez1D9J8YK1aNMb9/eYgDLjL6EOo6stLhJ4b0bf9PjN3XCo38/rfYGuxwLHmcW1a1zZDu9LO3oCWapjV6StRgR6FuAULbRMXqILmFOSd9vzCtjWHdEs3mj5ylJT9bAkAuLdu2QcF7w1LJzxH46ByC+wZB89oYAqN/+UZxv8xBkEO2ArY1gCQs82LJlLP3l/0MI1Ivv15/7ouAn5cYQq9ZtHER2OY1Gg2zMyyBSHS4AA/V3y5zZ8/vYRvCjkzLINEowjoHvQbbcL6FKENUHPfeWCczk0ZwQ5cMa0jZACfYZcty26AL4gBBDSEHOlWYpKhB7doP4KYNR1pZBi+ybJnZb0JakyyVDQOy5IRDWHc2aQS3f8lB0sc0loWlxc9ts2UKXTwQ6C3tpgzTSLsAzWH7x4NiH+FjMCOl9nbxjTjOMMauxJcCQeAt6fN4k0b0qhU7PhQyMCDfq7oIbVuZvMssKTRKhHKbRrRhxtFhA3VWJkk/Vl2kbfs1Bw2k0EMFLAlm244JyDqL9VoZkSad8swzOa28boVGQuaDQ3QTmwGJtGsjNExIGwUWV6aJHjx0qgoBs+vdISl5xGG2mWBZ57By2kd19o9G3qy77AxWRq08dxcE0T28w1WTpeG2naJKbYIeSj27IsM0tZ2cQ40UJGeViupg28MceUNqPaZKrY5zHEXH0Tfd3DnUXb/7/GldaEfdLnZHjlOaAp4bg2no1qIper2rwmeFIcjURdFQdAMRJpiZCvI/mTGe6+qBFntuUUyhMP7XPddTN7I9RDkZr9fItLDM2XcujL7FtAD/6kAvpV0HSRinY9Jjj1q/iBwS+mfFgcL4J3qw2wWS7dkxm5G6cZFDyAukWyhI1Dv6Qrch3bERgWhEM929IcTENaWn/HrzbZ/UBY9DACyI3ubVhIE+hz/XTKcfk3fIg48HvXgMJJ/3DMipYnAWddWVnkfXyakhnrI1PaiSbUCTaiqkGxDMQ7lOHvS7qxLjqjxUt16yHzUok7J8WhQRR08Tdeq67gVX/Oojcdd3yRXdPCYH4QskzoC9InDMynALonRLumAJrHwSuNcJVyrhV5SSUrdxJqGOhMQ5hYBkInQOgGDox18ebh9OoW19/fBwvaZVKdZW4lE5I3DM+lKSAyC63XbV71VQV9qYbskZJrzwme5zcoJZebrbWfgILAOFICCxMD6X0iWHSC9IZfWlPlq0s/0kkCf0oHV7CLobRVIGie/zOuw1PwSSKG3+r1KliEYoAPy/+JxBHPmWNYnV5LJL98LyiywI0eYwYyoNwywHwSmbZmLY7H6di/IFcKPLochaUFSEkwIEFb49HA4vT6Kua2R/mYzk3W73uXkJM/A4gYMVTQNng0aY2k5QmlH03AXaS/YRYHSfo6ipR59ACoFSXoN6cMyiQnB+gJi9Uij/BT/BwWQE8qM+I8kIKjUN8rC5XKLRwyptNr0RD0BQcE31FrFEAXJ30/tLpBJIomVjgiWE8dFXgLbZdguC0jKGo5ZgDeGH0ss1or8DIrsgx8ZwHNUIVjVQjRjbvO4XQZV6otDIFJJzcgT1OmOTYt3IF2wjBxWamMoWK7YRFnoSzifgR/QAiuxxyHHOgSKS6R+jBItjJMUTrZEXkRfOwt1jUauTKs1pF7+yZywGVDaEosY5dg9s8+qh14VRoNIwA0ysC7+8YAc/9RDF1GO2Wg0/wI57Yf/jDvntw3C4amWB4ojpjUuVP34cL/IbB6wSY3V3+3B1dX1xcXFq5OLi79dXT7e3dyofBcMgMy7GxbVKcclygxcecDsC3XH8HcuhSVJcXfAkL2jZdwpGAKPem87emomVa5+5+Ulx//1s9M8FXK70NvcrW8HGBchoNvv+3lzWzA9dRB21b/7I1VOnfKG0f6N1BNdPIJ3OzXy5LHcsl8v5Dd5HoRzN/5/u2P5D+TdQ/Kls6cWKnQAAAABJRU5ErkJggg==`,vogel:`data:image/png;base64,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`,schildkroete:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABgFBMVEUAAADI3amRq3g1Jxtwh1vY6LeXsn13kWJJRjFod1FSVTs8MiM6LiAtHBOHmW52jGBCOymbtoAzJxw0KBw9PQAlGxQwJRpVAABiaktcZkUtIxlVVQC0yJcXFg+ouIzg7b5/AAAtIhhZXEEnHRWBhGkeFg9/fwDn9cYkFhArIRe+yqK+0aHh7sD/AABhXEolIRj//wA3LSG60J3a8Lk/Pz96eGKam4GdpYIqHxfh+b9VVVU/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjaXbiAAAAgHRSTlMA/v78/v7+/v3+/f79/v3+/f6xzwQwjwP9/m8D/g/9/gJS/Uz9IgL+EzP+/v0B/B4BPf7+BPv8/mH+AwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5/HJYAAATlSURBVHja7Zhpc7M2EIBBEpckxGUIOAbHjnM3eY/e7f//X92VhAEHH3k7/dCZ7ExiR0aP99YqjvMpn/Lfy9XV1b8lLG5Gf90sFj9EWbzql7Z8+rb5Vj492tWPYq7h53FT5QXtpSiqTQmr9x+x895x7pY5bo8plQLEvKXFEllXl2tTagoNf/2te35+Xj2vuk4ldYpr+QbcdSFJY9It67yHhwdvELfbhaBhsblEqb8dp0JdGFl5CHFHgrCuBlR+d5Z07ZSFpGGS+Z23PuBYWPcWU7lxXs9wlqBO5GekW3tzHI36PaWyOsOpBA1VRkhmvTIrnlvHIj+Vg8jhvk8IcdfHOajULpb50eAtnKWgW1CHkNVPpziIUuBynbYzleXcSsshpwwz8rOKRXWkYkqIuk8uUghJu1jczmXBtVPQlBgQZsz6DMj13qhsZwMvaWIM684a5ukfQefc9Eh7B11kGXA8Fcvy0DiIGJXWMG3ZWRCyQlDp/kChltLaKpRdwNGP/NlR+XS9mCq0kVRZhc66CD596dQu2e1SCqXyOulkOaQ0sS5anwZ5rtoKGqNAYVblpKncUcp60MuZ8lApIGQY8jA0ra6cuFqQXtz1KY77BopwpogPQlSEra4akmhkGTnlIm+VxtAf/P5hgCUhlN0+M4t9zIh/soGk2K7232lYNbTf9r53UdJ/eiT6sPTyfcVjGmXkQLKICp3jUPd0H/z56HveiijG4Vh6zzGkJZCmvp4DeSvFGNcnlE9mJIPPvujOSMMp6ICTMRbpUA+KT0Xp0GnQ/oHV++gTlqA6PI1tbP1sxPOzjPgNpe1B9N+DwCzIljRiGDG9lfF64KhtDb+oXJ4DGU7IAk6l0lsTmASGDVAuYA92gr9OggyHB4wJ60kfiNB0rEIQMXAduvuURt5L0HOCLaWN2buNxQBiBgRHufPL1NlD1GBsYIylRh8macpsjGBrvd8QxnGD6Q2gmyX0fV2FkP3f+9nBczF7Gmk5WBwW5BMW+KTvgwSXNWiBjT+FvlBHLEk6XQ6uu8qCKNrCdhEBJ7D27QuMkAhbs08S/Qf4rXD05GA6FbYqAUyQFAc1GDw4SwwnBLXYEPUk5ogIY2Vjl2OlhU3UNJzr7ZaKLyJsGKrDeg6a1AuPBecCcGgfdIBbPBlZkARa8OEIpa7hF0twIYhEzwGVBhJWTRqZpMRRwIGwBmwsiZb+PTbB0RPjTqQdD/pgGEsEwdcFe9kzYC1hDWLSaPRN6qBgfR8yQ/4B3QimIolB403T1NFIGh6iv9OGTRUmg32QMFA6OAviUVKZmTymMyLDGjwVqInxiTIM2/1F0R/dJY7nKQZcTiBU1MwkD6gQjMzXONBYN6li2R9tOMNB3tqQaa9YwZzuI+7XYL0RSDOBOYKU6mlyZreFKQTUG7NGSokahckQJkhB6wKbuHg+lv3NZZhDJYQ40PHCNK4KfZ+RgB3iA1oUSIewYDXBc4Xz9XD8a3FQbyAHWcSpwLOzbUvdz0hmyjljfbJE6C0Gboau+H6MbHXsJJYInJwL7T0oZsFrphRRSkF9F+1XLCgoR4iMPqtnR2SIHdpT5Mth0LUXNmFedJTvKrNY5Lfzc7aBP7aTkdnZVP3lb8/XF8u2dY7ftxbG/aMh7MrsAvnSjiIzXDM/ckMebsef/3H4lP+T/ANP11dFjqSINAAAAABJRU5ErkJggg==`,fisch:`data:image/png;base64,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`,schlange:`data:image/png;base64,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`,pferd:`data:image/png;base64,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`},Yr=[[`welpe`,`hund`],[`hund`,`hund`],[`kater`,`katze`],[`katze`,`katze`],[`kaninchen`,`kaninchen`],[`hase`,`kaninchen`],[`meerschwein`,`meerschweinchen`],[`hamster`,`hamster`],[`ratte`,`hamster`],[`maus`,`hamster`],[`wellensittich`,`vogel`],[`sittich`,`vogel`],[`papagei`,`vogel`],[`vogel`,`vogel`],[`schildkr`,`schildkroete`],[`schlange`,`schlange`],[`natter`,`schlange`],[`python`,`schlange`],[`echse`,`schlange`],[`gecko`,`schlange`],[`reptil`,`schlange`],[`fisch`,`fisch`],[`koi`,`fisch`],[`pferd`,`pferd`],[`pony`,`pferd`],[`fohlen`,`pferd`]];function Xr(e){let t=e.toLowerCase();for(let[e,n]of Yr)if(t.includes(e))return n;return``}function Zr(e){let t=Xr(e),n=t===``?void 0:Jr[t];if(n!==void 0)return y`<img src=${n} alt="" aria-hidden="true" />`}function Qr(e){return Zr(e)??qr()}var $r=o`

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
`,H=class extends D{constructor(...e){super(...e),this.chipVariant=`info`,this.heading=``,this.heading2=``,this.time=``,this.date=``,this.avatar=``,this.meta=``,this.text=``,this.chipText=``,this.headingField=``,this.heading2Field=``,this.timeField=``,this.dateField=``,this.avatarField=``,this.metaField=``,this.textField=``,this.chipTextField=``}static{this.blockType=`card`}static{this.tagName=`ff-card`}static{this.displayName=`Karte`}static{this.category=`anzeige`}static{this.allowedParentTypes=[`kanban-spalte`,`kanban-zimmer`]}static{this.showInPalette=!1}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={chipVariant:`info`,heading:``,heading2:``,time:``,date:``,avatar:``,meta:``,text:``,chipText:``,headingField:``,heading2Field:``,timeField:``,dateField:``,avatarField:``,metaField:``,textField:``,chipTextField:``}}static{this.bindableSpots=[{prop:`time`,label:`Zeit`},{prop:`date`,label:`Datum`},{prop:`avatar`,label:`Avatar`},{prop:`heading`,label:`Titel`},{prop:`heading2`,label:`Titel 2`},{prop:`meta`,label:`Unterzeile`},{prop:`text`,label:`Textzeile`},{prop:`chipText`,label:`Chip`}]}static{this.customProperties=[Wr(`chipVariant`,`Bedeutung des Chips auf der Karte — bestimmt die Chip-Farbe.`)]}static{this.styles=[D.styles,Gr,$r]}stelle(e,t){return y`<span
      class=${t}
      data-ff-editable
      data-ff-spot=${e}
      ?data-ff-bound=${this[`${e}Field`]!==``}
      @dblclick=${t=>this.inlineEdit(t,e)}
    >${this[e]}</span>`}hatReiter(){return this.imEditor||this.date.trim()!==``||this.time.trim()!==``}updated(e){super.updated(e),this.toggleAttribute(`hat-reiter`,this.hatReiter())}render(){let e=Hr(this.chipVariant),t=this.imEditor,n=e=>t||e.trim()!==``,r=this.hatReiter(),i=n(this.avatar)||n(this.heading)||n(this.meta),a=n(this.heading2)||n(this.chipText);return y`<div class="card v-${e}${r?``:` ohne-reiter`}">
      ${r?y`<span class="reiter">
            ${n(this.date)?this.stelle(`date`,`datum`):x}
            ${n(this.time)?this.stelle(`time`,`zeit`):x}
          </span>`:x}
      ${i?y`<div class="kopf">
            ${n(this.avatar)?y`<span
                  class="avatar"
                  data-ff-spot="avatar"
                  ?data-ff-bound=${this.avatarField!==``}
                >${this.avatar.trim()===``?x:Qr(this.avatar)}</span>`:x}
            <div class="namen">
              ${n(this.heading)?this.stelle(`heading`,`name`):x}
              ${n(this.meta)?this.stelle(`meta`,`zusatz`):x}
            </div>
          </div>`:x}
      ${n(this.text)?this.stelle(`text`,`grund`):x}
      ${a?y`<div class="fuss">
            ${n(this.heading2)?this.stelle(`heading2`,`fussl`):x}
            ${n(this.chipText)?y`<span
                  class="chip v-${e}"
                  data-ff-editable
                  data-ff-spot="chipText"
                  ?data-ff-bound=${this.chipTextField!==``}
                  @dblclick=${e=>this.inlineEdit(e,`chipText`)}
                >${this.chipText}</span>`:x}
          </div>`:x}
    </div>`}};E([w()],H.prototype,`chipVariant`,void 0),E([w()],H.prototype,`heading`,void 0),E([w()],H.prototype,`heading2`,void 0),E([w()],H.prototype,`time`,void 0),E([w()],H.prototype,`date`,void 0),E([w()],H.prototype,`avatar`,void 0),E([w()],H.prototype,`meta`,void 0),E([w()],H.prototype,`text`,void 0),E([w()],H.prototype,`chipText`,void 0),E([w()],H.prototype,`headingField`,void 0),E([w()],H.prototype,`heading2Field`,void 0),E([w()],H.prototype,`timeField`,void 0),E([w()],H.prototype,`dateField`,void 0),E([w()],H.prototype,`avatarField`,void 0),E([w()],H.prototype,`metaField`,void 0),E([w()],H.prototype,`textField`,void 0),E([w()],H.prototype,`chipTextField`,void 0),D.defineAndRegister(H);function ei(e){let t=String(e??``).trim();if(t===``)return``;let n=/^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(t);if(n)return`${n[3]}-${n[2].padStart(2,`0`)}-${n[1].padStart(2,`0`)}`;let r=/^(\d{4})-(\d{2})-(\d{2})/.exec(t);return r?`${r[1]}-${r[2]}-${r[3]}`:``}function ti(e){let t=String(e.getMonth()+1).padStart(2,`0`),n=String(e.getDate()).padStart(2,`0`);return`${e.getFullYear()}-${t}-${n}`}function ni(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n)return``;let r=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return r.setDate(r.getDate()+t),ti(r)}var ri=``,ii=new Set;function ai(){return ri}function oi(e){let t=ei(e);t!==ri&&(ri=t,ii.forEach(e=>e()))}function si(e){return ii.add(e),()=>{ii.delete(e)}}var ci=class extends D{constructor(...e){super(...e),this.tag=``,this.tagAbmelden=null}static{this.blockType=`datum`}static{this.tagName=`ff-datum`}static{this.displayName=`Datum`}static{this.category=`anzeige`}static{this.defaultProps={}}static{this.customProperties=[]}static{this.raster={startW:9,startH:2,minW:5,minH:2}}static{this.styles=[D.styles,o`

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
    `]}setzeTag(e){oi(e),this.tag=ai()}render(){return y`<div class="waehler">
      <div class="riegel">
        <button class="pfeil" title="Vortag" @click=${()=>this.setzeTag(ni(this.tag,-1))}>‹</button>
        <input
          class="feld"
          type="date"
          .value=${this.tag}
          @change=${e=>this.setzeTag(e.target.value)}
        />
        <button class="pfeil" title="Folgetag" @click=${()=>this.setzeTag(ni(this.tag,1))}>›</button>
      </div>
      <button class="heute" @click=${()=>this.setzeTag(ti(new Date))}>Heute</button>
    </div>`}connectedCallback(){super.connectedCallback(),this.tag=ai()||ti(new Date),!this.imEditor&&(this.setzeTag(this.tag),this.tagAbmelden?.(),this.tagAbmelden=si(()=>{this.tag=ai()}))}disconnectedCallback(){super.disconnectedCallback(),this.tagAbmelden?.(),this.tagAbmelden=null}};E([T()],ci.prototype,`tag`,void 0),D.defineAndRegister(ci);var{I:li}=ze,ui=e=>e.strings===void 0,di={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},fi=e=>(...t)=>({_$litDirective$:e,values:t}),pi=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},mi=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),mi(e,t);return!0},hi=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},gi=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),yi(t)}};function _i(e){this._$AN===void 0?this._$AM=e:(hi(this),this._$AM=e,gi(this))}function vi(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0){if(t){if(Array.isArray(r))for(let e=n;e<r.length;e++)mi(r[e],!1),hi(r[e]);else r!=null&&(mi(r,!1),hi(r))}else mi(this,e)}}var yi=e=>{e.type==di.CHILD&&(e._$AP??=vi,e._$AQ??=_i)},bi=class extends pi{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),gi(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(mi(this,e),hi(this))}setValue(e){if(ui(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},xi=new WeakMap,Si=fi(class extends bi{render(e){return x}update(e,[t]){let n=t!==this.G;return n&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),x}rt(e){if(this.G!==void 0){if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=xi.get(t);n===void 0&&(n=new WeakMap,xi.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}}get lt(){return typeof this.G==`function`?xi.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function Ci(e){return e.trim().toLowerCase().split(/\s+/).filter(e=>e!==``)}function wi(e,t){let n=Ci(t);if(n.length===0)return!0;let r=e.join(` `).toLowerCase();return n.every(e=>r.includes(e))}function Ti(e,t,n=8){if(t.trim()===``)return[];let r=[];for(let i of e)if(wi([i.anzeige,i.wert],t)&&(r.push(i),r.length>=n))break;return r}function Ei(e,t,n){return t<=0?0:((e+n)%t+t)%t}function Di(e,t){return t<=0||e<0||e>=t?0:e}function Oi(e,t){return e===`ArrowDown`?t.listeOffen?`marke-runter`:`nichts`:e===`ArrowUp`?t.listeOffen?`marke-hoch`:`nichts`:e===`Escape`?t.listeOffen?`liste-zu`:`nichts`:e===`Enter`?t.listeOffen?t.markeVonHand||t.treffer===1?`uebernehmen`:`fenster`:t.feldLeer?`fenster`:`nichts`:`nichts`}function ki(e){let t=0,n=typeof window<`u`&&window.innerWidth>0?window.innerWidth:typeof document<`u`&&document.documentElement?.clientWidth>0?document.documentElement.clientWidth:1e4,r=e.closest?.(`.tabelle`);if(r instanceof(globalThis.HTMLElement??Object)&&typeof r.getBoundingClientRect==`function`){let e=r.getBoundingClientRect();return e.width>0&&(t=Math.max(t,e.left),n=Math.min(n,e.right)),{links:t,rechts:n}}let i=typeof e.getRootNode==`function`?e.getRootNode():null;if(i instanceof(globalThis.ShadowRoot??Object)&&i.host instanceof(globalThis.HTMLElement??Object)){let e=i.host.parentElement;if(e&&typeof e.getBoundingClientRect==`function`){let r=e.getBoundingClientRect();r.width>0&&(t=Math.max(t,r.left),n=Math.min(n,r.right))}}return{links:t,rechts:n}}function Ai(e){if(!e||typeof e.getBoundingClientRect!=`function`)return;let t=e.parentElement;if(!t)return;e.style.maxWidth=``;let n=typeof t.getBoundingClientRect==`function`?t.getBoundingClientRect():{left:0,right:0,width:0},r=t.offsetWidth||n.width||0,i=n.left||0,a=n.right||i+r,o=e.offsetWidth||(typeof e.getBoundingClientRect==`function`?e.getBoundingClientRect().width:0);if(o<=0)return;let s=ki(e),c=i+o>s.rechts;e.classList.toggle(`nach-links`,c);let l=c?Math.max(r,a-s.links):Math.max(r,s.rechts-i);l>0&&Number.isFinite(l)&&(e.style.maxWidth=`${Math.floor(l)}px`)}function ji(e){return y`<ul
    class="vorschlaege"
    ${Si(e=>{e&&`classList`in e&&`style`in e&&(Ai(e),typeof requestAnimationFrame==`function`&&requestAnimationFrame(()=>{e.isConnected&&Ai(e)}))})}
    @mousedown=${e=>e.preventDefault()}
  >${e.eintraege.map((t,n)=>y`<li
      class=${n===e.marke?`vorschlag marke`:`vorschlag`}
      @click=${()=>e.onWaehlen(n)}
      @mouseenter=${()=>e.onMarke(n)}
    ><span class="vorschlag-anzeige">${t.anzeige===``?t.wert:t.anzeige}</span>${t.wert!==``&&t.wert!==t.anzeige?y`<span class="vorschlag-wert">${t.wert}</span>`:x}</li>`)}</ul>`}var Mi=o`
  .vorschlaege {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 3;
    width: max-content;
    min-width: 100%;
    box-sizing: border-box;
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

  /* Tritt die Liste ueber den rechten Rand der Flaeche hinaus, waechst sie
     nach links statt weiter nach rechts (Schritt 18). */
  .vorschlaege.nach-links {
    left: auto;
    right: 0;
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
`;function U(e,t,n,r){return{attributeName:e,name:t,description:n,kind:`jaNein`,options:[{value:`nein`,label:`Nein`},{value:`ja`,label:`Ja`}],...r}}var Ni={attributeName:`fieldType`,equals:`nachschlagen`},Pi=[{attributeName:`fieldType`,name:`Feldtyp`,description:`Welche Art Eingabe das Feld annimmt.`,kind:`select`,options:[{value:`text`,label:`Text`},{value:`number`,label:`Zahl`},{value:`textarea`,label:`Mehrzeilig`},{value:`select`,label:`Auswahl`},{value:`date`,label:`Datum`},{value:`time`,label:`Uhrzeit`},{value:`checkbox`,label:`Ankreuzfeld`},{value:`nachschlagen`,label:`Nachschlagen`}]},{attributeName:`options`,name:`Auswahl-Optionen`,description:`Einträge durch Komma getrennt, z. B. "Zimmer 1, Zimmer 2".`,kind:`text`,visibleWhen:{attributeName:`fieldType`,equals:`select`}},{attributeName:`nachschlagQuelle`,name:`Quelle`,description:`Quelle, aus der der Bediener eine Zeile wählt.`,kind:`quelle`,visibleWhen:Ni},{attributeName:`speicherFeld`,name:`Gespeichert wird`,description:`Feld, dessen Wert die Maske sich merkt (z. B. die Nummer).`,kind:`field`,quelleProp:`nachschlagQuelle`,klarnameProp:`speicherTitel`,visibleWhen:Ni},U(`einzigerTreffer`,`Einzigen Treffer übernehmen`,`Bleibt genau ein Satz übrig, übernimmt das Feld ihn von selbst.`,{visibleWhen:Ni}),{attributeName:`valueField`,name:`Feld`,description:`Feld, dessen Wert angezeigt wird.`,kind:`field`,visibleWhen:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]}}];function Fi(e){let t=e.split(`::`);if(t.length!==2)return{quelleId:``,code:e};let[n,r]=t;return n===``||r===``?{quelleId:``,code:e}:{quelleId:n,code:r}}function Ii(e,t){let n=t[e.key];return typeof n==`boolean`?n:e.standard===!0}function Li(e,t){let n=t[e.feldKey],r=typeof n==`string`&&Fi(n).quelleId!==``;return(e.eintragsSchalter??[]).filter(e=>!(e.nurEigeneQuelle===!0&&r))}function Ri(e){let t=new Set;for(let n of e){let e=n.trim();e!==``&&t.add(e)}let n=1;for(let e of t){let t=/^s(\d+)$/.exec(e);t&&(n=Math.max(n,Number(t[1])+1))}let r=new Set;return e.map(e=>{let i=e.trim();if(i!==``&&!r.has(i))return r.add(i),i;for(;t.has(`s${n}`);)n+=1;let a=`s${n}`;return t.add(a),r.add(a),a})}function zi(e){return`${e.toLowerCase()}field`}var Bi=`source`,Vi=999,Hi=`0`,Ui=`255`,Wi=new Map;function Gi(e){let t=Et(e);Tt(e,[]),t!==void 0&&t.length>0&&Fn()}async function Ki(e,t,n,r,i){return _r({id:`relation-lader`,verb:`GET_RELATION`,nr:e.nr,params:[]},[t.belegart,r,i,t.belegnummer,t.jahr,t.archiv,``,String(n),``,``,``,``],{still:!0,satzAntwort:!0})}function qi(e,t,n){L(`Positionen laden bei Zeile ${t} abgebrochen (Relation Nr. ${e}): ${n} Es werden keine Positionen angezeigt — die Liste wäre unvollständig.`)}function Ji(e,t,n){let r=(Wi.get(e.id)??0)+1;if(Wi.set(e.id,r),n===void 0){Gi(e.name);return}let i={belegart:j(n,t.belegartFeld),belegnummer:j(n,t.belegnummerFeld),jahr:t.jahrFeld===``?``:j(n,t.jahrFeld),archiv:t.archivFeld===``?``:j(n,t.archivFeld)};if(i.belegart===``||i.belegnummer===``){Gi(e.name);return}Gi(e.name),(async()=>{let n=[],a=!1;for(let o=1;o<=Vi;o+=1){let s=await Ki(t,i,o,Hi,Ui);if(Wi.get(e.id)!==r)return;if(s.fehler!==void 0){qi(t.nr,o,s.fehler);return}let c=s.wert;if(t.endeFelder.every(e=>j({SATZ:c},e)===``)){a=!0;break}let l={SATZ:c};for(let n of t.zusatzFelder){let a=n.indexOf(`_`),s=await Ki(t,i,o,n.slice(0,a),n.slice(a+1));if(Wi.get(e.id)!==r)return;if(s.fehler!==void 0){qi(t.nr,o,s.fehler);return}l[n]=s.wert}n.push(l)}a||L(`Positionen laden: nach ${Vi} Zeilen ohne Ende-Kennung abgebrochen (Relation Nr. ${t.nr}) — die Liste ist wahrscheinlich unvollständig, vermutlich passen Relationsnummer oder Ende-Felder nicht.`),Wi.get(e.id)===r&&(Tt(e.name,n),Fn())})()}var Yi=new Map;function Xi(e,t,n){let r={};return n.forEach((n,i)=>{let a=ir(t,n);r[n]=a===``?i===0?e:``:a}),r}function Zi(e,t){let n=(Yi.get(e.id)??0)+1;Yi.set(e.id,n);let r=Xn(R().FF_RELATIONS,t.relationId);if(!r){L(`Quelle „${e.name}“: ihre Relation fehlt in dieser Maske.`);return}if(r.verb!==`GET_RELATION`){L(`Quelle „${e.name}“ kann nur lesen — ${r.verb} liefert keinen Wert zurück.`);return}let i=t.params.map(e=>yr(e,{context:{},previousResult:``}));(async()=>{let a=await _r(r,i);Yi.get(e.id)===n&&(a.fehler===void 0||a.fehler===``)&&(Tt(e.name,[Xi(a.wert,a.roh,t.felder)]),Fn())})()}var Qi=new Map,$i=new Map,ea=!1;function ta(){let e=new Map;for(let t of Ye())t.satzWahl&&e.set(t.tagName.toLowerCase(),t);return e}function na(e,t){let n=t.satzWahl;if(!n)return``;let r=!0;if(n.wenn){let i=n.wenn.attributeName,a=e.getAttribute(i.toLowerCase())??t.defaultProps[i];r=Ze(n.wenn,{[i]:a})}return(r?n.quelleProp??`source`:Bi).toLowerCase()}function ra(e,t,n=typeof document>`u`?void 0:document){if(e===``||n===void 0)return;let r=null;for(let i of Array.from(n.querySelectorAll(`[${O}]`))){let n=t.get(i.tagName.toLowerCase());if(!n)continue;let a=na(i,n);if(a===``||i.getAttribute(a)!==e)continue;let o=P(i),s=Kt(o);if(s===void 0)continue;let c=Jt(o);(r===null||c>r.nummer)&&(r={zeile:s,nummer:c})}return r?.zeile}function ia(e,t,n){if(Qi.get(e)===t)return!1;if(n)$i.set(e,new Set([t]));else{let n=$i.get(e)??new Set;if(n.has(t))return!1;n.add(t),$i.set(e,n)}return Qi.set(e,t),!0}function aa(){Qi.clear(),$i.clear()}function oa(e){let t=R().FF_DATA_SOURCES;if(!Array.isArray(t))return;let n=ta();for(let r of t){if(!k(r)||typeof r.id!=`string`)continue;let i=A(t,r.id);if(!i?.ladeRelation)continue;let a=ra(i.ladeRelation.geberQuelleId,n);ia(i.id,Lt(a),e)&&Ji(i,i.ladeRelation,a)}}function sa(){let e=R().FF_DATA_SOURCES;if(Array.isArray(e))for(let t of e){if(!k(t)||typeof t.id!=`string`)continue;let n=A(e,t.id);n?.holWert&&Zi(n,n.holWert)}}function ca(){ea||(ea=!0,Gt(oa),Mn(e=>{e&&sa()}),yn()&&sa(),$t(aa))}function la(e){let t=new Set,n=!1,r=n=>{yn()&&t.forEach(t=>{e.hydriere(t,n)})};return{connect:i=>{i.hasAttribute(`data-ff-editor`)||(t.add(i),e.verdrahte?.(i),n||(n=!0,Mn(r),si(()=>{r(!1)}),Gt(()=>{r(!1)}),ca()),Jn(),yn()&&e.hydriere(i,!1))},disconnect:e=>{t.delete(e)}}}var ua=rt.toLowerCase(),da=``;function fa(e){if(e.length===0)return``;let t=[];for(let n of e){let e=n.trim();if(e===``)return``;t.push(e)}return t.join(da)}function pa(e){return It(e,ua,`quelleId`,{ohnePaareBehalten:!0}).map(e=>({quelleId:e.id,partnerId:e.partnerId,keyPairs:e.keyPairs}))}function ma(e){let t=pa(e);if(t.length===0)return(e,t)=>j(e,Fi(t).code);let n=R().SEDATA,r=R().FF_DATA_SOURCES,i=new Map;for(let e of t){if(e.keyPairs.length===0)continue;let t=A(r,e.quelleId);if(!t)continue;let a=Nt(n,t.name,t.tableId,t.offenerSatz),o=new Map;for(let t of a){let n=fa(e.keyPairs.map(e=>j(t,e.toField)));n!==``&&!o.has(n)&&o.set(n,t)}i.set(e.quelleId,{nachSchluessel:o,partnerId:e.partnerId,hierFelder:e.keyPairs.map(e=>e.fromField)})}let a=(e,t,n)=>{if(e===``)return t;let r=i.get(e);if(!r||n.has(e))return;n.add(e);let o=a(r.partnerId,t,n);if(n.delete(e),o===void 0)return;let s=fa(r.hierFelder.map(e=>j(o,e)));return s===``?void 0:r.nachSchluessel.get(s)};return(e,t)=>{let{quelleId:n,code:r}=Fi(t);if(n===``)return j(e,r);let i=a(n,e,new Set);return i===void 0?``:j(i,r)}}function ha(e,t){let n=e.getAttribute(`source`)??``,r=e.getAttribute(t)??``;if(n===``||r===``)return{art:`ungebunden`};let i=A(R().FF_DATA_SOURCES,n);if(!i)return{art:`ohneQuelle`};let a=rn(e,Nt(R().SEDATA,i.name,i.tableId,i.offenerSatz));if(a===void 0)return{art:`ohneZeile`};let{quelleId:o,code:s}=Fi(r);return{art:`wert`,wert:o===``?j(a,s):ma(e)(a,r),zeile:a,quelle:i,quelleId:o,reinerCode:s}}var ga=new WeakMap,_a=new WeakSet;function va(e){let t=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(e);return t?`${t[3]}-${t[2]}-${t[1]}`:e}function ya(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}.${t[2]}.${t[1]}`:e}function ba(e){return typeof e.value==`string`?e.value:``}function xa(e){if(e.pruefeEigenenWert?.(),e.getAttribute(`fieldtype`)===`nachschlagen`){ga.delete(e);return}let t=ha(e,zi(`value`));if(t.art!==`wert`){ga.delete(e),Qt(P(e)),t.art===`ohneZeile`&&(e.value=``);return}let{zeile:n,quelle:r,quelleId:i,reinerCode:a,wert:o}=t,s=Ot(r,n);i===``?ga.set(e,{row:n,code:a,pindex:s}):ga.delete(e),e.value=o,Zt(P(e),n)}function Sa(e){let t=ga.get(e);return t&&kt(t.row,t.code,ba(e)),t}function Ca(e){_a.has(e)||(_a.add(e),e.addEventListener(`input`,()=>{Sa(e)}),e.addEventListener(`change`,()=>{let t=Sa(e);V(e,`onChange`,{VALUE:ba(e),PINDEX:t?.pindex??``}).catch(B)}))}var wa=la({hydriere:xa,verdrahte:Ca}),Ta=wa.connect,Ea=wa.disconnect,Da=o`
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
`,Oa=[`text`,`number`,`textarea`,`select`,`date`,`time`,`checkbox`,`nachschlagen`];function ka(e){return Oa.includes(e)?e:`text`}var Aa=[`text`,`number`,`textarea`,`select`,`nachschlagen`,`date`,`time`],ja={select:`ph-select`,date:`ph-nativ`,time:`ph-nativ`,nachschlagen:`ph-nachschlag`};function Ma(){return y`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
      <line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></line>
    </svg>`}function Na(e,t,n=new Set){let r=e=>e.versteckt===!0||n.has(e.kennung);if(t||!e.some(r))return{spalten:e,plaetze:e.map((e,t)=>t)};let i=[],a=[];return e.forEach((e,t)=>{r(e)||(i.push(e),a.push(t))}),i.length===0&&e.length>0?{spalten:[e[0]],plaetze:[0]}:{spalten:i,plaetze:a}}var Pa=`Spalte {n}`;function Fa(e){return Pa.replace(`{n}`,String(e+1))}function Ia(e){return{kennung:``,titel:Fa(e),feld:``}}function La(e){let t=Ri(e.map(e=>e.kennung));return e.map((e,n)=>e.kennung===t[n]?e:{...e,kennung:t[n]})}function Ra(e,t){let n=t.trim();return n===``?-1:e.findIndex(e=>e.kennung===n)}function za(){return La([Ia(0)])}function Ba(e){let t=typeof e==`number`?e:Number(e);if(!Number.isFinite(t))return;let n=Math.round(t);return n<40?40:n}function Va(e,t){if(e&&typeof e==`object`){let n=e,r=n.breite===void 0?void 0:Ba(n.breite);return{kennung:typeof n.kennung==`string`?n.kennung.trim():``,titel:typeof n.titel==`string`?n.titel:Fa(t),feld:typeof n.feld==`string`?n.feld:``,...r===void 0?{}:{breite:r},...typeof n.summe==`boolean`?{summe:n.summe}:{},...typeof n.aenderbar==`boolean`?{aenderbar:n.aenderbar}:{},...typeof n.versteckt==`boolean`?{versteckt:n.versteckt}:{},...typeof n.fuellFeld==`string`&&n.fuellFeld.trim()!==``?{fuellFeld:n.fuellFeld.trim()}:{}}}return typeof e==`string`?{...Ia(t),titel:e}:Ia(t)}function W(e){let t;if(Array.isArray(e))t=e.map((e,t)=>Va(e,t));else if(typeof e==`number`&&Number.isFinite(e)||typeof e==`string`&&/^\d+$/.test(e)){let n=Math.max(1,Math.floor(Number(e)));t=[...Array(n).keys()].map(e=>Ia(e))}else t=za();return t.length>16&&(t=t.slice(0,16)),t.length<1&&(t=[Ia(0)]),La(t)}function Ha(e){try{return W(JSON.parse(e))}catch{return za()}}function Ua(e,t=()=>void 0){let n=e.map((e,n)=>t(n)??e.breite),r=n.filter(e=>e!==void 0),i=r.length===0?1:Math.max(1,Math.round(r.reduce((e,t)=>e+t,0)/r.length));return n.map(e=>`minmax(0, ${e??i}fr)`).join(` `)}var Wa=`important`,Ga=` !`+Wa,G=fi(class extends pi{constructor(e){if(super(e),e.type!==di.ATTRIBUTE||e.name!==`style`||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,n)=>{let r=e[n];return r==null?t:t+`${n=n.includes(`-`)?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,`-$&`).toLowerCase()}:${r};`},``)}update(e,[t]){let{style:n}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let e of this.ft)t[e]??(this.ft.delete(e),e.includes(`-`)?n.removeProperty(e):n[e]=null);for(let e in t){let r=t[e];if(r!=null){this.ft.add(e);let t=typeof r==`string`&&r.endsWith(Ga);e.includes(`-`)||t?n.setProperty(e,t?r.slice(0,-11):r,t?Wa:``):n[e]=r}}return b}}),Ka=[`menge`,`anzahl`,`dosis`,`tage`],qa={stellen:3,richtung:`kfm`};function Ja(){return{menge:{spalte:``,runden:{...qa}},anzahl:{spalte:``,runden:{stellen:0,richtung:`auf`}},dosis:{spalte:``,runden:{...qa}},tage:{spalte:``,runden:{...qa}}}}var Ya=/^-?\d+(,\d+)?$|^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/;function Xa(e){let t=e.trim();if(t===``||!Ya.test(t))return null;let n=Number(t.replace(/\./g,``).replace(`,`,`.`));return Number.isFinite(n)?n:null}function Za(e,t){let n=10**Math.max(0,t.stellen),r=e*n;return(t.richtung===`auf`?Math.ceil(r-1e-9):t.richtung===`ab`?Math.floor(r+1e-9):Math.round(r))/n}function Qa(e,t){return e.toLocaleString(`de-DE`,{useGrouping:!1,minimumFractionDigits:0,maximumFractionDigits:Math.max(0,t)})}function $a(e,t,n){if(!n.has(`menge`))return null;let r=[`menge`];for(let e of[`anzahl`,`dosis`,`tage`])n.has(e)&&r.push(e);let i=[];for(let e of r){let n=t[e];if(n===`fehler`)return null;n===null&&i.push(e)}if(i.length!==1)return null;let a=i[0],o=e=>{let n=t[e];return typeof n==`number`?n:1},s=o(`anzahl`)*o(`dosis`)*o(`tage`),c;if(a===`menge`)c=s;else{if(s===0)return null;c=o(`menge`)/s}return Number.isFinite(c)?{platz:a,wert:Za(c,e[a].runden)}:null}function eo(e,t){if(!e||typeof e!=`object`)return{...t};let n=e;return{stellen:typeof n.stellen==`number`&&Number.isInteger(n.stellen)&&n.stellen>=0&&n.stellen<=6?n.stellen:t.stellen,richtung:n.richtung===`auf`||n.richtung===`ab`||n.richtung===`kfm`?n.richtung:t.richtung}}function to(e,t){if(!e||typeof e!=`object`)return{spalte:``,runden:{...t}};let n=e;return{spalte:typeof n.spalte==`string`?n.spalte:``,runden:eo(n.runden,t)}}function no(e){let t=e;if(typeof e==`string`){let n=e.trim();if(n===``)return null;try{t=JSON.parse(n)}catch{return null}}if(!t||typeof t!=`object`||Array.isArray(t))return null;let n=t,r=Ja();return{menge:to(n.menge,r.menge.runden),anzahl:to(n.anzahl,r.anzahl.runden),dosis:to(n.dosis,r.dosis.runden),tage:to(n.tage,r.tage.runden)}}function ro(e,t){let n=new Set(t);if(!Ka.some(t=>n.has(e[t].spalte)))return e;let r={...e};for(let e of Ka)n.has(r[e].spalte)&&(r[e]={...r[e],spalte:``});return r}function io(e){return JSON.stringify(e)}var ao=`Keine Datensätze.`;function oo(){return{attributeName:`leerText`,name:`Text ohne Datensätze`,description:`Text, wenn die Quelle keine Zeilen liefert. Leer: gar nichts.`,kind:`text`,requiresDataSource:!0}}function so(e,t=!1){return e.trim()===``?x:y`<div class="leer${t?` leer--tafel`:``}">
    <span>${e}</span>
  </div>`}var co=o`
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

  .leer--tafel {
    border: none;
    padding: 44px 20px 48px;
  }
`;function lo(e,t){let n=(e?.fuellFeld??``).trim(),r=n===``?(e?.feld??``).trim():n;if(r===``)return{art:`frei`,quelleId:``,code:``};let{quelleId:i,code:a}=Fi(r);return i===``?{art:`eigen`,quelleId:t,code:a}:{art:`verknuepft`,quelleId:i,code:a}}function K(e,t){return lo(e.spalten[t],e.quelleId)}function uo(e){let t=[];for(let n of e.spalten){let r=lo(n,e.quelleId);r.art===`verknuepft`&&r.quelleId!==``&&(t.includes(r.quelleId)||t.push(r.quelleId))}return t}function fo(e,t){let n=K(e,t);if(n.quelleId!==``&&n.code!==``)for(let r=0;r<e.spalten.length;r++){if(r===t)continue;let i=e.spalten[r],a=lo(i,e.quelleId);if(a.quelleId===n.quelleId&&a.code!==``&&a.code!==n.code)return{titel:i.titel,code:a.code}}}function po(e,t){let n=K(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=[];for(let t of e.spalten){let i=lo(t,e.quelleId);i.quelleId===n.quelleId&&i.code!==``&&(r.some(e=>e.feld===i.code)||r.push({kennung:``,titel:t.titel,feld:i.code}))}return r}function mo(e,t,n){let r=e.map(e=>({toField:e.toField,soll:t(e.fromField)})).filter(e=>e.soll!==void 0);return r.length===0?[...n]:n.filter(e=>r.every(t=>t.soll!==``&&t.soll===j(e,t.toField)))}function ho(e,t,n,r){return y`<input
    class="erf-eingabe"
    type="text"
    data-spalte=${r}
    placeholder=${e.spalten[n]?.titel??``}
    .value=${e.wert(r)}
    @input=${e=>t.tippen(r,e.target.value)}
    @keydown=${e=>t.taste(r,e)}
    @blur=${()=>t.verlassen(r)}
  />`}function go(e,t,n,r,i){if(i)return y`<div class="erf-halter">
      ${ho(e,t,n,r)}
    </div>`;let a=e.tippSpalte===r&&e.vorschlaege.length>0;return y`<div class=${e.listeNachOben?`erf-halter nach-oben`:`erf-halter`}>
    ${ho(e,t,n,r)}
    ${a?ji({eintraege:e.vorschlaege,marke:e.marke,onWaehlen:e=>t.waehleVorschlag(e),onMarke:e=>t.setzeMarke(e)}):x}
  </div>`}function _o(e,t){return y`<div class="zeile erfassung" role="row" style=${G(e.cols)}>
    ${e.spalten.map((n,r)=>{if(e.imEditor)return y`<div
          class=${n.versteckt===!0?`versteckt`:x}
          role="cell"
        >${`—`}</div>`;let i=lo(n,e.quelleId).art===`frei`;return y`<div role="cell">${go(e,t,r,e.plaetze[r],i)}</div>`})}
  </div>`}function vo(e,t,n){let r=e.lauf.vorschlaege[n];r!==void 0&&(e.lauf.uebernimm(e.umfeld(),t,r.satz),e.melde())}function yo(e,t){let n=e.umfeld(),r=n.spalten[t],i=K(n,t);if(r===void 0||i.quelleId===``||i.code===``)return;let a=po(n,t);xc({el:e.baustein,quelleId:i.quelleId,speicherFeld:i.code,speicherTitel:r.titel,spalten:a,titel:r.titel,breite:$s(a.length),hoehe:380,eintraege:e.lauf.eintraege(n,t),rueckFokus:null,suchtext:e.lauf.wertVon(n,t),onUebernehmen:(n,r,i)=>{e.lauf.uebernimm(e.umfeld(),t,i),e.melde(),bo(e,t,`Enter`)}})}function bo(e,t,n){let r=e.umfeld();if(n===`Tab`){let n=e.lauf.nachbarPlatz(r,t,1);return n===-1?e.erfasseZeile():(e.fokussiere(n),!0)}let i=e.lauf.naechsteLeere(r,t);return i===-1?n===`Enter`&&e.erfasseZeile():e.fokussiere(i),!0}function xo(e,t,n){if(n.key===`Tab`&&n.shiftKey){let r=e.lauf.nachbarPlatz(e.umfeld(),t,-1);if(r===-1)return;n.preventDefault(),e.fokussiere(r),e.melde();return}let r=n.key===`ArrowDown`&&n.altKey?`F4`:n.key,i=e.lauf.entscheideTaste(e.umfeld(),t,r);if(i===`nichts`){n.key===`Enter`&&n.preventDefault();return}let a=!0;i===`uebernehmen`?(vo(e,t,e.lauf.marke),a=bo(e,t,n.key)):i===`fenster`?yo(e,t):i===`liste-auf`?e.lauf.oeffneListe(t):i===`weiter`?a=bo(e,t,n.key):i===`leeren`&&e.lauf.leere(e.umfeld(),t),a&&n.preventDefault(),e.melde()}function So(e,t,n,r){let i=e.umfeld();return _o({spalten:r.spalten,plaetze:r.plaetze,quelleId:i.quelleId,cols:t,imEditor:e.baustein.hasAttribute(`data-ff-editor`),wert:t=>e.lauf.wertVon(i,t),tippSpalte:e.lauf.tippSpalte,vorschlaege:e.lauf.vorschlaege,marke:e.lauf.marke,listeNachOben:n},{tippen:(t,n)=>{e.lauf.tippe(t,n),e.melde()},taste:(t,n)=>xo(e,t,n),verlassen:t=>{e.lauf.verlasse(t),e.melde()},waehleVorschlag:t=>vo(e,e.lauf.tippSpalte,t),setzeMarke:t=>{e.lauf.setzeMarke(t),e.melde()}})}var Co=1,wo=/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$|^-?\d+(,\d+)?$|^-?\d+(\.\d+)?$/,To=/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/,Eo=/^(\d{4})-(\d{2})-(\d{2})$/;function Do(e){let t=e.trim();if(t===``||!wo.test(t))return null;let n=t.includes(`,`)?t.replace(/\./g,``).replace(`,`,`.`):/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t)?t.replace(/\./g,``):t,r=Number(n);return Number.isFinite(r)?r:null}function Oo(e){let t=e.trim();if(t===``)return null;let n=Eo.exec(t);if(n){let[,e,t,r]=n;return ko(Number(e),Number(t),Number(r))}let r=To.exec(t);if(r){let[,e,t,n]=r,i=Number(n);return ko(n.length===2?i<=69?2e3+i:1900+i:i,Number(t),Number(e))}return null}function ko(e,t,n){if(t<1||t>12||n<1||n>31)return null;let r=new Date(e,t-1,n);return r.getFullYear()!==e||r.getMonth()!==t-1||r.getDate()!==n?null:r.getTime()}function Ao(e){let t=0,n=0,r=0;for(let i of e)i.trim()!==``&&(t++,Do(i)!==null&&n++,Oo(i)!==null&&r++);return t===0?`text`:r===t?`datum`:n===t?`zahl`:`text`}var jo=new Intl.Collator(`de`,{numeric:!0,sensitivity:`base`});function Mo(e,t,n){if(t<0||e.length===0)return e.map((e,t)=>t);let r=n=>e[n][t]??``,i=Ao(e.map(e=>e[t]??``)),a=n?1:-1;return e.map((e,t)=>t).sort((e,t)=>{let n=r(e).trim(),o=r(t).trim();if(n===``&&o===``)return e-t;if(n===``)return Co;if(o===``)return-1;let s=i===`zahl`?(Do(n)??0)-(Do(o)??0):i===`datum`?(Oo(n)??0)-(Oo(o)??0):jo.compare(n,o);return s===0?e-t:s*a})}var No=class{constructor(){this.getippt=new Map,this.gewaehlt=new Map,this.vonHand=new Set,this._tippSpalte=-1,this._marke=0,this._listeZu=!1,this._listeAuf=-1,this._markeVonHand=!1,this._gerechnet=null,this._vorschlaege=[]}get tippSpalte(){return this._tippSpalte}get marke(){return this._marke}get vorschlaege(){return this._vorschlaege}wertVon(e,t){let n=this.getippt.get(t);if(n!==void 0&&n!==``)return n;if(this._gerechnet?.index===t)return this._gerechnet.wert;if(n!==void 0)return n;let r=K(e,t);if(r.quelleId===``||r.code===``)return``;let i=this.gewaehlt.get(r.quelleId);return i===void 0?``:j(i,r.code)}gegebeneZahl(e,t){let n=this.getippt.get(t);if(n!==void 0){if(n.trim()===``)return null;let e=Xa(n);return e===null?`fehler`:e}let r=K(e,t);if(r.quelleId===``||r.code===``)return null;let i=this.gewaehlt.get(r.quelleId);if(i===void 0)return null;let a=j(i,r.code).trim();if(a===``)return null;let o=Do(a);return o===null?`fehler`:o}rechne(e){this._gerechnet=null;let t=e.rechnung;if(!t)return;let n={},r={},i=new Set;for(let a of Ka){let o=Ra(e.spalten,t[a].spalte);r[a]=o,n[a]=o===-1?null:this.gegebeneZahl(e,o),o!==-1&&i.add(a)}let a=$a(t,n,i);a&&(this._gerechnet={index:r[a.platz],wert:Qa(a.wert,t[a.platz].runden.stellen)})}tippe(e,t){this.getippt.set(e,t),this._tippSpalte=e,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}verlasse(e){this._tippSpalte===e&&(this._tippSpalte=-1,this._listeZu=!1,this._listeAuf=-1,this._marke=0,this._markeVonHand=!1)}entscheideTaste(e,t,n){let r=this._tippSpalte===t&&this._vorschlaege.length>0;if(n===`Tab`){if(r&&(this._markeVonHand||this._vorschlaege.length===1))n=`Enter`;else return`weiter`}if(n===`F4`)return K(e,t).art===`frei`||this.eintraege(e,t).length===0?`nichts`:`fenster`;let i=this.wertVon(e,t);if(n===`Escape`&&!r)return i===``?`nichts`:`leeren`;if(K(e,t).art===`frei`)return n===`Enter`?`weiter`:`nichts`;if(n===`ArrowDown`&&!r)return K(e,t).art===`verknuepft`?`liste-auf`:`nichts`;let a=Oi(n,{listeOffen:r,feldLeer:i===``,treffer:this._vorschlaege.length,markeVonHand:this._markeVonHand});if(a===`marke-hoch`||a===`marke-runter`){let e=a===`marke-hoch`?-1:1;this._marke=Ei(this._marke,this._vorschlaege.length,e),this._markeVonHand=!0}else if(a===`liste-zu`)this._listeZu=!0,this._listeAuf=-1;else if(a===`fenster`&&i===``)return`weiter`;else if(a===`fenster`&&this.eintraege(e,t).length===0)return`weiter`;else if(a===`nichts`&&n===`Enter`&&i!==``&&(this.getippt.get(t)===void 0||K(e,t).art!==`verknuepft`))return`weiter`;return a}oeffneListe(e){this._tippSpalte=e,this._listeZu=!1,this._listeAuf=e,this._marke=0,this._markeVonHand=!0}naechsteLeere(e,t){for(let n=t+1;n<e.spalten.length;n++)if(e.spalten[n]?.versteckt!==!0&&this.wertVon(e,n)===``)return n;return-1}nachbarPlatz(e,t,n){for(let r=t+n;r>=0&&r<e.spalten.length;r+=n)if(e.spalten[r]?.versteckt!==!0)return r;return-1}leere(e,t){this.getippt.delete(t);let n=K(e,t);n.quelleId!==``&&this.gewaehlt.has(n.quelleId)&&this.setze(e,n.quelleId,void 0),this._listeZu=!1,this._marke=0,this._markeVonHand=!1}setzeMarke(e){this._marke=e}uebernimm(e,t,n){let r=K(e,t);if(r.quelleId!==``){if(this.setze(e,r.quelleId,n),this.vonHand.add(r.quelleId),r.art===`eigen`)for(let t of[...this.gewaehlt.keys()])t!==r.quelleId&&this.setze(e,t,void 0);this.gleicheAb(e),this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1}}setze(e,t,n){n===void 0?(this.gewaehlt.delete(t),this.vonHand.delete(t)):this.gewaehlt.set(t,n);for(let n=0;n<e.spalten.length;n++)lo(e.spalten[n],e.quelleId).quelleId===t&&this.getippt.delete(n)}schluesselWert(e,t,n,r){if(t!==``&&t!==e.quelleId){let e=this.gewaehlt.get(t);return e===void 0?void 0:j(e,n)}let i=this.gewaehlt.get(e.quelleId);if(i!==void 0)return j(i,n);for(let t of uo(e)){if(t===r||!this.vonHand.has(t))continue;let i=e.partnerVon(t);if(i!==``&&i!==e.quelleId)continue;let a=this.gewaehlt.get(t);if(a!==void 0)for(let r of e.paareZu(t)){if(r.fromField!==n)continue;let e=j(a,r.toField);if(e!==``)return e}}}moegliche(e,t,n){let r=e.partnerVon(t);return mo(e.paareZu(t),n=>this.schluesselWert(e,r,n,t),n)}gleicheAb(e){let t=uo(e);for(let n=0;n<=t.length;n++){let n=!1;for(let r of t){let t=e.paareZu(r);if(t.length===0)continue;let i=e.partnerVon(r),a=this.gewaehlt.get(r);if(a!==void 0){t.every(t=>{let n=this.schluesselWert(e,i,t.fromField,r);return n===void 0||n!==``&&n===j(a,t.toField)})||(this.setze(e,r,void 0),n=!0);continue}if(!t.some(t=>this.schluesselWert(e,i,t.fromField,r)!==void 0))continue;let o=sc(r);if(o===null)continue;let s=this.moegliche(e,r,o);s.length===1&&(this.setze(e,r,s[0]),this.vonHand.delete(r),n=!0)}if(!n)break}}uebernimmWerte(e,t){this.zuruecksetzen(),t.forEach((e,t)=>{e!==``&&this.getippt.set(t,e)}),this.gibDemGerechnetenPlatzSeineLuecke(e),this.rechne(e)}gibDemGerechnetenPlatzSeineLuecke(e){let t=e.rechnung;if(t)for(let n of Ka){let r=Ra(e.spalten,t[n].spalte);if(r===-1)continue;let i=this.getippt.get(r);if(i!==void 0&&i!==``){if(this.getippt.delete(r),this.rechne(e),this._gerechnet?.index===r&&this._gerechnet.wert===i)return;this.getippt.set(r,i)}}}zuruecksetzen(){this.getippt.clear(),this.gewaehlt.clear(),this.vonHand.clear(),this._gerechnet=null,this._tippSpalte=-1,this._marke=0,this._markeVonHand=!1,this._listeZu=!1,this._listeAuf=-1,this._vorschlaege=[]}aktualisiereVorschlaege(e){this.rechne(e),this._vorschlaege=this.berechne(e),this._marke=Di(this._marke,this._vorschlaege.length)}berechne(e){let t=this._tippSpalte;if(this._listeZu||K(e,t).art===`frei`)return[];let n=this.getippt.get(t)??``;return n===``?this._listeAuf===t?this.eintraege(e,t).slice(0,8):[]:Ti(this.eintraege(e,t),n)}eintraege(e,t){let n=K(e,t);if(n.art!==`verknuepft`||n.quelleId===``||n.code===``)return[];let r=sc(n.quelleId);return r===null?[]:ac(this.moegliche(e,n.quelleId,r),fo(e,t)?.code??``,n.code)}},Po=class{constructor(){this.lauf=new No,this._zeilen=[],this.naechsteKennung=1,this._zurueck=null}get korrekturPlatz(){return this._zurueck===null?null:this._zurueck.platz}get zeilen(){return this._zeilen.map(e=>e.werte)}get obenKennung(){return`e${this.naechsteKennung}`}vormerkungen(e){let t=this._zeilen.filter(e=>e.geschrieben!==!0).map(e=>({kennung:e.kennung,werte:e.werte})),n=e.spalten.map((t,n)=>this.lauf.wertVon(e,n));if(n.every(e=>e===``))return t;let r=this._zurueck;if(!r)return[...t,{kennung:this.obenKennung,werte:n}];let i=this._zeilen.slice(0,r.platz).filter(e=>e.geschrieben!==!0).length;return[...t.slice(0,i),{kennung:r.kennung,werte:n},...t.slice(i)]}istGeschrieben(e){return this._zeilen[e]?.geschrieben===!0}get schluessel(){return this._zeilen.map(e=>e.kennung)}umfeld(e,t,n,r=null){let i=pa(e);return{spalten:t,quelleId:n,paareZu:e=>i.find(t=>t.quelleId===e)?.keyPairs??[],partnerVon:e=>i.find(t=>t.quelleId===e)?.partnerId??``,rechnung:r}}erfasse(e){this.lauf.rechne(e);let t=e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),n=this._zurueck;return t.every(e=>e===``)?n?(this._zurueck=null,this.lauf.zuruecksetzen(),!0):!1:(n?(this._zeilen=[...this._zeilen.slice(0,n.platz),{kennung:n.kennung,werte:t},...this._zeilen.slice(n.platz)],this._zurueck=null):(this._zeilen=[...this._zeilen,{kennung:this.obenKennung,werte:t}],this.naechsteKennung+=1),this.lauf.zuruecksetzen(),!0)}zurueckholen(e,t){let n=this._zeilen[t];if(!n||n.geschrieben===!0)return!1;this.erfasse(e);let r=this._zeilen.indexOf(n);return r!==-1&&(this._zeilen=this._zeilen.filter((e,t)=>t!==r),this._zurueck={kennung:n.kennung,platz:r},this.lauf.uebernimmWerte(e,n.werte),!0)}entferne(e){return e<0||e>=this._zeilen.length?!1:(this._zeilen=this._zeilen.filter((t,n)=>n!==e),this._zurueck!==null&&e<this._zurueck.platz&&(this._zurueck={...this._zurueck,platz:this._zurueck.platz-1}),!0)}markiereGeschrieben(e,t){if(t.length===0)return!1;let n=!1;this._zeilen=this._zeilen.map(e=>e.geschrieben===!0||!t.includes(e.kennung)?e:(n=!0,{...e,geschrieben:!0}));let r=this._zurueck;if(r!==null&&t.includes(r.kennung))this._zeilen=[...this._zeilen.slice(0,r.platz),{kennung:r.kennung,werte:e.spalten.map((t,n)=>this.lauf.wertVon(e,n)),geschrieben:!0},...this._zeilen.slice(r.platz)],this._zurueck=null,this.lauf.zuruecksetzen(),n=!0;else if(r===null&&t.includes(this.obenKennung)){let t=e.spalten.map((t,n)=>this.lauf.wertVon(e,n));t.every(e=>e===``)||(this._zeilen=[...this._zeilen,{kennung:this.obenKennung,werte:t,geschrieben:!0}],this.naechsteKennung+=1,this.lauf.zuruecksetzen(),n=!0)}return n}vergissGeschriebene(){let e=this._zeilen.filter(e=>e.geschrieben!==!0);return e.length!==this._zeilen.length&&(this._zeilen=e,!0)}zuruecksetzen(){this._zeilen=[],this._zurueck=null,this.lauf.zuruecksetzen()}},Fo=o`
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

         Ein Klick macht sie AN ORT UND STELLE wieder zur Tipp-Zeile,
         darum der Zeigefinger. Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie
         an der gebuchten Zeile: absolut rechts, erst bei Hover. Vorher sass
         es mitten in der ERSTEN Zelle und schob deren Wert um rund 20px nach
         rechts — die erfasste Zeile stand darum sichtbar versetzt unter den
         gebuchten (Nutzer-Befund 2026-08-28). */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`;function Io(e){return{rohzeilen:e.map(e=>e.rohzeile),datenzeilen:e.map(e=>[...e.zellen])}}function Lo(e,t,n){return t===``||n===``?[...e]:e.filter(e=>ei(j(e,t))===n)}function Ro(e){let t=e.getAttribute(`source`)??``;if(t===``)return null;let n=A(R().FF_DATA_SOURCES,t);return n?{quelle:n,zeilen:Lo(Nt(R().SEDATA,n.name,n.tableId,n.offenerSatz),e.getAttribute(`tagfield`)??``,ai()),lies:ma(e)}:null}function zo(e){return Ha(e.getAttribute(`spalten`)??``)}function Bo(e,t){let n=A(R().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return n?Ot(n,t):``}function Vo(e){let t=A(R().FF_DATA_SOURCES,e.getAttribute(`source`)??``);return t!==void 0&&t.indexField!==``}function Ho(e,t){t&&e.vergissGeschriebene();let n=Ro(e);if(!n){e.datenzeilen=[];return}let r=zo(e),{rows:i,gefiltert:a}=nn(e,n.zeilen),o=Yt(P(e),i,e=>e)[0]??-1,s=n.lies;e.datenGeliefert=!0,e.rohzeilen=i,e.auswahlIndex=o,e.durchAuswahlGefiltert=a,e.datenzeilen=i.map(e=>r.map(t=>t.feld===``?``:s(e,t.feld)))}var Uo=la({hydriere:Ho}),Wo=Uo.connect,Go=Uo.disconnect;function Ko(e,t){let n=[];return e.forEach((e,r)=>{wi(e,t)&&n.push(r)}),n}function qo(e,t){return!e&&t.trim()!==``}function Jo(e,t,n){return e&&t&&n===0}function Yo(e){if(!e.hatQuelle)return`— Datensätze`;let t=e.auswahlAktiv?` · durch Auswahl gefiltert`:``,n=e=>e===1?`Datensatz`:`Datensätze`,r=e=>e===1?`Datensatz`:`Datensätzen`;return e.suchtAktiv?e.sichtbar===0?`Kein Treffer von ${e.gesamt} ${r(e.gesamt)}`+t:`${e.sichtbar} von ${e.gesamt} ${r(e.gesamt)}`+t:(e.gesamt===0?`Keine Datensätze`:`${e.gesamt} ${n(e.gesamt)}`)+t}function Xo(e){return La([...e,Ia(e.length)])}function Zo(e,t,n){let r=no(e);if(!r)return null;let i=new Set(n.map(e=>e.kennung)),a=ro(r,t.map(e=>e.kennung).filter(e=>e!==``&&!i.has(e)));return a===r?null:io(a)}function Qo(e,t){return e.length<=1||t<0||t>=e.length?e:e.filter((e,n)=>n!==t)}function $o(e,t,n){if(t<0||t>=e.length)return e;let r=Math.max(0,Math.min(n,e.length-1));if(r===t)return e;let i=[...e],[a]=i.splice(t,1);return i.splice(r,0,a),i}var es=`\0`;function ts(e,t){return e+es+String(t)}var ns=class{constructor(){this.werte=new Map}setze(e,t,n){if(e===``)return!1;let r=ts(e,t);return this.werte.get(r)!==n&&(this.werte.set(r,n),!0)}nimmZurueck(e,t){return this.werte.delete(ts(e,t))}wert(e,t){return e===``?void 0:this.werte.get(ts(e,t))}get anzahl(){return this.werte.size}proSatz(){let e=[];for(let[t,n]of this.werte){let[r,i]=t.split(es),a=Number(i),o=e.find(e=>e.satz===r),s={satz:r,spalte:a,wert:n};o?o.aenderungen.push(s):e.push({satz:r,aenderungen:[s]})}return e}nimmSatzZurueck(e){let t=!1;for(let n of[...this.werte.keys()])n.slice(0,n.indexOf(es))===e&&this.werte.delete(n)&&(t=!0);return t}},rs=class{constructor(e){this.aenderungen=new ns,this.geloescht=new Set,this.wirt=e}get geaenderteZeilen(){if(this.aenderungen.anzahl===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let{satz:r}of this.aenderungen.proSatz()){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}get geloeschteZeilen(){if(this.geloescht.size===0)return[];let e=this.wirt.spalten().length,t=this.satzPlaetze(),n=[];for(let r of this.geloescht){let i=t.get(r);i!==void 0&&n.push({satz:r,werte:Array.from({length:e},(e,t)=>this.zellWert(i,t))})}return n}austragen(e,t){let n=!1;for(let r of t)n=e===`geaendert`?this.aenderungen.nimmSatzZurueck(r)||n:this.geloescht.delete(r)||n;n&&this.wirt.melde()}vorgemerkteAenderungen(){return this.geaenderteZeilen.length}vorgemerkteLoeschungen(){return this.geloeschteZeilen.length}statusVon(e){let t=this.satzVon(e);if(t===``)return{status:`gebucht`,titel:``};if(this.geloescht.has(t))return this.wirt.lauf.zeigt(`geloescht`,t,`loeschung`);let n=this.wirt.spalten().some((e,n)=>this.aenderungen.wert(t,n)!==void 0);return this.wirt.lauf.zeigt(`geaendert`,t,n?`geaendert`:`gebucht`)}satzPlaetze(){let e=new Map;return this.wirt.rohzeilen().forEach((t,n)=>{let r=Bo(this.wirt.baustein,t);r!==``&&!e.has(r)&&e.set(r,n)}),e}satzVon(e){let t=this.wirt.rohzeilen()[e];return t===void 0?``:Bo(this.wirt.baustein,t)}schalteLoeschung(e){let t=this.satzVon(e);t!==``&&(this.geloescht.has(t)?this.geloescht.delete(t):(this.geloescht.add(t),this.wirt.spalten().forEach((e,n)=>{this.aenderungen.nimmZurueck(t,n)})),this.wirt.melde())}istGeloescht(e){let t=this.satzVon(e);return t!==``&&this.geloescht.has(t)}zellWert(e,t){let n=this.aenderungen.wert(this.satzVon(e),t);return n===void 0?this.wirt.datenzeilen()[e]?.[t]??``:n}istGeaendert(e,t){return this.aenderungen.wert(this.satzVon(e),t)!==void 0}tippeZelle(e,t,n){this.aenderungen.setze(this.satzVon(e),t,n)&&this.wirt.melde()}verlasseZelle(e,t,n){let r=this.satzVon(e);(n===(this.wirt.datenzeilen()[e]?.[t]??``)?this.aenderungen.nimmZurueck(r,t):this.aenderungen.setze(r,t,n))&&this.wirt.melde()}zelleNachbar(e,t,n,r){let i=Array.from(this.wirt.baustein.shadowRoot?.querySelectorAll(`.koerper > .zeile:not(.erfassung) .zell-eingabe[data-spalte="${e}"]`)??[]),a=i.indexOf(t);if(a<0)return;let o=a+n;if(o>i.length-1){if(r&&this.wirt.erfassungAn()){this.wirt.fokussiereErfassungsZelle(0);return}o=i.length-1}o<0&&(o=0);let s=i[o];s&&s!==t&&(s.focus(),s.select(),s.scrollIntoView({block:`nearest`}))}tasteZelle(e,t,n){let r=n.target;if(n.key===`Escape`){n.preventDefault(),n.stopPropagation(),this.aenderungen.nimmZurueck(this.satzVon(e),t)&&this.wirt.melde();return}let i={Enter:1,ArrowDown:1,ArrowUp:-1,PageDown:10,PageUp:-10}[n.key];i!==void 0&&(n.preventDefault(),n.stopPropagation(),this.zelleNachbar(t,r,i,n.key===`Enter`))}},is={gebucht:``,erfasst:`Neue Zeile — noch nicht geschrieben`,geaendert:`Geändert — noch nicht geschrieben`,loeschung:`Zum Löschen vorgemerkt — noch nicht geschrieben`,schreibt:`Wird geschrieben …`,geschrieben:`Hinausgeschickt — bleibt stehen, bis neue Daten kommen`,fehler:`Nicht geschrieben`},as=class{constructor(e){this.schreibend=new Map,this.fehler=new Map,this.melde=e}schreibt(e,t){this.fehler.get(e)?.delete(t);let n=this.schreibend.get(e)??new Set;n.add(t),this.schreibend.set(e,n),this.melde()}gescheitert(e,t,n){this.schreibend.get(e)?.delete(t);let r=this.fehler.get(e)??new Map;r.set(t,n),this.fehler.set(e,r),this.melde()}fertig(e,t){this.schreibend.get(e)?.clear();let n=this.fehler.get(e);if(n)for(let e of t)n.delete(e);this.melde()}zeigt(e,t,n){let r=this.fehler.get(e)?.get(t);return r===void 0?this.schreibend.get(e)?.has(t)===!0?{status:`schreibt`,titel:is.schreibt}:{status:n,titel:is[n]}:{status:`fehler`,titel:is.fehler+`: `+r}}},os=4;function ss(e){return e??os}function cs(e,t,n){return Math.max(1,Math.floor((e-t)/n))}function ls(e,t,n){let r=cs(e,t,n),i=e-t;return i<n?{passen:r,zeilenHoehe:n}:{passen:r,zeilenHoehe:Math.floor(i/r*100)/100}}function us(e,t){return e===null?null:Math.max(0,e-t)}function ds({sichtbar:e,hatQuelle:t,platzhalterZeilen:n}){return t?{seiten:1,seite:0,zeilen:[...e]}:{seiten:1,seite:0,zeilen:Array.from({length:n},()=>null)}}function fs({sichtbar:e,hatQuelle:t,proSeite:n,wunschSeite:r,platzhalterZeilen:i}){let a=t?Math.max(1,Math.ceil(e.length/n)):1,o=Math.min(Math.max(r,0),a-1);return t?{seiten:a,seite:o,zeilen:[...e.slice(o*n,(o+1)*n)]}:{seiten:a,seite:o,zeilen:Array.from({length:i},()=>null)}}function ps(e){if(!e.hasAttribute(`fuellt`))return-1;let t=e.renderRoot.querySelector(`.koerper`);return t instanceof HTMLElement?t.clientHeight:-1}function ms(e){let t=e.renderRoot.querySelector(`.kopf`);return t instanceof HTMLElement?t.offsetHeight:0}function hs(e,t){let n=ps(e);if(n===-1)return{mass:null,hoehe:n,kopf:0};let r=ms(e);return{mass:ls(n,r,t),hoehe:n,kopf:r}}function gs(e,t){if(typeof ResizeObserver>`u`)return null;let n=e.renderRoot.querySelector(`.koerper`);if(!n)return null;let r=new ResizeObserver(t);return r.observe(n),r}var _s=`ff-zeile-aktiviert`,vs=`data-ff-roh`;function ys(e,t){e.dispatchEvent(new CustomEvent(_s,{detail:t,bubbles:!0,composed:!0}))}function bs(e){let t=e?.activeElement;if(!(t instanceof HTMLElement))return;let n=t.closest(`.zeile`);if(!n)return;let r=n.getAttribute(vs);return r===null||r===``?null:Number(r)}function xs(e,t){if(!(e instanceof HTMLElement))return!1;let n=e.closest(`.zeile`),r=n?.parentElement;if(!n||!r)return!1;let i=[...r.querySelectorAll(`.zeile[${vs}]`)],a=i.indexOf(n),o=a===-1?void 0:i[a+t];return o?(o.focus(),o.scrollIntoView?.({block:`nearest`}),!0):!1}function Ss(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.zeile[${vs}]`);return t?(t.focus(),!0):!1}function Cs(e){if(!(e instanceof HTMLElement))return!1;let t=e.closest(`.tabelle`)?.querySelector(`.suchzeile input`);return t?(t.focus(),!0):!1}function ws(e,t){e&&((t===null?null:e.querySelector(`.zeile[data-ff-roh="${t}"]`))??e.querySelector(`.zeile[data-ff-roh]`)??e.querySelector(`.koerper`))?.focus()}var Ts=class{constructor(e){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this._seite=0,this._mass=null,this._beobachter=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0,this._fokusZeile=null,this._fokusHolen=!1,this.wirt=e}get suchtext(){return this._suchtext}get suchtAktiv(){return this._suchtext.trim()!==``}get sortSpalte(){return this._sortSpalte}get sortAuf(){return this._sortAuf}get seite(){return this._seite}get mass(){return this._mass}setzeSuchtext(e){this.merkeZeilenFokus(),this._suchtext=e,this._seite=0,this.wirt.melde()}klickSortiere(e){this.wirt.editable()||(this.merkeZeilenFokus(),this._sortSpalte===e?this._sortAuf=!this._sortAuf:(this._sortSpalte=e,this._sortAuf=!0),this._seite=0,this.wirt.melde())}blaettere(e){this.merkeZeilenFokus(),this._seite=e,this.wirt.melde()}fokussiereSuche(){let e=this.wirt.baustein.shadowRoot?.querySelector(`.suchzeile input`);return e?(e.focus(),!0):!1}merkeZeilenFokus(){let e=bs(this.wirt.baustein.shadowRoot);this._fokusHolen=e!==void 0,this._fokusZeile=e??null}messeRumpf(){let e=this.wirt.zeilenHoehe();this._taktGemessen=e;let{mass:t,hoehe:n,kopf:r}=hs(this.wirt.baustein,e);this._rumpfGemessen=n,this._kopfGemessen=r,(t?.passen!==this._mass?.passen||t?.zeilenHoehe!==this._mass?.zeilenHoehe)&&(this._mass=t,this.wirt.melde())}beobachte(){this._beobachter||(this._beobachter=gs(this.wirt.baustein,()=>this.messeRumpf()),this._beobachter&&this.messeRumpf())}nachRendern(){(this._taktGemessen!==this.wirt.zeilenHoehe()||this._rumpfGemessen!==ps(this.wirt.baustein)||this._kopfGemessen!==ms(this.wirt.baustein))&&this.messeRumpf(),this._fokusHolen&&(this._fokusHolen=!1,ws(this.wirt.baustein.shadowRoot,this._fokusZeile))}loese(){this._beobachter?.disconnect(),this._beobachter=null}nachPush(){this._seite=0,this._mass=null,this._taktGemessen=0,this._rumpfGemessen=-1,this._kopfGemessen=0}zuruecksetzen(){this._suchtext=``,this._sortSpalte=-1,this._sortAuf=!0,this.nachPush(),this._fokusZeile=null,this._fokusHolen=!1}};function Es(e,t,n,r){if(n===null||e.hasAttribute(`data-ff-editor`))return;let i=t[n];if(i===void 0)return;let a=e,o=a.auswahlIndex===n;a.auswahlIndex=o?-1:n;let s=P(e);o?(s!==``&&Qt(s),ys(e,{rohzeile:i,rohIndex:-1,ansichtIndex:r})):(s!==``&&Zt(s,i,!0),ys(e,{rohzeile:i,rohIndex:n,ansichtIndex:r}),V(e,`onRowClick`,{PINDEX:Bo(e,i)}).catch(B))}function Ds(e,t,n){if(n===null||e.hasAttribute(`data-ff-editor`))return;let r=t[n];r!==void 0&&V(e,`onRowDblClick`,{PINDEX:Bo(e,r)}).catch(B)}var Os={prop:`spalten`,titelKey:`titel`,feldKey:`feld`,kennungKey:`kennung`,standardTitel:Pa,eintragNeu:e=>{let t=W(e.spalten);return t.length>=16?{}:{spalten:Xo(t)}},eintragWeg:(e,t)=>{let n=W(e.spalten),r=Qo(n,t);if(r===n)return{};let i=Zo(e.rechnung,n,r);return{spalten:[...r],...i===null?{}:{rechnung:i}}},eintragVerschieben:(e,t,n)=>{let r=W(e.spalten),i=$o(r,t,n);return i===r?{}:{spalten:[...i]}},eintragStellen:`[data-ff-eintrag]`,eintragsSchalter:[{key:`summe`,label:`Summe in der Fußzeile`,kurz:`Summe`},{key:`aenderbar`,label:`In der Zeile änderbar`,kurz:`änderbar`,standard:!0,nurEigeneQuelle:!0},{key:`versteckt`,label:`In der Maske ausblenden`,kurz:`ausgeblendet`}],herkunftProp:`spaltenHerkunft`,eintragsFeldWahl:[{key:`fuellFeld`,label:`Nachschlagen`,hinweis:`Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.`,nurFremdeQuellen:!0}]};function ks(e){let t=e,n=Os.eintragsSchalter?.find(e=>e.key===`aenderbar`);return n!==void 0&&e.feld!==``&&Li(Os,t).includes(n)&&Ii(n,t)}var As=`ff_spaltenwahl_`,js=new Map;function Ms(e){let t=typeof document>`u`?``:document.title,n=e.getAttribute(O);if(n!==null&&n!==``)return`${As}${t}|${n}`;let r=Array.from(e.ownerDocument?.querySelectorAll(e.tagName)??[]);return`${As}${t}|#${Math.max(0,r.indexOf(e))}`}function Ns(e){let t=js.get(e);if(t)return new Set(t);try{let t=localStorage.getItem(e);if(t===null)return new Set;let n=JSON.parse(t);return Array.isArray(n)?new Set(n.filter(e=>typeof e==`string`)):new Set}catch{return new Set}}function Ps(e,t){let n=[...t];js.set(e,n);try{n.length===0?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(n))}catch{}}function Fs(e,t){if(e===null)return x;let n=e.waehlbar.filter(t=>!e.weg.has(t.kennung)).length;return y`<div class="sw-schirm" @pointerdown=${t.schliesse}></div>
    <div
      class="spaltenwahl"
      role="dialog"
      aria-label="Spalten zeigen oder verbergen"
      style="left: ${e.links}px; top: ${e.oben}px"
      @pointerdown=${e=>e.stopPropagation()}
      @contextmenu=${e=>e.preventDefault()}
    >
      <p class="sw-titel">Spalten</p>
      ${e.waehlbar.map(r=>{let i=!e.weg.has(r.kennung),a=i&&n<=1;return y`<button
          class=${i?`sw-zeile an`:`sw-zeile`}
          type="button"
          role="menuitemcheckbox"
          aria-checked=${i?`true`:`false`}
          ?disabled=${a}
          title=${a?`Die letzte Spalte bleibt stehen.`:``}
          @click=${()=>t.schalte(r.kennung)}
        ><span class="sw-haken">${i?`✓`:``}</span>${r.titel}</button>`})}
      ${e.weg.size===0?x:y`<button
        class="sw-alle"
        type="button"
        @click=${t.alleZeigen}
      >Alle zeigen</button>`}
    </div>`}function Is(e,t,n){let r=0,i=0;for(let t of e){let e=Do(t);e!==null&&(r+=e,i++)}return i===0?``:r.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:n})}var Ls={min:0,max:3};function Rs(e,t){let n=[];return e.spalten.forEach((r,i)=>{if(r.summe!==!0)return;let a=Is(t.map(t=>e.wertVon(t,i)),Ls.min,Ls.max);a!==``&&n.push({titel:r.titel,text:a})}),n}function zs(e){return e.datenzeilen.map((t,n)=>e.spalten.map((t,r)=>e.wertVon(n,r)))}function Bs(e){let t=zs(e),n=Ko(t,e.suchtext);return e.sortSpalte<0?n:Mo(n.map(e=>t[e]),e.sortSpalte,e.sortAuf).map(e=>n[e])}function Vs(e){let t=e.gezeichnet??e.spalten,n=e.plaetze??t.map((e,t)=>t),r={gridTemplateColumns:Ua(t,t=>e.breiteVon?.(n[t]??t))},i=e.gemessen?.zeilenHoehe??28,a=e.hatQuelle,o=!e.erfassungAn&&Jo(a,e.datenGeliefert,e.datenzeilen.length),s=Bs(e),c=e.erfassungAn?1+e.erfassteAnzahl:0,l=e.gemessen===null?null:Math.max(1,e.gemessen.passen-c),u={sichtbar:s,hatQuelle:a,proSeite:l??Math.max(1,10-c),wunschSeite:e.wunschSeite,platzhalterZeilen:ss(l)},{seiten:d,seite:f,zeilen:p}=e.blaettert?fs(u):ds(u);return{cols:r,takt:28,zeilenHoehe:i,hatQuelle:a,leer:o,gesamt:s.length,seiten:d,seite:f,zeilen:p,linealTakte:us(l,p.length),summen:Rs(e,s)}}var Hs=[U(`suche`,`Suchzeile`,`Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.`,{requiresDataSource:!0}),U(`erfassung`,`Erfassungszeile`,`Eine leere Zeile zum Tippen neuer Positionen.`),U(`loeschbar`,`Zeilen löschbar`,`Kreuz an jeder Zeile: merkt sie zum Löschen vor.`,{requiresDataSource:!0}),U(`blaettern`,`Blättern`,`Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.`),U(`kopfzeile`,`Kopfzeile`,`Aus: keine Titelzeile, kein Sortieren per Titelklick.`),U(`spaltenwahl`,`Spaltenwahl`,`In der Maske: Rechtsklick auf eine Spaltenüberschrift nimmt Spalten weg und holt sie zurück. Braucht die Kopfzeile.`),{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.`,kind:`field`},oo()];function Us(e,t){let n=e.seiten>1||e.summen.length>0||e.suchtAktiv||e.auswahlAktiv;return e.leer||!n?x:y`<div class="fusszeile">
    <div class="seiten-info">${Yo({hatQuelle:e.hatQuelle,sichtbar:e.sichtbar,gesamt:e.gesamt,suchtAktiv:e.suchtAktiv,auswahlAktiv:e.auswahlAktiv})}</div>
    ${e.summen.length===0?x:y`<div class="summen">
      ${e.summen.map(e=>y`<span class="summe">
        <span class="summe-titel">${e.titel}</span>
        <b>${e.text}</b>
      </span>`)}
    </div>`}
    ${e.blaettert?y`<div class="seiten-nav">
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
    </div>`:x}
  </div>`}var Ws=/[.*+?^${}()|[\]\\]/g;function Gs(e,t){let n=Ci(t);if(n.length===0||e===``)return e;let r;try{r=RegExp(`(${n.map(e=>e.replace(Ws,`\\$&`)).join(`|`)})`,`ig`)}catch{return e}let i=e.split(r);return i.length<=1?e:y`${i.map((e,t)=>t%2==1?y`<mark>${e}</mark>`:e)}`}function Ks(e,t,n){let r=40-e,i=t-40,a=r>i?0:Math.min(i,Math.max(r,Math.round(n)));return{links:Math.round(e+a),rechts:Math.round(t-a)}}function qs(e,t,n){if(e.button!==0)return;let r=[...e.currentTarget?.parentElement?.children??[]].filter(e=>e instanceof HTMLElement&&e.tagName===`DIV`),i=r[t],a=r[t+1];if(!i||!a)return;e.stopPropagation(),e.preventDefault();let o=e.clientX,s=i.getBoundingClientRect().width,c=a.getBoundingClientRect().width,l=Ks(s,c,0),u=()=>{window.removeEventListener(`pointermove`,p),window.removeEventListener(`pointerup`,ee),window.removeEventListener(`pointercancel`,m),window.removeEventListener(`keydown`,te),window.removeEventListener(`blur`,m)},d=r.map(e=>Math.max(1,Math.round(e.getBoundingClientRect().width))),f=()=>d.map((e,n)=>n===t?{index:n,breite:l.links}:n===t+1?{index:n,breite:l.rechts}:{index:n,breite:e});function p(e){l=Ks(s,c,e.clientX-o),n.zeige(f())}function ee(){u(),n.uebernimm(f())}function m(){u(),n.verwirf()}function te(e){e.key===`Escape`&&(e.preventDefault(),m())}window.addEventListener(`pointermove`,p),window.addEventListener(`pointerup`,ee),window.addEventListener(`pointercancel`,m),window.addEventListener(`keydown`,te),window.addEventListener(`blur`,m)}function Js(e,t){return Array.from({length:Math.max(0,e-1)},(e,n)=>y`<span
    class="breite-griff"
    role="presentation"
    style="grid-row: 1; grid-column: ${n+1}"
    title="Linie ziehen: links breiter, rechts schmaler"
    @pointerdown=${e=>qs(e,n,t)}
    @click=${e=>e.stopPropagation()}
    @dblclick=${e=>e.stopPropagation()}
  ></span>`)}function Ys(e){return e.linealTakte===0?x:y`<div class="lineal" role="presentation" style=${G(e.linealTakte===null?e.cols:{...e.cols,flex:`0 1 auto`,height:`calc(var(--zeilen-hoehe) * ${e.linealTakte})`})}>
          ${e.spalten.map(()=>y`<div></div>`)}
        </div>`}function Xs(e,t){return y`
      ${e.zeigeSuche?y`<div class="suchzeile">
        <input
          type="search"
          placeholder="Tabelle durchsuchen…"
          aria-label="Tabelle durchsuchen"
          .value=${e.suchtext}
          @input=${e=>t.setzeSuchtext(e.target.value)}
          @keydown=${e=>{e.key===`ArrowDown`&&Ss(e.target)&&e.preventDefault()}}
        />
      </div>`:``}
      <div class="koerper" role=${e.leer?x:`table`} tabindex="-1">
      ${e.zeigeKopf?y`<div class="kopf" role="row" style=${G(e.cols)}>
        ${e.spalten.map((n,r)=>y`<div
            class=${n.versteckt===!0?`versteckt`:x}
            role="columnheader"
            data-ff-editable
            data-ff-eintrag=${e.imEditor?e.plaetze[r]:x}
            style="grid-row: 1; grid-column: ${r+1}"
            @click=${()=>t.klickKopf(e.plaetze[r])}
            @contextmenu=${e.spaltenwahlAn?e=>t.oeffneSpaltenwahl(e):x}
          >${n.titel}${!e.editable&&e.sortSpalte===e.plaetze[r]?y`<span class="sort-pfeil">${e.sortAuf?` ▲`:` ▼`}</span>`:``}</div>`)}
        ${Js(e.spalten.length,t.breiten)}
      </div>`:x}
        ${``}
        ${e.leer?so(e.leerText,!0):y`
        ${e.hatQuelle||e.korrekturPlatz!==null?x:e.erfassung}
        ${e.zeilen.map((n,r)=>{let i=n!==null&&!e.imEditor,a=n!==null&&e.zeilenStand.istGeloescht(n),o=n===null?{status:`gebucht`,titel:``}:e.zeilenStand.statusVon(n);return y`<div
            class="zeile${r%2==1?` zebra`:``}${n!==null&&e.hatQuelle?` waehlbar`:``}${n!==null&&n===e.auswahlIndex?` gewaehlt`:``}${a?` geloescht`:``}"
            role="row"
            data-status=${o.status===`gebucht`?x:o.status}
            title=${o.titel===``?x:o.titel}
            data-ff-roh=${n??x}
            tabindex=${i?`0`:x}
            aria-selected=${e.auswahlSemantik&&n!==null?String(n===e.auswahlIndex):x}
            style=${G(e.cols)}
            @click=${()=>{t.aktiviereZeile(n,r)}}
            @dblclick=${e=>{e.target.closest(`.zell-eingabe`)||t.zeileDoppelt(n)}}
            @keydown=${i=>{if(!i.target.closest(`.zell-eingabe, button`)){if(i.key===`ArrowDown`||i.key===`ArrowUp`){let e=i.key===`ArrowUp`;(xs(i.target,e?-1:1)||e&&Cs(i.target))&&i.preventDefault();return}if(i.key===`Delete`&&e.loeschbar&&n!==null&&!e.imEditor){i.preventDefault(),t.schalteLoeschung(n);return}i.key===`Enter`&&(i.preventDefault(),t.aktiviereZeile(n,r))}}}
          >
            ${``}
            ${e.spalten.map((t,i)=>{let a=e.plaetze[i],o=n===null?`—`:e.datenzeilen[n]?.[a]??``,s=e.imEditor&&!e.zeigeKopf&&e.editable;if(e.aendernMoeglich&&n!==null&&ks(t)){let r=e.zeilenStand;return y`<div class="tippbar" role="cell">
                <input
                  class=${r.istGeaendert(n,a)?`zell-eingabe geaendert`:`zell-eingabe`}
                  type="text"
                  data-spalte=${a}
                  aria-label=${t.titel}
                  .value=${r.zellWert(n,a)}
                  @input=${e=>r.tippeZelle(n,a,e.target.value)}
                  @blur=${e=>r.verlasseZelle(n,a,e.target.value)}
                  @keydown=${e=>r.tasteZelle(n,a,e)}
                />
              </div>`}return y`<div
                class=${t.versteckt===!0?`versteckt`:x}
                role="cell"
                data-ff-editable=${s?``:x}
                data-ff-eintrag=${s&&r===0?a:x}
              >${Gs(o,e.suchtext)}</div>`})}
            ${e.loeschbar&&n!==null&&!e.imEditor?y`<button
                  class="zeile-weg"
                  type="button"
                  title=${a?`Löschen zurücknehmen`:`Diese Position zum Löschen vormerken`}
                  aria-label=${a?`Löschen zurücknehmen`:`Position zum Löschen vormerken`}
                  @click=${e=>{e.stopPropagation(),t.schalteLoeschung(n)}}
                >${a?`↺`:`✕`}</button>`:x}
            ${e.loeschbar&&e.imEditor?y`<span
                  class="zeile-weg zeile-weg-anzeige"
                  title="Zeilen l\u00F6schbar \u2014 in der Maske per Kreuz oder Entf-Taste"
                >&#x2715;</span>`:x}
          </div>`})}
        ${e.erfasste.map((n,r)=>{let i=e.erfasstStand(r),a=i.status===`geschrieben`;return y`${r===e.korrekturPlatz?e.erfassung:x}<div
          class="zeile erfasst"
          role="row"
          data-status=${i.status}
          title=${e.imEditor||a?i.titel:`${i.titel} — zum Korrigieren anklicken`}
          style=${G(e.cols)}
          @click=${e.imEditor||a?x:()=>t.holeErfassteZeile(r)}
        >
          ${e.spalten.map((t,r)=>y`<div role="cell">${n[e.plaetze[r]]??``}</div>`)}
          ${e.imEditor?x:y`<button
              class="zeile-weg"
              type="button"
              title=${a?`Aus der Ansicht nehmen — geschrieben ist sie schon`:`Diese erfasste Zeile wieder wegnehmen`}
              aria-label="Erfasste Zeile wegnehmen"
              @click=${e=>{e.stopPropagation(),t.nimmErfassteZeile(r)}}
            >&#x2715;</button>`}
        </div>`})}
        ${e.korrekturPlatz!==null&&e.korrekturPlatz>=e.erfasste.length?e.erfassung:x}
        ${e.hatQuelle&&e.korrekturPlatz===null?e.erfassung:x}
        ${Ys(e)}`}
      </div>
      ${Fs(e.spaltenwahl,t.spaltenwahl)}
    `}var Zs=o`
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
      .zeile:focus-visible,
      .koerper > .zeile.gewaehlt:not([data-status]):hover,
      .koerper > .zeile:not([data-status]):focus-visible:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div,
      .zeile:focus-visible > div { color: var(--se-ink); }
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
      /* Die letzte ZELLE, nicht das letzte Kind: hinter den Zellen stehen noch
         die Greifstreifen (Kopf) bzw. das Loeschkreuz (Zeile). Mit
         :last-child traf die Regel dann gar nichts mehr, und die letzte Spalte
         behielt ihren Trennstrich vor der Tafelkante. */
      .kopf > div:last-of-type,
      .zeile > div:last-of-type { border-right: none; }
      .kopf > div {
        cursor: pointer;
        user-select: none;

        /* Traeger des Greifstreifens (unten). */
        position: relative;
      }

      /* Der Greifstreifen ist ein eigenes Kind der Kopfzeile und sitzt in
         derselben Gitter-Spur wie die Kopfzelle links von ihm (grid-column am
         Element). justify-self haelt ihn an deren Ende, der negative Rand
         schiebt ihn ueber die Linie: 11px breit, 6px links und 5px rechts.
         Eine 1px-Linie trifft man mit der Maus nicht — und wer sie anvisiert,
         zielt auf die Mitte, nicht 5px daneben.

         Er liegt bewusst NICHT in der Kopfzelle (die schneidet ihren
         Ueberhang ab, overflow: hidden — samt Trefferflaeche) und auch nicht
         in einer eigenen Lage darueber: eine Lage braucht inset oder vier
         Kanten und einen zweiten Satz Spalten-Spuren. So haengt er an genau
         derselben Gitter-Rechnung wie der Kopf und braucht nichts, was die
         Tabelle nicht ohnehin schon braucht. */
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

      /* Nur im Editor: diese Spalte zeichnet die Maske nicht. Gedaempft, aber
         voll bedienbar — sie ist eine echte Spalte (Rechnung, Kette). */
      :host([data-ff-editor]) .versteckt { opacity: 0.45; }

      /* Die Spaltenwahl des Bedieners (Rechtsklick am Kopf). Sie liegt IN der
         Tabelle: die schneidet ihren Ueberhang ab (overflow: hidden), ein
         Fenster ausserhalb waere also gar nicht zu sehen. Der Platz kommt
         darum schon eingerechnet aus dem Baustein. */
      .sw-schirm {
        position: absolute;
        inset: 0;
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

      /* Im Editor steht das Kreuz still da: es zeigt, dass Loeschen an ist. */
      .zeile-weg.zeile-weg-anzeige { opacity: 1; cursor: default; }

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
`,Qs=new Set,q=class extends D{constructor(...e){super(...e),this.spalten=za(),this.source=``,this.suche=`ja`,this.erfassung=`nein`,this.blaettern=`ja`,this.loeschbar=`nein`,this.kopfzeile=`ja`,this.spaltenwahl=`nein`,this.leerText=ao,this.rechnung=``,this.datenzeilen=[],this.rohzeilen=[],this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this.datenGeliefert=!1,this._besitz=`softengine`,this._breiten=new Map,this._breiteVorZug=null,this._ansicht=new Ts({baustein:this,editable:()=>this.editable,zeilenHoehe:()=>this.zeilenHoehe,melde:()=>this.requestUpdate()}),this._erfassung=new Po,this._lauf=new as(()=>this.requestUpdate()),this._zeilen=new rs({baustein:this,spalten:()=>this.spaltenListe(),rohzeilen:()=>this.rohzeilen,datenzeilen:()=>this.datenzeilen,melde:()=>this.requestUpdate(),lauf:this._lauf,erfassungAn:()=>this.erfassungAn,fokussiereErfassungsZelle:e=>this.fokussiereErfassungsZelle(e)}),this.nimmSeFokus=e=>{!e.defaultPrevented&&this.erfassungAn&&(this.imEditor||(e.preventDefault(),this.fokussiereErfassungsZelle(0)))},this._wahlWeg=null,this._wahlOffen=null,this.nimmWahlTaste=e=>{e.key===`Escape`&&this.schliesseSpaltenwahl()}}static{this.blockType=`tabelle`}static{this.tagName=`ff-tabelle`}static{this.displayName=`Tabelle`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.kannAuswahlFolgen=!0}static{this.kannErfassen={wenn:{attributeName:`erfassung`,equals:`ja`}}}static{this.aenderungsSchluessel=`aenderbar`}static{this.kannLoeschen={wenn:{attributeName:`loeschbar`,equals:`ja`}}}static{this.blockEvents=[{key:`onRowClick`,name:`Zeile gewählt`},{key:`onRowDblClick`,name:`Zeile doppelt geklickt`}]}static{this.listenBindung=Os}static{this.defaultProps={width:`fill`,source:``,spalten:za(),suche:`ja`,erfassung:`nein`,blaettern:`ja`,loeschbar:`nein`,kopfzeile:`ja`,spaltenwahl:`nein`,tagField:``,rechnung:``,leerText:ao}}static{this.customProperties=Hs}static{this.raster={startW:14,startH:8,minW:6,minH:4}}get besitz(){return this._besitz}set besitz(e){e!==this._besitz&&(this._besitz=e,this.setzeAbgeleitetesZurueck(),this.isConnected&&(e===`provided`?Go(this):Wo(this)),this.requestUpdate())}set bereitgestellteZeilen(e){let t=Io(e);this.rohzeilen=t.rohzeilen,this.datenzeilen=t.datenzeilen,this.datenGeliefert=!0,this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this._ansicht.nachPush(),this.requestUpdate()}setzeAbgeleitetesZurueck(){this.rohzeilen=[],this.datenzeilen=[],this.datenGeliefert=!1,this.auswahlIndex=-1,this.durchAuswahlGefiltert=!1,this._ansicht.zuruecksetzen(),this._erfassung.zuruecksetzen()}get erfassteZeilen(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.werte)}get erfassteSchluessel(){return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map(e=>e.kennung)}get geaenderteZeilen(){return this._zeilen.geaenderteZeilen}get geloeschteZeilen(){return this._zeilen.geloeschteZeilen}zeileSchreibt(e,t){this._lauf.schreibt(e,t)}zeileGescheitert(e,t,n){this._lauf.gescheitert(e,t,n)}laufFertig(e,t){if(this._lauf.fertig(e,t),e===`erfasst`){this._erfassung.markiereGeschrieben(this.erfassungsUmfeld(),t)&&this.requestUpdate();return}this._zeilen.austragen(e,t)}vergissGeschriebene(){this._erfassung.vergissGeschriebene()&&this.requestUpdate()}erfasstStand(e){return this._lauf.zeigt(`erfasst`,this._erfassung.schluessel[e]??``,this._erfassung.istGeschrieben(e)?`geschrieben`:`erfasst`)}erfasseZeile(){return this._erfassung.erfasse(this.erfassungsUmfeld())?(this.requestUpdate(),this.fokussiereErfassungsZelle(0),this.zeigeLetzteErfasste(),!0):!1}zeigeLetzteErfasste(){this.updateComplete.then(()=>{let e=this.shadowRoot?.querySelector(`.koerper`);e&&(e.scrollTop=e.scrollHeight)})}fokussiereSuche(){return this._ansicht.fokussiereSuche()}setzeSuchtext(e){this._ansicht.setzeSuchtext(e),this.requestUpdate()}get hatQuelle(){return this._besitz===`provided`||qo(this.imEditor,this.source)}spaltenListe(){return W(this.spalten)}get zeilenHoehe(){return 28}breitenWirt(){let e=e=>Na(this.spaltenListe(),this.imEditor).plaetze[e]??e,t=t=>t.map(t=>({index:e(t.index),breite:t.breite})),n=e=>{this._breiteVorZug===null&&(this._breiteVorZug=new Map(e.map(e=>[e.index,this._breiten.get(e.index)])))};return{zeige:e=>{let r=t(e);n(r);for(let e of r)this._breiten.set(e.index,e.breite);this.requestUpdate()},uebernimm:e=>{let n=t(e);this._breiteVorZug=null;let r=this.spaltenListe();if(!this.imEditor){for(let e of n)this._breiten.set(e.index,e.breite);this.requestUpdate();return}for(let e of n)e.index>=r.length||(this._breiten.delete(e.index),r[e.index]={...r[e.index],breite:e.breite});this.aendere(r)},verwirf:()=>{let e=this._breiteVorZug;if(this._breiteVorZug=null,e){for(let[t,n]of e)n===void 0?this._breiten.delete(t):this._breiten.set(t,n);this.requestUpdate()}}}}get erfassungAn(){return this.erfassung===`ja`}erfassungsWirt(){return{baustein:this,lauf:this._erfassung.lauf,umfeld:()=>this.erfassungsUmfeld(),melde:()=>this.requestUpdate(),fokussiere:e=>this.fokussiereErfassungsZelle(e),erfasseZeile:()=>this.erfasseZeile()}}fokussiereErfassungsZelle(e){this.updateComplete.then(()=>{let t=this.shadowRoot?.querySelector(`.zeile.erfassung .erf-eingabe[data-spalte="${e}"]`);t&&(t.focus(),t.scrollIntoView({block:`nearest`}))})}erfassungsUmfeld(){return this._erfassung.umfeld(this,this.spaltenListe(),this.source,no(this.rechnung))}aendere(e){let t=Zo(this.rechnung,this.spaltenListe(),e);if(t===null){this.meldeProp(`spalten`,e);return}this.meldeProp(`rechnung`,t,`beginn`),this.meldeProp(`spalten`,e,`ende`)}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this._besitz===`softengine`&&Wo(this),document.addEventListener(Gn,this.nimmSeFokus),this._ansicht.beobachte()}firstUpdated(){this._ansicht.beobachte()}willUpdate(e){super.willUpdate(e),e.has(`spalten`)&&this._breiten.clear(),this.erfassungAn&&!this.imEditor&&this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())}updated(){this._ansicht.nachRendern(),zr(this)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.nimmWahlTaste),document.removeEventListener(Gn,this.nimmSeFokus),this._ansicht.loese(),_c(this),Go(this)}static{this.styles=[D.styles,co,Zs,Mi,Fo]}get spaltenwahlAn(){return this.spaltenwahl===`ja`&&this.kopfzeile===`ja`&&!this.imEditor}wahlWeg(){return this.spaltenwahlAn?(this._wahlWeg===null&&(this._wahlWeg=Ns(Ms(this))),this._wahlWeg):Qs}oeffneSpaltenwahl(e){e.preventDefault(),e.stopPropagation();let t=this.shadowRoot?.querySelector(`.tabelle`)?.getBoundingClientRect();t&&(this._wahlOffen={links:Math.max(4,Math.min(e.clientX-t.left,Math.max(4,t.width-170))),oben:Math.max(4,Math.min(e.clientY-t.top,Math.max(4,t.height-60)))},window.addEventListener(`keydown`,this.nimmWahlTaste),this.requestUpdate())}schliesseSpaltenwahl(){this._wahlOffen!==null&&(this._wahlOffen=null,window.removeEventListener(`keydown`,this.nimmWahlTaste),this.requestUpdate())}merkeWahl(e){this._wahlWeg=e,Ps(Ms(this),e),this._breiten.clear(),this.requestUpdate()}render(){let e=this.spaltenListe(),t=Na(e,this.imEditor,this.wahlWeg()),n=Vs({spalten:e,gezeichnet:t.spalten,plaetze:t.plaetze,breiteVon:e=>this._breiten.get(e),hatQuelle:this.hatQuelle,datenGeliefert:this.datenGeliefert,datenzeilen:this.datenzeilen,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,wunschSeite:this._ansicht.seite,gemessen:this._ansicht.mass,erfassungAn:this.erfassungAn,erfassteAnzahl:this._erfassung.zeilen.length,wertVon:(e,t)=>this._zeilen.zellWert(e,t),blaettert:this.blaettern===`ja`});return y`<div class="tabelle" style=${G({"--takt":`${n.takt}px`,"--zeilen-hoehe":`${n.zeilenHoehe}px`})}>
      ${Xs({spalten:t.spalten,plaetze:t.plaetze,cols:n.cols,editable:this.editable,imEditor:this.imEditor,zeigeKopf:this.kopfzeile===`ja`,spaltenwahlAn:this.spaltenwahlAn,spaltenwahl:this._wahlOffen===null?null:{waehlbar:e.filter(e=>e.versteckt!==!0),weg:this.wahlWeg(),links:this._wahlOffen.links,oben:this._wahlOffen.oben},auswahlSemantik:P(this)!==``,zeigeSuche:this.suche===`ja`,suchtext:this._ansicht.suchtext,sortSpalte:this._ansicht.sortSpalte,sortAuf:this._ansicht.sortAuf,zeilen:n.zeilen,linealTakte:n.linealTakte,datenzeilen:this.datenzeilen,hatQuelle:n.hatQuelle,auswahlIndex:this.auswahlIndex,aendernMoeglich:!this.imEditor&&n.hatQuelle&&Vo(this),loeschbar:this.loeschbar===`ja`&&!this.imEditor&&n.hatQuelle&&Vo(this),zeilenStand:this._zeilen,leer:n.leer,leerText:this.leerText,erfasste:this._erfassung.zeilen,erfasstStand:e=>this.erfasstStand(e),korrekturPlatz:this.erfassungAn?this._erfassung.korrekturPlatz:null,erfassung:this.erfassungAn?So(this.erfassungsWirt(),n.cols,this._erfassung.korrekturPlatz===null&&(n.linealTakte??1)<=0,t):x},{setzeSuchtext:e=>this._ansicht.setzeSuchtext(e),oeffneSpaltenwahl:e=>this.oeffneSpaltenwahl(e),spaltenwahl:{schalte:e=>{let t=new Set(this.wahlWeg());t.has(e)?t.delete(e):t.add(e),this.merkeWahl(t)},alleZeigen:()=>this.merkeWahl(new Set),schliesse:()=>this.schliesseSpaltenwahl()},breiten:this.breitenWirt(),klickKopf:e=>{this.editable||this._ansicht.klickSortiere(e)},aktiviereZeile:(e,t)=>Es(this,this.rohzeilen,e,t),zeileDoppelt:e=>Ds(this,this.rohzeilen,e),nimmErfassteZeile:e=>{this._erfassung.entferne(e)&&this.requestUpdate()},holeErfassteZeile:e=>{this._erfassung.zurueckholen(this.erfassungsUmfeld(),e)&&(this.requestUpdate(),this.fokussiereErfassungsZelle(0))},schalteLoeschung:e=>this._zeilen.schalteLoeschung(e)})}
      ${Us({hatQuelle:n.hatQuelle,sichtbar:n.gesamt,gesamt:this.datenzeilen.length,suchtAktiv:this._ansicht.suchtAktiv,auswahlAktiv:this.durchAuswahlGefiltert,seite:n.seite,seiten:n.seiten,blaettert:this.blaettern===`ja`,summen:n.summen,erfasst:this.erfassteZeilen.length,geaendert:this._zeilen.vorgemerkteAenderungen(),geloescht:this._zeilen.vorgemerkteLoeschungen(),leer:n.leer},{blaettere:e=>this._ansicht.blaettere(e)})}
    </div>`}};E([w({converter:{fromAttribute:e=>e?Ha(e):za(),toAttribute:e=>JSON.stringify(e)}})],q.prototype,`spalten`,void 0),E([w()],q.prototype,`source`,void 0),E([w()],q.prototype,`suche`,void 0),E([w()],q.prototype,`erfassung`,void 0),E([w()],q.prototype,`blaettern`,void 0),E([w()],q.prototype,`loeschbar`,void 0),E([w()],q.prototype,`kopfzeile`,void 0),E([w()],q.prototype,`spaltenwahl`,void 0),E([w()],q.prototype,`leerText`,void 0),E([w()],q.prototype,`rechnung`,void 0),E([w({attribute:!1})],q.prototype,`datenzeilen`,void 0),E([w({attribute:!1})],q.prototype,`rohzeilen`,void 0),E([w({attribute:!1})],q.prototype,`auswahlIndex`,void 0),E([w({attribute:!1})],q.prototype,`durchAuswahlGefiltert`,void 0),E([w({attribute:!1})],q.prototype,`datenGeliefert`,void 0),D.defineAndRegister(q);function $s(e){return Math.min(900,Math.max(520,160+180*e))}function ec(e){return y`<div class="nachschlag">
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
    >${Ma()}</button>
    ${e.liste}
  </div>`}var tc={prop:`nachschlagSpalten`,titelKey:`titel`,feldKey:`feld`,standardTitel:Pa,quelleProp:`nachschlagQuelle`};function nc(e){if(typeof e==`string`)try{e=JSON.parse(e)}catch{return[]}return Array.isArray(e)&&e.length>0?W(e):[]}function rc(e,t){let n=e[0];return n===void 0?t:n.feld}function ic(e,t){let n=e.trim();return n===``||n===t.trim()}function ac(e,t,n){let r=t.trim(),i=[],a=ic(t,n),o=new Set;for(let t of e){let e=j(t,n).trim(),s=r===``?e:j(t,r).trim();if(s!==``||e!==``){if(a){if(o.has(e))continue;o.add(e)}i.push({anzeige:s,wert:e,satz:t})}}return i}function oc(e,t,n,r){return ac(nn(e,t).rows,n,r)}function sc(e){let t=A(R().FF_DATA_SOURCES,e);return t?Nt(R().SEDATA,t.name,t.tableId,t.offenerSatz):null}function cc(e){if(e.quelleId===``||e.speicherFeld===``)return{ok:!1,grund:`unvollstaendig`};let t=sc(e.quelleId);if(t===null)return{ok:!1,grund:`quelleFehlt`};let n=rc(nc([...e.spalten]),e.speicherFeld);return{ok:!0,eintraege:oc(e.el,t,n,e.speicherFeld)}}function lc(e,t){return t&&e.length===1?e[0]:null}function uc(e,t){let{rows:n,gefiltert:r}=nn(e,[t]);return!r||n.length>0}function dc(e,t,n){return e===``?t===``&&n===``?`nichts`:`leeren`:e===t?`nichts`:`zurueck`}var fc=null,pc=null,mc=null;function hc(e){return e.shadowRoot?.querySelector(`.lupe`)??null}function gc(e=!0){let t=e?mc:null;mc=null,fc?.remove(),fc=null,pc=null,t?.focus()}function _c(e){pc===e&&gc(!1)}function vc(e){return[{kennung:``,titel:e.speicherTitel===``?`Wert`:e.speicherTitel,feld:e.speicherFeld}]}function yc(e){let t=e=>e.stopPropagation(),n=e.editor;return y`<ff-dialog-rahmen
    viewport
    escape-schliesst
    ohne-modal
    inhalt-fest
    ?ziehbar=${n!==void 0}
    ?data-ff-nachschlagen=${n===void 0}
    style=${n===void 0?x:`z-index:40`}
    .titel=${e.titel===``?`Nachschlagen`:e.titel}
    .breite=${e.breite}
    .hoehe=${e.hoehe}
    @ff-dialog-groesse=${n===void 0?x:e=>{e.stopPropagation(),n.onGroesse(e.detail)}}
    @ff-dialog-schliessen=${t=>{n!==void 0&&t.stopPropagation(),e.onSchliessen()}}
    @click=${t}
    @pointerdown=${n===void 0?x:t}
    @dblclick=${n===void 0?x:t}
  >${e.inhalt}</ff-dialog-rahmen>`}function bc(e,t){let n=nc([...e.spalten]),r=ic(rc(n,e.speicherFeld),e.speicherFeld);return y`<ff-tabelle
    fuellt
    suche="ja"
    style="--se-r-lg:0px"
    .besitz=${`provided`}
    .spalten=${n.length>0?n:vc(e)}
    .leerText=${`Diese Quelle hat keine Sätze.`}
    .bereitgestellteZeilen=${t.map(e=>({rohzeile:e.satz,zellen:n.length>0?n.map(t=>t.feld===``?``:j(e.satz,t.feld)):r?[e.wert]:[e.anzeige,e.wert]}))}
  ></ff-tabelle>`}function xc(e){let t=e.eintraege;if(t===void 0){let n=cc(e);if(!n.ok){L(n.grund===`unvollstaendig`?`Nachschlagen braucht an diesem Feld eine Quelle und „Gespeichert wird".`:`Die Nachschlage-Quelle dieses Feldes ist in der Maske nicht vorhanden.`);return}t=n.eintraege}gc(!1);let n=document.createElement(`div`);n.style.display=`contents`,Ve(yc({titel:e.titel,breite:e.breite,hoehe:e.hoehe,inhalt:bc(e,t),onSchliessen:()=>gc()}),n);let r=n.querySelector(an),i=n.querySelector(q.tagName);i?.addEventListener(_s,n=>{let r=n.detail,i=t[r.rohIndex];i&&(gc(),e.onUebernehmen(i.anzeige,i.wert,i.satz))}),mc=e.rueckFokus??hc(e.el),document.body.appendChild(n),fc=n,pc=e.el;let a=e.suchtext??``;i&&a!==``&&i.setzeSuchtext(a),r&&i&&Promise.all([r.updateComplete,i.updateComplete]).then(()=>{r.isConnected&&i.fokussiereSuche()})}function Sc(e){return yc({titel:e.titel,breite:e.breite,hoehe:e.hoehe,onSchliessen:e.onSchliessen,editor:{onGroesse:e.onGroesse},inhalt:y`<ff-tabelle
      data-ff-editor
      fuellt
      suche="ja"
      style="--se-r-lg:0px"
      .spalten=${[...e.spalten]}
      .editable=${!0}
      @ff-prop-change=${t=>{t.stopPropagation();let n=t.detail;n?.attr===`spalten`&&e.onAendern(W(n.value))}}
      @ff-listen-bind=${t=>{t.stopPropagation();let n=t.detail;typeof n?.index==`number`&&e.onFeldWahl({index:n.index,top:n.top??0,left:n.left??0,...Array.isArray(n.liste)?{liste:n.liste}:{}})}}
    ></ff-tabelle>`})}var J=class e extends D{constructor(...e){super(...e),this.fieldType=`text`,this.placeholder=`Feldname`,this.options=``,this.source=``,this.value=``,this.valueField=``,this.nachschlagQuelle=``,this.speicherFeld=``,this.speicherTitel=``,this.nachschlagSpalten=[],this.fensterBreite=520,this.fensterHoehe=380,this.einzigerTreffer=`nein`,this.spaltenDialog=!1,this.anzeige=``,this.getippt=null,this.marke=0,this.markeVonHand=!1,this.listeZu=!1,this.vorschlaege=[],this.satz=void 0,this.angehakt=!1,this.imSteuerelement=!1}static{this.blockType=`formfeld`}static{this.tagName=`ff-formfeld`}static{this.displayName=`Formularfeld`}static{this.category=`eingabe`}static{this.acceptsDataSource={wenn:{attributeName:`fieldType`,notEquals:`nachschlagen`}}}static{this.kannAuswahlFolgen=!0}static{this.satzWahl={quelleProp:`nachschlagQuelle`,wenn:{attributeName:`fieldType`,equals:`nachschlagen`}}}static{this.listenBindung=tc}static{this.bindableSpots=[{prop:`value`,label:`Wert`,wenn:{attributeName:`fieldType`,keinesVon:[`checkbox`,`nachschlagen`]},vorschauProp:`placeholder`}]}static{this.actionValueSpots=[{prop:`value`,label:`Wert`}]}static{this.blockEvents=[{key:`onChange`,name:`Wert geändert`}]}static{this.defaultProps={width:240,fieldType:`text`,placeholder:`Feldname`,options:``,source:``,value:``,valueField:``,nachschlagQuelle:``,speicherFeld:``,speicherTitel:``,nachschlagSpalten:[],fensterBreite:520,fensterHoehe:380,einzigerTreffer:`nein`}}static{this.raster={startW:6,startH:2,minW:2,minH:2}}static{this.customProperties=Pi}static{this.styles=[D.styles,Da,Mi]}onInput(e){let t=e.target;this.value=ka(this.fieldType)===`date`?ya(t.value):t.value}onChange(){this.dispatchEvent(new Event(`change`))}textTpl(e,t=!1,n=!1){return y`<span
      class=${e}
      ?hidden=${t}
      ?data-ff-bound=${n}
      data-ff-editable
      @click=${this.onTextClick}
      @dblclick=${e=>this.inlineEdit(e,`placeholder`)}
    >${this.placeholder}</span>`}onTextClick(){this.imEditor||this.setzeHaken(!this.angehakt)}setzeHaken(e){this.angehakt!==e&&(this.angehakt=e,this.dispatchEvent(new Event(`change`)))}controlTpl(e){switch(e){case`textarea`:return y`<textarea class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}></textarea>`;case`select`:{let e=this.options.split(`,`).map(e=>e.trim()).filter(e=>e!==``),t=this.value!==``&&!e.includes(this.value);return y`<select class="ctrl" .value=${this.value} @input=${this.onInput} @change=${this.onChange}>
          <option value="" disabled hidden></option>
          ${t?y`<option value=${this.value} hidden>${this.value}</option>`:x}
          ${e.length===0?y`<option disabled>(keine Optionen)</option>`:e.map(e=>y`<option value=${e}>${e}</option>`)}
        </select>`}case`nachschlagen`:return ec({wert:this.getippt??this.anzeige,onTippen:e=>{this.getippt=e,this.marke=0,this.markeVonHand=!1,this.listeZu=!1},onTaste:e=>this.onNachschlagTaste(e),onVerlassen:()=>this.onNachschlagVerlassen(),onLupe:()=>this.onLupe(),liste:this.vorschlaege.length===0?x:ji({eintraege:this.vorschlaege,marke:this.marke,onWaehlen:e=>this.uebernimmVorschlag(e),onMarke:e=>{this.marke=e}})});default:return y`<input
          class="ctrl"
          type=${e}
          .value=${e===`date`?va(this.value):this.value}
          @input=${this.onInput}
          @change=${this.onChange}
          @focus=${()=>{this.imSteuerelement=!0}}
          @blur=${()=>{this.imSteuerelement=!1}}
        />`}}onLupe(e=``){if(this.imEditor){this.spaltenDialog=!0;return}xc({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel,spalten:this.nachschlagSpalten,titel:this.placeholder,breite:this.fensterBreite,hoehe:this.fensterHoehe,suchtext:e,onUebernehmen:(e,t,n)=>this.uebernimmUndMelde(e,t,n)})}spaltenEffektiv(){let e=nc(this.nachschlagSpalten);return e.length>0?e:vc({speicherFeld:this.speicherFeld,speicherTitel:this.speicherTitel})}meldeProp(e,t,n){this.dispatchEvent(new CustomEvent(`ff-prop-change`,{detail:{attr:e,value:t,...n===void 0?{}:{geste:n}},bubbles:!0,composed:!0}))}spaltenDialogTpl(){return Sc({titel:this.placeholder,spalten:this.spaltenEffektiv(),breite:this.fensterBreite,hoehe:this.fensterHoehe,onGroesse:t=>{let n=t.achse===`breite`?`fensterBreite`:`fensterHoehe`;if(t.geste===`standard`){this.meldeProp(n,e.defaultProps[n]);return}this.meldeProp(n,t.wert,t.geste===`laeuft`?void 0:t.geste)},onAendern:e=>{this.meldeProp(`nachschlagSpalten`,e)},onFeldWahl:e=>{this.dispatchEvent(new CustomEvent(`ff-listen-bind`,{detail:{prop:`nachschlagSpalten`,...e},bubbles:!0,composed:!0}))},onSchliessen:()=>{this.spaltenDialog=!1}})}willUpdate(e){super.willUpdate(e),e.has(`fieldType`)&&ka(this.fieldType)!==`nachschlagen`&&(this.spaltenDialog=!1),this.vorschlaege=this.berechneVorschlaege(),this.marke=Di(this.marke,this.vorschlaege.length)}updated(e){super.updated(e),this.toggleAttribute(`data-ff-liste`,this.vorschlaege.length>0)}berechneVorschlaege(){if(this.getippt===null||this.listeZu||ka(this.fieldType)!==`nachschlagen`||this.imEditor)return[];let e=cc({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});return e.ok?Ti(e.eintraege,this.getippt):[]}onNachschlagTaste(e){if(this.imEditor)return;let t=this.vorschlaege.length,n=Oi(e.key,{listeOffen:t>0,feldLeer:(this.getippt??this.anzeige)===``,treffer:t,markeVonHand:this.markeVonHand});if(n===`nichts`){e.key===`Enter`&&e.preventDefault();return}e.preventDefault(),n===`marke-hoch`||n===`marke-runter`?(this.marke=Ei(this.marke,t,n===`marke-hoch`?-1:1),this.markeVonHand=!0):n===`uebernehmen`?this.uebernimmVorschlag(this.marke):n===`liste-zu`?this.listeZu=!0:this.onLupe(this.getippt??``)}uebernimmVorschlag(e){let t=this.vorschlaege[e];t&&this.uebernimmUndMelde(t.anzeige,t.wert,t.satz)}leereNachschlagen(){this.satz=void 0,this.anzeige=``,this.value=``,Qt(P(this))}uebernimmUndMelde(e,t,n){this.getippt=null,this.listeZu=!1,this.marke=0,this.markeVonHand=!1,this.uebernimmSatz(e,t,n),this.dispatchEvent(new Event(`change`))}uebernimmSatz(e,t,n){this.anzeige=e===``?t:e,this.value=t,this.satz=n,Zt(P(this),n,!0)}onNachschlagVerlassen(){if(this.imEditor)return;let e=dc(this.getippt??this.anzeige,this.anzeige,this.value);this.getippt=null,this.listeZu=!1,this.marke=0,this.markeVonHand=!1,e===`leeren`&&(this.leereNachschlagen(),this.dispatchEvent(new Event(`change`)))}pruefeEigenenWert(){ka(this.fieldType)===`nachschlagen`&&(this.getippt!==null&&this.requestUpdate(),this.satz!==void 0&&!uc(this,this.satz)&&this.leereNachschlagen(),this.uebernimmEinzigenTreffer())}uebernimmEinzigenTreffer(){if(this.einzigerTreffer!==`ja`)return;let e=cc({el:this,quelleId:this.nachschlagQuelle,speicherFeld:this.speicherFeld,spalten:this.nachschlagSpalten});if(!e.ok)return;let t=lc(e.eintraege,this.satz===void 0);t&&this.uebernimmSatz(t.anzeige,t.wert,t.satz)}render(){let e=ka(this.fieldType);if(e===`checkbox`)return y`<div class="feld">
        <div class="zeile">
          <input
            class="ctrl"
            type="checkbox"
            .checked=${this.angehakt}
            @change=${e=>this.setzeHaken(e.target.checked)}
          />
          ${this.textTpl(`text`)}
        </div>
      </div>`;let t=e!==`nachschlagen`,n=(t?this.value:this.getippt??this.anzeige)===``;return y`<div class="feld">
      <div
        class=${`huelle${n?` leer`:``}${this.imSteuerelement?` tippt`:``}`}
        data-ff-spot=${t?`value`:x}
        ?data-ff-bound=${t&&this.valueField!==``}
      >
        ${this.controlTpl(e)}
        ${Aa.includes(e)?this.textTpl(`ph ${ja[e]??``}`.trim(),!n,t&&this.valueField!==``):x}
      </div>
      ${this.spaltenDialog&&this.imEditor?this.spaltenDialogTpl():x}
    </div>`}connectedCallback(){super.connectedCallback(),Ta(this)}disconnectedCallback(){super.disconnectedCallback(),Ea(this),_c(this)}};E([w()],J.prototype,`fieldType`,void 0),E([w()],J.prototype,`placeholder`,void 0),E([w()],J.prototype,`options`,void 0),E([w()],J.prototype,`source`,void 0),E([w()],J.prototype,`value`,void 0),E([w()],J.prototype,`valueField`,void 0),E([w()],J.prototype,`nachschlagQuelle`,void 0),E([w()],J.prototype,`speicherFeld`,void 0),E([w()],J.prototype,`speicherTitel`,void 0),E([w({converter:{fromAttribute:e=>nc(e??``),toAttribute:e=>JSON.stringify(e)}})],J.prototype,`nachschlagSpalten`,void 0),E([w({type:Number})],J.prototype,`fensterBreite`,void 0),E([w({type:Number})],J.prototype,`fensterHoehe`,void 0),E([w()],J.prototype,`einzigerTreffer`,void 0),E([T()],J.prototype,`spaltenDialog`,void 0),E([T()],J.prototype,`anzeige`,void 0),E([T()],J.prototype,`getippt`,void 0),E([T()],J.prototype,`marke`,void 0),E([T()],J.prototype,`listeZu`,void 0),E([T()],J.prototype,`angehakt`,void 0),E([T()],J.prototype,`imSteuerelement`,void 0),D.defineAndRegister(J);var Cc=`ziel`,wc=o`
  :host([data-ff-ziel]) .ziel {
    background: var(--se-accent-soft);
    outline: var(--se-border) solid var(--se-accent);
    outline-offset: calc(-1 * var(--se-border));
  }
`,Tc=o`
  ::slotted(:not([hat-reiter])) { margin-top: 24px; }
  slot { display: contents; }
`,Ec=`frei · hierher ziehen`,Dc=`ff-zimmer-inhalt`,Y=class extends D{constructor(...e){super(...e),this.heading=`Neues Zimmer`,this.leerHinweis=``}static{this.blockType=`kanban-zimmer`}static{this.tagName=`ff-kanban-zimmer`}static{this.displayName=`Kanban-Zimmer`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[H.blockType]}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban-spalte`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={heading:`Neues Zimmer`}}static{this.styles=[D.styles,co,Tc,wc,o`
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
    `]}onSlotChange(){this.dispatchEvent(new CustomEvent(Dc,{bubbles:!0,composed:!0}))}render(){return y`<div class="zimmer ${Cc}">
      <div
        class="kopf"
        data-ff-editable
        @dblclick=${e=>this.inlineEdit(e,`heading`)}
      >${this.heading}</div>
      <div class="body">
        <slot @slotchange=${this.onSlotChange}></slot>
        ${so(this.leerHinweis)}
      </div>
    </div>`}};E([w()],Y.prototype,`heading`,void 0),E([w({attribute:!1})],Y.prototype,`leerHinweis`,void 0),D.defineAndRegister(Y);var X=class extends D{static{this.blockType=`kanban-spalte`}static{this.tagName=`ff-kanban-spalte`}static{this.displayName=`Kanban-Spalte`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[H.blockType,Y.blockType]}static{this.addChildButton={label:`Zimmer`,childType:Y.blockType}}static{this.childDirection=`column`}static{this.showInPalette=!1}static{this.containerHint=!1}static{this.allowedParentTypes=[`kanban`]}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.defaultProps={variant:`info`,heading:`Neue Spalte`,auffang:`nein`,zimmerField:``}}static{this.customProperties=[Wr(`variant`,`Bedeutung der Spalte — bestimmt ihre Farbwelt (Kopf, Fläche, Rahmen).`),U(`auffang`,`Auffangspalte`,`Einträge ohne passenden Spaltentitel landen hier.`,{requiresDataSource:!0,exclusiveAmongSiblings:!0}),{attributeName:`zimmerField`,name:`Unterteilen nach`,description:`Feld, das das Zimmer bestimmt. Wirkt nur mit Zimmern.`,kind:`field`}]}static{this.styles=[D.styles,co,Tc,wc,o`

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

    `]}constructor(){super(),this.variant=`info`,this.heading=`Neue Spalte`,this.leerHinweis=``,this._count=0,this.addEventListener(Dc,()=>this.zaehle())}zaehle(){this._count=Array.from(this.querySelectorAll(H.tagName)).filter(e=>!e.hasAttribute(`data-ff-editor-helper`)).length}render(){return y`<div class="col ${Cc} v-${Hr(this.variant)}">
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
        ${so(this.leerHinweis)}
      </div>
    </div>`}};E([w()],X.prototype,`variant`,void 0),E([w()],X.prototype,`heading`,void 0),E([w({attribute:!1})],X.prototype,`leerHinweis`,void 0),E([T()],X.prototype,`_count`,void 0),D.defineAndRegister(X);function Oc(e,t){let n=e.trim().toLowerCase();if(n!==``)for(let e=0;e<t.length;e++){let r=t[e].trim().toLowerCase();if(r!==``&&r===n)return e}return-1}function kc(e){return e.findIndex(e=>(e??``).trim()===`ja`)}var Ac=new WeakMap,jc=X.tagName,Mc=Y.tagName,Nc=H.tagName;function Pc(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===jc)}function Fc(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===Nc)}function Ic(e){return Array.from(e.children).filter(e=>e.tagName.toLowerCase()===Mc)}function Lc(e){return[e,...Ic(e)]}function Rc(e,t){let n=e.getAttribute(`leertext`)??`Keine Datensätze.`,r=(e,t)=>{e.leerHinweis=t};for(let e of t){let t=Ic(e);for(let e of t)r(e,Fc(e).length===0?Ec:``);r(e,t.length===0&&Fc(e).length===0?n:``)}}function zc(e){return Ye().find(t=>t.tagName===e.toLowerCase())?.bindableSpots??[]}function Bc(e,t){let n=Ic(e);if(n.length===0)return null;let r=e.getAttribute(`zimmerfield`)??``;if(r===``)return n[0];let i=n.map(e=>e.getAttribute(`heading`)??Y.defaultProps.heading),a=Oc(j(t,r),i);return a>=0?n[a]:n[0]}function Vc(e){Q?.board===e&&qc();let t=e.getAttribute(`statusfield`)??``,n=Ro(e);if(!n)return;let r=Pc(e);if(r.length===0)return;let i=Ac.get(e);if(!i){let t=e.querySelector(`template[data-ff-template]`)?.content.firstElementChild??e.querySelector(Nc);t&&(i=t.cloneNode(!0),Ac.set(e,i))}if(!i)return;let a=n.zeilen,o=r.map(e=>e.getAttribute(`heading`)??X.defaultProps.heading),s=zc(i.tagName),c=kc(r.map(e=>e.getAttribute(`auffang`))),l=n.lies;for(let e of r)for(let t of Lc(e))Fc(t).forEach(e=>e.remove());for(let e of a){let a=i.cloneNode(!0),u=t===``?-1:Oc(j(e,t),o),d=u>=0?r[u]:c>=0?r[c]:r[0];(Bc(d,e)??d).appendChild(a);for(let t of s){let n=a.getAttribute(zi(t.prop))??``;n!==``&&(a[t.prop]=l(e,n))}let f=Ot(n.quelle,e);Z.set(a,{row:e,pindex:f}),a.draggable=!0}Rc(e,r);let u=r.flatMap(e=>Lc(e).flatMap(Fc)),d=Yt(P(e),u,e=>Z.get(e)?.row);for(let e of d)u[e].setAttribute(`data-ff-auswahl`,``)}var Z=new WeakMap,Q=null,Hc=new WeakSet,Uc=`data-ff-zieht`,Wc=`data-ff-ziel`,Gc=null;function Kc(e){Gc!==e&&(Gc?.removeAttribute(Wc),Gc=e,Gc?.setAttribute(Wc,``))}function qc(){Q?.card.removeAttribute(Uc),Q=null,Kc(null)}function Jc(e,t,n){for(let r of t.composedPath())if(r instanceof HTMLElement&&r.tagName.toLowerCase()===n&&e.contains(r))return r;return null}function Yc(e,t){return Jc(e,t,jc)}function Xc(e,t,n){if(!Q||Q.board!==e)return;let r=Z.get(Q.card);if(!r)return;let i=t.getAttribute(`heading`)??``,a=n?.getAttribute(`heading`)??``;V(e,`onCardDrop`,{PINDEX:r.pindex,VALUE:i,ZIMMER:a}).catch(B)}function Zc(e){Hc.has(e)||(Hc.add(e),e.addEventListener(`click`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&Z.has(e))??null;if(!n)return;let r=Z.get(n);r&&Xt(P(e),r.row),V(e,`onCardClick`,{PINDEX:r?.pindex??``}).catch(B)}),e.addEventListener(`dragstart`,t=>{let n=t.composedPath().find(e=>e instanceof HTMLElement&&Z.has(e))??null;n&&(Q={card:n,board:e},t.dataTransfer?.setData(`text/plain`,Z.get(n)?.pindex??``),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`),setTimeout(()=>{Q?.card===n&&n.setAttribute(Uc,``)},0))}),e.addEventListener(`dragend`,qc),e.addEventListener(`dragover`,t=>{let n=Yc(e,t);if(Q?.board!==e||!n){Kc(null);return}t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`move`),Kc(Jc(e,t,Mc)??n)}),e.addEventListener(`dragleave`,t=>{let n=t.relatedTarget;(!(n instanceof Node)||!e.contains(n))&&Kc(null)}),e.addEventListener(`drop`,t=>{let n=Yc(e,t);n&&(t.preventDefault(),Xc(e,n,Jc(e,t,Mc)),qc())}))}var Qc=la({hydriere:Vc,verdrahte:Zc}),$c=Qc.connect,el=Qc.disconnect,tl=X.blockType,nl=class extends D{static{this.blockType=`kanban`}static{this.tagName=`ff-kanban`}static{this.displayName=`Kanban`}static{this.category=`anzeige`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[tl]}static{this.childDirection=`row`}static{this.lockedWidth=`fill`}static{this.resizableWidth=!1}static{this.containerHint=!1}static{this.addChildButton={label:`Spalte`,childType:tl}}static{this.templateChild={type:H.blockType,label:`Muster`}}static{this.resizableHeight=!0}static{this.acceptsDataSource=!0}static{this.satzWahl={}}static{this.blockEvents=[{key:`onCardClick`,name:`Karte angeklickt`},{key:`onCardDrop`,name:`Karte verschoben`}]}static{this.defaultProps={width:`fill`,height:`fill`,source:``,statusField:``,tagField:``,leerText:ao}}static{this.raster={startW:24,startH:20,minW:6,minH:8}}static{this.customProperties=[{attributeName:`statusField`,name:`Einsortieren nach`,description:`Feld, das die Spalte bestimmt. Leer: alle in die Auffang-Spalte.`,kind:`field`},{attributeName:`tagField`,name:`Tag filtern nach`,description:`Datumsfeld. Gesetzt: nur Einträge des gewählten Tages.`,kind:`field`},oo()]}static{this.defaultChildren=[{type:tl,props:{heading:`Offen`,variant:`warning`},children:[{type:H.blockType}]},{type:tl,props:{heading:`In Arbeit`,variant:`info`}},{type:tl,props:{heading:`Fertig`,variant:`success`}}]}static{this.styles=[D.styles,o`

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
    `]}render(){return y`<div class="board"><slot></slot></div>`}connectedCallback(){super.connectedCallback(),$c(this)}disconnectedCallback(){super.disconnectedCallback(),el(this)}};D.defineAndRegister(nl);var rl={breite:56,breiteOffen:224},il=`ff-seiten-wechsel`,al=[{wert:`sonne`,name:`Sonnengelb`},{wert:`salbei`,name:`Salbeigrün`},{wert:`himmel`,name:`Himmelblau`},{wert:`flieder`,name:`Flieder`},{wert:`koralle`,name:`Koralle`}],ol=class extends D{static{this.blockType=`navi-eintrag`}static{this.tagName=`ff-navi-eintrag`}static{this.displayName=`Navi-Eintrag`}static{this.category=`layout`}static{this.acceptsChildren=!1}static{this.showInPalette=!1}static{this.allowedParentTypes=[`navi`]}static{this.resizableWidth=!1}static{this.defaultProps={seite:``,seitename:``,ton:`sonne`}}static{this.customProperties=[{attributeName:`seite`,name:`Seite`,description:`Welche Seite dieser Maske der Eintrag zeigt.`,kind:`seite`,klarnameProp:`seitename`,nurImEditor:!0},{attributeName:`ton`,name:`Farbe`,description:`Farbe des Zeichens vor dem Namen.`,kind:`select`,options:al.map(e=>({value:e.wert,label:e.name}))}]}static{this.styles=[D.styles,o`
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
    `]}constructor(){super(),this.seite=``,this.seitename=``,this.ton=`sonne`,this.addEventListener(`click`,()=>this.melde())}melde(){let e={ansicht:this.seitename};this.dispatchEvent(new CustomEvent(il,{detail:e,bubbles:!0,composed:!0}))}render(){return y`<span class="zeichen"></span>
      <span class="name">${this.seitename===``?`—`:this.seitename}</span>`}};E([w()],ol.prototype,`seite`,void 0),E([w()],ol.prototype,`seitename`,void 0),E([w({reflect:!0})],ol.prototype,`ton`,void 0),D.defineAndRegister(ol);var sl=`aktiv`;function cl(e){return Array.from(e.querySelectorAll(ol.tagName))}function ll(e,t){let n=cl(e),r=t??n.find(e=>e.hasAttribute(sl))??n[0];for(let e of n)e===r?e.setAttribute(sl,``):e.removeAttribute(sl)}function ul(e){let t=e.hasAttribute(`offen`);for(let n of cl(e))n.toggleAttribute(`breit`,t)}function dl(e){return e.getAttribute(`name`)??String(dt.defaultProps.name)}function fl(e,t){let n=e;for(;n&&n.parentElement!==t;)n=n.parentElement;return n}function pl(e,t){let n=e.ownerDocument,r=Array.from(n.querySelectorAll(dt.tagName)),i=r[0]?.parentElement??null;if(!i)return;let a=fl(e,i);if(!a)return;let o=r.find(e=>dl(e)===t)??null;for(let e of Array.from(i.children))e!==a&&((r.includes(e)?e===o:o===null)?e.removeAttribute(`hidden`):e.setAttribute(`hidden`,``))}var ml=new WeakMap,hl=new WeakSet;function gl(e){let t=t=>{let n=t.detail;n&&(ll(e,t.target instanceof Element?t.target:void 0),e.removeAttribute(`offen`),ul(e),!e.hasAttribute(`data-ff-editor`)&&pl(e,n.ansicht))};e.addEventListener(il,t),ml.set(e,t)}function _l(e){let t=ml.get(e);t&&(e.removeEventListener(il,t),ml.delete(e))}function vl(e){if(ll(e),ul(e),e.hasAttribute(`data-ff-editor`)||hl.has(e))return;let t=cl(e)[0];if(!t)return;hl.add(e);let n=()=>pl(e,t.seitename);e.ownerDocument.readyState===`loading`?e.ownerDocument.addEventListener(`DOMContentLoaded`,n,{once:!0}):queueMicrotask(n)}var yl=ol.blockType,bl=class extends D{static{this.blockType=`navi`}static{this.tagName=`ff-navi`}static{this.displayName=`Navi`}static{this.category=`layout`}static{this.acceptsChildren=!0}static{this.allowedChildTypes=[yl]}static{this.addChildButton={label:`Eintrag`,childType:yl}}static{this.containerHint=!1}static{this.defaultProps={}}static{this.customProperties=[]}static{this.maskenRand=!0}static{this.allowedParentTypes=[ut]}static{this.raster={startW:5,startH:24,minW:3,minH:3}}static{this.styles=[D.styles,o`
      :host {
        height: 100%;
        width: ${rl.breite}px;
        transition: width var(--se-move);
      }
      :host([offen]) { width: ${rl.breiteOffen}px; }
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
    `]}connectedCallback(){super.connectedCallback(),gl(this)}disconnectedCallback(){super.disconnectedCallback(),_l(this)}klappen(){this.toggleAttribute(`offen`),ul(this)}render(){return y`<div class="leiste">
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
          <slot @slotchange=${()=>vl(this)}></slot>
        </div>
      </div>`}};D.defineAndRegister(bl);var xl=zi(`text`);function Sl(e){let t=e.getAttribute(`source`)??``,n=e.getAttribute(xl)??``;return t===``||n===``?void 0:{sourceId:t,code:n}}function Cl(e){let t=ha(e,xl);t.art!==`ungebunden`&&(e.text=t.art===`wert`?t.wert:``)}function wl(e){Sl(e)&&(e.text=``)}var Tl=la({hydriere:Cl,verdrahte:wl}),El=Tl.connect,Dl=Tl.disconnect,Ol=6,kl=96,Al=14,jl={duenn:`300`,normal:`400`,fett:`700`},Ml={links:`left`,mitte:`center`,rechts:`right`},Nl={standard:`var(--se-ink)`,gedaempft:`var(--se-muted)`,akzent:`var(--se-accent)`,erfolg:`var(--se-green)`,warnung:`var(--se-amber)`,fehler:`var(--se-red)`},Pl=`standard`;function Fl(e){if(e===`ueberschrift`)return 15;if(e===`klein`)return 12;let t=typeof e==`number`?e:Number.parseFloat(String(e??``));return Number.isFinite(t)?Math.min(kl,Math.max(Ol,t)):Al}function Il(e){return typeof e==`string`&&e in jl?e:`normal`}function Ll(e){return typeof e==`string`&&e in Ml?e:`links`}function Rl(e){return typeof e==`string`&&e in Nl?e:Pl}var $=class extends D{constructor(...e){super(...e),this.groesse=Al,this.gewicht=`normal`,this.ausrichtung=`links`,this.farbe=Pl,this.text=`Text`,this.source=``,this.textField=``}static{this.blockType=`text`}static{this.tagName=`ff-text`}static{this.displayName=`Text`}static{this.category=`anzeige`}static{this.acceptsDataSource=!0}static{this.kannAuswahlFolgen=!0}static{this.bindableSpots=[{prop:`text`,label:`Text`}]}static{this.defaultProps={width:`fill`,groesse:Al,gewicht:`normal`,ausrichtung:`links`,farbe:Pl,text:`Text`,source:``,textField:``}}static{this.raster={startW:6,startH:2,minW:1,minH:1}}static{this.customProperties=[{attributeName:`groesse`,name:`Größe`,description:`Schriftgröße in Pixeln.`,kind:`number`,unit:`px`,min:Ol,max:kl,inspectorRow:`Text-Stil`},{attributeName:`gewicht`,name:`Gewicht`,description:`Strichstärke der Schrift.`,kind:`segment`,options:[{value:`duenn`,label:`Dünn`},{value:`normal`,label:`Normal`},{value:`fett`,label:`Fett`}],inspectorRow:`Text-Stil`},{attributeName:`ausrichtung`,name:`Ausrichtung`,description:`Wo der Text in seiner Breite sitzt.`,kind:`segment`,options:[{value:`links`,label:`Links`},{value:`mitte`,label:`Mitte`},{value:`rechts`,label:`Rechts`}],inspectorRow:`Text-Stil`},{attributeName:`farbe`,name:`Farbe`,description:`Textfarbe aus den Farben der Maske.`,kind:`select`,options:[{value:`standard`,label:`Standard`},{value:`gedaempft`,label:`Gedämpft`},{value:`akzent`,label:`Akzent`},{value:`erfolg`,label:`Erfolg`},{value:`warnung`,label:`Warnung`},{value:`fehler`,label:`Fehler`}]}]}static{this.styles=[D.styles,o`
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
    `]}render(){return y`<div
      class="text"
      style=${G({fontSize:`${Fl(this.groesse)}px`,fontWeight:jl[Il(this.gewicht)],textAlign:Ml[Ll(this.ausrichtung)],color:Nl[Rl(this.farbe)]})}
      data-ff-editable
      data-ff-spot="text"
      ?data-ff-bound=${this.textField!==``}
      @dblclick=${e=>this.inlineEdit(e,`text`)}
    >${this.text}</div>`}connectedCallback(){super.connectedCallback(),El(this)}disconnectedCallback(){super.disconnectedCallback(),Dl(this)}};E([w({type:Number})],$.prototype,`groesse`,void 0),E([w()],$.prototype,`gewicht`,void 0),E([w()],$.prototype,`ausrichtung`,void 0),E([w()],$.prototype,`farbe`,void 0),E([w()],$.prototype,`text`,void 0),E([w()],$.prototype,`source`,void 0),E([w()],$.prototype,`textField`,void 0),D.defineAndRegister($);var zl=[`waagerecht`,`senkrecht`],Bl=`waagerecht`;function Vl(e){return zl.includes(e)?e:Bl}var Hl=class extends D{constructor(...e){super(...e),this.richtung=Bl}static{this.blockType=`trenner`}static{this.tagName=`ff-trenner`}static{this.displayName=`Trennlinie`}static{this.category=`layout`}static{this.defaultProps={width:`fill`,richtung:Bl}}static{this.resizableWidth=!1}static{this.raster={startW:24,startH:1,minW:1,minH:1,varianten:[{wenn:{attributeName:`richtung`,equals:`senkrecht`},startW:1,startH:6,breiteZiehbar:!1}]}}static{this.customProperties=[{attributeName:`richtung`,name:`Richtung`,description:`Waagerecht trennt oben von unten, senkrecht links von rechts.`,kind:`select`,options:[{value:`waagerecht`,label:`Waagerecht`},{value:`senkrecht`,label:`Senkrecht`}]}]}static{this.styles=[D.styles,o`

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
    `]}render(){return y`<div class="flaeche ${Vl(this.richtung)}"><div class="linie"></div></div>`}};E([w()],Hl.prototype,`richtung`,void 0),D.defineAndRegister(Hl),typeof window<`u`&&window.addEventListener(`unhandledrejection`,e=>{let t=e.reason;L(`Unerwarteter Fehler in der Maske: `+(t instanceof Error?t.message:String(t)))})})();