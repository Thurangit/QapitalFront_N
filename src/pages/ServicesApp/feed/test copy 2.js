import { useState, useRef, useEffect } from 'react';
import {
    Camera,
    Image as ImageIcon,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Users,
    User,
    Briefcase,
    Clock,
    Calendar,
    Loader2
} from 'lucide-react';

export default function TestSocialFeed() {
    // Étapes du formulaire
    const steps = [
        "Détails de l'offre",
        "Média",
        "Localisation",
        "Informations supplémentaires",
        "Aperçu"
    ];

    // État pour suivre l'étape actuelle
    const [currentStep, setCurrentStep] = useState(0);

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        titre: '',
        details: '',
        image: null,
        imagePreview: null,
        localisationType: 'automatique',
        ville: '',
        quartier: '',
        coordonnees: null,
        montant: '',
        metiers: [],
        nombrePrestataires: 1,
        typeCible: 'tous',
        typeDuree: 'ponctuelle',
        dureeEstimee: '',
        isLoading: false
    });

    // Référence à l'entrée de fichier invisible
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Liste des métiers disponibles
    const metiersList = [
        'Plombier', 'Électricien', 'Cuisinier', 'Informaticien', 'Menuisier',
        'Chauffeur', 'Jardinier', 'Maçon', 'Peintre', 'Couturier',
        'Photographe', 'Designer', 'Traducteur', 'Rédacteur', 'Comptable'
    ];

    // État pour le filtre des métiers
    const [filteredMetiers, setFilteredMetiers] = useState([]);
    const [searchMetier, setSearchMetier] = useState('');

    // Effet pour filtrer les métiers
    useEffect(() => {
        if (searchMetier.trim() === '') {
            setFilteredMetiers([]);
        } else {
            const filtered = metiersList.filter(metier =>
                metier.toLowerCase().includes(searchMetier.toLowerCase()) &&
                !formData.metiers.includes(metier)
            );
            setFilteredMetiers(filtered);
        }
    }, [searchMetier, formData.metiers]);

    // Gérer la sélection de métier
    const handleAddMetier = (metier) => {
        setFormData({
            ...formData,
            metiers: [...formData.metiers, metier]
        });
        setSearchMetier('');
    };

    // Supprimer un métier
    const handleRemoveMetier = (metier) => {
        setFormData({
            ...formData,
            metiers: formData.metiers.filter(m => m !== metier)
        });
    };

    // Gérer le changement d'entrée
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Gérer le changement de type de localisation
    const handleLocalisationChange = (type) => {
        setFormData({
            ...formData,
            localisationType: type,
            // Réinitialiser les valeurs de localisation
            ...(type === 'automatique' ? { ville: '', quartier: '' } : { coordonnees: null })
        });

        // Si automatique, récupérer la position
        if (type === 'automatique') {
            getGeolocation();
        }
    };

    // Fonction pour récupérer la géolocalisation
    const getGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Simuler l'obtention de la ville et du quartier à partir des coordonnées
                    // Dans une application réelle, vous utiliseriez une API de géocodage inverse
                    setFormData({
                        ...formData,
                        coordonnees: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        ville: 'Douala', // Simulé
                        quartier: 'Akwa' // Simulé
                    });
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    alert("Impossible d'obtenir votre position. Veuillez saisir manuellement votre localisation.");
                    setFormData({
                        ...formData,
                        localisationType: 'manuelle'
                    });
                }
            );
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur");
            setFormData({
                ...formData,
                localisationType: 'manuelle'
            });
        }
    };

    // Gérer le téléchargement de l'image
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

    // Fonctions de navigation
    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    // Soumettre le formulaire
    const handleSubmit = () => {
        setFormData({ ...formData, isLoading: true });

        // Simule l'envoi du formulaire
        setTimeout(() => {
            // Pour l'exemple, nous affichons simplement les données dans la console
            const formDataToSubmit = { ...formData };
            delete formDataToSubmit.imagePreview; // Supprimer l'aperçu de l'image pour le JSON
            delete formDataToSubmit.isLoading; // Supprimer l'état de chargement

            console.log("Données du formulaire:", formDataToSubmit);

            // Réinitialiser le formulaire après la soumission
            setFormData({
                titre: '',
                details: '',
                image: null,
                imagePreview: null,
                localisationType: 'automatique',
                ville: '',
                quartier: '',
                coordonnees: null,
                montant: '',
                metiers: [],
                nombrePrestataires: 1,
                typeCible: 'tous',
                typeDuree: 'ponctuelle',
                dureeEstimee: '',
                isLoading: false
            });
            setCurrentStep(0);

            // Afficher un message de confirmation
            alert("Votre offre a été publiée avec succès!");
        }, 2000);
    };

    // Calculer le pourcentage de progression
    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    // Contenu de l'étape actuelle
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Détails de l'offre
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                                Titre de l'offre *
                            </label>
                            <input
                                type="text"
                                id="titre"
                                name="titre"
                                value={formData.titre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ex: Besoin d'un plombier pour réparation urgente"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                                Détails de l'offre *
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Décrivez votre besoin en détail..."
                                required
                            />
                        </div>
                    </div>
                );

            case 1: // Média
                return (
                    <div className="space-y-6">
                        <div className="flex justify-center items-center">
                            {formData.imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Aperçu"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-500">
                                    <ImageIcon size={48} />
                                    <p className="mt-2">Aucune image sélectionnée</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                <ImageIcon size={18} />
                                Galerie
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => cameraInputRef.current.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                <Camera size={18} />
                                Caméra
                            </button>
                            <input
                                type="file"
                                ref={cameraInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                            />
                        </div>
                    </div>
                );

            case 2: // Localisation
                return (
                    <div className="space-y-6">
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => handleLocalisationChange('automatique')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md flex-1 justify-center ${formData.localisationType === 'automatique' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <MapPin size={18} />
                                Ma position
                            </button>

                            <button
                                type="button"
                                onClick={() => handleLocalisationChange('manuelle')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md flex-1 justify-center ${formData.localisationType === 'manuelle' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <MapPin size={18} />
                                Manuel
                            </button>
                        </div>

                        {formData.localisationType === 'automatique' && (
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ville}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quartier
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.quartier}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

                        {formData.localisationType === 'manuelle' && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ville *
                                    </label>
                                    <input
                                        type="text"
                                        id="ville"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: Douala"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="quartier" className="block text-sm font-medium text-gray-700 mb-1">
                                        Quartier (facultatif)
                                    </label>
                                    <input
                                        type="text"
                                        id="quartier"
                                        name="quartier"
                                        value={formData.quartier}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: Akwa"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3: // Informations supplémentaires
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
                                Montant estimé (facultatif)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="montant"
                                    name="montant"
                                    value={formData.montant}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pl-8"
                                    placeholder="Ex: 50000"
                                />
                                <span className="absolute left-2 top-2 text-gray-500">XAF</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Laissez vide pour "À négocier"
                            </p>
                        </div>

                        <div>
                            <label htmlFor="metiers" className="block text-sm font-medium text-gray-700 mb-1">
                                Corps de métier (facultatif)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="metiers"
                                    value={searchMetier}
                                    onChange={(e) => setSearchMetier(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ex: Plombier"
                                />
                                {filteredMetiers.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-48 overflow-y-auto">
                                        {filteredMetiers.map((metier, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleAddMetier(metier)}
                                            >
                                                {metier}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.metiers.map((metier, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
                                    >
                                        {metier}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMetier(metier)}
                                            className="ml-1 text-indigo-500 hover:text-indigo-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="nombrePrestataires" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de prestataires souhaités
                            </label>
                            <input
                                type="number"
                                id="nombrePrestataires"
                                name="nombrePrestataires"
                                min="1"
                                value={formData.nombrePrestataires}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ex: 1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type de prestataire
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeCible: 'tous' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeCible === 'tous' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <Users size={16} />
                                    Tous
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeCible: 'individuel' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeCible === 'individuel' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <User size={16} />
                                    Individuel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeCible: 'entreprise' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeCible === 'entreprise' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <Briefcase size={16} />
                                    Entreprise
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type de durée (facultatif)
                            </label>
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: 'ponctuelle' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeDuree === 'ponctuelle' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <Clock size={16} />
                                    Ponctuelle
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: 'determinee' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeDuree === 'determinee' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <Calendar size={16} />
                                    Déterminée
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, typeDuree: 'indeterminee' })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md flex-1 justify-center text-sm ${formData.typeDuree === 'indeterminee' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <Calendar size={16} />
                                    Indéterminée
                                </button>
                            </div>

                            {formData.typeDuree === 'determinee' && (
                                <div>
                                    <label htmlFor="dureeEstimee" className="block text-sm font-medium text-gray-700 mb-1">
                                        Durée estimée (en mois)
                                    </label>
                                    <input
                                        type="number"
                                        id="dureeEstimee"
                                        name="dureeEstimee"
                                        value={formData.dureeEstimee}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: 3"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Aperçu
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
                                    <div>
                                        <p className="font-medium">Localisation:</p>
                                        <p>{formData.ville || "Ville non spécifiée"}{formData.quartier ? `, ${formData.quartier}` : ""}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Budget:</p>
                                    <p>{formData.montant ? `${formData.montant} XAF` : "À négocier"}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Prestataires:</p>
                                    <p>{formData.nombrePrestataires} {formData.typeCible === 'tous' ? 'prestataire(s)' : formData.typeCible === 'individuel' ? 'individu(s)' : 'entreprise(s)'}</p>
                                </div>
                            </div>

                            {formData.metiers.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-medium">Corps de métier:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {formData.metiers.map((metier, index) => (
                                            <span key={index} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-sm">
                                                {metier}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="font-medium">Type de mission:</p>
                                <p>
                                    {formData.typeDuree === 'ponctuelle' ? 'Tâche ponctuelle' :
                                        formData.typeDuree === 'determinee' ? `Durée déterminée (${formData.dureeEstimee} mois)` :
                                            'Durée indéterminée'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={formData.isLoading}
                                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                            >
                                {formData.isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Publication en cours...
                                    </>
                                ) : (
                                    "Publier l'offre"
                                )}
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Vérifier si le bouton suivant doit être désactivé
    const isNextDisabled = () => {
        if (currentStep === 0) {
            return !formData.titre || !formData.details;
        }
        if (currentStep === 2 && formData.localisationType === 'manuelle') {
            return !formData.ville;
        }
        return false;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-md mx-auto p-4">
                {/* En-tête */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-center text-gray-800">
                        Nouvelle publication
                    </h2>

                    {/* Barre de progression */}
                    <div className="mt-4">
                        <div className="relative w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className="absolute h-2 bg-indigo-500 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer ${currentStep >= index ? 'text-indigo-600' : ''
                                        }`}
                                    onClick={() => goToStep(index)}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${currentStep > index ? 'bg-indigo-500 text-white' :
                                        currentStep === index ? 'border-2 border-indigo-500 text-indigo-500' :
                                            'border-2 border-gray-300 text-gray-300'
                                        }`}>
                                        {currentStep > index ? (
                                            <Check size={14} />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <span className="hidden md:block">{step}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contenu du formulaire */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    {renderStepContent()}
                </div>

                {/* Boutons de navigation */}
                {currentStep < steps.length - 1 && (
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            disabled={currentStep === 0}
                            className={`flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <ChevronLeft size={20} className="mr-1" />
                            Précédent
                        </button>

                        <button
                            type="button"
                            onClick={goToNextStep}
                            disabled={isNextDisabled()}
                            className={`flex-1 py-2 px-4 bg-indigo-600 border border-transparent rounded-md shadow-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            Suivant
                            <ChevronRight size={20} className="ml-1" />
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
}