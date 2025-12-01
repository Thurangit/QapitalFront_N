import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookmarkIcon, Send, MessageCircle, MessageSquare, User, Star, ExternalLink, X, Linkedin, Facebook, Instagram, Mail, CheckCircle2, Activity, AlertTriangle } from 'lucide-react';
import AuthUser from '../../../modules/AuthUser';
import { urlApi, urlPublicAPi, urlServerImage } from '../../../modules/urlApp';
import TopBar from '../../../modules/Components/topBar';
import { toast } from '../../../modules/Components/Toast';
import { OptimizedImage } from '../../../components/OptimizedImage';

// Ajouter les animations CSS inline
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-in-out;
}

.scale-102 {
  transform: scale(1.02);
}

.scale-98 {
  transform: scale(0.98);
}
`;

const ShareModal = ({ isOpen, onClose, postId }) => {
    if (!isOpen) return null;
    const shareOptions = [
        { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-600' },
        { name: 'WhatsApp', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-green-500' },
        { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-800' },
        { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-pink-600' },
        { name: 'Email', icon: <Mail className="w-5 h-5" />, color: 'bg-red-500' },
        { name: 'SMS', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-yellow-500' },
    ];

    const handleShare = (platform) => {
        // Implémentation du partage selon la plateforme (mock)
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg w-80 max-w-full overflow-hidden shadow-xl transform transition-all animate-scaleIn">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Partager</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                className="flex flex-col items-center justify-center"
                                onClick={() => handleShare(option.name)}
                            >
                                <div className={`w-12 h-12 ${option.color} text-white rounded-full flex items-center justify-center mb-2`}>
                                    {option.icon}
                                </div>
                                <span className="text-xs text-gray-600">{option.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                            <input
                                type="text"
                                value={`https://propose.com/post/${postId}`}
                                readOnly
                                className="bg-transparent text-sm flex-1 outline-none"
                            />
                            <button className="ml-2 text-blue-500">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Rating = ({ value = 0, size = 'md' }) => {
    const clamped = Math.max(0, Math.min(5, Number(value) || 0));
    const starFillPercents = useMemo(() => (
        Array.from({ length: 5 }, (_, i) => {
            const diff = clamped - i;
            if (diff >= 1) return 100;
            if (diff <= 0) return 0;
            return Math.round(diff * 100);
        })
    ), [clamped]);

    const starSizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const textSizeClass = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {starFillPercents.map((pct, idx) => (
                    <span key={idx} className={`relative inline-block ${starSizeClass}`}>
                        <Star className={`${starSizeClass} text-gray-300`} />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
                            <Star className={`${starSizeClass} text-yellow-400 fill-yellow-400`} />
                        </span>
                    </span>
                ))}
            </div>
            <span className={`${textSizeClass} text-gray-500`}>{clamped.toFixed(2)}</span>
        </div>
    );
};

const ApplicantCard = ({ applicant, onContact, onViewProfile, onChoose, isChosen, updating }) => {
    const u = applicant.user || {};

    // Construire l'URL de la photo du prestataire
    const photoUrl = useMemo(() => {
        const photoSource = u.photo || u.avatar;
        if (!photoSource) return '/api/placeholder/64/64';
        if (photoSource.startsWith('http')) return photoSource;
        return `${urlServerImage}/${photoSource}`;
    }, [u.photo, u.avatar]);

    // Style de la carte selon si le prestataire est choisi
    const cardClassName = isChosen
        ? "flex items-start p-3 bg-white rounded-lg border-2 border-green-500 bg-green-50"
        : "flex items-start p-3 bg-white rounded-lg border border-gray-200";

    return (
        <div className={cardClassName}>
            <OptimizedImage
                src={photoUrl}
                alt={u.nom || 'user'}
                className="w-12 h-12 rounded-full object-cover"
                placeholder="/api/placeholder/64/64"
                showLoader={false}
                objectFit="cover"
            />
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">{[u.nom, u.prenom].filter(Boolean).join(' ') || 'Utilisateur'}</h4>
                            {isChosen && (
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{u.qualification || 'Qualification non renseignée'}</p>
                        {isChosen && (
                            <p className="text-xs text-green-600 font-medium mt-1">Prestataire sélectionné</p>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            {!isChosen ? (
                                <button
                                    onClick={onChoose}
                                    disabled={updating}
                                    className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle className="w-3 h-3" /> Choisir
                                </button>
                            ) : (
                                <button
                                    onClick={onChoose}
                                    disabled={updating}
                                    className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-3 h-3" /> Désélectionner
                                </button>
                            )}
                            <button onClick={onViewProfile} className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                <User className="w-3 h-3" /> Profil
                            </button>
                        </div>
                        <div className="mt-0.5">
                            <Rating value={u.note || 0} size="sm" />
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-700 mt-2">{applicant.message || 'Aucun commentaire'}</p>
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Liste des états de mission avec leurs couleurs
const etatMissions = {
    1: { etat_mission: "Publié", color: "bg-blue-100 text-blue-800" },
    2: { etat_mission: "Prestataire sur site", color: "bg-cyan-100 text-cyan-800" },
    3: { etat_mission: "En cours", color: "bg-yellow-100 text-yellow-800" },
    4: { etat_mission: "Achevé", color: "bg-green-100 text-green-800" },
    5: { etat_mission: "Soldé", color: "bg-purple-100 text-purple-800" },
    6: { etat_mission: "Terminé", color: "bg-emerald-100 text-emerald-800" },
    7: { etat_mission: "Annulé", color: "bg-red-100 text-red-800" }
};

// Fonction pour obtenir les informations de l'état de la mission
const getEtatMission = (stateId, etatMissionData = null) => {
    // Déterminer le state_id réel (peut venir du post ou de la relation)
    let stateIdNum = typeof stateId === 'string' ? parseInt(stateId) : (stateId || 1);

    // Si les données de l'état sont fournies directement (depuis l'API Laravel)
    // Laravel retourne la relation comme un objet avec les propriétés
    if (etatMissionData) {
        // Si c'est un objet avec la propriété etat_mission
        if (typeof etatMissionData === 'object' && etatMissionData.etat_mission) {
            const colorClass = etatMissions[stateIdNum]?.color || "bg-gray-100 text-gray-800";
            return {
                label: etatMissionData.etat_mission,
                color: colorClass
            };
        }
        // Si c'est une chaîne directe (fallback)
        if (typeof etatMissionData === 'string') {
            const colorClass = etatMissions[stateIdNum]?.color || "bg-gray-100 text-gray-800";
            return {
                label: etatMissionData,
                color: colorClass
            };
        }
    }

    // Sinon, utiliser le state_id pour récupérer depuis la liste statique
    const etat = etatMissions[stateIdNum] || etatMissions[1];
    return {
        label: etat.etat_mission,
        color: etat.color
    };
};

// Modal de confirmation pour annuler
const CancelConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg w-80 max-w-full overflow-hidden shadow-xl transform transition-all animate-scaleIn">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-medium">Avertissement</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-700 mb-4">
                        Êtes-vous sûr de vouloir annuler cette mission ? Cette action réinitialisera l'état de la mission à "Annulé" et vous ne pourrez plus modifier les étapes.
                    </p>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                        >
                            Non, garder
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                        >
                            Oui, annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal de confirmation pour confirmer une étape importante (sans boucle)
const ConfirmStepModal = ({ isOpen, onClose, onConfirm, targetState, currentState }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg w-80 max-w-full overflow-hidden shadow-xl transform transition-all animate-scaleIn">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Confirmer le changement d'état</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-700 mb-4">
                        Voulez-vous passer à l'état <strong>"{targetState}"</strong> ?
                    </p>
                    {targetState && currentState && (
                        <p className="text-xs text-gray-500 mb-4">
                            Toutes les étapes précédentes seront automatiquement validées.
                        </p>
                    )}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant Timeline verticale pour le suivi de mission
const MissionTimeline = ({ etats, currentStateId, onStateClick, onCancel, updating, navigate, missionId }) => {
    const currentState = currentStateId || 1;
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [targetStateId, setTargetStateId] = useState(null);

    // Vérifier si la mission est annulée
    const isCancelled = currentState === 7;

    // Vérifier si la mission est dans un état final (ne peut plus être annulée)
    const isFinalState = currentState === 4 || currentState === 5 || currentState === 6;

    // États spéciaux
    const SOLDE_STATE = 5; // Soldé - toujours accessible
    const CANCELLED_STATE = 7; // Annulé

    // Couleurs pour chaque état avec animations
    const stateColors = {
        1: { bg: 'bg-blue-500', ring: 'ring-blue-300', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-300', gradient: 'from-blue-400 to-blue-600' },
        2: { bg: 'bg-cyan-500', ring: 'ring-cyan-300', text: 'text-cyan-700', light: 'bg-cyan-50', border: 'border-cyan-300', gradient: 'from-cyan-400 to-cyan-600' },
        3: { bg: 'bg-yellow-500', ring: 'ring-yellow-300', text: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-300', gradient: 'from-yellow-400 to-yellow-600' },
        4: { bg: 'bg-green-500', ring: 'ring-green-300', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-300', gradient: 'from-green-400 to-green-600' },
        5: { bg: 'bg-purple-500', ring: 'ring-purple-300', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-300', gradient: 'from-purple-400 to-purple-600' },
        6: { bg: 'bg-emerald-500', ring: 'ring-emerald-300', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-300', gradient: 'from-emerald-400 to-emerald-600' },
        7: { bg: 'bg-red-500', ring: 'ring-red-300', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-300', gradient: 'from-red-400 to-red-600' },
    };

    // Fonction pour gérer le clic sur une étape
    const handleStateClick = (targetId) => {
        setTargetStateId(targetId);
        setShowConfirmModal(true);
    };

    // Fonction pour confirmer le changement d'état
    const confirmStateChange = () => {
        setShowConfirmModal(false);
        if (targetStateId && onStateClick) {
            onStateClick(targetStateId);
        }
        setTargetStateId(null);
    };

    if (!etats || etats.length === 0) {
        return <p className="text-sm text-gray-500 text-center py-4">Chargement des états...</p>;
    }

    // Filtrer les états pour séparer l'état "Annulé" (on ne l'affiche pas dans la timeline normale)
    const normalEtats = etats.filter(e => e.id !== CANCELLED_STATE);

    return (
        <div className="py-4">
            <div className="relative">
                {/* Ligne de progression verticale */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0">
                    {!isCancelled && (
                        <div
                            className="w-full bg-gradient-to-b from-blue-500 via-cyan-500 to-green-500 transition-all duration-700 ease-in-out"
                            style={{ height: `${((currentState - 1) / (normalEtats.length - 1)) * 100}%` }}
                        />
                    )}
                </div>

                {/* Points de la timeline verticale */}
                <div className="relative space-y-6">
                    {normalEtats.map((etat, index) => {
                        const etatId = etat.id;
                        const isCompleted = !isCancelled && etatId <= currentState;
                        const isCurrent = !isCancelled && etatId === currentState;
                        const isSolde = etatId === SOLDE_STATE;
                        const isClickable = !isCancelled && !updating && (isSolde || etatId > currentState);
                        const colors = stateColors[etatId] || stateColors[1];

                        return (
                            <div key={etatId} className="relative flex items-start gap-4 z-10">
                                {/* Point de la timeline */}
                                <div className="relative flex-shrink-0">
                                    <div className={`
                                        relative w-12 h-12 rounded-full flex items-center justify-center
                                        transition-all duration-500 transform
                                        ${isCompleted && !isCurrent
                                            ? `${colors.bg} text-white shadow-lg scale-100`
                                            : isCurrent
                                                ? `bg-gradient-to-br ${colors.gradient} text-white shadow-xl ring-4 ${colors.ring} scale-110`
                                                : isCancelled
                                                    ? 'bg-gray-200 text-gray-400 opacity-40'
                                                    : 'bg-gray-200 text-gray-500'
                                        }
                                    `}>
                                        {/* Effet de pulsation subtile pour l'état actuel */}
                                        {isCurrent && !isCancelled && !isFinalState && (
                                            <div className={`absolute inset-0 rounded-full ${colors.bg} opacity-10 animate-pulse`} style={{ animationDuration: '2s' }} />
                                        )}
                                        <span className="relative z-10 text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        {/* Checkmark pour les états complétés */}
                                        {isCompleted && !isCurrent && !isCancelled && (
                                            <CheckCircle2 className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-500 rounded-full shadow-md animate-fadeIn" />
                                        )}
                                        {/* Croix rouge pour les états bloqués si annulé */}
                                        {isCancelled && (
                                            <X className="absolute -top-1 -right-1 w-5 h-5 text-white bg-red-500 rounded-full p-0.5 shadow-md" />
                                        )}
                                    </div>
                                </div>

                                {/* Contenu de l'étape */}
                                <div className={`
                                    flex-1 rounded-lg p-4 transition-all duration-500
                                    ${isCurrent && !isCancelled
                                        ? `${colors.light} border-2 ${colors.border} shadow-lg transform scale-102`
                                        : isCompleted && !isCurrent && !isCancelled
                                            ? 'bg-green-50 border border-green-200 shadow-sm'
                                            : isCancelled
                                                ? 'bg-gray-50 border border-gray-200 opacity-40'
                                                : 'bg-white border border-gray-200 hover:shadow-md'
                                    }
                                `}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h4 className={`
                                                text-sm font-semibold mb-1 transition-colors duration-300
                                                ${isCurrent && !isCancelled ? colors.text : isCompleted && !isCurrent && !isCancelled ? 'text-green-700' : isCancelled ? 'text-gray-400 line-through' : 'text-gray-600'}
                                            `}>
                                                {etat.etat_mission}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {isCancelled ? 'Étape désactivée' : `Étape ${index + 1} sur ${normalEtats.length}`}
                                            </p>
                                        </div>

                                        {/* Bouton "Faire un paiement" toujours visible pour l'état Soldé (sauf si annulé) */}
                                        {isSolde && !isCancelled && (
                                            <button
                                                onClick={() => {
                                                    // Rediriger vers la page de paiement
                                                    navigate(`/mission/${missionId}/paiement`);
                                                }}
                                                className={`
                                                    px-4 py-2 rounded-md text-xs font-medium
                                                    flex items-center gap-2
                                                    transition-all duration-300 transform
                                                    bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-lg hover:scale-105 active:scale-95
                                                `}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Faire un paiement
                                            </button>
                                        )}

                                        {/* Bouton pour passer à l'étape suivante (sauf Soldé) */}
                                        {!isSolde && isClickable && (
                                            <button
                                                onClick={() => handleStateClick(etatId)}
                                                disabled={updating}
                                                className={`
                                                    px-4 py-2 rounded-md text-xs font-medium
                                                    flex items-center gap-2
                                                    transition-all duration-300 transform
                                                    ${updating
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                                                    }
                                                `}
                                            >
                                                {updating ? (
                                                    <>
                                                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                        </svg>
                                                        Mise à jour...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Passer à {etat.etat_mission}
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Badge pour les étapes complétées */}
                                        {isCompleted && !isCurrent && !isCancelled && (
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium shadow-sm animate-fadeIn">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Validé
                                            </div>
                                        )}

                                        {/* Badge pour l'étape actuelle */}
                                        {isCurrent && !isCancelled && (
                                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${colors.light} ${colors.text} text-xs font-medium shadow-sm animate-pulse`}>
                                                <Activity className="w-3 h-3" />
                                                En cours
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Indicateur de l'état actuel et bouton Annuler */}
            <div className="mt-6 space-y-3">
                <div className={`p-4 rounded-lg border transition-all duration-500 ${isCancelled
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                    : isFinalState
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">État actuel de la mission</p>
                            <p className={`text-base font-semibold transition-colors duration-300 ${isCancelled ? 'text-red-700' : isFinalState ? 'text-green-700' : 'text-gray-900'
                                }`}>
                                {etats.find(e => e.id === currentState)?.etat_mission || 'Inconnu'}
                            </p>
                        </div>
                        {updating && (
                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        )}
                        {isCancelled && (
                            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                        )}
                        {isFinalState && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                    </div>
                </div>

                {/* Bouton Annuler - désactivé si mission terminée/achevée/soldée ou déjà annulée */}
                {!isFinalState && !isCancelled && (
                    <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={updating}
                        className="w-full px-4 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-4 h-4" />
                        Annuler la mission
                    </button>
                )}

                {/* Message si mission terminée */}
                {isFinalState && (
                    <div className="w-full px-4 py-2 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4" />
                        Mission {etats.find(e => e.id === currentState)?.etat_mission.toLowerCase() || 'terminée'}
                    </div>
                )}

                {/* Message si mission annulée */}
                {isCancelled && (
                    <div className="w-full px-4 py-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
                        <AlertTriangle className="w-4 h-4" />
                        Mission annulée - Aucune action possible
                    </div>
                )}
            </div>

            {/* Modal de confirmation pour confirmer une étape */}
            <ConfirmStepModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setTargetStateId(null);
                }}
                onConfirm={confirmStateChange}
                targetState={etats.find(e => e.id === targetStateId)?.etat_mission || ''}
                currentState={etats.find(e => e.id === currentState)?.etat_mission || ''}
            />

            {/* Modal de confirmation pour annuler */}
            <CancelConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => {
                    setShowCancelModal(false);
                    if (onCancel) {
                        onCancel(CANCELLED_STATE); // ID 7 = Annulé
                    }
                }}
            />
        </div>
    );
};

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { http, user } = AuthUser();

    const [loading, setLoading] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [post, setPost] = useState(null);
    const [saved, setSaved] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [followOpen, setFollowOpen] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [applyText, setApplyText] = useState('');
    const [service_info, setservice_info] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [updatingChoice, setUpdatingChoice] = useState(null);
    const [etatsMission, setEtatsMission] = useState([]);
    const [updatingState, setUpdatingState] = useState(false);
    const [etatsMissionLoaded, setEtatsMissionLoaded] = useState(false);

    // Fonction pour traiter les candidatures (hors du useCallback pour éviter les dépendances)
    const processCandidates = (allCandidates, serviceId) => {
        if (!Array.isArray(allCandidates)) return [];

        const filteredCandidates = allCandidates.filter(candidate => {
            const candidateServiceId = candidate.id_service || candidate.id_post || candidate.post_id || candidate.service_id;
            return candidateServiceId === serviceId || candidateServiceId === parseInt(serviceId) || String(candidateServiceId) === String(serviceId);
        });

        return filteredCandidates.map(a => {
            const userInfo = a.prestataire || a.user || {};
            return {
                id: a.id,
                message: a.commentaire_prestataire || a.message || a.commentaire || '',
                choise: a.choise || a.choice || 0,
                user: {
                    id: a.id_prestataire || a.user_id || a.prestataire_id || userInfo.id,
                    nom: userInfo.nom || 'Nom',
                    prenom: userInfo.prenom || 'Prénom',
                    qualification: userInfo.qualification || 'Non renseignée',
                    note: Number(userInfo.note_user || a.note || 0),
                    photo: userInfo.avatar || userInfo.photo || null,
                    avatar: userInfo.avatar || userInfo.photo || null,
                },
            };
        });
    };

    const fetchAllCandidates = useCallback(async () => {
        try {
            const appsRes = await http.get(`${urlApi}/service/candidature/all/${id}`);
            const allCandidates = Array.isArray(appsRes.data) ? appsRes.data : [];
            const processed = processCandidates(allCandidates, id);
            setApplicants(processed);
        } catch (error) {
            console.error("Erreur lors du chargement des candidatures:", error);
            setApplicants([]);
        }
    }, [http, id]);

    const updateChoice = async (candidateId, currentChoice) => {
        // Déterminer la nouvelle valeur : si choise === 1, on passe à 0, sinon à 1
        const newChoice = currentChoice === 1 ? 0 : 1;

        setUpdatingChoice(candidateId);
        try {
            await http.put(`${urlApi}/service/candidature/update/${candidateId}`, {
                choise: newChoice
            });

            // Mettre à jour l'état local
            setApplicants(prevApplicants =>
                prevApplicants.map(applicant =>
                    applicant.id === candidateId
                        ? { ...applicant, choise: newChoice }
                        : applicant
                )
            );

            toast.success(
                newChoice === 1
                    ? "Prestataire sélectionné avec succès !"
                    : "Prestataire désélectionné avec succès !",
                newChoice === 1 ? "Sélection réussie" : "Désélection réussie"
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour du choix:", error);
            let errorMessage = "Une erreur s'est produite lors de la mise à jour.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage, "Erreur");
        } finally {
            setUpdatingChoice(null);
        }
    };

    // Charger les états de mission UNE SEULE FOIS au montage
    useEffect(() => {
        if (etatsMissionLoaded) return; // Ne charger qu'une seule fois

        const loadEtats = async () => {
            try {
                const res = await http.get(`${urlApi}/service/etat`);
                if (Array.isArray(res.data)) {
                    setEtatsMission(res.data);
                    setEtatsMissionLoaded(true);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des états:', error);
            }
        };

        if (http) {
            loadEtats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Charger une seule fois au montage

    // Fonction pour mettre à jour l'état de la mission avec mise à jour automatique de l'interface
    const updateMissionState = async (newStateId) => {
        if (!service_info.id || updatingState) return;

        // Vérifier que l'utilisateur est le propriétaire de la mission
        if (service_info.user_id && user?.id && service_info.user_id !== user.id) {
            toast.error("Vous n'êtes pas autorisé à modifier cette mission.", "Accès refusé");
            return;
        }

        setUpdatingState(true);
        try {
            // Utiliser PUT pour mettre à jour le service
            await http.put(`${urlApi}/service/update/${service_info.id}`, {
                state_id: newStateId
            });

            // Mettre à jour l'état local IMMÉDIATEMENT pour que l'interface se rafraîchisse
            setservice_info(prev => ({ ...prev, state_id: newStateId }));
            setPost(prev => prev ? { ...prev, state_id: newStateId } : null);

            const newEtat = etatsMission.find(e => e.id === newStateId);
            toast.success(
                `Mission mise à jour : ${newEtat?.etat_mission || 'État mis à jour'}`,
                "État mis à jour"
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'état:", error);
            let errorMessage = "Une erreur s'est produite lors de la mise à jour de l'état.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage = "La route de mise à jour n'existe pas. Veuillez contacter l'administrateur.";
            }
            toast.error(errorMessage, "Erreur");
        } finally {
            setUpdatingState(false);
        }
    };

    // Fonction pour construire le post à partir des données du service (hors du useCallback)
    const buildPostFromService = (serviceData, serviceId) => {
        if (!serviceData || !serviceData.id) {
            return null;
        }

        // Construire l'URL de l'image du post
        let imageUrl = null;
        if (serviceData.image) {
            imageUrl = serviceData.image.startsWith('http') ? serviceData.image : `${urlPublicAPi}/${serviceData.image}`;
        } else if (serviceData.photo) {
            imageUrl = serviceData.photo.startsWith('http') ? serviceData.photo : `${urlPublicAPi}/${serviceData.photo}`;
        }

        // Construire l'URL de la photo de profil
        let profilePicUrl = '/api/placeholder/40/40';
        if (serviceData.user?.avatar) {
            profilePicUrl = serviceData.user.avatar.startsWith('http')
                ? serviceData.user.avatar
                : `${urlServerImage}/${serviceData.user.avatar}`;
        } else if (serviceData.author?.photo) {
            profilePicUrl = serviceData.author.photo.startsWith('http')
                ? serviceData.author.photo
                : `${urlServerImage}/${serviceData.author.photo}`;
        }

        // Mapping pour uniformiser les données
        return {
            id: serviceData.id || serviceId,
            titre: serviceData.titre || serviceData.title || 'Titre du service',
            details: serviceData.details || serviceData.description || '',
            image: imageUrl,
            created_at: serviceData.created_at || serviceData.date || new Date().toISOString(),
            author: (serviceData.user && (serviceData.user.nom || serviceData.user.prenom)
                ? `${serviceData.user.nom || ''} ${serviceData.user.prenom || ''}`.trim()
                : null) || (serviceData.author && (serviceData.author.nom || serviceData.author.name))
                || serviceData.user_name || 'Auteur',
            profilePic: profilePicUrl,
            category: serviceData.category || serviceData.categorie || undefined,
            ville: serviceData.ville,
            quartier: serviceData.quartier,
            precision: serviceData.precision || serviceData.description_position,
            pays: serviceData.pays,
            region: serviceData.region,
            montant: serviceData.montant,
            deviseMonnaie: serviceData.deviseMonnaie || serviceData.devise,
            typeDuree: serviceData.typeDuree || serviceData.type_duree_postservice,
            dureeMois: serviceData.dureeMois,
            dureeUnite: serviceData.dureeUnite || serviceData.type_duree_postservice,
            metierSelectionnes: serviceData.metierSelectionnes || [],
            nbPrestataires: serviceData.nbPrestataires || serviceData.nombre_prestataire,
            typeDemandeur: serviceData.typeDemandeur,
            lien: serviceData.lien || serviceData.lienhttp,
            modeMission: serviceData.modeMission || serviceData.mode_mission || serviceData.type_mission || undefined,
            state_id: serviceData.state_id
        };
    };

    // Utiliser une ref pour http pour éviter les re-renders
    const httpRef = useRef(http);
    useEffect(() => {
        httpRef.current = http;
    }, [http]);

    // Effet principal pour charger toutes les données une seule fois
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        let mounted = true;
        let cancelled = false;

        const loadData = async () => {
            if (!httpRef.current) {
                if (mounted) setLoading(false);
                return;
            }

            setLoading(true);

            // Démarrer le chronomètre pour le délai minimum
            const startTime = Date.now();
            const minLoadingTime = 300; // Minimum 300ms pour éviter le flash

            // Fonction helper pour créer un timeout (seulement pour les candidatures)
            const withTimeout = (promise, timeoutMs = 20000) => {
                let timeoutId;
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => reject(new Error('Timeout')), timeoutMs);
                });

                return Promise.race([
                    promise.then(result => {
                        clearTimeout(timeoutId);
                        return result;
                    }),
                    timeoutPromise
                ]);
            };

            // Fonction pour garantir un délai minimum
            const ensureMinTime = async (callback) => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, minLoadingTime - elapsed);
                await new Promise(resolve => setTimeout(resolve, remaining));
                if (mounted && !cancelled) {
                    callback();
                }
            };

            try {
                // Charger d'abord les données principales (service info) - SANS timeout car critiques
                // On attend patiemment ces données car elles sont essentielles
                const serviceRes = await httpRef.current.get(`${urlApi}/service/info/${id}`)
                    .catch(err => {
                        console.error('Erreur service/info:', err);
                        // En cas d'erreur, on retourne null mais on continue
                        return { data: null };
                    });

                // Charger les candidatures en parallèle avec timeout (moins critique)
                const candidatesPromise = httpRef.current.get(`${urlApi}/service/candidature/all/${id}`)
                    .catch(err => {
                        console.error('Erreur candidature/all:', err);
                        return { data: [] };
                    });

                if (cancelled || !mounted) return;

                const serviceData = serviceRes?.data || {};

                // Vérifier que nous avons au moins un ID de service
                if (!serviceData.id && !serviceData.id_service) {
                    console.warn('Aucune donnée de service trouvée pour l\'ID:', id);
                    if (mounted) {
                        setservice_info({});
                        setPost(null);
                        setApplicants([]);
                        await ensureMinTime(() => setLoading(false));
                    }
                    return;
                }

                // Mettre à jour service_info immédiatement
                setservice_info(serviceData);

                // Construire et mettre à jour le post immédiatement
                const postData = buildPostFromService(serviceData, id);
                if (postData) {
                    setPost(postData);
                } else {
                    console.warn('Impossible de construire le post à partir des données');
                    setPost(null);
                }

                // Arrêter le loader dès que les données principales sont chargées (avec délai minimum)
                await ensureMinTime(() => setLoading(false));

                // Charger les candidatures en arrière-plan (sans bloquer l'affichage)
                // On les charge avec un timeout plus long et on ne bloque pas si ça échoue
                if (mounted && !cancelled) {
                    setLoadingCandidates(true);
                }

                // Charger les candidatures avec un timeout plus long (20 secondes)
                try {
                    const appsRes = await withTimeout(candidatesPromise, 20000);
                    if (cancelled || !mounted) return;

                    const allCandidates = Array.isArray(appsRes?.data) ? appsRes.data : [];
                    const processedCandidates = processCandidates(allCandidates, id);
                    if (mounted && !cancelled) {
                        setApplicants(processedCandidates);
                        setLoadingCandidates(false);
                    }
                } catch (candidateError) {
                    // Si timeout ou erreur, on essaie quand même de charger sans timeout
                    console.warn('Timeout ou erreur lors du chargement des candidatures, tentative sans timeout:', candidateError.message);
                    try {
                        // Tentative sans timeout pour récupérer les données si elles arrivent
                        const appsRes = await httpRef.current.get(`${urlApi}/service/candidature/all/${id}`)
                            .catch(() => ({ data: [] }));

                        if (cancelled || !mounted) return;

                        const allCandidates = Array.isArray(appsRes?.data) ? appsRes.data : [];
                        const processedCandidates = processCandidates(allCandidates, id);
                        if (mounted && !cancelled) {
                            setApplicants(processedCandidates);
                            setLoadingCandidates(false);
                        }
                    } catch (finalError) {
                        // Si ça échoue encore, on affiche juste une liste vide
                        console.warn('Impossible de charger les candidatures:', finalError);
                        if (mounted && !cancelled) {
                            setApplicants([]);
                            setLoadingCandidates(false);
                        }
                    }
                }

            } catch (error) {
                // Cette erreur ne devrait plus se produire car on n'utilise plus de timeout pour les données principales
                console.error('Erreur lors du chargement des données principales:', error);
                if (mounted && !cancelled) {
                    setPost(null);
                    setApplicants([]);
                    setservice_info({});
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            cancelled = true;
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Ne dépendre que de id, pas de http

    const submitApplication = async () => {
        // Vérifier que l'utilisateur est connecté
        if (!user || !user.id) {
            toast.error(
                "Vous devez être connecté pour postuler à une offre.",
                "Connexion requise"
            );
            return;
        }

        setSubmitting(true);
        try {
            // Préparer les données pour l'endpoint
            const candidateData = {
                id_prestataire: user.id,
                id_service: service_info.id,
                commentaire_prestataire: applyText || ''
            };

            // Envoyer la candidature
            await http.post(`${urlApi}/service/candidature/add`, candidateData);

            // Afficher la notification de succès
            toast.success(
                "Votre candidature a été envoyée avec succès !",
                "Candidature envoyée"
            );

            // Réinitialiser le formulaire
            setApplyText('');
            setApplyOpen(false);

            // Recharger toutes les candidatures pour afficher immédiatement la nouvelle
            await fetchAllCandidates();

        } catch (error) {
            console.error("Erreur lors de la soumission de la candidature:", error);

            // Messages d'erreur user-friendly
            let errorMessage = "Une erreur inattendue s'est produite lors de l'envoi de votre candidature.";
            let errorTitle = "Erreur d'envoi";

            if (error.response) {
                // Erreur de réponse du serveur
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data?.message || "Les données envoyées sont invalides. Veuillez vérifier vos informations.";
                    errorTitle = "Données invalides";
                } else if (status === 401) {
                    errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
                    errorTitle = "Session expirée";
                } else if (status === 403) {
                    errorMessage = "Vous n'avez pas la permission de postuler à cette offre.";
                    errorTitle = "Permission refusée";
                } else if (status === 404) {
                    errorMessage = "Cette offre n'existe plus ou a été supprimée.";
                    errorTitle = "Offre introuvable";
                } else if (status === 409) {
                    errorMessage = data?.message || "Vous avez déjà postulé à cette offre.";
                    errorTitle = "Candidature existante";
                } else if (status === 422) {
                    errorMessage = data?.message || "Les données fournies ne sont pas valides. Veuillez vérifier votre saisie.";
                    errorTitle = "Validation échouée";
                } else if (status === 500) {
                    errorMessage = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
                    errorTitle = "Erreur serveur";
                } else {
                    errorMessage = data?.message || errorMessage;
                }
            } else if (error.request) {
                // Pas de réponse du serveur
                errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez.";
                errorTitle = "Problème de connexion";
            }

            toast.error(errorMessage, errorTitle);
        } finally {
            setSubmitting(false);
        }
    };

    const [activeTab, setActiveTab] = useState('resume');

    // Si en cours de chargement, afficher le loader
    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <TopBar title="Chargement..." onBack={() => navigate(-1)} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center text-gray-600">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <p className="mt-3 text-sm">Chargement des détails de l'offre...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si aucune donnée n'est trouvée après le chargement, afficher le message d'erreur
    if (!loading && (!post || !post.id)) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <TopBar title="Offre introuvable" onBack={() => navigate(-1)} />
                <div className="flex-1 p-6 flex flex-col items-center justify-center">
                    <p className="text-gray-600 mb-4">Cette offre n'existe pas ou a été supprimée.</p>
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Retourner à la liste
                    </button>
                </div>
            </div>
        );
    }

    const tabClass = (key) => `px-3 py-2 text-sm rounded-full border ${activeTab === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Injecter les styles d'animation */}
            <style>{animationStyles}</style>

            <TopBar
                title={"Détails de l'offre"}
                onBack={() => navigate(-1)}
                onShare={() => setShareOpen(true)}
                showShare={true}
                right={(
                    <button onClick={() => setSaved(s => !s)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Sauvegarder">
                        <BookmarkIcon className={`w-5 h-5 ${saved ? 'text-blue-600 fill-blue-600' : 'text-gray-600'}`} />
                    </button>
                )}
            />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full">
                    {/* En-tête auteur */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
                        <OptimizedImage
                            src={post.profilePic}
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            placeholder="/api/placeholder/40/40"
                            showLoader={false}
                        />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{post.author}</h3>
                            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                        </div>
                        {/* Badge d'état de la mission */}
                        {(() => {
                            // Utiliser service_info ou les données du post pour l'état
                            const stateId = service_info?.state_id || post?.state_id;
                            // Laravel retourne la relation comme etat_mission (snake_case du nom de la relation)
                            const etatData = service_info?.etat_mission || service_info?.etatMission || null;
                            const etat = getEtatMission(stateId, etatData);
                            return (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${etat.color}`}>
                                    {etat.label}
                                </span>
                            );
                        })()}
                    </div>

                    {/* Titre */}
                    <div className="bg-white px-4 pt-4">
                        <h2 className="text-xl font-bold text-gray-900">{post.titre}</h2>
                        {/* {post.category && (
                            <div className="mt-2 flex items-center">
                                <span className="text-xs text-blue-600 font-medium">{post.category}</span>
                            </div>
                        )} */}
                    </div>

                    {/* Image optimisée */}
                    {post.image && (
                        <div className="bg-white mt-3">
                            <div className="relative">
                                <OptimizedImage
                                    src={post.image}
                                    alt={post.titre}
                                    className="w-full h-auto object-cover"
                                    placeholder="/api/placeholder/800/600"
                                    priority={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white px-4 pt-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            <button className={tabClass('resume')} onClick={() => setActiveTab('resume')}>Résumé</button>
                            <button className={tabClass('localisation')} onClick={() => setActiveTab('localisation')}>Localisation</button>
                            <button className={tabClass('budget')} onClick={() => setActiveTab('budget')}>Budget & Durée</button>
                            <button className={tabClass('metiers')} onClick={() => setActiveTab('metiers')}>Métiers</button>
                            <button className={tabClass('lien')} onClick={() => setActiveTab('lien')}>Lien</button>
                        </div>
                    </div>

                    {/* Contenu des tabs */}
                    {activeTab === 'resume' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <p className="text-sm text-gray-800 whitespace-pre-line">{post.details || 'Aucune description'}</p>
                            {post.modeMission && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500">Mode de réalisation</p>
                                    <p className="text-sm font-medium">
                                        {post.modeMission === 'en_ligne' ? 'En ligne' : post.modeMission === 'hybride' ? 'Hybride' : 'Présentiel'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'localisation' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* <div>
                                    <p className="text-xs text-gray-500">Pays</p>
                                    <p className="text-sm font-medium">{post.pays || 'Cameroun'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Région</p>
                                    <p className="text-sm font-medium">{post.region || '—'}</p>
                                </div> */}
                                <div>
                                    <p className="text-xs text-gray-500">Ville</p>
                                    <p className="text-sm font-medium">{post.ville || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Quartier</p>
                                    <p className="text-sm font-medium">{post.quartier || '—'}</p>
                                </div>
                            </div>
                            {post.precision && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500">Précisions</p>
                                    <p className="text-sm text-gray-800">{post.precision}</p>
                                </div>
                            )}

                        </div>
                    )}

                    {activeTab === 'budget' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">Budget</p>
                                    <p className="text-sm font-medium">{post.montant ? `${post.montant} ${post.deviseMonnaie || ''}` : 'À négocier'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Prestataires recherchés</p>
                                    <p className="text-sm font-medium">{post.nbPrestataires || 1} </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Type de durée</p>
                                    <p className="text-sm font-medium">{post.typeDuree || 'ponctuelle'}</p>
                                </div>
                                {post.modeMission && (
                                    <div>
                                        <p className="text-xs text-gray-500">Mode</p>
                                        <p className="text-sm font-medium">{post.modeMission === 'en_ligne' ? 'En ligne' : post.modeMission === 'hybride' ? 'Hybride' : 'Présentiel'}</p>
                                    </div>
                                )}
                                {/*  {post.typeDuree === 'determinee' && (
                                    <div>
                                        <p className="text-xs text-gray-500">Durée estimée</p>
                                        <p className="text-sm font-medium">{post.dureeMois} {post.dureeUnite}</p>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    )}

                    {activeTab === 'metiers' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">


                            <div className="flex flex-wrap gap-2">
                                {service_info.services_metiers && service_info.services_metiers.length > 0 ? (
                                    service_info.services_metiers.map((m, i) => (
                                        <span key={`${m.id || i}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{m.libelle_serviceMetier}</span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Aucun métier spécifié</p>
                                )}
                            </div>

                        </div>
                    )}

                    {activeTab === 'lien' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            {post.lien ? (
                                <a href={post.lien} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                                    <ExternalLink className="w-4 h-4 mr-1" /> Ouvrir le lien fourni
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500">Aucun lien fourni.</p>
                            )}
                        </div>
                    )}

                    {/* Actions principales */}
                    <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                        <button onClick={() => setApplyOpen(o => !o)} className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">Postuler</button>
                        <button onClick={() => setSaved(s => !s)} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2">
                            <BookmarkIcon className={`w-4 h-4 ${saved ? 'text-blue-600 fill-blue-600' : 'text-gray-600'}`} /> Sauvegarder
                        </button>
                        <button onClick={() => setFollowOpen(o => !o)} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2">
                            <Activity className={`w-4 h-4 ${followOpen ? 'text-blue-600' : 'text-gray-600'}`} /> Suivre
                        </button>
                    </div>

                    {/* Formulaire candidature (facultatif) */}
                    {applyOpen && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Votre proposition (facultatif)</label>
                            <textarea
                                value={applyText}
                                onChange={(e) => setApplyText(e.target.value)}
                                rows={4}
                                placeholder="Expliquez brièvement votre approche, disponibilité, tarif..."
                                className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                disabled={submitting}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={submitApplication}
                                    disabled={submitting}
                                    className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 ${submitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Envoyer ma candidature
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Panneau de suivi de mission */}
                    {followOpen && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-gray-900">Suivi d'avancement de la mission</h3>
                                <button
                                    onClick={() => setFollowOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <MissionTimeline
                                etats={etatsMission}
                                currentStateId={service_info?.state_id || post?.state_id || 1}
                                onStateClick={updateMissionState}
                                onCancel={updateMissionState}
                                updating={updatingState}
                                navigate={navigate}
                                missionId={id}
                            />
                        </div>
                    )}

                    {/* Candidats */}
                    <div className="bg-white px-4 py-4 mt-3">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold">Candidatures</h3>
                            {loadingCandidates ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span className="text-xs text-gray-500">Chargement...</span>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-500">{applicants.length} candidat(s)</span>
                            )}
                        </div>
                        <div className="space-y-3">
                            {!loadingCandidates && applicants.length === 0 && (
                                <p className="text-sm text-gray-500">Aucune candidature pour le moment.</p>
                            )}
                            {applicants.map((a) => (
                                <ApplicantCard
                                    key={a.id}
                                    applicant={a}
                                    onContact={() => navigate(`/Services profile?user=${a.user?.id || ''}`)}
                                    onViewProfile={() => navigate(`/Services profile?user=${a.user?.id || ''}`)}
                                    onChoose={() => updateChoice(a.id, a.choise || 0)}
                                    isChosen={(a.choise || 0) === 1}
                                    updating={updatingChoice === a.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} postId={post.id} />
        </div>
    );
}


