const cv = require('opencv4nodejs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Capturing the camera image with openCV
const capture = new cv.VideoCapture(0); // Nb refers to the device to use, in our case find the RPI4 camera ID to use
                                        // Prob 0 is gonna be fine as we have only 1 (video) device connected
capture.set(cv.CAP_PROP_FRAME_WIDTH, 250);
capture.set(cv.CAP_PROP_FRAME_HEIGHT, 250);

const fps = 15;

// Sending the image file to the client (web page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Every <interval>, the image taken by the cam is sent
setInterval(() => {
    const frame = capture.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.emit('camera-pic', image);
}, 1000 / fps);

/**
 * Lastly, when we take a picture
 * when a button is clicked, the current image is sent and displayed on the screen while the camera stream continues
 */
function caption(){
    const now = capture.read();
    const img = cv.imencode('.jpg', now).toString('base64');
    io.emit('pic', img);
}

server.listen(3000);