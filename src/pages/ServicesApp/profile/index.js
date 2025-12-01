import React, { useState, useEffect } from 'react';
import {
    Star,
    MapPin,
    Mail,
    Phone,
    Globe,
    Edit2,
    Share2,
    X,
    MessageCircle,
    MessageSquare,
    Calendar,
    Award,
    Plus,
    Trash2,
    UploadCloud,
    Camera,
    Languages,
    Linkedin,
    Facebook,
    Instagram,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { StaticsImages } from '../../../modules/images';
import AuthUser from '../../../modules/AuthUser';
import { urlPublicAPi, urlServerImage } from '../../../modules/urlApp';
import { useProfile } from '../../../hooks/useProfile';
import { toast } from '../../../modules/Components/Toast';
import profileService from '../../../services/profileService';
import { OptimizedImage } from '../../../components/OptimizedImage';
import { ProfilePageSkeleton } from '../../../components/SkeletonLoader';

// Sous-composant: onglets d'édition du profil pour réduire la hauteur du modal
function ProfileEditTabs({ profileForm, setProfileForm, profileState }) {
    const [tab, setTab] = useState('general');
    const villesCameroun = [
        "Douala", "Yaoundé", "Bafoussam", "Bamenda", "Garoua", "Maroua", "Kribi", "Limbe", "Bertoua", "Edea", "Ngaoundéré", "Kumba", "Dschang", "Buea", "Foumban", "Foumbot", "Mbouda", "Nkongsamba", "Ebolowa", "Sangmelima"
    ];
    const [cityQuery, setCityQuery] = useState('');
    const [cityList, setCityList] = useState(profileState.cities || []);
    const filteredCities = villesCameroun.filter(v => v.toLowerCase().includes(cityQuery.toLowerCase()) && !cityList.includes(v));

    const addCity = (city) => {
        const next = [...cityList, city];
        setCityList(next);
        setProfileForm({ ...profileForm, citiesText: next.join(', ') });
        setCityQuery('');
    };
    const removeCity = (city) => {
        const next = cityList.filter(c => c !== city);
        setCityList(next);
        setProfileForm({ ...profileForm, citiesText: next.join(', ') });
    };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-3">
                <button className={`px-3 py-1.5 text-sm rounded-full border ${tab === 'general' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`} onClick={() => setTab('general')}>Général</button>
                <button className={`px-3 py-1.5 text-sm rounded-full border ${tab === 'photos' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`} onClick={() => setTab('photos')}>Photos</button>
            </div>

            {tab === 'general' && (
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Rôle</label>
                        <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={profileForm.role} onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Fonction</label>
                        <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={profileForm.function} onChange={(e) => setProfileForm({ ...profileForm, function: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea rows={4} className="mt-1 w-full border rounded-md p-2 text-sm" value={profileForm.description} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Villes</label>
                        <div className="mt-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {cityList.map(city => (
                                    <span key={city} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        {city}
                                        <button className="text-blue-700" onClick={() => removeCity(city)}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Ajouter une ville..."
                                className="w-full border rounded-md p-2 text-sm"
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                            />
                            {cityQuery && filteredCities.length > 0 && (
                                <div className="mt-1 max-h-40 overflow-auto border rounded-md bg-white shadow">
                                    {filteredCities.map(c => (
                                        <div key={c} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer" onClick={() => addCity(c)}>{c}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Solde minimum</label>
                        <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={profileForm.minimumPrice} onChange={(e) => setProfileForm({ ...profileForm, minimumPrice: e.target.value })} />
                    </div>
                </div>
            )}

            {tab === 'photos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Photo de couverture</label>
                        <div className="mt-1 border rounded-md p-2">
                            {(profileForm.coverPreview || profileState.coverPhoto) && (
                                <img src={profileForm.coverPreview || profileState.coverPhoto} alt="Couverture" className="w-full h-24 object-cover rounded" />
                            )}
                            <div className="flex gap-2 mt-2">
                                <input id="coverUpload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                        const preview = URL.createObjectURL(file);
                                        setProfileForm({ ...profileForm, coverFile: file, coverPreview: preview });
                                    }
                                }} />
                                <label htmlFor="coverUpload" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><UploadCloud size={14} /> Choisir</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Photo de profil</label>
                        <div className="mt-1 border rounded-md p-2">
                            {(profileForm.profilePreview || profileState.profilePhoto) && (
                                <img src={profileForm.profilePreview || profileState.profilePhoto} alt="Profil" className="w-20 h-20 object-cover rounded-full" />
                            )}
                            <div className="flex gap-2 mt-2">
                                <input id="avatarUpload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                        const preview = URL.createObjectURL(file);
                                        setProfileForm({ ...profileForm, profileFile: file, profilePreview: preview });
                                    }
                                }} />
                                <label htmlFor="avatarUpload" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><Camera size={14} /> Choisir</label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// Données simulées
const freelancerData = {
    coverPhoto: StaticsImages.t1,
    profilePhoto: StaticsImages.a1,
    firstName: "Marie",
    lastName: "Dupont",
    role: "Designer UX/UI",
    function: "Freelance Senior",
    description: "Designer UX/UI avec plus de 8 ans d'expérience dans la création d'interfaces utilisateur intuitives et esthétiques. Spécialisée dans les applications mobiles et sites web responsifs.",
    stars: 4.8,
    missionsCount: 47,
    cities: ["Paris", "Lyon", "Bordeaux", "À distance"],
    minimumPrice: "450000 XAF",
    contacts: {
        email: "marie.dupont@example.com",
        phones: ["+33 6 12 34 56 78", "+33 6 98 76 54 32"],
        website: "www.mariedupontdesign.fr",
        facebook: "mariedupontdesign",
        instagram: "marie_design",
        twitter: "MarieDesignUX",
        whatsappNumber: "+33612345678"
    },
    portfolio: [
        {
            id: 1,
            title: "Refonte application bancaire",
            thumbnail: "/api/placeholder/200/200",
            description: "Refonte complète de l'interface utilisateur d'une application bancaire mobile avec focus sur l'accessibilité et la simplicité d'utilisation.",
            client: "BanqueDigitale",
            date: "Avril 2024",
            tags: ["Mobile", "UX/UI", "Fintech"]
        },
        {
            id: 2,
            title: "Site e-commerce",
            thumbnail: "/api/placeholder/200/200",
            description: "Création d'une interface e-commerce moderne et optimisée pour le mobile avec parcours d'achat simplifié.",
            client: "ModeBoutique",
            date: "Février 2024",
            tags: ["E-commerce", "Responsive", "UI Design"]
        },
        {
            id: 3,
            title: "Application de réservation",
            thumbnail: "/api/placeholder/200/200",
            description: "Conception de l'expérience utilisateur pour une application de réservation de restaurants avec système de notation intégré.",
            client: "FoodConnect",
            date: "Décembre 2023",
            tags: ["Mobile", "UX Research", "Prototypage"]
        },
        {
            id: 4,
            title: "Dashboard Analytique",
            thumbnail: "/api/placeholder/200/200",
            description: "Création d'un tableau de bord analytique pour visualiser les données complexes de manière intuitive et accessible.",
            client: "DataVision",
            date: "Octobre 2023",
            tags: ["Dashboard", "Data Viz", "SaaS"]
        }
    ],
    missions: [
        {
            id: 1,
            title: "Refonte application mobile",
            client: "TechStart SAS",
            date: "Mars 2024 - Avril 2024",
            status: "Terminé",
            image: "/api/placeholder/80/80",
            stars: 5
        },
        {
            id: 2,
            title: "Conception interface web admin",
            client: "GestionPro",
            date: "Janvier 2024 - Février 2024",
            status: "Terminé",
            image: "/api/placeholder/80/80",
            stars: 4.5
        },
        {
            id: 3,
            title: "Design système pour application SaaS",
            client: "CloudServices",
            date: "Novembre 2023 - Décembre 2023",
            status: "Terminé",
            image: "/api/placeholder/80/80",
            stars: 5
        },
    ],
    experience: [
        {
            id: 1,
            position: "Designer UX/UI Senior",
            company: "AgenceDigitale",
            period: "2020 - 2023",
            description: "Conception d'interfaces utilisateur pour des clients dans divers secteurs: finance, santé, e-commerce. Direction artistique de projets majeurs."
        },
        {
            id: 2,
            position: "Designer UX",
            company: "StartupInnovation",
            period: "2018 - 2020",
            description: "Recherche utilisateur, prototypage et tests utilisateurs pour applications mobiles et web. Collaboration étroite avec l'équipe de développement."
        },
        {
            id: 3,
            position: "Designer UI",
            company: "WebStudio",
            period: "2016 - 2018",
            description: "Création d'interfaces visuelles, d'identités de marque et d'éléments graphiques pour sites web et applications."
        }
    ],
    education: [
        {
            id: 1,
            degree: "Master en Design Numérique",
            school: "École Supérieure de Design",
            period: "2014 - 2016"
        },
        {
            id: 2,
            degree: "Licence en Arts Graphiques",
            school: "Université des Arts Appliqués",
            period: "2011 - 2014"
        },
        {
            id: 3,
            degree: "Formation UX Design Certifiée",
            school: "Institut du Design Interactif",
            period: "2018"
        }
    ]
};

// Styles d'animation personnalisés
const styles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}

.animate-slideIn {
    animation: slideIn 0.3s ease-out;
}

.animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
}
`;

export default function ProfileServiceApp() {
    const [activeTab, setActiveTab] = useState("portfolio");
    const [language, setLanguage] = useState("fr");
    const { user } = AuthUser();
    
    // Utiliser le hook personnalisé pour gérer le profil
    const {
        portfolios,
        experiences,
        educations,
        loading: profileLoading,
        createPortfolio,
        updatePortfolio,
        deletePortfolio,
        createExperience,
        updateExperience,
        deleteExperience,
        createEducation,
        updateEducation,
        deleteEducation,
        updateProfilePhoto,
        updateCoverPhoto
    } = useProfile(user?.id);

    const [profileState, setProfileState] = useState({
        coverPhoto: freelancerData.coverPhoto,
        profilePhoto: user?.avatar ? `${urlServerImage}/${user.avatar}` : `${urlPublicAPi}/${user?.avatar || ''}`,
        role: user?.role_professionnel || freelancerData.role,
        function: user?.fonction || freelancerData.function,
        description: user?.description || freelancerData.description,
        cities: freelancerData.cities,
        minimumPrice: user?.solde_minimum || freelancerData.minimumPrice,
        missions: freelancerData.missions || [],
    });

    const [contactsState, setContactsState] = useState({
        email: user?.email || freelancerData.contacts.email,
        phones: [user?.num_tel_one || '', user?.num_tel_two || ''],
        website: freelancerData.contacts.website || '',
    });

    const [socialsState, setSocialsState] = useState({
        linkedin: '',
        facebook: freelancerData.contacts.facebook || '',
        instagram: freelancerData.contacts.instagram || '',
        x: freelancerData.contacts.twitter || '',
        tiktok: '',
        whatsapp: user?.whatsapp_tel_two || freelancerData.contacts.whatsappNumber || '',
    });

    // État de chargement pour les uploads
    const [uploading, setUploading] = useState(false);
    const [showContactsModal, setShowContactsModal] = useState(false);
    const [showSocialsModal, setShowSocialsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [portfolioForm, setPortfolioForm] = useState({ title: '', client: '', date: '', description: '', tags: '', imageFile: null, imagePreview: '' });
    const [showPortfolioDetails, setShowPortfolioDetails] = useState(false);
    const [portfolioDetailsItem, setPortfolioDetailsItem] = useState(null);
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [editingMission, setEditingMission] = useState(null);
    const [missionForm, setMissionForm] = useState({ title: '', client: '', date: '', status: 'En cours', stars: 0, imageFile: null, imagePreview: '' });
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [experienceForm, setExperienceForm] = useState({ position: '', company: '', period: '', description: '' });
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [editingEducation, setEditingEducation] = useState(null);
    const [educationForm, setEducationForm] = useState({ degree: '', school: '', period: '' });
    const [profileForm, setProfileForm] = useState({ role: '', function: '', description: '', citiesText: '', minimumPrice: '', coverFile: null, coverPreview: '', profileFile: null, profilePreview: '' });
    const [showShareModal, setShowShareModal] = useState(false);
    const [confirmState, setConfirmState] = useState({ open: false, message: '', onConfirm: null });
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };



    const toggleLanguage = () => {
        setLanguage(language === "fr" ? "en" : "fr");
    };

    // Pour la démo, on garde la langue française uniquement, mais le bouton est fonctionnel

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <Star size={16} className="text-gray-300" />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} size={16} className="text-gray-300" />);
            }
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    // Afficher skeleton pendant le chargement initial
    if (profileLoading) {
        return <ProfilePageSkeleton />;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-6">
            <style>{styles}</style>
            {/* Photo de couverture optimisée */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <OptimizedImage
                    src={profileState.coverPhoto}
                    alt="Couverture"
                    className="w-full h-full object-cover opacity-60"
                    placeholder="/api/placeholder/1200/400"
                    priority={true}
                />
                <button className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full" onClick={() => {
                    setProfileForm({
                        role: profileState.role,
                        function: profileState.function,
                        description: profileState.description,
                        citiesText: profileState.cities.join(', '),
                        minimumPrice: profileState.minimumPrice,
                        coverFile: null,
                        coverPreview: '',
                        profileFile: null,
                        profilePreview: ''
                    });
                    setShowProfileModal(true);
                }}>
                    <Edit2 size={16} className="text-gray-700" />
                </button>

                {/* Bouton de changement de langue */}
                <button
                    onClick={toggleLanguage}
                    className="absolute top-2 left-2 bg-white bg-opacity-70 px-3 py-1.5 rounded-full flex items-center text-sm font-medium"
                >
                    <Languages size={16} className="mr-1" />
                    {language === "fr" ? "FR" : "EN"}
                </button>
            </div>

            {/* Section profil */}
            <div className="px-4 -mt-16 relative">
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex items-start">
                        <div className="relative -mt-12">
                            <OptimizedImage
                                src={profileState.profilePhoto}
                                alt={`${user.user} ${user.prenom}`}
                                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm"
                                placeholder="/api/placeholder/150/150"
                                priority={true}
                            />
                            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm" onClick={() => {
                                setProfileForm({
                                    role: profileState.role,
                                    function: profileState.function,
                                    description: profileState.description,
                                    citiesText: profileState.cities.join(', '),
                                    minimumPrice: profileState.minimumPrice,
                                    coverFile: null,
                                    coverPreview: '',
                                    profileFile: null,
                                    profilePreview: ''
                                });
                                setShowProfileModal(true);
                            }}>
                                <Edit2 size={14} className="text-gray-700" />
                            </button>
                        </div>

                        <div className="ml-4 flex-1 pt-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-xl font-bold flex items-center">
                                        {user.user} {user.prenom}
                                        <button className="ml-2">
                                            <Edit2 size={14} className="text-gray-500" />
                                        </button>
                                    </h1>
                                    <p className="text-gray-600 flex items-center">
                                        {profileState.role}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        {profileState.function}

                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-2 bg-gray-100 rounded-full" onClick={() => setShowShareModal(true)}>
                                        <Share2 size={18} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center">
                                    {renderStars(freelancerData.stars)}
                                </div>

                                <div className="flex items-center">
                                    <Award size={16} className="text-blue-500 mr-1" />
                                    <span className="text-sm">{freelancerData.missionsCount} missions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 relative">
                        <p className="text-sm text-gray-700">
                            {profileState.description}
                        </p>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(profileState.cities || []).map((city, index) => (
                            <div key={index} className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">
                                <MapPin size={12} className="mr-1" />
                                {city}
                            </div>
                        ))}

                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-green-600 font-medium">
                            {/* <DollarSign size={16} className="mr-1" /> */}

                            <span>  Solde : {profileState.minimumPrice}</span>
                            <button className="ml-2">

                            </button>
                        </div>
                    </div>
                </div>

                {/* Section contacts */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">
                        Contacts
                        <button className="p-1 bg-gray-100 rounded-full" onClick={() => setShowContactsModal(true)}>
                            <Edit2 size={14} className="text-gray-600" />
                        </button>
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Mail size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{contactsState.email}</span>
                        </div>


                        {(contactsState.phones[0] || contactsState.phones[1]) && (
                            <>
                                {contactsState.phones[0] && (
                                    <div className="flex items-center">
                                        <Phone size={16} className="text-gray-500 mr-3" />
                                        <span className="text-sm">{contactsState.phones[0]}</span>
                                    </div>
                                )}
                                {contactsState.phones[1] && (
                                    <div className="flex items-center">
                                        <Phone size={16} className="text-gray-500 mr-3" />
                                        <span className="text-sm">{contactsState.phones[1]}</span>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex items-center">
                            <MessageCircle size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{freelancerData.contacts.whatsappNumber}</span>
                        </div>

                        <div className="flex items-center">
                            <Globe size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{contactsState.website}</span>
                        </div>


                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-600">Réseaux Sociaux</h3>
                        <div className="flex items-center space-x-3">
                            <button className="text-blue-600" title="LinkedIn">
                                <Linkedin size={18} />
                            </button>
                            <button className="text-blue-600" title="Facebook">
                                <Facebook size={18} />
                            </button>
                            <button className="text-pink-600" title="Instagram">
                                <Instagram size={18} />
                            </button>
                            <button className="text-gray-800" title="X">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3h4.5l5 6.5L18.5 3H22l-7.6 9.5L22 21h-4.5l-5.4-7-5 7H2l8.3-10.5L3 3z" />
                                </svg>
                            </button>
                            <button className="text-green-500" title="WhatsApp">
                                <MessageCircle size={18} />
                            </button>
                            <button className="text-gray-900" title="TikTok">
                                {/* Icône TikTok simplifiée */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 3c1.1 1.7 2.8 2.9 4.7 3.2v3.1c-1.7-.1-3.3-.7-4.7-1.7v6.2c0 3.8-3.1 6.9-6.9 6.9S2.2 17.6 2.2 13.8c0-3.5 2.6-6.4 6-6.8v3.2c-1.7.4-2.9 1.9-2.9 3.6 0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6V3h3.5z" />
                                </svg>
                            </button>
                            <button className="ml-2 p-1 bg-gray-100 rounded-full" onClick={() => setShowSocialsModal(true)} title="Modifier les réseaux">
                                <Edit2 size={14} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "portfolio" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("portfolio")}
                        >
                            Portfolio
                        </button>
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "missions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("missions")}
                        >
                            Missions
                        </button>
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "education" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("competences")}
                        >
                            Compétences
                        </button>
                        {/* <button
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "experience" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("experience")}
                        >
                            Expérience
                        </button> */}
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "education" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("education")}
                        >
                            Formation
                        </button>

                    </div>

                    {/* Contenu des tabs */}
                    <div className="p-4">
                        {activeTab === "portfolio" && (
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold">Projets</h3>
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition-colors" onClick={() => {
                                        setEditingPortfolio(null);
                                        setPortfolioForm({ title: '', client: '', date: '', description: '', tags: '', imageFile: null, imagePreview: '' });
                                        setShowPortfolioModal(true);
                                    }}>
                                        <Plus size={14} /> Ajouter
                                    </button>
                                </div>
                                {profileLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    </div>
                                ) : portfolios.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">Aucun projet dans le portfolio. Cliquez sur "Ajouter" pour commencer !</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {portfolios.map((item, idx) => {
                                            const imageUrl = item.image_portfolio ? `${urlPublicAPi}/${item.image_portfolio}` : '/api/placeholder/200/200';
                                            return (
                                                <div key={item.id} className="rounded-lg overflow-hidden shadow-sm group relative cursor-pointer transform hover:scale-105 transition-transform duration-200" onClick={() => { setPortfolioDetailsItem(item); setShowPortfolioDetails(true); }}>
                                                    <img src={imageUrl} alt={item.libelle_portfolio} className="w-full h-36 object-cover" onError={(e) => {
                                                        e.target.src = '/api/placeholder/200/200';
                                                    }} />
                                                    <div className="p-2 bg-white">
                                                        <h3 className="text-sm font-medium truncate">{item.libelle_portfolio}</h3>
                                                        <p className="text-xs text-gray-500 truncate">{item.categorie_portfolio}</p>
                                                    </div>
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <button className="p-1 rounded bg-white shadow hover:bg-gray-100 transition-colors" onClick={() => {
                                                            setEditingPortfolio({ index: idx, item });
                                                            setPortfolioForm({ 
                                                                title: item.libelle_portfolio, 
                                                                client: item.categorie_portfolio, 
                                                                date: item.date_realisation_portfolio, 
                                                                description: item.description_portfolio, 
                                                                tags: item.autres_informations_portfolio || '', 
                                                                imageFile: null, 
                                                                imagePreview: '' 
                                                            });
                                                            setShowPortfolioModal(true);
                                                        }}><Edit2 size={14} /></button>
                                                        <button className="p-1 rounded bg-white shadow hover:bg-red-50 transition-colors" onClick={() => {
                                                            setConfirmState({
                                                                open: true,
                                                                message: 'Supprimer ce projet du portfolio ? Cette action est irréversible.',
                                                                onConfirm: async () => {
                                                                    try {
                                                                        await deletePortfolio(item.id);
                                                                    } catch (error) {
                                                                        console.error('Erreur suppression:', error);
                                                                    }
                                                                }
                                                            });
                                                        }}><Trash2 size={14} className="text-red-600" /></button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "missions" && (
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold">Missions</h3>
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white flex items-center gap-1" onClick={() => {
                                        setEditingMission(null);
                                        setMissionForm({ title: '', client: '', date: '', status: 'En cours', stars: 0, imageFile: null, imagePreview: '' });
                                        setShowMissionModal(true);
                                    }}>
                                        <Plus size={14} /> Ajouter
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(profileState.missions || []).map((mission, idx) => (
                                        <div key={mission.id || idx} className="flex items-start bg-gray-50 p-3 rounded-lg relative">
                                            <img src={mission.image} alt={mission.client} className="w-12 h-12 rounded-lg object-cover" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="font-medium truncate">{mission.title}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${mission.status === "Terminé" ? "bg-green-100 text-green-800" : mission.status === "En cours" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                                                        {mission.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-1">{mission.client}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Calendar size={12} className="mr-1" />
                                                        {mission.date}
                                                    </div>
                                                    <div>
                                                        {renderStars(mission.stars)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <button className="p-1 rounded bg-white shadow" onClick={() => {
                                                    setEditingMission({ index: idx, mission });
                                                    setMissionForm({ title: mission.title, client: mission.client, date: mission.date, status: mission.status, stars: mission.stars, imageFile: null, imagePreview: '' });
                                                    setShowMissionModal(true);
                                                }}><Edit2 size={14} /></button>
                                                <button className="p-1 rounded bg-white shadow" onClick={() => setConfirmState({
                                                    open: true,
                                                    message: 'Supprimer cette mission ? Cette action est irréversible.',
                                                    onConfirm: () => setProfileState(ps => ({ ...ps, missions: ps.missions.filter((_, i) => i !== idx) }))
                                                })}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "competences" && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold">Expérience</h3>
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition-colors" onClick={() => {
                                        setEditingExperience(null);
                                        setExperienceForm({ position: '', company: '', period: '', description: '' });
                                        setShowExperienceModal(true);
                                    }}>
                                        <Plus size={14} /> Ajouter
                                    </button>
                                </div>
                                {profileLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    </div>
                                ) : experiences.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer !</p>
                                ) : (
                                    experiences.map((exp, idx) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200 pb-4 transition-all hover:border-blue-400 animate-fadeIn">
                                            <div className="absolute -left-1.5 top-0">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                            </div>
                                            <h3 className="font-medium">{exp.position}</h3>
                                            <p className="text-sm text-gray-600">{exp.company}</p>
                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                <Calendar size={12} className="mr-1" />
                                                {exp.period}
                                            </p>
                                            <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                                            <div className="absolute top-0 right-0 flex gap-1">
                                                <button className="p-1 rounded bg-white shadow hover:bg-gray-100 transition-colors" onClick={() => { 
                                                    setEditingExperience({ index: idx, exp }); 
                                                    setExperienceForm({ position: exp.position, company: exp.company, period: exp.period, description: exp.description }); 
                                                    setShowExperienceModal(true); 
                                                }}><Edit2 size={14} /></button>
                                                <button className="p-1 rounded bg-white shadow hover:bg-red-50 transition-colors" onClick={() => setConfirmState({
                                                    open: true,
                                                    message: "Supprimer cette expérience ? Cette action est irréversible.",
                                                    onConfirm: async () => {
                                                        try {
                                                            await deleteExperience(exp.id);
                                                        } catch (error) {
                                                            console.error('Erreur suppression:', error);
                                                        }
                                                    }
                                                })}><Trash2 size={14} className="text-red-600" /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "experience" && (
                            <div className="space-y-4">
                                {(freelancerData.experience || []).map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200 pb-4">
                                        <div className="absolute -left-1.5 top-0">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        </div>
                                        <h3 className="font-medium">{exp.position}</h3>
                                        <p className="text-sm text-gray-600">{exp.company}</p>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Calendar size={12} className="mr-1" />
                                            {exp.period}
                                        </p>
                                        <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                                    </div>
                                ))}
                                <button className="w-full mt-2 flex items-center justify-center text-blue-600 text-sm">
                                    <Edit2 size={14} className="mr-1" />
                                    Modifier l'expérience
                                </button>
                            </div>
                        )}

                        {activeTab === "education" && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold">Formation</h3>
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition-colors" onClick={() => { 
                                        setEditingEducation(null); 
                                        setEducationForm({ degree: '', school: '', period: '' }); 
                                        setShowEducationModal(true); 
                                    }}>
                                        <Plus size={14} /> Ajouter
                                    </button>
                                </div>
                                {profileLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    </div>
                                ) : educations.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer !</p>
                                ) : (
                                    educations.map((edu, idx) => (
                                        <div key={edu.id} className="relative pl-6 border-l-2 border-gray-200 pb-4 transition-all hover:border-purple-400 animate-fadeIn">
                                            <div className="absolute -left-1.5 top-0">
                                                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                                            </div>
                                            <h3 className="font-medium">{edu.libelle_formations}</h3>
                                            <p className="text-sm text-gray-600">{edu.categorie_formations}</p>
                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                <Calendar size={12} className="mr-1" />
                                                {edu.date_realisation_formations}
                                            </p>
                                            <div className="absolute top-0 right-0 flex gap-1">
                                                <button className="p-1 rounded bg-white shadow hover:bg-gray-100 transition-colors" onClick={() => { 
                                                    setEditingEducation({ index: idx, edu }); 
                                                    setEducationForm({ 
                                                        degree: edu.libelle_formations, 
                                                        school: edu.categorie_formations, 
                                                        period: edu.date_realisation_formations 
                                                    }); 
                                                    setShowEducationModal(true); 
                                                }}><Edit2 size={14} /></button>
                                                <button className="p-1 rounded bg-white shadow hover:bg-red-50 transition-colors" onClick={() => setConfirmState({
                                                    open: true,
                                                    message: "Supprimer cette formation ? Cette action est irréversible.",
                                                    onConfirm: async () => {
                                                        try {
                                                            await deleteEducation(edu.id);
                                                        } catch (error) {
                                                            console.error('Erreur suppression:', error);
                                                        }
                                                    }
                                                })}><Trash2 size={14} className="text-red-600" /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Modal Contacts */}
            {showContactsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Modifier les contacts</h3>
                            <button onClick={() => setShowContactsModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input type="email" className="mt-1 w-full border rounded-md p-2 text-sm" value={contactsState.email} onChange={(e) => setContactsState({ ...contactsState, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Téléphone 1</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contactsState.phones[0]} onChange={(e) => setContactsState({ ...contactsState, phones: [e.target.value, contactsState.phones[1]] })} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Téléphone 2</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contactsState.phones[1]} onChange={(e) => setContactsState({ ...contactsState, phones: [contactsState.phones[0], e.target.value] })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Site web</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contactsState.website} onChange={(e) => setContactsState({ ...contactsState, website: e.target.value })} />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowContactsModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100" disabled={uploading}>Annuler</button>
                            <button onClick={async () => {
                                setUploading(true);
                                try {
                                    await profileService.updateContacts({
                                        userId: user.id,
                                        email: contactsState.email,
                                        tel: contactsState.phones[0],
                                        whatsapp: contactsState.phones[1]
                                    });
                                    
                                    toast.success('Contacts mis à jour avec succès !', 'Succès');
                                    setShowContactsModal(false);
                                } catch (error) {
                                    console.error('Erreur:', error);
                                } finally {
                                    setUploading(false);
                                }
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Partage Profil */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-80 max-w-full overflow-hidden shadow-xl">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium">Partager</h3>
                            <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-4">
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2"><Linkedin className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">LinkedIn</span>
                                </button>
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-2"><MessageSquare className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">WhatsApp</span>
                                </button>
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-blue-800 text-white rounded-full flex items-center justify-center mb-2"><Facebook className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">Facebook</span>
                                </button>
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mb-2"><Instagram className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">Instagram</span>
                                </button>
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mb-2"><Mail className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">Email</span>
                                </button>
                                <button className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-2"><MessageCircle className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-600">SMS</span>
                                </button>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                                    <input type="text" value={`${window.location.origin}/Services profile`} readOnly className="bg-transparent text-sm flex-1 outline-none" />
                                    <button className="ml-2 text-blue-500" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/Services profile`)}>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Réseaux sociaux */}
            {showSocialsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Modifier les réseaux sociaux</h3>
                            <button onClick={() => setShowSocialsModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-sm text-gray-600">LinkedIn</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.linkedin} onChange={(e) => setSocialsState({ ...socialsState, linkedin: e.target.value })} placeholder="ex: nom-utilisateur ou URL" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Facebook</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.facebook} onChange={(e) => setSocialsState({ ...socialsState, facebook: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Instagram</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.instagram} onChange={(e) => setSocialsState({ ...socialsState, instagram: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">TikTok</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.tiktok} onChange={(e) => setSocialsState({ ...socialsState, tiktok: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">X (ex-Twitter)</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.x} onChange={(e) => setSocialsState({ ...socialsState, x: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">WhatsApp (numéro)</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={socialsState.whatsapp} onChange={(e) => setSocialsState({ ...socialsState, whatsapp: e.target.value })} placeholder="ex: +237600000000" />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowSocialsModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100">Annuler</button>
                            <button onClick={() => setShowSocialsModal(false)} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Profil (infos + photos) */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Modifier le profil</h3>
                            <button onClick={() => setShowProfileModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4">
                            <ProfileEditTabs profileForm={profileForm} setProfileForm={setProfileForm} profileState={profileState} />
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowProfileModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100" disabled={uploading}>Annuler</button>
                            <button onClick={async () => {
                                setUploading(true);
                                try {
                                    // Upload photo de couverture si changée
                                    if (profileForm.coverFile) {
                                        await updateCoverPhoto(profileForm.coverFile);
                                    }
                                    
                                    // Upload photo de profil si changée
                                    if (profileForm.profileFile) {
                                        await updateProfilePhoto(profileForm.profileFile);
                                    }

                                    // Mettre à jour les informations
                                    await profileService.updateUserInfo({
                                        userId: user.id,
                                        ville: profileForm.citiesText,
                                        pseudo: user.pseudo,
                                        description: profileForm.description,
                                        pays: user.pays_residence
                                    });

                                    // Mettre à jour l'état local
                                    setProfileState(ps => ({
                                        ...ps,
                                        role: profileForm.role,
                                        function: profileForm.function,
                                        description: profileForm.description,
                                        cities: profileForm.citiesText.split(',').map(s => s.trim()).filter(Boolean),
                                        minimumPrice: profileForm.minimumPrice,
                                        coverPhoto: profileForm.coverPreview || ps.coverPhoto,
                                        profilePhoto: profileForm.profilePreview || ps.profilePhoto,
                                    }));

                                    toast.success('Profil mis à jour avec succès !', 'Succès');
                                    setShowProfileModal(false);
                                } catch (error) {
                                    console.error('Erreur:', error);
                                } finally {
                                    setUploading(false);
                                }
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Détails Portfolio */}
            {showPortfolioDetails && portfolioDetailsItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img src={portfolioDetailsItem.thumbnail} alt={portfolioDetailsItem.title} className="w-full h-48 object-cover rounded-t-lg" />
                            <button onClick={() => setShowPortfolioDetails(false)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"><X size={20} /></button>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-bold">{portfolioDetailsItem.title}</h2>
                            <p className="text-gray-600 text-sm">{portfolioDetailsItem.client} · {portfolioDetailsItem.date}</p>
                            {Array.isArray(portfolioDetailsItem.tags) && portfolioDetailsItem.tags.length > 0 && (
                                <div className="my-3 flex flex-wrap gap-2">
                                    {portfolioDetailsItem.tags.map((tag, i) => (
                                        <span key={`${tag}-${i}`} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <p className="text-gray-700 my-4">{portfolioDetailsItem.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmation Suppression */}
            {confirmState.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Confirmer la suppression</h3>
                            <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setConfirmState({ open: false, message: '', onConfirm: null })}><X size={18} /></button>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-700">{confirmState.message || 'Voulez-vous vraiment supprimer cet élément ?'}</p>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button className="px-3 py-2 text-sm rounded-md bg-gray-100" onClick={() => setConfirmState({ open: false, message: '', onConfirm: null })}>Annuler</button>
                            <button className="px-3 py-2 text-sm rounded-md bg-red-600 text-white" onClick={() => { const cb = confirmState.onConfirm; setConfirmState({ open: false, message: '', onConfirm: null }); cb && cb(); }}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Portfolio */}
            {showPortfolioModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">{editingPortfolio ? 'Modifier le projet' : 'Ajouter un projet'}</h3>
                            <button onClick={() => setShowPortfolioModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Titre</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={portfolioForm.title} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Client</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={portfolioForm.client} onChange={(e) => setPortfolioForm({ ...portfolioForm, client: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Date</label>
                                    <input type="date" className="mt-1 w-full border rounded-md p-2 text-sm" value={portfolioForm.date} onChange={(e) => setPortfolioForm({ ...portfolioForm, date: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Description</label>
                                <textarea rows={3} className="mt-1 w-full border rounded-md p-2 text-sm" value={portfolioForm.description} onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Tags (séparés par des virgules)</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={portfolioForm.tags} onChange={(e) => setPortfolioForm({ ...portfolioForm, tags: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Image</label>
                                <div className="mt-1 border rounded-md p-2">
                                    {portfolioForm.imagePreview && (<img src={portfolioForm.imagePreview} alt="Aperçu" className="w-full h-32 object-cover rounded" />)}
                                    <div className="flex gap-2 mt-2">
                                        <input id="portfolioImg" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (file) {
                                                setPortfolioForm({ ...portfolioForm, imageFile: file, imagePreview: URL.createObjectURL(file) });
                                            }
                                        }} />
                                        <label htmlFor="portfolioImg" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><UploadCloud size={14} /> Choisir</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowPortfolioModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100" disabled={uploading}>Annuler</button>
                            <button onClick={async () => {
                                if (!portfolioForm.title) {
                                    toast.error('Le titre est requis', 'Champ manquant');
                                    return;
                                }

                                setUploading(true);
                                try {
                                    const portfolioData = {
                                        title: portfolioForm.title,
                                        client: portfolioForm.client,
                                        date: portfolioForm.date,
                                        description: portfolioForm.description,
                                        tags: portfolioForm.tags
                                    };

                                    if (editingPortfolio) {
                                        await updatePortfolio(editingPortfolio.item.id, portfolioData, portfolioForm.imageFile);
                                    } else {
                                        await createPortfolio(portfolioData, portfolioForm.imageFile);
                                    }
                                    
                                    setShowPortfolioModal(false);
                                    setPortfolioForm({ title: '', client: '', date: '', description: '', tags: '', imageFile: null, imagePreview: '' });
                                } catch (error) {
                                    console.error('Erreur:', error);
                                } finally {
                                    setUploading(false);
                                }
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Mission */}
            {showMissionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">{editingMission ? 'Modifier la mission' : 'Ajouter une mission'}</h3>
                            <button onClick={() => setShowMissionModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Titre</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={missionForm.title} onChange={(e) => setMissionForm({ ...missionForm, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Client</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={missionForm.client} onChange={(e) => setMissionForm({ ...missionForm, client: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Date</label>
                                    <input type="date" className="mt-1 w-full border rounded-md p-2 text-sm" value={missionForm.date} onChange={(e) => setMissionForm({ ...missionForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Statut</label>
                                    <select className="mt-1 w-full border rounded-md p-2 text-sm" value={missionForm.status} onChange={(e) => setMissionForm({ ...missionForm, status: e.target.value })}>
                                        <option>En cours</option>
                                        <option>Terminé</option>
                                        <option>Planifié</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Note (0-5)</label>
                                <input type="number" min="0" max="5" className="mt-1 w-full border rounded-md p-2 text-sm" value={missionForm.stars} onChange={(e) => setMissionForm({ ...missionForm, stars: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Image</label>
                                <div className="mt-1 border rounded-md p-2">
                                    {missionForm.imagePreview && (<img src={missionForm.imagePreview} alt="Aperçu" className="w-24 h-24 object-cover rounded" />)}
                                    <div className="flex gap-2 mt-2">
                                        <input id="missionImg" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (file) setMissionForm({ ...missionForm, imageFile: file, imagePreview: URL.createObjectURL(file) });
                                        }} />
                                        <label htmlFor="missionImg" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><UploadCloud size={14} /> Choisir</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowMissionModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100">Annuler</button>
                            <button onClick={() => {
                                const newMission = {
                                    id: editingMission?.mission?.id || Date.now(),
                                    title: missionForm.title,
                                    client: missionForm.client,
                                    date: missionForm.date,
                                    status: missionForm.status,
                                    stars: missionForm.stars,
                                    image: missionForm.imagePreview || editingMission?.mission?.image || '/api/placeholder/80/80',
                                };
                                setProfileState(ps => {
                                    const list = [...ps.missions];
                                    if (editingMission) list[editingMission.index] = newMission; else list.push(newMission);
                                    return { ...ps, missions: list };
                                });
                                setShowMissionModal(false);
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Experience */}
            {showExperienceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">{editingExperience ? "Modifier l'expérience" : "Ajouter une expérience"}</h3>
                            <button onClick={() => setShowExperienceModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Poste</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={experienceForm.position} onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Entreprise</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Période</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={experienceForm.period} onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Description</label>
                                <textarea rows={3} className="mt-1 w-full border rounded-md p-2 text-sm" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowExperienceModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100" disabled={uploading}>Annuler</button>
                            <button onClick={async () => {
                                if (!experienceForm.position || !experienceForm.company) {
                                    toast.error('Le poste et l\'entreprise sont requis', 'Champs manquants');
                                    return;
                                }

                                setUploading(true);
                                try {
                                    if (editingExperience) {
                                        await updateExperience(editingExperience.exp.id, experienceForm);
                                    } else {
                                        await createExperience(experienceForm);
                                    }
                                    
                                    setShowExperienceModal(false);
                                    setExperienceForm({ position: '', company: '', period: '', description: '' });
                                } catch (error) {
                                    console.error('Erreur:', error);
                                } finally {
                                    setUploading(false);
                                }
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Education */}
            {showEducationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">{editingEducation ? "Modifier la formation" : "Ajouter une formation"}</h3>
                            <button onClick={() => setShowEducationModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Diplôme</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">École</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Période</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={educationForm.period} onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })} />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowEducationModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100" disabled={uploading}>Annuler</button>
                            <button onClick={async () => {
                                if (!educationForm.degree || !educationForm.school) {
                                    toast.error('Le diplôme et l\'école sont requis', 'Champs manquants');
                                    return;
                                }

                                setUploading(true);
                                try {
                                    if (editingEducation) {
                                        await updateEducation(editingEducation.edu.id, educationForm);
                                    } else {
                                        await createEducation(educationForm);
                                    }
                                    
                                    setShowEducationModal(false);
                                    setEducationForm({ degree: '', school: '', period: '' });
                                } catch (error) {
                                    console.error('Erreur:', error);
                                } finally {
                                    setUploading(false);
                                }
                            }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}