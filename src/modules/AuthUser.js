import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlApi } from './urlApp';

export default function AuthUser() {

    const navigate = useNavigate();

    const safeParse = (value) => {
        if (!value || value === 'undefined' || value === 'null') return null;
        try { return JSON.parse(value); } catch { return null; }
    };
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return safeParse(tokenString);
    }
    const getUser = () => {
        const userString = localStorage.getItem('user');
        return safeParse(userString);
    }
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());
    const saveToken = (user, token) => {
        if (token) localStorage.setItem('token', JSON.stringify(token));
        if (user) localStorage.setItem('user', JSON.stringify(user));
        setToken(token || null);
        setUser(user || null);
        // Fetch geolocation (public endpoint) and store for auto-fill
        axios.get(`${urlApi}/geolocation`).then((resp) => {
            if (resp && resp.data) {
                localStorage.setItem('geo', JSON.stringify(resp.data));
            }
        }).catch(() => {
            // ignore geolocation failures silently
        });
        navigate('/Services Feed')
    }

    const getGeo = () => {
        const geoString = localStorage.getItem('geo');
        return safeParse(geoString);
    }
    const logout = () => {
        localStorage.clear();
        navigate("/");
    };
    const http = axios.create({
        baseURL: `${urlApi}/`,
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    // Configure axios-retry
    axiosRetry(http, {
        retries: 99, // nombre de tentatives de réessai
        retryCondition: (error) => {
            // si la réponse est une erreur 429, alors on réessaie
            return error.response.status === 429;
        },
        retryDelay: (retryCount) => {
            // temps avant le prochain réessai
            return retryCount * 500;
        }
    });

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        getGeo,
        http,
        logout,
    }
}

