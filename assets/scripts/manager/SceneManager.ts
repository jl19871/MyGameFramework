/*
 * @Author: JL
 * @Date: 2021-12-31 18:00:21
 */
import _ = require("lodash");
import BaseScene from "../base/BaseScene";
import { ENotifyType } from "../data/const/NotifyConst";
import Game from "../Game";



/**
 * 场景名称
 *
 * @export
 * @enum {number}
 */
export enum ESceneName {
    SCENE_HOTUPDATE = "SCENE_HOTUPDATE",    // 热更新
    SCENE_LOGIN = "SCENE_LOGIN",            // 登录
    SCENE_HOME = "SCENE_HOME",              // 主界面
}

// ========================================================================================

/**
 * 场景数据结构
 *
 * @export
 * @interface ISceneData
 */
export interface ISceneData {
    // scene 名字
    sceneName: ESceneName;
    // 除通用资源目录外，引用的资源目录，没有可不填
    resDirs: string[];
    // 创建界面所需的 prefab
    prefabUrl: string;
}
// ========================================================================================
/**
* 切换场景
*
* @export
* @interface ISwitchSceneData
*/
export interface ISwitchSceneData {
    from?: ESceneName;
    to: ESceneName;
}

// ========================================================================================



/**
 * 场景管理器
 *
 * @export
 * @class SceneManager
 */
export default class SceneManager {
    /** 场景根节点 */
    private sceneRootNode: cc.Node = null;
    /** 当前运行的场景数据 */
    private currentSceneData: ISceneData = null;
    /** 正在前往的场景数据 */
    private goingSceneData: ISceneData = null;
    /** 当前运行的尝试实例 */
    private currentScene: BaseScene = null;

    public async setup() {
        console.log("SceneManager setup");
    }

    public setSceneRootNode(node: cc.Node) {
        this.sceneRootNode = node;
    }

    /**
     * 切换场景
     *
     * @param sceneData
     * @param [userData]
     * @returns {*}
     * @memberof SceneManager
     */
    public async gotoScene(sceneData: ISceneData, userData?: Record<string, unknown>): Promise<void> {
        if (this.goingSceneData) {
            console.error(`scene [${this.goingSceneData.sceneName}] is going now`);
            return;
        }
        if (this.currentSceneData && this.currentSceneData.sceneName === sceneData.sceneName) {
            console.error(`scene [${this.currentSceneData.sceneName}] is runing now`);
            return;
        }
        const currentSceneResDirs = this.currentSceneData ? this.currentSceneData.resDirs : [];
        const needReleaseResDirs = _.difference(currentSceneResDirs, sceneData.resDirs);
        const needLoadResDirs = _.difference(sceneData.resDirs, currentSceneResDirs);
        try {
            Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_SHOW, `gotoScene: ${sceneData.sceneName}`);
            // 加载资源
            await Game.AssetManager.loadDirs(needLoadResDirs);
            // 创建场景
            const prefab = cc.resources.get<cc.Prefab>(sceneData.prefabUrl, cc.Prefab);
            const node = cc.instantiate(prefab);
            node.name = cc.path.basename(sceneData.prefabUrl);
            node.position = cc.Vec3.ZERO;
            node.parent = this.sceneRootNode;
            const newScene = node.getComponent(BaseScene);
            await newScene.willEnter(userData);
            newScene.didEnter();
            // 切换场景通知
            Game.NotifyManager.emit(ENotifyType.SWITCH_SCENE, {
                from: this.currentSceneData ? this.currentSceneData.sceneName : null,
                to: sceneData.sceneName,
            });
            // 释放资源
            if (this.currentScene) {
                await this.currentScene.willLeave();
                this.currentScene.didLeave();
                this.currentScene.node.destroy();
            }
            Game.AssetManager.releaseDirs(needReleaseResDirs);
            this.currentSceneData = sceneData;
            this.currentScene = newScene;
        } catch (e) {
            console.error(e);
        } finally {
            Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_HIDE, `gotoScene: ${sceneData.sceneName}`);
        }
    }
}
