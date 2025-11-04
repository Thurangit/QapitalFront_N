import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import TopBar from '../../../modules/Components/topBar';

const PLANS = [
    {
        code: 'user',
        title: 'Utilisateur',
        price: 'Gratuit',
        features: [
            'Accès aux offres publiques',
            'Publication de demandes basiques',
            'Messagerie limitée'
        ]
    },
    {
        code: 'pro',
        title: 'Pro',
        price: '2 500 XAF/mois',
        features: [
            'Priorité sur les offres',
            'Statistiques basiques',
            'Support standard'
        ]
    },
    {
        code: 'pro_premium',
        title: 'Pro Premium',
        price: '7 500 XAF/mois',
        features: [
            'Mise en avant premium',
            'Statistiques avancées',
            'Réponses rapides priorisées'
        ]
    },
    {
        code: 'entreprise',
        title: 'Entreprise',
        price: '25 000 XAF/mois',
        features: [
            'Gestion d’équipe',
            'Multi-profils',
            'Support prioritaire'
        ]
    },
    {
        code: 'entreprise_premium',
        title: 'Entreprise Premium',
        price: '59 000 XAF/mois',
        features: [
            'Mise en avant nationale',
            'Tableau de bord dédié',
            'CSM dédié'
        ]
    }
];

export default function ProfileTypePage() {
    const [current, setCurrent] = useState('user');

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar title={"Type de profil"} onBack={() => window.history.back()} onShare={() => { }} showShare={true} />
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-xl font-bold mb-3">Type de profil</h1>
                <p className="text-sm text-gray-600 mb-4">Votre type actuel: <span className="font-semibold">{PLANS.find(p => p.code === current)?.title}</span></p>

                <div className="grid grid-cols-1 gap-3">
                    {PLANS.map(plan => (
                        <div key={plan.code} className={`rounded-lg border ${current === plan.code ? 'border-blue-500' : 'border-gray-200'} bg-white p-4 shadow-sm`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold flex items-center gap-2">{plan.title} {plan.code.includes('premium') && <Crown size={16} className="text-yellow-500" />}</h2>
                                    <p className="text-sm text-gray-600">{plan.price}</p>
                                </div>
                                {current === plan.code ? (
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Sélectionné</span>
                                ) : (
                                    <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white" onClick={() => setCurrent(plan.code)}>Choisir</button>
                                )}
                            </div>
                            <ul className="mt-3 space-y-1">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-center"><Check size={14} className="text-green-600 mr-2" /> {f}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


