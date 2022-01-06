
import BaseUI from "../../../../base/BaseUI";
import LangLabel from "../../../../component/LangLabel";
import Game from "../../../../Game";
import { EViewName, IViewData } from "../../../../manager/UIManager";
import { Log } from "../../../../util/Log";

const { ccclass, menu, property } = cc._decorator;

//TODO 快速修复错误，会在EViewName中添加对应的UI枚举
const VIEW_DATA: IViewData = {
	viewName: EViewName.UI_ConfirmBoard,
	resDirs: ["tips/confirm"],
	prefabUrl: "Prefab/UI/tips/confirm/confirmBoard", // ui界面prefab的位置
};


/**确定框界面参数 */
export interface DialogParams {
	oneKey?: boolean,
	title?: string,
	content: string,
	confirmCb?: Function,
	cancelCb?: Function
}

@ccclass
@menu("UI/tips/confirm/UI_ConfirmBoard")
export default class UI_ConfirmBoard extends BaseUI {

	@property(LangLabel)
	lab_title: LangLabel = null;
	@property(LangLabel)
	lab_content: LangLabel = null;

	@property(cc.Button)
	btn_confirm: cc.Button = null;
	@property(cc.Button)
	btn_cancel: cc.Button = null;

	@property(LangLabel)
	lab_confirm: LangLabel = null;
	@property(LangLabel)
	lab_cancel: LangLabel = null;

	private _onekey: boolean;
	private _title: string;
	private _content: string;
	private _confirmCb: Function;
	private _cancelCb: Function;


	public getViewData(): IViewData {
		return VIEW_DATA;
	}

	public initUI(params: Record<string, unknown>) {
		if (params == undefined) {
			Log.error(`UI_ConfirmBoard:没有传入参数！！！`);
			return;
		}
		let data = params as unknown as DialogParams;
		this._onekey = data.oneKey ? data.oneKey : false;
		this._title = data.title ? data.title : "";
		this._content = data.content;
		this._confirmCb = data.confirmCb;
		this._cancelCb = data.cancelCb;
	}


	protected onOpenStart(): void {
		this.lab_content.string = this._content;
		if (this._onekey) {
			this.btn_cancel.node.active = false;
			this.lab_cancel.node.active = false;
			this.btn_confirm.node.x = 0;
			this.lab_confirm.node.x = 0;
		}
		else {
			this.btn_cancel.node.active = true;
			this.lab_cancel.node.active = true;
			this.btn_confirm.node.x = 150;
			this.lab_confirm.node.x = 150;
		}
	}

	protected onCloseStart(): void {

	}

	onCancel() {
		this._cancelCb && this._cancelCb();
		this.closeUI();
	}

	onConfirm() {
		this._confirmCb && this._confirmCb();
		this.closeUI();
	}
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, UI_ConfirmBoard);