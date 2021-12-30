/*
 * @Author: JL
 * @Date: 2021-10-08 15:47:04
 */
import IDataModel from "./model/IDataModel";
import LangModel from "./model/Lang/LangModel";

class GameDataCenter {
    private _tModel: Array<IDataModel> = [];
    private _lang: LangModel = null;

    constructor() {

    }

    newModel<T extends IDataModel>(c: { getInstance(): T }): T {
        let obj = c.getInstance();
        this._tModel.push(obj);
        return obj
    }

    clear() {
        this._tModel.forEach(m => {
            m.clear();
        });
    }

    initModule() {
        this._lang = this.newModel(LangModel);
    }


    get lang() {
        return this._lang;
    }
}

export default new GameDataCenter();