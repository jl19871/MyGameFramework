import { ENotifyType } from "../data/const/NotifyConst";
import Game from "../Game";

/*
 * @Author: JL
 * @Date: 2021-12-29 14:19:37
 */
const { ccclass, property, executeInEditMode, menu, inspector } = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LangSprite`)
@inspector("packages://game-helper/inspectors/LangSprite.js")
export default class LangSprite extends cc.Sprite {
    @property()
    private _spriteUrl = "";
    @property()
    set spriteUrl(value: string) {
        this._spriteUrl = value;
        this.updateSpriteFrame();
    }
    get spriteUrl() {
        return this._spriteUrl;
    }

    protected onLoad() {
        Game.NotifyManager.on(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        this.updateSpriteFrame();
    }

    protected onDestroy() {
        Game.NotifyManager.off(ENotifyType.LANG_CHANGE, this.onLanguageChanged, this);
        super.onDestroy();
    }

    /**
     * 收到语言变更通知
     *
     * @private
     * @memberof LangSprite
     */
    private onLanguageChanged() {
        this.updateSpriteFrame();
    }

    /**
     * 更新 spriteFrame
     *
     * @private
     * @returns {*}
     * @memberof LangSprite
     */
    private updateSpriteFrame(): void {
        if (CC_EDITOR) {
            return;
        }
        if (!this._spriteUrl) {
            return;
        }
        if (this._spriteUrl) {
            const lang = Game.DataManager.lang.curLang;
            this.spriteFrame = cc.resources.get<cc.SpriteFrame>(this._spriteUrl.replace("${lang}", lang), cc.SpriteFrame);
        }
    }
}
