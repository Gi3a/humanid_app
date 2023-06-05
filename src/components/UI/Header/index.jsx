import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AppBar, Toolbar, IconButton, Divider, Drawer, List, ListItem, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';

import Settings from '@mui/icons-material/Settings';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Person from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Newspaper from '@mui/icons-material/Newspaper';
import Quiz from '@mui/icons-material/Quiz';
import Fingerprint from '@mui/icons-material/Fingerprint';

import { unsetUser } from '../../../store/slices/userSlice';
import { useAuth } from '../../../hooks/use-auth';

import styles from './Header.module.scss';

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useAuth();

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [drawerContent, setDrawerContent] = useState('');
    const [drawerAnchor, setDrawerAnchor] = useState('left');

    const handleDrawerOpen = (content, anchor) => {
        setDrawerContent(content);
        setDrawerAnchor(anchor);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const menuItems = [
        { text: 'Panel', icon: <Newspaper />, anchor: 'left', path: '/panel' },
        { text: 'About', icon: <Quiz />, anchor: 'left', path: '/about' },
    ];

    const userItems = [
        { text: 'Profile ID', icon: <Person />, anchor: 'right', path: '/profile' },
        { text: 'Settings', icon: <Settings />, anchor: 'right', path: '/settings' },
        { text: 'Exit', icon: <PowerSettingsNew />, anchor: 'right', action: () => dispatch(unsetUser()) },
    ];

    return (
        <header className={styles.header}>
            <AppBar position="fixed" className={styles.appbar}>
                {token ?
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => handleDrawerOpen('menu', 'left')}>
                            <MenuIcon />
                        </IconButton>
                        <Link to="/panel">
                            <Fingerprint />
                            HumanID
                        </Link>
                        <IconButton edge="end" color="inherit" aria-label="profile" onClick={() => handleDrawerOpen('profile', 'right')}>
                            <Person />
                        </IconButton>
                    </Toolbar>
                    :
                    <Toolbar className={styles.sologo}>
                        <Link to="/">
                            <Fingerprint />
                            HumanID
                        </Link>
                    </Toolbar>
                }
            </AppBar>
            <Drawer anchor={drawerAnchor} open={isDrawerOpen} onClose={handleDrawerClose} className='menu'>
                <div className='menuclose'>
                    <IconButton onClick={handleDrawerClose}>
                        {drawerAnchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List sx={{ flexGrow: 1 }}>
                    {(drawerContent === 'menu' ? menuItems : userItems).map(({ text, icon, path, action }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => {
                                handleDrawerClose();
                                if (path)
                                    navigate(path);
                                if (action)
                                    action();
                            }}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </header>
    );
};

export default Header;
