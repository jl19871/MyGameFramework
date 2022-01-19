/*
 * @Author: JL
 * @Date: 2021-12-31 18:57:10
 */
/*
 * @Author: JL
 * @Date: 2021-12-31 16:36:40
 */
import BaseUI from "../base/BaseUI";
import { ENotifyType } from "../data/const/NotifyConst";
import Game from "../Game";


/**
 * UI界面名称
 *
 * @export
 * @enum {number}
 */


export enum EViewName {
  UI_Demo = "UI_Demo",
  UI_HotUpdate = "UI_HotUpdate",
  UI_Tips = "UI_Tips",
  UI_ConfirmBoard = "UI_ConfirmBoard",
  UI_ListViewDemo = "UI_ListViewDemo",
  UI_DemoList = "UI_DemoList"
}



// ========================================================================================
/**
* popview 数据结构
*
* @export
* @interface IViewData
*/
export interface IViewData {
  // view 名字
  viewName: EViewName;
  // 除通用资源目录外，引用的资源目录，没有可不填
  resDirs: string[];
  // 创建界面所需的 prefab
  prefabUrl: string;
}



interface IGameViewCfg {
  viewData: IViewData;
  viewClass: BaseUI;
}

interface ICreateQueue {
  viewCfg: IGameViewCfg;
  userData: Record<string, unknown>;
}

// ========================================================================================

/**
 * ui 管理器, 注册 ui, 显示 ui
 *
 * @export
 * @class UIManager
 */
export default class UIManager {

  get fullScreenViewRefNum() {
    return this._fullScreenViewRefNum;
  }
  set fullScreenViewRefNum(value: number) {
    this._fullScreenViewRefNum = value;
  }
  private _fullScreenViewRefNum = 0;

  private uiRootNode: cc.Node = null;

  private viewDataMap: Map<EViewName, IGameViewCfg> = new Map();

  private createdUIs: BaseUI[] = [];

  private createQueue: ICreateQueue[] = [];

  private isCreatingUI = false;

  public async setup() {
    console.log("UIManager setup");
  }

  public setUIRootNode(node: cc.Node) {
    this.uiRootNode = node;
  }

  /**
   * 
   * @param viewData 界面参数
   * @param viewClass 界面
   */
  public registUI(viewData: IViewData, viewClass: any) {
    this.viewDataMap.set(viewData.viewName, { viewData, viewClass });
  }

  /**
   * 
   * @param viewName UI名称
   * @param userData 需要传输的数据 在initUI中调用
   * @returns 
   */

  public async openUI(viewName: EViewName, userData?: Record<string, unknown>) {
    const viewCfg = this.viewDataMap.get(viewName);
    if (!viewCfg) {
      console.warn(`view: ${viewName} not regist`);
      return;
    }
    if (!this.uiRootNode) {
      console.error("uiRootNode is null");
    }
    this.createQueue.push({ viewCfg, userData });
    if (!this.isCreatingUI) {
      await this.creatUI();
    }
  }

  /**
   * 异步创建队列中所有UI
   * @returns 
   */
  private async creatUI() {
    const createData = this.createQueue.shift();
    if (!createData) {
      return;
    }
    this.isCreatingUI = true;
    const viewData = createData.viewCfg.viewData;

    Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_SHOW, `creatUI: ${viewData.viewName}`);

    await Game.AssetManager.loadDirs(viewData.resDirs);
    const prefab = cc.resources.get<cc.Prefab>(viewData.prefabUrl, cc.Prefab);
    const node = cc.instantiate(prefab);
    node.name = cc.path.basename(viewData.prefabUrl);
    node.position = cc.Vec3.ZERO;
    node.parent = this.uiRootNode;
    this.isCreatingUI = false;

    Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_HIDE, `creatUI: ${viewData.viewName}`);

    const ui = node.getComponent(BaseUI);
    const curTopView = this.createdUIs[this.createdUIs.length - 1];
    if (curTopView) {
      curTopView.onLostFocus();
      console.log(`view: ${viewData.viewName} onLostFocus`);
    }

    this.createdUIs.push(ui);
    ui.initUI(createData.userData);
    await ui.openUI();
    // 递归创建队列中的 view
    await this.creatUI();
  }

  public destroyUI(ui: BaseUI) {
    const viewData = ui.getViewData();
    const viewIndex = this.createdUIs.findIndex((o) => o === ui);
    if (viewIndex === -1) {
      return;
    }
    const isTopView = viewIndex === this.createdUIs.length - 1;
    this.createdUIs.splice(viewIndex, 1);
    ui.node.destroy();
    if (isTopView && this.createdUIs.length > 0) {
      const curTopView = this.createdUIs[this.createdUIs.length - 1];
      curTopView.onFocus();
      console.log(`view: ${viewData.viewName} onFocus`);
    }
    Game.AssetManager.releaseDirs(viewData.resDirs);
  }

  public showTips(tip: string) {
    let str = Game.DataManager.lang.getLangStr(tip);
    this.openUI(EViewName.UI_Tips, { "tip": str });
  }

  public showDialog(params: Record<string, unknown>) {
    this.openUI(EViewName.UI_ConfirmBoard, params);
  }
}
