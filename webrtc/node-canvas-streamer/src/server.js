const http = require("http");
const EventEmitter = require("events");
const express = require("express");
const websocket = require("socket.io");
const { createCanvas } = require("canvas");
const {
  RTCPeerConnection,
  MediaStream,
  RTCSessionDescription,
  RTCIceCandidate,
} = require("wrtc");
const { randomColor } = require("./utils");
const Ball = require("./ball");
const { RTCVideoSource, rgbaToI420 } = require("wrtc").nonstandard;

const PORT = 3131;

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const ws = websocket(server);

server.listen(PORT, () => console.log("Server at", PORT));

// ---- canvas
const canvasEvent = new EventEmitter();

// const CANVAS_W = 720;
// const CANVAS_H = 1280;

const CANVAS_W = 560;
const CANVAS_H = 960;
const canvas = createCanvas(CANVAS_W, CANVAS_H);
const canvasContext = canvas.getContext("2d");

const MAX_BLOCK_S = 100;

const balls = new Array(120).fill(0).map((_) => new Ball(CANVAS_W, CANVAS_H));

setInterval(() => {
  canvasContext.clearRect(0, 0, CANVAS_W, CANVAS_H);

  balls.forEach((ball) => ball.move(canvasContext));

  // canvasContext.fillStyle = randomColor();
  // const edge = Math.random() * MAX_BLOCK_S;

  // const x = Math.random() * CANVAS_W;
  // const y = Math.random() * CANVAS_H;

  // canvasContext.fillRect(x, y, edge, edge);

  canvasEvent.emit("painted");
}, 50);

// ----- canvas

// --- ws and wrtc

const iceServers = {
  iceServer: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

ws.on("connection", async (socket) => {
  console.log("User connected", socket.id);

  const source = new RTCVideoSource();
  const track = source.createTrack();
  const stream = new MediaStream();
  stream.addTrack(track);

  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  rtcPeerConnection.addTrack(stream.getTracks()[0], stream);

  rtcPeerConnection.addEventListener("icecandidate", (event) => {
    if (!event.candidate) return;

    const iceData = {
      sdpMid: event.candidate.sdpMid,
      sdpMLineIndex: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    };
    // emit
    socket.emit("candidate", iceData);
  });

  rtcPeerConnection.addEventListener("connectionstatechange", (event) => {
    if (rtcPeerConnection.connectionState === "connected") {
      console.log("Connection established with", socket.id);

      // Start sending frames
      canvasEvent.on("painted", () => {
        const rgbFrame = canvasContext.getImageData(0, 0, CANVAS_W, CANVAS_H);

        const yuv420Frame = {
          width: CANVAS_W,
          height: CANVAS_H,
          data: new Uint8ClampedArray(1.5 * CANVAS_W * CANVAS_H),
        }; // data to be filled

        rgbaToI420(rgbFrame, yuv420Frame);
        source.onFrame(yuv420Frame);
      });
    }
  });

  const sdp = await rtcPeerConnection.createOffer();
  rtcPeerConnection.setLocalDescription(sdp);

  socket.emit("offer", sdp);

  socket.on("answer", (sdp) => {
    console.log("answer received from", socket.id);
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  });

  socket.on("candidate", (iceData) => {
    console.log("ice candidate received from", socket.id);
    const iceCandidate = new RTCIceCandidate({
      sdpMid: iceData.sdpMid,
      sdpMLineIndex: iceData.sdpMLineIndex,
      candidate: iceData.candidate,
    });

    rtcPeerConnection.addIceCandidate(iceCandidate);
  });
});
