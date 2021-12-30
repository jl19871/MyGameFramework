/*
 * @Author: JL
 * @Date: 2021-12-29 14:19:37
 */

import { ENotifyType } from "../data/const/NotifyConst";
import GameDataCenter from "../data/GameDataCenter";
import Game from "../Game";

const { ccclass, property, executeInEditMode, menu, inspector } = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LangLabel`)
@inspector("packages://game-helper/inspectors/LangLabel.js")
export default class LangLabel extends cc.Label {
    @property()
    private _tid = "";
    @property({
        multiline: true,
        tooltip: "多语言 text id",
    })
    set tid(value: string) {
        this._tid = value;
        this.updateString();
    }
    get tid() {
        return this._tid;
    }
    @property()
    private _bmfontUrl = "";
    @property()
    set bmfontUrl(value: string) {
        this._bmfontUrl = value;
        this.updateString();
    }
    get bmfontUrl() {
        return this._bmfontUrl;
    }

    protected onLoad() {
        super.onLoad();
        Game.NotifyMgr.on(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        this.updateString();
    }

    protected onDestroy() {
        Game.NotifyMgr.off(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        super.onDestroy();
    }

    /**
     * 收到语言变更通知
     *
     * @private
     * @memberof LangLabel
     */
    private onLanguageChanged() {
        this.updateString();
    }

    /**
     * 更新文本
     *
     * @private
     * @returns {*}
     * @memberof LangLabel
     */
    private updateString(): void {
        if (!this._tid) {
            return;
        }
        if (CC_EDITOR) {
            // 编辑器模式下, 从插件中获取文本
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = "" + str;
            });
        } else {
            // 获取多语言文本
            this.string = "" + GameDataCenter.lang.getLangStr(this._tid);
            // 如果使用了 bmfont, 切换对应语言的 bmfont
            if (!this.useSystemFont && this._bmfontUrl) {
                const lang = GameDataCenter.lang.getCurLang();
                this.font = cc.resources.get<cc.BitmapFont>(this._bmfontUrl.replace("${lang}", lang), cc.BitmapFont);
            }
        }
    }
}
