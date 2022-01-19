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

    public didEnter() {
        Game.UIManager.openUI(EViewName.UI_DemoList);
    }
}
