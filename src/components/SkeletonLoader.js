import React from 'react';

/**
 * Composant de base pour un skeleton loader
 */
export const Skeleton = ({ className = '', variant = 'text', width, height, circle = false }) => {
    const baseClass = 'animate-pulse bg-gray-200';
    
    const variantClasses = {
        text: 'h-4 rounded',
        title: 'h-6 rounded',
        avatar: 'h-10 w-10 rounded-full',
        image: 'h-48 rounded-lg',
        button: 'h-10 rounded-lg',
        card: 'h-32 rounded-lg'
    };

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div 
            className={`${baseClass} ${variantClasses[variant] || ''} ${circle ? 'rounded-full' : ''} ${className}`}
            style={style}
        />
    );
};

/**
 * Skeleton pour un post de feed
 */
export const PostSkeleton = () => {
    return (
        <div className="bg-white border-b border-gray-200 p-4 animate-fadeIn">
            {/* En-tête */}
            <div className="flex items-center mb-3">
                <Skeleton variant="avatar" />
                <div className="ml-3 flex-1 space-y-2">
                    <Skeleton width="120px" height="16px" />
                    <Skeleton width="80px" height="12px" />
                </div>
            </div>

            {/* Titre */}
            <Skeleton variant="title" className="mb-2" />
            
            {/* Contenu */}
            <div className="space-y-2 mb-3">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
            </div>

            {/* Image */}
            <Skeleton variant="image" className="mb-3" />

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Skeleton width="60px" height="24px" />
                <Skeleton width="60px" height="24px" />
                <Skeleton width="60px" height="24px" />
            </div>
        </div>
    );
};

/**
 * Skeleton pour une carte de profil
 */
export const ProfileCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 animate-fadeIn">
            <div className="flex items-start">
                <Skeleton variant="avatar" className="w-16 h-16" />
                <div className="ml-3 flex-1 space-y-2">
                    <Skeleton width="140px" height="18px" />
                    <Skeleton width="100px" height="14px" />
                    <div className="flex items-center gap-2 mt-2">
                        <Skeleton width="80px" height="20px" />
                        <Skeleton width="80px" height="20px" />
                    </div>
                </div>
            </div>
            <div className="mt-3 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="85%" />
            </div>
        </div>
    );
};

/**
 * Skeleton pour un item de portfolio
 */
export const PortfolioItemSkeleton = () => {
    return (
        <div className="rounded-lg overflow-hidden shadow-sm animate-fadeIn">
            <Skeleton className="w-full h-36" />
            <div className="p-2 bg-white space-y-2">
                <Skeleton width="120px" height="14px" />
                <Skeleton width="80px" height="12px" />
            </div>
        </div>
    );
};

/**
 * Skeleton pour un item d'expérience/formation
 */
export const TimelineItemSkeleton = () => {
    return (
        <div className="relative pl-6 border-l-2 border-gray-200 pb-4 animate-fadeIn">
            <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <Skeleton width="180px" height="16px" className="mb-2" />
            <Skeleton width="140px" height="14px" className="mb-2" />
            <Skeleton width="100px" height="12px" className="mb-2" />
            <div className="space-y-1">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="90%" />
            </div>
        </div>
    );
};

/**
 * Skeleton pour liste de posts (affiche plusieurs skeletons)
 */
export const PostListSkeleton = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <PostSkeleton key={index} />
            ))}
        </>
    );
};

/**
 * Skeleton pour grille de portfolio (affiche plusieurs skeletons)
 */
export const PortfolioGridSkeleton = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: count }).map((_, index) => (
                <PortfolioItemSkeleton key={index} />
            ))}
        </div>
    );
};

/**
 * Skeleton pour liste timeline (expériences/formations)
 */
export const TimelineListSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <TimelineItemSkeleton key={index} />
            ))}
        </div>
    );
};

/**
 * Skeleton pour la page complète de profil
 */
export const ProfilePageSkeleton = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-6">
            {/* Photo de couverture */}
            <Skeleton className="w-full h-48 rounded-none" />

            <div className="px-4 -mt-16 relative">
                {/* Carte profil */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex items-start">
                        <Skeleton circle className="w-24 h-24 border-4 border-white" />
                        <div className="ml-4 flex-1 pt-2 space-y-3">
                            <Skeleton width="180px" height="24px" />
                            <Skeleton width="140px" height="16px" />
                            <Skeleton width="120px" height="14px" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="95%" />
                        <Skeleton variant="text" width="80%" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-4">
                    <div className="flex border-b p-4">
                        <Skeleton width="80px" height="32px" className="mr-2" />
                        <Skeleton width="80px" height="32px" className="mr-2" />
                        <Skeleton width="80px" height="32px" />
                    </div>
                    <div className="p-4">
                        <PortfolioGridSkeleton count={4} />
                    </div>
                </div>
            </div>
        </div>
    );
};

