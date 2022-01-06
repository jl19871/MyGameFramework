/*
 * @Author: JL
 * @Date: 2021-10-08 15:47:04
 */
import Game from "../../../Game";
import IDataModel from "../IDataModel";

export default class SystemModel extends IDataModel {
    is_open_music: boolean = false;
    is_open_sound: boolean = false;

    is_check_reverse: boolean = false;

    gameVersion = "";

    constructor() {
        super('system');
        // this.Set('music_state', 1);
        // this.Set('sound_state', 1);
        // this.Save();
        this.LoadStorage();
        this.is_open_music = this.Get('music_state', true);
        this.is_open_sound = this.Get('sound_state', true);
    }

    public async setup() {

    }

    setMusicState(state: boolean) {
        this.is_open_music = state;
        this.Set('music_state', this.is_open_music ? 1 : 0);
        this.Save();
        // 播放

        // Game.AudioManager.playBgm(GameDataCenter.res.getBgm(BGM_TYPE.BGM_MAIN));

    }

    setSoundState(state: boolean) {
        this.is_open_sound = state;
        this.Set('sound_state', this.is_open_sound ? 1 : 0);
        this.Save();
    }
}