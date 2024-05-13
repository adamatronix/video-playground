import { VideoJSPlayer } from "./VideoJSPlayer";
import { useCallback, useState, useEffect } from 'react';
import { Timeline } from "./Timeline";

import Player from 'video.js/dist/types/player';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;  
  width: 100%;
  height: 100svh;
`
const HlsVideoWrapper = styled.div`
  position: relative;  
  width: 100%;
  flex: 1;
`;

const CustomPlayer = styled(VideoJSPlayer)`
  width: 100%;
  height: 100%;
  flex: 1;

  & video {
    object-fit: cover;
  }
`


const Console = styled.div`
  position: fixed;
  width: 100%;
  padding: 20px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
`

const VideoInfo = styled.div`
  display: flex;
  gap: 20px;
  background: rgba(0,0,0,0.2);
  align-items: center;
`

const ToggleSet = styled.div`
  display: flex;
  gap: 20px;
`

const ToggleButton = styled.button`
  
`



function App() {
  const [ mainPlayer, setMainPlayer ] = useState<Player|null>(null);
  const [ videoLevel, setVideoLevel ] = useState<any|null>(null);
  const [ mode, setMode ] = useState<string>('hls');

  const playlist = [
    { 
      id: 1,
      title: "Clip 1",
      hls: "https://player.vimeo.com/external/923256935.m3u8?s=ce3998af81789b5deaa4a29f7ea303b6ac9ce231&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923256935/rendition/1080p/file.mp4?loc=external&signature=d7608a05776c3e668a3e7bb50320ff3fc0f2755e1945ad8e9e4eb777d90a7143"
    },
    { 
      id: 2,
      title: "Clip 2",
      hls: "https://player.vimeo.com/external/923255762.m3u8?s=71fc170d564758e2a62e9bed4cc28cc121ddea67&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923255762/rendition/1080p/file.mp4?loc=external&signature=c176b3966c2106b7d8739835c763fcbb7d419bd4a2f776afc66221f50b17f0f1"
    },
    { 
      id: 3,
      title: "Clip 3",
      hls: "https://player.vimeo.com/external/923255147.m3u8?s=394081cddbefce61af06b86a2d621e235827277b&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923255147/rendition/1080p/file.mp4?loc=external&signature=3100b7ec3fbfaf011493f13f01f447cf01d7617838ac0d8f34294f3dc5ccf572"
    },
    { 
      id: 4,
      title: "Clip 4",
      hls: "https://player.vimeo.com/external/923253760.m3u8?s=e61755f2e546312214c06960f2076b032a0b943b&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923253760/rendition/1080p/file.mp4?loc=external&signature=bb993ac1c62f28717b75928b174eae90cb77773065e2300f91f85b16b4158411"
    },
    { 
      id: 5,
      title: "Clip 5",
      hls: "https://player.vimeo.com/external/923252970.m3u8?s=21dc5cf56c148141f2ffda9d7627893b8d398cd4&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923252970/rendition/1080p/file.mp4?loc=external&signature=e7174ffe083d2a66dc01987c5acefeb8cea05fdfefa436a8b0884b2022a18521"
    },
    { 
      id: 6,
      title: "Clip 6",
      hls: "https://player.vimeo.com/external/923252233.m3u8?s=23cf44852986710924ca8313a3dc02e1d83456c4&logging=false",
      hd: "https://player.vimeo.com/progressive_redirect/playback/923252233/rendition/1080p/file.mp4?loc=external&signature=3dbb72d1eff0287baa43ca478bf3ad1825b394971c5d53a064957103f51a6766"
    }
  ];

  const [ videoOptions, setVideoOptions ] = useState<any|null>(null);

  useEffect(() => {
    if(mode) {
      if(mode === '1080') {
        setVideoLevel(null);
      }

      setVideoOptions({
        autoplay: true,
        controls: true,
        muted: true,
        playsinline: true,
        responsive: true,
        fill: true,
        sources: [{
          src: mode === 'hls' ? playlist[0].hls : mode === '1080' ? playlist[0].hd : null,
          type: mode === 'hls' ? 'application/x-mpegURL' : 'video/mp4'
        }]
      })
    }
  },[mode])

  const onVideoClick = useCallback((video:any) => {
    if(mainPlayer) {
      mainPlayer.src([{
        src: mode === 'hls' ? video.hls : mode === '1080' ? video.hd : null,
        type: mode === 'hls' ? 'application/x-mpegURL' : 'video/mp4'
      }])
    }
    
    
  }, [mainPlayer, mode]);

  const onReady = useCallback((player:Player) => {
    if(player) {
      setMainPlayer(player);
    }
  },[]);

  const onQualityLeveLChange = useCallback((level:any) => {
    setVideoLevel(level);
  },[]);

  return (
    <Main>
      <Console>
        <ToggleSet>
          <ToggleButton onClick={() => setMode('hls')} className={ mode === 'hls' ?  "--active" : ""}>HLS</ToggleButton>
          <ToggleButton onClick={() => setMode('1080')} className={ mode === '1080' ?  "--active" : ""}>1080p</ToggleButton>
        </ToggleSet>
        { videoLevel && <VideoInfo>
          <div>
            bitrate:{ videoLevel?.bitrate }
          </div>
          <div>
            resolution:{ videoLevel?.width }x{ videoLevel?.height}
          </div>
        </VideoInfo> }
      </Console>
      <HlsVideoWrapper>
        { videoOptions && <CustomPlayer options={videoOptions} onReady={onReady} onQualityLevelChange={onQualityLeveLChange}/> }
      </HlsVideoWrapper>
      <Timeline playlist={playlist} mainPlayer={mainPlayer} onVideoClick={onVideoClick} />
    </Main>
  )
}

export default App
