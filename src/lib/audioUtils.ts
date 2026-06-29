/**
 * 将 MP3 ArrayBuffer 解码并重构成 WAV ArrayBuffer 以便 Live2D 音频振幅分析
 */
export const convertMp3ArrayBufferToWavArrayBuffer = async (mp3ArrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(mp3ArrayBuffer);

  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const channelData: Int16Array[] = [];

  for (let i = 0; i < numberOfChannels; i++) {
    const data = audioBuffer.getChannelData(i);
    const int16Data = new Int16Array(data.length);
    for (let j = 0; j < data.length; j++) {
      // 限制振幅并转换为 16-bit PCM
      int16Data[j] = Math.round(Math.max(-1, Math.min(1, data[j])) * 32767);
    }
    channelData.push(int16Data);
  }

  // 构造 44 字节 WAV 文件头
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF 头
  const writeString = (v: DataView, offset: number, str: string) => {
    for (let k = 0; k < str.length; k++) {
      v.setUint8(offset + k, str.charCodeAt(k));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + channelData[0].length * 2 * numberOfChannels, true);
  writeString(view, 8, 'WAVE');

  // fmt 子块
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM 格式
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2 * numberOfChannels, true); // ByteRate
  view.setUint16(32, 2 * numberOfChannels, true); // BlockAlign
  view.setUint16(34, 16, true); // BitDepth

  // data 子块
  writeString(view, 36, 'data');
  view.setUint32(40, channelData[0].length * 2 * numberOfChannels, true);

  // 合并头与音频数据
  const wavData = new Uint8Array(wavHeader.byteLength + channelData[0].length * 2 * numberOfChannels);
  wavData.set(new Uint8Array(wavHeader), 0);

  let offset = wavHeader.byteLength;
  for (let i = 0; i < channelData[0].length; i++) {
    for (let j = 0; j < numberOfChannels; j++) {
      wavData[offset++] = channelData[j][i] & 0xFF;
      wavData[offset++] = (channelData[j][i] >> 8) & 0xFF;
    }
  }

  return wavData.buffer;
};
