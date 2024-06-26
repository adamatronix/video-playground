import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoJSPlayerProps {
  options?:any,
  onReady?: (player:Player) => void,
  onQualityLevelChange?: (level:any) => void
}

export const VideoJSPlayer = ({
  options,
  onReady,
  onQualityLevelChange,
  ...props
}:VideoJSPlayerProps) => {
  const videoRef = useRef<any|null>(null);
  const playerRef = useRef<any|null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');

      if(videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }
      

      const player = playerRef.current = videojs(videoElement, options, () => {
          videojs.log('player is ready');
          onReady && onReady(player);
        });

      //@ts-ignore
      const qualityLevels = player.qualityLevels();

      qualityLevels.on('addqualitylevel', function(event:any) {
        let qualityLevel = event.qualityLevel;
      
        if (qualityLevel.height >= 400) {
          qualityLevel.enabled = true;
        } else {
          qualityLevel.enabled = false;
        }
      });

      qualityLevels.on('change', function() {
        onQualityLevelChange && onQualityLevelChange(qualityLevels[qualityLevels.selectedIndex]);
      });

    // You could update an existing player in the `else` block here
    // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);

    }
  }, [videoRef, options, onReady]);

  return (
    <div data-vjs-player ref={videoRef} {...props}>
    </div>
  )
}