import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useSearch } from '../../context/SearchContext';

// Custom icon creators for different POI types
const createPOIIcon = (type, priority) => {
  const colors = {
    evidence: '#ff3366', // tactical-danger
    witness: '#00ff88', // tactical-success
    vehicle: '#ffaa00', // tactical-warning
    suspect: '#ff3366', // tactical-danger
    general: '#00d9ff'  // tactical-accent-primary
  };

  const color = colors[type] || colors.general;
  const size = priority === 'high' || priority === 'critical' ? 36 : 28;

  const iconHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 15px ${color}88, 0 0 30px ${color}44;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse ${priority === 'high' || priority === 'critical' ? '1s' : '2s'} ease-in-out infinite;
    ">
      <svg style="width: ${size * 0.5}px; height: ${size * 0.5}px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${getIconPath(type)}
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }
    </style>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'poi-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const getIconPath = (type) => {
  switch (type) {
    case 'evidence':
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />';
    case 'witness':
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />';
    case 'vehicle':
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />';
    case 'suspect':
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />';
    default:
      return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />';
  }
};

const POIMarkers = () => {
  const { pointsOfInterest, officers } = useSearch();

  return (
    <>
      {pointsOfInterest.map((poi) => {
        if (!poi.location) return null;

        const position = [poi.location.lat, poi.location.lng];
        const assignedOfficer = poi.assignedOfficer
          ? officers.find(o => o.id === poi.assignedOfficer)
          : null;

        return (
          <Marker
            key={poi.id}
            position={position}
            icon={createPOIIcon(poi.type, poi.priority)}
          >
            <Popup>
              <div className="text-sm min-w-[200px]">
                {/* POI Header */}
                <div className="font-bold text-base mb-2 text-gray-900" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {poi.name}
                </div>

                {/* Type Badge */}
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    poi.type === 'evidence' ? 'bg-red-100 text-red-800' :
                    poi.type === 'witness' ? 'bg-green-100 text-green-800' :
                    poi.type === 'vehicle' ? 'bg-yellow-100 text-yellow-800' :
                    poi.type === 'suspect' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {poi.type.toUpperCase()}
                  </span>
                  <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    poi.priority === 'high' || poi.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    poi.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {poi.priority.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                {poi.description && (
                  <div className="text-xs text-gray-700 mb-2 bg-gray-50 p-2 rounded">
                    {poi.description}
                  </div>
                )}

                {/* Location */}
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Location:</strong> {poi.location.lat.toFixed(6)}, {poi.location.lng.toFixed(6)}
                </div>

                {/* Assigned Officer */}
                {assignedOfficer && (
                  <div className="text-xs mb-2">
                    <strong className="text-gray-600">Assigned:</strong>{' '}
                    <span className="text-gray-900">{assignedOfficer.officerName}</span>
                  </div>
                )}

                {/* Status */}
                <div className="text-xs mb-2">
                  <strong className="text-gray-600">Status:</strong>{' '}
                  <span className={`font-semibold ${
                    poi.status === 'active' ? 'text-blue-600' :
                    poi.status === 'investigated' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {poi.status.toUpperCase()}
                  </span>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                  Added: {new Date(poi.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default React.memo(POIMarkers);
