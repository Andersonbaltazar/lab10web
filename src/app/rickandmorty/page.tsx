import Image from 'next/image';
import Link from 'next/link';
import { Character, CharacterListResponse } from '@/types/rickandmorty';
import SearchCharacters from './components/SearchCharacters';

// Justificación SSG:
// Utilizamos SSG (Static Site Generation) aquí porque:
// 1. Los personajes base de Rick and Morty cambian con muy poca frecuencia
// 2. Necesitamos máxima performance en la carga inicial
// 3. Queremos reducir la carga en el servidor de la API
// 4. SEO es importante para la página principal
// 5. La misma información se sirve a todos los usuarios

async function getCharacters(): Promise<CharacterListResponse> {
  const res = await fetch('https://rickandmortyapi.com/api/character', {
    cache: 'force-cache' // Forzar SSG
  });
  
  if (!res.ok) {
    throw new Error('Error al cargar los personajes');
  }
  
  return res.json();
}

export default async function RickAndMortyPage() {
  const data = await getCharacters();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-green-400 mb-8">
        Rick and Morty Universe
      </h1>
      
      <SearchCharacters />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.results.map((character) => (
          <Link 
            href={`/rickandmorty/${character.id}`}
            key={character.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
          >
            <div className="relative h-48">
              <Image
                src={character.image}
                alt={character.name}
                fill
                style={{ objectFit: 'cover' }}
                priority={false} // Lazy Loading
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold text-green-400 mb-2">
                {character.name}
              </h2>
              <p className="text-gray-300">Status: {character.status}</p>
              <p className="text-gray-300">Species: {character.species}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}