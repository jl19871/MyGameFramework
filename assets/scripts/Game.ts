/*
 * @Author: JL
 * @Date: 2021-12-30 11:32:12
 * 游戏统一调动器
 */

import DataManager from "./data/DataManager";
import AssetManager from "./manager/AssetManager";
import AudioManager from "./manager/AudioManager";
import NotifyManager from "./manager/NotifyManager";
import SceneManager from "./manager/SceneManager";
import UIManager from "./manager/UIManager";
import { Network } from "./network/Network";
import { SingletonFactory } from "./util/SingletonFactory";

class Game {
  // 单例全部在此初始化

  /** 资源管理器 */
  public static get AssetManager(): AssetManager {
    return SingletonFactory.getInstance(AssetManager);
  }
  /** 音频管理器 */
  public static get AudioManager(): AudioManager {
    return SingletonFactory.getInstance(AudioManager);
  }

  /** 全局通知工具 */
  public static get NotifyManager(): NotifyManager {
    return SingletonFactory.getInstance(NotifyManager);
  }

  /** 网络工具 */
  public static get WebManager(): Network {
    return SingletonFactory.getInstance(Network);
  }

  /** 数据模型管理器 */
  public static get DataManager(): DataManager {
    return SingletonFactory.getInstance(DataManager);
  }

  /** 场景管理器 */
  public static get SceneManager(): SceneManager {
    return SingletonFactory.getInstance(SceneManager);
  }

  /** UI 管理器 */
  public static get UIManager(): UIManager {
    return SingletonFactory.getInstance(UIManager);
  }

  /** 游戏工具类 */
  // public static get GameUtil(): GameUtil {
  //     return GameUtil.getInstance();
  // }


  public static clearAllMgr() {
    SingletonFactory.clearAll();
  }


}

export default Game;
