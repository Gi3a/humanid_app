import React, { useState } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Newspaper from '@mui/icons-material/Newspaper';
import ChecklistRtl from '@mui/icons-material/ChecklistRtl';
import FormatListNumberedRtl from '@mui/icons-material/FormatListNumberedRtl';

import Box from '../components/UI/Box';
import List from '../components/UI/List';

import { useTitle } from '../hooks/use-title';

const PanelPage = () => {

    const [type, setType] = useState('accesses');

    const handleChange = (event, newType) => {
        if (newType !== null) {
            setType(newType);
        }
    };

    useTitle('Panel');

    return (
        <>
            <h1><Newspaper />Panel</h1>
            <Box>
                <ToggleButtonGroup
                    color="primary"
                    value={type}
                    exclusive
                    onChange={handleChange}
                    aria-label="Type"
                    className='toggle'
                >
                    <ToggleButton value="accesses">
                        <ChecklistRtl />
                        Accesses
                    </ToggleButton>
                    <ToggleButton value="shares">
                        <FormatListNumberedRtl />
                        Shares
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box>
                <List type={type} />
            </Box>
        </>
    )
}

export default PanelPage