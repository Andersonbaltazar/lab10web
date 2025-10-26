'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
                ¡Wubba Lubba Dub Dub! Algo salió mal
            </h2>
            <p className="text-gray-300 mb-4">
                {error.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
                Intentar de nuevo
            </button>
        </div>
    );
}