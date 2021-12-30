/*
 * @Author: JL
 * @Date: 2021-11-01 13:49:20
 * 多语言数据管理器
 */

import BaseSingleton from "../../../base/BaseSingeton";
import Game from "../../../Game";
import { ENotifyType } from "../../const/NotifyConst";
import IDataModel from "../IDataModel";

/**
 * 支持的语言类型
 *
 * @export
 * @enum {number}
 */
export enum ELangType {
  EN = "en",   // 英文
  ZH = "zh"    // 中文
}

export default class LangModel extends IDataModel {
  protected modelName: string = 'LangModel';
  // 游戏内资源
  // json 资源
  private langJson: Record<string, string> = {};

  private _curLang = ELangType.EN;

  constructor() {
    super('LangModel');
  }

  get curLang() {
    return this._curLang;
  }

  public async setup() {
    const defaultLang = ELangType[cc.sys.language.toUpperCase()] || ELangType.ZH;
    this.LoadStorage();
    this._curLang = this.Get('curLang', defaultLang) as ELangType;
    // 读取语言文件
    await this.loadLanguageDir(this._curLang);
    console.log("LangModel setup");
  }

  /**
   * 动态加载语言包
   *
   * @private
   * @param lang
   * @memberof LocalizedUtil
   */
  private async loadLanguageDir(lang: string) {
    await Game.AssetMgr.loadDir(`language/${lang}`);
    const cfgPath = `language/${lang}/StringList`;
    this.langJson = cc.resources.get<cc.JsonAsset>(cfgPath, cc.JsonAsset).json;
  }


  /**
   * 释放语言包
   *
   * @private
   * @param lang
   * @memberof LangModel
   */
  private async releaseLanguageDir(lang: string) {
    Game.AssetMgr.releaseDir(`language/${lang}`);
  }


  /**
   * 语言改变处理
   *
   * @param lang
   * @memberof LangModel
   */
  public async setLanguage(lang: ELangType) {
    if (this._curLang === lang) {
      return;
    }

    const orginLang = this._curLang;
    this._curLang = lang;

    Game.NotifyMgr.emit(ENotifyType.BLOCK_INPUT_SHOW, "changeLanguage");
    this.Set('curLang', this._curLang);
    this.Save();
    await this.loadLanguageDir(lang);
    Game.NotifyMgr.emit(ENotifyType.LANG_CHANGE);
    this.releaseLanguageDir(orginLang);
    Game.NotifyMgr.emit(ENotifyType.BLOCK_INPUT_HIDE, "changeLanguage");
  }

  /**
     * 获得 tid 对应的字符串配置
     *
     * @param tid
     * @returns string
     * @memberof LocalizedUtil
     */
  public getLangStr(tid: string): string {
    const [id, ...args] = tid.split(",");
    let str = this.langJson[id];
    args.forEach((arg, index) => {
      str = str.replace("${p" + (index + 1) + "}", arg);
    });
    return str;
  }
}