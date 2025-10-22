import React, { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';
import L from 'leaflet';

// Custom marker icons for different evidence types
const createEvidenceIcon = (type, priority) => {
  const colors = {
    evidence: { high: '#dc2626', medium: '#f59e0b', low: '#3b82f6' },
    witness: { high: '#7c3aed', medium: '#8b5cf6', low: '#a78bfa' },
    vehicle: { high: '#be123c', medium: '#e11d48', low: '#fb7185' },
    suspect: { high: '#991b1b', medium: '#b91c1c', low: '#dc2626' },
    poi: { high: '#065f46', medium: '#047857', low: '#10b981' },
    clue: { high: '#c2410c', medium: '#ea580c', low: '#fb923c' }
  };

  const color = colors[type]?.[priority] || '#6b7280';

  return L.divIcon({
    className: 'custom-evidence-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; fill: white;" viewBox="0 0 24 24">
          ${type === 'evidence' ? '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' :
            type === 'witness' ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' :
            type === 'vehicle' ? '<path d="M5 17h14v2H5v-2zm2-11h10l3 7H4l3-7zm-2 8h14v2H5v-2z"/>' :
            type === 'suspect' ? '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/><circle cx="12" cy="12" r="3"/>' :
            type === 'clue' ? '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>' :
            '<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'}
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const EvidenceMarkers = ({ onAddEvidence }) => {
  const { evidenceMarkers = [], updateEvidence, deleteEvidence } = useSearch();
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <>
      {evidenceMarkers.map(marker => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={createEvidenceIcon(marker.type, marker.priority)}
          eventHandlers={{
            click: () => setSelectedMarker(marker)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm">{marker.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  marker.priority === 'high' ? 'bg-red-100 text-red-800' :
                  marker.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {marker.priority}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold">Type:</span>{' '}
                  <span className="capitalize">{marker.type}</span>
                </div>

                {marker.description && (
                  <div>
                    <span className="font-semibold">Description:</span>
                    <p className="mt-1 text-gray-700">{marker.description}</p>
                  </div>
                )}

                {marker.officerName && (
                  <div>
                    <span className="font-semibold">Reported by:</span> {marker.officerName}
                  </div>
                )}

                {marker.photos && marker.photos.length > 0 && (
                  <div>
                    <span className="font-semibold">Photos:</span> {marker.photos.length} attached
                  </div>
                )}

                <div className="text-gray-500">
                  {new Date(marker.timestamp).toLocaleString()}
                </div>

                {marker.caseNumber && (
                  <div className="pt-2 border-t">
                    <span className="font-semibold">Case #:</span> {marker.caseNumber}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t flex gap-2">
                <button
                  onClick={() => {
                    // Open detail modal
                    if (window.confirm('View full details?')) {
                      // This would open a detailed modal
                      console.log('Opening evidence details:', marker);
                    }
                  }}
                  className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this marker?')) {
                      deleteEvidence(marker.id);
                    }
                  }}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default EvidenceMarkers;
