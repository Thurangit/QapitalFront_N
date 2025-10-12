import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowDown, User, Truck, Package, CheckCircle, UserPlus, Phone, AtSign } from 'lucide-react';
import AuthUser from '../../modules/AuthUser';
import '../../style/auth-modern.css';
// Import de l'image
import logoPropose from '../../assets/images/login/logo_propose_1.jpeg';

const InscriptionModern = () => {
    const { http, setToken } = AuthUser();
    const navigate = useNavigate();

    // États pour le formulaire
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        if (!formData.nom.trim()) {
            newErrors.nom = 'Nom requis';
        }

        if (!formData.prenom.trim()) {
            newErrors.prenom = 'Prénom requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.telephone.trim()) {
            newErrors.telephone = 'Téléphone requis';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Mot de passe requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
            const response = await http.post('register', {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                telephone: formData.telephone,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            });

            setToken(response.data.user, response.data.access_token);
            navigate('/Account');

        } catch (error) {
            console.error('Erreur d\'inscription:', error);

            if (error.response?.status === 422) {
                // Erreurs de validation
                const validationErrors = error.response.data.errors;
                const formattedErrors = {};
                Object.keys(validationErrors).forEach(key => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setErrors(formattedErrors);
            } else if (error.response?.status === 409) {
                setErrors({ general: 'Un compte existe déjà avec cet email' });
            } else {
                setErrors({ general: 'Erreur lors de la création du compte' });
            }
        } finally {
            setIsLoading(false);
        }
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
                            <UserPlus className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in-up">
                        Rejoignez Propoz
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl text-blue-100 text-center mb-8 leading-relaxed animate-fade-in-up">
                        Créez votre compte et accédez à des milliers de services de qualité dans votre région.
                    </p>

                    {/* Points forts */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Accès à tous les services</span>
                        </div>
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Réservation en ligne sécurisée</span>
                        </div>
                        <div className="flex items-center space-x-3 feature-item">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-lg">Support client 24h/24</span>
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

            {/* Section droite - Formulaire d'inscription */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-gray-50">
                <div className="max-w-md mx-auto w-full auth-form">
                    {/* Header avec icône */}
                    <div className="text-center mb-6 animate-fade-in-up">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Créer un compte
                        </h2>
                        <p className="text-sm text-gray-600">
                            Remplissez le formulaire ci-dessous pour vous inscrire
                        </p>
                    </div>

                    {/* Tabs de navigation */}
                    <div className="auth-tabs flex mb-6">
                        <Link 
                            to="/" 
                            className="auth-tab flex-1 py-2 px-3 text-xs font-medium text-center"
                        >
                            Connexion
                        </Link>
                        <button className="auth-tab active flex-1 py-2 px-3 text-xs font-medium">
                            Inscription
                        </button>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Message d'erreur général */}
                        {errors.general && (
                            <div className="error-message px-3 py-2 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Nom et Prénom */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Nom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        placeholder="Votre nom"
                                        className={`auth-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm ${errors.nom ? 'error' : ''
                                            }`}
                                    />
                                </div>
                                {errors.nom && (
                                    <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Prénom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        placeholder="Votre prénom"
                                        className={`auth-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm ${errors.prenom ? 'error' : ''
                                            }`}
                                    />
                                </div>
                                {errors.prenom && (
                                    <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="votre@email.com"
                                    className={`auth-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm ${errors.email ? 'error' : ''
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Téléphone *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    placeholder="+237 6XX XXX XXX"
                                    className={`auth-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm ${errors.telephone ? 'error' : ''
                                        }`}
                                />
                            </div>
                            {errors.telephone && (
                                <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
                            )}
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Minimum 6 caractères"
                                    className={`auth-input w-full pl-10 pr-12 py-3 rounded-lg ${errors.password ? 'error' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmation mot de passe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Répétez votre mot de passe"
                                    className={`auth-input w-full pl-10 pr-12 py-3 rounded-lg ${errors.confirmPassword ? 'error' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Bouton d'inscription */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-button w-full text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="custom-spinner mr-3"></div>
                                    Création en cours...
                                </>
                            ) : (
                                'Créer mon compte'
                            )}
                        </button>
                    </form>

                    {/* Lien de connexion */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Vous avez déjà un compte?{' '}
                        <Link
                            to="/"
                            className="font-medium text-green-600 hover:text-green-800 transition-colors"
                        >
                            Se connecter
                        </Link>
                    </p>

                    {/* Conditions d'utilisation */}
                    <p className="mt-4 text-center text-xs text-gray-500">
                        En créant un compte, vous acceptez nos{' '}
                        <Link to="/terms" className="text-green-600 hover:text-green-800">
                            Conditions d'utilisation
                        </Link>
                        {' '}et notre{' '}
                        <Link to="/privacy" className="text-green-600 hover:text-green-800">
                            Politique de confidentialité
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InscriptionModern;
