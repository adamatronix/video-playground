import { HlsVideo } from "./HlsVideo"
import styled from 'styled-components';

const HlsVideoWrapper = styled.div`
  position: relative;  
  width: 50%;
  aspect-ratio: 1 / 0.5;
`;

function App() {
  return (
    <HlsVideoWrapper>
      <HlsVideo src={"https://player.vimeo.com/external/923252233.m3u8?s=23cf44852986710924ca8313a3dc02e1d83456c4&logging=false"} autoPlay={true}/>
    </HlsVideoWrapper>
  )
}

export default App
