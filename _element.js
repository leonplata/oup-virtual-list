import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `oup-virtual-list`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class OupVirtualListElement extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'oup-virtual-list',
      },
    };
  }
}

window.customElements.define('oup-virtual-list', OupVirtualListElement);
