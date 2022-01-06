/*
 * @Author: JL
 * @Date: 2022-01-04 15:04:57
 */
import LangLabel from "../../../../component/LangLabel";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu('UI/Common/TipsItem')
export class TipsItem extends cc.Component {
    @property(LangLabel)
    private tipLabel: LangLabel = null;

    private ready: boolean = true;

    public playTip(message: string) {
        this.node.stopAllActions();
        this.ready = false;
        this.tipLabel.string = message;
        this.reset();
        cc.tween(this.node)
            .to(0.5, { position: cc.v3(0, 75), opacity: 255 })
            .delay(1)
            .to(0.5, { position: cc.v3(0, 150), opacity: 0 })
            .call(() => this.ready = true)
            .start();
    }

    public isReady(): boolean {
        return this.ready;
    }

    private reset() {
        this.node.setPosition(0, 0);
        this.node.opacity = 180;
    }
}