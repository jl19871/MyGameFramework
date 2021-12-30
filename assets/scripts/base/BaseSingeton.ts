/*
 * @Author: JL
 * @Date: 2021-12-28 17:16:43
 */
/**
 * 单例基类
 *
 * @export
 * @class BaseSingleton
 */
export default class BaseSingleton {

    constructor() { /** */ }

    public static getInstance() {
        const typeClass = this as any;
        if (!typeClass._instance) {
            typeClass._instance = new typeClass();
        }
        return typeClass._instance;
    }
}
