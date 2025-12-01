import axios from 'axios';
import { urlApi } from '../modules/urlApp';

// Service pour gérer toutes les opérations liées au profil

class ProfileService {
    constructor() {
        this.api = axios.create({
            baseURL: urlApi,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    // Ajouter le token d'authentification à toutes les requêtes
    setAuthToken(token) {
        if (token) {
            this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    // ============ PORTFOLIO ============
    async createPortfolio(data, imageFile) {
        const formData = new FormData();
        formData.append('libelle_portfolio', data.title);
        formData.append('categorie_portfolio', data.client || '');
        formData.append('date_realisation_portfolio', data.date);
        formData.append('description_portfolio', data.description);
        formData.append('autres_informations_portfolio', data.tags || '');
        formData.append('id_user_portfolio', data.userId);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await this.api.post('/portfolio/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async getPortfolios(userId) {
        const response = await this.api.get(`/portfolio/all/${userId}`);
        return response.data;
    }

    async updatePortfolio(id, data, imageFile) {
        const formData = new FormData();
        if (data.title) formData.append('libelle_portfolio', data.title);
        if (data.client) formData.append('categorie_portfolio', data.client);
        if (data.date) formData.append('date_realisation_portfolio', data.date);
        if (data.description) formData.append('description_portfolio', data.description);
        if (data.tags) formData.append('autres_informations_portfolio', data.tags);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await this.api.put(`/portfolio/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async deletePortfolio(id) {
        const response = await this.api.delete(`/portfolio/delete/${id}`);
        return response.data;
    }

    // ============ EXPERIENCE ============
    async createExperience(data) {
        const response = await this.api.post('/experience/create', {
            position: data.position,
            company: data.company,
            period: data.period,
            description: data.description,
            id_user: data.userId
        });
        return response.data;
    }

    async getExperiences(userId) {
        const response = await this.api.get(`/experience/all/${userId}`);
        return response.data;
    }

    async updateExperience(id, data) {
        const response = await this.api.put(`/experience/update/${id}`, data);
        return response.data;
    }

    async deleteExperience(id) {
        const response = await this.api.delete(`/experience/delete/${id}`);
        return response.data;
    }

    // ============ EDUCATION (FORMATION) ============
    async createEducation(data) {
        const response = await this.api.post('/education/create', {
            degree: data.degree,
            school: data.school,
            period: data.period,
            description: data.description || '',
            id_user: data.userId
        });
        return response.data;
    }

    async getEducations(userId) {
        const response = await this.api.get(`/education/all/${userId}`);
        return response.data;
    }

    async updateEducation(id, data) {
        const response = await this.api.put(`/education/update/${id}`, {
            degree: data.degree,
            school: data.school,
            period: data.period,
            description: data.description
        });
        return response.data;
    }

    async deleteEducation(id) {
        const response = await this.api.delete(`/education/delete/${id}`);
        return response.data;
    }

    // ============ USER (PHOTOS & INFOS) ============
    async updateProfilePhoto(userId, imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await this.api.post(`/set/profilephoto/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async updateCoverPhoto(userId, imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await this.api.post(`/set/coverphoto/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async updateUserInfo(data) {
        const response = await this.api.post('/set/informations', {
            userid: data.userId,
            ville: data.ville,
            pseudo: data.pseudo,
            description: data.description,
            pays: data.pays,
            situation: data.situation
        });
        return response.data;
    }

    async updateContacts(data) {
        const response = await this.api.post('/set/identifiants', {
            userid: data.userId,
            email: data.email,
            tel: data.tel,
            whatsapp: data.whatsapp
        });
        return response.data;
    }

    async getUserInfo(userId) {
        const response = await this.api.get(`/infos/user/${userId}`);
        return response.data;
    }
}

export default new ProfileService();

