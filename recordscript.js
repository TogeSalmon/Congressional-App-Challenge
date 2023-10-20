'use strict'

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter = 1,
  chunks,
  media;


gUMbtn.onclick = e => {
  let mv = id('mediaVideo'),
    mediaOptions = {
      video: {
        tag: 'video',
        type: 'video/webm',
        ext: '.mp4',
        gUM: { video: true, audio: true }
      },

      audio: {
        tag: 'audio',
        type: 'audio/mpeg',
        ext: '.mp3',
        gUM: { audio: true }
      }
    };
  media = mv.checked ? mediaOptions.video : mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    id('gUMArea').style.display = 'none';
    id('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if (recorder.state == 'inactive') makeLink();
    };
    log('got media successfully');
  }).catch(log);
}

start.onclick = e => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks = [];
  recorder.start();
}


stop.onclick = e => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
}



function makeLink() {
  let blob = new Blob(chunks, { type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
    ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
  ul.appendChild(li);
}

//*************************************************************************************** */
///Everything below this is new! *might break stuff*

//window.onload = function() {

const file = document.getElementById("file-input");
const canvas = document.getElementById("canvas");
//const h3 = document.getElementById('name')
const audio = document.getElementById("audio");

file.onchange = function () {

  const files = this.files; // FileList containing File objects selected by the user (DOM File API)
  console.log('FILES[0]: ', files[0])
  audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

  const name = files[0].name
  //h3.innerText = `${name}` // Sets <h3> to the name of the file

  ///////// <CANVAS> INITIALIZATION //////////
  /*canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  */

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const ctx = canvas.getContext("2d");
  ///////////////////////////////////////////


  const context = new AudioContext(); // (Interface) Audio-processing graph
  let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
  // to which can then be played and manipulated
  const analyser = context.createAnalyser(); // Create an analyser for the audio context

  src.connect(analyser); // Connects the audio context source to the analyser
  analyser.connect(context.destination); // End destination of an audio graph in a given context
  // Sends sound to the speakers or headphones


  /////////////// ANALYSER FFTSIZE ////////////////////////
  // analyser.fftSize = 32;
  // analyser.fftSize = 64;
  // analyser.fftSize = 128;
  // analyser.fftSize = 256;
  // analyser.fftSize = 512;
  // analyser.fftSize = 1024;
  // analyser.fftSize = 2048;
  // analyser.fftSize = 4096;
  // analyser.fftSize = 8192;
  analyser.fftSize = 16384;
  // analyser.fftSize = 32768;

  // (FFT) is an algorithm that samples a signal over a period of time
  // and divides it into its frequency components (single sinusoidal oscillations).
  // It separates the mixed signals and shows what frequency is a violent vibration.

  // (FFTSize) represents the window size in samples that is used when performing a FFT

  // Lower the size, the less bars (but wider in size)
  ///////////////////////////////////////////////////////////


  const bufferLength = analyser.frequencyBinCount; // (read-only property)
  // Unsigned integer, half of fftSize (so in this case, bufferLength = 8192)
  // Equates to number of data values you have to play with for the visualization

  // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
  // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

  const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
  // At this point dataArray is an array with length of bufferLength but no values
  console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT)

  const barWidth = (WIDTH / bufferLength) * 13;
  console.log('BARWIDTH: ', barWidth)

  console.log('TOTAL WIDTH: ', (117 * 10) + (118 * barWidth)) // (total space between bars)+(total width of all bars)

  let barHeight;
  let x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering

    x = 0;

    analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
    // Results in a normalized array of values between 0 and 255
    // Before this step, dataArray's values are all zeros (but with length of 8192)

    ctx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with opacity 0.2)
    ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars

    let r, g, b;
    let bars = 118 // Set total number of bars you want per frame

    for (let i = 0; i < bars; i++) {
      barHeight = (dataArray[i] * 2.5);

      if (dataArray[i] > 210) { // pink
        r = 250
        g = 0
        b = 255
      } else if (dataArray[i] > 200) { // yellow
        r = 250
        g = 255
        b = 0
      } else if (dataArray[i] > 190) { // yellow/green
        r = 204
        g = 255
        b = 0
      } else if (dataArray[i] > 180) { // blue/green
        r = 0
        g = 219
        b = 131
      } else { // light blue
        r = 0
        g = 199
        b = 255
      }

      // if (i === 0){
      //   console.log(dataArray[i])
      // }

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);
      // (x, y, i, j)
      // (x, y) Represents start point
      // (i, j) Represents end point

      x += barWidth + 10 // Gives 10px space between each bar
    }
  }

  audio.play();
  renderFrame();
};

//};