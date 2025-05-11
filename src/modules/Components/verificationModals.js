import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const VerificationModal = ({ isOpen, onClose, onVerify }) => {
    const [code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);

    const handleVerify = () => {
        if (code === '1234') {
            onVerify();
            onClose();
            setCode('');
        }
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Code de sécurité
                </h2>

                <div className="relative mb-8">
                    <input
                        type={showCode ? 'text' : 'password'}
                        value={code}
                        onChange={(e) => setCode(e.target.value.slice(0, 4))}
                        className="w-full text-center text-3xl tracking-[1em] py-4 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white bg-opacity-50"
                        placeholder="••••"
                        maxLength={4}
                    />
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                    >
                        {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleVerify}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200"
                    >
                        Vérifier
                    </button>
                </div>
            </div>
        </div>
    );
};
