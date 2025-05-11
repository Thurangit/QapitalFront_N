import React from 'react';

import Dashboard from '../pages/RootPageApp';
import MenuPage from '../pages/Menu';
import IndexFeed from '../pages/ServicesApp/feed';
import TestSocialFeed from '../pages/ServicesApp/feed/test';
import ProfileServiceApp from '../pages/ServicesApp/profile';
import AddPostService from '../pages/ServicesApp/feed/addPost';

export const RoutesLinks = [

    //  WEBSITE PART
    { path: '/', element: <Dashboard />, name: 'WelcomePage' },
    { path: '/Menu', element: <MenuPage />, name: 'Menu' },


    //Services App
    { path: '/Services Feed', element: <IndexFeed />, name: 'FeedServices' },
    { path: '/Services profile', element: <ProfileServiceApp />, name: 'ProfileServiceApp' },
    { path: '/New post', element: <AddPostService />, name: 'ProfileServiceApp' },


    { path: '/Test', element: <TestSocialFeed />, name: 'Test' },
];