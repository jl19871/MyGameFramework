/*
 * @Author: JL
 * @Date: 2021-10-08 15:47:04
 */
import IDataModel from "./model/IDataModel";
import LangModel from "./model/Lang/LangModel";
import SystemModel from "./model/System/SystemModel";

export default class DataManager {
    private _tModel: Array<IDataModel> = [];
    private _lang: LangModel = null;
    private _system: SystemModel = null;

    constructor() {

    }

    newModel<T extends IDataModel>(c: { new(): T }): T {
        let obj = new c();
        this._tModel.push(obj);
        return obj
    }

    clear() {
        this._tModel.forEach(m => {
            m.clear();
        });
    }

    public async setup() {
        this._lang = this.newModel(LangModel);
        this._system = this.newModel(SystemModel);
        console.log("DataManager setup");
    }

    get lang(): LangModel {
        return this._lang;
    }

    get system(): SystemModel {
        return this._system;
    }
}