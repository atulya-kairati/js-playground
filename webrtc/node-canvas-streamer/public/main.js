const videoServerCanvas = document.getElementById("server-canvas-video");

const socket = io();

const iceServers = {
  iceServer: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const rtcPeerConnection = new RTCPeerConnection(iceServers);
rtcPeerConnection.ontrack = (track) => {
  console.log("track", track);
  videoServerCanvas.srcObject = track.streams[0];
};
rtcPeerConnection.onicecandidate = (ice) => {
  if (!ice.candidate) return;

  const iceData = {
    sdpMid: ice.candidate.sdpMid,
    sdpMLineIndex: ice.candidate.sdpMLineIndex,
    candidate: ice.candidate.candidate,
  };

  socket.emit("candidate", iceData);
};

rtcPeerConnection.onconnectionstatechange = (event) => {
  if (rtcPeerConnection.connectionState === "connected") {
    console.log("Connection established");
  }
};

socket.on("offer", async (sdp) => {
  console.log("offer", sdp);
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp));

  const localSdp = await rtcPeerConnection.createAnswer();
  rtcPeerConnection.setLocalDescription(localSdp);

  socket.emit("answer", localSdp);
});

socket.on("candidate", (iceData) => {
  console.log("ice candidate received", iceData);
  const iceCandidate = new RTCIceCandidate({
    sdpMid: iceData.sdpMid,
    sdpMLineIndex: iceData.sdpMLineIndex,
    candidate: iceData.candidate,
  });

  rtcPeerConnection.addIceCandidate(iceCandidate);
});
