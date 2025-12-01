import { useState, useEffect, useCallback } from 'react';
import profileService from '../services/profileService';
import { toast } from '../modules/Components/Toast';

/**
 * Hook personnalisé pour gérer toutes les opérations liées au profil
 */
export const useProfile = (userId) => {
    const [portfolios, setPortfolios] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Charger toutes les données du profil
    const loadProfileData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const [portfolioRes, experienceRes, educationRes] = await Promise.all([
                profileService.getPortfolios(userId).catch(() => ({ data: [] })),
                profileService.getExperiences(userId).catch(() => ({ data: [] })),
                profileService.getEducations(userId).catch(() => ({ data: [] }))
            ]);

            setPortfolios(portfolioRes.data || []);
            setExperiences(experienceRes.data || []);
            setEducations(educationRes.data || []);
        } catch (err) {
            console.error('Erreur lors du chargement du profil:', err);
            setError(err.message);
            toast.error('Erreur lors du chargement du profil', 'Erreur');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Charger les données au montage
    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    // ============ PORTFOLIO ============
    const createPortfolio = async (data, imageFile) => {
        try {
            const result = await profileService.createPortfolio({ ...data, userId }, imageFile);
            setPortfolios(prev => [result.data, ...prev]);
            toast.success('Projet ajouté au portfolio avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur création portfolio:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout du projet', 'Erreur');
            throw err;
        }
    };

    const updatePortfolio = async (id, data, imageFile) => {
        try {
            const result = await profileService.updatePortfolio(id, data, imageFile);
            setPortfolios(prev => prev.map(p => p.id === id ? result.data : p));
            toast.success('Projet mis à jour avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur mise à jour portfolio:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', 'Erreur');
            throw err;
        }
    };

    const deletePortfolio = async (id) => {
        try {
            await profileService.deletePortfolio(id);
            setPortfolios(prev => prev.filter(p => p.id !== id));
            toast.success('Projet supprimé avec succès !', 'Succès');
        } catch (err) {
            console.error('Erreur suppression portfolio:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la suppression', 'Erreur');
            throw err;
        }
    };

    // ============ EXPERIENCE ============
    const createExperience = async (data) => {
        try {
            const result = await profileService.createExperience({ ...data, userId });
            setExperiences(prev => [result.data, ...prev]);
            toast.success('Expérience ajoutée avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur création expérience:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout', 'Erreur');
            throw err;
        }
    };

    const updateExperience = async (id, data) => {
        try {
            const result = await profileService.updateExperience(id, data);
            setExperiences(prev => prev.map(e => e.id === id ? result.data : e));
            toast.success('Expérience mise à jour avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur mise à jour expérience:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', 'Erreur');
            throw err;
        }
    };

    const deleteExperience = async (id) => {
        try {
            await profileService.deleteExperience(id);
            setExperiences(prev => prev.filter(e => e.id !== id));
            toast.success('Expérience supprimée avec succès !', 'Succès');
        } catch (err) {
            console.error('Erreur suppression expérience:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la suppression', 'Erreur');
            throw err;
        }
    };

    // ============ EDUCATION ============
    const createEducation = async (data) => {
        try {
            const result = await profileService.createEducation({ ...data, userId });
            setEducations(prev => [result.data, ...prev]);
            toast.success('Formation ajoutée avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur création formation:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout', 'Erreur');
            throw err;
        }
    };

    const updateEducation = async (id, data) => {
        try {
            const result = await profileService.updateEducation(id, data);
            setEducations(prev => prev.map(e => e.id === id ? result.data : e));
            toast.success('Formation mise à jour avec succès !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur mise à jour formation:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', 'Erreur');
            throw err;
        }
    };

    const deleteEducation = async (id) => {
        try {
            await profileService.deleteEducation(id);
            setEducations(prev => prev.filter(e => e.id !== id));
            toast.success('Formation supprimée avec succès !', 'Succès');
        } catch (err) {
            console.error('Erreur suppression formation:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la suppression', 'Erreur');
            throw err;
        }
    };

    // ============ PHOTOS ============
    const updateProfilePhoto = async (imageFile) => {
        try {
            const result = await profileService.updateProfilePhoto(userId, imageFile);
            toast.success('Photo de profil mise à jour !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur mise à jour photo profil:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', 'Erreur');
            throw err;
        }
    };

    const updateCoverPhoto = async (imageFile) => {
        try {
            const result = await profileService.updateCoverPhoto(userId, imageFile);
            toast.success('Photo de couverture mise à jour !', 'Succès');
            return result;
        } catch (err) {
            console.error('Erreur mise à jour photo couverture:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', 'Erreur');
            throw err;
        }
    };

    return {
        // États
        portfolios,
        experiences,
        educations,
        loading,
        error,

        // Fonctions Portfolio
        createPortfolio,
        updatePortfolio,
        deletePortfolio,

        // Fonctions Expérience
        createExperience,
        updateExperience,
        deleteExperience,

        // Fonctions Formation
        createEducation,
        updateEducation,
        deleteEducation,

        // Fonctions Photos
        updateProfilePhoto,
        updateCoverPhoto,

        // Recharger
        reload: loadProfileData
    };
};

