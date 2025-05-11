import { Home, Bell, MessageSquare, User } from 'lucide-react';


export const NavigationBar = ({ notifications, messages }) => (
    <div className="fixed bottom-4 left-4 right-4 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 z-50 shadow-lg">
        <div className="flex justify-around items-center">
            {[
                { icon: Home, label: 'Accueil', count: null },
                { icon: Bell, label: 'Notifications', count: notifications },
                { icon: MessageSquare, label: 'Messages', count: messages },
                { icon: User, label: 'Profil', count: null }
            ].map(({ icon: Icon, count, label }, index) => (
                <button
                    key={index}
                    className="p-3 hover:bg-gray-100 hover:bg-opacity-70 rounded-xl transition-all duration-200 relative"
                    aria-label={label}
                >
                    <Icon size={24} className="text-gray-700" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    </div>
);
