import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

/**
 * LocationSearch component
 * Allows users to search by postcode or coordinates before drawing a zone
 */
const LocationSearch = ({ onLocationFound }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const map = useMap();

  const parseCoordinates = (input) => {
    // Try to parse various coordinate formats:
    // "40.7128, -74.0060"
    // "40.7128,-74.0060"
    // "40.7128 -74.0060"
    const coordPattern = /^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/;
    const match = input.trim().match(coordPattern);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      // Validate lat/lng ranges
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  };

  const searchByPostcode = async (postcode) => {
    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postcode)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      } else {
        throw new Error('Location not found');
      }
    } catch (err) {
      throw new Error('Failed to search location: ' + err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // First try to parse as coordinates
      const coords = parseCoordinates(searchValue);

      let result;
      if (coords) {
        result = coords;
      } else {
        // If not coordinates, search as postcode/address
        result = await searchByPostcode(searchValue);
      }

      // Center map on the location
      if (map && result) {
        map.setView([result.lat, result.lng], 16); // Zoom level 16 for detailed view

        if (onLocationFound) {
          onLocationFound(result);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setError(null);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] tactical-panel glow-border-strong p-3 w-80">
      <form onSubmit={handleSearch} className="space-y-2">
        <div>
          <label className="data-label block mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            LOCATE COORDINATES
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Postcode / Coordinates / Address"
              className="tactical-input flex-1 text-xs"
              disabled={isSearching}
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-2 text-tactical-text-secondary hover:text-tactical-danger transition-colors"
                title="Clear"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !searchValue.trim()}
          className="btn-tactical btn-tactical-success w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-3 w-3 inline mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              SEARCHING...
            </>
          ) : (
            <>
              <svg className="w-3 h-3 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEARCH & CENTER
            </>
          )}
        </button>

        {error && (
          <div className="text-xs text-tactical-danger bg-tactical-danger bg-opacity-10 border border-tactical-danger p-2 rounded">
            {error}
          </div>
        )}

        <div className="text-xs text-tactical-text-secondary mt-2 bg-tactical-bg-tertiary p-2 rounded">
          <div className="font-semibold mb-1 text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
            EXAMPLES:
          </div>
          <div>• Postcode: SW1A 1AA, 10001</div>
          <div>• Coords: 51.5074, -0.1278</div>
          <div>• Address: Central Park</div>
        </div>
      </form>
    </div>
  );
};

export default LocationSearch;
