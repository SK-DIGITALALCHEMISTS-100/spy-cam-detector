// Get access to video stream
const videoElement = document.getElementById('cameraFeed');
const overlayCanvas = document.getElementById('overlay');
const overlayContext = overlayCanvas.getContext('2d');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Function to detect spy cams
async function detectSpyCams() {
    const model = await cocoSsd.load();
    const predictions = await model.detect(videoElement);

    // Check if any detected object is a phone camera
    const isPhoneCameraDetected = predictions.some(prediction => 
        prediction.class === 'cell phone' || prediction.class === 'mobile phone'
    );

    return isPhoneCameraDetected;
}

// Start monitoring
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', async () => {
    startCamera();
    
    setTimeout(async () => {
        const isSpyCamDetected = await detectSpyCams();

        if (isSpyCamDetected) {
            alert('🚨 Spy camera detected! Security compromised.');
        } else {
            alert('✅ No hidden cameras detected.');
        }
    }, 5000); // Scans after 5 seconds
});
