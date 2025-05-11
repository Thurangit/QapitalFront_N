import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Send, Download, Menu, ChevronRight } from 'lucide-react';
import { NavigationBar } from '../../modules/Components/bottomFloatting';
import { VerificationModal } from '../../modules/Components/verificationModals';
import { ProfileHeader } from '../../modules/Components/profilesParts';
import { useNavigate } from 'react-router';


// Fonction utilitaire pour formater les nombres avec des virgules
const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
};



const WalletBalance = ({ balance, isHidden, toggleBalance }) => {
    const [animatedBalance, setAnimatedBalance] = useState(0);

    useEffect(() => {
        if (!isHidden) {
            const duration = 1000;
            const steps = 60;
            const increment = balance / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= balance) {
                    setAnimatedBalance(balance);
                    clearInterval(timer);
                } else {
                    setAnimatedBalance(current);
                }
            }, duration / steps);
            return () => clearInterval(timer);
        } else {
            setAnimatedBalance(0);
        }
    }, [balance, isHidden]);

    return (
        <div className="p-6 bg-white bg-opacity-95 backdrop-blur-sm mx-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
                <p className="text-gray-600 font-medium">Solde</p>
                <button
                    onClick={toggleBalance}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                    {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <h2 className="text-4xl font-bold mt-2 transition-all duration-300">
                {isHidden ? '••••••' : `XAF ${formatNumber(Math.floor(animatedBalance))}`}
            </h2>
        </div>
    );
};

const ActionButtons = () => {

    const navigate = useNavigate();

    const MenuPage = () => {
        navigate('/Menu');
    }
    return (
        <div className="px-6 py-6">
            <div className="flex justify-between items-center gap-4 w-full">
                <button className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200">
                    <Send size={24} className="text-white mr-3" />
                    <span className="text-white font-medium whitespace-nowrap">Envoyer</span>
                </button>

                <button className="flex-1 flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200">
                    <Download size={24} className="text-white mr-3" />
                    <span className="text-white font-medium whitespace-nowrap">Recevoir</span>
                </button>

                <button onClick={() => MenuPage()} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-purple-500 hover:bg-purple-600 rounded-full transition-colors duration-200">
                    <Menu size={24} className="text-white" />
                </button>
            </div>
        </div>
    )
};

const TransactionList = ({ transactions, onSeeAll }) => (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transactions récentes
            </h3>
            <button
                onClick={onSeeAll}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
                Voir tout
                <ChevronRight size={20} className="ml-1" />
            </button>
        </div>
        <div className="space-y-2">
            {transactions.map((transaction, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-sm"
                >
                    <div>
                        <p className="font-medium">{transaction.title}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)} XAF
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard = () => {
    const [isBalanceHidden, setIsBalanceHidden] = useState(() => {
        const saved = localStorage.getItem('hideBalance');
        return saved ? JSON.parse(saved) : true;
    });
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const toggleBalance = () => {
        if (!isBalanceHidden) {
            setIsBalanceHidden(true);
            localStorage.setItem('hideBalance', 'true');
        } else {
            setShowVerificationModal(true);
        }
    };

    const handleVerification = () => {
        setIsBalanceHidden(false);
        localStorage.setItem('hideBalance', 'false');
    };

    const handleSeeAllTransactions = () => {
        // Ici, vous pouvez ajouter la logique de navigation vers la page des transactions
        console.log('Naviguer vers toutes les transactions');
    };

    const testData = {
        profile: {
            name: "Thuran",
            surname: "Kono Junior",
            profileImage: "/api/placeholder/100/100"
        },
        balance: 1250000.00,
        notifications: 3,
        messages: 5,
        transactions: [
            { title: "Reçu de Marie", date: "Aujourd'hui, 14h30", amount: 25000 },
            { title: "Payé au Supermarché", date: "Aujourd'hui, 12h20", amount: -8550 },
            { title: "Reçu de Pierre", date: "Hier", amount: 15000 },
            { title: "Salaire mensuel", date: "Hier", amount: 350000 },
            { title: "Abonnement Canal+", date: "Il y a 2 jours", amount: -15000 }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <ProfileHeader {...testData.profile} />
            <WalletBalance
                balance={testData.balance}
                isHidden={isBalanceHidden}
                toggleBalance={toggleBalance}
            />

            <ActionButtons />
            <TransactionList
                transactions={testData.transactions}
                onSeeAll={handleSeeAllTransactions}
            />
            <NavigationBar
                notifications={testData.notifications}
                messages={testData.messages}
            />
            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onVerify={handleVerification}
            />
        </div>
    );
};

export default Dashboard;