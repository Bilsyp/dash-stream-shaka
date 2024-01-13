import { useEffect, useState } from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import { useQueue } from "@uidotdev/usehooks";
import { usePapaParse } from "react-papaparse";
import { Myparams, labels } from "@/types";
import { formatInt, measureRTTAndRTO } from "@/lib/utils";
import Stats from "./Stats";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { config } from "@/lib/config";
export default function Player() {
  const [player, setPlayer] = useState<shaka.Player | null>()!;
  const [hasErrorloadVideo, setHasErrorLoadVideo] = useState<null | string>(
    null
  );
  const { add, queue } = useQueue<Myparams>([]);
  const { jsonToCSV } = usePapaParse();
  const handleTimeUpdate = async () => {
    const stats: any = player?.getStats();
    const result: any = await measureRTTAndRTO();
    const delay =
      stats?.loadLatency + stats?.streamBandwidth / stats?.estimatedBandwidth;
    if (stats) {
      labels.forEach((item) => {
        const element: Element | null = document.querySelector(`#${item}`);
        if (element) {
          element.textContent =
            item == "estimatedBandwidth"
              ? formatInt(stats["estimatedBandwidth"] / 1024)
              : item == "streamBandwidth"
              ? formatInt(stats["streamBandwidth"] / 1024)
              : item == "loadLatency"
              ? formatInt(stats["loadLatency"] * 1000)
              : item == "rtt"
              ? formatInt(result?.rtt)
              : item == "rto"
              ? formatInt(result?.rto)
              : item == "delay"
              ? formatInt(delay * 1000)
              : formatInt(stats[item]);
        }
      });
      add({
        width: stats["width"],
        height: stats["height"],
        loadLatency: formatInt(stats["loadLatency"] * 1000),
        streamBandwidth: formatInt(stats["streamBandwidth"] / 1024),
        estimatedBandwidth: formatInt(stats["estimatedBandwidth"] / 1024),
        decodedFrames: formatInt(stats["decodedFrames"]),
        droppedFrames: formatInt(stats["droppedFrames"]),
        bufferingTime: formatInt(stats["bufferingTime"]),
        playTime: formatInt(stats["playTime"]),
        pauseTime: formatInt(stats["pauseTime"]),
        rtt: formatInt(result?.rtt),
        rto: formatInt(result?.rto),
        delay: formatInt(delay * 1000),
      });
    }
  };
  const handleRecord = (): void => {
    const obj: any = JSON.stringify(queue);

    const csv = jsonToCSV(obj);
    const blob: Blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = url;
    a.download = "Record_data_IP.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleLoadVideo = async () => {
    try {
      await player?.load(
        "https://testbed-ndn-rg.stei.itb.ac.id/stream/playlist.mpd"
      );
      // "http://localhost:3000/stream/playlist.mpd"
      //
    } catch (error: unknown | any) {
      setHasErrorLoadVideo(error.message);
    }
  };

  useEffect(() => {
    const initVideoApp = async () => {
      shaka.polyfill.installAll();
      shaka.net.NetworkingEngine.registerScheme(
        "http",
        shaka.net.HttpFetchPlugin.parse,
        shaka.net.NetworkingEngine.PluginPriority.PREFERRED
      );
      const video = document.getElementById("video") as HTMLMediaElement;
      const videoContainer = document.getElementById(
        "video-container"
      ) as HTMLMediaElement;

      const localPlayer: shaka.Player = new shaka.Player();
      localPlayer.configure(config);
      await localPlayer.attach(video);

      const ui = new shaka.ui.Overlay(localPlayer, videoContainer, video);

      const controls: shaka.ui.Controls | null = ui.getControls();

      const player: shaka.Player | null | undefined = controls?.getPlayer();

      setPlayer(player);
      ui.configure({
        castReceiverAppId: "07AEE832",
        castAndroidReceiverCompatible: true,
        seekBarColors: {
          base: "rgba(255, 255, 255, 0.3)",
          buffered: "rgba(255, 255, 255, 0.54)",
          played: "red",
        },
        // seekOnTaps: true,
      });
    };
    initVideoApp();
  }, []);
  return (
    <div>
      <div className="video-conteiner p-3  overflow-clip">
        <div
          data-shaka-player-container
          id="video-container"
          className="  px-3   max-w-[1200px] lg:w-[50%] mx-auto border-[2px] rounded-md border-gray-500 "
          data-shaka-player-cast-receiver-id="07AEE832"
        >
          <video
            onTimeUpdate={handleTimeUpdate}
            data-shaka-player
            id="video"
            className="w-full "
          ></video>
          {hasErrorloadVideo && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Error . Something Wrong</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="optionsButton flex justify-center items-center flex-wrap gap-4 my-6">
          <Button onClick={handleLoadVideo}>
            <Play />
          </Button>
          <Button onClick={handleRecord}>Record Video</Button>
        </div>

        <Stats />
      </div>
    </div>
  );
}
