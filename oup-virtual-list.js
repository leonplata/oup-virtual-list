import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat';

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
        .container {
          width: 100%;
          height: 200px;
          background: silver;
          overflow-x: auto;
        }
        .placeholder {
          height: 200px;
          position: relative;
          margin-left: -200px;
        }
        .item {
          position: absolute;
          top: 0;
          height: 200px;
          box-sizing: border-box;
          border: 1px solid red;
        }
      </style>
      <div class="container" on-scroll="_handleScroll">
        <div class="placeholder" style$="width: [[placeholderWidth]]px;">
          <template is="dom-repeat" items="[[physicalItems]]">
            <div class="item" style$="width: [[widthPerItem]]px; transform: translate3d([[item.itemOffset]]px, 0, 0);">
              [[item.virtualItem]]
            </div>
          </template>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      items: {
        type: Array,
        value: Array.from({ length: 100000 }).map((v, k) => 'item ' + k)
      },
      widthPerItem: {
        type: Number,
        value: 200
      },
      scrollOffset: {
        type: Number,
        value: 0
      },
      max: {
        type: Number,
        value: 6
      },
      placeholderWidth: {
        type: Number,
        computed: '_computePlaceholderWidth(widthPerItem, items.length)'
      },
      physicalItems: {
        type: Array,
        computed: '_computePhysicalItems(items, widthPerItem, scrollOffset, max)'
      }
    };
  }

  // [ 1 2 3 4 5 ] _ _ _ _ _ _  |
  // _ [ 2 3 4 5 1 ] _ _ _ _ _  |
  // _ _ [ 3 4 5 1 2 ] _ _ _ _  |
  // _ _ _ [ 4 5 1 2 3 ] _ _ _  |
  // _ _ _ _ [ 5 1 2 3 4 ] _ _  |
  // _ _ _ _ _ [ 1 2 3 4 5 ] _  |
  // _ _ _ _ _ _ [ 2 3 4 5 1 ]  |

  // f(physical_index: 0, max: 5, offset: 0) = virtual_index:  0
  // f(physical_index: 0, max: 5, offset: 1) = virtual_index:  5
  // f(physical_index: 0, max: 5, offset: 2) = virtual_index:  5
  // f(physical_index: 0, max: 5, offset: 3) = virtual_index:  5
  // f(physical_index: 0, max: 5, offset: 4) = virtual_index:  5
  // f(physical_index: 0, max: 5, offset: 5) = virtual_index:  5
  // f(physical_index: 0, max: 5, offset: 6) = virtual_index: 10
  // f(physical_index: 0, max: 5, offset: 7) = virtual_index: 10
  // f(physical_index: 0, max: 5, offset: 8) = virtual_index: 10

  // f(physical_index: 1, max: 5, offset: 0) = virtual_index:  1
  // f(physical_index: 1, max: 5, offset: 1) = virtual_index:  1
  // f(physical_index: 1, max: 5, offset: 2) = virtual_index:  6
  // f(physical_index: 1, max: 5, offset: 3) = virtual_index:  6
  // f(physical_index: 1, max: 5, offset: 4) = virtual_index:  6
  // f(physical_index: 1, max: 5, offset: 5) = virtual_index:  6
  // f(physical_index: 1, max: 5, offset: 6) = virtual_index:  6
  // f(physical_index: 1, max: 5, offset: 7) = virtual_index: 11
  // f(physical_index: 1, max: 5, offset: 8) = virtual_index: 11

  // f(physical_index: 2, max: 5, offset: 0) = virtual_index:  2
  // f(physical_index: 2, max: 5, offset: 1) = virtual_index:  2
  // f(physical_index: 2, max: 5, offset: 2) = virtual_index:  2
  // f(physical_index: 2, max: 5, offset: 3) = virtual_index:  7
  // f(physical_index: 2, max: 5, offset: 4) = virtual_index:  7
  // f(physical_index: 2, max: 5, offset: 5) = virtual_index:  7
  // f(physical_index: 2, max: 5, offset: 6) = virtual_index:  7
  // f(physical_index: 2, max: 5, offset: 7) = virtual_index:  7
  // f(physical_index: 2, max: 5, offset: 8) = virtual_index: 12

  /**
   * @param {number} physicalIndex
   * @param {number} offsetIndex
   * @param {number} max
   * @returns {number} The virtual index
   */
  _computeVirtualIndex(physicalIndex, offsetIndex, max) {
    return Math.ceil((offsetIndex - physicalIndex) / max) * max + physicalIndex;
  }

  _computePhysicalItems(items, widthPerItem, scrollOffset, max) {
    const offsetIndex = Math.ceil(scrollOffset / widthPerItem);
    return Array.from({ length: max }).map((v, physicalIndex) => {
      const virtualIndex = this._computeVirtualIndex(physicalIndex, offsetIndex, max);
      const itemOffset = (virtualIndex * widthPerItem);
      const virtualItem = items[virtualIndex];
      return { itemOffset, virtualItem };
    });
  }

  _computePlaceholderWidth(widthPerItem, itemsLength) {
    return widthPerItem * itemsLength;
  }

  _handleScroll(event) {
    this.scrollOffset = event.currentTarget.scrollLeft;
  }
}

window.customElements.define('oup-virtual-list', OupVirtualListElement);
