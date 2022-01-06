/*
 * @Author: JL
 * @Date: 2022-01-06 19:14:08
 */
declare module cc {
  interface Label {
    /** 多语言 TID, 参数使用 ',' 分隔, 例如 "TID_UI_BUTTON,3,4" */
    tid: string;
  }
  interface RichText {
    /** 多语言 TID, 参数使用 ',' 分隔, 例如 "TID_UI_BUTTON,3,4" */
    tid: string;
  }
}
