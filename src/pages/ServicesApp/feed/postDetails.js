import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, BookmarkIcon, ArrowLeft, Send, MessageCircle, MessageSquare, User, Star, ExternalLink, X, Linkedin, Facebook, Instagram, Mail } from 'lucide-react';
import AuthUser from '../../../modules/AuthUser';
import { urlApi, urlPublicAPi } from '../../../modules/urlApp';
import TopBar from '../../../modules/Components/topBar';

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

const Rating = ({ value = 0 }) => {
    const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i < Math.round(value)), [value]);
    return (
        <div className="flex items-center">
            {stars.map((filled, idx) => (
                <Star key={idx} className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

const ApplicantCard = ({ applicant, onContact, onViewProfile }) => {
    const u = applicant.user || {};
    return (
        <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
            <img src={u.photo || '/api/placeholder/64/64'} alt={u.nom || 'user'} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">{[u.nom, u.prenom].filter(Boolean).join(' ') || 'Utilisateur'}</h4>
                            <Rating value={u.note || 0} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{u.qualification || 'Qualification non renseignée'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onContact} className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> Contacter
                        </button>
                        <button onClick={onViewProfile} className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                            <User className="w-3 h-3" /> Profil
                        </button>
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
    const { http } = AuthUser();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [saved, setSaved] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [applyText, setApplyText] = useState('');
    const [service_info, setservice_info] = useState([]);
    useEffect(() => {
        fetchAllservice_info();
    }, []);

    const fetchAllservice_info = () => {
        http.get(`${urlApi}/service/info/${id}`).then(res => {
            setservice_info(res.data);
        })
    }
    console.log("Test")
    console.log(service_info)
    const getMockPost = (mockId) => ({
        id: service_info.id,
        titre: service_info.titre,
        details: service_info.details,
        image: `${urlPublicAPi}/${service_info.image}`,
        created_at: new Date().toISOString(),
        author: "Client Anonyme",
        profilePic: "/api/placeholder/40/40",
        category: "/électricité",
        // Champs supplémentaires issus de la création d'offre
        ville: "Douala",
        quartier: "Bonamoussadi",
        precision: "Immeuble bleu, 3e étage, porte à gauche",
        pays: "Cameroun",
        region: "Littoral",
        montant: service_info.montant,
        deviseMonnaie: service_info.devise,
        typeDuree: "determinee",
        dureeMois: 2,
        dureeUnite: "semaines",
        metierSelectionnes: ["Électricien"],
        nbPrestataires: 1,
        typeDemandeur: "personne",
        lien: service_info.lienhttp,
        coordonnees: { lat: 4.081, lng: 9.767 },
    });

    const getMockApplicants = () => ([
        {
            id: 101,
            message: "Je peux passer aujourd'hui à partir de 16h. J'apporterai mon multimètre et de quoi sécuriser le circuit.",
            user: {
                id: 9001,
                nom: "Kamdem",
                prenom: "Paul",
                qualification: "Électricien certifié (5 ans d'expérience)",
                note: 4.5,
                photo: "https://i.pravatar.cc/64?img=11",
            },
        },
        {
            id: 102,
            message: "Disponible demain matin. Je propose un diagnostic rapide et une réparation le jour même si pièces disponibles.",
            user: {
                id: 9002,
                nom: "Nana",
                prenom: "Brigitte",
                qualification: "Technicienne électricienne résidentielle",
                note: 4.8,
                photo: "https://i.pravatar.cc/64?img=15",
            },
        },
        {
            id: 103,
            message: "J'interviens souvent à Bonamoussadi. Intervention ce soir possible. Garantie 30 jours.",
            user: {
                id: 9003,
                nom: "Mvoula",
                prenom: "Hervé",
                qualification: "Artisan électricien",
                note: 4.2,
                photo: "https://i.pravatar.cc/64?img=18",
            },
        },
    ]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const [postRes, appsRes] = await Promise.all([
                    http.get(`${urlApi}/service/${id}`).catch(() => ({ data: {} })),
                    http.get(`${urlApi}/service/${id}/applications`).catch(() => ({ data: [] })),
                ]);
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
                    coordonnees: { lat: p.latitude, lng: p.longitude },
                };
                const hasRealPost = !!(p && (p.titre || p.title || p.description || p.details));
                setPost(hasRealPost ? mapped : getMockPost(id));
                const appsFetched = (appsRes.data || []).map((a) => ({
                    id: a.id,
                    message: a.message || a.commentaire,
                    user: a.user || {
                        id: a.user_id,
                        nom: a.nom || 'Nom',
                        prenom: a.prenom || 'Prénom',
                        qualification: a.qualification || 'Non renseignée',
                        note: a.note || 0,
                        photo: a.photo || '/api/placeholder/64/64',
                    },
                }));
                setApplicants(appsFetched.length ? appsFetched : getMockApplicants());
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [http, id]);

    const submitApplication = async () => {
        try {
            await http.post(`${urlApi}/service/${id}/apply`, { message: applyText || undefined });
            setApplyText('');
            setApplyOpen(false);
            // refresh applicants
            const appsRes = await http.get(`${urlApi}/service/${id}/applications`).catch(() => ({ data: [] }));
            const apps = (appsRes.data || []).map((a) => ({
                id: a.id,
                message: a.message || a.commentaire,
                user: a.user || {
                    id: a.user_id,
                    nom: a.nom || 'Nom',
                    prenom: a.prenom || 'Prénom',
                    qualification: a.qualification || 'Non renseignée',
                    note: a.note || 0,
                    photo: a.photo || '/api/placeholder/64/64',
                },
            }));
            setApplicants(apps);
        } catch (e) {
            // noop UI toast could be added
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
                        {post.category && (
                            <div className="mt-2 flex items-center">
                                <span className="text-xs text-blue-600 font-medium">{post.category}</span>
                            </div>
                        )}
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
                        </div>
                    )}

                    {activeTab === 'localisation' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">Pays</p>
                                    <p className="text-sm font-medium">{post.pays || 'Cameroun'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Région</p>
                                    <p className="text-sm font-medium">{post.region || '—'}</p>
                                </div>
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
                            {post.coordonnees && (post.coordonnees.lat || post.coordonnees.lng) && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500">Coordonnées GPS</p>
                                    <p className="text-sm font-mono text-gray-700">{post.coordonnees.lat}, {post.coordonnees.lng}</p>
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
                                    <p className="text-sm font-medium">{post.nbPrestataires || 1} ({post.typeDemandeur || 'tous'})</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Type de durée</p>
                                    <p className="text-sm font-medium">{post.typeDuree || 'ponctuelle'}</p>
                                </div>
                                {post.typeDuree === 'determinee' && (
                                    <div>
                                        <p className="text-xs text-gray-500">Durée estimée</p>
                                        <p className="text-sm font-medium">{post.dureeMois} {post.dureeUnite}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'metiers' && (
                        <div className="bg-white px-4 py-4 border-b border-gray-200">
                            {Array.isArray(post.metierSelectionnes) && post.metierSelectionnes.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {post.metierSelectionnes.map((m, i) => (
                                        <span key={`${m}-${i}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{m}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Aucun corps de métier spécifié.</p>
                            )}
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
                            <textarea value={applyText} onChange={(e) => setApplyText(e.target.value)} rows={4} placeholder="Expliquez brièvement votre approche, disponibilité, tarif..." className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
                            <div className="flex justify-end mt-2">
                                <button onClick={submitApplication} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Envoyer la candidature
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


