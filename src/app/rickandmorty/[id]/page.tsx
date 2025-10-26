import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Character } from '@/types/rickandmorty';
import { notFound } from 'next/navigation';

// Justificación ISR:
// Usamos ISR (Incremental Static Regeneration) con revalidación cada 10 días porque:
// 1. Los datos de personajes específicos cambian muy raramente
// 2. Queremos mantener la performance del SSG
// 3. 10 días es un balance entre frescura de datos y carga del servidor
// 4. Permite actualizar si se añaden nuevos episodios
// 5. Mantiene el SEO mientras permite actualizaciones periódicas

async function getCharacter(id: string): Promise<Character> {
    try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
            cache: 'force-cache',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            if (res.status === 404) notFound();
            throw new Error(`Error al cargar el personaje: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching character:', error);
        throw new Error('Error al cargar el personaje');
    }
}

// Removemos generateStaticParams para usar ISR puro
// Las páginas se generarán bajo demanda y se almacenarán en caché

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const character = await getCharacter(params.id);
    
    return {
        title: `${character.name} - Rick and Morty`,
        description: `Detalles del personaje ${character.name} - ${character.species} de Rick and Morty`,
    };
}

export default async function CharacterPage({ params }: { params: { id: string } }) {
    const character = await getCharacter(params.id);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link
                href="/rickandmorty"
                className="inline-block mb-8 text-green-400 hover:text-green-300 transition-colors"
            >
                ← Volver al listado
            </Link>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-[400px]">
                        <Image
                            src={character.image}
                            alt={character.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    <div className="p-6 space-y-4">
                        <h1 className="text-3xl font-bold text-green-400">
                            {character.name}
                        </h1>

                        <div className="grid grid-cols-2 gap-4 text-gray-300">
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p>{character.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Species:</p>
                                <p>{character.species}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Type:</p>
                                <p>{character.type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Gender:</p>
                                <p>{character.gender}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <p className="font-semibold text-gray-300">Origin:</p>
                                <p className="text-green-400">{character.origin.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-300">Location:</p>
                                <p className="text-green-400">{character.location.name}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-300 mb-2">Episodes:</p>
                            <p className="text-green-400">
                                Appears in {character.episode.length} episodes
                            </p>
                        </div>

                        <div className="text-sm text-gray-400">
                            <p>Created: {new Date(character.created).toLocaleDateString()}</p>
                            <p>API URL: {character.url}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}