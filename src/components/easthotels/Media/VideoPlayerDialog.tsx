import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useEffect, useState, ReactNode } from 'react';
import Aliplayer from '../../../../aliplayer-h5-min.js';
import CloseButton from '../CustomTypes/Components/CloseButton';
import ComponentError from '../Error/ComponentError';

interface VideoPlayerDialogProps {
  url: string;
  children: ReactNode;
}

export function VideoPlayerDialog({ url, children }: VideoPlayerDialogProps) {
  try {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loadedStyle, setloadedStyle] = useState(false);
    const [loadedScript, setLoadedScript] = useState(false);

    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = `https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js`;
    //     script.async = true;
    //     document.body.appendChild(script);
    //     script.onload = () => {
    //       // Initialize the player after the script loads
    //       console.log('script loaded');
    //       setloadedScript(true);
    //     };

    // }, [isDialogOpen]);

    useEffect(() => {
      if (isDialogOpen) {
        if (!loadedStyle && !loadedScript) {
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
        }

        if (loadedStyle && loadedScript && Aliplayer) {
          const player = new Aliplayer({
            id: 'player-con',
            source: url,
            width: '100%',
            height: '100%',
            autoplay: true,
            isLive: false,
            rePlay: false,
            playsinline: false,
            preload: true,
            controlBarVisibility: 'hover',
            useH5Prism: true,
            skinLayout: [
              {
                name: 'H5Loading',
                align: 'cc',
              },
              {
                name: 'errorDisplay',
                align: 'tlabs',
                x: 0,
                y: 0,
              },
              {
                name: 'infoDisplay',
              },
              {
                name: 'tooltip',
                align: 'blabs',
                x: 0,
                y: 56,
              },
              {
                name: 'thumbnail',
              },
              {
                name: 'controlBar',
                align: 'blabs',
                x: 0,
                y: 0,
                children: [
                  {
                    name: 'progress',
                    align: 'blabs',
                    x: 0,
                    y: 44,
                  },
                  {
                    name: 'playButton',
                    align: 'tl',
                    x: 15,
                    y: 12,
                  },
                  {
                    name: 'timeDisplay',
                    align: 'tl',
                    x: 10,
                    y: 7,
                  },
                  {
                    name: 'fullScreenButton',
                    align: 'tr',
                    x: 10,
                    y: 12,
                  },
                  {
                    name: 'volume',
                    align: 'tr',
                    x: 5,
                    y: 10,
                  },
                ],
              },
            ],
            language: 'en-us',
            onerror: (e) => {
              console.log('error: ', e);
            },
          });
        }
      }
    }, [loadedStyle, isDialogOpen, Aliplayer, loadedScript]);

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    return (
      <>
        <Dialog>
          <DialogTrigger
            asChild
            onClick={handleOpenDialog}
            style={{
              WebkitAppearance: 'none',
            }}
          >
            {children}
          </DialogTrigger>
          {isDialogOpen && (
            <DialogContent className="h-[90%] w-[90%]">
              <div>
                <div className="absolute right-0 top-[-40px]">
                  <DialogClose className="focus:outline-none">
                    <CloseButton
                      onClick={() => handleCloseDialog()}
                      className="mt-3 focus:outline-none"
                    />
                  </DialogClose>
                </div>
                <div id="player-con"></div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
}
