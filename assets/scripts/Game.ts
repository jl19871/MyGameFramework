/*
 * @Author: JL
 * @Date: 2021-12-30 11:32:12
 * 游戏统一调动器
 */

import AssetManager from "./manager/AssetManager";
import AudioManager from "./manager/AudioManager";
import NotifyManager from "./manager/NotifyManager";

class Game {
  // 单例全部在此初始化

  /** 资源管理器 */
  public static get AssetMgr(): AssetManager {
    return AssetManager.getInstance();
  }
  /** 音频管理器 */
  public static get AudioMgr(): AudioManager {
    return AudioManager.getInstance();
  }

  /** 全局通知工具 */
  public static get NotifyMgr(): NotifyManager {
    return NotifyManager.getInstance();
  }

  /** 场景管理器 */
  // public static get SceneManager(): SceneManager {
  //     return SceneManager.getInstance();
  // }

  /** PopView 管理器 */
  // public static get PopViewManager(): PopViewManager {
  //     return PopViewManager.getInstance();
  // }

  /** 游戏工具类 */
  // public static get GameUtil(): GameUtil {
  //     return GameUtil.getInstance();
  // }


}

export default Game;
