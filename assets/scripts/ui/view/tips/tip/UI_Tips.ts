/*
 * @Author: JL
 * @Date: 2022-01-06 18:24:37
 */

import BaseUI from "../../../../base/BaseUI";
import Game from "../../../../Game";
import { EViewName, IViewData } from "../../../../manager/UIManager";
import { TipsItem } from "./TipsItem";

const { ccclass, menu, property } = cc._decorator;

/**确定框界面参数 */
export interface TipParams {
	tip: string
}

//TODO 快速修复错误，会在EViewName中添加对应的UI枚举
const VIEW_DATA: IViewData = {
	viewName: EViewName.UI_Tips,
	resDirs: ["tips/tip"],
	prefabUrl: "Prefab/UI/tips/tip/tips", // ui界面prefab的位置
};

@ccclass
@menu('UI/Common/UI_Tips')
export default class UI_Tips extends BaseUI {
	public getViewData(): IViewData {
		return VIEW_DATA;
	}
	@property(cc.Prefab)
	private tipPrefab: cc.Prefab = null;

	private tipPool: TipsItem[] = [];

	public initUI(data: Record<string, unknown>) {
		this.showTip((data as unknown as TipParams).tip);
	}

	showTip(message: string) {
		for (let i = 0; i < this.tipPool.length; ++i) {
			if (this.tipPool[i] != null && this.tipPool[i].isReady()) {
				this.tipPool[i].playTip(message);
				return;
			}
		}
		let TipNode = cc.instantiate(this.tipPrefab);
		TipNode.parent = this.node;
		let tip = TipNode.getComponent(TipsItem);
		this.tipPool.push(tip);
		tip.playTip(message);
	}
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, UI_Tips);