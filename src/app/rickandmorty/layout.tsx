import { Metadata } from 'next';
import Link from 'next/link';
import { FaUserAstronaut } from "react-icons/fa";

export const metadata: Metadata = {
  title: 'Rick and Morty App',
  description: 'Explora el multiverso de Rick and Morty con nuestra aplicación',
};

export default function RickAndMortyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto">
          <Link 
            href="/rickandmorty" 
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <FaUserAstronaut className="text-2xl" />
            <span className="text-xl font-bold">Rick and Morty Portal</span>
          </Link>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}