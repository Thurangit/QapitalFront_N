import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';

export default function TopBar({ title = '', onBack, onShare, showShare = true, right = null }) {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100" aria-label="Retour">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {right}
                    {showShare && (
                        <button onClick={onShare} className="p-2 rounded-full hover:bg-gray-100" aria-label="Partager">
                            <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}


