import { Log } from "../util/Log";
import CmdParser from "./CmdParser";
import { ISocket, SocketState, WbSocket, WxSocket } from "./Socket";

const DATA_TOTAL_LEN = 4;	//数据总长度
const PROTOCOLTYPE_LEN = 4;	//协议号长度

export interface ISocketDelegate {
    onSocketOpen();
    onSocketMessage(data: string | ArrayBuffer);
    onSocketError(errMsg);
    onSocketClosed(msg: string);
}

/**
 * 实现socket各个回调接口
 */
export class SocketDelegate implements ISocketDelegate {
    private _socket: ISocket;

    private reconnectTime = 0;
    private connectUrl = null;
    private isReconnecting = false;

    isSocketOpened() {
        return (this._socket && this._socket.getState() == SocketState.OPEN);
    }

    isSocketClosed() {
        return this._socket == null;
    }

    connect(url: string) {
        // Log.log(LOG_TAG.SOCKET, 'connect socket = ' + url);
        // 根据平台创建socket
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this._socket = new WxSocket(url, this);
        } else {
            this._socket = new WbSocket(url, this);
        }
        this._socket.connect();
    }

    closeConnect() {
        if (this._socket) {
            this._socket.close();
        }
    }

    onSocketOpen() {
        // Log.log(LOG_TAG.SOCKET, 'socket open');
        // EventMgr.emit(SocketEvent.SOCKET_OPEN);
    }

    onSocketError(errMsg) {
        errMsg && Log.error('socket error, msg = ' + errMsg);

        // EventMgr.emit(SocketEvent.SOCKET_ERROR);


    }

    onSocketClosed(msg: string) {
        // Log.log(LOG_TAG.SOCKET, 'socket close, reason = ' + msg);
        if (this._socket) {
            this._socket.close();
        }
        this._socket = null;
        // EventMgr.emit(SocketEvent.SOCKET_CLOSE);
        // UIHelp.ShowDialog({
        //     content: GameDataCenter.lang.getText('network_error'),
        //     okCb: () => {
        //         cc.director.loadScene("LoginScene");
        //     }
        // })
    }

    onSocketMessage(data: string | ArrayBuffer) {
        if (this.isSocketClosed()) {
            // Log.error('onMessage call but socket had closed')
            return;
        }
        let msg;
        if (typeof (data) === 'string') {
            msg = data;
        } else {
            msg = this.bufferToMsg(data);
        }
        // Log.log(LOG_TAG.SOCKET, 'recieve msg = ', msg);
        // EventMgr.emit(msg.messageName, msg);
        CmdParser.parseMsg(msg.proto, msg.data);
        // UIHelp.CloseWaiting();
    }

    send(msg, cmd) {
        if (typeof (msg) === 'string') {
            this._socket.send(msg);
        } else {
            let sendBuf = this.msgToBuffer(msg, cmd);
            // UIHelp.ShowWaiting();
            this._socket.send(sendBuf);
        }
    }

    /**
     * buffer转msg，解包用
     * 协议格式：总字节数（4个字节，总字节数=协议号字节数+数据长度） + 协议号（4个字节） + 数据
     * @param recvBuf 
     */
    private bufferToMsg(recvBuf: ArrayBuffer) {
        let cc = new Uint8Array(recvBuf);
        // let message = yxy.apple.protobuf.Parcal.decode(cc);
        // return message;
    }

    /**
     * msg转buffer，封包用
     * 协议格式：总字节数（4个字节，总字节数=协议号字节数+数据长度） + 协议号（4个字节） + 数据
     * @param msg 
     */
    private msgToBuffer(msg, cmd: number) {
        let bytes = msg.constructor.encode(msg).finish();

        // var parcal = new yxy.apple.protobuf.Parcal();
        // parcal.version = 0x10000000;
        // parcal.sequence = 1;
        // parcal.timestamp = 0;
        // parcal.proto = cmd;
        // parcal.data = bytes;
        // parcal.destination = 0x01e70000;

        // var _bytes = yxy.apple.protobuf.Parcal.encode(parcal).finish();
        // var arrayBuffer = _bytes.slice().buffer;

        // return arrayBuffer
        return null;
    }
}