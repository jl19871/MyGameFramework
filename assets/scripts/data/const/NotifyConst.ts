/*
 * @Author: JL
 * @Date: 2021-10-08 15:47:04
 */


/**
 * 通知类型
 *
 * @export
 * @enum {number}
 */
export enum ENotifyType {
    // 网络相关
    SOCKET_OPEN = "SOCKET_OPEN",
    SOCKET_CLOSE = "SOCKET_CLOSE",
    SOCKET_ERROR = "SOCKET_ERROR",

    // 语言变更
    LANG_CHANGE = "LANG_CHANGE",

    // 读取进度
    LOADING_PROGRESS = "LOADING_PROGRESS",

    LOGIN_SUCCESS = "LOGIN_SUCCESS",


    BLOCK_INPUT_SHOW = "BLOCK_INPUT_SHOW",   // active block input
    BLOCK_INPUT_HIDE = "BLOCK_INPUT_HIDE",   // disable block input
    SWITCH_SCENE = "SWITCH_SCENE",       // 切换场景


    // DemoList
    DEMO_DEL_LISTITEM = "DEMO_DEL_LISTITEM",
}