import { el } from 'redom';

export default class AssetItem {
  constructor(attributes) {
    this.el = el('a-asset-item', attributes);
  }
}
