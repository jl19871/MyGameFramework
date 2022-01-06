/*
 * @Author: JL
 * @Date: 2022-01-06 14:19:10
 */
'use strict';

const fs = require('fire-fs');
const path = require('fire-path');

const configUtil = require('./config-util');

const projectPath = Editor.Project.path;
const adb = Editor.assetdb;

var outputRelativePath;
var outputFullPath;
var scriptTemplate;
var templatePath;

// 首字母大写
var firstCharUpper = function (str) {
    str = str.substring(0, 1).toUpperCase() + str.substring(1);
    return str;
}

/**
 * 输入：db://assets/resources/Prefab/Fight/FightUI.prefab
 * 输出：Prefab/Fight/FightUI
 */
var getPrefabPath = function (url) {
    let prefabStr = 'Prefab/';
    let prefabSuffix = '.prefab';
    let start = url.indexOf(prefabStr);
    let end = url.indexOf(prefabSuffix);
    return url.substring(start, end);
}

module.exports = {
    init() {
        configUtil.initCfg((data) => {
            outputRelativePath = data.uiOutputPath;
            outputFullPath = path.join(projectPath, outputRelativePath);
        });
        templatePath = Editor.url('packages://create-ui-template/core/ui-template.txt');
    },

    dealFolder(assetInfo) {
        let url = assetInfo.url;

        if (!fs.existsSync(outputFullPath)) {
            fs.mkdirsSync(outputFullPath);
        }
        let moduleName = path.basenameNoExt(url);
        let moduleFolder = path.join(outputFullPath, moduleName);
        if (!fs.existsSync(moduleFolder)) {
            fs.mkdirsSync(moduleFolder);
        }
    },

    dealPrefab(assetInfo) {
        let url = assetInfo.url;
        if (!fs.existsSync(outputFullPath)) {
            fs.mkdirsSync(outputFullPath);
        }

        let cengshu = '';
        let module = '';
        let a = path.dirname(url);
        let moduleName = '';
        while (module !== "UI") {
            module = path.basenameNoExt(a);
            a = path.dirname(a);
            if (module !== "UI") {
                cengshu += "../";
                moduleName = moduleName === '' ? `${module}${moduleName}` : `${module}/${moduleName}`;
            }
        }
        //获取文件夹名称
        // let moduleName = path.basenameNoExt(path.dirname(url));
        //创建对应父文件夹
        let moduleFolder = path.join(outputFullPath, moduleName);
        if (!fs.existsSync(moduleFolder)) {
            fs.mkdirsSync(moduleFolder);
        }
        //生成对应的ts文件
        let uiName = 'UI_' + firstCharUpper(path.basenameNoExt(url));
        let exportUIPath = `db://${outputRelativePath}/${moduleName}/${uiName}.ts`;
        Editor.log("path = " + exportUIPath + " cengshu = " + cengshu);
        let prefabPath = '';
        if (assetInfo.type === 'prefab') {
            prefabPath = getPrefabPath(url);
        }
        Editor.log("prefabPath = " + prefabPath);
        let scriptTemplate = fs.readFileSync(templatePath, 'utf8') + "";
        scriptTemplate = scriptTemplate.replace(/_TREE/g, cengshu);
        scriptTemplate = scriptTemplate.replace(/_MODULE/g, moduleName);
        scriptTemplate = scriptTemplate.replace(/_PREFABPATH/g, prefabPath);
        scriptTemplate = scriptTemplate.replace(/_UINAME/g, uiName);
        if (adb.exists(exportUIPath)) {
            Editor.warn(`文件${exportUIPath}已存在`);
        } else {
            adb.create(exportUIPath, scriptTemplate);
        }
    }
}