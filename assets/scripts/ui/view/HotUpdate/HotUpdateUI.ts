/*
 * @Author: JL
 * @Date: 2022-01-04 14:20:32
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "../../../base/BaseUI";
import Game from "../../../Game";
import { EViewName, IViewData } from "../../../manager/UIManager";

const { ccclass, property } = cc._decorator;

const VIEW_DATA: IViewData = {
    viewName: EViewName.UI_HotUpdate,
    resDirs: ["HotUpdate"],
    prefabUrl: "Prefab/UI/hotUpdate/HotUpdate", // ui界面prefab的位置
};

@ccclass
export default class HotUpdateUI extends BaseUI {
    public getViewData(): IViewData {
        return VIEW_DATA
    }

    @property({ displayName: 'project.manifest 资源对比文件', type: cc.Asset, })
    manifest: cc.Asset = null;

    @property({ displayName: '版本号', type: cc.Label, })
    versionLabel: cc.Label = null;

    @property({ displayName: '热更新进度条', type: cc.ProgressBar })
    updateProgress: cc.ProgressBar = null;

    @property({ displayName: '消息提示', type: cc.Label })
    tipsLabel: cc.Label = null;

    @property({ displayName: '添加节点', type: cc.Node })
    addNode: cc.Node = null;

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, HotUpdateUI);