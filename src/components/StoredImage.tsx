import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageStorage";

interface StoredImageProps {
  imageId: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function StoredImage({ imageId, alt, className = "", fallback }: StoredImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imageId) {
      const url = getImageUrl(imageId);
      setImageUrl(url);
    }
    setLoading(false);
  }, [imageId]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className={className}
      onError={(e) => {
        // Hide image if it fails to load
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}