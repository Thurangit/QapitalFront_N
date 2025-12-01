import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Wallet, CreditCard, Smartphone, HandCoins, 
    Check, X, User, AlertCircle, Loader2, CheckCircle2,
    DollarSign, Users
} from 'lucide-react';
import { urlApi, urlServerImage } from '../../../modules/urlApp';
import AuthUser from '../../../modules/AuthUser';
import { OptimizedImage } from '../../../components/OptimizedImage';
import { toast } from '../../../modules/Components/Toast';

const PAYMENT_MODES = {
    PLATFORM: 'platform',
    EXTERNAL: 'external'
};

const PLATFORM_METHODS = {
    BALANCE: 'balance',
    ORANGE: 'orange_money',
    MTN: 'mtn_mobile_money'
};

const EXTERNAL_METHODS = {
    CASH: 'cash',
    MOBILE: 'mobile'
};

const PaymentMethodCard = ({ 
    id, 
    title, 
    description, 
    icon: Icon, 
    selected, 
    onClick, 
    disabled = false,
    balance = null 
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            w-full p-4 rounded-xl border-2 transition-all duration-300
            ${selected 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
            flex items-center gap-4
        `}
    >
        <div className={`
            p-3 rounded-lg
            ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
        `}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
            <h3 className={`font-semibold ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
                {title}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
            {balance !== null && (
                <p className="text-xs text-gray-600 mt-1 font-medium">
                    Solde disponible: {balance.toLocaleString('fr-FR')} FCFA
                </p>
            )}
        </div>
        {selected && <Check className="w-6 h-6 text-blue-500" />}
    </button>
);

const BeneficiaryItem = ({ 
    applicant, 
    selected, 
    amount, 
    onToggle, 
    onAmountChange,
    isGroupPayment 
}) => (
    <div className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${selected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-white'
        }
    `}>
        <div className="flex items-center gap-4">
            {!isGroupPayment && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
            )}
            
            <OptimizedImage
                src={applicant.photo ? `${urlServerImage}/${applicant.photo}` : '/api/placeholder/50/50'}
                alt={applicant.nom}
                className="w-12 h-12 rounded-full object-cover"
                placeholder="/api/placeholder/50/50"
            />
            
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                    {applicant.nom} {applicant.prenom}
                </h4>
                <p className="text-sm text-gray-500">{applicant.email}</p>
            </div>
            
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(applicant.id, e.target.value)}
                    disabled={!selected && !isGroupPayment}
                    placeholder="Montant"
                    className={`
                        w-32 px-3 py-2 rounded-lg border-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${!selected && !isGroupPayment ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                />
                <span className="text-sm text-gray-600">FCFA</span>
            </div>
        </div>
    </div>
);

export default function PaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { http, user } = AuthUser();
    
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [missionData, setMissionData] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [userBalance, setUserBalance] = useState(0);
    
    // États de paiement
    const [paymentMode, setPaymentMode] = useState(null); // 'platform' ou 'external'
    const [paymentMethod, setPaymentMethod] = useState(null); // méthode spécifique
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(new Set());
    const [amounts, setAmounts] = useState({});
    const [externalNote, setExternalNote] = useState('');
    
    // Charger les données de la mission
    useEffect(() => {
        const loadMissionData = async () => {
            try {
                const [missionRes, candidatesRes, balanceRes] = await Promise.all([
                    http.get(`${urlApi}/service/info/${id}`),
                    http.get(`${urlApi}/service/candidature/all/${id}`),
                    http.get(`${urlApi}/user/balance/${user.id}`)
                ]);
                
                setMissionData(missionRes.data);
                
                // Filtrer uniquement les candidats acceptés
                const acceptedApplicants = (candidatesRes.data || []).filter(
                    app => app.statut === 'accepté' || app.statut === 'accepted'
                );
                setApplicants(acceptedApplicants);
                
                setUserBalance(balanceRes.data?.balance || 0);
                
                // Initialiser les montants avec le budget de la mission divisé par le nombre de bénéficiaires
                const defaultAmount = Math.floor(
                    (missionRes.data?.budget || 0) / acceptedApplicants.length
                );
                const initialAmounts = {};
                acceptedApplicants.forEach(app => {
                    initialAmounts[app.id] = defaultAmount;
                });
                setAmounts(initialAmounts);
                
            } catch (error) {
                console.error('Erreur chargement données:', error);
                toast.error('Erreur lors du chargement des données', 'Erreur');
            } finally {
                setLoading(false);
            }
        };
        
        loadMissionData();
    }, [id, user.id]);
    
    // Basculer la sélection d'un bénéficiaire
    const toggleBeneficiary = (applicantId) => {
        const newSelected = new Set(selectedBeneficiaries);
        if (newSelected.has(applicantId)) {
            newSelected.delete(applicantId);
        } else {
            newSelected.add(applicantId);
        }
        setSelectedBeneficiaries(newSelected);
    };
    
    // Mettre à jour le montant d'un bénéficiaire
    const updateAmount = (applicantId, value) => {
        setAmounts({
            ...amounts,
            [applicantId]: parseFloat(value) || 0
        });
    };
    
    // Sélectionner un mode de paiement
    const selectPaymentMode = (mode) => {
        setPaymentMode(mode);
        setPaymentMethod(null);
        
        // Si paiement plateforme, sélectionner tous les bénéficiaires
        if (mode === PAYMENT_MODES.PLATFORM) {
            setSelectedBeneficiaries(new Set(applicants.map(app => app.id)));
        }
    };
    
    // Calculer le total à payer
    const calculateTotal = () => {
        if (paymentMode === PAYMENT_MODES.PLATFORM) {
            // Paiement groupé : tous les bénéficiaires
            return applicants.reduce((sum, app) => sum + (amounts[app.id] || 0), 0);
        } else {
            // Paiement individuel : uniquement les sélectionnés
            return Array.from(selectedBeneficiaries).reduce(
                (sum, id) => sum + (amounts[id] || 0), 
                0
            );
        }
    };
    
    // Vérifier si le paiement est valide
    const isPaymentValid = () => {
        if (!paymentMode || !paymentMethod) return false;
        
        if (paymentMode === PAYMENT_MODES.PLATFORM) {
            // Tous les bénéficiaires doivent avoir un montant
            const allHaveAmount = applicants.every(app => amounts[app.id] > 0);
            if (!allHaveAmount) return false;
            
            // Vérifier le solde suffisant pour le solde
            if (paymentMethod === PLATFORM_METHODS.BALANCE && calculateTotal() > userBalance) {
                return false;
            }
        } else {
            // Au moins un bénéficiaire sélectionné
            if (selectedBeneficiaries.size === 0) return false;
            
            // Tous les sélectionnés doivent avoir un montant
            const allSelectedHaveAmount = Array.from(selectedBeneficiaries).every(
                id => amounts[id] > 0
            );
            if (!allSelectedHaveAmount) return false;
        }
        
        return true;
    };
    
    // Traiter le paiement
    const processPayment = async () => {
        if (!isPaymentValid()) {
            toast.error('Veuillez remplir tous les champs requis', 'Erreur');
            return;
        }
        
        setProcessing(true);
        
        try {
            // Préparer les données de paiement
            const beneficiaries = paymentMode === PAYMENT_MODES.PLATFORM
                ? applicants.map(app => ({
                    applicant_id: app.id,
                    user_id: app.user_id,
                    amount: amounts[app.id]
                }))
                : Array.from(selectedBeneficiaries).map(id => {
                    const app = applicants.find(a => a.id === id);
                    return {
                        applicant_id: app.id,
                        user_id: app.user_id,
                        amount: amounts[id]
                    };
                });
            
            const paymentData = {
                mission_id: id,
                payment_mode: paymentMode,
                payment_method: paymentMethod,
                beneficiaries: beneficiaries,
                total_amount: calculateTotal(),
                note: externalNote || null,
                user_id: user.id
            };
            
            // Envoyer le paiement
            await http.post(`${urlApi}/payment/process`, paymentData);
            
            toast.success('Paiement effectué avec succès !', 'Succès');
            
            // Rediriger vers la page de détails
            setTimeout(() => {
                navigate(`/post/${id}`);
            }, 1500);
            
        } catch (error) {
            console.error('Erreur paiement:', error);
            toast.error(
                error.response?.data?.message || 'Erreur lors du paiement',
                'Erreur'
            );
        } finally {
            setProcessing(false);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des informations...</p>
                </div>
            </div>
        );
    }
    
    const total = calculateTotal();
    const isGroupPayment = paymentMode === PAYMENT_MODES.PLATFORM;
    
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">
                                Effectuer un paiement
                            </h1>
                            <p className="text-sm text-gray-500">
                                Mission: {missionData?.titre || 'Chargement...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Étape 1: Mode de paiement */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            1
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Choisissez le mode de paiement
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PaymentMethodCard
                            id={PAYMENT_MODES.PLATFORM}
                            title="Paiement sur la plateforme"
                            description="Payer tous les bénéficiaires en une fois"
                            icon={Wallet}
                            selected={paymentMode === PAYMENT_MODES.PLATFORM}
                            onClick={() => selectPaymentMode(PAYMENT_MODES.PLATFORM)}
                        />
                        
                        <PaymentMethodCard
                            id={PAYMENT_MODES.EXTERNAL}
                            title="Paiement hors plateforme"
                            description="Paiement individuel (cash ou mobile)"
                            icon={HandCoins}
                            selected={paymentMode === PAYMENT_MODES.EXTERNAL}
                            onClick={() => selectPaymentMode(PAYMENT_MODES.EXTERNAL)}
                        />
                    </div>
                </div>
                
                {/* Étape 2: Méthode de paiement */}
                {paymentMode && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                2
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {paymentMode === PAYMENT_MODES.PLATFORM 
                                    ? 'Choisissez votre moyen de paiement'
                                    : 'Sélectionnez le type de paiement'
                                }
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {paymentMode === PAYMENT_MODES.PLATFORM ? (
                                <>
                                    <PaymentMethodCard
                                        id={PLATFORM_METHODS.BALANCE}
                                        title="Solde compte"
                                        description="Payer avec votre solde"
                                        icon={Wallet}
                                        balance={userBalance}
                                        selected={paymentMethod === PLATFORM_METHODS.BALANCE}
                                        onClick={() => setPaymentMethod(PLATFORM_METHODS.BALANCE)}
                                        disabled={userBalance < total && total > 0}
                                    />
                                    
                                    <PaymentMethodCard
                                        id={PLATFORM_METHODS.ORANGE}
                                        title="Orange Money"
                                        description="Payer via Orange Money"
                                        icon={Smartphone}
                                        selected={paymentMethod === PLATFORM_METHODS.ORANGE}
                                        onClick={() => setPaymentMethod(PLATFORM_METHODS.ORANGE)}
                                    />
                                    
                                    <PaymentMethodCard
                                        id={PLATFORM_METHODS.MTN}
                                        title="MTN Mobile Money"
                                        description="Payer via MTN"
                                        icon={CreditCard}
                                        selected={paymentMethod === PLATFORM_METHODS.MTN}
                                        onClick={() => setPaymentMethod(PLATFORM_METHODS.MTN)}
                                    />
                                </>
                            ) : (
                                <>
                                    <PaymentMethodCard
                                        id={EXTERNAL_METHODS.CASH}
                                        title="Paiement en main"
                                        description="Espèces"
                                        icon={HandCoins}
                                        selected={paymentMethod === EXTERNAL_METHODS.CASH}
                                        onClick={() => setPaymentMethod(EXTERNAL_METHODS.CASH)}
                                    />
                                    
                                    <PaymentMethodCard
                                        id={EXTERNAL_METHODS.MOBILE}
                                        title="Paiement mobile"
                                        description="Transfert mobile"
                                        icon={Smartphone}
                                        selected={paymentMethod === EXTERNAL_METHODS.MOBILE}
                                        onClick={() => setPaymentMethod(EXTERNAL_METHODS.MOBILE)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Étape 3: Bénéficiaires et montants */}
                {paymentMode && paymentMethod && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                3
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {isGroupPayment 
                                    ? 'Vérifiez les montants à payer'
                                    : 'Sélectionnez les bénéficiaires et montants'
                                }
                            </h2>
                        </div>
                        
                        {isGroupPayment && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-900">
                                    En paiement groupé, tous les bénéficiaires acceptés seront payés en une seule transaction.
                                </p>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            {applicants.map(applicant => (
                                <BeneficiaryItem
                                    key={applicant.id}
                                    applicant={applicant}
                                    selected={isGroupPayment || selectedBeneficiaries.has(applicant.id)}
                                    amount={amounts[applicant.id] || 0}
                                    onToggle={() => toggleBeneficiary(applicant.id)}
                                    onAmountChange={updateAmount}
                                    isGroupPayment={isGroupPayment}
                                />
                            ))}
                        </div>
                        
                        {/* Note pour paiement externe */}
                        {paymentMode === PAYMENT_MODES.EXTERNAL && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note / Référence (optionnel)
                                </label>
                                <textarea
                                    value={externalNote}
                                    onChange={(e) => setExternalNote(e.target.value)}
                                    placeholder="Ajoutez une note ou référence de paiement..."
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Résumé et confirmation */}
                {paymentMode && paymentMethod && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Résumé du paiement
                        </h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Mode de paiement:</span>
                                <span className="font-medium">
                                    {paymentMode === PAYMENT_MODES.PLATFORM 
                                        ? 'Sur la plateforme' 
                                        : 'Hors plateforme'
                                    }
                                </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Méthode:</span>
                                <span className="font-medium">
                                    {paymentMethod === PLATFORM_METHODS.BALANCE && 'Solde compte'}
                                    {paymentMethod === PLATFORM_METHODS.ORANGE && 'Orange Money'}
                                    {paymentMethod === PLATFORM_METHODS.MTN && 'MTN Mobile Money'}
                                    {paymentMethod === EXTERNAL_METHODS.CASH && 'Paiement en main'}
                                    {paymentMethod === EXTERNAL_METHODS.MOBILE && 'Paiement mobile'}
                                </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Nombre de bénéficiaires:</span>
                                <span className="font-medium">
                                    {isGroupPayment 
                                        ? applicants.length 
                                        : selectedBeneficiaries.size
                                    }
                                </span>
                            </div>
                            
                            <div className="pt-3 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total à payer:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {total.toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Avertissement solde insuffisant */}
                        {paymentMethod === PLATFORM_METHODS.BALANCE && total > userBalance && (
                            <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-900 font-medium">
                                        Solde insuffisant
                                    </p>
                                    <p className="text-sm text-red-700 mt-1">
                                        Votre solde actuel est de {userBalance.toLocaleString('fr-FR')} FCFA.
                                        Veuillez recharger votre compte ou choisir un autre moyen de paiement.
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <button
                            onClick={processPayment}
                            disabled={!isPaymentValid() || processing}
                            className={`
                                w-full py-4 rounded-xl font-bold text-white
                                flex items-center justify-center gap-3
                                transition-all duration-300
                                ${isPaymentValid() && !processing
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }
                            `}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Confirmer le paiement
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

