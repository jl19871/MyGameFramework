/*
 * @Author: JL
 * @Date: 2021-12-31 18:00:33
 */

/**
 * 场景基类
 *
 * @export
 * @class BaseScene
 */
const { ccclass } = cc._decorator;
@ccclass
export default class BaseScene extends cc.Component {

    public async willEnter(userData?: Record<string, unknown>) {
        //
    }

    public didEnter(data?: Record<string, unknown>) {
        //
    }

    public async willLeave(userData?: Record<string, unknown>) {
        //
    }

    public didLeave() {
        //
    }
}
