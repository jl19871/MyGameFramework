/*
 * @Author: JL
 * @Date: 2021-10-08 15:47:04
 */
import { SocketDelegate } from "./SocketDelegate";

export class Network {
    private _socket: SocketDelegate = null;
    private _url: string = 'ws://localhost:3000';

    constructor() {
        // this.safeConnectSocket();
    }

    close() {
        this.safeCloseSocket();
    }

    send(data, _cmd?, _wait?) {
        if (!this._socket.isSocketOpened()) {
            // Log.error('send message but socket not open!')
            return;
        }
        let cmd = (data.proto == undefined) ? -1 : data.proto;
        let wait = true;
        if (_cmd != undefined) {
            if (typeof _cmd === 'number') {
                cmd = _cmd;
                if (_wait != undefined) {
                    wait = _wait;
                }
            } else if (typeof _cmd === 'boolean') {
                wait = _cmd;
            }
        }

        console.log("send cmd = " + cmd);
        //TODO 根据wait 显示waiting
        this._socket.send(data, cmd);
    }

    connect(url?: string) {
        this.safeConnectSocket(url);
    }

    private safeConnectSocket(url: string) {
        if (this._socket != null) {
            this._socket.closeConnect();
        }
        this._socket = new SocketDelegate();

        if (url != undefined) {
            this._url = url;
        }
        this._socket.connect(this._url);
    }

    private safeCloseSocket() {
        if (this._socket != null) {
            this._socket.closeConnect();
        }
        this._socket = null;
    }
}