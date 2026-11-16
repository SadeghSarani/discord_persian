export interface PlanetHub {
  id: string;
  name: string;
  type: 'chat' | 'voice' | 'tournament';
  activeCount: number;
}

export interface PlanetWorld {
  id: string;
  systemId: string; // Identifier of the Solar System it belongs to
  name: string;
  subTitle: string;
  genre: string;
  slug: string;
  theme: 'cs2' | 'fc' | 'dota2' | 'val' | 'prime' | 'apex' | 'minecraft' | 'gta';
  hasRings?: boolean;
  gradient: string;
  shadowColor: string;
  accentColor: string;
  icon: string;
  activePilots: number;
  openLobbies: number;
  description: string;
  coordinates: { x: number; y: number };
  size: number;
  hubs: PlanetHub[];
  musicTrack: string;
}

export interface SolarSystem {
  id: string;
  name: string;
  englishName: string;
  description: string;
  icon: string;
  glyph: 'core' | 'quests' | 'ai' | 'achievements' | 'explore' | 'moments';
  bannerGradient: string;
  glowColor: string;
  accentColor: string;
  coordinates: { x: number; y: number }; // In Galaxy map view
  size: number;
  planets: PlanetWorld[];
}
