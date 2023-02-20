import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: 'user'
    };
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            setIsModelLoaded(true);
        };
        loadModels();
    }, []);

    const handleVideoLoad = () => {
        faceapi.matchDimensions(canvasRef.current, videoConstraints);
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(
                webcamRef.current.video,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, videoConstraints);
            canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }, 100);
    };

    return (
        <div>
            {isModelLoaded && (
                <div>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        videoConstraints={videoConstraints}
                        onUserMedia={handleVideoLoad}
                    />
                    <canvas ref={canvasRef} />
                </div>
            )}
        </div>
    );
};

export default FaceRecognition; 