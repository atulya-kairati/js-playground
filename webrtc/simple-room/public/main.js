let divRoomSelection = document.getElementById("room-selection");
let divRoom = document.getElementById("room");
let inputRoomName = document.getElementById("room-name-input");
let buttonGo = document.getElementById("go-button");
let videoLocal = document.getElementById("local-video");
let videoRemote = document.getElementById("remote-video");
let spanMsg = document.getElementById("span-msg");
let inputMsg = document.getElementById("input-msg");
let buttonSendMsg = document.getElementById("button-send-msg");
let divInfo = document.getElementById("info");

let roomNumber,
  localStream,
  remoteStream,
  rtcPeerConnection,
  isCaller = false,
  dataChannel;

const socket = io("ws://localhost:3000", {query: {hehe: 456}});

const iceServers = {
  iceServer: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const streamConstraints = {
  audio: true,
  video: true,
};

buttonGo.onclick = () => {
  if (inputRoomName.value === "") {
    alert("Please enter room name.");
    return;
  }

  roomNumber = inputRoomName.value;
  socket.emit("create or join", roomNumber);

  divRoomSelection.style = "display: none;";
  divRoom.style = "display: block;";
};

buttonSendMsg.onclick = () => {
  const msg = inputMsg.value;

  if (msg == "") return;

  dataChannel.send(msg);
  setMessage({ data: msg });
};

socket.on("created", async (room) => {
  console.log(room, "created");
  try {
    localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
    videoLocal.srcObject = localStream;
    isCaller = true;
  } catch (error) {
    console.log(error);
  }
});

socket.on("joined", async (room) => {
  console.log(room, "joined");
  try {
    localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
    videoLocal.srcObject = localStream;
    socket.emit("ready", roomNumber);
  } catch (error) {
    console.log(error);
  }
});

socket.on("full", () => alert("room full"));

socket.on("ready", async () => {
  if (!isCaller) return;

  // the caller proceeds

  console.log("client is ready");
  // if the client is caller then it should prepare and send an offer
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = onIceCandidate;
  rtcPeerConnection.ontrack = onAddStream;
  rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream); // video
  rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream); // audio

  try {
    // caller should create the data channel before the creating the offer
    dataChannel = rtcPeerConnection.createDataChannel(roomNumber); // have to pass a label for the channel
    dataChannel.onmessage = setMessage;
    dataChannel.onopen = () => console.log("dataChannel open");

    const sessionDescription = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(sessionDescription);

    console.log("sending offer");
    socket.emit("offer", {
      type: "offer",
      sdp: sessionDescription,
      room: roomNumber,
    });
  } catch (error) {
    console.log(error);
  }
});

socket.on("offer", async (sdp) => {
  if (isCaller) return;

  // The callee proceed (NOT CALLER)

  console.log("received offer from caller", sdp);

  // if the client is NOT caller then it should recieve an offer and send an answer
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = onIceCandidate;
  rtcPeerConnection.ontrack = onAddStream;
  rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream); // video
  rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream); // audio

  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  try {
    const sessionDescription = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(sessionDescription);

    console.log("sending answer");
    socket.emit("answer", {
      type: "answer",
      sdp: sessionDescription,
      room: roomNumber,
    });
  } catch (error) {
    console.log(error);
  }

  // setting datachannel for the callee
  rtcPeerConnection.ondatachannel = (event) => {
    console.log(event);
    dataChannel = event.channel;
    dataChannel.onmessage = setMessage;

    dataChannel.onopen = () => console.log("dataChannel open");
  };
});

socket.on("answer", (sdp) => {
  if (!isCaller) return;

  console.log("received answer from callee", sdp);

  // set remote description for the caller
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
});

socket.on("candidate", (event) => {
  console.log("candidate received", event);
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });

  rtcPeerConnection.addIceCandidate(candidate);
});

function onAddStream(event) {
  // add stream to the remote video

  console.log("adding remote stream");
  videoRemote.srcObject = event.streams[0];
  remoteStream = event.streams[0];
}

function onIceCandidate(event) {
  if (!event.candidate) return;

  console.log("ice candidate found:", event);

  socket.emit("candidate", {
    type: "candidate",
    label: event.candidate.sdpMLineIndex,
    id: event.candidate.sdpMid,
    candidate: event.candidate.candidate,
    room: roomNumber,
  });
}

function setMessage(msg) {
  spanMsg.innerHTML = msg.data;
}

setInterval(async () => {
  if (rtcPeerConnection == null) return;

  const stats = await rtcPeerConnection.getStats();
  // console.log(stats);

  divInfo.innerHTML = "";

  stats.forEach((report) => {
    const p = document.createElement("p");
    p.innerHTML = JSON.stringify(report);
    divInfo.appendChild(p);
  });
}, 5000);

//////////////////////////////
socket.on("junk", (j) => {
  console.log(j);
});
