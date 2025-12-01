import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, Phone, MessageCircle, Share2, Mail, ExternalLink,
    Instagram, Facebook, Youtube, Music as TikTok, Linkedin, Twitter,
    Briefcase, Award, Users, TrendingUp, Heart, Eye, 
    DollarSign, Package, Camera, Video, Mic, Edit3,
    Building2, Star, CheckCircle, Send, X, Copy, Check,
    Twitch as TwitchIcon, MessageSquare as DiscordIcon,
    Music as SpotifyIcon, Music as AppleMusicIcon, 
    Headphones as SoundCloudIcon, Radio as DeezerIcon,
    Image as PinterestIcon, Ghost as SnapchatIcon,
    BookOpen as MediumIcon, Layers as BehanceIcon,
    Palette as DribbbleIcon
} from 'lucide-react';
import { urlApi, urlServerImage } from '../../../modules/urlApp';
import AuthUser from '../../../modules/AuthUser';
import { OptimizedImage } from '../../../components/OptimizedImage';
import { toast } from '../../../modules/Components/Toast';

// Types de contenu
const CONTENT_TYPES = [
    { id: 'photo', label: 'Photos', icon: Camera, color: 'text-pink-600 bg-pink-100' },
    { id: 'video', label: 'Vidéos', icon: Video, color: 'text-purple-600 bg-purple-100' },
    { id: 'story', label: 'Stories', icon: Edit3, color: 'text-blue-600 bg-blue-100' },
    { id: 'podcast', label: 'Podcasts', icon: Mic, color: 'text-green-600 bg-green-100' },
    { id: 'live', label: 'Lives', icon: TrendingUp, color: 'text-red-600 bg-red-100' },
];

// Types de demandes commerciales
const COMMERCIAL_REQUESTS = [
    { id: 'sponsored_post', label: 'Post sponsorisé', icon: DollarSign },
    { id: 'product_review', label: 'Test produit', icon: Package },
    { id: 'brand_ambassador', label: 'Ambassadeur', icon: Award },
    { id: 'event_coverage', label: 'Couverture événement', icon: Camera },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'affiliate', label: 'Programme d\'affiliation', icon: TrendingUp },
];

// Modal de demande de collaboration
const CollaborationModal = ({ isOpen, onClose, influencer }) => {
    const { http, user } = AuthUser();
    const [formData, setFormData] = useState({
        request_type: '',
        budget: '',
        duration: '',
        description: '',
        company_name: user?.company_name || '',
        contact_email: user?.email || '',
        contact_phone: user?.num_tel_one || '',
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            await http.post(`${urlApi}/influencer/collaboration/request`, {
                ...formData,
                influencer_id: influencer.id,
                requester_id: user.id
            });

            toast.success('Demande envoyée avec succès !', 'Succès');
            onClose();
            setFormData({
                request_type: '',
                budget: '',
                duration: '',
                description: '',
                company_name: user?.company_name || '',
                contact_email: user?.email || '',
                contact_phone: user?.num_tel_one || '',
            });
        } catch (error) {
            console.error('Erreur envoi demande:', error);
            toast.error('Erreur lors de l\'envoi de la demande', 'Erreur');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Demande de collaboration
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type de demande */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de demande *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {COMMERCIAL_REQUESTS.map(req => {
                                const Icon = req.icon;
                                return (
                                    <button
                                        key={req.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, request_type: req.id })}
                                        className={`
                                            p-3 rounded-lg border-2 transition-all text-left
                                            ${formData.request_type === req.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5 mb-1 text-blue-600" />
                                        <p className="text-sm font-medium">{req.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Informations entreprise */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de l'entreprise *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (FCFA) *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email professionnel *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Durée */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durée de la collaboration
                        </label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Sélectionner</option>
                            <option value="one_time">Ponctuelle</option>
                            <option value="1_month">1 mois</option>
                            <option value="3_months">3 mois</option>
                            <option value="6_months">6 mois</option>
                            <option value="1_year">1 an</option>
                            <option value="long_term">Long terme</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description du projet *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Décrivez votre projet, vos objectifs et vos attentes..."
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={sending || !formData.request_type || !formData.budget || !formData.description}
                            className={`
                                flex-1 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2
                                ${sending || !formData.request_type || !formData.budget || !formData.description
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                                }
                            `}
                        >
                            {sending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Envoyer la demande
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal de partage
const ShareModal = ({ isOpen, onClose, influencer }) => {
    const [copied, setCopied] = useState(false);
    const profileUrl = `${window.location.origin}/influencer/${influencer?.id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Lien copié !', 'Succès');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full animate-scaleIn p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Partager le profil</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Lien à copier */}
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Réseaux sociaux */}
                    <div className="grid grid-cols-4 gap-3">
                        <button className="p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                            <Facebook className="w-6 h-6 mx-auto" />
                        </button>
                        <button className="p-4 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors">
                            <Twitter className="w-6 h-6 mx-auto" />
                        </button>
                        <button className="p-4 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                            <Linkedin className="w-6 h-6 mx-auto" />
                        </button>
                        <button className="p-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                            <MessageCircle className="w-6 h-6 mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function InfluencerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { http, user } = AuthUser();

    const [loading, setLoading] = useState(true);
    const [influencer, setInfluencer] = useState(null);
    const [showCollabModal, setShowCollabModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeTab, setActiveTab] = useState('portfolio');

    // Données exemple (à remplacer par API)
    const [influencerData, setInfluencerData] = useState({
        id: 1,
        name: 'Kristin Watson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        coverPhoto: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
        bio: 'Créatrice de contenu lifestyle & mode 💄 | Travel enthusiast ✈️ | Ambassadrice @BrandName 🌟',
        location: 'Yaoundé, Cameroun 🇨🇲',
        agency: 'Digital Creators Agency',
        label: '⭐ Ambassadrice Officielle',
        email: 'kristin.watson@pro.cm',
        phone: '+237 6 XX XX XX XX',
        
        // Statistiques réseaux sociaux et plateformes
        socialStats: [
            { platform: 'instagram', icon: Instagram, followers: '434K', color: 'text-pink-600', bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500', iconType: 'lucide', category: 'social' },
            { platform: 'tiktok', icon: null, followers: '1234K', color: 'text-gray-900', bgColor: 'bg-gray-900', iconType: 'svg', category: 'social' },
            { platform: 'youtube', icon: Youtube, followers: '2034K', color: 'text-red-600', bgColor: 'bg-red-600', iconType: 'lucide', category: 'social' },
            { platform: 'spotify', icon: SpotifyIcon, followers: '567K', color: 'text-green-600', bgColor: 'bg-green-600', iconType: 'lucide', category: 'music' },
            { platform: 'facebook', icon: Facebook, followers: '734K', color: 'text-blue-600', bgColor: 'bg-blue-600', iconType: 'lucide', category: 'social' },
            { platform: 'x', icon: X, followers: '892K', color: 'text-gray-900', bgColor: 'bg-gray-900', iconType: 'lucide', category: 'social' },
            { platform: 'soundcloud', icon: SoundCloudIcon, followers: '234K', color: 'text-orange-600', bgColor: 'bg-orange-600', iconType: 'lucide', category: 'music' },
            { platform: 'twitch', icon: TwitchIcon, followers: '156K', color: 'text-purple-600', bgColor: 'bg-purple-600', iconType: 'lucide', category: 'streaming' },
            { platform: 'pinterest', icon: PinterestIcon, followers: '389K', color: 'text-red-600', bgColor: 'bg-red-600', iconType: 'lucide', category: 'creative' },
            { platform: 'snapchat', icon: SnapchatIcon, followers: '445K', color: 'text-yellow-400', bgColor: 'bg-yellow-400', iconType: 'lucide', category: 'social' },
            { platform: 'discord', icon: DiscordIcon, followers: '89K', color: 'text-indigo-600', bgColor: 'bg-indigo-600', iconType: 'lucide', category: 'community' },
            { platform: 'linkedin', icon: Linkedin, followers: '245K', color: 'text-blue-700', bgColor: 'bg-blue-700', iconType: 'lucide', category: 'professional' },
            { platform: 'apple-music', icon: AppleMusicIcon, followers: '312K', color: 'text-pink-600', bgColor: 'bg-gradient-to-br from-pink-500 to-red-500', iconType: 'lucide', category: 'music' },
            { platform: 'deezer', icon: DeezerIcon, followers: '178K', color: 'text-purple-600', bgColor: 'bg-gradient-to-br from-purple-600 to-indigo-600', iconType: 'lucide', category: 'music' },
            { platform: 'behance', icon: BehanceIcon, followers: '123K', color: 'text-blue-600', bgColor: 'bg-blue-600', iconType: 'lucide', category: 'creative' },
            { platform: 'dribbble', icon: DribbbleIcon, followers: '95K', color: 'text-pink-600', bgColor: 'bg-pink-600', iconType: 'lucide', category: 'creative' },
        ],

        // Types de contenu
        contentTypes: ['photo', 'video', 'story', 'live'],

        // Marques partenaires
        brands: [
            { id: 1, name: 'Vectra', logo: '/api/placeholder/80/80', campaigns: 45 },
            { id: 2, name: 'Optimal', logo: '/api/placeholder/80/80', campaigns: 32 },
            { id: 3, name: 'WAYLINE', logo: '/api/placeholder/80/80', campaigns: 28 },
        ],

        // Portfolio
        portfolio: [
            { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', type: 'photo', views: '125K', likes: '8.2K', title: 'Mode & Style' },
            { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop', type: 'video', views: '250K', likes: '15K', title: 'Shopping Haul' },
            { id: 3, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop', type: 'photo', views: '95K', likes: '6.1K', title: 'Lifestyle' },
            { id: 4, image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=600&fit=crop', type: 'video', views: '180K', likes: '11K', title: 'Travel Vlog' },
            { id: 5, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop', type: 'photo', views: '210K', likes: '13K', title: 'Nature' },
            { id: 6, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop', type: 'photo', views: '167K', likes: '9.5K', title: 'Beauty' },
        ],

        // Tarifs (approximatifs)
        pricing: {
            sponsored_post: '500,000 - 1,000,000',
            story: '150,000 - 300,000',
            video: '1,000,000 - 2,500,000',
            brand_ambassador: 'Sur devis',
        },

        // Statistiques générales
        stats: {
            totalCampaigns: 121,
            engagementRate: '8.5%',
            avgViews: '150K',
            collaborations: 45,
        }
    });

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            setInfluencer(influencerData);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-32">
            {/* Header avec photo de couverture */}
            <div className="relative h-56 md:h-80 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 overflow-hidden">
                {/* Image de couverture */}
                <img 
                    src={influencer.coverPhoto}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-800" />
                </button>

                {/* Bouton partager */}
                <button
                    onClick={() => setShowShareModal(true)}
                    className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                >
                    <Share2 className="w-5 h-5 text-gray-800" />
                </button>
            </div>

            {/* Profil principal */}
            <div className="max-w-7xl mx-auto px-3 md:px-6 -mt-24 pb-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                    {/* Photo et infos principales */}
                    <div className="p-6 md:p-10 text-center relative">
                        <div className="relative inline-block -mt-20">
                            <OptimizedImage
                                src={influencer.avatar}
                                alt={influencer.name}
                                className="w-36 h-36 md:w-44 md:h-44 rounded-full border-6 border-white shadow-2xl object-cover ring-4 ring-purple-100"
                                priority={true}
                            />
                            {/* Badge vérifié */}
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
                                {influencer.name}
                            </h1>
                            
                            {influencer.label && (
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 rounded-full mb-3 border-2 border-orange-200/50 shadow-sm">
                                    <Award className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-bold text-orange-900">{influencer.label}</span>
                                </div>
                            )}
                            
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">{influencer.bio}</p>
                            
                            <div className="flex items-center justify-center gap-4 text-gray-600 text-sm pt-2">
                                {influencer.agency && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">{influencer.agency}</span>
                                    </div>
                                )}
                                {influencer.location && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                                        <span className="font-medium">{influencer.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-wrap gap-3 justify-center mt-8">
                            <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-110 shadow-lg hover:shadow-xl">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all hover:scale-110 shadow-lg hover:shadow-xl">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Statistiques réseaux sociaux et plateformes */}
                    <div className="px-3 md:px-6 pb-8">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-4 md:p-6 border border-gray-200/50">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 text-center">🌐 Présence en ligne</h3>
                            <p className="text-xs text-gray-500 text-center mb-5">Réseaux sociaux • Plateformes musicales • Communautés créatives</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {influencer.socialStats.map((social, index) => {
                                    const Icon = social.icon;
                                    const displayName = 
                                        social.platform === 'x' ? 'X' :
                                        social.platform === 'apple-music' ? 'Apple Music' :
                                        social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
                                    
                                    return (
                                        <div
                                            key={social.platform}
                                            className="text-center p-3 bg-white rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-100 group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className={`w-11 h-11 mx-auto mb-2 ${social.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                {social.iconType === 'svg' && social.platform === 'tiktok' ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16 3c1.1 1.7 2.8 2.9 4.7 3.2v3.1c-1.7-.1-3.3-.7-4.7-1.7v6.2c0 3.8-3.1 6.9-6.9 6.9S2.2 17.6 2.2 13.8c0-3.5 2.6-6.4 6-6.8v3.2c-1.7.4-2.9 1.9-2.9 3.6 0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6V3h3.5z" />
                                                    </svg>
                                                ) : (
                                                    <Icon className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                            <p className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">{social.followers}</p>
                                            <p className="text-[10px] text-gray-500 font-medium leading-tight">
                                                {displayName}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Légende des catégories */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap justify-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                                        <span className="text-gray-600">Réseaux sociaux</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                        <span className="text-gray-600">Musique</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                        <span className="text-gray-600">Streaming</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-pink-600"></div>
                                        <span className="text-gray-600">Créatif</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                                        <span className="text-gray-600">Professionnel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Marques travaillées */}
                    <div className="px-3 md:px-6 pb-8">
                        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100/50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    🤝 Marques Partenaires
                                </h3>
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-blue-200 shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">
                                        <span className="text-2xl font-bold text-blue-600">{influencer.stats.totalCampaigns}</span>
                                        {' '}campagnes
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                {influencer.brands.map(brand => (
                                    <div
                                        key={brand.id}
                                        className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 border border-gray-100"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                                            <Briefcase className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <p className="text-base font-bold text-center text-gray-900 mb-1">{brand.name}</p>
                                        <p className="text-xs text-gray-500 text-center font-medium">{brand.campaigns} campagnes</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Types de contenu */}
                    <div className="px-3 md:px-6 pb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            🎬 Styles de Contenu
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {CONTENT_TYPES.filter(ct => influencer.contentTypes.includes(ct.id)).map(contentType => {
                                const Icon = contentType.icon;
                                return (
                                    <div
                                        key={contentType.id}
                                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl ${contentType.color} hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md border-2 border-white/50`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-bold">{contentType.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Portfolio Showcase */}
                    <div className="px-3 md:px-6 pb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                🎨 Portfolio Showcase
                            </h3>
                            <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">
                                Voir tout
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {influencer.portfolio.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title || `Portfolio ${item.id}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* Overlay gradient permanent */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    
                                    {/* Overlay hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                            <p className="font-bold text-lg mb-2">{item.title}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                    <Eye className="w-4 h-4" />
                                                    {item.views}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                    <Heart className="w-4 h-4" />
                                                    {item.likes}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Badge type */}
                                    <div className="absolute top-4 right-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm">
                                            {item.type === 'video' ? (
                                                <Video className="w-6 h-6 text-white" />
                                            ) : (
                                                <Camera className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistiques d'engagement */}
                    <div className="px-3 md:px-6 pb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            📊 Statistiques & Performance
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 text-center border border-blue-200/50 hover:shadow-lg transition-all hover:scale-105">
                                <TrendingUp className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-gray-900 mb-1">{influencer.stats.engagementRate}</p>
                                <p className="text-xs text-gray-600 font-medium">Taux d'engagement</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center border border-purple-200/50 hover:shadow-lg transition-all hover:scale-105">
                                <Eye className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-gray-900 mb-1">{influencer.stats.avgViews}</p>
                                <p className="text-xs text-gray-600 font-medium">Vues moyennes</p>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-6 text-center border border-pink-200/50 hover:shadow-lg transition-all hover:scale-105">
                                <Users className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-gray-900 mb-1">{influencer.stats.collaborations}</p>
                                <p className="text-xs text-gray-600 font-medium">Collaborations</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 text-center border border-green-200/50 hover:shadow-lg transition-all hover:scale-105">
                                <Star className="w-10 h-10 text-green-600 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-gray-900 mb-1">4.9/5</p>
                                <p className="text-xs text-gray-600 font-medium">Note moyenne</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact professionnel */}
                    <div className="px-3 md:px-6 pb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            📧 Contact Professionnel
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <a
                                href={`mailto:${influencer.email}`}
                                className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl hover:shadow-lg transition-all hover:scale-[1.02] border border-blue-200/50"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Email professionnel</p>
                                    <p className="text-gray-900 font-semibold text-sm">{influencer.email}</p>
                                </div>
                            </a>
                            <a
                                href={`tel:${influencer.phone}`}
                                className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl hover:shadow-lg transition-all hover:scale-[1.02] border border-green-200/50"
                            >
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Téléphone</p>
                                    <p className="text-gray-900 font-semibold text-sm">{influencer.phone}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bouton flottant de collaboration */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-40 pointer-events-none">
                <div className="max-w-7xl mx-auto pointer-events-auto">
                    <button 
                        onClick={() => setShowCollabModal(true)}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Briefcase className="w-6 h-6" />
                        Demander une collaboration
                    </button>
                </div>
            </div>

            {/* Modals */}
            <CollaborationModal
                isOpen={showCollabModal}
                onClose={() => setShowCollabModal(false)}
                influencer={influencer}
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                influencer={influencer}
            />

            {/* Styles d'animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

