// Simple image storage utility using localStorage for demo purposes
// In production, you'd use a cloud service like AWS S3, Cloudinary, etc.

export interface StoredImage {
  id: string;
  dataUrl: string;
  filename: string;
  uploadedAt: number;
}

const STORAGE_KEY = 'shelfshare_images';
const MAX_IMAGES = 50; // Limit to prevent localStorage overflow

export function storeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const storedImage: StoredImage = {
          id: imageId,
          dataUrl,
          filename: file.name,
          uploadedAt: Date.now()
        };
        
        // Get existing images
        const existingImages = getStoredImages();
        
        // Add new image
        existingImages.push(storedImage);
        
        // Keep only the most recent MAX_IMAGES
        const limitedImages = existingImages
          .sort((a, b) => b.uploadedAt - a.uploadedAt)
          .slice(0, MAX_IMAGES);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedImages));
        
        resolve(imageId);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function getImageUrl(imageId: string): string | null {
  const images = getStoredImages();
  const image = images.find(img => img.id === imageId);
  return image ? image.dataUrl : null;
}

export function getStoredImages(): StoredImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function deleteImage(imageId: string): void {
  const images = getStoredImages();
  const filteredImages = images.filter(img => img.id !== imageId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredImages));
}

export function clearAllImages(): void {
  localStorage.removeItem(STORAGE_KEY);
}