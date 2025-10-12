import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Home, Heart, MessageCircle, Calendar, Share2, MoreHorizontal, Bell, User, Menu, Settings, Briefcase, Users, ChevronRight, ChevronLeft, Newspaper, ContactRound, Contact, BriefcaseBusiness, MapPinIcon, BookmarkIcon, Eye, X, Linkedin, Facebook, Instagram, MessageSquare, Mail, ExternalLink } from 'lucide-react';
import { StaticsImages } from '../../../modules/images';
import ServicesProviders from '../providers';
import { NavigationBar } from '../../../modules/Components/bottomFloatting';
import { useNavigate } from 'react-router';
import { Axios } from 'axios';
import { urlApi, urlPublicAPi } from '../../../modules/urlApp';
import AuthUser from '../../../modules/AuthUser';


const missions = [
    {
        id: 1,
        title: "Refonte application mobile",
        client: "TechStart SAS",
        date: "Mars 2024 - Avril 2024",
        status: "Terminé",
        image: "/api/placeholder/80/80",
        stars: 5
    },


];
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
// Composant pour un onglet individuel
const TabItem = ({ icon, label, isActive, onClick }) => {
    return (
        <div className="flex flex-col items-center" onClick={onClick}>
            <button
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
            >
                {icon}
            </button>
            <span className={`text-xs mt-1 whitespace-nowrap ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
};

const UserCard = ({ user, size = 'normal', onClick }) => {
    const { name, roles, minia, photo, isNew, description, country, isOnline, id } = user;

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
                            <p className="text-white font-medium truncate">{name}</p>
                            {description && (
                                <p className="text-xs text-gray-300">{description}</p>
                            )}
                        </div>
                        {country && (
                            <div className="w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full overflow-hidden flex-shrink-0 ">
                                <img src={minia || "/api/placeholder/300/400"} alt={" "} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant CarouselAdvense amélioré
export const CarouselAdvense = ({ items, title, renderItem, autoScroll = false, scrollInterval = 5000 }) => {
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const autoScrollTimerRef = useRef(null);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = (resetTimer = false) => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

            // Si on est à la fin, retourner au début
            if (scrollLeft >= scrollWidth - clientWidth - 10) {
                carouselRef.current.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                carouselRef.current.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            }

            // Réinitialiser le timer si demandé
            if (resetTimer && autoScroll && autoScrollTimerRef.current) {
                clearInterval(autoScrollTimerRef.current);
                autoScrollTimerRef.current = setInterval(scrollRight, scrollInterval);
            }
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Configuration du défilement automatique
    useEffect(() => {
        if (autoScroll) {
            autoScrollTimerRef.current = setInterval(() => scrollRight(), scrollInterval);

            return () => {
                if (autoScrollTimerRef.current) {
                    clearInterval(autoScrollTimerRef.current);
                }
            };
        }
    }, [autoScroll, scrollInterval]);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            // Vérification initiale
            handleScroll();
            return () => carousel.removeEventListener('scroll', handleScroll);
        }
    }, [items]);

    // Pauser le défilement automatique quand l'utilisateur interagit
    const handleInteraction = () => {
        if (autoScroll && autoScrollTimerRef.current) {
            clearInterval(autoScrollTimerRef.current);
            autoScrollTimerRef.current = setInterval(() => scrollRight(), scrollInterval);
        }
    };

    return (
        <div className="relative mb-8">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            <div className="relative">
                {showLeftArrow && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md"
                        onClick={() => {
                            scrollLeft();
                            handleInteraction();
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <div
                    ref={carouselRef}
                    className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    onScroll={handleScroll}
                    onMouseDown={handleInteraction}
                    onTouchStart={handleInteraction}
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
                        onClick={() => {
                            scrollRight(true);
                            handleInteraction();
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export const NearbyPage = ({ users }) => {
    const navigateToUserProfile = (userId) => {
        console.log(`Navigate to user profile page: ${userId}`);
        // Navigation implementation would go here
    };

    const featuredUsers = users.filter(user => user.isNew || user.isOnline);

    return (
        <div className="px-4">
            <CarouselAdvense
                title=""
                items={featuredUsers}
                renderItem={(user) => (
                    <UserCard
                        user={user}
                        size="small"
                        onClick={() => navigateToUserProfile(user.id)}
                    />
                )}
                autoScroll={true}
                scrollInterval={5000}
            />
        </div>
    );
};

// Composant pour la section des commentaires du post
const PostComments = ({ username, comment }) => {
    return (
        <div className="flex text-gray-500 mt-1">
            <button className="flex items-center mr-4">
                <span className="text-xs">@{username}:</span>
                <span className="text-xs ml-1">{comment}</span>
            </button>
        </div>
    );
};

// Modal de partage
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
        console.log(`Sharing post ${postId} on ${platform}`);
        // Implémentation du partage selon la plateforme
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

// Fonction pour formater la date
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
        return 'À l\'instant';
    } else if (diffInHours < 24) {
        return `Il y a ${diffInHours}h`;
    } else if (diffInDays === 1) {
        return 'Hier';
    } else if (diffInDays < 7) {
        return `Il y a ${diffInDays} jours`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit'
        });
    }
};

// Composant pour un post individuel
const Post = ({ post, saved, toggleSaved }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);


    // Fonction pour tronquer le texte par mots et ajouter des points de suspension
    const truncateText = (text, maxWords = 40) => {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;

        return words.slice(0, maxWords).join(' ') + '...';
    };

    // Vérifier si le texte a besoin d'être tronqué
    const needsTruncation = post.details.split(' ').length > 40;

    return (



        <div className="bg-white border-b border-gray-200 pb-3">
            {/* Post Header */}
            <div className="flex items-center px-3 py-2">
                <img
                    src={post.profilePic}
                    alt={post.author}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{post.author}</h3>
                    <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                </div>
                <button className="text-gray-500">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Post Title */}
            <div className="px-3 mb-2">
                <h2 className="text-base font-semibold text-gray-900">{post.titre}</h2>
            </div>

            {/* Post Content */}
            <div className="px-3 mb-2">
                <p className="text-sm text-gray-800">
                    {isExpanded ? post.details : truncateText(post.details)}
                    {needsTruncation && !isExpanded && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="ml-1 text-blue-500 font-medium text-xs"
                        >
                            Voir plus
                        </button>
                    )}
                </p>
            </div>

            {/* Post Image - Conditional */}
            {post.image && (
                <div className="relative mb-3">
                    <img
                        src={`${urlPublicAPi}/ImagesPostServices/${post.image}`}
                        alt={post.titre || "Image du post"}
                        className="w-full h-auto"
                    />

                    {/* Floating consult button */}
                    <a
                        href={`/post/${post.id}`}
                        className="absolute bottom-3 right-3 px-3 py-1 rounded-full flex items-center bg-blue-500 text-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="text-xs">Consulter</span>
                        <span className="ml-1 text-xs">&gt;</span>
                    </a>
                </div>
            )}

            {/* Post Footer */}
            <div className="px-3 pt-2">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <span className="text-red-500 text-xs">/</span>
                    </div>
                    <span className="text-red-500 font-medium text-xs">{post.category || "/womenswears"}</span>
                </div>

                <PostComments username={post.username} comment="Love this outfit." />

                <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex">
                        {/*  <button className="mr-4">
                            <MessageCircle className="w-6 h-6 text-gray-500" />
                        </button> */}
                        <button
                            className="mr-4"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="flex">
                        <button onClick={() => toggleSaved(post.id)}>
                            <BookmarkIcon
                                className={`w-5 h-5 ${saved[post.id] ? 'text-blue-500 fill-blue-500' : 'text-gray-500'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                postId={post.id}
            />
        </div>
    );
};

// Composant pour la page de fil d'actualité
const FeedPage = ({ posts, saved, toggleSaved }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simuler des données d'utilisateurs
    useEffect(() => {
        const generateUsers = () => {
            setLoading(true);
            const users = [
                {
                    id: 1, name: 'July', roles: '',
                    photo: "https://tse1.mm.bing.net/th/id/OIG4.mzDCAnJBd7kH7PzmmyU9?pid=ImgGn",
                    minia: "https://tse1.mm.bing.net/th/id/OIG4.mzDCAnJBd7kH7PzmmyU9?pid=ImgGn",
                    isNew: true, description: 'Aide soignante privée', country: 'CM', isOnline: false
                },
                {
                    id: 2, name: 'Bryan', roles: 22,
                    photo: "https://www.blac.media/wp-content/uploads/2022/11/pexels-rodnae-productions-7697394-1024x683.jpg",
                    minia: "https://i.pinimg.com/736x/be/6a/c2/be6ac26b6358843c7ff9849dbc2807ab.jpg",
                    isNew: true, description: "Coiffeur à domicile", country: 'CM', isOnline: false
                },
                {
                    id: 3, name: 'Christian', roles: 30,
                    photo: "https://www.shutterstock.com/image-photo/portrait-smiling-african-american-young-600nw-2155293467.jpg",
                    minia: "https://www.shutterstock.com/image-photo/portrait-smiling-african-american-young-600nw-2155293467.jpg",
                    isNew: false, description: "Repetiteur à domicile", country: 'CM', isOnline: true
                },
                {
                    id: 5, name: 'Michel', roles: 30,
                    photo: "https://media.istockphoto.com/id/1450969748/photo/developer-working-with-new-program.jpg?s=612x612&w=0&k=20&c=FTq2MTCXwMTJxGCA_8o7516KFDaNZ0WCxdZR5M--KYs=",
                    minia: "https://media.gettyimages.com/id/1415160568/video/african-businessman-using-laptop-and-looking-at-computer-monitor-sitting-at-desk.jpg?s=640x640&k=20&c=Fp0KwDoHn1simHQhtIfn7pyUAQVTsRbGF1k7X25d6fI=",
                    isNew: false, description: "Développeur web", country: 'CM', isOnline: true
                },
                {
                    id: 6, name: 'Dimitri', roles: 30,
                    photo: "https://plus.unsplash.com/premium_photo-1663047790433-64d382fc9044?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
                    minia: "https://plus.unsplash.com/premium_photo-1663047790433-64d382fc9044?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
                    isNew: false, description: "Manoeuvre tout type de chantier", country: 'CM', isOnline: true
                },
            ];

            setUsers(users);
            setLoading(false);
        };

        // Simulating API delay
        setTimeout(() => {
            generateUsers();
        }, 500);
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <NearbyPage users={users} />
            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    saved={saved}
                    toggleSaved={toggleSaved}
                />
            ))}
        </div>
    );
};

// Page pour les demandeurs
const RequestsPage = () => {

    return (
        <div className="h-full overflow-y-auto flex flex-col  p-6 text-center">
            {/* <Users className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Demandes</h2>
            <p className="text-gray-600 max-w-md">
                Consultez et gérez les demandes de collaboration et de contenu de votre réseau.
            </p> */}


            <div className="space-y-4">
                {missions.map((mission) => (
                    <div key={mission.id} className="flex items-start bg-gray-50 p-3 rounded-lg">
                        <img
                            src={mission.image}
                            alt={mission.client}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-medium truncate">{mission.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${mission.status === "Terminé" ? "bg-green-100 text-green-800" :
                                    mission.status === "En cours" ? "bg-blue-100 text-blue-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                    {mission.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{mission.client}</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={12} className="mr-1" />
                                    {mission.date}
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Page pour les talents
const TalentsPage = () => {
    return (
        <div className="h-full overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
            <Briefcase className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Talents</h2>
            <p className="text-gray-600 max-w-md">
                Découvrez les talents dans votre domaine et créez des connections professionnelles.
            </p>
        </div>
    );
};

// Menu latéral
const SideMenu = ({ isOpen, onClose }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Menu</h2>
                        <button onClick={onClose} className="p-2">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <nav className="p-4">
                    <ul>
                        <li className="mb-4">
                            <a href="/Services profile" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                                <User className="w-5 h-5 mr-3 text-blue-500" />
                                <span>Profil</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                                <BookmarkIcon className="w-5 h-5 mr-3 text-blue-500" />
                                <span>Enregistrés</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5 mr-3 text-blue-500" />
                                <span>Notifications</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                                <Settings className="w-5 h-5 mr-3 text-blue-500" />
                                <span>Paramètres</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

// CSS pour masquer la barre de défilement tout en conservant la fonctionnalité
const GlobalStyle = () => (
    <style jsx global>{`
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
        }
    `}</style>
);

export default function IndexFeed() {
    const [saved, setSaved] = useState({});
    const [activeTab, setActiveTab] = useState('feed');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSaved = (postId) => {
        setSaved(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };
    const navigation = (route) => {
        navigate(route);
    }
    // Exemple de données pour les posts avec titres
    const posts = [
        {
            id: 1,
            author: "Devon Abomo",
            username: "@devon_bell",
            profilePic: StaticsImages.a1,
            timeSince: "42 minutes ago",
            title: "Recherche d'un plombier à makepe",
            content: "J'ai passé la journée à explorer cette nouvelle collection et je dois dire que je suis impressionné par la qualité des matériaux utilisés. La coupe est parfaite et les couleurs sont vraiment vibrantes, exactement comme sur les photos. Je pense que ça vaut vraiment l'investissement pour ceux qui cherchent des pièces qui durent. Qu'en pensez-vous ? Avez-vous déjà essayé cette marque ?",
            image: StaticsImages.p1,
            likes: 85,
            comments: 12,
            category: "/plomberie"
        },
        {
            id: 2,
            author: "Sophia Kamdem",
            username: "@sophia_style",
            profilePic: StaticsImages.a2,
            timeSince: "1 heure ago",
            title: "Besoin d'un électricien pour réparation urgente à Bonamoussadi",
            content: "Aujourd'hui je partage avec vous ma tenue préférée pour cette saison ! Ce ensemble jaune vif est non seulement confortable mais tellement versatile. Je l'ai porté pour une séance photo sur la plage et ensuite directement à un brunch avec des amis. Le tissu est léger mais résistant, parfait pour les journées chaudes. J'adore comment ces pièces peuvent être portées ensemble ou séparément pour créer différents looks.",
            image: StaticsImages.p2,
            likes: 124,
            comments: 28,
            category: "/électricité"
        },
        {
            id: 3,
            author: "Marci Soa",
            username: "@marco_d",
            profilePic: StaticsImages.a3,
            timeSince: "3 heures ago",
            title: "Recherche consultant en marketing digital",
            content: "Je cherche un consultant en marketing digital pour m'aider à développer la présence en ligne de ma petite entreprise. Idéalement quelqu'un qui a de l'expérience avec les réseaux sociaux, le SEO et les campagnes publicitaires ciblées. Budget flexible pour la bonne personne. Disponibilité souhaitée : 10h par semaine pendant 3 mois. Si vous êtes intéressé ou connaissez quelqu'un qui pourrait l'être, n'hésitez pas à me contacter directement.",
            image: null,
            likes: 42,
            comments: 15,
            category: "/marketing"
        }

    ];

    const { http, user } = AuthUser();
    const [services_list, setservices_list] = useState([]);
    useEffect(() => {
        fetchAllservices_list();
    }, []);

    const fetchAllservices_list = () => {

        http.get(`${urlApi}/service/all`).then(res => {
            setservices_list(res.data);
        })
    }
    console.log("Test")
    console.log(services_list)


    // Fonction pour afficher le contenu en fonction de l'onglet actif
    const renderContent = () => {
        switch (activeTab) {
            case 'feed':
                return <FeedPage posts={services_list} saved={saved} toggleSaved={toggleSaved} />;
            case 'requests':
                return <RequestsPage />;
            case 'talents':
                return <ServicesProviders />;
            default:
                return <FeedPage posts={posts} saved={saved} toggleSaved={toggleSaved} />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <GlobalStyle />
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="px-3 py-2 flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-800">PROPOSE</h1>
                    <div className="flex items-center">
                        <div className="mr-1 text-gray-500 text-xs text-red-600">Douala</div>
                        <MapPinIcon className="w-3 h-3 text-red-600" />
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-3 py-2 flex items-center">
                    <div className="flex-1 flex items-center mr-3">
                        <div className="bg-gray-100 p-2 rounded-full flex items-center w-full">
                            <Search className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Rechercher"
                                className="bg-transparent outline-none text-xs flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories - Centered TabBar */}
                <div className="flex justify-center py-2">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 max-w-md mx-auto">
                        <div className="flex flex-col items-center" onClick={() => navigation("/New post")}>
                            <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Plus className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-xs mt-1 whitespace-nowrap">Publier</span>
                        </div>

                        <TabItem
                            icon={<Newspaper className="w-4 h-4" />}
                            label="Demandes"
                            isActive={activeTab === 'feed'}
                            onClick={() => setActiveTab('feed')}
                        />

                        <TabItem
                            icon={<Contact className="w-4 h-4" />}
                            label="Experts"
                            isActive={activeTab === 'talents'}
                            onClick={() => setActiveTab('talents')}
                        />
                        <TabItem
                            icon={<BriefcaseBusiness className="w-4 h-4" />}
                            label="Sauvegardes"
                            isActive={activeTab === 'requests'}
                            onClick={() => setActiveTab('requests')}
                        />

                        <div className="flex flex-col items-center" onClick={() => setMenuOpen(true)}>
                            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 flex-shrink-0">
                                <Menu className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-xs mt-1 whitespace-nowrap">Menu</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Animation */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full transition-all duration-300 ease-in-out">
                    {renderContent()}
                </div>
            </main>
            <NavigationBar
                notifications={testData.notifications}
                messages={testData.messages}
            />
            {/* Side Menu */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}