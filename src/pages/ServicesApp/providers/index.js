import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, ChevronLeft, ChevronRight, Share2, X, MapPin, Briefcase, Mail, Star } from 'lucide-react';
import { CarouselAdvense } from '../feed';


const usersInfo = [
    {
        id: 1, name: 'July Suzanne Kamdem', roles: '',
        photo: "https://tse1.mm.bing.net/th/id/OIG4.mzDCAnJBd7kH7PzmmyU9?pid=ImgGn",
        minia: "https://tse1.mm.bing.net/th/id/OIG4.mzDCAnJBd7kH7PzmmyU9?pid=ImgGn",
        isNew: true, description: 'Aide soignante privée avec 5 ans d\'expérience. Spécialisée dans les soins à domicile pour personnes âgées et handicapées. Disponible pour des missions de courte ou longue durée.',
        country: 'CM', isOnline: false,
        rating: 4.8,
        missions: 42,
        expertise: ['Soins à domicile', 'Personnes âgées', 'Handicap'],
        cities: ['Douala', 'Yaoundé']
    },
    {
        id: 2, name: 'Bryan Tchackunte ', roles: 22,
        photo: "https://www.blac.media/wp-content/uploads/2022/11/pexels-rodnae-productions-7697394-1024x683.jpg",
        minia: "https://i.pinimg.com/736x/be/6a/c2/be6ac26b6358843c7ff9849dbc2807ab.jpg",
        isNew: true, description: "Coiffeur à domicile avec une approche moderne et créative. Spécialiste des coupes tendance et des colorations naturelles. Je m'adapte à tous les types de cheveux et toutes les envies.",
        country: 'CM', isOnline: false,
        rating: 4.5,
        missions: 78,
        expertise: ['Coiffure homme', 'Coiffure femme', 'Colorations'],
        cities: ['Douala', 'Kribi']
    },
    {
        id: 3, name: 'Christian', roles: 30,
        photo: "https://www.shutterstock.com/image-photo/portrait-smiling-african-american-young-600nw-2155293467.jpg",
        minia: "https://www.shutterstock.com/image-photo/portrait-smiling-african-american-young-600nw-2155293467.jpg",
        isNew: false, description: "Repetiteur à domicile expérimenté dans toutes les matières scientifiques. J'aide les élèves à progresser et à gagner en confiance. Méthode pédagogique adaptée à chaque profil d'apprentissage.",
        country: 'CM', isOnline: true,
        rating: 4.9,
        missions: 120,
        expertise: ['Mathématiques', 'Physique', 'Chimie', 'SVT'],
        cities: ['Douala', 'Yaoundé', 'Bafoussam']
    },
    {
        id: 5, name: 'Michel', roles: 30,
        photo: "https://media.istockphoto.com/id/1450969748/photo/developer-working-with-new-program.jpg?s=612x612&w=0&k=20&c=FTq2MTCXwMTJxGCA_8o7516KFDaNZ0WCxdZR5M--KYs=",
        minia: "https://media.gettyimages.com/id/1415160568/video/african-businessman-using-laptop-and-looking-at-computer-monitor-sitting-at-desk.jpg?s=640x640&k=20&c=Fp0KwDoHn1simHQhtIfn7pyUAQVTsRbGF1k7X25d6fI=",
        isNew: false, description: "Développeur web full-stack avec expertise en React, Node.js et bases de données. Je crée des sites web et applications sur mesure pour répondre aux besoins spécifiques de mes clients.",
        country: 'CM', isOnline: true,
        rating: 4.7,
        missions: 65,
        expertise: ['React', 'Node.js', 'MongoDB', 'UI/UX'],
        cities: ['Douala', 'Travail à distance']
    },
    {
        id: 6, name: 'Dimitri', roles: 30,
        photo: "https://plus.unsplash.com/premium_photo-1663047790433-64d382fc9044?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
        minia: "https://plus.unsplash.com/premium_photo-1663047790433-64d382fc9044?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
        isNew: false, description: "Manoeuvre tout type de chantier avec 10 ans d'expérience dans le bâtiment. Polyvalent, rigoureux et ponctuel. Disponible pour des missions courtes ou des chantiers de longue durée.",
        country: 'CM', isOnline: true,
        rating: 4.6,
        missions: 95,
        expertise: ['Construction', 'Rénovation', 'Démolition', 'Peinture'],
        cities: ['Douala', 'Limbé', 'Buea']
    },
];

// Composant pour afficher les étoiles de notation
const StarRating = ({ rating, size = "md" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = size === "sm" ? 14 : size === "md" ? 18 : 22;

    return (
        <div className="flex">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={starSize} className="text-yellow-400 fill-yellow-400" />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star size={starSize} className="text-yellow-400" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star size={starSize} className="text-yellow-400 fill-yellow-400" />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={starSize} className="text-yellow-400" />
            ))}
        </div>
    );
};

// Composant Modal pour afficher les détails du professionnel
const ProfileModal = ({ user, isOpen, onClose }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    if (!isOpen || !user) return null;

    const { name, photo, description, rating, missions, expertise = [], cities = [] } = user;

    const shareProfile = (platform) => {
        // Logique de partage selon la plateforme
        console.log(`Sharing profile of ${name} on ${platform}`);
        // Implementation réelle dépendrait des APIs spécifiques
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl"
                style={{
                    animation: isOpen ? 'modalFadeIn 0.3s ease-out forwards' : 'none',
                }}
            >
                {/* Header avec bouton de fermeture */}
                <div className="relative h-56">
                    <img
                        src={photo || "/api/placeholder/600/400"}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />

                    <button
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-4 left-4 flex items-center gap-4">
                        <Avatar src={photo} size="lg" showStatus={user.isOnline} />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{name}</h2>
                            <p className="text-gray-200">{user.description?.split('.')[0]}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {/* Rating and missions */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <StarRating rating={rating} size="lg" />
                            <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-700">
                                {missions} mission{missions !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Expertise */}
                    <div className="mb-4">
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {expertise.map((skill, index) => (
                                <Badge key={index} color="blue">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    {/* Cities */}
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Villes d'exercice</h3>
                        <div className="flex flex-wrap gap-2">
                            {cities.map((city, index) => (
                                <div key={index} className="flex items-center gap-1 text-sm text-gray-700">
                                    <MapPin size={14} />
                                    <span>{city}</span>
                                    {index < cities.length - 1 && <span className="mx-1">•</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">À propos</h3>
                        <p className="text-gray-700">{description}</p>
                    </div>
                </div>

                {/* Footer with actions */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                            onClick={() => setShowShareOptions(!showShareOptions)}
                        >
                            <Share2 size={18} />
                            <span>Partager</span>
                        </button>

                        {/* Share options with animation */}
                        {showShareOptions && (
                            <div
                                className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2 flex gap-3"
                                style={{
                                    animation: 'shareOptionsSlideIn 0.3s ease-out forwards'
                                }}
                            >
                                <button
                                    className="p-2 bg-green-500 text-white rounded-full"
                                    onClick={() => shareProfile('whatsapp')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 bg-blue-500 text-white rounded-full"
                                    onClick={() => shareProfile('facebook')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 bg-pink-500 text-white rounded-full"
                                    onClick={() => shareProfile('instagram')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 bg-blue-400 text-white rounded-full"
                                    onClick={() => shareProfile('twitter')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 bg-red-500 text-white rounded-full"
                                    onClick={() => shareProfile('mail')}
                                >
                                    <Mail size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        onClick={() => console.log(`Navigate to profile of ${name}`)}
                    >
                        Voir le profil
                    </button>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes shareOptionsSlideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

// Composant Avatar
const Avatar = ({ src, size = 'md', showStatus = false, statusColor = 'bg-green-500' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20',
    };

    return (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
                {src ? (
                    <img src={src} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <User size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} />
                    </div>
                )}
            </div>
            {showStatus && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full `}></div>
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
    const { name, roles, minia, photo, isNew, description, country, isOnline, id } = user;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cardClasses = {
        normal: 'w-full',
        small: 'w-32',
        large: 'w-full md:w-64',
    };

    const handleClick = () => {
        setIsModalOpen(true);
        if (onClick) onClick();
    };

    return (
        <>
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
                        <div className="flex justify-between items-end space-x-2">
                            <div className="flex-1 overflow-hidden pr-2">
                                {/* Modification ici pour que le nom s'affiche sur plusieurs lignes */}
                                <p className="text-white font-medium break-words text-wrap text-xs">
                                    {name}
                                </p>
                                {description && (
                                    <p className="text-xs text-gray-300 line-clamp-4 h-8 overflow-hidden">
                                        {description.length > 90 ? `${description.substring(0, 90)}...` : description.split('.')[0]}
                                    </p>
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

            <ProfileModal
                user={user}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* CSS pour limiter la description à 2 lignes */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </>
    );
};

const AllTalentsCard = ({ user, size = 'normal', onClick }) => {
    const { name, roles, minia, photo, isNew, description, country, isOnline, id, rating, missions } = user;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cardClasses = {
        normal: 'w-full',
        small: 'w-32',
        large: 'w-full md:w-64',
    };

    const handleClick = () => {
        setIsModalOpen(true);
        if (onClick) onClick();
    };

    return (
        <>
            <div
                className={`${cardClasses[size]} relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                onClick={handleClick}
            >
                {/* Nombre de missions en haut à gauche */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-full z-10">
                    <span className="text-xs font-medium text-white">{missions} missions</span>
                </div>

                {/* Étoiles en haut à droite */}
                <div className="absolute top-2 right-2 px-2 py-1 z-10 flex items-center">
                    <span className="text-xs font-medium text-white">{rating}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400 ml-1" />
                </div>

                {isNew && (
                    <div className="absolute top-10 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-full">
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
                        <div className="flex justify-between items-end space-x-2">
                            <div className="flex-1 overflow-hidden pr-2">
                                {/* Modification ici pour que le nom s'affiche sur plusieurs lignes */}
                                <p className="text-white font-medium break-words text-wrap text-sm">
                                    {name}
                                </p>
                                {description && (
                                    <p className="text-xs text-gray-300 line-clamp-2 h-8 overflow-hidden">
                                        {description.length > 70 ? `${description.substring(0, 70)}...` : description.split('.')[0]}
                                    </p>
                                )}
                            </div>
                            {country && (
                                <div className="w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full overflow-hidden flex-shrink-0 ">
                                    <img
                                        src={minia || "/api/placeholder/300/400"}
                                        alt={" "}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ProfileModal
                user={user}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* CSS pour limiter la description à 2 lignes */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </>
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
    <div className="flex justify-center mb-6 overflow-x-auto">
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


// Composant pour la page AllProviders

const AllProvidersPage = ({ users = usersInfo }) => {
    const navigateToUserProfile = (userId) => {
        console.log(`Navigate to user profile page: ${userId}`);
        // Navigation implementation would go here
    };

    return (
        <div className="px-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">À proximité</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {usersInfo.map(user => (
                    <AllTalentsCard
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

    return (
        <div className="px-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Populaires</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {usersInfo.map(user => (
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
const OnlinePage = ({ users = usersInfo }) => {
    const onlineUsers = users.filter(user => user.isOnline);

    return (
        <div className="px-4 overflow-x-auto">
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

// Composant principal ServicesProviders
const ServicesProviders = () => {
    const [activeTab, setActiveTab] = useState('allProviders');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simuler des données d'utilisateurs
    useEffect(() => {
        const generateUsers = () => {
            setLoading(true);
            const users = usersInfo

            setUsers(users);
            setLoading(false);
        };


        // Simulating API delay
        setTimeout(() => {
            generateUsers();
        }, 500);
    }, []);

    const tabs = [
        { id: 'allProviders', label: 'Tous' },
        { id: 'online', label: 'Mieux Notés' },
        { id: 'popular', label: 'Populaires' },

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
            case 'allProviders':
                return <AllProvidersPage users={users} />;
            case 'popular':
                return <PopularPage users={users} />;
            case 'online':
                return <OnlinePage users={users} />;
            default:
                return <AllProvidersPage users={users} />;
        }
    };

    const featuredUsers = users.filter(user => user.isNew || user.isOnline);


    return (
        <div className="bg-whit min-h-screen pb-16 overflow-x-auto h-full overflow-y-auto">
            <div className="px-4">
                <CarouselAdvense
                    title=""
                    items={featuredUsers}
                    renderItem={(user) => (
                        <UserCard
                            user={user}
                            size="small"
                        /*  onClick={() => navigateToUserProfile(user.id)} */
                        />
                    )}
                    autoScroll={true}
                    scrollInterval={5000}
                />
            </div>

            <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="transition-opacity duration-300 ease-in-out">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ServicesProviders;
