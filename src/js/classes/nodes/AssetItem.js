import setAttributes from './../../functions/setAttributes.js';

export default class AssetItem {
  constructor(attributes) {
    const $asset = document.createElement('a-asset-item');
    setAttributes($asset, attributes);
    return $asset;
  }
}
