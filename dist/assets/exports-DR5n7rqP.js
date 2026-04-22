import{A as e,B as t,C as n,D as r,E as i,H as a,S as o,T as s,V as c,Y as l,Z as ee,_ as u,b as te,f as ne,g as re,j as d,l as f,n as ie,nt as p,r as m,t as h,v as ae,w as oe,x as se,y as g,z as ce}from"./ModalController-O2N328fJ.js";import{t as le}from"./NavigationUtil-CRveY2Bx.js";import"./w3m-tooltip-DsCRDMdt.js";import{t as ue}from"./wui-loading-thumbnail-BwjG97_t.js";import{t as _}from"./ExchangeController-Bqj-GGTa.js";import{t as de}from"./ConstantsUtil-CoghkzQ0.js";import{I as fe,O as pe,S as v,b as me,i as y,k as he,l as b,o as x,p as S,r as C,s as w,t as T,v as E,x as ge,y as _e}from"./index-CC1Yg7bh.js";import{o as D,s as O,t as ve}from"./wui-text-BF8MXN5A.js";import{t as k}from"./if-defined-DuW4wVer.js";import"./wui-loading-spinner-CkFs262I.js";import"./wui-button-B7uY05Qg.js";import"./wui-icon-Tr931lbX.js";import"./wui-icon-link-BCCegqjG.js";import"./wui-image-DQoK5mnq.js";import"./wui-list-item-W8_p3XQz.js";import"./wui-loading-spinner-BzQi6N24.js";import{t as ye}from"./wui-wallet-switch-CCtLFe49.js";import"./wui-separator-DVee0SbM.js";import"./wui-icon-box-CEunCy0z.js";import{t as be}from"./wui-list-social-Zp4O2qo-.js";import"./wui-shimmer-C1IQnYBv.js";import"./wui-shimmer-DwEAw3Yh.js";import"./wui-link-BWItnWZt.js";import"./wui-icon-box-CqWS75KY.js";import{n as xe,t as Se}from"./ref-DPbVKhg8.js";import"./wui-input-text-D90xSpP6.js";import"./wui-email-input-rlHRMd2M.js";import{t as Ce}from"./HelpersUtil-wZxkzCEq.js";import"./wui-avatar-BZ2qXh_I.js";import"./w3m-onramp-providers-footer-DWEczyIR.js";import{n as we,t as Te}from"./wui-list-wallet-feEiKwes.js";import"./w3m-activity-list-C4DYmhgP.js";import"./wui-list-token-C-f914yz.js";import"./wui-qr-code-9GVzjOkP.js";import"./wui-visual-Dqg2N485.js";import"./wui-input-text-BRyo6hxL.js";var Ee=w`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[20]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[16]};
    height: 32px;
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: box-shadow;
  }

  button wui-flex.avatar-container {
    width: 28px;
    height: 24px;
    position: relative;

    wui-flex.network-image-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
    }

    wui-flex.network-image-container wui-icon {
      background: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    wui-avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }

    wui-icon {
      width: 12px;
      height: 12px;
    }
  }

  wui-image,
  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-text {
    white-space: nowrap;
  }

  button wui-flex.balance-container {
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[16]};
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
    background: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:focus-visible:enabled,
  button:active:enabled {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

    wui-flex.balance-container {
      background: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled wui-text,
  button:disabled wui-flex.avatar-container {
    opacity: 0.3;
  }
`,A=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},j=class extends b{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address=``,this.profileName=``,this.charsStart=4,this.charsEnd=6}render(){return S`
      <button
        ?disabled=${this.disabled}
        class=${k(this.balance?void 0:`local-no-balance`)}
        data-error=${k(this.isUnsupportedChain)}
      >
        ${this.imageTemplate()} ${this.addressTemplate()} ${this.balanceTemplate()}
      </button>
    `}imageTemplate(){let e=this.networkSrc?S`<wui-image src=${this.networkSrc}></wui-image>`:S` <wui-icon size="inherit" color="inherit" name="networkPlaceholder"></wui-icon> `;return S`<wui-flex class="avatar-container">
      <wui-avatar
        .imageSrc=${this.avatarSrc}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>

      <wui-flex class="network-image-container">${e}</wui-flex>
    </wui-flex>`}addressTemplate(){return S`<wui-text variant="md-regular" color="inherit">
      ${this.address?C.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?`end`:`middle`}):null}
    </wui-text>`}balanceTemplate(){return this.balance?S`<wui-flex alignItems="center" justifyContent="center" class="balance-container"
        >${this.loading?S`<wui-loading-spinner size="md" color="inherit"></wui-loading-spinner>`:S`<wui-text variant="md-regular" color="inherit"> ${this.balance}</wui-text>`}</wui-flex
      >`:null}};j.styles=[x,y,Ee],A([O()],j.prototype,`networkSrc`,void 0),A([O()],j.prototype,`avatarSrc`,void 0),A([O()],j.prototype,`balance`,void 0),A([O({type:Boolean})],j.prototype,`isUnsupportedChain`,void 0),A([O({type:Boolean})],j.prototype,`disabled`,void 0),A([O({type:Boolean})],j.prototype,`loading`,void 0),A([O()],j.prototype,`address`,void 0),A([O()],j.prototype,`profileName`,void 0),A([O()],j.prototype,`charsStart`,void 0),A([O()],j.prototype,`charsEnd`,void 0),j=A([T(`wui-account-button`)],j);var M=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},N=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=`show`,this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=d.state.allowUnsupportedChain?!0:m.state.activeChain?m.checkIfSupportedNetwork(m.state.activeChain):!0}connectedCallback(){super.connectedCallback(),this.setAccountData(m.getAccountData(this.namespace)),this.setNetworkData(m.getNetworkData(this.namespace))}firstUpdated(){let e=this.namespace;e?this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.setAccountData(e)},e),m.subscribeChainProp(`networkState`,t=>{this.setNetworkData(t),this.isSupported=m.checkIfSupportedNetwork(e,t?.caipNetwork?.caipNetworkId)},e)):this.unsubscribe.push(i.subscribeNetworkImages(()=>{this.networkImage=s.getNetworkImage(this.network)}),m.subscribeKey(`activeCaipAddress`,e=>{this.caipAddress=e}),m.subscribeChainProp(`accountState`,e=>{this.setAccountData(e)}),m.subscribeKey(`activeCaipNetwork`,e=>{this.network=e,this.networkImage=s.getNetworkImage(e),this.isSupported=e?.chainNamespace?m.checkIfSupportedNetwork(e?.chainNamespace):!0,this.fetchNetworkImage(e)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!m.state.activeChain)return null;let e=this.balance===`show`,n=typeof this.balanceVal!=`string`,{formattedText:r}=t.parseBalance(this.balanceVal,this.balanceSymbol);return S`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${d.state.allowUnsupportedChain?!1:!this.isSupported}
        address=${k(t.getPlainAddress(this.caipAddress))}
        profileName=${k(this.profileName)}
        networkSrc=${k(this.networkImage)}
        avatarSrc=${k(this.profileImage)}
        balance=${e?r:``}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:``}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${n}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||d.state.allowUnsupportedChain?h.open({namespace:this.namespace}):h.open({view:`UnsupportedChain`})}async fetchNetworkImage(e){e?.assets?.imageId&&(this.networkImage=await s.fetchNetworkImage(e?.assets?.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=s.getNetworkImage(e.caipNetwork))}};M([O({type:Boolean})],N.prototype,`disabled`,void 0),M([O()],N.prototype,`balance`,void 0),M([O()],N.prototype,`charsStart`,void 0),M([O()],N.prototype,`charsEnd`,void 0),M([O()],N.prototype,`namespace`,void 0),M([D()],N.prototype,`caipAddress`,void 0),M([D()],N.prototype,`balanceVal`,void 0),M([D()],N.prototype,`balanceSymbol`,void 0),M([D()],N.prototype,`profileName`,void 0),M([D()],N.prototype,`profileImage`,void 0),M([D()],N.prototype,`network`,void 0),M([D()],N.prototype,`networkImage`,void 0),M([D()],N.prototype,`isSupported`,void 0);var De=class extends N{};De=M([T(`w3m-account-button`)],De);var Oe=class extends N{};Oe=M([T(`appkit-account-button`)],Oe);var ke=E`
  :host {
    display: block;
    width: max-content;
  }
`,P=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},F=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){this.caipAddress=this.namespace?m.getAccountData(this.namespace)?.caipAddress:m.state.activeCaipAddress,this.namespace?this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress},this.namespace)):this.unsubscribe.push(m.subscribeKey(`activeCaipAddress`,e=>this.caipAddress=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?S`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${k(this.balance)}
            .charsStart=${k(this.charsStart)}
            .charsEnd=${k(this.charsEnd)}
            namespace=${k(this.namespace)}
          >
          </appkit-account-button>
        `:S`
          <appkit-connect-button
            size=${k(this.size)}
            label=${k(this.label)}
            loadingLabel=${k(this.loadingLabel)}
            namespace=${k(this.namespace)}
          ></appkit-connect-button>
        `}};F.styles=ke,P([O({type:Boolean})],F.prototype,`disabled`,void 0),P([O()],F.prototype,`balance`,void 0),P([O()],F.prototype,`size`,void 0),P([O()],F.prototype,`label`,void 0),P([O()],F.prototype,`loadingLabel`,void 0),P([O()],F.prototype,`charsStart`,void 0),P([O()],F.prototype,`charsEnd`,void 0),P([O()],F.prototype,`namespace`,void 0),P([D()],F.prototype,`caipAddress`,void 0);var Ae=class extends F{};Ae=P([T(`w3m-button`)],Ae);var je=class extends F{};je=P([T(`appkit-button`)],je);var Me=w`
  :host {
    position: relative;
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='sm'] {
    padding: ${({spacing:e})=>e[2]};
  }

  button[data-size='md'] {
    padding: ${({spacing:e})=>e[3]};
  }

  button[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]};
  }

  button[data-variant='primary'] {
    background: ${({tokens:e})=>e.core.backgroundAccentPrimary};
  }

  button[data-variant='secondary'] {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button:hover:enabled {
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:disabled {
    cursor: not-allowed;
  }

  button[data-loading='true'] {
    cursor: not-allowed;
  }

  button[data-loading='true'][data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
  }

  button[data-loading='true'][data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[20]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[4]};
  }

  button[data-loading='true'][data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[16]};
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[5]};
  }
`,Ne=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Pe=class extends b{constructor(){super(...arguments),this.size=`md`,this.variant=`primary`,this.loading=!1,this.text=`Connect Wallet`}render(){return S`
      <button
        data-loading=${this.loading}
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.loading}
      >
        ${this.contentTemplate()}
      </button>
    `}contentTemplate(){let e={lg:`lg-regular`,md:`md-regular`,sm:`sm-regular`},t={primary:`invert`,secondary:`accent-primary`};return this.loading?S`<wui-loading-spinner
      color=${t[this.variant]}
      size=${this.size}
    ></wui-loading-spinner>`:S` <wui-text variant=${e[this.size]} color=${t[this.variant]}>
        ${this.text}
      </wui-text>`}};Pe.styles=[x,y,Me],Ne([O()],Pe.prototype,`size`,void 0),Ne([O()],Pe.prototype,`variant`,void 0),Ne([O({type:Boolean})],Pe.prototype,`loading`,void 0),Ne([O()],Pe.prototype,`text`,void 0),Pe=Ne([T(`wui-connect-button`)],Pe);var Fe=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ie=class extends b{constructor(){super(),this.unsubscribe=[],this.size=`md`,this.label=`Connect Wallet`,this.loadingLabel=`Connecting...`,this.open=h.state.open,this.loading=this.namespace?h.state.loadingNamespaceMap.get(this.namespace):h.state.loading,this.unsubscribe.push(h.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-connect-button
        size=${k(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:``}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?h.close():this.loading||h.open({view:`Connect`,namespace:this.namespace})}};Fe([O()],Ie.prototype,`size`,void 0),Fe([O()],Ie.prototype,`label`,void 0),Fe([O()],Ie.prototype,`loadingLabel`,void 0),Fe([O()],Ie.prototype,`namespace`,void 0),Fe([D()],Ie.prototype,`open`,void 0),Fe([D()],Ie.prototype,`loading`,void 0);var Le=class extends Ie{};Le=Fe([T(`w3m-connect-button`)],Le);var Re=class extends Ie{};Re=Fe([T(`appkit-connect-button`)],Re);var ze=w`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[32]};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[1]} ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button[data-size='sm'] > wui-icon-box,
  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-icon-box,
  button[data-size='md'] > wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-icon-box,
  button[data-size='lg'] > wui-image {
    width: 24px;
    height: 24px;
  }

  wui-image,
  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e[32]};
  }
`,Be=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ve=class extends b{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.size=`lg`}render(){return S`
      <button data-size=${this.size} data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant=${{sm:`sm-regular`,md:`md-regular`,lg:`lg-regular`}[this.size]} color="primary">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?S` <wui-icon-box color="error" icon="warningCircle"></wui-icon-box> `:this.imageSrc?S`<wui-image src=${this.imageSrc}></wui-image>`:S` <wui-icon size="xl" color="default" name="networkPlaceholder"></wui-icon> `}};Ve.styles=[x,y,ze],Be([O()],Ve.prototype,`imageSrc`,void 0),Be([O({type:Boolean})],Ve.prototype,`isUnsupportedChain`,void 0),Be([O({type:Boolean})],Ve.prototype,`disabled`,void 0),Be([O()],Ve.prototype,`size`,void 0),Ve=Be([T(`wui-network-button`)],Ve);var He=E`
  :host {
    display: block;
    width: max-content;
  }
`,Ue=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},We=class extends b{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=m.state.activeCaipNetwork,this.networkImage=s.getNetworkImage(this.network),this.caipAddress=m.state.activeCaipAddress,this.loading=h.state.loading,this.isSupported=d.state.allowUnsupportedChain?!0:m.state.activeChain?m.checkIfSupportedNetwork(m.state.activeChain):!0,this.unsubscribe.push(i.subscribeNetworkImages(()=>{this.networkImage=s.getNetworkImage(this.network)}),m.subscribeKey(`activeCaipAddress`,e=>{this.caipAddress=e}),m.subscribeKey(`activeCaipNetwork`,e=>{this.network=e,this.networkImage=s.getNetworkImage(e),this.isSupported=e?.chainNamespace?m.checkIfSupportedNetwork(e.chainNamespace):!0,s.fetchNetworkImage(e?.assets?.imageId)}),h.subscribeKey(`loading`,e=>this.loading=e))}firstUpdated(){s.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.network?m.checkIfSupportedNetwork(this.network.chainNamespace):!0;return S`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${d.state.allowUnsupportedChain?!1:!e}
        imageSrc=${k(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?!this.isSupported&&!d.state.allowUnsupportedChain?`Switch Network`:this.network.name:this.label?this.label:this.caipAddress?`Unknown Network`:`Select Network`}onClick(){this.loading||(n.sendEvent({type:`track`,event:`CLICK_NETWORKS`}),h.open({view:`Networks`}))}};We.styles=He,Ue([O({type:Boolean})],We.prototype,`disabled`,void 0),Ue([O({type:String})],We.prototype,`label`,void 0),Ue([D()],We.prototype,`network`,void 0),Ue([D()],We.prototype,`networkImage`,void 0),Ue([D()],We.prototype,`caipAddress`,void 0),Ue([D()],We.prototype,`loading`,void 0),Ue([D()],We.prototype,`isSupported`,void 0);var Ge=class extends We{};Ge=Ue([T(`w3m-network-button`)],Ge);var Ke=class extends We{};Ke=Ue([T(`appkit-network-button`)],Ke);var qe=w`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  wui-flex > wui-icon {
    padding: ${({spacing:e})=>e[2]};
    color: ${({tokens:e})=>e.theme.textInvert};
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
    align-items: center;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent020};
    }
  }
`,Je=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ye=class extends b{constructor(){super(...arguments),this.label=``,this.description=``,this.icon=`wallet`}render(){return S`
      <button>
        <wui-flex gap="2" alignItems="center">
          <wui-icon weight="fill" size="lg" name=${this.icon} color="inherit"></wui-icon>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.label}</wui-text>
            <wui-text variant="md-regular" color="tertiary">${this.description}</wui-text>
          </wui-flex>
        </wui-flex>
        <wui-icon size="lg" color="accent-primary" name="chevronRight"></wui-icon>
      </button>
    `}};Ye.styles=[x,y,qe],Je([O()],Ye.prototype,`label`,void 0),Je([O()],Ye.prototype,`description`,void 0),Je([O()],Ye.prototype,`icon`,void 0),Ye=Je([T(`wui-notice-card`)],Ye);var Xe=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ze=class extends b{constructor(){super(),this.unsubscribe=[],this.socialProvider=c.getConnectedSocialProvider(),this.socialUsername=c.getConnectedSocialUsername(),this.namespace=m.state.activeChain,this.unsubscribe.push(m.subscribeKey(`activeChain`,e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=u.getConnectorId(this.namespace),t=u.getAuthConnector();if(!t||e!==p.CONNECTOR_ID.AUTH)return this.style.cssText=`display: none`,null;let n=t.provider.getEmail()??``;return!n&&!this.socialUsername?(this.style.cssText=`display: none`,null):S`
      <wui-list-item
        ?rounded=${!0}
        icon=${this.socialProvider??`mail`}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(n,this.socialProvider)}}
      >
        <wui-text variant="lg-regular" color="primary">${this.getAuthName(n)}</wui-text>
      </wui-list-item>
    `}onGoToUpdateEmail(e,t){t||g.push(`UpdateEmailWallet`,{email:e,redirectView:`Account`})}getAuthName(e){return this.socialUsername?this.socialProvider===`discord`&&this.socialUsername.endsWith(`0`)?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};Xe([D()],Ze.prototype,`namespace`,void 0),Ze=Xe([T(`w3m-account-auth-button`)],Ze);var Qe=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$e=class extends b{constructor(){super(),this.usubscribe=[],this.networkImages=i.state.networkImages,this.address=m.getAccountData()?.address,this.profileImage=m.getAccountData()?.profileImage,this.profileName=m.getAccountData()?.profileName,this.network=m.state.activeCaipNetwork,this.disconnecting=!1,this.remoteFeatures=d.state.remoteFeatures,this.usubscribe.push(m.subscribeChainProp(`accountState`,e=>{e&&(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName)}),m.subscribeKey(`activeCaipNetwork`,e=>{e?.id&&(this.network=e)}),d.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){if(!this.address)throw Error(`w3m-account-settings-view: No account provided`);let e=this.networkImages[this.network?.assets?.imageId??``];return S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${[`0`,`5`,`3`,`5`]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${k(this.profileImage)}
          size="lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="1" alignItems="center" justifyContent="center">
            <wui-text variant="h5-medium" color="primary" data-testid="account-settings-address">
              ${C.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:`middle`})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="default"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" gap="2" .padding=${[`6`,`4`,`3`,`4`]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            imageSrc=${k(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            ?fullSize=${!0}
            ?rounded=${!0}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="lg-regular" color="primary">
              ${this.network?.name??`Unknown`}
            </wui-text>
          </wui-list-item>
          ${this.smartAccountSettingsTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            ?rounded=${!0}
            icon="power"
            iconColor="error"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){let e=this.network?.chainNamespace,t=u.getConnectorId(e),n=u.getAuthConnector();return!m.checkIfNamesSupported()||!n||t!==p.CONNECTOR_ID.AUTH||this.profileName?null:S`
      <wui-list-item
        icon="id"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="lg-regular" color="primary">Choose account name </wui-text>
      </wui-list-item>
    `}authCardTemplate(){let e=u.getConnectorId(this.network?.chainNamespace),t=u.getAuthConnector(),{origin:n}=location;return!t||e!==p.CONNECTOR_ID.AUTH||n.includes(a.SECURE_SITE)?null:S`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){let e=m.getAllRequestedCaipNetworks(),t=e?e.length>1:!1,n=e?.find(({id:e})=>e===this.network?.id);return t||!n}onCopyAddress(){try{this.address&&(t.copyToClopboard(this.address),e.showSuccess(`Address copied`))}catch{e.showError(`Failed to copy`)}}smartAccountSettingsTemplate(){let e=this.network?.chainNamespace,t=m.checkIfSmartAccountEnabled(),n=u.getConnectorId(e);return!u.getAuthConnector()||n!==p.CONNECTOR_ID.AUTH||!t?null:S`
      <wui-list-item
        icon="user"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onSmartAccountSettings.bind(this)}
        data-testid="account-smart-account-settings-button"
      >
        <wui-text variant="lg-regular" color="primary">Smart Account Settings</wui-text>
      </wui-list-item>
    `}onChooseName(){g.push(`ChooseAccountName`)}onNetworks(){this.isAllowedNetworkSwitch()&&g.push(`Networks`)}async onDisconnect(){try{this.disconnecting=!0;let t=this.network?.chainNamespace,n=f.getConnections(t).length>0,r=t&&u.state.activeConnectorIds[t],i=this.remoteFeatures?.multiWallet;await f.disconnect(i?{id:r,namespace:t}:{}),n&&i&&(g.push(`ProfileWallets`),e.showSuccess(`Wallet deleted`))}catch{n.sendEvent({type:`track`,event:`DISCONNECT_ERROR`,properties:{message:`Failed to disconnect`}}),e.showError(`Failed to disconnect`)}finally{this.disconnecting=!1}}onGoToUpgradeView(){n.sendEvent({type:`track`,event:`EMAIL_UPGRADE_FROM_MODAL`}),g.push(`UpgradeEmailWallet`)}onSmartAccountSettings(){g.push(`SmartAccountSettings`)}};Qe([D()],$e.prototype,`address`,void 0),Qe([D()],$e.prototype,`profileImage`,void 0),Qe([D()],$e.prototype,`profileName`,void 0),Qe([D()],$e.prototype,`network`,void 0),Qe([D()],$e.prototype,`disconnecting`,void 0),Qe([D()],$e.prototype,`remoteFeatures`,void 0),$e=Qe([T(`w3m-account-settings-view`)],$e);var et=w`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`,tt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},nt={lg:`lg-regular`,md:`md-regular`,sm:`sm-regular`},rt={lg:`md`,md:`sm`,sm:`sm`},it=class extends b{constructor(){super(...arguments),this.icon=`mobile`,this.size=`md`,this.label=``,this.active=!1}render(){return S`
      <button data-active=${this.active}>
        ${this.icon?S`<wui-icon size=${rt[this.size]} name=${this.icon}></wui-icon>`:``}
        <wui-text variant=${nt[this.size]}> ${this.label} </wui-text>
      </button>
    `}};it.styles=[x,y,et],tt([O()],it.prototype,`icon`,void 0),tt([O()],it.prototype,`size`,void 0),tt([O()],it.prototype,`label`,void 0),tt([O({type:Boolean})],it.prototype,`active`,void 0),it=tt([T(`wui-tab-item`)],it);var at=w`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e[`01`]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`,ot=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},st=class extends b{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size=`md`,this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,t)=>{let n=t===this.activeTab;return S`
        <wui-tab-item
          @click=${()=>this.onTabClick(t)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${n}
          data-active=${n}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};st.styles=[x,y,at],ot([O({type:Array})],st.prototype,`tabs`,void 0),ot([O()],st.prototype,`onTabChange`,void 0),ot([O()],st.prototype,`size`,void 0),ot([D()],st.prototype,`activeTab`,void 0),st=ot([T(`wui-tabs`)],st);var ct=w`
  wui-icon-link {
    margin-right: calc(${({spacing:e})=>e[8]} * -1);
  }

  wui-notice-card {
    margin-bottom: ${({spacing:e})=>e[1]};
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .balance-container {
    display: inline;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .symbol {
    transform: translateY(-2px);
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[3]};
    height: 48px;
    padding: ${({spacing:e})=>e[2]};
    padding-right: ${({spacing:e})=>e[3]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
  }

  .account-button:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  wui-wallet-switch {
    margin-top: ${({spacing:e})=>e[2]};
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color ${({durations:e})=>e.md}
        ${({easings:e})=>e[`ease-out-power-1`]},
      opacity ${({durations:e})=>e.md} ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`,I=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},L=class extends b{constructor(){super(),this.unsubscribe=[],this.caipAddress=m.getAccountData()?.caipAddress,this.address=t.getPlainAddress(m.getAccountData()?.caipAddress),this.profileImage=m.getAccountData()?.profileImage,this.profileName=m.getAccountData()?.profileName,this.disconnecting=!1,this.balance=m.getAccountData()?.balance,this.balanceSymbol=m.getAccountData()?.balanceSymbol,this.features=d.state.features,this.remoteFeatures=d.state.remoteFeatures,this.namespace=m.state.activeChain,this.activeConnectorIds=u.state.activeConnectorIds,this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.address=t.getPlainAddress(e?.caipAddress),this.caipAddress=e?.caipAddress,this.balance=e?.balance,this.balanceSymbol=e?.balanceSymbol,this.profileName=e?.profileName,this.profileImage=e?.profileImage}),d.subscribeKey(`features`,e=>this.features=e),d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e),u.subscribeKey(`activeConnectorIds`,e=>{this.activeConnectorIds=e}),m.subscribeKey(`activeChain`,e=>this.namespace=e),m.subscribeKey(`activeCaipNetwork`,e=>{e?.chainNamespace&&(this.namespace=e?.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],n=e?u.getConnectorById(e):void 0,r=s.getConnectorImage(n),{value:i,decimals:a,symbol:o}=t.parseBalance(this.balance,this.balanceSymbol);return S`<wui-flex
        flexDirection="column"
        .padding=${[`0`,`5`,`4`,`5`]}
        alignItems="center"
        gap="3"
      >
        <wui-avatar
          alt=${k(this.caipAddress)}
          address=${k(t.getPlainAddress(this.caipAddress))}
          imageSrc=${k(this.profileImage===null?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${r}
          alt=${n?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <div class="balance-container">
          <wui-text variant="h3-regular" color="primary">${i}</wui-text>
          <wui-text variant="h3-regular" color="secondary">.${a}</wui-text>
          <wui-text variant="h6-medium" color="primary" class="symbol">${o}</wui-text>
        </div>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="2" .padding=${[`0`,`3`,`3`,`3`]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          .rounded=${!0}
          icon="power"
          iconColor="error"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          .rightIcon=${!1}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=a.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=!!this.features?.receive,n=this.remoteFeatures?.onramp&&e,r=_.isPayWithExchangeEnabled();return!n&&!t&&!r?null:S`
      <wui-list-item
        .rounded=${!0}
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="lg-regular" color="primary">Fund wallet</wui-text>
      </wui-list-item>
    `}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||a.DEFAULT_FEATURES.walletFeaturesOrder).map(e=>{switch(e){case`onramp`:return this.fundWalletTemplate();case`swaps`:return this.swapsTemplate();case`send`:return this.sendTemplate();default:return null}})}activityTemplate(){return this.namespace&&this.remoteFeatures?.activity&&a.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?S` <wui-list-item
          .rounded=${!0}
          icon="clock"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="lg-regular" color="primary">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=m.state.activeChain===p.CHAIN.EVM;return!e||!t?null:S`
      <wui-list-item
        .rounded=${!0}
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="lg-regular" color="primary">Swap</wui-text>
      </wui-list-item>
    `}sendTemplate(){let e=this.features?.send,t=m.state.activeChain;if(!t)throw Error(`SendController:sendTemplate - namespace is required`);let n=a.SEND_SUPPORTED_NAMESPACES.includes(t);return!e||!n?null:S`
      <wui-list-item
        .rounded=${!0}
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="lg-regular" color="primary">Send</wui-text>
      </wui-list-item>
    `}authCardTemplate(){let e=m.state.activeChain;if(!e)throw Error(`AuthCardTemplate:authCardTemplate - namespace is required`);let t=u.getConnectorId(e),n=u.getAuthConnector(),{origin:r}=location;return!n||t!==p.CONNECTOR_ID.AUTH||r.includes(a.SECURE_SITE)?null:S`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){g.push(`FundWallet`)}handleClickSwap(){g.push(`Swap`)}handleClickSend(){g.push(`WalletSend`)}explorerBtnTemplate(){return m.getAccountData()?.addressExplorerUrl?S`
      <wui-button size="md" variant="accent-primary" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){n.sendEvent({type:`track`,event:`CLICK_TRANSACTIONS`,properties:{isSmartAccount:re(m.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),g.push(`Transactions`)}async onDisconnect(){try{this.disconnecting=!0;let t=f.getConnections(this.namespace).length>0,n=this.namespace&&u.state.activeConnectorIds[this.namespace],r=this.remoteFeatures?.multiWallet;await f.disconnect(r?{id:n,namespace:this.namespace}:{}),t&&r&&(g.push(`ProfileWallets`),e.showSuccess(`Wallet deleted`))}catch{n.sendEvent({type:`track`,event:`DISCONNECT_ERROR`,properties:{message:`Failed to disconnect`}}),e.showError(`Failed to disconnect`)}finally{this.disconnecting=!1}}onExplorer(){let e=m.getAccountData()?.addressExplorerUrl;e&&t.openHref(e,`_blank`)}onGoToUpgradeView(){n.sendEvent({type:`track`,event:`EMAIL_UPGRADE_FROM_MODAL`}),g.push(`UpgradeEmailWallet`)}onGoToProfileWalletsView(){g.push(`ProfileWallets`)}};L.styles=ct,I([D()],L.prototype,`caipAddress`,void 0),I([D()],L.prototype,`address`,void 0),I([D()],L.prototype,`profileImage`,void 0),I([D()],L.prototype,`profileName`,void 0),I([D()],L.prototype,`disconnecting`,void 0),I([D()],L.prototype,`balance`,void 0),I([D()],L.prototype,`balanceSymbol`,void 0),I([D()],L.prototype,`features`,void 0),I([D()],L.prototype,`remoteFeatures`,void 0),I([D()],L.prototype,`namespace`,void 0),I([D()],L.prototype,`activeConnectorIds`,void 0),L=I([T(`w3m-account-default-widget`)],L);var lt=w`
  span {
    font-weight: 500;
    font-size: 38px;
    color: ${({tokens:e})=>e.theme.textPrimary};
    line-height: 38px;
    letter-spacing: -2%;
    text-align: center;
    font-family: var(--apkt-fontFamily-regular);
  }

  .pennies {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }
`,ut=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},dt=class extends b{constructor(){super(...arguments),this.dollars=`0`,this.pennies=`00`}render(){return S`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};dt.styles=[x,lt],ut([O()],dt.prototype,`dollars`,void 0),ut([O()],dt.prototype,`pennies`,void 0),dt=ut([T(`wui-balance`)],dt);var ft=w`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  /* -- Variants --------------------------------------------------------- */
  :host([data-variant='fill']) {
    background-color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) {
    background-color: ${({colors:e})=>e.neutrals900};
  }

  :host([data-variant='fill']) > wui-text {
    color: ${({colors:e})=>e.black};
  }

  :host([data-variant='shade']) > wui-text {
    color: ${({colors:e})=>e.white};
  }

  :host([data-variant='fill']) > wui-icon {
    color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) > wui-icon {
    color: ${({colors:e})=>e.neutrals900};
  }

  /* -- Sizes --------------------------------------------------------- */
  :host([data-size='sm']) {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) {
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  /* -- Placements --------------------------------------------------------- */
  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`,pt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},mt={sm:`sm-regular`,md:`md-regular`},ht=class extends b{constructor(){super(...arguments),this.placement=`top`,this.variant=`fill`,this.size=`md`,this.message=``}render(){return this.dataset.variant=this.variant,this.dataset.size=this.size,S`<wui-icon data-placement=${this.placement} size="inherit" name="cursor"></wui-icon>
      <wui-text variant=${mt[this.size]}>${this.message}</wui-text>`}};ht.styles=[x,y,ft],pt([O()],ht.prototype,`placement`,void 0),pt([O()],ht.prototype,`variant`,void 0),pt([O()],ht.prototype,`size`,void 0),pt([O()],ht.prototype,`message`,void 0),ht=pt([T(`wui-tooltip`)],ht);var gt=E`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`,_t=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},vt=class extends b{render(){return S`<w3m-activity-list page="account"></w3m-activity-list>`}};vt.styles=gt,vt=_t([T(`w3m-account-activity-widget`)],vt);var yt=w`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[4]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    max-width: 174px;
  }

  .tag-container {
    width: fit-content;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`,bt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},xt=class extends b{constructor(){super(...arguments),this.icon=`card`,this.text=``,this.description=``,this.tag=void 0,this.disabled=!1}render(){return S`
      <button ?disabled=${this.disabled}>
        <wui-flex alignItems="center" gap="3">
          <wui-icon-box padding="2" color="secondary" icon=${this.icon} size="lg"></wui-icon-box>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.text}</wui-text>
            ${this.description?S`<wui-text variant="md-regular" color="secondary">
                  ${this.description}</wui-text
                >`:null}
          </wui-flex>
        </wui-flex>

        <wui-flex class="tag-container" alignItems="center" gap="1" justifyContent="flex-end">
          ${this.tag?S`<wui-tag tagType="main" size="sm">${this.tag}</wui-tag>`:null}
          <wui-icon size="md" name="chevronRight" color="default"></wui-icon>
        </wui-flex>
      </button>
    `}};xt.styles=[x,y,yt],bt([O()],xt.prototype,`icon`,void 0),bt([O()],xt.prototype,`text`,void 0),bt([O()],xt.prototype,`description`,void 0),bt([O()],xt.prototype,`tag`,void 0),bt([O({type:Boolean})],xt.prototype,`disabled`,void 0),xt=bt([T(`wui-list-description`)],xt);var St=E`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`,Ct=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},wt=class extends b{constructor(){super(),this.unsubscribe=[],this.tokenBalance=m.getAccountData()?.tokenBalance,this.remoteFeatures=d.state.remoteFeatures,this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.tokenBalance=e?.tokenBalance}),d.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?S`<wui-flex class="contentContainer" flexDirection="column" gap="2">
        ${this.tokenItemTemplate()}
      </wui-flex>`:S` <wui-flex flexDirection="column">
      ${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){return this.remoteFeatures?.onramp?S`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:S``}tokenItemTemplate(){return this.tokenBalance?.map(e=>S`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`)}onReceiveClick(){g.push(`WalletReceive`)}onBuyClick(){n.sendEvent({type:`track`,event:`SELECT_BUY_CRYPTO`,properties:{isSmartAccount:re(m.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),g.push(`OnRampProviders`)}};wt.styles=St,Ct([D()],wt.prototype,`tokenBalance`,void 0),Ct([D()],wt.prototype,`remoteFeatures`,void 0),wt=Ct([T(`w3m-account-tokens-widget`)],wt);var Tt=w`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * ${({spacing:e})=>e[4]});
  }

  wui-promo + wui-profile-button {
    margin-top: ${({spacing:e})=>e[4]};
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`,R=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},z=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.network=m.state.activeCaipNetwork,this.profileName=m.getAccountData()?.profileName,this.address=m.getAccountData()?.address,this.currentTab=m.getAccountData()?.currentTab,this.tokenBalance=m.getAccountData()?.tokenBalance,this.features=d.state.features,this.namespace=m.state.activeChain,this.activeConnectorIds=u.state.activeConnectorIds,this.remoteFeatures=d.state.remoteFeatures}firstUpdated(){m.fetchTokenBalance(),this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{e?.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):h.close()}),u.subscribeKey(`activeConnectorIds`,e=>{this.activeConnectorIds=e}),m.subscribeKey(`activeChain`,e=>this.namespace=e),m.subscribeKey(`activeCaipNetwork`,e=>this.network=e),d.subscribeKey(`features`,e=>this.features=e),d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}render(){if(!this.address)throw Error(`w3m-account-features-widget: No account provided`);if(!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],t=e?u.getConnectorById(e):void 0,{icon:n,iconSize:r}=this.getAuthData();return S`<wui-flex
      flexDirection="column"
      .padding=${[`0`,`3`,`4`,`3`]}
      alignItems="center"
      gap="4"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="2">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${n}
          iconSize=${r}
          alt=${t?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){let e=this.features?.walletFeaturesOrder||a.DEFAULT_FEATURES.walletFeaturesOrder;if(e.every(e=>e===`send`||e===`receive`?!this.features?.[e]:e===`swaps`||e===`onramp`?!this.remoteFeatures?.[e]:!0))return null;let t=e.map(e=>e===`receive`||e===`onramp`?`fund`:e);return S`<wui-flex gap="2">
      ${[...new Set(t)].map(e=>{switch(e){case`fund`:return this.fundWalletTemplate();case`swaps`:return this.swapsTemplate();case`send`:return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=a.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=this.features?.receive,n=this.remoteFeatures?.onramp&&e,r=_.isPayWithExchangeEnabled();return!n&&!t&&!r?null:S`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          variant="accent-secondary"
          size="lg"
          fullWidth
        >
          <wui-icon name="dollar"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=m.state.activeChain===p.CHAIN.EVM;return!e||!t?null:S`
      <w3m-tooltip-trigger text="Swap">
        <wui-button
          fullWidth
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="recycleHorizontal"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}sendTemplate(){let e=this.features?.send,t=m.state.activeChain,n=a.SEND_SUPPORTED_NAMESPACES.includes(t);return!e||!n?null:S`
      <w3m-tooltip-trigger text="Send">
        <wui-button
          fullWidth
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="send"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}watchSwapValues(){this.watchTokenBalance=setInterval(()=>m.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){e instanceof Error&&e.cause instanceof Response&&e.cause.status===p.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return this.currentTab===0?S`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:this.currentTab===1?S`<w3m-account-activity-widget></w3m-account-activity-widget>`:S`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){let e=t.calculateBalance(this.tokenBalance),{dollars:n=`0`,pennies:r=`00`}=t.formatTokenBalance(e);return S`<wui-balance dollars=${n} pennies=${r}></wui-balance>`}return S`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){let e=Ce.getTabsByNamespace(m.state.activeChain);return e.length===0?null:S`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){m.setAccountProp(`currentTab`,e,this.namespace)}onFundWalletClick(){g.push(`FundWallet`)}onSwapClick(){this.network?.caipNetworkId&&!a.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?g.push(`UnsupportedChain`,{swapUnsupportedChain:!0}):(n.sendEvent({type:`track`,event:`OPEN_SWAP`,properties:{network:this.network?.caipNetworkId||``,isSmartAccount:re(m.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),g.push(`Swap`))}getAuthData(){let e=c.getConnectedSocialProvider(),t=c.getConnectedSocialUsername(),n=u.getAuthConnector()?.provider.getEmail()??``;return{name:te.getAuthName({email:n,socialUsername:t,socialProvider:e}),icon:e??`mail`,iconSize:e?`xl`:`md`}}onGoToProfileWalletsView(){g.push(`ProfileWallets`)}onSendClick(){n.sendEvent({type:`track`,event:`OPEN_SEND`,properties:{network:this.network?.caipNetworkId||``,isSmartAccount:re(m.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),g.push(`WalletSend`)}};z.styles=Tt,R([D()],z.prototype,`watchTokenBalance`,void 0),R([D()],z.prototype,`network`,void 0),R([D()],z.prototype,`profileName`,void 0),R([D()],z.prototype,`address`,void 0),R([D()],z.prototype,`currentTab`,void 0),R([D()],z.prototype,`tokenBalance`,void 0),R([D()],z.prototype,`features`,void 0),R([D()],z.prototype,`namespace`,void 0),R([D()],z.prototype,`activeConnectorIds`,void 0),R([D()],z.prototype,`remoteFeatures`,void 0),z=R([T(`w3m-account-wallet-features-widget`)],z);var Et=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Dt=class extends b{constructor(){super(),this.unsubscribe=[],this.namespace=m.state.activeChain,this.unsubscribe.push(m.subscribeKey(`activeChain`,e=>{this.namespace=e}))}render(){if(!this.namespace)return null;let e=u.getConnectorId(this.namespace);return S`
      ${u.getAuthConnector()&&e===p.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return S`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return S`<w3m-account-default-widget></w3m-account-default-widget>`}};Et([D()],Dt.prototype,`namespace`,void 0),Dt=Et([T(`w3m-account-view`)],Dt);var Ot=w`
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    border-radius: ${({borderRadius:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e[`01`]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`,B=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},V=class extends b{constructor(){super(...arguments),this.address=``,this.profileName=``,this.content=[],this.alt=``,this.imageSrc=``,this.icon=void 0,this.iconSize=`md`,this.iconBadge=void 0,this.iconBadgeSize=`md`,this.buttonVariant=`neutral-primary`,this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return S`
      <wui-flex flexDirection="column" rowgap="2">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return S`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?S`<wui-icon-link
              variant="secondary"
              size="md"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return S` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?S`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?S`<wui-icon
                  color="accent-primary"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:S`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return this.content.length===0?null:S`
      <wui-flex flexDirection="column" rowgap="3">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:t,label:n,description:r,enableButton:i,buttonType:a,buttonLabel:o,buttonVariant:s,tagVariant:c,tagLabel:l,alignItems:ee=`flex-end`}){return S`
      <wui-flex justifyContent="space-between" alignItems=${ee} columngap="1">
        <wui-flex flexDirection="column" rowgap="01">
          ${n?S`<wui-text variant="sm-medium" color="secondary">${n}</wui-text>`:null}

          <wui-flex alignItems="center" columngap="1">
            <wui-text variant="md-regular" color="primary">
              ${C.getTruncateString({string:t||e,charsStart:t?16:this.charsStart,charsEnd:t?0:this.charsEnd,truncate:t?`end`:`middle`})}
            </wui-text>

            ${c&&l?S`<wui-tag variant=${c} size="sm">${l}</wui-tag>`:null}
          </wui-flex>

          ${r?S`<wui-text variant="sm-regular" color="secondary">${r}</wui-text>`:null}
        </wui-flex>

        ${i?this.buttonTemplate({buttonType:a,buttonLabel:o,buttonVariant:s}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:t,buttonVariant:n}){return S`
      <wui-button
        size="sm"
        variant=${n}
        @click=${e===`disconnect`?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${e===`disconnect`?`wui-active-profile-wallet-item-disconnect-button`:`wui-active-profile-wallet-item-switch-button`}
      >
        ${t}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent(`disconnect`,{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent(`switch`,{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent(`externalLink`,{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent(`more`,{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent(`copy`,{bubbles:!0,composed:!0}))}};V.styles=[x,y,Ot],B([O()],V.prototype,`address`,void 0),B([O()],V.prototype,`profileName`,void 0),B([O({type:Array})],V.prototype,`content`,void 0),B([O()],V.prototype,`alt`,void 0),B([O()],V.prototype,`imageSrc`,void 0),B([O()],V.prototype,`icon`,void 0),B([O()],V.prototype,`iconSize`,void 0),B([O()],V.prototype,`iconBadge`,void 0),B([O()],V.prototype,`iconBadgeSize`,void 0),B([O()],V.prototype,`buttonVariant`,void 0),B([O({type:Boolean})],V.prototype,`enableMoreButton`,void 0),B([O({type:Number})],V.prototype,`charsStart`,void 0),B([O({type:Number})],V.prototype,`charsEnd`,void 0),V=B([T(`wui-active-profile-wallet-item`)],V);var kt=w`
  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e[`01`]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`,H=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},U=class extends b{constructor(){super(...arguments),this.address=``,this.profileName=``,this.alt=``,this.buttonLabel=``,this.buttonVariant=`accent-primary`,this.imageSrc=``,this.icon=void 0,this.iconSize=`md`,this.iconBadgeSize=`md`,this.rightIcon=`signOut`,this.rightIconSize=`md`,this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return S`
      <wui-flex alignItems="center" columngap="2">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?S`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?S`<wui-icon
                  color="default"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:S`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return S`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="lg-regular" color="primary">
          ${C.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?`end`:`middle`})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return S`
      <wui-flex columngap="1" alignItems="center" justifyContent="center">
        <wui-button
          size="sm"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          variant="secondary"
          size="md"
          icon=${k(this.rightIcon)}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent(`buttonClick`,{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent(`iconClick`,{bubbles:!0,composed:!0}))}};U.styles=[x,y,kt],H([O()],U.prototype,`address`,void 0),H([O()],U.prototype,`profileName`,void 0),H([O()],U.prototype,`alt`,void 0),H([O()],U.prototype,`buttonLabel`,void 0),H([O()],U.prototype,`buttonVariant`,void 0),H([O()],U.prototype,`imageSrc`,void 0),H([O()],U.prototype,`icon`,void 0),H([O()],U.prototype,`iconSize`,void 0),H([O()],U.prototype,`iconBadge`,void 0),H([O()],U.prototype,`iconBadgeSize`,void 0),H([O()],U.prototype,`rightIcon`,void 0),H([O()],U.prototype,`rightIconSize`,void 0),H([O({type:Boolean})],U.prototype,`loading`,void 0),H([O({type:Number})],U.prototype,`charsStart`,void 0),H([O({type:Number})],U.prototype,`charsEnd`,void 0),U=H([T(`wui-inactive-profile-wallet-item`)],U);var At={getAuthData(e){let t=e.connectorId===p.CONNECTOR_ID.AUTH;if(!t)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};let n=e?.auth?.name??c.getConnectedSocialProvider(),r=e?.auth?.username??c.getConnectedSocialUsername(),i=u.getAuthConnector()?.provider.getEmail()??``;return{isAuth:!0,icon:n??`mail`,iconSize:n?`xl`:`md`,name:t?te.getAuthName({email:i,socialUsername:r,socialProvider:n}):void 0}}},jt=w`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({easings:e})=>e[`ease-out-power-1`]}
      ${({durations:e})=>e.md};
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: ${({spacing:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-separator {
    margin: ${({spacing:e})=>e[2]} 0 ${({spacing:e})=>e[2]} 0;
  }

  .active-connection {
    padding: ${({spacing:e})=>e[2]};
  }

  .recent-connection {
    padding: ${({spacing:e})=>e[2]} 0 ${({spacing:e})=>e[2]} 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`,W=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},G={ADDRESS_DISPLAY:{START:4,END:6},BADGE:{SIZE:`md`,ICON:`lightbulb`},SCROLL_THRESHOLD:50,OPACITY_RANGE:[0,1]},Mt={eip155:`ethereum`,solana:`solana`,bip122:`bitcoin`,ton:`ton`,tron:`tron`},Nt=[{namespace:`eip155`,icon:Mt.eip155,label:`EVM`},{namespace:`solana`,icon:Mt.solana,label:`Solana`},{namespace:`bip122`,icon:Mt.bip122,label:`Bitcoin`},{namespace:`ton`,icon:Mt.ton,label:`Ton`},{namespace:`tron`,icon:Mt.tron,label:`Tron`}],Pt={eip155:{title:`Add EVM Wallet`,description:`Add your first EVM wallet`},solana:{title:`Add Solana Wallet`,description:`Add your first Solana wallet`},bip122:{title:`Add Bitcoin Wallet`,description:`Add your first Bitcoin wallet`},ton:{title:`Add TON Wallet`,description:`Add your first TON wallet`},tron:{title:`Add TRON Wallet`,description:`Add your first TRON wallet`}},K=class extends b{constructor(){super(),this.unsubscribers=[],this.currentTab=0,this.namespace=m.state.activeChain,this.namespaces=Array.from(m.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=u.state.activeConnectorIds,this.lastSelectedAddress=``,this.lastSelectedConnectorId=``,this.isSwitching=!1,this.caipNetwork=m.state.activeCaipNetwork,this.user=m.getAccountData()?.user,this.remoteFeatures=d.state.remoteFeatures,this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=m.getAccountData(this.namespace)?.caipAddress,this.profileName=m.getAccountData(this.namespace)?.profileName,this.unsubscribers.push(f.subscribeKey(`connections`,()=>this.onConnectionsChange()),f.subscribeKey(`recentConnections`,()=>this.requestUpdate()),u.subscribeKey(`activeConnectorIds`,e=>{this.activeConnectorIds=e}),m.subscribeKey(`activeCaipNetwork`,e=>this.caipNetwork=e),m.subscribeChainProp(`accountState`,e=>{this.user=e?.user}),d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e)),this.chainListener=m.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName},this.namespace)}disconnectedCallback(){this.unsubscribers.forEach(e=>e()),this.resizeObserver?.disconnect(),this.removeScrollListener(),this.chainListener?.()}firstUpdated(){let e=this.shadowRoot?.querySelector(`.wallet-list`);if(!e)return;let t=()=>this.updateScrollOpacity(e);requestAnimationFrame(t),e.addEventListener(`scroll`,t),this.resizeObserver=new ResizeObserver(t),this.resizeObserver.observe(e),t()}render(){let e=this.namespace;if(!e)throw Error(`Namespace is not set`);return S`
      <wui-flex flexDirection="column" .padding=${[`0`,`4`,`4`,`4`]} gap="4">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){let e=this.namespaces.map(e=>Nt.find(t=>t.namespace===e)).filter(Boolean);return e.length>1?S`
        <wui-tabs
          .onTabChange=${e=>this.handleTabChange(e)}
          .activeTab=${this.currentTab}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){let t=this.getActiveConnections(e).flatMap(({accounts:e})=>e).length+(this.caipAddress?1:0);return S`
      <wui-flex alignItems="center" columngap="1">
        <wui-icon
          size="sm"
          name=${Mt[e]??Mt.eip155}
        ></wui-icon>
        <wui-text color="secondary" variant="lg-regular"
          >${t>1?`Wallets`:`Wallet`}</wui-text
        >
        <wui-text
          color="primary"
          variant="lg-regular"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${t}
        </wui-text>
        <wui-link
          color="secondary"
          variant="secondary"
          @click=${()=>f.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){let t=this.hasAnyConnections(e);return S`
      <wui-flex flexDirection="column" class=${ve({"wallet-list":!0,"active-wallets-box":t,"empty-wallet-list-box":!t})} rowgap="3">
        ${t?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){let t=this.getActiveConnections(e),n=this.activeConnectorIds[e];return S`
      ${this.getPlainAddress()||n||t.length>0?S`<wui-flex
            flexDirection="column"
            .padding=${[`4`,`0`,`4`,`0`]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){let t=this.activeConnectorIds[e];if(!t)return null;let{connections:n}=ne.getConnectionsData(e),r=u.getConnectorById(t),i=s.getConnectorImage(r),a=this.getPlainAddress();if(!a)return null;let o=e===p.CHAIN.BITCOIN,c=At.getAuthData({connectorId:t,accounts:[]}),l=this.getActiveConnections(e).flatMap(e=>e.accounts).length>0,ee=n.find(e=>e.connectorId===t),te=ee?.accounts.filter(e=>!v.isLowerCaseMatch(e.address,a));return S`
      <wui-flex flexDirection="column" .padding=${[`0`,`4`,`0`,`4`]}>
        <wui-active-profile-wallet-item
          address=${a}
          alt=${r?.name}
          .content=${this.getProfileContent({address:a,connections:n,connectorId:t,namespace:e})}
          .charsStart=${G.ADDRESS_DISPLAY.START}
          .charsEnd=${G.ADDRESS_DISPLAY.END}
          .icon=${c.icon}
          .iconSize=${c.iconSize}
          .iconBadge=${this.isSmartAccount(a)?G.BADGE.ICON:void 0}
          .iconBadgeSize=${this.isSmartAccount(a)?G.BADGE.SIZE:void 0}
          imageSrc=${i}
          ?enableMoreButton=${c.isAuth}
          @copy=${()=>this.handleCopyAddress(a)}
          @disconnect=${()=>this.handleDisconnect(e,t)}
          @switch=${()=>{o&&ee&&te?.[0]&&this.handleSwitchWallet(ee,te[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(a)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${l?S`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){let t=this.getActiveConnections(e);return t.length===0?null:S`
      <wui-flex flexDirection="column" .padding=${[`0`,`2`,`0`,`2`]}>
        ${this.renderConnectionList(t,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){let{recentConnections:t}=ne.getConnectionsData(e);return t.flatMap(e=>e.accounts).length===0?null:S`
      <wui-flex flexDirection="column" .padding=${[`0`,`2`,`0`,`2`]} rowGap="2">
        <wui-text color="secondary" variant="sm-medium" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${[`0`,`2`,`0`,`2`]}>
          ${this.renderConnectionList(t,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,t,n){return e.filter(e=>e.accounts.length>0).map((e,r)=>{let i=u.getConnectorById(e.connectorId),a=s.getConnectorImage(i)??``,o=At.getAuthData(e);return e.accounts.map((i,s)=>{let c=r!==0||s!==0,l=this.isAccountLoading(e.connectorId,i.address);return S`
            <wui-flex flexDirection="column">
              ${c?S`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${i.address}
                alt=${e.connectorId}
                buttonLabel=${t?`Connect`:`Switch`}
                buttonVariant=${t?`neutral-secondary`:`accent-secondary`}
                rightIcon=${t?`bin`:`power`}
                rightIconSize="sm"
                class=${t?`recent-connection`:`active-connection`}
                data-testid=${t?`recent-connection`:`active-connection`}
                imageSrc=${a}
                .iconBadge=${this.isSmartAccount(i.address)?G.BADGE.ICON:void 0}
                .iconBadgeSize=${this.isSmartAccount(i.address)?G.BADGE.SIZE:void 0}
                .icon=${o.icon}
                .iconSize=${o.iconSize}
                .loading=${l}
                .showBalance=${!1}
                .charsStart=${G.ADDRESS_DISPLAY.START}
                .charsEnd=${G.ADDRESS_DISPLAY.END}
                @buttonClick=${()=>this.handleSwitchWallet(e,i.address,n)}
                @iconClick=${()=>this.handleWalletAction({connection:e,address:i.address,isRecentConnection:t,namespace:n})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(e))return null;let{title:t}=this.getChainLabelInfo(e);return S`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="md-medium" color="secondary">${t}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){let{title:t,description:n}=this.getChainLabelInfo(e);return S`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowgap="3"
          class="empty-box"
        >
          <wui-icon-box size="xl" icon="wallet" color="secondary"></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="1">
            <wui-text color="primary" variant="lg-regular" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="secondary" variant="md-regular" data-testid="empty-state-description"
              >${n}</wui-text
            >
          </wui-flex>

          <wui-link
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
            icon="plus"
          >
            ${t}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){let t=this.namespaces[e];t&&(this.chainListener?.(),this.currentTab=this.namespaces.indexOf(t),this.namespace=t,this.caipAddress=m.getAccountData(t)?.caipAddress,this.profileName=m.getAccountData(t)?.profileName,this.chainListener=m.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress},t))}async handleSwitchWallet(t,n,r){try{this.isSwitching=!0,this.lastSelectedConnectorId=t.connectorId,this.lastSelectedAddress=n,this.caipNetwork?.chainNamespace!==r&&t?.caipNetwork&&(u.setFilterByNamespace(r),await m.switchActiveNetwork(t?.caipNetwork)),await f.switchConnection({connection:t,address:n,namespace:r,closeModalOnConnect:!1,onChange({hasSwitchedAccount:t,hasSwitchedWallet:n}){n?e.showSuccess(`Wallet switched`):t&&e.showSuccess(`Account switched`)}})}catch{e.showError(`Failed to switch wallet`)}finally{this.isSwitching=!1}}handleWalletAction(t){let{connection:n,address:r,isRecentConnection:i,namespace:a}=t;i?(c.deleteAddressFromConnection({connectorId:n.connectorId,address:r,namespace:a}),f.syncStorageConnections(),e.showSuccess(`Wallet deleted`)):this.handleDisconnect(a,n.connectorId)}async handleDisconnect(t,n){try{await f.disconnect({id:n,namespace:t}),e.showSuccess(`Wallet disconnected`)}catch{e.showError(`Failed to disconnect wallet`)}}handleCopyAddress(n){t.copyToClopboard(n),e.showSuccess(`Address copied`)}handleMore(){g.push(`AccountSettings`)}handleExternalLink(e){let n=this.caipNetwork?.blockExplorers?.default.url;n&&t.openHref(`${n}/address/${e}`,`_blank`)}handleAddConnection(e){u.setFilterByNamespace(e),g.push(`Connect`,{addWalletForNamespace:e})}getChainLabelInfo(e){return Pt[e]??{title:`Add Wallet`,description:`Add your first wallet`}}isSmartAccount(e){if(!this.namespace)return!1;let t=this.user?.accounts?.find(e=>e.type===`smartAccount`);return t&&e?v.isLowerCaseMatch(t.address,e):!1}getPlainAddress(){return this.caipAddress?t.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){let t=this.activeConnectorIds[e],{connections:n}=ne.getConnectionsData(e),[r]=n.filter(e=>v.isLowerCaseMatch(e.connectorId,t));if(!t)return n;let i=e===p.CHAIN.BITCOIN,{address:a}=this.caipAddress?ee.parseCaipAddress(this.caipAddress):{},o=[...a?[a]:[]];return i&&r&&(o=r.accounts.map(e=>e.address)||[]),ne.excludeConnectorAddressFromConnections({connectorId:t,addresses:o,connections:n})}hasAnyConnections(e){let t=this.getActiveConnections(e),{recentConnections:n}=ne.getConnectionsData(e);return!!this.caipAddress||t.length>0||n.length>0}isAccountLoading(e,t){return v.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&v.isLowerCaseMatch(this.lastSelectedAddress,t)&&this.isSwitching}getProfileContent(e){let{address:t,connections:n,connectorId:r,namespace:i}=e,[a]=n.filter(e=>v.isLowerCaseMatch(e.connectorId,r));if(i===p.CHAIN.BITCOIN&&a?.accounts.every(e=>typeof e.type==`string`))return this.getBitcoinProfileContent(a.accounts,t);let o=At.getAuthData({connectorId:r,accounts:[]});return[{address:t,tagLabel:`Active`,tagVariant:`success`,enableButton:!0,profileName:this.profileName,buttonType:`disconnect`,buttonLabel:`Disconnect`,buttonVariant:`neutral-secondary`,...o.isAuth?{description:this.isSmartAccount(t)?`Smart Account`:`EOA Account`}:{}}]}getBitcoinProfileContent(e,t){let n=e.length>1,r=this.getPlainAddress();return e.map(e=>{let i=v.isLowerCaseMatch(e.address,r),a=`PAYMENT`;return e.type===`ordinal`&&(a=`ORDINALS`),{address:e.address,tagLabel:v.isLowerCaseMatch(e.address,t)?`Active`:void 0,tagVariant:v.isLowerCaseMatch(e.address,t)?`success`:void 0,enableButton:!0,...n?{label:a,alignItems:`flex-end`,buttonType:i?`disconnect`:`switch`,buttonLabel:i?`Disconnect`:`Switch`,buttonVariant:i?`neutral-secondary`:`accent-secondary`}:{alignItems:`center`,buttonType:`disconnect`,buttonLabel:`Disconnect`,buttonVariant:`neutral-secondary`}}})}removeScrollListener(){let e=this.shadowRoot?.querySelector(`.wallet-list`);e&&e.removeEventListener(`scroll`,()=>this.handleConnectListScroll())}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(`.wallet-list`);e&&this.updateScrollOpacity(e)}isMultiWalletEnabled(){return!!this.remoteFeatures?.multiWallet}updateScrollOpacity(e){e.style.setProperty(`--connect-scroll--top-opacity`,_e.interpolate([0,G.SCROLL_THRESHOLD],G.OPACITY_RANGE,e.scrollTop).toString()),e.style.setProperty(`--connect-scroll--bottom-opacity`,_e.interpolate([0,G.SCROLL_THRESHOLD],G.OPACITY_RANGE,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){let{connections:e}=ne.getConnectionsData(this.namespace);e.length===0&&g.reset(`ProfileWallets`)}this.requestUpdate()}};K.styles=jt,W([D()],K.prototype,`currentTab`,void 0),W([D()],K.prototype,`namespace`,void 0),W([D()],K.prototype,`namespaces`,void 0),W([D()],K.prototype,`caipAddress`,void 0),W([D()],K.prototype,`profileName`,void 0),W([D()],K.prototype,`activeConnectorIds`,void 0),W([D()],K.prototype,`lastSelectedAddress`,void 0),W([D()],K.prototype,`lastSelectedConnectorId`,void 0),W([D()],K.prototype,`isSwitching`,void 0),W([D()],K.prototype,`caipNetwork`,void 0),W([D()],K.prototype,`user`,void 0),W([D()],K.prototype,`remoteFeatures`,void 0),K=W([T(`w3m-profile-wallets-view`)],K);var Ft=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},It=class extends b{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=m.state.activeCaipNetwork,this.features=d.state.features,this.remoteFeatures=d.state.remoteFeatures,this.exchangesLoading=_.state.isLoading,this.exchanges=_.state.exchanges,this.unsubscribe.push(d.subscribeKey(`features`,e=>this.features=e),d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e),m.subscribeKey(`activeCaipNetwork`,e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),_.subscribeKey(`isLoading`,e=>this.exchangesLoading=e),_.subscribeKey(`exchanges`,e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){_.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await _.fetchExchanges())}render(){return S`
      <wui-flex flexDirection="column" .padding=${[`1`,`3`,`3`,`3`]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;let e=await _.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),t=e.find(e=>e.metadata.symbol===`USDC`)||e[0];t&&_.setPaymentAsset(t)}onrampTemplate(){if(!this.activeCaipNetwork)return null;let e=this.remoteFeatures?.onramp,t=a.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return!e||!t?null:S`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `}depositFromExchangeTemplate(){return!this.activeCaipNetwork||!_.isPayWithExchangeSupported()?null:S`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="arrowBottomCircle"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `}receiveTemplate(){return this.features?.receive?S`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `:null}onBuyCrypto(){g.push(`OnRampProviders`)}onReceive(){g.push(`WalletReceive`)}onDepositFromExchange(){_.reset(),g.push(`PayWithExchange`,{redirectView:g.state.data?.redirectView})}};Ft([D()],It.prototype,`activeCaipNetwork`,void 0),Ft([D()],It.prototype,`features`,void 0),Ft([D()],It.prototype,`remoteFeatures`,void 0),Ft([D()],It.prototype,`exchangesLoading`,void 0),Ft([D()],It.prototype,`exchanges`,void 0),It=Ft([T(`w3m-fund-wallet-view`)],It);var Lt=w`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`,Rt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},zt=class extends b{constructor(){super(...arguments),this.inputElementRef=Se(),this.checked=!1,this.disabled=!1,this.size=`md`}render(){return S`
      <label data-size=${this.size}>
        <input
          ${xe(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent(`switchChange`,{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};zt.styles=[x,y,Lt],Rt([O({type:Boolean})],zt.prototype,`checked`,void 0),Rt([O({type:Boolean})],zt.prototype,`disabled`,void 0),Rt([O()],zt.prototype,`size`,void 0),zt=Rt([T(`wui-toggle`)],zt);var Bt=w`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`,Vt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ht=class extends b{constructor(){super(...arguments),this.checked=!1}render(){return S`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent(`certifiedSwitchChange`,{detail:this.checked,bubbles:!0,composed:!0}))}};Ht.styles=[x,y,Bt],Vt([O({type:Boolean})],Ht.prototype,`checked`,void 0),Ht=Vt([T(`wui-certified-switch`)],Ht);var Ut=w`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`,Wt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Gt=class extends b{constructor(){super(...arguments),this.inputComponentRef=Se(),this.inputValue=``}render(){return S`
      <wui-input-text
        ${xe(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?S`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||``}clearValue(){let e=this.inputComponentRef.value?.inputElementRef.value;e&&(e.value=``,this.inputValue=``,e.focus(),e.dispatchEvent(new Event(`input`)))}};Gt.styles=[x,Ut],Wt([O()],Gt.prototype,`inputValue`,void 0),Gt=Wt([T(`wui-search-bar`)],Gt);var Kt=w`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`,qt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Jt=class extends b{constructor(){super(...arguments),this.type=`wallet`}render(){return S`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return this.type===`network`?S` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${ye}`:S`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Jt.styles=[x,y,Kt],qt([O()],Jt.prototype,`type`,void 0),Jt=qt([T(`wui-card-select-loader`)],Jt);var Yt=E`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`,q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},J=class extends b{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&C.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&C.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&C.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&C.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&C.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&C.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&C.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&C.getSpacingStyles(this.margin,3)};
    `,S`<slot></slot>`}};J.styles=[x,Yt],q([O()],J.prototype,`gridTemplateRows`,void 0),q([O()],J.prototype,`gridTemplateColumns`,void 0),q([O()],J.prototype,`justifyItems`,void 0),q([O()],J.prototype,`alignItems`,void 0),q([O()],J.prototype,`justifyContent`,void 0),q([O()],J.prototype,`alignContent`,void 0),q([O()],J.prototype,`columnGap`,void 0),q([O()],J.prototype,`rowGap`,void 0),q([O()],J.prototype,`gap`,void 0),q([O()],J.prototype,`padding`,void 0),q([O()],J.prototype,`margin`,void 0),J=q([T(`wui-grid`)],J);var Xt=w`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[0]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e[4]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-1`]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-1`]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`,Zt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Y=class extends b{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId=``,this.walletQuery=``,this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type===`certified`;return S`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${k(e?`certified`:void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?S`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():S`
      <wui-wallet-image
        size="lg"
        imageSrc=${k(this.imageSrc)}
        name=${k(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return S`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=s.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await s.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){!this.wallet||this.isImpressed||(this.isImpressed=!0,n.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:g.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};Y.styles=Xt,Zt([D()],Y.prototype,`visible`,void 0),Zt([D()],Y.prototype,`imageSrc`,void 0),Zt([D()],Y.prototype,`imageLoading`,void 0),Zt([D()],Y.prototype,`isImpressed`,void 0),Zt([O()],Y.prototype,`explorerId`,void 0),Zt([O()],Y.prototype,`walletQuery`,void 0),Zt([O()],Y.prototype,`certified`,void 0),Zt([O()],Y.prototype,`displayIndex`,void 0),Zt([O({type:Object})],Y.prototype,`wallet`,void 0),Y=Zt([T(`w3m-all-wallets-list-item`)],Y);var Qt=w`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e[`ease-inout-power-2`]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e[4]};
    padding-bottom: ${({spacing:e})=>e[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`,$t=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},en=`local-paginator`,tn=class extends b{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!o.state.wallets.length,this.wallets=o.state.wallets,this.mobileFullScreen=d.state.enableMobileFullScreen,this.unsubscribe.push(o.subscribeKey(`wallets`,e=>this.wallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute(`data-mobile-fullscreen`,`true`),S`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${[`0`,`3`,`3`,`3`]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector(`wui-grid`);e&&(await o.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:`forwards`,easing:`ease`}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:`forwards`,easing:`ease`}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>S`
        <wui-card-select-loader type="wallet" id=${k(t)}></wui-card-select-loader>
      `)}walletsTemplate(){return se.getWalletConnectWallets(this.wallets).map((e,t)=>S`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${this.badge===`certified`}
          displayIndex=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:t,featured:n,count:r,mobileFilteredOutWalletsLength:i}=o.state,a=window.innerWidth<352?3:4,s=e.length+t.length,c=Math.ceil(s/a)*a-s+a;return c-=e.length?n.length%a:0,r===0&&n.length>0?null:r===0||[...n,...e,...t].length<r-(i??0)?this.shimmerTemplate(c,en):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${en}`);e&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){let{page:e,count:t,wallets:n}=o.state;n.length<t&&o.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){u.selectWalletConnector(e)}};tn.styles=Qt,$t([D()],tn.prototype,`loading`,void 0),$t([D()],tn.prototype,`wallets`,void 0),$t([D()],tn.prototype,`badge`,void 0),$t([D()],tn.prototype,`mobileFullScreen`,void 0),tn=$t([T(`w3m-all-wallets-list`)],tn);var nn=E`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`,rn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},an=class extends b{constructor(){super(...arguments),this.prevQuery=``,this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=d.state.enableMobileFullScreen,this.query=``}render(){return this.mobileFullScreen&&this.setAttribute(`data-mobile-fullscreen`,`true`),this.onSearch(),this.loading?S`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await o.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=o.state,t=se.markWalletsAsInstalled(e),n=se.filterWalletsByWcSupport(t);return n.length?S`
      <wui-grid
        data-testid="wallet-list"
        .padding=${[`0`,`3`,`3`,`3`]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${n.map((e,t)=>S`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
              explorerId=${e.id}
              certified=${this.badge===`certified`}
              walletQuery=${this.query}
              displayIndex=${t}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:S`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){u.selectWalletConnector(e)}};an.styles=nn,rn([D()],an.prototype,`loading`,void 0),rn([D()],an.prototype,`mobileFullScreen`,void 0),rn([O()],an.prototype,`query`,void 0),rn([O()],an.prototype,`badge`,void 0),an=rn([T(`w3m-all-wallets-search`)],an);var on=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},sn=class extends b{constructor(){super(...arguments),this.search=``,this.badge=void 0,this.onDebouncedSearch=t.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return S`
      <wui-flex .padding=${[`1`,`3`,`3`,`3`]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge===`certified`}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?S`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:S`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(t){t.detail?(this.badge=`certified`,e.showSvg(`Only WalletConnect certified`,{icon:`walletConnectBrown`,iconColor:`accent-100`})):this.badge=void 0}qrButtonTemplate(){return t.isMobile()?S`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){g.push(`ConnectingWalletConnect`)}};on([D()],sn.prototype,`search`,void 0),on([D()],sn.prototype,`badge`,void 0),sn=on([T(`w3m-all-wallets-view`)],sn);var cn=w`
  button {
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[4]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    justify-content: center;
    align-items: center;
  }

  :host([data-size='sm']) button {
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) button {
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button:disabled {
    opacity: 0.5;
  }
`,ln=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},un=class extends b{constructor(){super(...arguments),this.text=``,this.disabled=!1,this.size=`lg`,this.icon=`copy`,this.tabIdx=void 0}render(){this.dataset.size=this.size;let e=`${this.size}-regular`;return S`
      <button ?disabled=${this.disabled} tabindex=${k(this.tabIdx)}>
        <wui-icon name=${this.icon} size=${this.size} color="default"></wui-icon>
        <wui-text align="center" variant=${e} color="primary">${this.text}</wui-text>
      </button>
    `}};un.styles=[x,y,cn],ln([O()],un.prototype,`text`,void 0),ln([O({type:Boolean})],un.prototype,`disabled`,void 0),ln([O()],un.prototype,`size`,void 0),ln([O()],un.prototype,`icon`,void 0),ln([O()],un.prototype,`tabIdx`,void 0),un=ln([T(`wui-list-button`)],un);var dn=w`
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: ${({spacing:e})=>e[2]};
  }

  wui-loading-spinner {
    right: ${({spacing:e})=>e[3]};
  }

  wui-text {
    margin: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[0]} ${({spacing:e})=>e[3]};
  }
`,fn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},pn=class extends b{constructor(){super(),this.unsubscribe=[],this.formRef=Se(),this.email=``,this.loading=!1,this.error=``,this.remoteFeatures=d.state.remoteFeatures,this.hasExceededUsageLimit=o.state.plan.hasExceededUsageLimit,this.unsubscribe.push(d.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e}),o.subscribeKey(`plan`,e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.formRef.value?.addEventListener(`keydown`,e=>{e.key===`Enter`&&this.onSubmitEmail(e)})}render(){let e=f.hasAnyConnection(p.CONNECTOR_ID.AUTH);return S`
      <form ${xe(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${k(this.tabIdx)}
          ?disabled=${e||this.hasExceededUsageLimit}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?S`
          <wui-icon-link
            size="lg"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?S`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:null}templateError(){return this.error?S`<wui-text variant="sm-medium" color="error">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=``}async onSubmitEmail(r){if(!Ce.isValidEmail(this.email)){pe.open({displayMessage:ge.ALERT_WARNINGS.INVALID_EMAIL.displayMessage},`warning`);return}if(!p.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===m.state.activeChain)){let e=m.getFirstCaipNetworkSupportsAuthConnector();if(e){g.push(`SwitchNetwork`,{network:e});return}}try{if(this.loading)return;this.loading=!0,r.preventDefault();let t=u.getAuthConnector();if(!t)throw Error(`w3m-email-login-widget: Auth connector not found`);let{action:i}=await t.provider.connectEmail({email:this.email});if(n.sendEvent({type:`track`,event:`EMAIL_SUBMITTED`}),i===`VERIFY_OTP`)n.sendEvent({type:`track`,event:`EMAIL_VERIFICATION_CODE_SENT`}),g.push(`EmailVerifyOtp`,{email:this.email});else if(i===`VERIFY_DEVICE`)g.push(`EmailVerifyDevice`,{email:this.email});else if(i===`CONNECT`){let n=this.remoteFeatures?.multiWallet;await f.connectExternal(t,m.state.activeChain),n?(g.replace(`ProfileWallets`),e.showSuccess(`New Wallet Added`)):g.replace(`Account`)}}catch(n){t.parseError(n)?.includes(`Invalid email`)?this.error=`Invalid email. Try again.`:e.showError(n)}finally{this.loading=!1}}onFocusEvent(){n.sendEvent({type:`track`,event:`EMAIL_LOGIN_SELECTED`})}};pn.styles=dn,fn([O()],pn.prototype,`tabIdx`,void 0),fn([D()],pn.prototype,`email`,void 0),fn([D()],pn.prototype,`loading`,void 0),fn([D()],pn.prototype,`error`,void 0),fn([D()],pn.prototype,`remoteFeatures`,void 0),fn([D()],pn.prototype,`hasExceededUsageLimit`,void 0),pn=fn([T(`w3m-email-login-widget`)],pn);var mn=w`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`,hn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},gn=class extends b{constructor(){super(...arguments),this.logo=`google`,this.disabled=!1,this.tabIdx=void 0}render(){return S`
      <button ?disabled=${this.disabled} tabindex=${k(this.tabIdx)}>
        <wui-icon size="xxl" name=${this.logo}></wui-icon>
      </button>
    `}};gn.styles=[x,y,mn],hn([O()],gn.prototype,`logo`,void 0),hn([O({type:Boolean})],gn.prototype,`disabled`,void 0),hn([O()],gn.prototype,`tabIdx`,void 0),gn=hn([T(`wui-logo-select`)],gn);var _n=w`
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`,vn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},yn=2,bn=6,xn=class extends b{constructor(){super(),this.unsubscribe=[],this.walletGuide=`get-started`,this.tabIdx=void 0,this.connectors=u.state.connectors,this.remoteFeatures=d.state.remoteFeatures,this.authConnector=this.connectors.find(e=>e.type===`AUTH`),this.isPwaLoading=!1,this.hasExceededUsageLimit=o.state.plan.hasExceededUsageLimit,this.unsubscribe.push(u.subscribeKey(`connectors`,e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>e.type===`AUTH`)}),d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e),o.subscribeKey(`plan`,e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="2"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){let e=this.walletGuide===`explore`,t=this.remoteFeatures?.socials;return!t&&e?(t=a.DEFAULT_SOCIALS,this.renderTopViewContent(t)):t?this.renderTopViewContent(t):null}renderTopViewContent(e){return e.length===2?S` <wui-flex gap="2">
        ${e.slice(0,yn).map(e=>S`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${k(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:S` <wui-list-button
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      size="lg"
      icon=${k(e[0])}
      text=${`Continue with ${C.capitalize(e[0])}`}
      tabIdx=${k(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-button>`}bottomViewTemplate(){let e=this.remoteFeatures?.socials,t=this.walletGuide===`explore`;return(!this.authConnector||!e||e.length===0)&&t&&(e=a.DEFAULT_SOCIALS),!e||e.length<=yn?null:e&&e.length>bn?S`<wui-flex gap="2">
        ${e.slice(1,bn-1).map(e=>S`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${k(this.tabIdx)}
              ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${k(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:e?S`<wui-flex gap="2">
      ${e.slice(1,e.length).map(e=>S`<wui-logo-select
            data-testid=${`social-selector-${e}`}
            @click=${()=>{this.onSocialClick(e)}}
            logo=${e}
            tabIdx=${k(this.tabIdx)}
            ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){g.push(`ConnectSocials`)}async onSocialClick(e){if(this.hasExceededUsageLimit){g.push(`UsageExceeded`);return}if(!p.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===m.state.activeChain)){let e=m.getFirstCaipNetworkSupportsAuthConnector();if(e){g.push(`SwitchNetwork`,{network:e});return}}e&&await be(e)}async handlePwaFrameLoad(){if(t.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof fe&&await this.authConnector.provider.init()}catch(e){pe.open({displayMessage:`Error loading embedded wallet in PWA`,debugMessage:e.message},`error`)}finally{this.isPwaLoading=!1}}}hasConnection(){return f.hasAnyConnection(p.CONNECTOR_ID.AUTH)}};xn.styles=_n,vn([O()],xn.prototype,`walletGuide`,void 0),vn([O()],xn.prototype,`tabIdx`,void 0),vn([D()],xn.prototype,`connectors`,void 0),vn([D()],xn.prototype,`remoteFeatures`,void 0),vn([D()],xn.prototype,`authConnector`,void 0),vn([D()],xn.prototype,`isPwaLoading`,void 0),vn([D()],xn.prototype,`hasExceededUsageLimit`,void 0),xn=vn([T(`w3m-social-login-widget`)],xn);var Sn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Cn=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.count=o.state.count,this.filteredCount=o.state.filteredWallets.length,this.isFetchingRecommendedWallets=o.state.isFetchingRecommendedWallets,this.unsubscribe.push(u.subscribeKey(`connectors`,e=>this.connectors=e),o.subscribeKey(`count`,e=>this.count=e),o.subscribeKey(`filteredWallets`,e=>this.filteredCount=e.length),o.subscribeKey(`isFetchingRecommendedWallets`,e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(e=>e.id===`walletConnect`),{allWallets:n}=d.state;if(!e||n===`HIDE`||n===`ONLY_MOBILE`&&!t.isMobile())return null;let r=o.state.featured.length,i=this.count+r,a=i<10?i:Math.floor(i/10)*10,s=this.filteredCount>0?this.filteredCount:a,c=`${s}`;this.filteredCount>0?c=`${this.filteredCount}`:s<i&&(c=`${s}+`);let l=f.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT);return S`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${c}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${k(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${l}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){n.sendEvent({type:`track`,event:`CLICK_ALL_WALLETS`}),g.push(`AllWallets`,{redirectView:g.state.data?.redirectView})}};Sn([O()],Cn.prototype,`tabIdx`,void 0),Sn([D()],Cn.prototype,`connectors`,void 0),Sn([D()],Cn.prototype,`count`,void 0),Sn([D()],Cn.prototype,`filteredCount`,void 0),Sn([D()],Cn.prototype,`isFetchingRecommendedWallets`,void 0),Cn=Sn([T(`w3m-all-wallets-widget`)],Cn);var wn=w`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`,Tn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},En=class extends b{constructor(){super(),this.unsubscribe=[],this.explorerWallets=o.state.explorerWallets,this.connections=f.state.connections,this.connectorImages=i.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(f.subscribeKey(`connections`,e=>this.connections=e),i.subscribeKey(`connectorImages`,e=>this.connectorImages=e),o.subscribeKey(`explorerFilteredWallets`,e=>{this.explorerWallets=e?.length?e:o.state.explorerWallets}),o.subscribeKey(`explorerWallets`,e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),t.isTelegram()&&t.isIos()&&(this.loadingTelegram=!f.state.wcUri,this.unsubscribe.push(f.subscribeKey(`wcUri`,e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return te.connectorList().map((e,t)=>e.kind===`connector`?this.renderConnector(e,t):this.renderWallet(e,t))}getConnectorNamespaces(e){return e.subtype===`walletConnect`?[]:e.subtype===`multiChain`?e.connector.connectors?.map(e=>e.chain)||[]:[e.connector.chain]}renderConnector(e,t){let n=e.connector,r=s.getConnectorImage(n)||this.connectorImages[n?.imageId??``],i=(this.connections.get(n.chain)??[]).some(e=>v.isLowerCaseMatch(e.connectorId,n.id)),a,o;e.subtype===`walletConnect`?(a=`qr code`,o=`accent`):e.subtype===`injected`||e.subtype===`announced`?(a=i?`connected`:`installed`,o=i?`info`:`success`):(a=void 0,o=void 0);let c=f.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT),l=e.subtype===`walletConnect`||e.subtype===`external`?c:!1;return S`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${k(r)}
        .installed=${!0}
        name=${n.name??`Unknown`}
        .tagVariant=${o}
        tagLabel=${k(a)}
        data-testid=${`wallet-selector-${n.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${k(this.tabIdx)}
        ?disabled=${l}
        rdnsId=${k(n.explorerWallet?.rdns||void 0)}
        walletRank=${k(n.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){let n=g.state.data?.redirectView;if(e.subtype===`walletConnect`){u.setActiveConnector(e.connector),t.isMobile()?g.push(`AllWallets`):g.push(`ConnectingWalletConnect`,{redirectView:n});return}if(e.subtype===`multiChain`){u.setActiveConnector(e.connector),g.push(`ConnectingMultiChain`,{redirectView:n});return}if(e.subtype===`injected`){u.setActiveConnector(e.connector),g.push(`ConnectingExternal`,{connector:e.connector,redirectView:n,wallet:e.connector.explorerWallet});return}if(e.subtype===`announced`){if(e.connector.id===`walletConnect`){t.isMobile()?g.push(`AllWallets`):g.push(`ConnectingWalletConnect`,{redirectView:n});return}g.push(`ConnectingExternal`,{connector:e.connector,redirectView:n,wallet:e.connector.explorerWallet});return}g.push(`ConnectingExternal`,{connector:e.connector,redirectView:n})}renderWallet(e,t){let n=e.wallet,r=s.getWalletImage(n),i=f.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,o=e.subtype===`recent`?`recent`:void 0,c=e.subtype===`recent`?`info`:void 0;return S`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${k(r)}
        name=${n.name??`Unknown`}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${n.id}`}
        tabIdx=${k(this.tabIdx)}
        ?loading=${a}
        ?disabled=${i}
        rdnsId=${k(n.rdns||void 0)}
        walletRank=${k(n.order)}
        tagLabel=${k(o)}
        .tagVariant=${c}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){let t=g.state.data?.redirectView,n=m.state.activeChain;if(e.subtype===`featured`){u.selectWalletConnector(e.wallet);return}if(e.subtype===`recent`){if(this.loadingTelegram)return;u.selectWalletConnector(e.wallet);return}if(e.subtype===`custom`){if(this.loadingTelegram)return;g.push(`ConnectingWalletConnect`,{wallet:e.wallet,redirectView:t});return}if(this.loadingTelegram)return;let r=n?u.getConnector({id:e.wallet.id,namespace:n}):void 0;r?g.push(`ConnectingExternal`,{connector:r,redirectView:t}):g.push(`ConnectingWalletConnect`,{wallet:e.wallet,redirectView:t})}};En.styles=wn,Tn([O({type:Number})],En.prototype,`tabIdx`,void 0),Tn([D()],En.prototype,`explorerWallets`,void 0),Tn([D()],En.prototype,`connections`,void 0),Tn([D()],En.prototype,`connectorImages`,void 0),Tn([D()],En.prototype,`loadingTelegram`,void 0),En=Tn([T(`w3m-connector-list`)],En);var Dn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},On=class extends b{constructor(){super(...arguments),this.tabIdx=void 0}render(){return S`
      <wui-flex flexDirection="column" gap="2">
        <w3m-connector-list tabIdx=${k(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${k(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};Dn([O()],On.prototype,`tabIdx`,void 0),On=Dn([T(`w3m-wallet-login-list`)],On);var kn=w`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`,X=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},An=470,Z=class extends b{constructor(){super(),this.unsubscribe=[],this.connectors=u.state.connectors,this.authConnector=this.connectors.find(e=>e.type===`AUTH`),this.features=d.state.features,this.remoteFeatures=d.state.remoteFeatures,this.enableWallets=d.state.enableWallets,this.noAdapters=m.state.noAdapters,this.walletGuide=`get-started`,this.checked=ue.state.isLegalCheckboxChecked,this.isEmailEnabled=this.remoteFeatures?.email&&!m.state.noAdapters,this.isSocialEnabled=this.remoteFeatures?.socials&&this.remoteFeatures.socials.length>0&&!m.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(u.subscribeKey(`connectors`,e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>e.type===`AUTH`),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),d.subscribeKey(`features`,e=>{this.features=e}),d.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),d.subscribeKey(`enableWallets`,e=>this.enableWallets=e),m.subscribeKey(`noAdapters`,e=>this.setEmailAndSocialEnableCheck(e,this.remoteFeatures)),ue.subscribeKey(`isLegalCheckboxChecked`,e=>this.checked=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect(),(this.shadowRoot?.querySelector(`.connect`))?.removeEventListener(`scroll`,this.handleConnectListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(`.connect`);e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e?.addEventListener(`scroll`,this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),this.resizeObserver?.observe(e),this.handleConnectListScroll())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=d.state,n=d.state.features?.legalCheckbox,r=!!(e||t)&&!!n&&this.walletGuide===`get-started`&&!this.checked,i={connect:!0,disabled:r},a=d.state.enableWalletGuide,o=this.enableWallets,s=this.isSocialEnabled||this.authConnector,c=r?-1:void 0;return S`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          .padding=${[`0`,`0`,`4`,`0`]}
          class=${ve(i)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="2"
            .padding=${s&&o&&a&&this.walletGuide===`get-started`?[`0`,`3`,`0`,`3`]:[`0`,`3`,`3`,`3`]}
          >
            ${this.renderConnectMethod(c)}
          </wui-flex>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}reownBrandingTemplate(){return Ce.hasFooter()||!this.remoteFeatures?.reownBranding?null:S`<wui-ux-by-reown></wui-ux-by-reown>`}setEmailAndSocialEnableCheck(e,t){this.isEmailEnabled=t?.email&&!e,this.isSocialEnabled=t?.socials&&t.socials.length>0&&!e,this.remoteFeatures=t,this.noAdapters=e}checkIfAuthEnabled(e){let t=e.filter(e=>e.type===de.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return p.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}renderConnectMethod(e){return S`${se.getConnectOrderMethod(this.features,this.connectors).map((t,n)=>{switch(t){case`email`:return S`${this.emailTemplate(e)} ${this.separatorTemplate(n,`email`)}`;case`social`:return S`${this.socialListTemplate(e)}
          ${this.separatorTemplate(n,`social`)}`;case`wallet`:return S`${this.walletListTemplate(e)}
          ${this.separatorTemplate(n,`wallet`)}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case`wallet`:return this.enableWallets;case`social`:return this.isSocialEnabled&&this.isAuthEnabled;case`email`:return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){let t=se.getConnectOrderMethod(this.features,this.connectors)[e+1];if(t)return this.checkMethodEnabled(t)?t:this.checkIsThereNextMethod(e+1)}separatorTemplate(e,t){let n=this.checkIsThereNextMethod(e),r=this.walletGuide===`explore`;switch(t){case`wallet`:return this.enableWallets&&n&&!r?S`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case`email`:{let e=n===`social`;return this.isAuthEnabled&&this.isEmailEnabled&&!e&&n?S`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case`social`:{let e=n===`email`;return this.isAuthEnabled&&this.isSocialEnabled&&!e&&n?S`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(e){return!this.isEmailEnabled||!this.isAuthEnabled?null:S`<w3m-email-login-widget tabIdx=${k(e)}></w3m-email-login-widget>`}socialListTemplate(e){return!this.isSocialEnabled||!this.isAuthEnabled?null:S`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${k(e)}
    ></w3m-social-login-widget>`}walletListTemplate(e){let n=this.enableWallets,r=this.features?.emailShowWallets===!1,i=this.features?.collapseWallets,a=r||i;return!n||(t.isTelegram()&&(t.isSafari()||t.isIos())&&f.connectWalletConnect().catch(e=>({})),this.walletGuide===`explore`)?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&a?S`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${k(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
        icon="wallet"
      ></wui-list-button>`:S`<w3m-wallet-login-list tabIdx=${k(e)}></w3m-wallet-login-list>`}legalCheckboxTemplate(){return this.walletGuide===`explore`?null:S`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(`.connect`);e&&(e.scrollHeight>An?(e.style.setProperty(`--connect-mask-image`,`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 100px,
          black calc(100% - 100px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty(`--connect-scroll--top-opacity`,_e.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty(`--connect-scroll--bottom-opacity`,_e.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty(`--connect-mask-image`,`none`),e.style.setProperty(`--connect-scroll--top-opacity`,`0`),e.style.setProperty(`--connect-scroll--bottom-opacity`,`0`)))}onContinueWalletClick(){g.push(`ConnectWallets`)}};Z.styles=kn,X([D()],Z.prototype,`connectors`,void 0),X([D()],Z.prototype,`authConnector`,void 0),X([D()],Z.prototype,`features`,void 0),X([D()],Z.prototype,`remoteFeatures`,void 0),X([D()],Z.prototype,`enableWallets`,void 0),X([D()],Z.prototype,`noAdapters`,void 0),X([O()],Z.prototype,`walletGuide`,void 0),X([D()],Z.prototype,`checked`,void 0),X([D()],Z.prototype,`isEmailEnabled`,void 0),X([D()],Z.prototype,`isSocialEnabled`,void 0),X([D()],Z.prototype,`isAuthEnabled`,void 0),Z=X([T(`w3m-connect-view`)],Z);var jn=w`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`,Mn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Nn=class extends b{constructor(){super(...arguments),this.disabled=!1,this.label=``,this.buttonLabel=``}render(){return S`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Nn.styles=[x,y,jn],Mn([O({type:Boolean})],Nn.prototype,`disabled`,void 0),Mn([O()],Nn.prototype,`label`,void 0),Mn([O()],Nn.prototype,`buttonLabel`,void 0),Nn=Mn([T(`wui-cta-button`)],Nn);var Pn=w`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e[5]} ${({spacing:e})=>e[5]};
  }
`,Fn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},In=class extends b{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display=`none`,null;let{name:e,app_store:n,play_store:r,chrome_store:i,homepage:a}=this.wallet,o=t.isMobile(),s=t.isIos(),c=t.isAndroid(),l=[n,r,a,i].filter(Boolean).length>1,ee=C.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:`end`});return l&&!o?S`
        <wui-cta-button
          label=${`Don't have ${ee}?`}
          buttonLabel="Get"
          @click=${()=>g.push(`Downloads`,{wallet:this.wallet})}
        ></wui-cta-button>
      `:!l&&a?S`
        <wui-cta-button
          label=${`Don't have ${ee}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:n&&s?S`
        <wui-cta-button
          label=${`Don't have ${ee}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&c?S`
        <wui-cta-button
          label=${`Don't have ${ee}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display=`none`,null)}onAppStore(){this.wallet?.app_store&&t.openHref(this.wallet.app_store,`_blank`)}onPlayStore(){this.wallet?.play_store&&t.openHref(this.wallet.play_store,`_blank`)}onHomePage(){this.wallet?.homepage&&t.openHref(this.wallet.homepage,`_blank`)}};In.styles=[Pn],Fn([O({type:Object})],In.prototype,`wallet`,void 0),In=Fn([T(`w3m-mobile-download-links`)],In);var Ln=w`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e[`ease-out-power-2`]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`,Q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$=class extends b{constructor(){super(),this.wallet=g.state.data?.wallet,this.connector=g.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon=`refresh`,this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=s.getConnectorImage(this.connector)??s.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??`Wallet`,this.isRetrying=!1,this.uri=f.state.wcUri,this.error=f.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel=`Try again`,this.secondaryLabel=`Accept connection request in the wallet`,this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(f.subscribeKey(`wcUri`,e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),f.subscribeKey(`wcError`,e=>this.error=e)),(t.isTelegram()||t.isSafari())&&t.isIos()&&f.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),f.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let e=this.error?`Connection can be declined if a previous request is still active`:this.secondaryLabel,t=``;return this.label?t=this.label:(t=`Continue in ${this.name}`,this.error&&(t=`Connection declined`)),S`
      <wui-flex
        data-error=${k(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${[`10`,`5`,`5`,`5`]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${k(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${[`2`,`0`,`0`,`0`]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?`error`:`primary`}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?S`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?S`
              <wui-flex .padding=${[`0`,`5`,`5`,`5`]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,(this.shadowRoot?.querySelector(`wui-button`))?.animate([{opacity:0},{opacity:1}],{fill:`forwards`,easing:`ease`}))}onTryAgain(){f.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let e=ae.state.themeVariables[`--w3m-border-radius-master`];return S`<wui-loading-thumbnail radius=${(e?parseInt(e.replace(`px`,``),10):4)*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(t.copyToClopboard(this.uri),e.showSuccess(`Link copied`))}catch{e.showError(`Failed to copy`)}}};$.styles=Ln,Q([D()],$.prototype,`isRetrying`,void 0),Q([D()],$.prototype,`uri`,void 0),Q([D()],$.prototype,`error`,void 0),Q([D()],$.prototype,`ready`,void 0),Q([D()],$.prototype,`showRetry`,void 0),Q([D()],$.prototype,`label`,void 0),Q([D()],$.prototype,`secondaryBtnLabel`,void 0),Q([D()],$.prototype,`secondaryLabel`,void 0),Q([D()],$.prototype,`isLoading`,void 0),Q([O({type:Boolean})],$.prototype,`isMobile`,void 0),Q([O()],$.prototype,`onRetry`,void 0);var Rn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},zn=class extends ${constructor(){if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=f.getConnections(this.connector?.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=d.state.remoteFeatures,this.currentActiveConnectorId=u.state.activeConnectorIds[this.connector?.chain],!this.connector)throw Error(`w3m-connecting-view: No connector provided`);let t=this.connector?.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.connector.name??`Unknown`,platform:`browser`,displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.state.view}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(u.subscribeKey(`activeConnectorIds`,n=>{let r=n[t],i=this.remoteFeatures?.multiWallet,{redirectView:a}=g.state.data??{};r!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&i?(g.replace(`ProfileWallets`),e.showSuccess(`New Wallet Added`)):a?g.replace(a):h.close())}),f.subscribeKey(`connections`,this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;(this.connector.id!==p.CONNECTOR_ID.COINBASE_SDK||!this.error)&&await f.connectExternal(this.connector,this.connector.chain)}}catch(e){e instanceof r&&e.originalName===l.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?n.sendEvent({type:`track`,event:`USER_REJECTED`,properties:{message:e.message}}):n.sendEvent({type:`track`,event:`CONNECT_ERROR`,properties:{message:e?.message??`Unknown`}}),this.error=!0}}onConnectionsChange(t){if(this.connector?.chain&&t.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){let n=t.get(this.connector.chain)??[],r=this.remoteFeatures?.multiWallet;if(n.length===0)g.replace(`Connect`);else{let t=ne.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(e=>e.accounts),i=ne.getConnectionsByConnectorId(n,this.connector.id).flatMap(e=>e.accounts);i.length===0?this.hasMultipleConnections&&r?(g.replace(`ProfileWallets`),e.showSuccess(`Wallet deleted`)):h.close():!t.every(e=>i.some(t=>v.isLowerCaseMatch(e.address,t.address)))&&r&&g.replace(`ProfileWallets`)}}}isAlreadyConnected(e){return!!e&&this.connectionsByNamespace.some(t=>v.isLowerCaseMatch(t.connectorId,e.id))}};zn=Rn([T(`w3m-connecting-external-view`)],zn);var Bn=E`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`,Vn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Hn=class extends b{constructor(){super(),this.unsubscribe=[],this.activeConnector=u.state.activeConnector,this.unsubscribe.push(u.subscribeKey(`activeConnector`,e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${[`3`,`5`,`5`,`5`]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${k(s.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${[`0`,`3`,`0`,`3`]}
        >
          <wui-text variant="lg-medium" color="primary">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${[`2`,`0`,`2`,`0`]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map((e,t)=>e.name?S`
            <w3m-list-wallet
              displayIndex=${t}
              imageSrc=${k(s.getChainImage(e.chain))}
              name=${p.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              size="sm"
              data-testid="wui-list-chain-${e.chain}"
              rdnsId=${e.explorerWallet?.rdns}
            ></w3m-list-wallet>
          `:null)}onConnector(n){let r=this.activeConnector?.connectors?.find(e=>e.chain===n.chain),i=g.state.data?.redirectView;if(!r){e.showError(`Failed to find connector`);return}r.id===`walletConnect`?t.isMobile()?g.push(`AllWallets`):g.push(`ConnectingWalletConnect`,{redirectView:i}):g.push(`ConnectingExternal`,{connector:r,redirectView:i,wallet:this.activeConnector?.explorerWallet})}};Hn.styles=Bn,Vn([D()],Hn.prototype,`activeConnector`,void 0),Hn=Vn([T(`w3m-connecting-multi-chain-view`)],Hn);var Un=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Wn=class extends b{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-flex justifyContent="center" .padding=${[`0`,`0`,`4`,`0`]}>
        <wui-tabs .tabs=${this.generateTabs()} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(e=>e===`browser`?{label:`Browser`,icon:`extension`,platform:`browser`}:e===`mobile`?{label:`Mobile`,icon:`mobile`,platform:`mobile`}:e===`qrcode`?{label:`Mobile`,icon:`mobile`,platform:`qrcode`}:e===`web`?{label:`Webapp`,icon:`browser`,platform:`web`}:e===`desktop`?{label:`Desktop`,icon:`desktop`,platform:`desktop`}:{label:`Browser`,icon:`extension`,platform:`unsupported`});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){let t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};Un([O({type:Array})],Wn.prototype,`platforms`,void 0),Un([O()],Wn.prototype,`onSelectPlatfrom`,void 0),Wn=Un([T(`w3m-connecting-header`)],Wn);var Gn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Kn=class extends ${constructor(){if(super(),!this.wallet)throw Error(`w3m-connecting-wc-browser: No wallet provided`);this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet.name,platform:`browser`,displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=u.state,t=e.find(e=>e.type===`ANNOUNCED`&&e.info?.rdns===this.wallet?.rdns||e.type===`INJECTED`||e.name===this.wallet?.name);if(t)await f.connectExternal(t,t.chain);else throw Error(`w3m-connecting-wc-browser: No connector found`);h.close()}catch(e){e instanceof r&&e.originalName===l.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?n.sendEvent({type:`track`,event:`USER_REJECTED`,properties:{message:e.message}}):n.sendEvent({type:`track`,event:`CONNECT_ERROR`,properties:{message:e?.message??`Unknown`}}),this.error=!0}}};Kn=Gn([T(`w3m-connecting-wc-browser`)],Kn);var qn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Jn=class extends ${constructor(){if(super(),!this.wallet)throw Error(`w3m-connecting-wc-desktop: No wallet provided`);this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet.name,platform:`desktop`,displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:n}=this.wallet,{redirect:r,href:i}=t.formatNativeUrl(e,this.uri);f.setWcLinking({name:n,href:i}),f.setRecentWallet(this.wallet),t.openHref(r,`_blank`)}catch{this.error=!0}}};Jn=qn([T(`w3m-connecting-wc-desktop`)],Jn);var Yn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Xn=class extends ${constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=d.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{ne.onConnectMobile(this.wallet)},!this.wallet)throw Error(`w3m-connecting-wc-mobile: No wallet provided`);this.secondaryBtnLabel=`Open`,this.secondaryLabel=a.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon=`externalLink`,this.onHandleURI(),this.unsubscribe.push(f.subscribeKey(`wcUri`,()=>{this.onHandleURI()})),n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet.name,platform:`mobile`,displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:g.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){f.setWcError(!1),this.onConnect?.()}};Yn([D()],Xn.prototype,`redirectDeeplink`,void 0),Yn([D()],Xn.prototype,`redirectUniversalLink`,void 0),Yn([D()],Xn.prototype,`target`,void 0),Yn([D()],Xn.prototype,`preferUniversalLinks`,void 0),Yn([D()],Xn.prototype,`isLoading`,void 0),Xn=Yn([T(`w3m-connecting-wc-mobile`)],Xn);var Zn=w`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`,Qn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$n=class extends ${constructor(){super(),this.basic=!1}firstUpdated(){this.basic||n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet?.name??`WalletConnect`,platform:`qrcode`,displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${[`0`,`5`,`5`,`5`]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.wallet?this.wallet.name:void 0;f.setWcLinking(void 0),f.setRecentWallet(this.wallet);let t=ae.state.themeVariables[`--apkt-qr-color`]??ae.state.themeVariables[`--w3m-qr-color`];return S` <wui-qr-code
      theme=${ae.state.themeMode}
      uri=${this.uri}
      imageSrc=${k(s.getWalletImage(this.wallet))}
      color=${k(t)}
      alt=${k(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){return S`<wui-button
      .disabled=${!this.uri||!this.ready}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};$n.styles=Zn,Qn([O({type:Boolean})],$n.prototype,`basic`,void 0),$n=Qn([T(`w3m-connecting-wc-qrcode`)],$n);var er=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},tr=class extends b{constructor(){if(super(),this.wallet=g.state.data?.wallet,!this.wallet)throw Error(`w3m-connecting-wc-unsupported: No wallet provided`);n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet.name,platform:`browser`,displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.state.view}})}render(){return S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${[`10`,`5`,`5`,`5`]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${k(s.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};tr=er([T(`w3m-connecting-wc-unsupported`)],tr);var nr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},rr=class extends ${constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error(`w3m-connecting-wc-web: No wallet provided`);this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel=`Open`,this.secondaryLabel=a.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon=`externalLink`,this.updateLoadingState(),this.unsubscribe.push(f.subscribeKey(`wcUri`,()=>{this.updateLoadingState()})),n.sendEvent({type:`track`,event:`SELECT_WALLET`,properties:{name:this.wallet.name,platform:`web`,displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:g.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:n}=this.wallet,{redirect:r,href:i}=t.formatUniversalUrl(e,this.uri);f.setWcLinking({name:n,href:i}),f.setRecentWallet(this.wallet),t.openHref(r,`_blank`)}catch{this.error=!0}}};nr([D()],rr.prototype,`isLoading`,void 0),rr=nr([T(`w3m-connecting-wc-web`)],rr);var ir=w`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`,ar=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},or=class extends b{constructor(){super(),this.wallet=g.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!d.state.siwx,this.remoteFeatures=d.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return d.state.enableMobileFullScreen&&this.setAttribute(`data-mobile-fullscreen`,`true`),S`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return!this.remoteFeatures?.reownBranding||!this.displayBranding?null:S`<wui-ux-by-reown></wui-ux-by-reown>`}async initializeConnection(i=!1){if(!(this.platform===`browser`||d.state.manualWCControl&&!i))try{let{wcPairingExpiry:n,status:r}=f.state,{redirectView:a}=g.state.data??{};if(i||d.state.enableEmbedded||t.isPairingExpired(n)||r===`connecting`){let t=f.getConnections(m.state.activeChain),n=this.remoteFeatures?.multiWallet,r=t.length>0;await f.connectWalletConnect({cache:`never`}),this.isSiwxEnabled||(r&&n?(g.replace(`ProfileWallets`),e.showSuccess(`New Wallet Added`)):a?g.replace(a):h.close())}}catch(t){if(t instanceof Error&&t.message.includes(`An error occurred when attempting to switch chain`)&&!d.state.enableNetworkSwitch&&m.state.activeChain){m.setActiveCaipNetwork(me.getUnsupportedNetwork(`${m.state.activeChain}:${m.state.activeCaipNetwork?.id}`)),m.showUnsupportedChainUI();return}t instanceof r&&t.originalName===l.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?n.sendEvent({type:`track`,event:`USER_REJECTED`,properties:{message:t.message}}):n.sendEvent({type:`track`,event:`CONNECT_ERROR`,properties:{message:t?.message??`Unknown`}}),f.setWcError(!0),e.showError(t.message??`Connection error`),f.resetWcConnection(),g.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push(`qrcode`),this.platform=`qrcode`;return}if(this.platform)return;let{mobile_link:e,desktop_link:n,webapp_link:r,injected:i,rdns:a}=this.wallet,o=i?.map(({injected_id:e})=>e).filter(Boolean),s=[...a?[a]:o??[]],c=d.state.isUniversalProvider?!1:s.length,l=e,ee=r,u=f.checkInstalled(s),te=c&&u,ne=n&&!t.isMobile();te&&!m.state.noAdapters&&this.platforms.push(`browser`),l&&this.platforms.push(t.isMobile()?`mobile`:`qrcode`),ee&&this.platforms.push(`web`),ne&&this.platforms.push(`desktop`);let re=oe.isCustomDeeplinkWallet(this.wallet.id,m.state.activeChain);!te&&c&&!m.state.noAdapters&&!re&&this.platforms.push(`unsupported`),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case`browser`:return S`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case`web`:return S`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case`desktop`:return S`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case`mobile`:return S`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case`qrcode`:return S`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return S`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?S`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let t=this.shadowRoot?.querySelector(`div`);t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:`forwards`,easing:`ease`}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:`forwards`,easing:`ease`}))}};or.styles=ir,ar([D()],or.prototype,`platform`,void 0),ar([D()],or.prototype,`platforms`,void 0),ar([D()],or.prototype,`isSiwxEnabled`,void 0),ar([D()],or.prototype,`remoteFeatures`,void 0),ar([O({type:Boolean})],or.prototype,`displayBranding`,void 0),ar([O({type:Boolean})],or.prototype,`basic`,void 0),or=ar([T(`w3m-connecting-wc-view`)],or);var sr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},cr=class extends b{constructor(){super(),this.unsubscribe=[],this.isMobile=t.isMobile(),this.remoteFeatures=d.state.remoteFeatures,this.unsubscribe.push(d.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){let{featured:e,recommended:t}=o.state,{customWallets:n}=d.state,r=c.getRecentWallets();return S`<wui-flex flexDirection="column" gap="2" .margin=${[`1`,`3`,`3`,`3`]}>
        ${e.length||t.length||n?.length||r.length?S`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return S`<wui-flex flexDirection="column" .padding=${[`0`,`0`,`4`,`0`]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${[`0`,`3`,`0`,`3`]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?S` <wui-flex flexDirection="column" .padding=${[`1`,`0`,`1`,`0`]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};sr([D()],cr.prototype,`isMobile`,void 0),sr([D()],cr.prototype,`remoteFeatures`,void 0),cr=sr([T(`w3m-connecting-wc-basic-view`)],cr);var lr=E`
  .continue-button-container {
    width: 100%;
  }
`,ur=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},dr=class extends b{constructor(){super(...arguments),this.loading=!1}render(){return S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${[`0`,`0`,`4`,`0`]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{t.openHref(le.URLS.FAQ,`_blank`)}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return S` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${[`0`,`6`,`0`,`6`]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box icon="id" size="xl" iconSize="xxl" color="default"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="lg-medium" color="primary">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return S`<wui-flex
      .padding=${[`0`,`8`,`0`,`8`]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){g.push(`RegisterAccountName`),n.sendEvent({type:`track`,event:`OPEN_ENS_FLOW`,properties:{isSmartAccount:re(m.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}})}};dr.styles=lr,ur([D()],dr.prototype,`loading`,void 0),dr=ur([T(`w3m-choose-account-name-view`)],dr);var fr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},pr=class extends b{constructor(){super(...arguments),this.wallet=g.state.data?.wallet}render(){if(!this.wallet)throw Error(`w3m-downloads-view`);return S`
      <wui-flex gap="2" flexDirection="column" .padding=${[`3`,`3`,`4`,`3`]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?S`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?S`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?S`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?S`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(n.sendEvent({type:`track`,event:`GET_WALLET`,properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),t.openHref(e.href,`_blank`))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:`chrome_store`})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:`app_store`})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:`play_store`})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:`homepage`})}};pr=fr([T(`w3m-downloads-view`)],pr);var mr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},hr=`https://walletconnect.com/explorer`,gr=class extends b{render(){return S`
      <wui-flex flexDirection="column" .padding=${[`0`,`3`,`3`,`3`]} gap="2">
        ${this.recommendedWalletsTemplate()}
        <w3m-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          size="sm"
          @click=${()=>{t.openHref(`https://walletconnect.com/explorer?type=wallet`,`_blank`)}}
        ></w3m-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){let{recommended:e,featured:t}=o.state,{customWallets:n}=d.state;return[...t,...n??[],...e].slice(0,4).map((e,t)=>S`
        <w3m-list-wallet
          displayIndex=${t}
          name=${e.name??`Unknown`}
          tagVariant="accent"
          size="sm"
          imageSrc=${k(s.getWalletImage(e))}
          @click=${()=>{this.onWalletClick(e)}}
        ></w3m-list-wallet>
      `)}onWalletClick(e){n.sendEvent({type:`track`,event:`GET_WALLET`,properties:{name:e.name,walletRank:void 0,explorerId:e.id,type:`homepage`}}),t.openHref(e.homepage??hr,`_blank`)}};gr=mr([T(`w3m-get-wallet-view`)],gr);var _r=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},vr=class extends b{constructor(){super(...arguments),this.data=[]}render(){return S`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        ${this.data.map(e=>S`
            <wui-flex flexDirection="column" alignItems="center" gap="5">
              <wui-flex flexDirection="row" justifyContent="center" gap="1">
                ${e.images.map(e=>S`<wui-visual size="sm" name=${e}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="1">
              <wui-text variant="md-regular" color="primary" align="center">${e.title}</wui-text>
              <wui-text variant="sm-regular" color="secondary" align="center"
                >${e.text}</wui-text
              >
            </wui-flex>
          `)}
      </wui-flex>
    `}};_r([O({type:Array})],vr.prototype,`data`,void 0),vr=_r([T(`w3m-help-widget`)],vr);var yr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},br=[{images:[`login`,`profile`,`lock`],title:`One login for all of web3`,text:`Log in to any app by connecting your wallet. Say goodbye to countless passwords!`},{images:[`defi`,`nft`,`eth`],title:`A home for your digital assets`,text:`A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs.`},{images:[`browser`,`noun`,`dao`],title:`Your gateway to a new web`,text:`With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more.`}],xr=class extends b{render(){return S`
      <wui-flex
        flexDirection="column"
        .padding=${[`6`,`5`,`5`,`5`]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${br}></w3m-help-widget>
        <wui-button variant="accent-primary" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){n.sendEvent({type:`track`,event:`CLICK_GET_WALLET_HELP`}),g.push(`GetWallet`)}};xr=yr([T(`w3m-what-is-a-wallet-view`)],xr);var Sr=w`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,Cr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},wr=class extends b{constructor(){super(),this.unsubscribe=[],this.checked=ue.state.isLegalCheckboxChecked,this.unsubscribe.push(ue.subscribeKey(`isLegalCheckboxChecked`,e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=d.state,n=d.state.features?.legalCheckbox,r=!!(e||t)&&!!n,i=r&&!this.checked,a=i?-1:void 0;return S`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${r?[`0`,`3`,`3`,`3`]:`3`}
        gap="2"
        class=${k(i?`disabled`:void 0)}
      >
        <w3m-wallet-login-list tabIdx=${k(a)}></w3m-wallet-login-list>
      </wui-flex>
    `}};wr.styles=Sr,Cr([D()],wr.prototype,`checked`,void 0),wr=Cr([T(`w3m-connect-wallets-view`)],wr);var Tr=w`
  :host {
    display: block;
    width: 120px;
    height: 120px;
  }

  svg {
    width: 120px;
    height: 120px;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: ${e=>e.colors.accent100};
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,Er=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Dr=class extends b{render(){return S`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};Dr.styles=[x,Tr],Dr=Er([T(`wui-loading-hexagon`)],Dr);var Or=E`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`,kr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ar=class extends b{constructor(){super(),this.network=g.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw Error(`w3m-network-switch-view: No network provided`);this.onShowRetry();let e=this.getLabel(),t=this.getSubLabel();return S`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${[`10`,`5`,`10`,`5`]}
        gap="7"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${k(s.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:S`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="h6-regular" color="primary">${e}</wui-text>
          <wui-text align="center" variant="md-regular" color="secondary">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent-primary"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){let e=u.getConnectorId(m.state.activeChain);return u.getAuthConnector()&&e===p.CONNECTOR_ID.AUTH?``:this.error?`Switch can be declined if chain is not supported by a wallet or previous request is still active`:`Accept connection request in your wallet`}getLabel(){let e=u.getConnectorId(m.state.activeChain);return u.getAuthConnector()&&e===p.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??`Unknown`} network...`:this.error?`Switch declined`:`Approve in wallet`}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,(this.shadowRoot?.querySelector(`wui-button`))?.animate([{opacity:0},{opacity:1}],{fill:`forwards`,easing:`ease`}))}async onSwitchNetwork(){try{this.error=!1,m.state.activeChain!==this.network?.chainNamespace&&m.setIsSwitchingNamespace(!0),this.network&&(await m.switchActiveNetwork(this.network),await he.isAuthenticated()&&g.goBack())}catch{this.error=!0}}};Ar.styles=Or,kr([D()],Ar.prototype,`showRetry`,void 0),kr([D()],Ar.prototype,`error`,void 0),Ar=kr([T(`w3m-network-switch-view`)],Ar);var jr=w`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Mr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Nr=class extends b{constructor(){super(...arguments),this.imageSrc=void 0,this.name=`Ethereum`,this.disabled=!1}render(){return S`
      <button ?disabled=${this.disabled} tabindex=${k(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          ${this.imageTemplate()}
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}imageTemplate(){return this.imageSrc?S`<wui-image ?boxed=${!0} src=${this.imageSrc}></wui-image>`:S`<wui-image
      ?boxed=${!0}
      icon="networkPlaceholder"
      size="lg"
      iconColor="default"
    ></wui-image>`}};Nr.styles=[x,y,jr],Mr([O()],Nr.prototype,`imageSrc`,void 0),Mr([O()],Nr.prototype,`name`,void 0),Mr([O()],Nr.prototype,`tabIdx`,void 0),Mr([O({type:Boolean})],Nr.prototype,`disabled`,void 0),Nr=Mr([T(`wui-list-network`)],Nr);var Pr=E`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`,Fr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ir=class extends b{constructor(){super(),this.unsubscribe=[],this.network=m.state.activeCaipNetwork,this.requestedCaipNetworks=m.getCaipNetworks(),this.search=``,this.onDebouncedSearch=t.debounce(e=>{this.search=e},100),this.unsubscribe.push(i.subscribeNetworkImages(()=>this.requestUpdate()),m.subscribeKey(`activeCaipNetwork`,e=>this.network=e),m.subscribe(()=>{this.requestedCaipNetworks=m.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${[`0`,`3`,`3`,`3`]}
        flexDirection="column"
        gap="2"
      >
        ${this.networksTemplate()}
      </wui-flex>
    `}templateSearchInput(){return S`
      <wui-flex gap="2" .padding=${[`0`,`3`,`3`,`3`]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}networksTemplate(){let e=m.getAllApprovedCaipNetworkIds(),n=t.sortRequestedNetworks(e,this.requestedCaipNetworks);return this.search?this.filteredNetworks=n?.filter(e=>e?.name?.toLowerCase().includes(this.search.toLowerCase())):this.filteredNetworks=n,this.filteredNetworks?.map(e=>S`
        <wui-list-network
          .selected=${this.network?.id===e.id}
          imageSrc=${k(s.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${m.isCaipNetworkDisabled(e)}
          data-testid=${`w3m-network-switch-${e.name??e.id}`}
        ></wui-list-network>
      `)}onSwitchNetwork(e){ie.onSwitchNetwork({network:e})}};Ir.styles=Pr,Fr([D()],Ir.prototype,`network`,void 0),Fr([D()],Ir.prototype,`requestedCaipNetworks`,void 0),Fr([D()],Ir.prototype,`filteredNetworks`,void 0),Fr([D()],Ir.prototype,`search`,void 0),Ir=Fr([T(`w3m-networks-view`)],Ir);var Lr=w`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    border-radius: calc(
      ${({borderRadius:e})=>e[1]} * 9 - ${({borderRadius:e})=>e[3]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(
      ${({borderRadius:e})=>e[1]} * 9 - ${({borderRadius:e})=>e[3]}
    );
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e[`ease-out-power-2`]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e[`01`]} ${({spacing:e})=>e[2]};
  }

  .capitalize {
    text-transform: capitalize;
  }
`,Rr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},zr={eip155:`eth`,solana:`solana`,bip122:`bitcoin`,polkadot:void 0},Br=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=g.state.data?.switchToChain,this.caipNetwork=g.state.data?.network,this.activeChain=m.state.activeChain}firstUpdated(){this.unsubscribe.push(m.subscribeKey(`activeChain`,e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.switchToChain?p.CHAIN_NAME_MAP[this.switchToChain]:`supported`;if(!this.switchToChain)return null;let t=p.CHAIN_NAME_MAP[this.switchToChain];return S`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${[`4`,`2`,`2`,`2`]}
        gap="4"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="2">
          <wui-visual
            size="md"
            name=${k(zr[this.switchToChain])}
          ></wui-visual>
          <wui-flex gap="2" flexDirection="column" alignItems="center">
            <wui-text
              data-testid=${`w3m-switch-active-chain-to-${t}`}
              variant="lg-regular"
              color="primary"
              align="center"
              >Switch to <span class="capitalize">${t}</span></wui-text
            >
            <wui-text variant="md-regular" color="secondary" align="center">
              Connected wallet doesn't support connecting to ${e} chain. You
              need to connect with a different wallet.
            </wui-text>
          </wui-flex>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(m.setIsSwitchingNamespace(!0),u.setFilterByNamespace(this.switchToChain),this.caipNetwork?await m.switchActiveNetwork(this.caipNetwork):m.setActiveNamespace(this.switchToChain),g.reset(`Connect`))}};Br.styles=Lr,Rr([O()],Br.prototype,`activeChain`,void 0),Br=Rr([T(`w3m-switch-active-chain-view`)],Br);var Vr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Hr=[{images:[`network`,`layers`,`system`],title:`The system’s nuts and bolts`,text:`A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services.`},{images:[`noun`,`defiAlt`,`dao`],title:`Designed for different uses`,text:`Each network is designed differently, and may therefore suit certain apps and experiences.`}],Ur=class extends b{render(){return S`
      <wui-flex
        flexDirection="column"
        .padding=${[`6`,`5`,`5`,`5`]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${Hr}></w3m-help-widget>
        <wui-button
          variant="accent-primary"
          size="md"
          @click=${()=>{t.openHref(`https://ethereum.org/en/developers/docs/networks/`,`_blank`)}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Ur=Vr([T(`w3m-what-is-a-network-view`)],Ur);var Wr=E`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,Gr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Kr=class extends b{constructor(){super(),this.swapUnsupportedChain=g.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=d.state.remoteFeatures,this.unsubscribe.push(i.subscribeNetworkImages(()=>this.requestUpdate()),d.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${[`3`,`5`,`2`,`5`]}
          alignItems="center"
          gap="5"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="3" gap="2"> ${this.networksTemplate()} </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="3" gap="2">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="signOut"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="md-medium" color="secondary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?S`
        <wui-text variant="sm-regular" color="secondary" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:S`
      <wui-text variant="sm-regular" color="secondary" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){let e=m.getAllRequestedCaipNetworks(),n=m.getAllApprovedCaipNetworkIds(),r=t.sortRequestedNetworks(n,e);return(this.swapUnsupportedChain?r.filter(e=>a.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId)):r).map(e=>S`
        <wui-list-network
          imageSrc=${k(s.getNetworkImage(e))}
          name=${e.name??`Unknown`}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `)}async onDisconnect(){try{this.disconnecting=!0;let t=m.state.activeChain,n=f.getConnections(t).length>0,r=t&&u.state.activeConnectorIds[t],i=this.remoteFeatures?.multiWallet;await f.disconnect(i?{id:r,namespace:t}:{}),n&&i&&(g.push(`ProfileWallets`),e.showSuccess(`Wallet deleted`))}catch{n.sendEvent({type:`track`,event:`DISCONNECT_ERROR`,properties:{message:`Failed to disconnect`}}),e.showError(`Failed to disconnect`)}finally{this.disconnecting=!1}}async onSwitchNetwork(e){let t=m.getActiveCaipAddress(),n=m.getAllApprovedCaipNetworkIds();m.getNetworkProp(`supportsAllNetworks`,e.chainNamespace);let r=g.state.data;t?n?.includes(e.caipNetworkId)?await m.switchActiveNetwork(e):g.push(`SwitchNetwork`,{...r,network:e}):t||(m.setActiveCaipNetwork(e),g.push(`Connect`))}};Kr.styles=Wr,Gr([D()],Kr.prototype,`disconnecting`,void 0),Gr([D()],Kr.prototype,`remoteFeatures`,void 0),Kr=Gr([T(`w3m-unsupported-chain-view`)],Kr);var qr=w`
  wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
  }

  /* -- Types --------------------------------------------------------- */
  wui-flex[data-type='info'] {
    color: ${({tokens:e})=>e.theme.textSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-flex[data-type='success'] {
    color: ${({tokens:e})=>e.core.textSuccess};
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] {
    color: ${({tokens:e})=>e.core.textError};
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] {
    color: ${({tokens:e})=>e.core.textWarning};
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-flex[data-type='info'] wui-icon-box {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex[data-type='success'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-text {
    flex: 1;
  }
`,Jr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Yr=class extends b{constructor(){super(...arguments),this.icon=`externalLink`,this.text=``,this.type=`info`}render(){return S`
      <wui-flex alignItems="center" data-type=${this.type}>
        <wui-icon-box size="sm" color="inherit" icon=${this.icon}></wui-icon-box>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
      </wui-flex>
    `}};Yr.styles=[x,y,qr],Jr([O()],Yr.prototype,`icon`,void 0),Jr([O()],Yr.prototype,`text`,void 0),Jr([O()],Yr.prototype,`type`,void 0),Yr=Jr([T(`wui-banner`)],Yr);var Xr=E`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,Zr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Qr=class extends b{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return S` <wui-flex flexDirection="column" .padding=${[`2`,`3`,`3`,`3`]} gap="2">
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=m.getAllRequestedCaipNetworks(),n=m.getAllApprovedCaipNetworkIds(),r=m.state.activeCaipNetwork,i=m.checkIfSmartAccountEnabled(),a=t.sortRequestedNetworks(n,e);if(i&&re(r?.chainNamespace)===ce.ACCOUNT_TYPES.SMART_ACCOUNT){if(!r)return null;a=[r]}return a.filter(e=>e.chainNamespace===r?.chainNamespace).map(e=>S`
        <wui-list-network
          imageSrc=${k(s.getNetworkImage(e))}
          name=${e.name??`Unknown`}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};Qr.styles=Xr,Qr=Zr([T(`w3m-wallet-compatible-networks-view`)],Qr);var $r=w`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    box-shadow: 0 0 0 8px ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
  }

  :host([data-border-radius-full='true']) {
    border-radius: 50px;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`,ei=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ti=class extends b{render(){return this.dataset.borderRadiusFull=this.borderRadiusFull?`true`:`false`,S`${this.templateVisual()}`}templateVisual(){return this.imageSrc?S`<wui-image src=${this.imageSrc} alt=${this.alt??``}></wui-image>`:S`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};ti.styles=[x,$r],ei([O()],ti.prototype,`imageSrc`,void 0),ei([O()],ti.prototype,`alt`,void 0),ei([O({type:Boolean})],ti.prototype,`borderRadiusFull`,void 0),ti=ei([T(`wui-visual-thumbnail`)],ti);var ni=w`
  :host {
    display: flex;
    justify-content: center;
    gap: ${({spacing:e})=>e[4]};
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`,ri=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ii=class extends b{constructor(){super(...arguments),this.dappImageUrl=d.state.metadata?.icons,this.walletImageUrl=m.getAccountData()?.connectedWalletInfo?.icon}firstUpdated(){let e=this.shadowRoot?.querySelectorAll(`wui-visual-thumbnail`);e?.[0]&&this.createAnimation(e[0],`translate(18px)`),e?.[1]&&this.createAnimation(e[1],`translate(-18px)`)}render(){return S`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:`translateX(0px)`},{transform:t}],{duration:1600,easing:`cubic-bezier(0.56, 0, 0.48, 1)`,direction:`alternate`,iterations:1/0})}};ii.styles=ni,ii=ri([T(`w3m-siwx-sign-message-thumbnails`)],ii);var ai=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},oi=class extends b{constructor(){super(...arguments),this.dappName=d.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return S`
      <wui-flex justifyContent="center" .padding=${[`8`,`0`,`6`,`0`]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex .padding=${[`0`,`20`,`5`,`20`]} gap="3" justifyContent="space-between">
        <wui-text variant="lg-medium" align="center" color="primary"
          >${this.dappName??`Dapp`} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${[`0`,`10`,`4`,`10`]} gap="3" justifyContent="space-between">
        <wui-text variant="md-regular" align="center" color="secondary"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${[`4`,`5`,`5`,`5`]} gap="3" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-secondary"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?`Cancelling...`:`Cancel`}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-primary"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?`Signing...`:`Sign`}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await he.requestSignMessage()}catch(t){if(t instanceof Error&&t.message.includes(`OTP is required`)){e.showError({message:`Something went wrong. We need to verify your account again.`}),g.replace(`DataCapture`);return}throw t}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await he.cancelSignMessage().finally(()=>this.isCancelling=!1)}};ai([D()],oi.prototype,`isCancelling`,void 0),ai([D()],oi.prototype,`isSigning`,void 0),oi=ai([T(`w3m-siwx-sign-message-view`)],oi);export{Oe as AppKitAccountButton,je as AppKitButton,Re as AppKitConnectButton,Ke as AppKitNetworkButton,De as W3mAccountButton,$e as W3mAccountSettingsView,Dt as W3mAccountView,sn as W3mAllWalletsView,Ae as W3mButton,dr as W3mChooseAccountNameView,Le as W3mConnectButton,Z as W3mConnectView,wr as W3mConnectWalletsView,zn as W3mConnectingExternalView,Hn as W3mConnectingMultiChainView,cr as W3mConnectingWcBasicView,or as W3mConnectingWcView,pr as W3mDownloadsView,we as W3mFooter,It as W3mFundWalletView,gr as W3mGetWalletView,Ge as W3mNetworkButton,Ar as W3mNetworkSwitchView,Ir as W3mNetworksView,K as W3mProfileWalletsView,Te as W3mRouter,oi as W3mSIWXSignMessageView,Br as W3mSwitchActiveChainView,Kr as W3mUnsupportedChainView,Qr as W3mWalletCompatibleNetworksView,Ur as W3mWhatIsANetworkView,xr as W3mWhatIsAWalletView};