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

// Liste des métiers disponibles (exemples)
const metiers = [
    "Plombier", "Électricien", "Menuisier", "Peintre", "Maçon",

];

export default function AddPostService() {
    // États pour le formulaire multi-étapes
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();

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
        coordonnees: { lat: null, lng: null },
        montant: "",
        deviseMonnaie: "XAF",
        metierSelectionnes: [],
        nbPrestataires: 1,
        typeDemandeur: "tous", // 'tous', 'personne' ou 'entreprise'
        typeDuree: "ponctuelle", // 'ponctuelle', 'determinee', 'indeterminee'
        dureeMois: 1,
        dureeUnite: "mois" // 'jours', 'semaines', 'mois', 'annees'
    });

    // Géolocalisation automatique
    useEffect(() => {
        if (formData.locationType === "auto") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Dans un cas réel, vous utiliseriez une API de géocodage inverse
                        // pour obtenir ville et quartier à partir des coordonnées
                        setFormData({
                            ...formData,
                            coordonnees: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            },
                            ville: "Ville détectée", // Simulation
                            quartier: "Quartier détecté" // Simulation
                        });
                    },
                    (error) => {
                        console.error("Erreur de géolocalisation:", error);
                    }
                );
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

        // Simuler l'envoi des données à l'API
        try {
            // Construction de l'objet final à envoyer
            const dataToSend = {
                ...formData,
                // On peut transformer certaines données si nécessaire
                montant: formData.montant ?
                    `${formData.montant} ${formData.deviseMonnaie}` :
                    "À négocier",
                duree: formData.typeDuree === "determinee" ?
                    `${formData.dureeMois} ${formData.dureeUnite}` :
                    formData.typeDuree
            };

            console.log("Données à envoyer:", dataToSend);

            // Simulation d'une requête POST
            // Dans un cas réel, vous utiliseriez fetch ou axios
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert("Publication créée avec succès!");
            // Réinitialiser le formulaire ou rediriger l'utilisateur
            navigate('/Services Feed');

        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            alert("Erreur lors de la création de la publication");
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
                            <input
                                type="url"
                                name="lien"
                                value={formData.lien}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: www.exemple.com"
                            />
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
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-blue-500" />
                                        <span className="font-medium">Position détectée</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500">Ville</label>
                                            <p className="font-medium">{formData.ville || "En attente..."}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Quartier</label>
                                            <p className="font-medium">{formData.quartier || "En attente..."}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ville *</label>
                                        <input
                                            type="text"
                                            name="ville"
                                            value={formData.ville}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ex: Douala"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quartier (facultatif)</label>
                                        <input
                                            type="text"
                                            name="quartier"
                                            value={formData.quartier}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ex: Bonamoussadi"
                                        />
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
                                    <div>
                                        <p className="font-medium">Localisation:</p>
                                        <p>{formData.ville || "Ville non spécifiée"}{formData.quartier ? `, ${formData.quartier}` : ""}</p>
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