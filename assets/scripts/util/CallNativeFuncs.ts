/*
 * @Author: JL
 * @Date: 2021-11-12 15:11:53
 */

class CallNativeFuncs {
  test1() {
    if (cc.sys.platform === cc.sys.ANDROID) {
      if (jsb) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "test1", "()V");
      }

    } else if (cc.sys.os === cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("CocosHelper", "test1", "()V");
    }
  }

  test2(param1, param2) {
    if (cc.sys.platform === cc.sys.ANDROID) {
      if (jsb) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "test2", "(Ljava/lang/String;Ljava/lang/String;)V", param1, param2);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      jsb.reflection.callStaticMethod("CocosHelper", "test2WithParm1:andParm2:", param1, param2);
    }
  }
}

export default new CallNativeFuncs();