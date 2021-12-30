/*
 * @Author: JL
 * @Date: 2021-10-25 18:20:54
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseSingleton from "../base/BaseSingeton";
import GameDataCenter from "../data/GameDataCenter";

const { ccclass, property } = cc._decorator;


@ccclass
export default class AudioManager extends BaseSingleton {
    private currentBgm = -1;
    private bgmVolume = 1.0;
    private effectVolume = 1.0;

    playBgm(audioClip: cc.AudioClip) {
        this.stopBgm();
        // TODO
        // if (!GameDataCenter.system.is_open_music) return;
        this.currentBgm = cc.audioEngine.play(audioClip, true, this.bgmVolume);
    }

    stopBgm() {
        if (this.currentBgm >= 0) {
            cc.audioEngine.stop(this.currentBgm);
        }
    }


    playEffect(audioClip: cc.AudioClip) {
        // if (!GameDataCenter.system.is_open_sound) return;
        cc.audioEngine.playEffect(audioClip, false);
    }

    pause() {
        cc.audioEngine.pause(this.currentBgm);
    }

    resume() {
        cc.audioEngine.resume(this.currentBgm);
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
        cc.audioEngine.pauseAllEffects();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
        cc.audioEngine.resumeAllEffects();
    }
}

