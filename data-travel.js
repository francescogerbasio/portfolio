// data/travel.json
// Configure your travel destinations - images load automatically from folders!

const travelConfig = {
    destinations: [
        // ==========================================
        // ADD YOUR CITIES HERE
        // ==========================================
        // Just specify how many photos each city has
        
        {
            folder: 'Croatia',       // Folder name in Assets/Images/Travel/
            location: 'Croatia',     // Display name
            country: 'croatia',      // Country code for filtering
            flag: '🇭🇷',             // Flag emoji
            photoCount: 22           // How many photos (1.webp through 10.webp)
        },
        
        {
            folder: 'Nice',
            location: 'Nice',
            country: 'france',
            flag: '🇫🇷',
            photoCount: 13      // Has 15 photos (1.webp through 15.webp)
        },
        {
            folder: 'Monaco',
            location: 'Monaco',
            country: 'Principality of Monaco',
            flag: '🇲🇨',
            photoCount: 12
        },
        {
            folder: 'Bologna',
            location: 'Bologna',
            country: 'italy',
            flag: '🇮🇹',
            photoCount: 7
        },
        {
            folder: 'Rome',
            location: 'Rome',
            country: 'italy',
            flag: '🇮🇹',
            photoCount: 14
        },
        {
            folder: 'Sevilla',
            location: 'Sevilla',
            country: 'spain',
            flag: '🇪🇸',
            photoCount: 20
        },
        {
            folder: 'Madrid',
            location: 'Madrid',
            country: 'spain',
            flag: '🇪🇸',
            photoCount: 18
        },
        {
            folder: 'Wrocław',
            location: 'Wrocław',
            country: 'poland',
            flag: '🇵🇱',
            photoCount: 23
        },
        // Add more cities here...
    ]
};

window.travelConfig = travelConfig;

// Export for use in fun.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = travelConfig;
}