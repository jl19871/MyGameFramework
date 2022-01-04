/*
 * @Author: JL
 * @Date: 2021-10-11 10:47:01
 */
class CmdObject {
  private _cmd: any = null;
  private _target: unknown = null;
  private _callBack: Function = null;

  constructor(_cmd: any, _target: unknown, _cb: Function) {
    this._target = _target;
    this._callBack = _cb;
    this._cmd = _cmd;
  }

  public getTarget(): unknown {
    return this._target;
  }

  public getCallBack(): Function {
    return this._callBack;
  }

  public getCmd(): any {
    return this._cmd;
  }

  public excute(data: any, cmd: any) {
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
  private _commands = []; //命令对象缓存

  public addListener(cmd: any, target: unknown, callback: Function, force?: boolean) {
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

  public updateListener(cmd: any, callback: Function, target: unknown) {
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

  public removeListenerByCmdTarget(cmd: any, target: unknown) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (!cmdObj)
        continue;
      if (cmdObj.getCmd() === cmd && cmdObj.getTarget() === target) {
        this._commands.splice(i, 1);
        i -= 1;
      }

    }
  }

  public cmdIsExisted(cmd: any, target: unknown) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (!cmdObj)
        continue;
      if (cmdObj.getCmd() == cmd && cmdObj.getTarget() == target)
        return true;
    }
    return false;
  }

  public removeAllListener(target: unknown) {
    for (let i = 0; i < this._commands.length; i++) {
      let cmdObj = this._commands[i];
      if (cmdObj.getTarget() == target) {
        this._commands.splice(i, 1);
        i -= 1;
      }
    }
  }

  public parseMsg(cmd: any, data: any) {
    console.log("parseMsg  cmd = " + cmd);
    switch (cmd) {
      // 优先处理一些通用命令
      default: {
        for (let i = 0; i < this._commands.length; i++) {
          let cmdObj = this._commands[i];
          if (!cmdObj)
            continue;
          if (cmdObj.getCmd() === cmd) {
            cmdObj.excute(data, cmd);
          }
        }
      }
        break;
    }
  }

  public clear() {
    this._commands = [];
  }
}


export default new CmdParser();