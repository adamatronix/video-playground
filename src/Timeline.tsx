import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSpring, to as interpolate, animated, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import useMeasure from 'react-use-measure';
import Player from 'video.js/dist/types/player';
import styled from 'styled-components';
import { VideoObject } from "./VideoObject";

interface TimelineProps {
  playlist:any[],
  mainPlayer?:Player|null,
  onVideoClick?: (video:any) => void
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;  
  overflow: hidden;
  touch-action: none;
`

const Inner = styled.div`
  position: relative;
  width: 100%;
  transform: translate(50%,0);
`

const VideoWidth = styled.div`
  position: relative;
  flex-shrink: 0;
`

const VideoObjects = styled(animated.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
`

export const Timeline = ({
  playlist,
  mainPlayer,
  onVideoClick,
  ...props
}:TimelineProps) => {
  const [ ref, bounds ] = useMeasure();
  
  const timeScale = 2000; //2000 seconds
  const durations = useRef<number[]>([]);
  const objectWidths = useRef<number[]>([]);
  const [ Durations, setDurations ] = useState<number[]|null>(null);
  const [ Progresses, setProgresses ] = useState<number[]|null[]|null>(null);



  const [ propsTimeline, apiTimeline ] = useSpring(() => ({ to: { x: 0}, immediate: true, onChange: (result:any) => onMovement(result) }))

  const bindDrag = useGesture(
    {
      onDrag: ({active, event, xy, previous, down, movement: pos, offset: [ox], velocity, direction }) => {
        if(down && mainPlayer && !mainPlayer.paused()) {
          mainPlayer.pause();
        } else if(!down && mainPlayer && mainPlayer.paused()) {
          mainPlayer.play();
        }
        apiTimeline.start({
          x: ox,
          immediate: down,
          config: { 
            velocity: velocity[0] * direction[0],
            decay: 0.989,
          }
        })
        /*console.log(ox);
        console.log(VideoObjectWidths);*/
      },
    },
    { drag: { filterTaps: true, axis: "x", from: () => [ propsTimeline.x.get(), 0]  }}
  )


  const onGetDuration = useCallback((index:number, duration:number) => {
    let isComplete = true;
    durations.current[index] = duration;
  
    playlist.forEach((_object:any,i:number) => {
    
      if(!durations.current[i]) {
        isComplete = false
      }
 

      
    })
    if(isComplete) {
      setDurations(durations.current);
      console.log(durations.current)
    }
  },[])

  useEffect(() => {
    if(bounds && Durations) {
      const widths:number[] = [];
      
      Durations.forEach((duration:number) => {
        const perc = duration / timeScale;
        widths.push(perc * bounds.width);
      })
      objectWidths.current = widths;
    }

  },[bounds,Durations])

  const onMovement = useCallback((result:any) => {
    if(objectWidths.current) {
      
      let progresses:number[] = [];

      objectWidths.current.forEach((width:number,i:number) => {
  
        let prevWidth = 0;
        for(let d = 0; d < i; d++) {
          prevWidth += objectWidths.current[d];
        }

        const diff = prevWidth + width + result.value.x;

        if(diff < 0) {
          progresses[i] = 100;
        } else {
          if(diff <= width) {
            progresses[i] = (1 - (diff / width)) * 100;  
          } else {
            progresses[i] = 0
          } 
        }
      })
      setProgresses(progresses)
    }
  },[])

  return (
    <Wrapper ref={ref} {...bindDrag()} {...props}>
      <Inner>
        <VideoObjects style={propsTimeline}>
          { playlist && playlist.map((video:any,i:number) => {

            return (
              <VideoWidth key={i} style={{width: Durations ? `${(Durations[i] / timeScale) * 100}%` : '0'}}>
                <VideoObject progressVal={Progresses ? Progresses[i] : 0} data={video} onClick={onVideoClick ? () => { onVideoClick(video) }: () => {}} mainplayer={mainPlayer} onDurationComplete={(duration:number) => onGetDuration(i,duration)}/>
              </VideoWidth>
            )
          })}
        </VideoObjects>
      </Inner>
    </Wrapper>
  )
}

