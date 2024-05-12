import { useState, useRef, useEffect } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

export const useDuration = (source: any) => {
  const playerRef = useRef<Player|null>(null);
  const [ duration , setDuration ] = useState<number|null>(null);

  useEffect(() => {
    if(!playerRef.current) {
      const videoElement = document.createElement("video-js");
      const player = playerRef.current = videojs(videoElement, {sources: [{
        src: source.hd,
        type: 'video/mp4'
        // type: 'application/x-mpegURL'
      }]}, () => {
        player.one("loadedmetadata", () => { setDuration(player.cache_.duration) });
        
      });
    }
   
  }, [source])

  return [
    duration
  ] as const
}