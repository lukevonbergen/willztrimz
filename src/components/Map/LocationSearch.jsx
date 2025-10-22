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
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 w-80">
      <form onSubmit={handleSearch} className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Search Location (Postcode or Coordinates)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="e.g., SW1A 1AA or 51.5074, -0.1278"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-2 text-gray-400 hover:text-gray-600"
                title="Clear"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !searchValue.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search & Center Map'}
        </button>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          <div className="font-medium mb-1">Examples:</div>
          <div>• Postcode: SW1A 1AA, 10001, etc.</div>
          <div>• Coordinates: 51.5074, -0.1278</div>
          <div>• Address: Central Park, New York</div>
        </div>
      </form>
    </div>
  );
};

export default LocationSearch;
