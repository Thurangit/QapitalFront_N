import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, BookmarkIcon, ArrowLeft, Send, MessageCircle, MessageSquare, User, Star, ExternalLink, X, Linkedin, Facebook, Instagram, Mail } from 'lucide-react';
import AuthUser from '../../../modules/AuthUser';
import { urlApi, urlPublicAPi, urlServerImage } from '../../../modules/urlApp';
import TopBar from '../../../modules/Components/topBar';
import { toast } from '../../../modules/Components/Toast';

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

const ApplicantCard = ({ applicant, onContact, onViewProfile }) => {
    const u = applicant.user || {};
    const photoUrl = u.photo?.startsWith('http')
        ? u.photo
        : u.photo
            ? `${urlServerImage}/${u.photo}`
            : '/api/placeholder/64/64';
    return (
        <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
            <img src={photoUrl} alt={u.nom || 'user'} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-sm font-semibold">{[u.nom, u.prenom].filter(Boolean).join(' ') || 'Utilisateur'}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{u.qualification || 'Qualification non renseignée'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <button onClick={onContact} className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> Contacter
                            </button>
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

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { http, user } = AuthUser();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [saved, setSaved] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [applyText, setApplyText] = useState('');
    const [service_info, setservice_info] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchAllservice_info = () => {
        http.get(`${urlApi}/service/info/${id}`).then(res => {
            setservice_info(res.data);
        }).catch(err => {
            console.error("Erreur lors du chargement des informations du service:", err);
        });
    }

    const fetchAllCandidates = async () => {
        try {
            const appsRes = await http.get(`${urlApi}/service/candidature/all/${id}`).catch(() => ({ data: [] }));
            const allCandidates = Array.isArray(appsRes.data) ? appsRes.data : [];
            console.log(allCandidates)
            // Filtrer les candidatures pour cette publication spécifique
            const filteredCandidates = allCandidates.filter(candidate => {
                const candidateServiceId = candidate.id_service || candidate.id_post || candidate.post_id || candidate.service_id;
                return candidateServiceId === id || candidateServiceId === parseInt(id) || String(candidateServiceId) === String(id);
            });

            if (filteredCandidates.length > 0) {
                const apps = await Promise.all(filteredCandidates.map(async (a) => {
                    // Prendre les informations renvoyées par l'API backend (clé "prestataire")
                    const userInfo = a.prestataire || a.user || {};

                    return {
                        id: a.id,
                        message: a.commentaire_prestataire || a.message || a.commentaire || '',
                        user: {
                            id: a.id_prestataire || a.user_id || a.prestataire_id || userInfo.id,
                            nom: userInfo.nom || 'Nom',
                            prenom: userInfo.prenom || 'Prénom',
                            qualification: userInfo.qualification || 'Non renseignée',
                            note: (typeof userInfo.note_user !== 'undefined' ? Number(userInfo.note_user) : (typeof a.note !== 'undefined' ? Number(a.note) : 0)) || 0,
                            photo: userInfo.avatar || userInfo.photo || '/api/placeholder/64/64',
                        },
                    };
                }));

                setApplicants(apps);
            } else {
                // Si aucune candidature réelle, utiliser les données mockées uniquement en développement
                setApplicants([]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des candidatures:", error);
            setApplicants([]);
        }
    }

    useEffect(() => {
        fetchAllservice_info();
        fetchAllCandidates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const getMockPost = (mockId) => ({
        id: service_info.id,
        titre: service_info.titre,
        details: service_info.details,
        image: `${urlPublicAPi}/${service_info.image}`,
        created_at: service_info?.created_at,
        author: `${service_info?.user?.nom} ${service_info?.user?.prenom}`,
        profilePic: `${urlServerImage}/${service_info?.user?.avatar}`,
        category: "/électricité",
        // Champs supplémentaires issus de la création d'offre
        ville: service_info?.ville,
        quartier: service_info?.quartier,
        precision: service_info?.description_position,
        pays: service_info?.pays,
        region: "Littoral",
        montant: service_info.montant,
        deviseMonnaie: service_info.devise,
        typeDuree: service_info?.type_duree_postservice,
        dureeMois: 2,
        dureeUnite: service_info?.type_duree_postservice,
        metierSelectionnes: ["Électricien", "Technicien courant faible", "Installateur panneaux solaires"],
        nbPrestataires: service_info?.nombre_prestataire,
        typeDemandeur: "personne",
        lien: service_info.lienhttp,
        coordonnees: { lat: 4.081, lng: 9.767 },
    });


    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const postRes = await http.get(`${urlApi}/service/${id}`).catch(() => ({ data: {} }));
                if (!mounted) return;
                const p = postRes.data || {};
                // mapping fallback to match feed fields
                const mapped = {
                    id: p.id || id,
                    titre: p.titre || p.title || 'Titre du service',
                    details: p.details || p.description || '',
                    image: p.image || p.photo || null,
                    created_at: p.created_at || p.date || new Date().toISOString(),
                    author: (p.author && (p.author.nom || p.author.name)) || p.user_name || 'Auteur',
                    profilePic: (p.author && p.author.photo) || p.profilePic || '/api/placeholder/40/40',
                    category: p.category || p.categorie || undefined,
                    ville: p.ville,
                    quartier: p.quartier,
                    precision: p.precision,
                    pays: p.pays,
                    region: p.region,
                    montant: p.montant,
                    deviseMonnaie: p.deviseMonnaie,
                    typeDuree: p.typeDuree,
                    dureeMois: p.dureeMois,
                    dureeUnite: p.dureeUnite,
                    metierSelectionnes: p.metierSelectionnes || [],
                    nbPrestataires: p.nbPrestataires,
                    typeDemandeur: p.typeDemandeur,
                    lien: p.lien,
                    modeMission: p.modeMission || p.mode_mission || p.type_mission || undefined,
                };
                const hasRealPost = !!(p && (p.titre || p.title || p.description || p.details));
                // Si les données réelles ne sont pas disponibles, utiliser service_info comme fallback
                const finalPost = hasRealPost ? mapped : (service_info && service_info.id ? getMockPost(id) : mapped);
                setPost(finalPost);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [http, id, service_info]);

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

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="px-3 py-2 flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Chargement...</h1>
                    </div>
                </header>
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

    if (!post) {
        return (
            <div className="p-6">
                <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md bg-gray-100">Retour</button>
                <p className="mt-4 text-gray-600">Offre introuvable.</p>
            </div>
        );
    }

    const tabClass = (key) => `px-3 py-2 text-sm rounded-full border ${activeTab === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
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
                        <img src={post.profilePic} alt={post.author} className="w-10 h-10 rounded-full object-cover mr-3" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{post.author}</h3>
                            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                        </div>
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

                    {/* Image */}
                    {post.image && (
                        <div className="bg-white mt-3">
                            <div className="relative">
                                <img src={`${post.image}`} alt={post.titre} className="w-full h-auto object-cover" />

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
                        <button onClick={() => setShareOpen(true)} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-gray-600" /> Partager
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

                    {/* Candidats */}
                    <div className="bg-white px-4 py-4 mt-3">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold">Candidatures</h3>
                            <span className="text-xs text-gray-500">{applicants.length} candidat(s)</span>
                        </div>
                        <div className="space-y-3">
                            {applicants.length === 0 && (
                                <p className="text-sm text-gray-500">Aucune candidature pour le moment.</p>
                            )}
                            {applicants.map((a) => (
                                <ApplicantCard
                                    key={a.id}
                                    applicant={a}
                                    onContact={() => navigate(`/Services profile?user=${a.user?.id || ''}`)}
                                    onViewProfile={() => navigate(`/Services profile?user=${a.user?.id || ''}`)}
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


