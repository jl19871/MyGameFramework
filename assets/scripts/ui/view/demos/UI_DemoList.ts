
import BaseUI from "../../../base/BaseUI";
import Game from "../../../Game";
import { EViewName, IViewData } from "../../../manager/UIManager";

const { ccclass, menu, property } = cc._decorator;

//TODO 快速修复错误，会在EViewName中添加对应的UI枚举
const VIEW_DATA: IViewData = {
	viewName: EViewName.UI_DemoList,
	resDirs: ["demos"],
	prefabUrl: "Prefab/UI/demos/DemoList", // ui界面prefab的位置
};

@ccclass
@menu("UI/demos/UI_DemoList")
export default class UI_DemoList extends BaseUI {


	@property(cc.Label)
	private timeLabel: cc.Label = null;


	private clientTick() {
		const now = new Date();
		const hour = now.getHours().toString().padStart(2, "0");
		const minutes = now.getMinutes().toString().padStart(2, "0");
		const sec = now.getSeconds().toString().padStart(2, "0");
		this.timeLabel.tid = `TID_LABEL_TIME,${hour}:${minutes}:${sec}`;
	}

	private showTip() {
		Game.UIManager.showTips("aaaaaaa");
	}

	private showDialog() {
		Game.UIManager.showDialog({
			oneKey: true,
			title: "hahahha",
			content: Game.DataManager.lang.getLangStr("TID_LABEL_HELLO_WORLD"),
			confirmCb: () => {
				Game.UIManager.showTips("TID_LABEL_HELLO_WORLD");
			}
		})
	}

	private openListView() {
		Game.UIManager.openUI(EViewName.UI_ListViewDemo);
	}

	//初始化UI
	public initUI(data: Record<string, unknown>) {

	}

	//界面显示开始
	protected onOpenStart() {

	}

	//界面显示完成
	protected onOpenEnd() {
		this.clientTick();
		this.schedule(this.clientTick, 1.0, cc.macro.REPEAT_FOREVER);
	}

	//界面关闭开始
	protected onCloseStart() {
		this.unschedule(this.clientTick);

	}

	//界面关闭完成
	protected onCloseEnd() {

	}

	public getViewData(): IViewData {
		return VIEW_DATA;
	}
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, UI_DemoList);