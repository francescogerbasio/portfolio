interface TravelDestination {
  folder: string;
  location: string;
  country: string;
  flag: string;
  photoCount: number;
}

interface TravelConfig {
  destinations: TravelDestination[];
}

export const travelConfig: TravelConfig = {
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
