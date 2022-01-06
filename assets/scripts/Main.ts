/*
 * @Author: JL
 * @Date: 2021-12-31 18:05:30
 */

import { ENotifyType } from "./data/const/NotifyConst";
import Game from "./Game";
import { ESceneName } from "./manager/SceneManager";

const { ccclass, property } = cc._decorator;

//  是否是测试模式
const TEST = true;

/**
 * 游戏主场景
 */

@ccclass
export default class Main extends cc.Component {

  @property({
    type: cc.Node,
    tooltip: "场景添加节点",
  })
  private sceneRootNode: cc.Node = null;

  @property({
    type: cc.Node,
    tooltip: "弹出UI添加节点",
  })
  private uiRootNode: cc.Node = null;

  @property({
    type: cc.Node,
    tooltip: "屏蔽框节点",
  })
  private blockInputNode: cc.Node = null;

  @property({
    type: cc.Node,
    tooltip: "loading节点",
  })
  private loadingNode: cc.Node = null;

  @property({
    type: cc.Label,
    tooltip: "测试按键屏蔽的状态文本",
  })
  private blockStateLabel: cc.Label = null;


  private blockInputRefNum = 0;

  private blockReasons: string[] = [];


  protected onLoad() {
    cc.game.on(cc.game.EVENT_HIDE, this.pauseAllSound, this);
    cc.game.on(cc.game.EVENT_SHOW, this.resumeAllSound, this);

    this.updateBlockInput();
    this.blockStateLabel.node.active = TEST;
  }

  protected onDestroy() {
    Game.NotifyManager.off(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
    Game.NotifyManager.off(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);

    cc.game.off(cc.game.EVENT_HIDE, this.pauseAllSound, this);
    cc.game.off(cc.game.EVENT_SHOW, this.resumeAllSound, this);
  }

  protected async start() {
    await this.gameSetup();
    Game.NotifyManager.on(ENotifyType.BLOCK_INPUT_SHOW, this.showBlockInput, this);
    Game.NotifyManager.on(ENotifyType.BLOCK_INPUT_HIDE, this.hideBlockInput, this);
    //
    Game.SceneManager.setSceneRootNode(this.sceneRootNode);
    Game.UIManager.setUIRootNode(this.uiRootNode);



    // 载入 Home 场景
    await Game.SceneManager.gotoScene({
      sceneName: ESceneName.SCENE_HOTUPDATE,
      resDirs: [""],
      prefabUrl: "Prefab/Scene/HotUpdate",
    });

    // await Game.SceneManager.gotoScene({
    //     sceneName: ESceneName.SHARE,
    //     resDirs: ["share"],
    //     prefabUrl: "share/prefab/Share",
    // });

    // 场景切换以后
    cc.tween(this.loadingNode)
      .to(0.2, { opacity: 0 })
      .call(() => this.loadingNode.active = false)
      .start();
  }

  private async gameSetup() {
    await Game.DataManager.setup();
    await Game.AssetManager.setup();
    await Game.AudioManager.setup();
    await Game.NotifyManager.setup();
    await Game.UIManager.setup();
  }

  private showBlockInput(reason: string) {
    this.blockInputRefNum += 1;
    this.blockReasons.push(reason);
    this.updateBlockInput();
    console.log("blockinput block:", this.blockInputRefNum, reason);
  }

  private hideBlockInput(reason: string) {
    this.blockInputRefNum -= 1;
    this.blockReasons.splice(this.blockReasons.findIndex((o) => o === reason), 1);
    this.updateBlockInput();
    console.log("blockinput allow:", this.blockInputRefNum, reason);
  }

  private updateBlockInput() {
    this.blockInputNode.active = this.blockInputRefNum > 0;
    if (!TEST) {
      return;
    }
    this.blockStateLabel.string = this.blockReasons.join("\n");
  }

  private pauseAllSound() {
    console.log("cc.audioEngine.pauseAll");
    Game.AudioManager.pauseAll();
  }

  private resumeAllSound() {
    console.log("cc.audioEngine.resumeAll");
    Game.AudioManager.resumeAll();
  }
}
