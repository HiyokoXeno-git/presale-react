import{l as e,o as t,p as n,t as r,v as i}from"./index-DAGYqcI6.js";import{s as a}from"./wui-text-B9KpPVHo.js";import{t as o}from"./if-defined-BiCtsKKH.js";import"./wui-input-text-D2__l_b9.js";var s=i`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`,c=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},l=class extends e{constructor(){super(...arguments),this.disabled=!1}render(){return n`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="lg"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${o(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?n`<wui-text variant="sm-regular" color="error">${this.errorMessage}</wui-text>`:null}};l.styles=[t,s],c([a()],l.prototype,`errorMessage`,void 0),c([a({type:Boolean})],l.prototype,`disabled`,void 0),c([a()],l.prototype,`value`,void 0),c([a()],l.prototype,`tabIdx`,void 0),l=c([r(`wui-email-input`)],l);