import { useState, useEffect, useRef } from "react";
import {
    Camera,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Users,
    Building,
    User,
    UploadCloud,
    Check,
    X,
    Edit2,
    Link as LinkIcon,
    ExternalLink
} from "lucide-react";
import { useNavigate } from 'react-router';
import axios from "axios";
import { urlApi } from "../../../modules/urlApp";
import { toast } from "../../../modules/Components/Toast";
import AuthUser from "../../../modules/AuthUser";

// Liste des métiers disponibles (exemples)
const metiers = [
    "Plombier", "Électricien", "Menuisier", "Peintre", "Maçon",
];

// Liste complète des villes du Cameroun (triée alphabétiquement)
const villesCameroun = [
    "Abong-Mbang", "Akonolinga", "Akwaya", "Alou", "Awaé", "Ayos", "Bafoussam", "Bafia", "Bafut", "Bali",
    "Bamenda", "Bamougoum", "Bandjoun", "Bangangté", "Bamusso", "Banyo", "Baré-Bakem", "Batibo", "Batouri", "Bazou",
    "Bélel", "Bekondo", "Bélabo", "Bertoua", "Bibey", "Bikok", "Bipindi", "Bogo", "Bot-Makak", "Boyo", "Bui",
    "Buéa", "Buea", "Campo", "Dibang", "Dibombari", "Dimako", "Djohong", "Douala", "Doumé", "Dschang", "Dzeng",
    "Edéa", "Elig-Mfomo", "Ekondo-Titi", "Endom", "Eséka", "Eyumodjock", "Faro-et-Déo", "Figuil", "Fontem",
    "Foumban", "Foumbot", "Fundong", "Garoua", "Garoua-Boulaï", "Gashiga", "Golombe", "Guider", "Idenau",
    "Isanguele", "Kaélé", "Kobdombo", "Kolofata", "Konye", "Kousséri", "Koutaba", "Kribi", "Kumba", "Kurume",
    "Lagdo", "Limbe", "Lolodorf", "Lomié", "Londji", "Loum", "Makak", "Mamfe", "Manjo", "Maroua", "Matomb",
    "Mbalmayo", "Mbang", "Mbankomo", "Mbanga", "Mbe", "Mbengwi", "Mbouda", "Melong", "Mefou-et-Afamba",
    "Mefou-et-Akono", "Mfoundi", "Meiganga", "Menchum", "Mezam", "Mfou", "Mindourou", "Minta", "Mme-Bafumen",
    "Mokolo", "Mola", "Moloundou", "Momo", "Monatélé", "Mora", "Moulvoudaye", "Mundemba", "Mvengue", "Nanga-Eboko",
    "Ndelele", "Ndjolé", "Ndu", "Ngaoundal", "Ngaoundéré", "Ngog-Mapubi", "Ngomedzap", "Ngon", "Ngoketunjia",
    "Nguti", "Nguibassal", "Njinikom", "Nkongsamba", "Nuelemendouka", "Nyambaka", "Nyong-et-Kéllé", "Nyong-et-Mfoumou",
    "Nyong-et-So'o", "Obala", "Okola", "Olanguina", "Ombesa", "Penja", "Poli", "Pouma", "Pouss", "Rey-Bouba",
    "Sa'a", "Tcholliré", "Tibati", "Tignère", "Tiko", "Tombel", "Touboro", "Tubah", "Touroua", "Vallée-du-Ntem",
    "Vina", "Wabane", "Wum", "Yabassi", "Yaoundé", "Yagoua", "Yokadouma"
].sort(); // Tri alphabétique automatique

export default function AddPostService() {
    // États pour le formulaire multi-étapes
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();
    const { getGeo } = AuthUser();

    const formatCoord = (value, decimals = 4) => {
        const num = Number(value);
        return Number.isFinite(num) ? num.toFixed(decimals) : "";
    };

    // Étapes du formulaire
    const stepLabels = [
        "Informations",
        "Localisation",
        "Détails",
        "Résumé"
    ];

    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        titre: "",
        details: "",
        lien: "",
        image: null,
        imagePreview: null,
        locationType: "auto", // 'auto' ou 'manual'
        ville: "",
        quartier: "",
        precision: "",
        coordonnees: { lat: null, lng: null },
        pays: "Cameroun", // Défini par défaut
        region: "Cameroun", // Défini par défaut
        montant: "",
        deviseMonnaie: "XAF",
        metierSelectionnes: [],
        nbPrestataires: 1,
        typeDemandeur: "tous", // 'tous', 'personne' ou 'entreprise'
        typeDuree: "ponctuelle", // 'ponctuelle', 'determinee', 'indeterminee'
        dureeMois: 1,
        dureeUnite: "mois" // 'jours', 'semaines', 'mois', 'annees'
    });

    // Géolocalisation automatique avec API gratuite
    // Pré-remplissage depuis le backend (ip -> ipapi.co via /api/geolocation)
    useEffect(() => {
        const geo = getGeo && getGeo();
        if (geo) {
            setFormData(prev => ({
                ...prev,
                ville: prev.ville || geo.city || prev.ville,
                pays: prev.pays || geo.country || prev.pays,
                region: prev.region || geo.region || prev.region,
                coordonnees: {
                    lat: geo.latitude != null ? Number(geo.latitude) : prev.coordonnees.lat,
                    lng: geo.longitude != null ? Number(geo.longitude) : prev.coordonnees.lng
                },
                // On bascule en manuel si on a déjà des infos IP pour éviter la demande navigateur
                locationType: prev.locationType === 'auto' ? 'manual' : prev.locationType
            }));
        }
    }, [getGeo]);

    // Géolocalisation navigateur (fallback si pas de données backend)
    useEffect(() => {
        if (formData.locationType === "auto") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;

                            // Utilisation de l'API gratuite Nominatim (OpenStreetMap)
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=fr`
                            );

                            if (response.ok) {
                                const data = await response.json();
                                const address = data.address || {};

                                setFormData(prev => ({
                                    ...prev,
                                    coordonnees: { lat: Number(latitude), lng: Number(longitude) },
                                    ville: address.city || address.town || address.village || address.municipality || "Ville non détectée",
                                    quartier: address.suburb || address.quarter || address.neighbourhood || address.district || "Quartier non détecté",
                                    pays: "Cameroun", // Toujours Cameroun
                                    region: "Cameroun" // Toujours Cameroun
                                }));

                                toast.success(
                                    `Position détectée : ${address.city || address.town || "Ville"} - ${address.country || "Pays"}`,
                                    "Géolocalisation réussie"
                                );
                            } else {
                                // Fallback si l'API échoue
                                setFormData(prev => ({
                                    ...prev,
                                    coordonnees: { lat: Number(latitude), lng: Number(longitude) },
                                    ville: "Position détectée",
                                    quartier: "Coordonnées: " + formatCoord(latitude) + ", " + formatCoord(longitude),
                                    pays: "Cameroun",
                                    region: "Cameroun"
                                }));
                            }
                        } catch (error) {
                            console.error("Erreur lors de la récupération de l'adresse:", error);
                            // Fallback en cas d'erreur
                            setFormData(prev => ({
                                ...prev,
                                coordonnees: {
                                    lat: Number(position.coords.latitude),
                                    lng: Number(position.coords.longitude)
                                },
                                ville: "Position détectée",
                                quartier: "Coordonnées: " + formatCoord(position.coords.latitude) + ", " + formatCoord(position.coords.longitude),
                                pays: "Cameroun",
                                region: "Cameroun"
                            }));
                        }
                    },
                    (error) => {
                        console.error("Erreur de géolocalisation:", error);
                        toast.warning(
                            "Impossible d'accéder à votre position. Veuillez utiliser la saisie manuelle.",
                            "Géolocalisation indisponible"
                        );
                        // Basculer automatiquement vers la saisie manuelle
                        setFormData(prev => ({ ...prev, locationType: "manual" }));
                    }
                );
            } else {
                toast.warning(
                    "La géolocalisation n'est pas supportée par votre navigateur. Veuillez utiliser la saisie manuelle.",
                    "Fonctionnalité non supportée"
                );
                // Basculer automatiquement vers la saisie manuelle
                setFormData(prev => ({ ...prev, locationType: "manual" }));
            }
        }
    }, [formData.locationType]);

    // Gestionnaires d'événements
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMetierChange = (metier) => {
        setFormData({
            ...formData,
            metierSelectionnes: formData.metierSelectionnes.includes(metier)
                ? formData.metierSelectionnes.filter(m => m !== metier)
                : [...formData.metierSelectionnes, metier]
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Créer un objet FormData pour envoyer les fichiers
            const formDataToSend = new FormData();

            // Ajouter tous les champs texte
            formDataToSend.append('titre', formData.titre);
            formDataToSend.append('details', formData.details);
            formDataToSend.append('lien', formData.lien ? `http://${formData.lien}` : '');
            formDataToSend.append('ville', formData.ville);
            formDataToSend.append('quartier', formData.quartier);
            formDataToSend.append('precision', formData.precision || '');
            formDataToSend.append('pays', formData.pays || '');
            formDataToSend.append('region', formData.region || '');
            formDataToSend.append('montant', formData.montant || '');
            formDataToSend.append('deviseMonnaie', formData.deviseMonnaie);
            formDataToSend.append('typeDuree', formData.typeDuree);
            formDataToSend.append('nbPrestataires', formData.nbPrestataires);
            formDataToSend.append('dureeMois', formData.dureeMois);
            formDataToSend.append('dureeUnite', formData.dureeUnite);
            formDataToSend.append('typeDemandeur', formData.typeDemandeur);

            // Ajouter les coordonnées GPS si disponibles
            if (formData.coordonnees.lat && formData.coordonnees.lng) {
                formDataToSend.append('latitude', formData.coordonnees.lat);
                formDataToSend.append('longitude', formData.coordonnees.lng);
            }

            // Ajouter les métiers sélectionnés
            formData.metierSelectionnes.forEach((metier, index) => {
                formDataToSend.append(`metierSelectionnes[${index}]`, metier);
            });

            // Ajouter l'image si elle existe
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            console.log("Données à envoyer:", formData);

            const response = await axios.post(`${urlApi}/service/add`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Réponse du serveur:", response.data);
            toast.success(
                "Votre offre a été publiée avec succès !",
                "Publication réussie"
            );
            setTimeout(() => {
                navigate('/Services Feed');
            }, 1500);

        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue s'est produite";
            toast.error(
                `Erreur lors de la création de la publication : ${errorMessage}`,
                "Échec de la publication"
            );
        } finally {
            setLoading(false);
        }
    };

    // Navigation entre les étapes
    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const goToStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            setStep(stepNumber);
        }
    };

    // Filtrage des métiers basé sur la recherche
    const [searchMetier, setSearchMetier] = useState("");
    const filteredMetiers = metiers.filter(metier =>
        metier.toLowerCase().includes(searchMetier.toLowerCase())
    );

    // Filtrage des villes basé sur la recherche
    const [searchVille, setSearchVille] = useState("");
    const [showVilleDropdown, setShowVilleDropdown] = useState(false);
    const [selectedVille, setSelectedVille] = useState("");

    const filteredVilles = villesCameroun.filter(ville =>
        ville.toLowerCase().includes(searchVille.toLowerCase())
    );

    // Initialiser la ville sélectionnée si elle existe déjà
    useEffect(() => {
        if (formData.ville && villesCameroun.includes(formData.ville)) {
            setSelectedVille(formData.ville);
        }
    }, [formData.ville]);

    // Rendu des étapes du formulaire
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre de l'offre *</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Recherche plombier pour réparation urgente"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Détails de l'offre *</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Décrivez précisément votre besoin..."
                                rows={5}
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium mb-1">
                                <LinkIcon size={16} className="mr-1 text-blue-500" />
                                Lien (facultatif)
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    http://
                                </span>
                                <input
                                    type="text"
                                    name="lien"
                                    value={formData.lien}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        // Supprimer http:// ou https:// si l'utilisateur essaie de les taper
                                        value = value.replace(/^https?:\/\//, '');
                                        setFormData({ ...formData, lien: value });
                                    }}
                                    className="flex-1 p-3 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="www.exemple.com"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Ajoutez un lien vers des informations complémentaires
                            </p>
                        </div>
                        <div className="space-y-4 mt-4">
                            <label className="block text-sm font-medium mb-1">Image</label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                                {formData.imagePreview ? (
                                    <div className="relative w-full">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Aperçu"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={48} className="text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500 mb-4">Téléversez une image ou prenez une photo</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                <UploadCloud size={18} />
                                                Téléverser
                                            </button>
                                            <button
                                                onClick={() => cameraInputRef.current.click()}
                                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                <Camera size={18} />
                                                Prendre une photo
                                            </button>
                                        </div>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleCameraCapture}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="locAuto"
                                        name="locationType"
                                        value="auto"
                                        checked={formData.locationType === "auto"}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="locAuto" className="ml-2 text-sm font-medium">
                                        Ma position actuelle
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="locManual"
                                        name="locationType"
                                        value="manual"
                                        checked={formData.locationType === "manual"}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="locManual" className="ml-2 text-sm font-medium">
                                        Saisie manuelle
                                    </label>
                                </div>
                            </div>

                            {formData.locationType === "auto" ? (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin size={16} className="text-blue-500" />
                                            <span className="font-medium">Position détectée automatiquement</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Ville</label>
                                                <p className="font-medium text-sm">{formData.ville || "En attente..."}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Quartier</label>
                                                <p className="font-medium text-sm">{formData.quartier || "En attente..."}</p>
                                            </div>
                                            {Number.isFinite(Number(formData.coordonnees.lat)) && Number.isFinite(Number(formData.coordonnees.lng)) && (
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Coordonnées GPS</label>
                                                    <p className="font-mono text-xs text-gray-600">
                                                        {formatCoord(formData.coordonnees.lat, 6)}, {formatCoord(formData.coordonnees.lng, 6)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Plus de précisions sur l'emplacement *
                                        </label>
                                        <textarea
                                            name="precision"
                                            value={formData.precision}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ajoutez des détails spécifiques sur l'emplacement exact (adresse complète, points de repère, instructions d'accès...)"
                                            rows={4}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Cette information sera visible par les prestataires pour mieux localiser votre besoin
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ville *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={selectedVille || searchVille}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSearchVille(value);
                                                    setSelectedVille("");
                                                    setShowVilleDropdown(true);

                                                    // Si la ville correspond exactement à une ville de la liste
                                                    const exactMatch = villesCameroun.find(ville =>
                                                        ville.toLowerCase() === value.toLowerCase()
                                                    );
                                                    if (exactMatch) {
                                                        setFormData({ ...formData, ville: exactMatch });
                                                    } else {
                                                        setFormData({ ...formData, ville: value });
                                                    }
                                                }}
                                                onFocus={() => setShowVilleDropdown(true)}
                                                onBlur={() => {
                                                    // Délai pour permettre le clic sur une option
                                                    setTimeout(() => setShowVilleDropdown(false), 200);
                                                }}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Tapez le nom de votre ville..."
                                                required
                                                autoComplete="off"
                                            />

                                            {/* Icône de recherche */}
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>

                                            {/* Dropdown des villes */}
                                            {showVilleDropdown && searchVille && filteredVilles.length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg border-gray-200">
                                                    {filteredVilles.slice(0, 10).map((ville) => (
                                                        <div
                                                            key={ville}
                                                            onClick={() => {
                                                                setSelectedVille(ville);
                                                                setSearchVille("");
                                                                setShowVilleDropdown(false);
                                                                setFormData({ ...formData, ville: ville });
                                                            }}
                                                            className={`p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${selectedVille === ville ? 'bg-blue-100' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-900">{ville}</span>
                                                                {searchVille.toLowerCase() === ville.toLowerCase() && (
                                                                    <span className="text-xs text-green-600 font-medium">✓</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {filteredVilles.length > 10 && (
                                                        <div className="p-2 text-xs text-gray-500 text-center border-t border-gray-100">
                                                            {filteredVilles.length - 10} autres villes disponibles...
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Message si aucune ville trouvée */}
                                            {showVilleDropdown && searchVille && filteredVilles.length === 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg border-gray-200">
                                                    <div className="p-3 text-sm text-gray-500 text-center">
                                                        Aucune ville trouvée pour "{searchVille}"
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Commencez à taper le nom de votre ville pour la trouver rapidement
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quartier *</label>
                                        <input
                                            type="text"
                                            name="quartier"
                                            value={formData.quartier}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ex: Bonamoussadi"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Plus de précisions sur l'emplacement *</label>
                                        <textarea
                                            name="precision"
                                            value={formData.precision}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ajoutez des détails spécifiques sur l'emplacement exact (adresse complète, points de repère, instructions d'accès...)"
                                            rows={4}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Cette information sera visible par les prestataires pour mieux localiser votre besoin
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Détails de la prestation</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Montant estimé (facultatif)</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    name="montant"
                                    value={formData.montant}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border-y border-l rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: 25000"
                                />
                                <select
                                    name="deviseMonnaie"
                                    value={formData.deviseMonnaie}
                                    onChange={handleInputChange}
                                    className="p-3 border-y border-r rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="XAF">XAF</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Si non renseigné, le montant sera "À négocier"
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type de durée (facultatif)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: "ponctuelle" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDuree === "ponctuelle"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <Clock size={20} className="mb-1" />
                                    <span className="text-xs">Ponctuelle</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: "determinee" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDuree === "determinee"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <Clock size={20} className="mb-1" />
                                    <span className="text-xs">Déterminée</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: "indeterminee" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDuree === "indeterminee"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <Clock size={20} className="mb-1" />
                                    <span className="text-xs">Indéterminée</span>
                                </button>
                            </div>

                            {formData.typeDuree === "determinee" && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium mb-1">Durée estimée</label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="dureeMois"
                                            value={formData.dureeMois}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="60"
                                            className="w-full p-3 border-y border-l rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <select
                                            name="dureeUnite"
                                            value={formData.dureeUnite}
                                            onChange={handleInputChange}
                                            className="p-3 border-y border-r rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="jours">Jours</option>
                                            <option value="semaines">Semaines</option>
                                            <option value="mois">Mois</option>
                                            <option value="annees">Années</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Corps de métier (facultatif)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchMetier}
                                    onChange={(e) => setSearchMetier(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Rechercher un métier..."
                                />
                                {searchMetier && (
                                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg">
                                        {filteredMetiers.map((metier) => (
                                            <div
                                                key={metier}
                                                onClick={() => {
                                                    handleMetierChange(metier);
                                                    setSearchMetier("");
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                            >
                                                <span>{metier}</span>
                                                {formData.metierSelectionnes.includes(metier) && (
                                                    <Check size={16} className="text-green-500" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.metierSelectionnes.map((metier) => (
                                    <span
                                        key={metier}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {metier}
                                        <button
                                            onClick={() => handleMetierChange(metier)}
                                            className="text-blue-800 hover:text-blue-900"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre de prestataires</label>
                            <input
                                type="number"
                                name="nbPrestataires"
                                value={formData.nbPrestataires}
                                onChange={handleInputChange}
                                min="1"
                                max="20"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type de prestataire</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDemandeur: "tous" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDemandeur === "tous"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <Users size={20} className="mb-1" />
                                    <span className="text-xs">Tous</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDemandeur: "personne" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDemandeur === "personne"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <User size={20} className="mb-1" />
                                    <span className="text-xs">Individu</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDemandeur: "entreprise" })}
                                    className={`p-2 border rounded-lg flex flex-col items-center justify-center ${formData.typeDemandeur === "entreprise"
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white"
                                        }`}
                                >
                                    <Building size={20} className="mb-1" />
                                    <span className="text-xs">Entreprise</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-center text-gray-800">
                            Aperçu de votre publication
                        </h3>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="mb-4 pb-2 border-b border-gray-200">
                                <h4 className="font-bold text-lg">{formData.titre || "Titre non spécifié"}</h4>
                                <p className="text-gray-600 mt-1">{formData.details || "Détails non spécifiés"}</p>
                            </div>

                            {formData.imagePreview && (
                                <div className="mb-4">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Image de l'offre"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mb-4 pb-2 border-b border-gray-200">
                                <div className="flex items-start gap-2">
                                    <MapPin size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-medium mb-2">Localisation:</p>
                                        <div className="space-y-1 text-sm">
                                            {formData.ville && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ville:</span>
                                                    <span className="font-medium">{formData.ville}</span>
                                                </div>
                                            )}
                                            {formData.quartier && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Quartier:</span>
                                                    <span className="font-medium">{formData.quartier}</span>
                                                </div>
                                            )}
                                            {Number.isFinite(Number(formData.coordonnees.lat)) && Number.isFinite(Number(formData.coordonnees.lng)) && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">GPS:</span>
                                                    <span className="font-mono text-xs text-gray-500">
                                                        {formatCoord(formData.coordonnees.lat)}, {formatCoord(formData.coordonnees.lng)}
                                                    </span>
                                                </div>
                                            )}
                                            {formData.precision && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <span className="text-gray-600 text-xs block mb-1">Précisions:</span>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                        {formData.precision}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Budget:</p>
                                    <p>{formData.montant ? `${formData.montant} ${formData.deviseMonnaie}` : "À négocier"}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Prestataires:</p>
                                    <p>{formData.nbPrestataires} {formData.typeDemandeur === 'tous' ? 'prestataire(s)' : formData.typeDemandeur === 'personne' ? 'individu(s)' : 'entreprise(s)'}</p>
                                </div>
                            </div>

                            {formData.metierSelectionnes.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-medium">Corps de métier:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {formData.metierSelectionnes.map((metier, index) => (
                                            <span key={index} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-sm">
                                                {metier}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="font-medium">Type de mission:</p>
                                <p>
                                    {formData.typeDuree === 'ponctuelle' ? 'Tâche ponctuelle' :
                                        formData.typeDuree === 'determinee' ? `Durée déterminée (${formData.dureeMois} ${formData.dureeUnite})` :
                                            'Durée indéterminée'}
                                </p>
                            </div>

                            {formData.lien && (
                                <div className="mb-4 pt-2 border-t border-gray-200">
                                    <a
                                        href={formData.lien}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <ExternalLink size={16} className="mr-1" />
                                        Consulter le lien
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-green-300 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Confirmer et publier
                                        <Check size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="w-full py-2 text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 mt-2"
                        >
                            <Edit2 size={16} />
                            Modifier depuis le début
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white overflow-hidden">
            {/* Header with progress bar */}
            <div className="bg-blue-600 p-4 text-white">
                <h1 className="text-xl font-bold">Créer une offre</h1>
                {/* <p className="text-sm text-blue-100">{stepLabels[step - 1]}</p> */}
                <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-white transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-end mt-1">
                    <div className="flex space-x-2">
                        {stepLabels.map((label, index) => (
                            <button
                                key={index}
                                onClick={() => goToStep(index + 1)}
                                className={`text-xs ${step === index + 1 ? 'text-white font-medium' : 'text-blue-200 hover:text-white'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form content */}
            <div className="p-4">
                <form onSubmit={(e) => e.preventDefault()}>
                    {renderStep()}

                    {/* Navigation buttons */}
                    <div className="mt-6 flex justify-between">
                        {step !== 4 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${step === 1
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                                    }`}
                                disabled={step === 1}
                            >
                                <ChevronLeft size={16} />
                                Précédent
                            </button>
                        )}

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1 hover:bg-blue-700"
                            >
                                Suivant
                                <ChevronRight size={16} />
                            </button>
                        ) : null}
                    </div>
                </form>
            </div>
        </div>
    );
}