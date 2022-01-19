/*
 * @Author: JL
 * @Date: 2022-01-19 14:47:11
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENotifyType } from "../../../../data/const/NotifyConst";
import Game from "../../../../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    private index: number = -1;
    @property(cc.Label)
    label: cc.Label = null;


    public setData(index: number, data: unknown) {
        this.index = index;
        this.label.string = `${index}  ${data as string}`;
    }

    public clickItem() {
        cc.log("click " + this.index);
        Game.NotifyManager.emit(ENotifyType.DEMO_DEL_LISTITEM, this.index);
    }
}
