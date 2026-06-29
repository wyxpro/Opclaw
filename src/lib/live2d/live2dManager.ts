import { LAppDelegate } from '@/lib/live2d/src/lappdelegate';
import type { ResourceModel } from '@/lib/protocol';

export class Live2dManager {
    // 单例
    public static getInstance(): Live2dManager {
        if (! this._instance) {
            this._instance = new Live2dManager();
        }

        return this._instance;
    }

    public setReady(ready: boolean) {
      this._ready = ready;
    }

    public isReady(): boolean {
      return this._ready;
    }

    public changeCharacter(character: ResourceModel | null) {
      // _subdelegates中只有一个画布, 所以设置第一个即可
      this._ready = false;
      LAppDelegate.getInstance().changeCharacter(character)
    }

    public setLipFactor(weight: number): void {
      this._lipFactor = weight;
    }

    public getLipFactor(): number {
      return this._lipFactor;
    }

    public getModel(): any {
      const delegates = LAppDelegate.getInstance().getSubdelegate();
      if (delegates && delegates.getSize() > 0) {
        const manager = delegates.at(0).getLive2DManager();
        if (manager && manager._models && manager._models.getSize() > 0) {
          return manager._models.at(0);
        }
      }
      return null;
    }

    public startTalkingMotion(): void {
      const model = this.getModel();
      if (!model) return;
      if (model._modelSetting) {
        const hasTalk = model._modelSetting.getMotionCount('Talk') > 0;
        const hasTapBody = model._modelSetting.getMotionCount('TapBody') > 0;
        if (hasTalk) {
          model.startRandomMotion('Talk', 2); // PriorityNormal = 2
        } else if (hasTapBody) {
          model.startRandomMotion('TapBody', 2);
        }
      }
    }

    public setRandomExpression(): void {
      const model = this.getModel();
      if (model) {
        model.setRandomExpression();
      }
    }

    public pushAudioQueue(audioData: ArrayBuffer): void {
      this._ttsQueue.push(audioData);
    }

    public popAudioQueue(): ArrayBuffer | null {
      if (this._ttsQueue.length > 0) {
        const audioData = this._ttsQueue.shift();
        return audioData;
      } else {
        return null;
      }
    }

    public clearAudioQueue(): void {
      this._ttsQueue = [];
    }

    public playAudio(): ArrayBuffer | null {
      if (this._audioIsPlaying) return null; // 如果正在播放则返回
      const audioData = this.popAudioQueue();
      if (audioData == null) return null; // 没有音频数据则返回
      this._audioIsPlaying = true;
      // 播放音频
      const playAudioBuffer = (buffer: AudioBuffer) => {
        var source = this._audioContext.createBufferSource();
        source.buffer = buffer;
        
        source.connect(this._audioContext.destination);
        // 监听音频播放完毕事件
        source.onended = () => {
          this._audioIsPlaying = false;
        };
        source.start();
        this._audioSource = source;
      }
      // 创建一个新的 ArrayBuffer 并复制数据, 防止原始数据被decodeAudioData释放
      const newAudioData = audioData.slice(0);
      this._audioContext.decodeAudioData(newAudioData).then(
        buffer => {
          playAudioBuffer(buffer);
        }
      );
      return audioData;
    }

    public stopAudio(): void {
      this.clearAudioQueue();
      if (this._audioSource) {
        this._audioSource.stop();
        this._audioSource = null;
      }
      this._audioIsPlaying = false;
    }

    public isAudioPlaying(): boolean {
      return this._audioIsPlaying;
    }

    constructor() {
      this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this._audioIsPlaying = false;
      this._audioSource = null;
      this._lipFactor = 1.0;
      this._ready = false;
    }

    private static _instance: Live2dManager;
    private _ttsQueue: ArrayBuffer[] = [];
    private _audioContext: AudioContext;
    private _audioIsPlaying: boolean;
    private _audioSource: AudioBufferSourceNode | null;
    private _lipFactor: number;
    private _ready: boolean;
  }