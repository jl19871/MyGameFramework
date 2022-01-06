/*
 * @Author: JL
 * @Date: 2022-01-06 14:11:26
 */
let packageName = "create-ui-template";
let fs = require('fire-fs');
let path = require('fire-path');
let Electron = require('electron');

let configUtil = Editor.require('packages://' + packageName + '/core/config-util.js');

let projectPath = Editor.Project.path;

Editor.Panel.extend({
  style: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
  template: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",

  ready() {
    new window.Vue({
      el: this.shadowRoot,

      init() {

      },

      created() {
        this._initConfig();
      },


      data: {
        uiOutputPath: null,
      },

      methods: {
        _initConfig() {
          configUtil.initCfg((data) => {
            this.uiOutputPath = data.uiOutputPath;
          });
        },
        _saveConfig() {
          let data = {
            uiOutputPath: this.uiOutputPath
          };
          configUtil.saveCfg(data);
        },
        onBtnSelectUIPath() {
          let res = Editor.Dialog.openFile({
            title: "选择UI逻辑脚本输出路径",
            defaultPath: projectPath,
            properties: ['openDirectory'],
          });
          if (res !== -1) {
            let dir = res[0];
            if (dir !== this.uiOutputPath) {
              this.uiOutputPath = dir;
            }
          }
        },
        onBtnOpenUIPath() {
          let fullPath = path.join(projectPath, this.uiOutputPath);
          if (fs.existsSync(fullPath)) {
            Electron.shell.showItemInFolder(fullPath);
            Electron.shell.beep();
          }
        },
      }
    });
  }
});