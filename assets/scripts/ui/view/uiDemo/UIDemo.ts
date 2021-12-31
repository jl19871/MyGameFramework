import BaseUI from "../../../base/BaseUI";
import Game from "../../../Game";
import { EViewName, IViewData } from "../../../manager/UIManager";

/*
 * @Author: JL
 * @Date: 2021-12-31 16:57:45
 */
const { ccclass, property } = cc._decorator;

const VIEW_DATA: IViewData = {
  viewName: EViewName.UI_Demo,
  resDirs: ["uiDemo"],
  prefabUrl: "Prefab/UI", // ui界面prefab的位置
};

@ccclass
export default class UIDemo extends BaseUI {
  public getViewData(): IViewData {
    return VIEW_DATA;
  }


}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, UIDemo);