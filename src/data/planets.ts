export type PlanetInfo = {
  id: string;
  name: string;
  number: string;
  classification: string;
  headline: [string, string];
  tagline: string;
  introduction: string;
  accent: string;
  color: string;
  texture: string;
  radius: number;
  position: [number, number, number];
  tilt: number;
  rotationSpeed: number;
  diameter: string;
  day: string;
  year: string;
  distance: string;
  temperature: string;
  moons: string;
  fact: string;
  details: string;
  callout: string;
  url: string;
};

export const planets: PlanetInfo[] = [
  {
    id: 'earth', name: 'Earth', number: '01', classification: 'TERRESTRIAL / OUR HOME',
    headline: ['OUR HOME', 'EARTH'], tagline: 'THE THIRD PLANET FROM THE SUN',
    introduction: 'One small world, suspended in an ocean of darkness. The only place we know of where life has taken hold.',
    accent: '#88CFFF', color: '#53B8F9', texture: '/assets/planets/earth.webp',
    radius: 3.1, position: [0, 0, 0], tilt: 23.4, rotationSpeed: .075,
    diameter: '12,742 km', day: '23h 56m', year: '365.25 days',
    distance: '149.6M km', temperature: '15°C avg.', moons: '1',
    fact: 'About 71% of Earth’s surface is covered by water — a defining feature of our pale blue dot.',
    details: 'Earth is the third planet from the Sun and the only known world with liquid oceans on its surface and life. Its atmosphere protects and sustains an astonishing variety of ecosystems.',
    callout: 'THE ONLY KNOWN HOME FOR LIFE', url: 'https://science.nasa.gov/earth/',
  },
  {
    id: 'mars', name: 'Mars', number: '02', classification: 'TERRESTRIAL / THE RED PLANET',
    headline: ['THE RED PLANET', 'MARS'], tagline: 'THE FOURTH PLANET FROM THE SUN',
    introduction: 'A world of rust-colored deserts, towering volcanoes, and ancient rivers that may once have flowed.',
    accent: '#FFC19E', color: '#D67853', texture: '/assets/planets/mars.webp',
    radius: 2.35, position: [-9, 1, -27], tilt: 25.2, rotationSpeed: .072,
    diameter: '6,779 km', day: '24h 37m', year: '687 days',
    distance: '227.9M km', temperature: '−65°C avg.', moons: '2',
    fact: 'Olympus Mons on Mars is the largest known volcano in the solar system, rising about 22 kilometers above its surroundings.',
    details: 'Mars has the most explored surface beyond Earth. Ancient lakebeds, polar ice caps, and a thin atmosphere hold clues about the planet’s watery past.',
    callout: 'HOME OF THE SOLAR SYSTEM’S GIANT VOLCANO', url: 'https://science.nasa.gov/mars/',
  },
  {
    id: 'jupiter', name: 'Jupiter', number: '03', classification: 'GAS GIANT / THE KING',
    headline: ['THE GAS GIANT', 'JUPITER'], tagline: 'THE FIFTH PLANET FROM THE SUN',
    introduction: 'An immense, storm-wrapped giant whose swirling clouds have been sculpted by powerful winds for centuries.',
    accent: '#FFE0AD', color: '#DBAF79', texture: '/assets/planets/jupiter.webp',
    radius: 5.6, position: [9, -.5, -63], tilt: 3.1, rotationSpeed: .12,
    diameter: '139,820 km', day: '9h 56m', year: '11.86 years',
    distance: '778.6M km', temperature: '−110°C clouds', moons: 'Many',
    fact: 'The Great Red Spot is a gigantic storm that has persisted for at least centuries, although its size has been shrinking.',
    details: 'Jupiter is the largest planet in our solar system. Its banded atmosphere is predominantly hydrogen and helium, and its powerful magnetic field influences an enormous region of space.',
    callout: 'THE LARGEST PLANET IN OUR SOLAR SYSTEM', url: 'https://science.nasa.gov/jupiter/',
  },
  {
    id: 'saturn', name: 'Saturn', number: '04', classification: 'GAS GIANT / THE RINGED ONE',
    headline: ['THE RINGED WORLD', 'SATURN'], tagline: 'THE SIXTH PLANET FROM THE SUN',
    introduction: 'Delicate rings of ice and ancient debris orbit a giant that could float in water, if an ocean were big enough.',
    accent: '#FFE3A9', color: '#DCC39C', texture: '/assets/planets/saturn.webp',
    radius: 4.25, position: [-10, .8, -104], tilt: 26.7, rotationSpeed: .102,
    diameter: '116,460 km', day: '10h 42m', year: '29.4 years',
    distance: '1.43B km', temperature: '−140°C clouds', moons: 'Many',
    fact: 'Saturn’s rings span hundreds of thousands of kilometers, but most are surprisingly thin — often only tens of meters.',
    details: 'Saturn’s rings consist mostly of water ice, with particles ranging from dust grains to boulder-sized chunks. Beneath them lies a low-density gas giant with powerful winds.',
    callout: 'AN ENTIRE WORLD FRAMED IN ICE', url: 'https://science.nasa.gov/saturn/',
  },
  {
    id: 'uranus', name: 'Uranus', number: '05', classification: 'ICE GIANT / THE SIDEWAYS WORLD',
    headline: ['THE ICE GIANT', 'URANUS'], tagline: 'THE SEVENTH PLANET FROM THE SUN',
    introduction: 'A serene, cyan world that rolls around the Sun on its side, hiding extreme seasons beneath a quiet atmosphere.',
    accent: '#B3FFF3', color: '#87D6D3', texture: '/assets/planets/uranus.webp',
    radius: 3, position: [7, -.8, -138], tilt: 97.8, rotationSpeed: -.058,
    diameter: '50,724 km', day: '17h 14m', year: '84 years',
    distance: '2.87B km', temperature: '−195°C clouds', moons: 'Many',
    fact: 'Uranus is tilted by about 98 degrees, so it appears to spin on its side as it travels around the Sun.',
    details: 'Uranus is an ice giant rich in water, ammonia, and methane deep inside. Methane in its atmosphere helps give the planet its blue-green appearance.',
    callout: 'THE PLANET THAT ROLLS THROUGH SPACE', url: 'https://science.nasa.gov/uranus/',
  },
  {
    id: 'neptune', name: 'Neptune', number: '06', classification: 'ICE GIANT / THE FAR FRONTIER',
    headline: ['THE DISTANT WORLD', 'NEPTUNE'], tagline: 'THE EIGHTH PLANET FROM THE SUN',
    introduction: 'Cold, dark, and swept by supersonic winds. The farthest planet keeps its secrets beneath layers of blue.',
    accent: '#92B9FF', color: '#476AE0', texture: '/assets/planets/neptune.webp',
    radius: 2.95, position: [-8, 1, -175], tilt: 28.3, rotationSpeed: .082,
    diameter: '49,244 km', day: '16h 6m', year: '164.8 years',
    distance: '4.5B km', temperature: '−200°C clouds', moons: 'Many',
    fact: 'Winds on Neptune can exceed 2,000 kilometers per hour — among the fastest measured in our solar system.',
    details: 'Neptune was the first planet discovered through mathematical prediction. This far-flung ice giant has a turbulent atmosphere and a faint ring system.',
    callout: 'THE FARTHEST RECOGNIZED PLANET', url: 'https://science.nasa.gov/neptune/',
  },
  {
    id: 'mercury', name: 'Mercury', number: '07', classification: 'INNER WORLDS / THE SWIFT ONE',
    headline: ['THE INNER WORLD', 'MERCURY'], tagline: 'RETURN TO THE INNER WORLDS',
    introduction: 'A battered, cratered world rushing around the Sun, where the days are long and the temperature swings are brutal.',
    accent: '#E3E0D6', color: '#9A9A93', texture: '/assets/planets/mercury.webp',
    radius: 1.85, position: [7, 0, -207], tilt: .03, rotationSpeed: .029,
    diameter: '4,880 km', day: '58.6 Earth days', year: '88 days',
    distance: '57.9M km', temperature: '−180 to 430°C', moons: '0',
    fact: 'A solar day on Mercury — sunrise to sunrise — lasts about 176 Earth days, twice as long as its year.',
    details: 'Mercury is the smallest planet and the closest to the Sun. Its scarred surface records billions of years of impacts, and its extremely thin exosphere offers little insulation.',
    callout: 'SMALL PLANET. EXTREME CONDITIONS.', url: 'https://science.nasa.gov/mercury/',
  },
  {
    id: 'venus', name: 'Venus', number: '08', classification: 'INNER WORLDS / THE VEILED ONE',
    headline: ['THE CLOUD WORLD', 'VENUS'], tagline: 'BEAUTY HIDES A FURNACE',
    introduction: 'Earth’s near-twin in size wears an impenetrable veil of clouds above the hottest planetary surface.',
    accent: '#FFD4A5', color: '#D9AD72', texture: '/assets/planets/venus.webp',
    radius: 2.8, position: [-7, 0, -235], tilt: 177.4, rotationSpeed: -.022,
    diameter: '12,104 km', day: '243 Earth days', year: '225 days',
    distance: '108.2M km', temperature: '465°C avg.', moons: '0',
    fact: 'Venus rotates so slowly that one rotation takes longer than an entire Venusian year — and it spins backward relative to most planets.',
    details: 'Venus is a rocky planet wrapped in a crushing carbon-dioxide atmosphere. Thick sulfuric-acid clouds trap heat through an intense greenhouse effect.',
    callout: 'OUR SOLAR SYSTEM’S HOTTEST PLANET', url: 'https://science.nasa.gov/venus/',
  },
];

/** Continuous outward journey. Inner planets remain available in the Atlas. */
export const journeyPlanets = planets.slice(0, 6);
