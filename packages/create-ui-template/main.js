'use strict';

const dontSelectCorrectAssetMsg = {
  type: 'warning',
  buttons: ['OK'],
  title: 'warning',
  message: 'Please select a UI prefab!',
  defaultId: 0,
  noLink: true
};

const uiTemplate = require('./core/ui-template');

module.exports = {
  load() {
    // execute when package loaded
    uiTemplate.init();
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'config'() {
      // open entry panel registered in package.json
      Editor.Panel.open('create-ui-template');
    },
    'create'() {
      let currentSelection = Editor.Selection.curSelection('asset');
      if (currentSelection.length <= 0) {
        Editor.Dialog.messageBox(dontSelectCorrectAssetMsg);
        return;
      }
      let selectionUUid = currentSelection[0];
      let assetInfo = Editor.assetdb.assetInfoByUuid(selectionUUid);
      let assetType = assetInfo.type;
      // if (assetType === 'folder') {
      //   uiTemplate.dealFolder(assetInfo);
      // } else 
      if (assetType === 'prefab' || assetType === 'scene') {
        uiTemplate.dealPrefab(assetInfo);
      } else {
        Editor.Dialog.messageBox(dontSelectCorrectAssetMsg);
      }
    }
  },
};