import React, { useEffect, useState } from 'react';
import { useDuration } from './Duration';
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
  flex-shrink: 0;
  user-select: none;
  box-sizing: border-box;
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
  const [ duration ] = useDuration(data);
  const [ progress, setProgress ] = useState(0);

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

  return (
    <Wrapper style={{width: duration ? `${(duration / 2000) * 100}%` : '0'}}{...props}>
      <Progress style={{width: `${progress}%`}}/>
      { data.title }
    </Wrapper>
  )
}

