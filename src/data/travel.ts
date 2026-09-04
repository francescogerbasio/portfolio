export interface TravelDestination {
  folder: string;
  location: string;
  country: string;
  flag: string;
  photoCount: number;
}

export interface TravelPhoto {
  id: string;
  image: string;
  location: string;
  country: string;
  flag: string;
  ar: number;
}

export interface TravelImagePreload {
  href: string;
  imagesrcset: string;
  imagesizes: string;
  fetchpriority: 'high' | 'low';
}

export const TRAVEL_IMG_VERSION = '3';
export const TRAVEL_IMAGE_SIZES = '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, (max-width: 1400px) 31vw, 23vw';

export const travelConfig: { destinations: TravelDestination[] } = {
  destinations: [
    { folder: 'Croatia', location: 'Croatia', country: 'croatia', flag: '🇭🇷', photoCount: 22 },
    { folder: 'Nice', location: 'Nice', country: 'france', flag: '🇫🇷', photoCount: 13 },
    { folder: 'Monaco', location: 'Monaco', country: 'Principality of Monaco', flag: '🇲🇨', photoCount: 12 },
    { folder: 'Bologna', location: 'Bologna', country: 'italy', flag: '🇮🇹', photoCount: 7 },
    { folder: 'Rome', location: 'Rome', country: 'italy', flag: '🇮🇹', photoCount: 14 },
    { folder: 'Sevilla', location: 'Sevilla', country: 'spain', flag: '🇪🇸', photoCount: 20 },
    { folder: 'Madrid', location: 'Madrid', country: 'spain', flag: '🇪🇸', photoCount: 18 },
    { folder: 'Wrocław', location: 'Wrocław', country: 'poland', flag: '🇵🇱', photoCount: 23 },
  ]
};

export function travelPhotoUrl(base: string, folder: string, index: number): string {
  return `${base}Assets/Images/Travel/${encodeURIComponent(folder)}/${index}.webp?v=${TRAVEL_IMG_VERSION}`;
}

export function travelPhotoSrcset(path: string): string {
  const [url, query] = path.split('?');
  const suffix = query ? `?${query}` : '';
  return `${url.replace(/\.webp$/, '-315w.webp')}${suffix} 315w, ${path} 630w`;
}

export function createTravelPhotos(base: string): TravelPhoto[] {
  return travelConfig.destinations.flatMap(destination =>
    Array.from({ length: destination.photoCount || 0 }, (_, offset) => {
      const index = offset + 1;
      return {
        id: `${destination.folder}-${index}`,
        image: travelPhotoUrl(base, destination.folder, index),
        location: destination.location,
        country: destination.country,
        flag: destination.flag,
        ar: 1.3337
      };
    })
  );
}

// Static seed keeps SSR order identical during hydration.
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  let seed = 0x6d2b79f5;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function travelImagePreloads(base: string, count = 4, firstPriority: 'high' | 'low' = 'low'): TravelImagePreload[] {
  return shuffleArray(createTravelPhotos(base)).slice(0, count).map((photo, index) => ({
    href: photo.image,
    imagesrcset: travelPhotoSrcset(photo.image),
    imagesizes: TRAVEL_IMAGE_SIZES,
    fetchpriority: index === 0 ? firstPriority : 'low'
  }));
}
