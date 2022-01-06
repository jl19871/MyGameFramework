/*
 * @Author: JL
 * @Date: 2022-01-04 14:20:32
 */

import BaseScene from "../../base/BaseScene";
import Game from "../../Game";
import { ESceneName } from "../../manager/SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HotUpdateScene extends BaseScene {

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

    public didEnter() {

        Game.SceneManager.gotoScene({
            sceneName: ESceneName.SCENE_LOGIN,
            resDirs: [""],
            prefabUrl: "Prefab/Scene/LoginScene",
        });
    }

    public async willLeave(userData?: Record<string, unknown>) {
    }
}