import React, { useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import styled from 'styled-components';

interface HlsVideoProps {
  src:string,
  autoPlay?: boolean
}

const VideoTag = styled(ReactHlsPlayer)` 
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`;

export const HlsVideo = React.forwardRef<HTMLVideoElement, HlsVideoProps>( ({ src, autoPlay,...props }, ref) => {
  const playerRef = useRef(null!);
  return (
    <VideoTag
      src={src}
      autoPlay={autoPlay}
      controls={false}
      muted
      //@ts-expect-error Expects a ref to be passed on
      playerRef={ref || playerRef}
      {...props}
    />
  )
});