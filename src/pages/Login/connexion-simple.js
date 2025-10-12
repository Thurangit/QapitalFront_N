import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowDown, User, Truck, Package, CheckCircle, AtSign } from 'lucide-react';
import AuthUser from '../../modules/AuthUser';
import '../../style/auth-modern.css';
// Import de l'image
import logoPropose from '../../assets/images/login/logo_propose_1.jpeg';

const ConnexionSimple = () => {
    const { http, setToken } = AuthUser();
    const navigate = useNavigate();

    // États pour le formulaire
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Gestion des changements d'inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};

        if (!formData.id.trim()) {
            newErrors.id = 'Identifiant requis';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Mot de passe requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await http.post('login', {
                id: formData.id,
                password: formData.password
            });

            setToken(response.data.user, response.data.access_token);
            navigate('/Services Feed');

        } catch (error) {
            console.error('Erreur de connexion:', error);

            if (error.response?.status === 401) {
                setErrors({ general: 'Identifiant ou mot de passe incorrect' });
            } else if (error.response?.status === 404) {
                setErrors({ general: 'Service non disponible' });
            } else if (error.response?.status === 500) {
                setErrors({ general: 'Erreur serveur, veuillez réessayer' });
            } else {
                setErrors({ general: 'Problème de connexion' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Connexion sociale (placeholder)
    const handleSocialLogin = (provider) => {
        console.log(`Connexion avec ${provider}`);
    };

    return (
        <div className="min-h-screen flex">
            {/* Section gauche - Image de fond avec contenu */}
            <div
                className="hidden lg:flex lg:w-1/2 auth-hero relative overflow-hidden"
                style={{
                    backgroundImage: `url(${logoPropose})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlay avec gradient */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))'
                    }}
                ></div>

                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 animate-slide-in-left">
                    {/* Icône principale */}
                    <div className="mb-8 animate-float">
                        <div className="w-24 h-24 decorative-icon rounded-full flex items-center justify-center">
                            <Truck className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in-up">
                        Services Proposés
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl text-blue-100 text-center mb-8 leading-relaxed animate-fade-in-up">
                        Des services de qualité, disponibles 24h/24 pour répondre à tous vos besoins professionnels.
                    </p>

                    {/* Points forts */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Services disponibles partout</span>
                        </div>
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Prestataires qualifiés</span>
                        </div>
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Réservation en ligne</span>
                        </div>
                    </div>
                </div>

                {/* Icônes décoratives */}
                <div className="absolute top-10 right-10 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-16 h-16 decorative-icon rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-12 h-12 decorative-icon rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Section droite - Formulaire de connexion */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-gray-50">
                <div className="max-w-md mx-auto w-full auth-form">
                    {/* Header avec icône */}
                    <div className="text-center mb-6 animate-fade-in-up">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ArrowDown className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Connexion à Propoz
                        </h2>
                        <p className="text-sm text-gray-600">
                            Accédez à votre compte pour continuer
                        </p>
                    </div>

                    {/* Tabs de navigation */}
                    <div className="auth-tabs flex mb-6">
                        <button className="auth-tab active flex-1 py-2 px-3 text-xs font-medium">
                            Connexion
                        </button>
                        <Link
                            to="/Inscription"
                            className="auth-tab flex-1 py-2 px-3 text-xs font-medium text-center"
                        >
                            Inscription
                        </Link>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Message d'erreur général */}
                        {errors.general && (
                            <div className="error-message px-3 py-2 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Champ identifiant */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Identifiant
                            </label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    placeholder="Email, téléphone, nom d'utilisateur..."
                                    className={`auth-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm ${errors.id ? 'error' : ''
                                        }`}
                                />
                            </div>
                            {errors.id && (
                                <p className="mt-1 text-xs text-red-600">{errors.id}</p>
                            )}
                        </div>

                        {/* Champ mot de passe */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Entrez votre mot de passe"
                                    className={`auth-input w-full pl-9 pr-10 py-2.5 rounded-lg text-sm ${errors.password ? 'error' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={stayLoggedIn}
                                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                                    className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                                />
                                <span className="ml-2 text-xs text-gray-700">Se souvenir de moi</span>
                            </label>
                            <Link
                                to="/auth/recoverpw"
                                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Mot de passe oublié?
                            </Link>
                        </div>

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-button w-full text-white py-2.5 px-4 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="custom-spinner mr-2"></div>
                                    Connexion en cours...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>

                        {/* Séparateur */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-gray-50 text-gray-500">Ou se connecter avec</span>
                            </div>
                        </div>

                        {/* Boutons de connexion sociale */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="social-button flex items-center justify-center px-3 py-2 rounded-lg text-gray-700 bg-white text-xs"
                            >
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('facebook')}
                                className="social-button flex items-center justify-center px-3 py-2 rounded-lg text-gray-700 bg-white text-xs"
                            >
                                <svg className="w-4 h-4 mr-1" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </form>

                    {/* Lien d'inscription */}
                    <p className="mt-6 text-center text-xs text-gray-600">
                        Vous n'avez pas de compte?{' '}
                        <Link
                            to="/Inscription"
                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConnexionSimple;
