import React, { useState } from 'react';
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
    Calendar,
    Award,
    Briefcase,
    GraduationCap,
    DollarSign,
    Languages,
    Facebook,
    Instagram,
    Twitter,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { StaticsImages } from '../../../modules/images';

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
    minimumPrice: "450€/jour",
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

export default function ProfileServiceApp() {
    const [activeTab, setActiveTab] = useState("portfolio");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [language, setLanguage] = useState("fr");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
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

    return (
        <div className="bg-gray-50 min-h-screen pb-6">
            {/* Photo de couverture */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <img
                    src={freelancerData.coverPhoto}
                    alt="Couverture"
                    className="w-full h-full object-cover opacity-60"
                />
                <button className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full">
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
                            <img
                                src={freelancerData.profilePhoto}
                                alt="Photo de profil"
                                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm"
                            />
                            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                                <Edit2 size={14} className="text-gray-700" />
                            </button>
                        </div>

                        <div className="ml-4 flex-1 pt-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-xl font-bold flex items-center">
                                        {freelancerData.firstName} {freelancerData.lastName}
                                        <button className="ml-2">
                                            <Edit2 size={14} className="text-gray-500" />
                                        </button>
                                    </h1>
                                    <p className="text-gray-600 flex items-center">
                                        {freelancerData.role}
                                        <button className="ml-2">
                                            <Edit2 size={14} className="text-gray-400" />
                                        </button>
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        {freelancerData.function}
                                        <button className="ml-2">
                                            <Edit2 size={14} className="text-gray-400" />
                                        </button>
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-2 bg-gray-100 rounded-full">
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
                            {freelancerData.description}
                        </p>
                        <button className="absolute top-0 right-0">
                            <Edit2 size={14} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {freelancerData.cities.map((city, index) => (
                            <div key={index} className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">
                                <MapPin size={12} className="mr-1" />
                                {city}
                            </div>
                        ))}
                        <button className="p-1 bg-gray-100 rounded-full">
                            <Edit2 size={12} className="text-gray-600" />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-green-600 font-medium">
                            <DollarSign size={16} className="mr-1" />
                            <span>{freelancerData.minimumPrice}</span>
                            <button className="ml-2">
                                <Edit2 size={14} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section contacts */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">
                        Contacts
                        <button className="p-1 bg-gray-100 rounded-full">
                            <Edit2 size={14} className="text-gray-600" />
                        </button>
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Mail size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{freelancerData.contacts.email}</span>
                        </div>

                        {freelancerData.contacts.phones.map((phone, index) => (
                            <div key={index} className="flex items-center">
                                <Phone size={16} className="text-gray-500 mr-3" />
                                <span className="text-sm">{phone}</span>
                            </div>
                        ))}

                        <div className="flex items-center">
                            <Globe size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{freelancerData.contacts.website}</span>
                        </div>

                        <div className="flex items-center">
                            <MessageCircle size={16} className="text-gray-500 mr-3" />
                            <span className="text-sm">{freelancerData.contacts.whatsappNumber}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-600">Partager sur</h3>
                        <div className="flex space-x-3">
                            <button className="text-blue-600">
                                <Facebook size={18} />
                            </button>
                            <button className="text-pink-600">
                                <Instagram size={18} />
                            </button>
                            <button className="text-blue-400">
                                <Twitter size={18} />
                            </button>
                            <button className="text-green-500">
                                <MessageCircle size={18} />
                            </button>
                            <button className="text-gray-600">
                                <Mail size={18} />
                            </button>
                            <button className="text-gray-600">
                                <MessageSquare size={18} />
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
                            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "experience" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => handleTabChange("experience")}
                        >
                            Expérience
                        </button>
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
                            <div className="grid grid-cols-2 gap-3">
                                {freelancerData.portfolio.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg overflow-hidden shadow-sm cursor-pointer"
                                        onClick={() => openModal(item)}
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-36 object-cover"
                                        />
                                        <div className="p-2 bg-white">
                                            <h3 className="text-sm font-medium truncate">{item.title}</h3>
                                            <p className="text-xs text-gray-500 truncate">{item.client}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "missions" && (
                            <div className="space-y-4">
                                {freelancerData.missions.map((mission) => (
                                    <div key={mission.id} className="flex items-start bg-gray-50 p-3 rounded-lg">
                                        <img
                                            src={mission.image}
                                            alt={mission.client}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium truncate">{mission.title}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${mission.status === "Terminé" ? "bg-green-100 text-green-800" :
                                                    mission.status === "En cours" ? "bg-blue-100 text-blue-800" :
                                                        "bg-gray-100 text-gray-800"
                                                    }`}>
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
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "experience" && (
                            <div className="space-y-4">
                                {freelancerData.experience.map((exp) => (
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
                                {freelancerData.education.map((edu) => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-gray-200 pb-4">
                                        <div className="absolute -left-1.5 top-0">
                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        </div>
                                        <h3 className="font-medium">{edu.degree}</h3>
                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Calendar size={12} className="mr-1" />
                                            {edu.period}
                                        </p>
                                    </div>
                                ))}
                                <button className="w-full mt-2 flex items-center justify-center text-blue-600 text-sm">
                                    <Edit2 size={14} className="mr-1" />
                                    Modifier la formation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal pour les détails */}
            {modalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={selectedItem.thumbnail}
                                alt={selectedItem.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-bold">{selectedItem.title}</h2>
                            <p className="text-gray-600 text-sm">{selectedItem.client} · {selectedItem.date}</p>

                            <div className="my-3 flex flex-wrap gap-2">
                                {selectedItem.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-700 my-4">{selectedItem.description}</p>

                            <div className="flex justify-between items-center mt-4">
                                <button className="text-gray-500 flex items-center">
                                    <ChevronLeft size={20} className="mr-1" />
                                    Précédent
                                </button>
                                <button className="text-gray-500 flex items-center">
                                    Suivant
                                    <ChevronRight size={20} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}