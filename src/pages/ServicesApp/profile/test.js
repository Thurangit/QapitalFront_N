import React, { useState } from 'react';
import {
    Star,
    Briefcase,
    GraduationCap,
    MapPin,
    Mail,
    Phone,
    Globe,
    Share2,
    Edit,
    X,
    Award,
    Users,
    Handshake,
    Heart,
    Calendar,
    Clock,
    ChevronRight,
    MessageSquare,
    Check,
    ChevronLeft,
    ChevronDown
} from 'lucide-react';

export default function TestSocialFeed() {
    // État pour les onglets
    const [activeTab, setActiveTab] = useState('prestations');

    // État pour les modals
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingField, setEditingField] = useState(null);

    // Données de l'entreprise
    const profile = {
        name: 'Techinno Solutions',
        type: 'SARL',
        role: 'Développement web & mobile',
        description: "Spécialiste en développement d'applications sur mesure et solutions digitales innovantes pour votre entreprise.",
        foundation: '2018',
        rating: 4.8,
        missions: 47,
        minPrice: '800€',
        cities: ['Paris', 'Lyon', 'Bordeaux', 'Lille'],
        contacts: {
            email: 'contact@techinno.fr',
            phone: ['01 23 45 67 89', '06 12 34 56 78'],
            website: 'www.techinno-solutions.fr',
            social: {
                whatsapp: '+33612345678',
                facebook: 'techinnosolutions',
                instagram: 'techinno_fr',
                twitter: 'techinno_fr'
            }
        }
    };

    // Données des prestations
    const prestations = [
        {
            id: 1,
            title: 'Développement site web',
            image: '/api/placeholder/300/200',
            description: 'Création de sites web professionnels, responsive et optimisés pour le référencement.',
            price: 'À partir de 1200€',
            duration: '2-4 semaines',
            details: 'Notre service comprend l\'analyse des besoins, la conception graphique, le développement sur mesure, l\'intégration de contenu, et un accompagnement après-livraison. Nous utilisons les technologies les plus récentes pour garantir performance et sécurité.'
        },
        {
            id: 2,
            title: 'Application mobile',
            image: '/api/placeholder/300/200',
            description: 'Conception et développement d\'applications mobiles natives et hybrides.',
            price: 'À partir de 3500€',
            duration: '1-3 mois',
            details: 'Développement pour iOS et Android, interfaces utilisateur intuitives, intégration avec les APIs existantes, et publication sur les stores. Nos applications sont optimisées pour les performances et l\'expérience utilisateur.'
        },
        {
            id: 3,
            title: 'E-commerce',
            image: '/api/placeholder/300/200',
            description: 'Solutions e-commerce complètes avec gestion des produits et paiements sécurisés.',
            price: 'À partir de 2500€',
            duration: '1-2 mois',
            details: 'Intégration des méthodes de paiement, gestion des stocks, tableau de bord administrateur, et optimisation pour les conversions. Nos boutiques en ligne sont conçues pour maximiser vos ventes.'
        },
        {
            id: 4,
            title: 'Maintenance technique',
            image: '/api/placeholder/300/200',
            description: 'Services de maintenance et d\'amélioration continue de vos solutions digitales.',
            price: 'À partir de 800€/mois',
            duration: 'Contrat mensuel',
            details: 'Suivi technique régulier, corrections des bugs, mises à jour de sécurité, sauvegardes, et améliorations continues pour garantir la pérennité de vos solutions numériques.'
        }
    ];

    // Données des missions
    const missions = [
        {
            id: 1,
            client: 'Biotech Paris',
            title: 'Refonte site vitrine',
            description: 'Modernisation complète du site internet avec intégration d\'un blog et d\'une section actualités',
            date: '04/2025',
            image: '/api/placeholder/60/60',
            rating: 5,
            status: 'Terminé'
        },
        {
            id: 2,
            client: 'Rest\'O Mobile',
            title: 'Application de livraison',
            description: 'Création d\'une application mobile de commande et livraison pour une chaîne de restaurants',
            date: '02/2025',
            image: '/api/placeholder/60/60',
            rating: 4.7,
            status: 'Terminé'
        },
        {
            id: 3,
            client: 'FormaPro',
            title: 'Plateforme e-learning',
            description: 'Développement d\'une plateforme de formation en ligne avec système de cours et certification',
            date: '01/2025',
            image: '/api/placeholder/60/60',
            rating: 4.9,
            status: 'Terminé'
        },
        {
            id: 4,
            client: 'GreenCity',
            title: 'Application écologique',
            description: 'Application de sensibilisation et suivi d\'actions écologiques pour une municipalité',
            date: '12/2024',
            image: '/api/placeholder/60/60',
            rating: 4.8,
            status: 'Terminé'
        }
    ];

    // Données d'expérience
    const experiences = [
        {
            id: 1,
            period: '2018 - Présent',
            title: 'Techinno Solutions',
            role: 'Fondateur & Directeur technique',
            description: 'Création et développement de l\'agence, gestion des projets et relation clients.'
        },
        {
            id: 2,
            period: '2014 - 2018',
            title: 'Digiteo',
            role: 'Lead Developer',
            description: 'Responsable de l\'équipe de développement front-end et mobile.'
        },
        {
            id: 3,
            period: '2012 - 2014',
            title: 'WebStartup SAS',
            role: 'Développeur Full Stack',
            description: 'Développement d\'applications web et APIs pour divers clients.'
        }
    ];

    // Données de formation
    const education = [
        {
            id: 1,
            year: '2012',
            degree: 'Master en Informatique',
            school: 'École Supérieure d\'Ingénierie',
            location: 'Paris'
        },
        {
            id: 2,
            year: '2010',
            degree: 'Licence en Développement Web',
            school: 'Université Numérique',
            location: 'Lyon'
        },
        {
            id: 3,
            year: '2009',
            degree: 'DUT Informatique',
            school: 'Institut Universitaire de Technologie',
            location: 'Bordeaux'
        }
    ];

    // Données des clients
    const clients = [
        {
            id: 1,
            name: 'BioNova',
            logo: '/api/placeholder/120/80',
            industry: 'Biotechnologie',
            relation: 'Depuis 2020'
        },
        {
            id: 2,
            name: 'EcoTrans',
            logo: '/api/placeholder/120/80',
            industry: 'Transport écologique',
            relation: 'Depuis 2019'
        },
        {
            id: 3,
            name: 'FinNext',
            logo: '/api/placeholder/120/80',
            industry: 'Services financiers',
            relation: 'Depuis 2021'
        },
        {
            id: 4,
            name: 'MediaPulse',
            logo: '/api/placeholder/120/80',
            industry: 'Média & Communication',
            relation: 'Depuis 2022'
        }
    ];

    // Données des partenaires
    const partners = [
        {
            id: 1,
            name: 'TechCloud',
            logo: '/api/placeholder/120/80',
            domain: 'Infrastructure cloud',
            partnership: 'Partenaire certifié'
        },
        {
            id: 2,
            name: 'DesignStudio',
            logo: '/api/placeholder/120/80',
            domain: 'Design UX/UI',
            partnership: 'Collaboration exclusive'
        },
        {
            id: 3,
            name: 'SecurityShield',
            logo: '/api/placeholder/120/80',
            domain: 'Cybersécurité',
            partnership: 'Partenaire technologique'
        }
    ];

    // Données des sponsors
    const sponsors = [
        {
            id: 1,
            name: 'FrenchTech',
            logo: '/api/placeholder/120/80',
            program: 'Programme d\'accélération 2023'
        },
        {
            id: 2,
            name: 'Innovation Fund',
            logo: '/api/placeholder/120/80',
            program: 'Bourse d\'innovation technologique'
        }
    ];

    // Fonctions pour gérer les modals
    const openPrestaModal = (presta) => {
        setModalContent(presta);
        setShowModal(true);
    };

    const openEditModal = (field, value) => {
        setEditingField({ field, value });
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowEditModal(false);
    };

    // Affichage des étoiles
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600">{rating}</span>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Cover photo */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                <img
                    src="/api/placeholder/800/300"
                    alt="Couverture"
                    className="w-full h-full object-cover opacity-50"
                />
                <button onClick={() => openEditModal('cover', 'url-image')} className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                    <Edit size={16} className="text-gray-700" />
                </button>
            </div>

            {/* Profile section */}
            <div className="relative px-4 pt-0 -mt-16">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="relative rounded-lg overflow-hidden border-4 border-white shadow -mt-12 mb-2 sm:mb-0 sm:mr-4">
                                <img
                                    src="/api/placeholder/120/120"
                                    alt="Profile"
                                    className="w-24 h-24 object-cover"
                                />
                                <button onClick={() => openEditModal('photo', 'url-image')} className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                                    <Edit size={14} className="text-gray-700" />
                                </button>
                            </div>
                            <div>
                                <div className="flex items-start">
                                    <div>
                                        <div className="flex items-center">
                                            <h1 className="text-xl font-bold text-gray-800">{profile.name}</h1>
                                            <button onClick={() => openEditModal('name', profile.name)} className="ml-2 p-1">
                                                <Edit size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{profile.type}</span>
                                            <button onClick={() => openEditModal('type', profile.type)} className="ml-1 p-1">
                                                <Edit size={12} className="text-gray-400" />
                                            </button>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm font-medium text-indigo-600">{profile.role}</span>
                                            <button onClick={() => openEditModal('role', profile.role)} className="ml-2 p-1">
                                                <Edit size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
                                Contacter
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row justify-between">
                        <div className="flex-1 pr-0 sm:pr-4">
                            <div className="flex items-start mb-2">
                                <p className="text-sm text-gray-600 flex-1">{profile.description}</p>
                                <button onClick={() => openEditModal('description', profile.description)} className="ml-2 p-1 flex-shrink-0">
                                    <Edit size={14} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex items-center text-sm">
                                <Calendar size={16} className="mr-1 text-gray-500" />
                                <span className="text-gray-600">Fondée en {profile.foundation}</span>
                                <button onClick={() => openEditModal('foundation', profile.foundation)} className="ml-2 p-1">
                                    <Edit size={12} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-start mt-3">
                                <div className="flex items-center mr-4 mb-2">
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="text-sm font-medium">{profile.rating}</span>
                                </div>
                                <div className="flex items-center mr-4 mb-2">
                                    <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                                    <span className="text-sm">{profile.missions} missions</span>
                                </div>
                                <div className="flex items-center mr-4 mb-2">
                                    <Award className="h-4 w-4 text-indigo-500 mr-1" />
                                    <span className="text-sm">À partir de {profile.minPrice}</span>
                                    <button onClick={() => openEditModal('minPrice', profile.minPrice)} className="ml-1 p-1">
                                        <Edit size={12} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Villes */}
                    <div className="mt-4">
                        <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-700 mr-2">Zones d'intervention</h3>
                            <button onClick={() => openEditModal('cities', profile.cities)} className="p-1">
                                <Edit size={12} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex flex-wrap mt-1">
                            {profile.cities.map((city, index) => (
                                <span key={index} className="bg-gray-100 text-xs rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
                                    <MapPin size={12} className="mr-1 text-gray-500" /> {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact section */}
            <div className="px-4 mt-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-medium text-gray-800">Contact</h2>
                        <button className="text-sm text-indigo-600" onClick={() => openEditModal('contacts', 'multiple')}>
                            <Edit size={14} className="inline mr-1" /> Modifier
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-y-3">
                        <div className="flex items-center">
                            <Mail size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 truncate">{profile.contacts.email}</span>
                        </div>

                        {profile.contacts.phone.map((phone, index) => (
                            <div key={index} className="flex items-center">
                                <Phone size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-600">{phone}</span>
                            </div>
                        ))}

                        <div className="flex items-center">
                            <Globe size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{profile.contacts.website}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <div className="flex space-x-3">
                            <button className="bg-green-500 text-white p-2 rounded-full">
                                <MessageSquare size={18} />
                            </button>
                            <button className="bg-blue-600 text-white p-2 rounded-full">
                                <span className="font-bold text-sm">f</span>
                            </button>
                            <button className="bg-pink-600 text-white p-2 rounded-full">
                                <span className="font-bold text-sm">in</span>
                            </button>
                            <button className="bg-blue-400 text-white p-2 rounded-full">
                                <span className="font-bold text-sm">t</span>
                            </button>
                        </div>

                        <button className="bg-indigo-100 text-indigo-600 flex items-center px-3 py-1 rounded-lg text-sm">
                            <Share2 size={16} className="mr-1" />
                            Partager
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation tabs */}
            <div className="px-4 mt-4">
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <div className="flex whitespace-nowrap">
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'prestations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('prestations')}
                        >
                            Prestations
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'missions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('missions')}
                        >
                            Missions
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'experience' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('experience')}
                        >
                            Expérience
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'education' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('education')}
                        >
                            Formation
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'clients' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('clients')}
                        >
                            Clients
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'partners' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('partners')}
                        >
                            Partenaires
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'sponsors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('sponsors')}
                        >
                            Sponsors
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <div className="px-4 mt-4">
                {/* Prestations Tab */}
                {activeTab === 'prestations' && (
                    <div className="grid grid-cols-2 gap-3">
                        {prestations.map((presta) => (
                            <div
                                key={presta.id}
                                className="bg-white rounded-xl shadow overflow-hidden"
                                onClick={() => openPrestaModal(presta)}
                            >
                                <img
                                    src={presta.image}
                                    alt={presta.title}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-medium text-sm mb-1 truncate">{presta.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{presta.description}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-indigo-600">{presta.price}</span>
                                        <span className="text-xs text-gray-500 flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            {presta.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Missions Tab */}
                {activeTab === 'missions' && (
                    <div className="bg-white rounded-lg shadow divide-y">
                        {missions.map((mission) => (
                            <div key={mission.id} className="p-4">
                                <div className="flex items-start">
                                    <img src={mission.image} alt={mission.client} className="w-12 h-12 rounded-lg object-cover mr-3" />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{mission.title}</h3>
                                                <p className="text-sm text-gray-500">{mission.client}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-medium text-gray-500">{mission.date}</span>
                                                <div className="mt-1">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${mission.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                                                        mission.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {mission.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{mission.description}</p>
                                        <div className="mt-2">{renderStars(mission.rating)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className={`mb-6 ${index === experiences.length - 1 ? 'mb-0' : ''}`}>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 absolute -ml-5"></div>
                                            <span className="text-xs font-medium text-gray-500">{exp.period}</span>
                                        </div>
                                        <h3 className="font-medium text-gray-800 mt-1">{exp.title}</h3>
                                        <p className="text-sm text-indigo-600">{exp.role}</p>
                                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="border-l-2 border-indigo-500 pl-4">
                                {education.map((edu, index) => (
                                    <div key={edu.id} className={`mb-6 ${index === education.length - 1 ? 'mb-0' : ''}`}>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 absolute -ml-5"></div>
                                            <span className="text-xs font-medium text-gray-500">{edu.year}</span>
                                        </div>
                                        <h3 className="font-medium text-gray-800 mt-1">{edu.degree}</h3>
                                        <p className="text-sm text-gray-700">{edu.school}</p>
                                        <p className="text-xs text-gray-500 mt-1">{edu.location}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Clients Tab */}
                {activeTab === 'clients' && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {clients.map((client) => (
                                <div key={client.id} className="border rounded-lg p-3 flex flex-col items-center">
                                    <img src={client.logo} alt={client.name} className="h-12 object-contain mb-2" />
                                    <h3 className="font-medium text-sm text-center">{client.name}</h3>
                                    <p className="text-xs text-gray-500 text-center">{client.industry}</p>
                                    <p className="text-xs text-indigo-600 mt-1">{client.relation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Partners Tab */}
                {activeTab === 'partners' && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {partners.map((partner) => (
                                <div key={partner.id} className="border rounded-lg p-3 flex flex-col items-center">
                                    <img src={partner.logo} alt={partner.name} className="h-12 object-contain mb-2" />
                                    <h3 className="font-medium text-sm text-center">{partner.name}</h3>
                                    <p className="text-xs text-gray-500 text-center">{partner.domain}</p>
                                    <p className="text-xs text-indigo-600 mt-1">{partner.partnership}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sponsors Tab */}
                {activeTab === 'sponsors' && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="border rounded-lg p-3 flex flex-col items-center">
                                    <img src={sponsor.logo} alt={sponsor.name} className="h-12 object-contain mb-2" />
                                    <h3 className="font-medium text-sm text-center">{sponsor.name}</h3>
                                    <p className="text-xs text-indigo-600 mt-1">{sponsor.program}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Prestation Modal */}
            {showModal && modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={modalContent.image}
                                alt={modalContent.title}
                                className="w-full h-48 object-cover"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                            >
                                <X size={16} className="text-gray-700" />
                            </button>
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-bold text-gray-800">{modalContent.title}</h2>

                            <div className="flex items-center justify-between mt-2">
                                <span className="font-medium text-indigo-600">{modalContent.price}</span>
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {modalContent.duration}
                                </span>
                            </div>

                            <p className="mt-4 text-gray-600">{modalContent.details}</p>

                            <div className="mt-6 flex justify-between">
                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm" onClick={closeModal}>
                                    Fermer
                                </button>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                                    Demander un devis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingField && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Modifier {editingField.field}</h3>
                                <button onClick={closeModal}>
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {editingField.field === 'cities' ? (
                                <div className="space-y-2">
                                    {profile.cities.map((city, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="text"
                                                defaultValue={city}
                                                className="flex-1 border rounded-lg p-2 text-sm"
                                            />
                                            <button className="ml-2 text-red-500 p-1">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button className="mt-2 text-sm text-indigo-600 flex items-center">
                                        <span className="mr-1">+</span> Ajouter une ville
                                    </button>
                                </div>
                            ) : editingField.field === 'contacts' ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={profile.contacts.email}
                                            className="w-full border rounded-lg p-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-sm text-gray-600">Téléphone</label>
                                            <button className="text-xs text-indigo-600">+ Ajouter</button>
                                        </div>
                                        {profile.contacts.phone.map((phone, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <input
                                                    type="tel"
                                                    defaultValue={phone}
                                                    className="flex-1 border rounded-lg p-2 text-sm"
                                                />
                                                <button className="ml-2 text-red-500 p-1">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Site web</label>
                                        <input
                                            type="url"
                                            defaultValue={profile.contacts.website}
                                            className="w-full border rounded-lg p-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Réseaux sociaux</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Facebook"
                                                    defaultValue={profile.contacts.social.facebook}
                                                    className="w-full border rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Instagram"
                                                    defaultValue={profile.contacts.social.instagram}
                                                    className="w-full border rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Twitter"
                                                    defaultValue={profile.contacts.social.twitter}
                                                    className="w-full border rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="WhatsApp"
                                                    defaultValue={profile.contacts.social.whatsapp}
                                                    className="w-full border rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type={
                                        editingField.field === 'photo' || editingField.field === 'cover'
                                            ? 'file'
                                            : editingField.field === 'minPrice' || editingField.field === 'foundation'
                                                ? 'text'
                                                : 'text'
                                    }
                                    defaultValue={
                                        editingField.field === 'photo' || editingField.field === 'cover'
                                            ? ''
                                            : editingField.value
                                    }
                                    className="w-full border rounded-lg p-2"
                                    placeholder={`Modifier ${editingField.field}`}
                                />
                            )}

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm text-gray-600 border rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg">
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>)
}
