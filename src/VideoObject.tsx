import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import styled from 'styled-components';
import 'video.js/dist/video-js.css';

interface VideoObjectProps extends React.HTMLAttributes<HTMLLIElement> {
  data:any,
  mainplayer?:Player|null
}

const Wrapper = styled.li`
  padding: 20px 60px;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  position: relative;
  overflow: hidden;
`

const Progress = styled.div`
  position: absolute;
  height: 100%;
  background: rgba(255,255,255,0.2);
  top: 0;
  left: 0;
`

export const VideoObject = ({
  data,
  mainplayer,
  ...props
}:VideoObjectProps) => {
  const [ objectWidth , setObjectWidth ] = useState(200);
  const [ progress, setProgress ] = useState(0);
  const playerRef = useRef<any|null>(null);

  useEffect(() => {
    if(mainplayer) {
      mainplayer.on("timeupdate", () => {
        if(mainplayer.lastSource_.player === data.hls || mainplayer.lastSource_.player === data.hd) {
          setProgress((mainplayer.cache_.currentTime / mainplayer.cache_.duration) * 100);
        } else {
          setProgress(0);
        }
      })
    }

  },[mainplayer,data]);
  useEffect(() => {
    if(!playerRef.current) {
      const videoElement = document.createElement("video-js");
      const player = playerRef.current = videojs(videoElement, {sources: [{
        src: data.hd,
        type: 'video/mp4'
        // type: 'application/x-mpegURL'
      }]}, () => {
        player.one("loadedmetadata", () => { setObjectWidth(player.cache_.duration) });
        
      });
    }
   
  }, [data])


  return (
    <Wrapper style={{width: `${objectWidth}px`}}{...props}>
      <Progress style={{width: `${progress}%`}}/>
      { data.title }
    </Wrapper>
  )
}

