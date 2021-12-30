/*
 * @Author: JL
 * @Date: 2021-10-11 10:47:01
 */
class CmdObject {
  _cmd = null;
  _target = null;
  _callBack = null;

  constructor(_cmd: any, _target: any, _cb: Function) {
    this._target = _target;
    this._callBack = _cb;
    this._cmd = _cmd;
  }

  getTarget() {
    return this._target;
  }

  getCallBack() {
    return this._callBack;
  }

  getCmd() {
    return this._cmd;
  }

  excute(data: any, cmd: any) {
    if (this._callBack) {
      if (this._target) {
        this._callBack.call(this._target, data, cmd);
      } else {
        this._callBack.call(data, cmd);
      }
    }
  }
}

class CmdParser {
  _commands = []; //命令对象缓存

  addListener(cmd, target, callback, force?) {
    if (force) {
      if (this.cmdIsExisted(cmd, target)) {
        this.removeListenerByCmdTarget(cmd, target);
      }
    } else {
      if (this.cmdIsExisted(cmd, target)) {
        return;
      }
    }

    let cmdObj = new CmdObject(cmd, target, callback);

    if (!cmdObj)
      return;

    this._commands.push(cmdObj);
  }

  updateListener(cmd, callback, target) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (!cmdObj)
        continue;
      if (cmdObj.getCmd() == cmd) {
        let newObj = new CmdObject(cmd, target, callback);
        this._commands[i] = newObj;
        return;
      }
    }

    let cmdObj = new CmdObject(cmd, target, callback);
    if (!cmdObj)
      return;

    this._commands.push(cmdObj);
  }

  removeListenerByCmdTarget(cmd, target) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (!cmdObj)
        continue;
      if (cmdObj.getCmd() == cmd && cmdObj.getTarget() == target) {
        this._commands.splice(i, 1);
        i -= 1;
      }

    }
  }

  cmdIsExisted(cmd, target) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (!cmdObj)
        continue;
      if (cmdObj.getCmd() == cmd && cmdObj.getTarget() == target)
        return true;
    }
    return false;
  }

  removeAllListener(target) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (cmdObj.getTarget() == target) {
        this._commands.splice(i, 1);
        i -= 1;
      }
    }
  }

  parseMsg(cmd, data) {
    console.log("parseMsg  cmd = " + cmd);
    switch (cmd) {
      // 优先处理一些通用命令
      default: {
        for (let i = 0; i < this._commands.length; i++) {
          let cmdObj = this._commands[i];
          if (!cmdObj)
            continue;
          if (cmdObj.getCmd() == cmd) {
            cmdObj.excute(data, cmd);
          }
        }
      }
        break;
    }
  }

  clear() {
    this._commands = [];
  }
}


export default new CmdParser();