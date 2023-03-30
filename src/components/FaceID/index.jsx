import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import * as faceapi from 'face-api.js';

import { setFace, setAuth } from '../../store/slices/userSlice';

import axios from 'axios';
import Swal from 'sweetalert2';
import Webcam from 'react-webcam';

import styles from './FaceID.module.scss';

import { Div } from '../UI/Div';
import { Submit } from '../UI/Submit';


const FaceID = () => {

    const dispatch = useDispatch();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [start, setStart] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [showMessage, setShowMessage] = useState('Get closer to the camera');
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

        var intervalID = 0;
        faceapi.matchDimensions(canvasRef.current, videoConstraints);

        intervalID = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(
                webcamRef.current.video,
                new faceapi.TinyFaceDetectorOptions()
            )
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withAgeAndGender()
                .withFaceExpressions();

            // Canvas reflection
            const resizedDetections = faceapi.resizeResults(detections, videoConstraints);
            canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Drawing lines and expression and data
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

            // For each frame
            if (!isSent) {
                resizedDetections.forEach((detection) => {

                    const { age, gender, genderProbability } = detection;
                    const face = verificationFace(detection, resizedDetections);


                    if (face) {
                        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        clearInterval(intervalID);
                        handleSend(face);
                    }

                    // Draw age and gender
                    new faceapi.draw.DrawTextField(
                        [
                            `${Math.round(age)} years`,
                            `${gender} (${Math.round(genderProbability * 100)}%)`,
                        ],
                        detection.detection.box.bottomRight
                    ).draw(canvasRef.current);

                });
            }
        }, 100);
    };

    const verificationFace = (detection, resizedDetections) => {
        const expressions = detection.expressions;
        const detection_score = detection.alignedRect._score;

        // More than 1 face
        if (resizedDetections.length > 1) {
            setIsMultipleFacesDetected(true);
            setShowMessage('Multiple faces detected');
        } else {
            setIsMultipleFacesDetected(false);
            setShowMessage('');
        }

        // Validation for expression
        setShowMessage('Come closer place 🔍');
        if (detection_score > 0.7) {
            setShowMessage('Smile please 🙂');
            if (expressions.happy > 0.7) {
                setShowMessage('Neutral please 😐');
                // if (expressions.neutral > 0.7) {
                return capture();
                // }
            }
        }
    }

    const handleSend = async (face) => {
        if (face) {
            setShowMessage('Emotion test passed succesfully! Data is sending...');

            const form = {
                face_image: face,
            };

            var response = null;

            try {
                response = await axios.post('http://127.0.0.1:8000/identification', form);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', error.message, 'error');
            } finally {
                if (response.status === 200) {
                    setIsSent(true);
                    // Person isn't Identified
                    if (response.data.face_encodings) {
                        console.log('isnt identified')
                        dispatch(setFace({
                            face_encodings: response.data.face_encodings,
                        }));
                    }
                    // Person is Identified
                    else if (response.data.access_token) {
                        console.log('identified')
                        const access_token = response.data.access_token;
                        const person = response.data.person;
                        dispatch(setAuth({
                            id: person.id,
                            public_key: person.public_key,
                            token: access_token,
                        }));
                    }
                } else {
                    console.log(response);
                }
            }
        } else {
            console.log('No image to send.');
        }
    };

    const capture = useCallback(() => {
        const face = webcamRef.current.getScreenshot();
        return face
    }, [webcamRef]);


    const handleStart = () => {
        console.log('click')
        setStart(true);
    };

    return (
        <Div>
            {(start && isModelLoaded) ?
                <>
                    <div className={styles.faceid}>
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
                    </div>
                </>
                :
                <>
                    <h2>Face Identification</h2>
                    <p>Face identification is the process of verifying a person's identity based on the analysis and comparison of images.</p>
                    <Submit onClick={handleStart}>Start</Submit>
                </>
            }
        </Div>
    )
}

export default FaceID