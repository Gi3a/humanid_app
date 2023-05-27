import React from 'react';

import { useTitle } from '../hooks/use-title';

import FaceID from '../components/FaceID'
import { Page } from '../components/UI/Page';

const IdentyPage = () => {

    useTitle('Identification');

    return (
        <Page>
            <FaceID />
        </Page>
    )
}

export default IdentyPage