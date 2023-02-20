import React from 'react'

import FaceID from '../components/FaceID'
import FaceRecognition from '../components/FaceRecognition'

const IdentyPage = () => {
    return (
        <div className='page'>
            <h1>HumanID</h1>
            <FaceID />
            {/* <FaceRecognition /> */}
        </div>
    )
}

export default IdentyPage