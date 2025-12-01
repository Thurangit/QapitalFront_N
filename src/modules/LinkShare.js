import React from 'react';

import Dashboard from '../pages/RootPageApp';
import MenuPage from '../pages/Menu';
import IndexFeed from '../pages/ServicesApp/feed';
import TestSocialFeed from '../pages/ServicesApp/feed/test';
import ProfileServiceApp from '../pages/ServicesApp/profile';
import ProfileSimple from '../pages/ServicesApp/profile/simple';
import MissionsPage from '../pages/ServicesApp/missions';
import ProfileTypePage from '../pages/ServicesApp/profileType';
import AddPostService from '../pages/ServicesApp/feed/addPost';
import PostDetails from '../pages/ServicesApp/feed/postDetails';
import PaymentPage from '../pages/ServicesApp/payment';
import InfluencerProfile from '../pages/ServicesApp/influencer';
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
    { path: '/User profile', element: <ProfileSimple />, name: 'ProfileSimple' },
    { path: '/New post', element: <AddPostService />, name: 'ProfileServiceApp' },
    { path: '/post/:id', element: <PostDetails />, name: 'PostDetails' },
    { path: '/mission/:id/paiement', element: <PaymentPage />, name: 'PaymentPage' },
    { path: '/influencer/:id', element: <InfluencerProfile />, name: 'InfluencerProfile' },
    { path: '/Mes missions', element: <MissionsPage />, name: 'MissionsPage' },
    { path: '/Type de profil', element: <ProfileTypePage />, name: 'ProfileTypePage' },


    { path: '/Test', element: <TestSocialFeed />, name: 'Test' },
];