import React from 'react';

import Dashboard from '../pages/RootPageApp';
import MenuPage from '../pages/Menu';
import IndexFeed from '../pages/ServicesApp/feed';
import TestSocialFeed from '../pages/ServicesApp/feed/test';
import ProfileServiceApp from '../pages/ServicesApp/profile';
import AddPostService from '../pages/ServicesApp/feed/addPost';
import ConnexionSimple from '../pages/Login/connexion-simple';
import InscriptionModern from '../pages/Login/inscription-modern';

export const RoutesLinks = [

    //  WEBSITE PART
    { path: '/', element: <ConnexionSimple />, name: 'Connexion' },
    { path: '/Inscription', element: <InscriptionModern />, name: 'Inscription' },
    { path: '/Account', element: <Dashboard />, name: 'WelcomePage' },
    { path: '/Menu', element: <MenuPage />, name: 'Menu' },


    //Services App
    { path: '/Services Feed', element: <IndexFeed />, name: 'FeedServices' },
    { path: '/Services profile', element: <ProfileServiceApp />, name: 'ProfileServiceApp' },
    { path: '/New post', element: <AddPostService />, name: 'ProfileServiceApp' },


    { path: '/Test', element: <TestSocialFeed />, name: 'Test' },
];