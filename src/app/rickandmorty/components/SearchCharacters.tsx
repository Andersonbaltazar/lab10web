'use client';

import { useState, useEffect } from 'react';
import { Character, CharacterListResponse } from '@/types/rickandmorty';
import Image from 'next/image';
import Link from 'next/link';

// Justificación CSR:
// Usamos Client-Side Rendering aquí porque:
// 1. Necesitamos interactividad inmediata con los filtros
// 2. Los datos cambian según la interacción del usuario
// 3. No es crítico para SEO
// 4. Queremos una experiencia de usuario fluida
// 5. Los resultados son personalizados para cada usuario

export default function SearchCharacters() {
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [searchSpecies, setSearchSpecies] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError('');
        
        const queryParams = new URLSearchParams();
        if (searchName) queryParams.append('name', searchName);
        if (searchStatus) queryParams.append('status', searchStatus);
        if (searchGender) queryParams.append('gender', searchGender);
        if (searchSpecies) queryParams.append('species', searchSpecies);

        const url = `https://rickandmortyapi.com/api/character/?${queryParams.toString()}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error('No se encontraron personajes con esos filtros');
        }
        
        const data: CharacterListResponse = await res.json();
        setCharacters(data.results);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al buscar personajes');
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar demasiadas llamadas
    const timeoutId = setTimeout(() => {
      if (searchName || searchStatus || searchGender || searchSpecies) {
        fetchCharacters();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchName, searchStatus, searchGender, searchSpecies]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre del personaje..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />

        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="">Cualquier estado</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>

        <select
          value={searchGender}
          onChange={(e) => setSearchGender(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="">Cualquier género</option>
          <option value="female">Femenino</option>
          <option value="male">Masculino</option>
          <option value="genderless">Sin género</option>
          <option value="unknown">Desconocido</option>
        </select>

        <input
          type="text"
          placeholder="Especie..."
          value={searchSpecies}
          onChange={(e) => setSearchSpecies(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>

      {loading && (
        <div className="text-center text-green-400">
          Buscando personajes...
        </div>
      )}

      {error && (
        <div className="text-center text-red-400">
          {error}
        </div>
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
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
      )}
    </div>
  );
}