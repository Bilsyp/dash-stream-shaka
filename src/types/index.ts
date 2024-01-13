export interface Myparams {
  width?: number | string;
  height?: number | string;
  loadLatency?: number | string;
  streamBandwidth?: number | string;
  estimatedBandwidth?: number | string;
  decodedFrames?: number | string;
  droppedFrames?: number | string;
  bufferingTime?: number | string;
  playTime?: number | string;
  pauseTime?: number | string;
  rtt?: number | string;
  rto?: number | string;
  delay?: number | string;
}

export const labels: string[] = [
  "width",
  "height",
  "loadLatency",
  "streamBandwidth",
  "estimatedBandwidth",
  "decodedFrames",
  "droppedFrames",
  "bufferingTime",
  "playTime",
  "pauseTime",
  "rtt",
  "rto",
  "delay",
];
