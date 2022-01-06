import Bluebird = require("bluebird");
import { ENotifyType } from "../data/const/NotifyConst";
import Game from "../Game";
import { IViewData } from "../manager/UIManager";

const { ccclass, property } = cc._decorator;

/**
 * BaseUI 基类  弹出类UI
 *
 * @export
 * @abstract
 * @class BaseUI
 */
@ccclass
export default abstract class BaseUI extends cc.Component {
    protected maskNode: cc.Node = null;
    protected rootNode: cc.Node = null;

    onLoad(): void {
        this.maskNode = this.node.getChildByName("mask");
        this.rootNode = this.node.getChildByName("rootNode");
    }

    protected getShowAudioUrl(): string {
        // TODO UI打开的声音url
        return "";
        // return "common/audio/ui_panel_open";
    }

    public static async prepareData(data: Record<string, string>) {
        return data;
    }

    public initUI(data: Record<string, unknown>) {
        //
    }
    /**
     * 子类不要覆盖, 定制动画请重写 runOpenAni
     *
     * @protected
     * @param {boolean} [skipAnim=false]
     * @memberof BaseUI
     */
    public async openUI(skipAnim?: boolean) {
        this.onOpenStart();
        try {
            Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_SHOW, `show:${this.getViewData().viewName}`);
            this.playOpenAudio(skipAnim);
            await this.runOpenAni(skipAnim);
            if (this.isFullScreen()) {
                Game.UIManager.fullScreenViewRefNum += 1;
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_HIDE, `show:${this.getViewData().viewName}`);
        }
        this.onOpenEnd();
    }

    protected onOpenStart() {
        //
    }

    protected playOpenAudio(skipAudio?: boolean) {
        if (skipAudio) {
            return;
        }
        const audioUrl = this.getShowAudioUrl();
        if (!audioUrl) {
            return;
        }

        // TODO 声音播放
        // Game.AudioManager.playEffect(audioUrl);
    }

    protected async runOpenAni(skipAnim?: boolean): Promise<void> {
        if (skipAnim) {
            return;
        }
        if (!this.rootNode || !this.maskNode) {
            console.log("skip show anim");
            return;
        }
        await Bluebird.fromCallback((callback) => {
            const originScale = this.rootNode.scale;
            this.rootNode.scale = 0;
            this.maskNode.opacity = 0;
            cc.tween(this.rootNode)
                .to(0.25, { scale: originScale }, { easing: "backOut" })
                .call(() => { callback(null) })
                .start();
            cc.tween(this.maskNode)
                .to(0.25, { opacity: 200 })
                .start();
        });
    }

    protected onOpenEnd() {
        //
    }

    /**
     * 子类不要覆盖此函数, 定制动画重写 runCloseAni
     *
     * @protected
     * @param {boolean} [skipAnim=false]
     * @memberof BaseUI
     */
    protected async closeUI(skipAnim = false) {
        Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_SHOW, `hide:${this.getViewData().viewName}`);
        this.onCloseStart();
        if (this.isFullScreen()) {
            Game.UIManager.fullScreenViewRefNum -= 1;
        }
        await this.runCloseAni(skipAnim);
        this.onCloseEnd();
        Game.UIManager.destroyUI(this);
        Game.NotifyManager.emit(ENotifyType.BLOCK_INPUT_HIDE, `hide:${this.getViewData().viewName}`);
    }

    protected onCloseStart() {
        //
    }

    protected async runCloseAni(skipAnim = false) {
        if (skipAnim) {
            return;
        }
        if (!this.rootNode || !this.maskNode) {
            console.log("skip hide anim");
            return;
        }
        await Bluebird.fromCallback((callback) => {
            cc.tween(this.rootNode)
                .to(0.25, { scale: 0 }, { easing: "backIn" })
                .call(() => { callback(null) })
                .start();
            cc.tween(this.maskNode)
                .to(0.25, { opacity: 0 })
                .start();
        });
    }

    protected onCloseEnd() {
        //
    }

    /**
     * 只有 Topview 关闭时, 自己变成 Topview 时触发
     *
     * @protected
     * @memberof BaseUI
     */
    public onFocus() {
        //
    }

    /**
     * 当前 view 被新的 Topview 盖住时触发, 覆盖多个时只有第一次触发
     *
     * @protected
     * @memberof BaseUI
     */
    public onLostFocus() {
        //
    }

    /**
     * 获取当前界面的相关信息
     *
     * @abstract
     * @returns {IViewData}
     * @memberof BaseUI
     */
    public abstract getViewData(): IViewData;

    /**
     * 是否为全屏界面
     *
     * @protected
     * @returns
     * @memberof BaseUI
     */
    protected isFullScreen() {
        return false;
    }
}
