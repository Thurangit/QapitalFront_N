import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant d'image optimisée avec lazy loading, compression et placeholder
 */
export const OptimizedImage = ({ 
    src, 
    alt = '', 
    className = '', 
    placeholder = '/api/placeholder/400/400',
    onError,
    priority = false, // true pour images critiques (above the fold)
    aspectRatio = 'auto',
    objectFit = 'cover',
    showLoader = true
}) => {
    const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!priority) {
            // Lazy loading avec Intersection Observer
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px', // Charger 50px avant d'être visible
                }
            );

            if (imgRef.current) {
                observer.observe(imgRef.current);
            }

            return () => {
                if (imgRef.current) {
                    observer.unobserve(imgRef.current);
                }
            };
        }
    }, [src, priority]);

    const handleLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleError = (e) => {
        setImageLoading(false);
        setImageError(true);
        setImageSrc(placeholder);
        if (onError) onError(e);
    };

    return (
        <div className={`relative overflow-hidden ${className}`} ref={imgRef} style={{ aspectRatio }}>
            {/* Loader pendant chargement */}
            {showLoader && imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-full">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
            )}

            {/* Image */}
            <img
                src={imageSrc}
                alt={alt}
                className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
            />

            {/* Message d'erreur si l'image ne charge pas */}
            {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-full">
                    Image non disponible
                </div>
            )}
        </div>
    );
};

/**
 * Fonction utilitaire pour compresser une image avant upload
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculer les nouvelles dimensions en gardant le ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir en blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Créer un nouveau fichier avec le blob compressé
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Erreur lors de la compression'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
        reader.readAsDataURL(file);
    });
};

/**
 * Hook pour prévisualiser et compresser une image
 */
export const useImageUpload = (options = {}) => {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.85, autoCompress = true } = options;
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);

    const handleImageSelect = async (file) => {
        if (!file) return;

        // Créer preview immédiatement
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Compresser si autoCompress activé
        if (autoCompress && file.size > 500000) { // Compresser si > 500KB
            setCompressing(true);
            try {
                const compressed = await compressImage(file, maxWidth, maxHeight, quality);
                setImage(compressed);
                console.log(`Image compressée: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB`);
            } catch (error) {
                console.error('Erreur compression:', error);
                setImage(file); // Utiliser l'image originale si compression échoue
            } finally {
                setCompressing(false);
            }
        } else {
            setImage(file);
        }
    };

    const reset = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setImage(null);
        setPreview(null);
        setCompressing(false);
    };

    return { image, preview, compressing, handleImageSelect, reset };
};

