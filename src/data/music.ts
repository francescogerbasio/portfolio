export interface Album {
  name: string;
  cover: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  albums: Album[];
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
      albums: [
        { name: 'Sirio', cover: img('/Assets/Images/Albums/lazza-sirio.jpg') },
        { name: 'Re Mida', cover: img('/Assets/Images/Albums/lazza-remida.jpg') },
        { name: 'J', cover: img('/Assets/Images/Albums/lazza-j.jpg') }
      ]
    },
    {
      id: 'sfera-ebbasta',
      name: 'Sfera Ebbasta',
      image: img('/Assets/Images/Music/Artists/sfera-ebbasta.webp'),
      albums: [
        { name: 'Famoso', cover: img('/Assets/Images/Albums/sfera-famoso.jpg') },
        { name: 'XDVR', cover: img('/Assets/Images/Albums/sfera-xdvr.jpg') }
      ]
    },
    {
      id: 'flaco-g',
      name: 'Flaco G',
      image: img('/Assets/Images/Music/Artists/flaco-g.webp'),
      albums: [
        { name: 'Album 1', cover: img('/Assets/Images/Albums/flaco-album1.jpg') }
      ]
    },
    {
      id: 'izi',
      name: 'Izi',
      image: img('/Assets/Images/Music/Artists/izi.webp'),
      albums: [
        { name: 'Fenice', cover: img('/Assets/Images/Albums/izi-fenice.jpg') }
      ]
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
      albums: [
        { name: 'Un Verano Sin Ti', cover: img('/Assets/Images/Albums/bb-verano.jpg') },
        { name: 'Nadie Sabe Lo Que Va a Pasar Mañana', cover: img('/Assets/Images/Albums/bb-nadie.jpg') }
      ]
    },
    {
      id: 'j-balvin',
      name: 'J Balvin',
      image: img('/Assets/Images/Music/Artists/j-balvin.webp'),
      albums: [
        { name: 'Jose', cover: img('/Assets/Images/Albums/jbalvin-jose.jpg') }
      ]
    },
    { id: 'arcangel', name: 'Arcángel', image: img('/Assets/Images/Music/Artists/arcangel.webp'), albums: [] },
    { id: 'young-miko', name: 'Young Miko', image: img('/Assets/Images/Music/Artists/young-miko.webp'), albums: [] },
    { id: 'guaynaa', name: 'Guaynaa', image: img('/Assets/Images/Music/Artists/guaynaa.webp'), albums: [] },
    { id: 'jhayco', name: 'Jhayco', image: img('/Assets/Images/Music/Artists/jhayco.webp'), albums: [] },
    {
      id: 'rauw-alejandro',
      name: 'Rauw Alejandro',
      image: img('/Assets/Images/Music/Artists/rauw-alejandro.webp'),
      albums: [
        { name: 'Saturno', cover: img('/Assets/Images/Albums/rauw-saturno.jpg') }
      ]
    },
    { id: 'lyanno', name: 'Lyanno', image: img('/Assets/Images/Music/Artists/lyanno.webp'), albums: [] },
    { id: 'quevedo', name: 'Quevedo', image: img('/Assets/Images/Music/Artists/quevedo.webp'), albums: [] },
    { id: 'lucho-rk', name: 'Lucho RK', image: img('/Assets/Images/Music/Artists/lucho-rk.webp'), albums: [] }
  ]
};
