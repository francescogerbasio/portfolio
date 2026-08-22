export interface Album {
  name: string;
  cover: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  albums: string[];
  albumAllowlist?: string[];
}

export interface Song {
  title: string;
  artist: string;
  producer: string;
  artwork: string;
  youtubeUrl: string;
  youtubeEmbedId: string;
}

export interface MusicData {
  mySong: Song;
  artists: Artist[];
}

const base = import.meta.env.BASE_URL;
const img = (path: string) => `${base}${path.slice(1)}`;

export const musicData: MusicData = {
  mySong: {
    title: 'BRONX',
    artist: 'Giovane Soldato feat. Cashmoneynobaby & K3Y',
    producer: 'Produced by Francesco Gerbasio',
    artwork: img('/Assets/Images/Music/Bronx.webp'),
    youtubeUrl: 'https://youtu.be/d2nUN5jcyfE?si=RycWPCsKHkMKrIsQ',
    youtubeEmbedId: 'd2nUN5jcyfE'
  },
  artists: [
    {
      id: 'lazza',
      name: 'Lazza',
      image: img('/Assets/Images/Music/Artists/lazza.webp'),
      albums: ['Sirio', 'Re Mida', 'J']
    },
    {
      id: 'sfera-ebbasta',
      name: 'Sfera Ebbasta',
      image: img('/Assets/Images/Music/Artists/sfera-ebbasta.webp'),
      albums: ['Famoso', 'XDVR']
    },
    {
      id: 'flaco-g',
      name: 'Flaco G',
      image: img('/Assets/Images/Music/Artists/flaco-g.webp'),
      albums: ['Album 1']
    },
    {
      id: 'izi',
      name: 'Izi',
      image: img('/Assets/Images/Music/Artists/izi.webp'),
      albums: ['Fenice'],
      albumAllowlist: ['RIOT', 'Aletheia', 'Pizzicato', 'Julian Ross Mixtape', 'Fenice']
    },
    { id: 'niky-savage', name: 'Niky Savage', image: img('/Assets/Images/Music/Artists/niky-savage.webp'), albums: [] },
    { id: 'kid-yugi', name: 'Kid Yugi', image: img('/Assets/Images/Music/Artists/kid-yugi.webp'), albums: [] },
    { id: 'papa-v', name: 'Papa V', image: img('/Assets/Images/Music/Artists/papa-v.webp'), albums: [] },
    { id: 'nerissima-serpe', name: 'Nerissima Serpe', image: img('/Assets/Images/Music/Artists/nerissima-serpe.webp'), albums: [] },
    { id: 'rrari-dal-tacco', name: 'RRARI DAL TACCO', image: img('/Assets/Images/Music/Artists/rrari-dal-tacco.webp'), albums: [] },
    {
      id: 'bad-bunny',
      name: 'Bad Bunny',
      image: img('/Assets/Images/Music/Artists/bad-bunny.webp'),
      albums: ['Un Verano Sin Ti', 'Nadie Sabe Lo Que Va a Pasar Mañana']
    },
    {
      id: 'j-balvin',
      name: 'J Balvin',
      image: img('/Assets/Images/Music/Artists/j-balvin.webp'),
      albums: ['Jose']
    },
    { id: 'arcangel', name: 'Arcángel', image: img('/Assets/Images/Music/Artists/arcangel.webp'), albums: [] },
    { id: 'young-miko', name: 'Young Miko', image: img('/Assets/Images/Music/Artists/young-miko.webp'), albums: [] },
    { id: 'guaynaa', name: 'Guaynaa', image: img('/Assets/Images/Music/Artists/guaynaa.webp'), albums: [] },
    { id: 'jhayco', name: 'Jhayco', image: img('/Assets/Images/Music/Artists/jhayco.webp'), albums: [] },
    {
      id: 'rauw-alejandro',
      name: 'Rauw Alejandro',
      image: img('/Assets/Images/Music/Artists/rauw-alejandro.webp'),
      albums: ['Saturno']
    },
    { id: 'lyanno', name: 'Lyanno', image: img('/Assets/Images/Music/Artists/lyanno.webp'), albums: [] },
    { id: 'quevedo', name: 'Quevedo', image: img('/Assets/Images/Music/Artists/quevedo.webp'), albums: [] },
    { id: 'lucho-rk', name: 'Lucho RK', image: img('/Assets/Images/Music/Artists/lucho-rk.webp'), albums: [] }
  ]
};
