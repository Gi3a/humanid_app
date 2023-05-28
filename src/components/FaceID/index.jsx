import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as faceapi from 'face-api.js';

import { setFace, setUser } from '../../store/slices/userSlice';

import axios from 'axios';
import Swal from 'sweetalert2';
import Webcam from 'react-webcam';

import styles from './FaceID.module.scss';

import { Div } from '../UI/Div';
import { Submit } from '../UI/Submit';

import { generatePinnedFaceEncodings, decryptData } from '../../utils/crypto';

// Constants
const MODEL_PATH = "/models";
const VIDEO_CONSTRAINTS = {
    width: 640,
    height: 480,
    facingMode: 'user'
};
const FACE_DETECTION_OPTIONS = new faceapi.TinyFaceDetectorOptions();
const CAMERA_INTERVAL = 1000;

// Subcomponents
const FaceIDMessage = ({ showMessage, isMultipleFacesDetected }) => (
    <div className={`${styles.faceid_message} ${showMessage || isMultipleFacesDetected ? styles.message_active : ''}`}>
        {showMessage}
    </div>
);


const FaceID = () => {

    // Initialization
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const verificationStepRef = useRef(1);

    // State Management
    const [start, setStart] = useState(false);
    const [faceImg, setFaceImg] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [intervalID, setIntervalID] = useState(0);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [showMessage, setShowMessage] = useState('Get closer to the camera 🔎');
    const [isMultipleFacesDetected, setIsMultipleFacesDetected] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            setIsModelLoaded(false);
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_PATH),
            ]);
            setIsModelLoaded(true);
        };
        loadModels();
    }, []);


    const handleVideoLoad = async () => {
        if (!isSent) {
            const newIntervalID = setInterval(async () => {
                if (canvasRef.current && webcamRef.current && webcamRef.current.video) {

                    faceapi.matchDimensions(canvasRef.current, VIDEO_CONSTRAINTS);

                    const detections = await faceapi.detectAllFaces(webcamRef.current.video, FACE_DETECTION_OPTIONS)
                        .withFaceLandmarks()
                        .withFaceDescriptors()
                        .withFaceExpressions();


                    // Multiple faces detected, not proceeding further
                    if (detections.length > 1) {
                        setIsMultipleFacesDetected(true);
                        setShowMessage('Multiple faces detected');
                        return;
                    }

                    setIsMultipleFacesDetected(false);
                    setShowMessage('Move face for detection ↔️');

                    // Canvas reflection
                    const resizedDetections = faceapi.resizeResults(detections, VIDEO_CONSTRAINTS);
                    if (canvasRef.current) {
                        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    }

                    // Drawing lines and expression and data
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

                    // For each frame
                    if (!isSent) {
                        resizedDetections.forEach((detection) => {
                            const face = verificationFace(detection, resizedDetections);

                            if (face) {
                                stopCamera();
                                setFaceImg(face);
                                handleSend(face);
                            }
                        });
                    }
                }
            }, CAMERA_INTERVAL);

            setIntervalID(newIntervalID);
        }
    };

    const verificationFace = (detection, resizedDetections) => {
        const expressions = detection.expressions;
        const detection_score = detection.alignedRect._score;
        setShowMessage('Freeze 🧊');
        // Validation for expression
        if (detection_score > 0.7) {
            if (verificationStepRef.current === 1) {
                setShowMessage('Come closer place 🔍');
                if (expressions.happy > 0.7) {
                    verificationStepRef.current = 2;
                    setShowMessage('Neutral please 😐');
                } else {
                    setShowMessage('Smile please 🙂');
                }
            } else if (verificationStepRef.current === 2) {
                setShowMessage('Freeze 🧊');
                if (expressions.neutral > 0.7) {
                    return capture();
                } else {
                    setShowMessage('Neutral please 😐');
                }
            }
        } else {
            verificationStepRef.current = 1;
        }
    };

    // A helper function to handle axios post request
    async function postRequest(form) {
        try {
            return await axios.post(`${process.env.REACT_APP_API_URL}/identification`, form);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message, 'error');
        }
    }

    // A helper function to handle identified person's response
    async function handleIdentifiedPerson(response, dispatch) {
        console.log('identified')
        const access_token = response.data.access_token;
        const person = response.data.person;

        const result = await Swal.fire({
            title: 'Enter your PIN',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Enter your PIN',
            inputAttributes: {
                maxlength: 100,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter your PIN!';
                } else if (!/^\d{3,100}$/.test(value)) {
                    return 'PIN must be 3-100 digits!';
                }
            },
        });

        if (result.isConfirmed) {
            const pinnedFaceEncodings = generatePinnedFaceEncodings(person.face_encodings, result.value);
            try {
                const decryptedData = JSON.parse(await decryptData(person.personal_data, person.encrypted_private_key, pinnedFaceEncodings));
                dispatch(setUser({
                    face: response.data.face.face_image,
                    public_key: person.public_key,
                    token: access_token,
                    face_encodings: person.face_encodings,
                    encrypted_public_key: person.encrypted_public_key,
                    encrypted_private_key: person.encrypted_private_key,
                    id_number: decryptedData.id_number,
                    email: decryptedData.email,
                    firstname: decryptedData.firstname,
                    lastname: decryptedData.lastname,
                    nationality: decryptedData.nationality,
                    date_of_birth: decryptedData.date_of_birth,
                    date_of_issue: decryptedData.date_of_issue,
                    date_of_expiry: decryptedData.date_of_expiry,
                    phone: decryptedData.phone,
                    pin: result.value
                }));
            } catch (error) {
                Swal.fire('Incorrect PIN', 'Try again!', 'error').then((result) => {
                    if (result.isConfirmed)
                        window.location.reload();
                })
            }
        }
    }

    // A helper function to handle not identified person's response
    function handleNotIdentifiedPerson(response, dispatch, faceImg) {
        console.log('isnt identified')
        dispatch(setFace({
            face: response.data.face.face_image,
            face_encodings: response.data.face_encodings,
        }));
        console.log(faceImg)
        navigate('/settings');
    }

    // Improved handleSend function
    const handleSend = async (face) => {
        if (!face) {
            console.log('No image to send.');
            Swal.fire('No image to send.', 'Try again', 'error');
            navigate('/');
            return;
        }

        stopCamera();
        const form = { face_image: face };
        const response = await postRequest(form);

        if (!response) {
            navigate('/');
            return;
        }

        if (response.status !== 200) {
            console.log(response);
            Swal.fire(response.message, 'Try again', 'info');
            navigate('/');
            return;
        }

        setIsSent(true);

        // Person isn't Identified
        if (response.data.face_encodings) {
            handleNotIdentifiedPerson(response, dispatch, faceImg);
        }
        // Person is Identified
        else if (response.data.access_token) {
            await handleIdentifiedPerson(response, dispatch);
        }
    };


    const capture = useCallback(() => {
        const face = webcamRef.current.getScreenshot();
        setFaceImg(face);
        setShowMessage('Getting response ⌛');
        return face
    }, [webcamRef]);

    const stopCamera = useCallback(() => {
        if (webcamRef.current && webcamRef.current.stream) {
            const tracks = webcamRef.current.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        clearInterval(intervalID);
        canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [intervalID, webcamRef, canvasRef]);


    const handleStart = () => {
        setStart(true);
    };

    return (
        <Div>
            <div className={styles.faceid}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={VIDEO_CONSTRAINTS}
                    onUserMedia={handleVideoLoad}
                    className={start ? styles.webcamActive : styles.webcamInactive}
                />
                {start && isModelLoaded &&
                    <>
                        <canvas ref={canvasRef} />
                        <FaceIDMessage showMessage={showMessage} isMultipleFacesDetected={isMultipleFacesDetected} />
                    </>
                }
            </div>
            {!start &&
                <>
                    <p>Face identification is the process of verifying a person's identity based on the analysis and comparison of images.</p>
                    <Submit onClick={handleStart}>Start</Submit>
                </>
            }
        </Div >
    )
}

export default FaceID
