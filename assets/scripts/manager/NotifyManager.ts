/*
 * @Author: JL
 * @Date: 2021-12-30 11:08:26
 */

import * as _ from "lodash";
import BaseSingleton from "../base/BaseSingeton";
import { ENotifyType } from "../data/const/NotifyConst";


type NotifyFunc = (userData: unknown, eNotifyType?: ENotifyType) => void;

interface IObserver {
  func: NotifyFunc;
  target: unknown;
}

/**
 * 全局事件
 *
 * @export
 * @class NotifyManager
 */
export default class NotifyManager extends BaseSingleton {

  private observerMap: Map<ENotifyType, IObserver[]> = new Map();

  private constructor() {
    super();
    // 检查 EENotifyType 拼写, 并初始化 observerMap
    for (const key in ENotifyType) {
      if (Object.prototype.hasOwnProperty.call(ENotifyType, key)) {
        const notifyName = ENotifyType[key];
        if (notifyName !== key) {
          throw new Error(`Definition Error ${key} -> ${notifyName}`);
        }
        this.observerMap.set(notifyName, []);
      }
    }
  }

  public async setup() {
    console.log("NotifyManager setup");
  }

  /**
   * 注册事件
   *
   * @param ENotifyType
   * @param notifyFunc
   * @param target
   * @memberof NotifyManager
   */
  public on(ENotifyType: ENotifyType, notifyFunc: NotifyFunc, target: unknown) {
    this.observerMap.get(ENotifyType).push({ func: notifyFunc, target: target });
  }

  /**
   * 移除事件
   *
   * @param ENotifyType
   * @param notifyFunc
   * @param target
   * @memberof NotifyManager
   */
  public off(ENotifyType: ENotifyType, notifyFunc: NotifyFunc, target: unknown) {
    _.remove(this.observerMap.get(ENotifyType), (o) => o.func === notifyFunc && o.target === target);
  }

  /**
   * 发射事件
   *
   * @template T
   * @param ENotifyType
   * @param [userData=null]
   * @memberof NotifyManager
   */
  public emit<T extends unknown>(ENotifyType: ENotifyType, userData: T = null) {
    this.observerMap.get(ENotifyType).forEach((obs: IObserver) => {
      if (obs.target) {
        obs.func.call(obs.target, userData, ENotifyType);
      } else {
        obs.func(userData, ENotifyType);
      }
    });
  }
}