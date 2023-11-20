const divStartMeeting = document.getElementById("start-meeting");
const divForPresenter = document.getElementById("for-presenter");
const divForViewer = document.getElementById("for-viewer");
const inputUsername = document.getElementById("username");
const inputPresentationName = document.getElementById("presentation-name");
const inputPublish = document.getElementById("publish-input");
const buttonStart = document.getElementById("start");
const buttonPublish = document.getElementById("publish-button");
const pPublishedMsg = document.getElementById("published-msg");
const canvasPresenter = document.getElementById("presenter-canvas");
const canvasViewer = document.getElementById("viewer-canvas");

const CANVAS_W = 400,
  CANVAS_H = 400;

let presentationName,
  rtcPeerConnection,
  dataChannels = [],
  username,
  connectorUsername,
  isPresenter = false,
  started = false;

const socket = io();

const iceServers = {
  iceServer: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

buttonStart.onclick = () => {
  username = inputUsername.value;
  presentationName = inputPresentationName.value;

  if (username === "" || presentationName === "") return;

  const creds = { username, presentationName };

  socket.emit("start", creds);
};

buttonPublish.onclick = () => {
  const msg = inputPublish.value;

  if (msg === "") return;

  console.log(dataChannels);
  broadcastMsg(msg);
};

socket.on("joined", (creds) => {
  const { username, presentationName } = creds;
  isPresenter = creds.isPresenter;

  console.log(
    `${username} joined presentation ${presentationName}. Is presenter: ${isPresenter}`
  );

  // viewer tell presenter that it is ready to establish a connection
  if (!isPresenter) {
    socket.emit("ready", creds);
    createCanvas(CANVAS_W, CANVAS_H, canvasViewer);
    background(0);
  } else {
    createCanvas(CANVAS_W, CANVAS_H, canvasPresenter);
    background(0);
  }

  // ui
  divStartMeeting.style = "display: none;";
  if (isPresenter) divForPresenter.style = "display: block;";
  else divForViewer.style = "display: block;";
});

socket.on("ready", async (creds) => {
  if (!isPresenter) return;

  // presenter proceeds
  console.log("ready", creds);

  // FIXME: Careful with the global var
  connectorUsername = creds.username;

  console.log("presenter is creating an offers for", creds.username);

  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = onIceCandidates;

  const newDataChannel = rtcPeerConnection.createDataChannel(presentationName);
  // newDataChannel.onmessage = setMessage; // presenter is never gonna receive msgs
  newDataChannel.onopen = () => {
    console.log(`datachannel with ${creds.username} established`);

    dataChannels.push(newDataChannel);

    // we start broadcasting coords when the first datachannel is established
    // since only presenter will have started set to true therefore only it can broadcast
    started = true;
  };
  newDataChannel.onclose = () => {
    console.log(`datachannel with ${creds.username} closed`);

    // dataChannels.remove(newDataChannel);
    // FIXME: remove
    // start = false if datachannels.size == 0
  };

  try {
    const sdp = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(sdp);

    socket.emit("offer", {
      type: "offer",
      sdp,
      presentationName,
      username: creds.username,
    });
  } catch (error) {
    console.log(error);
  }
});

socket.on("candidate", (iceData) => {
  // make sure ice candidates are only given to the correct user
  if (username !== iceData.username && !isPresenter) return;
  console.log("ice candidate received", iceData);

  const candidate = new RTCIceCandidate({
    sdpMLineIndex: iceData.sdpMLineIndex,
    candidate: iceData.candidate,
  });

  rtcPeerConnection.addIceCandidate(candidate);
});

socket.on("offer", async (offerData) => {
  // offer is only intended for the correct usr
  if (username !== offerData.username) return;

  console.log("offer received", offerData.sdp);
  // now viewer prepares an answer

  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onIceCandidates = onIceCandidates;

  rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(offerData.sdp)
  );

  try {
    // create answer sdp
    const sdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(sdp);

    // emit answer
    const answerData = {
      username,
      sdp,
      presentationName,
    };

    console.log("emitting answer", answerData);
    socket.emit("answer", answerData);
  } catch (error) {
    console.log(error);
  }

  // setting datachannel for the callee
  rtcPeerConnection.ondatachannel = (event) => {
    console.log(event);
    const dataChannel = event.channel;
    dataChannel.onmessage = setMessage;

    dataChannel.onopen = () => console.log("dataChannel open");
  };
});

socket.on("answer", (answerData) => {
  // answer is only intended for the presenter
  if (!isPresenter) return;

  console.log(`recieved answer from ${answerData.username}:`, answerData);
  rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(answerData.sdp)
  );
});

function onIceCandidates(event) {
  if (!event.candidate) return;
  console.log("onIceCandidates found", event);

  const iceData = {
    username: connectorUsername,
    presentationName,
    sdpMLineIndex: event.candidate.sdpMLineIndex,
    candidate: event.candidate.candidate,
  };

  socket.emit("candidate", iceData);
}

function setMessage(msg) {
  console.log(msg);
  pPublishedMsg.innerHTML = msg.data;
  populateCanvas(...JSON.parse(msg.data));
}

function broadcastMsg(msg) {
  for (let dataChannel of dataChannels) {
    console.log(dataChannel);
    dataChannel.send(msg);
  }
}

function setup() {
  console.log("setup");
  stroke(153);
  noStroke();
  //   background(0);
}

function draw() {
  if (!started) return;
  if (!mouseIsPressed) return;

  broadcastMsg(JSON.stringify([mouseX, mouseY]));
  circle(mouseX, mouseY, 5);
}

function populateCanvas(x, y) {
  circle(x, y, 5);
}
