import{A as e,B as t,C as n,V as r,_ as i,at as a,nt as o,r as s,y as c}from"./ModalController-O2N328fJ.js";import{i as l,l as u,o as d,p as f,s as p,t as m}from"./index-DAGYqcI6.js";import{s as h}from"./wui-text-B9KpPVHo.js";import{t as g}from"./if-defined-BiCtsKKH.js";function _(){try{return t.returnOpenHref(`${o.SECURE_SITE_SDK_ORIGIN}/loading`,`popupWindow`,`width=600,height=800,scrollbars=yes`)}catch{throw Error(`Could not open social popup`)}}async function v(){c.push(`ConnectingFarcaster`);let t=i.getAuthConnector();if(t&&!s.getAccountData()?.farcasterUrl)try{let{url:e}=await t.provider.getFarcasterUri();s.setAccountProp(`farcasterUrl`,e,s.state.activeChain)}catch(t){c.goBack(),e.showError(t)}}async function y(o){c.push(`ConnectingSocial`);let l=i.getAuthConnector(),u=null;try{let e=setTimeout(()=>{throw Error(`Social login timed out. Please try again.`)},45e3);if(l&&o){if(t.isTelegram()||(u=_()),u)s.setAccountProp(`socialWindow`,a(u),s.state.activeChain);else if(!t.isTelegram())throw Error(`Could not create social popup`);let{uri:n}=await l.provider.getSocialRedirectUri({provider:o});if(!n)throw u?.close(),Error(`Could not fetch the social redirect uri`);if(u&&(u.location.href=n),t.isTelegram()){r.setTelegramSocialProvider(o);let e=t.formatTelegramSocialLoginUrl(n);t.openHref(e,`_top`)}clearTimeout(e)}}catch(r){u?.close();let i=t.parseError(r);e.showError(i),n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_ERROR`,properties:{provider:o,message:i}})}}async function b(e){s.setAccountProp(`socialProvider`,e,s.state.activeChain),n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_STARTED`,properties:{provider:e}}),e===`farcaster`?await v():await y(e)}var x=p`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[20]};
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`,S=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},C=class extends u{constructor(){super(...arguments),this.logo=`google`}render(){return f`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};C.styles=[d,x],S([h()],C.prototype,`logo`,void 0),C=S([m(`wui-logo`)],C);var w=p`
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
`,T=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},E=class extends u{constructor(){super(...arguments),this.logo=`google`,this.name=`Continue with google`,this.disabled=!1}render(){return f`
      <button ?disabled=${this.disabled} tabindex=${g(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          <wui-image ?boxed=${!0} logo=${this.logo}></wui-image>
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}};E.styles=[d,l,w],T([h()],E.prototype,`logo`,void 0),T([h()],E.prototype,`name`,void 0),T([h()],E.prototype,`tabIdx`,void 0),T([h({type:Boolean})],E.prototype,`disabled`,void 0),E=T([m(`wui-list-social`)],E);export{b as t};