import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";
import axios from 'axios';

import styles from './FaceID.module.scss';


const FaceID = () => {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [start, setStart] = useState(false);
    const [face, setFace] = React.useState(null);
    const [hasSmiled, setHasSmiled] = useState(false);
    const [hasSad, setHasSad] = useState(false);
    const [hasDetection, setHasDetection] = useState(0);
    const [showMessage, setShowMessage] = useState('');
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isMultipleFacesDetected, setIsMultipleFacesDetected] = useState(false);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: 'user'
    };

    useEffect(() => {
        const loadModels = async () => {
            setIsModelLoaded(false);
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                faceapi.nets.ageGenderNet.loadFromUri("/models"),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            ]);
            setIsModelLoaded(true);
        };
        loadModels();
    }, []);

    const handleVideoLoad = async () => {
        if (!face) {
            faceapi.matchDimensions(canvasRef.current, videoConstraints);
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(
                    webcamRef.current.video,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks().withFaceDescriptors().withAgeAndGender().withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, videoConstraints);
                canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                // Drawing lines and expression and data
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
                resizedDetections.forEach((detection) => {
                    const expressions = detection.expressions;
                    const detection_score = detection.alignedRect._score;
                    const { age, gender, genderProbability } = detection;
                    // const bestMatch = faceapi.euclideanDistance(
                    //     detection.descriptor,
                    //     new Float32Array(128)
                    // ) < 0.6
                    //     ? 'Match'
                    //     : 'No Match';

                    // More than 1 face
                    if (resizedDetections.length > 1) {
                        setIsMultipleFacesDetected(true);
                        setShowMessage('Multiple faces detected');
                    } else {
                        setIsMultipleFacesDetected(false);
                        setShowMessage('');
                    }

                    // Best detection score > 0.85
                    // if (bestMatch === 'Match' && detection.score > 0.7) {
                    // Validation for expression
                    if (detection_score > 0.7) {
                        setShowMessage('Smile please')
                        if (expressions.happy > 0.7) {
                            // setHasSmiled(true);
                            handleDetection();
                            // console.log(`1. Happy! status - ${hasSmiled}`)
                        }
                        // else if (hasSmiled) {
                        //     if (expressions.sad > 0.7) {
                        //         console.log("2. Sad!")
                        //         setHasSad(true);
                        //     }
                        // }
                    }
                    // Draw age and gender
                    // new faceapi.draw.DrawTextField(
                    //     [
                    //         `${Math.round(age)} years`,
                    //         `${gender} (${Math.round(genderProbability * 100)}%)`,
                    //         `${bestMatch}`
                    //     ],
                    //     detection.detection.box.bottomLeft
                    // ).draw(canvasRef.current);

                });
                // if (hasDetection && hasSmiled && hasSad) {
                if (hasDetection && hasSmiled) {
                    handleDetection();
                }
            }, 1000);
        }
    };

    const handleSend = async (face) => {
        if (face) {
            const form = {
                image: "" + face + "",
            }
            try {
                const response =
                    await axios.post(
                        'http://127.0.0.1:8000/api/recognize_face',
                        form,
                    );
                // setShowMessage(data);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('No image to send.');
        }
    };

    const capture = React.useCallback(() => {
        const face = webcamRef.current.getScreenshot();
        setFace(face);
        handleSend(face);
    }, [webcamRef, setFace]);

    const handleDetection = () => {
        setShowMessage('');
        capture();
        setShowMessage('Emotion test passed succesfully! Data is sending...')
    };


    const handleStart = event => {
        setStart(true);
    };

    return (
        <div className={styles.faceid}>
            {start ?
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        onUserMedia={handleVideoLoad}
                    />
                    <canvas ref={canvasRef} />
                    <div className={`${styles.faceid_message} ${showMessage || isMultipleFacesDetected ? styles.message_active : ''}`}>
                        {showMessage}
                    </div>
                </>
                :
                <>
                    <h2>Face Identification</h2>
                    <p>Face identification is the process of verifying a person's identity based on the analysis and comparison of images.</p>
                    <button onClick={handleStart}>Start</button>
                </>
            }
            {face && (
                <img
                    src={face}
                />
            )}
        </div>
    )
}

export default FaceID