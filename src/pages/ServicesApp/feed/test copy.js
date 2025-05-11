import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, ChevronLeft, ChevronRight } from 'lucide-react';

// Composant Avatar
const Avatar = ({ src, size = 'md', showStatus = false, statusColor = 'bg-green-500' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
    };

    return (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
                {src ? (
                    <img src={src} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
                    </div>
                )}
            </div>
            {showStatus && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-white`}></div>
            )}
        </div>
    );
};

// Composant Badge
const Badge = ({ children, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        green: 'bg-green-100 text-green-800',
        purple: 'bg-purple-100 text-purple-800',
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
            {children}
        </span>
    );
};

// Composant UserCard
const UserCard = ({ user, size = 'normal', onClick }) => {
    const { name, age, photo, isNew, lastActive, country, isOnline, id } = user;

    const cardClasses = {
        normal: 'w-full',
        small: 'w-32',
        large: 'w-full md:w-64',
    };

    const handleClick = () => {
        if (onClick) onClick();
        // Navigation vers la page utilisateur
        console.log(`Navigate to user profile: ${id}`);
    };

    return (
        <div
            className={`${cardClasses[size]} relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer`}
            onClick={handleClick}
        >
            {isNew && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-full">
                    <span className="text-xs font-medium text-white">New</span>
                </div>
            )}

            <div className="aspect-[3/4] relative">
                <img
                    src={photo || "/api/placeholder/300/400"}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-white font-medium truncate">{name}, {age}</p>
                            {lastActive && (
                                <p className="text-xs text-gray-300">{lastActive}</p>
                            )}
                        </div>
                        {country && (
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                <img src={`/api/placeholder/24/24`} alt={country} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant Carousel amélioré
const Carousel = ({ items, title, renderItem }) => {
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            // Vérification initiale
            handleScroll();
            return () => carousel.removeEventListener('scroll', handleScroll);
        }
    }, [items]);

    return (
        <div className="relative mb-8">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            <div className="relative">
                {showLeftArrow && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <div
                    ref={carouselRef}
                    className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    onScroll={handleScroll}
                >
                    {items.map((item, index) => (
                        <div key={item.id || index} className="flex-shrink-0">
                            {renderItem(item)}
                        </div>
                    ))}
                </div>

                {showRightArrow && (
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md"
                        onClick={scrollRight}
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

// Composant Tab amélioré
const Tab = ({ active, label, onClick }) => (
    <button
        className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${active
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        onClick={onClick}
    >
        {label}
    </button>
);

// Composant TabBar amélioré
const TabBar = ({ tabs, activeTab, setActiveTab }) => (
    <div className="flex justify-center mb-6">
        {tabs.map((tab) => (
            <Tab
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
            />
        ))}
    </div>
);

// Composant Header
const Header = () => {
    return (
        <div className="px-4 py-3 bg-white sticky top-0 z-20 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Avatar src="/api/placeholder/40/40" size="md" />
                    <div className="flex items-center">
                        <span className="font-medium">Ukrain</span>
                        <ChevronDown size={16} className="ml-1" />
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Search size={20} />
                </button>
            </div>
        </div>
    );
};

// Composant pour la page Nearby
const NearbyPage = ({ users }) => {
    const navigateToUserProfile = (userId) => {
        console.log(`Navigate to user profile page: ${userId}`);
        // Navigation implementation would go here
    };

    const featuredUsers = users.filter(user => user.isNew || user.isOnline);
    const regularUsers = users.filter(user => !featuredUsers.includes(user));

    return (
        <div className="px-4">
            <Carousel
                title="Découvrez"
                items={featuredUsers}
                renderItem={(user) => (
                    <UserCard
                        user={user}
                        size="small"
                        onClick={() => navigateToUserProfile(user.id)}
                    />
                )}
            />

            <h2 className="text-xl font-semibold mb-4">À proximité</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {regularUsers.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => navigateToUserProfile(user.id)}
                    />
                ))}
            </div>
        </div>
    );
};

// Composant pour la page Popular
const PopularPage = ({ users }) => {
    const popularUsers = users.filter(user => user.age > 25);

    return (
        <div className="px-4">
            <h2 className="text-xl font-semibold mb-4">Populaires</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {popularUsers.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => console.log(`Navigate to user profile: ${user.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

// Composant pour la page Online
const OnlinePage = ({ users }) => {
    const onlineUsers = users.filter(user => user.isOnline);

    return (
        <div className="px-4">
            <h2 className="text-xl font-semibold mb-4">En ligne maintenant</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {onlineUsers.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => console.log(`Navigate to user profile: ${user.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

// Composant principal TestSocialFeed
const TestSocialFeed = () => {
    const [activeTab, setActiveTab] = useState('nearby');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simuler des données d'utilisateurs
    useEffect(() => {
        const generateRandomUsers = () => {
            setLoading(true);
            const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Jamie', 'Robin', 'Cameron', 'Riley', 'Quinn', 'Avery', 'Skylar', 'Hayden', 'Dakota', 'Reese', 'Harper'];
            const randomUsers = Array.from({ length: 20 }).map((_, index) => ({
                id: index + 1,
                name: names[Math.floor(Math.random() * names.length)],
                age: Math.floor(Math.random() * 20) + 18,
                photo: `/api/placeholder/${300 + index}/${400 + index}`,
                isNew: Math.random() > 0.6,
                lastActive: `${Math.floor(Math.random() * 5) + 1} hrs`,
                country: Math.random() > 0.7 ? 'BE' : Math.random() > 0.5 ? 'FR' : 'US',
                isOnline: Math.random() > 0.7,
            }));

            setUsers(randomUsers);
            setLoading(false);
        };

        // Simulating API delay
        setTimeout(() => {
            generateRandomUsers();
        }, 500);
    }, []);

    const tabs = [
        { id: 'nearby', label: 'Nearby' },
        { id: 'popular', label: 'Popular' },
        { id: 'online', label: 'Online' },
    ];

    // Animation des transitions de page avec une opacité
    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'nearby':
                return <NearbyPage users={users} />;
            case 'popular':
                return <PopularPage users={users} />;
            case 'online':
                return <OnlinePage users={users} />;
            default:
                return <NearbyPage users={users} />;
        }
    };

    return (
        <div className="bg-white min-h-screen pb-16">
            <Header />

            <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="transition-opacity duration-300 ease-in-out">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default TestSocialFeed;
