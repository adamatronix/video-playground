import { VideoJSPlayer } from "./VideoJSPlayer";
import { useCallback, useRef, useState } from 'react';
import { VideoObject } from "./VideoObject";
import Player from 'video.js/dist/types/player';
import styled from 'styled-components';

const HlsVideoWrapper = styled.div`
  position: relative;  
  width: 50%;
`;

const CustomPlayer = styled(VideoJSPlayer)`
  width: 100%;
  height: 100%;
`

const VideoObjects = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
  margin: 60px 0;
`



function App() {
  const [ mainPlayer, setMainPlayer ] = useState<Player|null>(null);

  const playlist = [
    { 
      id: 1,
      title: "Clip 1",
      src: "https://player.vimeo.com/external/923256935.m3u8?s=ce3998af81789b5deaa4a29f7ea303b6ac9ce231&logging=false"
    },
    { 
      id: 2,
      title: "Clip 2",
      src: "https://player.vimeo.com/external/923255762.m3u8?s=71fc170d564758e2a62e9bed4cc28cc121ddea67&logging=false"
    },
    { 
      id: 3,
      title: "Clip 3",
      src: "https://player.vimeo.com/external/923255147.m3u8?s=394081cddbefce61af06b86a2d621e235827277b&logging=false"
    },
    { 
      id: 4,
      title: "Clip 4",
      src: "https://player.vimeo.com/external/923253760.m3u8?s=e61755f2e546312214c06960f2076b032a0b943b&logging=false"
    },
    { 
      id: 5,
      title: "Clip 5",
      src: "https://player.vimeo.com/external/923252970.m3u8?s=21dc5cf56c148141f2ffda9d7627893b8d398cd4&logging=false"
    },
    { 
      id: 6,
      title: "Clip 6",
      src: "https://player.vimeo.com/external/923252233.m3u8?s=23cf44852986710924ca8313a3dc02e1d83456c4&logging=false"
    }
  ];

  const videoOptions = {
    autoplay: true,
    controls: false,
    muted: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://player.vimeo.com/external/923256935.m3u8?s=ce3998af81789b5deaa4a29f7ea303b6ac9ce231&logging=false',
      type: 'application/x-mpegURL'
    }]
  };

  const onVideoClick = useCallback((video:any) => {
    if(mainPlayer) {
      mainPlayer.src([{
        src: video.src,
        type: 'application/x-mpegURL'
      }])
    }
    
    
  }, [mainPlayer]);

  const onReady = useCallback((player:Player) => {
    if(player) {
      setMainPlayer(player);
    }
  },[]);
  return (
    <>
      <HlsVideoWrapper>
        <CustomPlayer options={videoOptions} onReady={onReady}/>
      </HlsVideoWrapper>
      <VideoObjects>
        { playlist && playlist.map((video:any,i:number) => {

          return (
            <VideoObject key={i} data={video} onClick={() => onVideoClick(video)} mainplayer={mainPlayer}/>
          )
        })}
      </VideoObjects>
    </>
  )
}

export default App
