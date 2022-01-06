/*
 * @Author: JL
 * @Date: 2022-01-06 19:12:13
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseScene from "../../base/BaseScene";
import Game from "../../Game";
import { EViewName } from "../../manager/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends BaseScene {

    @property(cc.Label)
    private timeLabel: cc.Label = null;

    public didEnter() {
        this.schedule(this.clientTick, 1.0, cc.macro.REPEAT_FOREVER);
    }

    public async willLeave(userData?: Record<string, unknown>) {
        this.unschedule(this.clientTick);
    }

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
}
