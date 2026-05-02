import { useEffect, useState } from 'react';
import { favoriteService } from '../services/apiService';
import PropertyCard from '../components/property/PropertyCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, [page]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getAll({ page, limit: 12 });
      setFavorites(response.data.favorites);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen`}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">
          My Saved Properties
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            Loading...
          </div>
        ) : favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {favorites.map((fav) => (
                <PropertyCard
                  key={fav._id}
                  property={fav.property}
                  onFavoriteChange={fetchFavorites}
                />
              ))}
            </div>
            {Math.ceil(total / 12) > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded text-sm font-medium transition ${page === p
                      ? 'bg-primary text-white'
                      : 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="mb-4">You haven't saved any properties yet.</p>
            <a
              href="/listings"
              className="font-semibold hover:underline"
            >
              Browse listings →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
