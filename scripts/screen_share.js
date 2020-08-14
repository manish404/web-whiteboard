addEventListener($('.shareScreenBtn'), shareScreen);

async function startCapture(constraints) {
    videoPlayer.srcObject = await navigator.mediaDevices.getDisplayMedia(constraints);
    videoPlayer.onloadedmetadata = () => {
        show(videoPlayer);
        videoPlayer.play();
    }
}

function stopCapture() {
    let tracks = videoPlayer.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoPlayer.srcObject = null;
    hide(videoPlayer);
    hide(stopBtn);
    hide(controlBtn);
}

// ==============================================>

async function shareScreen() {
    let videoPlayer = $('#videoPlayer');
    let constraints = {
        video: true,
        video: { height: 180, width: 300 },
        audio: true,
        cursor: 'always',
        mediaSource: 'window',
    }

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    if (navigator.getUserMedia) startCapture(constraints);
    let stopBtn = document.createElement('button'),
        controlBtn = document.createElement('button');

    stopBtn.classList.add('actionBtn');
    stopBtn.innerText = "Stop";
    stopBtn.title = "Stop Screen Share";
    addEventListener(stopBtn, stopCapture);

    // show and hide buttons
    controlBtn.classList.add('actionBtn');
    controlBtn.innerText = "Hide";
    controlBtn.title = "Hide Player";
    addEventListener(controlBtn, () => {
        if (videoPlayer.style.display === "none") {
            show(videoPlayer);
            controlBtn.innerText = "Hide";
            controlBtn.title = "Hide Player";
        } else if (videoPlayer.style.display === "block") {
            hide(videoPlayer);
            controlBtn.innerText = "Show";
            controlBtn.title = "Show Player";
        }
    });

    $('.actions').appendChild(controlBtn);
    $('.actions').appendChild(stopBtn);
}

// For example, on mobile devices, the following will prefer the front camera (if one is available) over the rear one:

// { audio: true, video: { facingMode: "user" } }
// ========================
// To require the rear camera, use:

// { audio: true, video: { facingMode: { exact: "environment" } } }
// ========================
// If you have a deviceId from mediaDevices.enumerateDevices(), you can use it to request a specific device:

// { video: { deviceId: myPreferredCameraDeviceId } }
// ======================
