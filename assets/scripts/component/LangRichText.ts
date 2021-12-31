import { ENotifyType } from "../data/const/NotifyConst";
import Game from "../Game";

/*
 * @Author: JL
 * @Date: 2021-12-29 14:19:37
 */
const { ccclass, property, executeInEditMode, menu, inspector } = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LangRichText`)
@inspector("packages://game-helper/inspectors/LangRichText.js")
export default class LangRichText extends cc.RichText {
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

    protected onLoad() {
        Game.NotifyManager.on(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        this.updateString();

    }

    protected onDestroy() {
        Game.NotifyManager.off(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        super.onDestroy();
    }

    private onLanguageChanged() {
        this.updateString();
    }

    private updateString() {
        if (!this._tid) {
            return;
        }
        if (CC_EDITOR) {
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = "" + str;
            });
        } else {
            const str = "" + Game.DataManager.lang.getLangStr(this._tid);
            this.string !== str && (this.string = str);
        }
    }
}
