import BaseUI from "../../../../base/BaseUI";
import LangLabel from "../../../../component/LangLabel";
import Game from "../../../../Game";
import { EViewName, IViewData } from "../../../../manager/UIManager";
import { Log } from "../../../../util/Log";

/*
 * @Author: JL
 * @Date: 2021-12-31 16:57:45
 */
const { ccclass, property } = cc._decorator;

const VIEW_DATA: IViewData = {
    viewName: EViewName.UI_Confirm,
    resDirs: ["confirmDialog"],
    prefabUrl: "Prefab/UI/tips/confirmDialog/ConfirmDialog", // ui界面prefab的位置
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
export default class ConfirmDialog extends BaseUI {

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
            Log.error(`ConfirmDialog:没有传入参数！！！`);
            return;
        }
        let data = params[0] as DialogParams;
        this._onekey = data.oneKey ? data.oneKey : false;
        this._title = data.title ? data.title : "";
        this._content = data.content;
        this._confirmCb = data.confirmCb;
        this._cancelCb = data.cancelCb;
    }


    protected onShowBegin(): void {
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

    protected onHideBegin(): void {

    }

    onCancel() {
        this._cancelCb && this._cancelCb();
        this.hideUI();
    }

    onConfirm() {
        this._confirmCb && this._confirmCb();
        this.hideUI();
    }
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, ConfirmDialog);