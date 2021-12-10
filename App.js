import React ,{useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from 'react-webcam';
import {drawMesh} from './utilities';



function App() {

  const Camera = useRef(null);
  const Board = useRef(null);

  const runFacemesh = async() => {
    const net = await facemesh.load({
      inputResolution:{width:600,heigh:480},scale:1
    });
    setInterval(()=>{
      detect(net)
    },100);
  }

  const detect = async(net) => {
    if(typeof Camera.current !=="undefined" && 
    Camera.current !==null && 
    Camera.current.video.readyState === 4)
    {
      const video = Camera.current.video;
      const videoWidth = Camera.current.video.videoWidth;
      const videoHeight = Camera.current.video.videoHeight;

      Camera.current.video.width = videoWidth;
      Camera.current.video.height = videoHeight;

      Board.current.width = videoWidth;
      Board.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = Board.current.getContext('2d');
      drawMesh(face ,ctx);
    }
  };

  runFacemesh();
  return (
    <div className="App">
      <header className='App-header'>
      <Webcam ref={Camera} style={
        {
          position : 'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          testAlign:'center',
          zIndex:9,
          width:600,
          height:480,
        }
      }/>
      <canvas ref = {Board} style = {{
        position : 'absolute',
        marginLeft:'auto',
        marginRight:'auto',
        left:0,
        right:0,
        testAlign:'center',
        zIndex:100,
        width:600,
        height:480,
      }}/>
      </header>
    </div>
  );
}

export default App;
