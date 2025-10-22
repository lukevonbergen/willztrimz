import React from 'react';
import { Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useSearch } from '../../context/SearchContext';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored marker icon
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const OfficerMarkers = () => {
  const { officers, isPlaybackMode, playbackTime } = useSearch();

  return (
    <>
      {officers.map(officer => {
        if (!officer.active || !officer.currentLocation) return null;

        const position = [officer.currentLocation.lat, officer.currentLocation.lng];

        // Filter path based on playback time if in playback mode
        let pathToShow = officer.path;
        if (isPlaybackMode && playbackTime) {
          pathToShow = officer.path.filter(p => p.timestamp <= playbackTime);
        }

        const pathPositions = pathToShow.map(p => [p.lat, p.lng]);

        return (
          <React.Fragment key={officer.id}>
            {/* Officer path */}
            {pathPositions.length > 1 && (
              <Polyline
                positions={pathPositions}
                pathOptions={{
                  color: officer.color,
                  weight: 3,
                  opacity: 0.6
                }}
              />
            )}

            {/* Officer current position */}
            <CircleMarker
              center={position}
              radius={8}
              pathOptions={{
                fillColor: officer.color,
                fillOpacity: 1,
                color: 'white',
                weight: 2
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{officer.officerName}</div>
                  <div className="text-xs text-gray-600">ID: {officer.id}</div>
                  <div className="text-xs">Path length: {officer.path.length} points</div>
                  <div className="text-xs">
                    Position: {officer.currentLocation.lat.toFixed(6)}, {officer.currentLocation.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default OfficerMarkers;
