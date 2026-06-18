import Aliplayer from '../../../../aliplayer-h5-min';
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

const AutoplayVideo = ({
  videoSrcURL,
  videoTitle,
  className,
  height,
  width,
  ...props
}: {
  videoSrcURL: string;
  videoTitle?: string;
  className?: string;
  height?: number;
  width?: number | string;
} & ComponentPropsWithoutRef<'div'>) => {
  const playerContainer = useRef<HTMLDivElement>(null);

  const [loadedStyle, setloadedStyle] = useState(false);
  const [loadedScript, setLoadedScript] = useState(false);

  useEffect(() => {
    if (document.getElementById('aliplayer-css')) {
      return;
    } else {
      const playerStyle = document.createElement('link');
      playerStyle.href =
        'https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/skins/default/aliplayer-min.css';
      playerStyle.rel = 'stylesheet';
      playerStyle.id = 'aliplayer-css';
      document.head.appendChild(playerStyle);
      playerStyle.onload = () => {
        setloadedStyle(true);
      };
    }

    if (document.getElementById('aliplayer-js')) {
      return;
    } else {
      const script = document.createElement('script');
      // script.src = `https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js`;
      script.src = `https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js`;
      script.async = true;
      script.id = 'aliplayer-js';
      document.body.appendChild(script);
      script.onload = () => {
        setLoadedScript(true);
      };
    }
  }, []);

  useEffect(() => {
    if (playerContainer.current && Aliplayer && loadedStyle && loadedScript) {
      const player = new Aliplayer(
        {
          id: playerContainer.current.id,
          source: videoSrcURL,
          autoplay: true,
          loop: true,
          width: '100%',
          height: '100%',
          isLive: false,
          playsinline: true,
          preload: true,
          controlBarVisibility: 'never',
          useH5Prism: true,
          x5_type: 'h5',
          x5_fullscreen: true,
          x5_orientation: 'landscape',
          cover: videoTitle,
        },
        (player: any) => {
          const allVideo = playerContainer.current?.querySelectorAll('video');
          // console.log(allVideo);
          allVideo?.forEach((video) => {
            video.style.objectFit = 'cover';
          });

          player.mute();
          player.play();
        }
      );
    }
  }, [videoSrcURL, videoTitle, height, width, loadedStyle, Aliplayer, loadedScript]);

  return (
    <div
      id="ali-video"
      className={`${className}`}
      style={{ height, width }}
      ref={playerContainer}
      {...props}
    />
  );
};

export default AutoplayVideo;
