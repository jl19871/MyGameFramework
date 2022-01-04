/*
 * @Author: JL
 * @Date: 2022-01-04 15:04:57
 */
import BaseUI from "../../../../base/BaseUI";
import { EViewName, IViewData } from "../../../../manager/UIManager";
import { TipsItem } from "./TipsItem";

const { ccclass, menu, property } = cc._decorator;

const VIEW_DATA: IViewData = {
    viewName: EViewName.UI_Tips,
    resDirs: ["TipsUI"],
    prefabUrl: "Prefab/UI/tips/tip/tips", // ui界面prefab的位置
};

@ccclass
@menu('UI/Common/UITips')
export default class TipsUI extends BaseUI {
    public getViewData(): IViewData {
        return VIEW_DATA;
    }
    @property(cc.Prefab)
    private tipPrefab: cc.Prefab = null;

    private tipPool: TipsItem[] = [];

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

    onClose() {

    }
}