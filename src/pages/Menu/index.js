import React, { useState, useEffect } from 'react';
import {
    Clock,
    MessageCircle,
    ThumbsUp,
    Flame,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { MenuLogos, StaticsImages } from '../../modules/images';
import { NavigationBar } from '../../modules/Components/bottomFloatting';
import { useNavigate } from 'react-router';


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

// Sample data for 5 different recipe slides
const recipeSlides = [
    {
        id: 1,
        title: "Vous avez besoin d’un coup de main ?",
        description: "Avec Propose, trouvez en quelques clics la personne idéale pour accomplir toutes vos tâches",
        category: "Propose",
        calories: "Services",
        time: "",

        difficulty: "Medium",
        likes: "21.8K",
        comments: "156.1K",
        url: StaticsImages.t1,
        image: StaticsImages.t1
    },


    {
        id: 2,
        title: "Où que vous soyez, il y a une mission pour vous",
        description: "Vous cherchie une mission ? Vous ayez besoin d'un sevrice ? Propose vous connecte en un clin d'œil",
        category: "Propose",
        calories: "Services",
        time: "",


        difficulty: "Easy",
        likes: "18.3K",
        comments: "132.5K",
        url: "/recipes/grilled-salmon",
        image: StaticsImages.t2
    },

    {
        id: 3,
        title: "L’écnomie n’a jamais été aussi simple",
        description: "Avec Coin, chaque petite somme compte et se transforme en une belle cagnotte",
        category: "Sevice",
        calories: "Coin",
        time: "30min",

        difficulty: "Easy",
        likes: "18.3K",
        comments: "132.5K",
        url: "/recipes/grilled-salmon",
        image: MenuLogos.lyamo_2
    },
    {
        id: 6,
        name: "Mes missions",
        description: "Vos missions commandées et effectuées",
        image: MenuLogos.lm2,
        url: "/Mes missions"
    },
    {
        id: 7,
        name: "Type de profil",
        description: "Voir et changer votre offre",
        image: MenuLogos.lm3,
        url: "/Type de profil"
    },
];

// Images possibles pour le premier élément du menu (Propose)
const proposeImages = [
    MenuLogos.lm1, // Remplacez par vos véritables images
    MenuLogos.lm4,
    MenuLogos.lm2,
    MenuLogos.lm3,
    MenuLogos.lm5,
];

// Menu items with images, descriptions and unique URLs
const menuItems = [
    {
        id: 1,
        name: "Propose",
        description: "Application pour fournir ses services",
        // L'image sera définie dynamiquement au chargement
        url: "/Services Feed",
        isRandom: true // Marqueur pour indiquer que cette image doit être choisie aléatoirement
    },
    {
        id: 2,
        name: "Coin",
        description: "Application d'épargne",
        image: MenuLogos.lcoin_1, // Remplacez par le chemin de votre image
        url: "/finance/m-coin"
    },
    /*  {
         id: 3,
         name: "E'Fund",
         description: "Application d'investissement en ligne",
         image: "/api/placeholder/50/50", // Remplacez par le chemin de votre image
         url: "/invest/e-fund"
     }, */
    {
        id: 4,
        name: "Yamo",
        description: "Application de cadeaux en ligne",
        image: MenuLogos.lyamo_1, // Remplacez par le chemin de votre image
        url: "/gifts/e-gift"
    },
    /*   {
          id: 5,
          name: "E'Cotisation",
          description: "Application d'envoi et de réception d'argent",
          image: "/api/placeholder/50/50", // Remplacez par le chemin de votre image
          url: "/transfer/e-cotisation"
      } */
];

export default function MenuPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [menuItemsWithImages, setMenuItemsWithImages] = useState([]);
    const navigate = useNavigate();

    // Générer une image aléatoire pour le premier élément du menu au chargement
    useEffect(() => {
        const updatedMenuItems = menuItems.map(item => {
            if (item.isRandom) {
                // Sélectionner une image aléatoire parmi les 4 options
                const randomIndex = Math.floor(Math.random() * proposeImages.length);
                return { ...item, image: proposeImages[randomIndex] };
            }
            return item;
        });
        setMenuItemsWithImages(updatedMenuItems);
    }, []); // Ne s'exécute qu'une seule fois au chargement initial

    // Auto-advance slides
    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                goToNextSlide();
            }, 5000); // Change slide every 5 seconds
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    // Pause auto-advance on hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    // Navigate to previous slide with smooth transition
    const goToPrevSlide = () => {
        if (isTransitioning) return;

        setSlideDirection('prev');
        setIsTransitioning(true);

        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? recipeSlides.length - 1 : prev - 1));
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 300);
    };

    // Navigate to next slide with smooth transition
    const goToNextSlide = () => {
        if (isTransitioning) return;

        setSlideDirection('next');
        setIsTransitioning(true);

        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % recipeSlides.length);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 300);
    };

    // Handle click on a slide
    const handleSlideClick = (url) => {
        console.log(`Navigating to: ${url}`);
        // In a real application, you would use your router here
        // For example: router.push(url)
        alert(`Clicked on recipe! Would navigate to: ${url}`);
    };

    // Handle click on a menu item
    const handleMenuItemClick = (url, name) => {
        console.log(`Navigating to menu item: ${url}`);
        // In a real application, you would use your router here
        // For example: router.push(url)
        alert(`Clicked on ${name}! Would navigate to: ${url}`);
    };

    const pubs = recipeSlides[currentSlide];

    const navigation = (route) => {
        navigate(route);
    }
    return (
        <div className="min-h-screen bg-gray-100 md:p-8 flex justify-center">
            <div className="max-w-md w-full bg-white shadow-lg overflow-hidden relative">


                {/* Slide Content */}
                <div
                    className="cursor-pointer"
                    onClick={() => handleSlideClick(pubs.url)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Recipe Image with Transition */}
                    <div className="relative overflow-hidden">
                        <div
                            className={`transition-transform duration-300 ease-in-out ${isTransitioning
                                ? slideDirection === 'next'
                                    ? '-translate-x-full'
                                    : 'translate-x-full'
                                : 'translate-x-0'
                                }`}
                        >
                            <img
                                src={pubs.image}
                                alt={pubs.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {recipeSlides.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-white w-6'
                                        : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recipe Title and Description */}
                    <div className="p-4 md:p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pubs.title}</h1>
                        <p className="text-gray-600 mb-4">
                            {pubs.description}
                        </p>

                        {/* Recipe Info Pills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">{pubs.category}</span>
                            <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                <Flame size={16} className="mr-1" />
                                <span>{pubs.calories}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                <Clock size={16} className="mr-1" />
                                {/*  <span>{pubs.time}</span> */}
                            </div>
                        </div>
                    </div>

                    {/* Menu Section with Images instead of Icons */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 p-4">MENU</h2>
                        <div className="grid grid-cols-4 gap-4 px-4">
                            {menuItemsWithImages.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center group cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the slide click
                                        navigation(item.url)
                                    }}
                                >
                                    <div className="bg-gray-100 rounded-full w-16 h-16 mb-2 overflow-hidden flex items-center justify-center group-hover:shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-200">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-gray-900 font-medium text-center">{item.name}</span>
                                    <span className="text-gray-500 text-xs text-center hidden group-hover:block transition-all duration-300">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <NavigationBar
                        notifications={testData.notifications}
                        messages={testData.messages}
                    />

                </div>
            </div>
        </div>
    );
}