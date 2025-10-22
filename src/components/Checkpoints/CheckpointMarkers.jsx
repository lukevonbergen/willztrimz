import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';
import L from 'leaflet';

const createCheckpointIcon = (type, status, priority) => {
  const statusColors = {
    pending: '#6b7280',
    in_progress: '#3b82f6',
    completed: '#10b981',
    skipped: '#f59e0b'
  };

  const icons = {
    waypoint: '📍',
    checkpoint: '🎯',
    staging: '🏁',
    command_post: '🏢',
    evidence_collection: '📦',
    rest_area: '☕',
    meeting_point: '🤝'
  };

  const color = statusColors[status] || statusColors.pending;
  const icon = icons[type] || '📍';
  const pulseClass = status === 'in_progress' ? 'checkpoint-pulse' : '';

  return L.divIcon({
    className: 'custom-checkpoint-marker',
    html: `
      <style>
        @keyframes checkpoint-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .checkpoint-pulse {
          animation: checkpoint-pulse 2s ease-in-out infinite;
        }
      </style>
      <div class="${pulseClass}" style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        ${priority === 'high' ? 'border-color: #dc2626;' : ''}
      ">
        ${icon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const CheckpointMarkers = () => {
  const { checkpoints = [], updateCheckpoint } = useSearch();

  return (
    <>
      {checkpoints.map(checkpoint => (
        <Marker
          key={checkpoint.id}
          position={[checkpoint.lat, checkpoint.lng]}
          icon={createCheckpointIcon(checkpoint.type, checkpoint.status, checkpoint.priority)}
        >
          <Popup>
            <div className="p-2 min-w-[220px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm">{checkpoint.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  checkpoint.status === 'completed' ? 'bg-green-100 text-green-800' :
                  checkpoint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  checkpoint.status === 'skipped' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {checkpoint.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1 text-xs mb-3">
                <div className="capitalize">
                  <span className="font-semibold">Type:</span> {checkpoint.type.replace('_', ' ')}
                </div>

                {checkpoint.priority && (
                  <div>
                    <span className="font-semibold">Priority:</span>{' '}
                    <span className={`capitalize ${
                      checkpoint.priority === 'high' ? 'text-red-600 font-bold' :
                      checkpoint.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {checkpoint.priority}
                    </span>
                  </div>
                )}

                {checkpoint.assignedOfficerName && (
                  <div>
                    <span className="font-semibold">Assigned:</span> {checkpoint.assignedOfficerName}
                  </div>
                )}

                {checkpoint.areaName && (
                  <div>
                    <span className="font-semibold">Area:</span> {checkpoint.areaName}
                  </div>
                )}

                {checkpoint.instructions && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <div className="font-semibold mb-1">Instructions:</div>
                    <div className="text-gray-700">{checkpoint.instructions}</div>
                  </div>
                )}

                {checkpoint.estimatedTime && (
                  <div>
                    <span className="font-semibold">Est. Time:</span> {checkpoint.estimatedTime} min
                  </div>
                )}
              </div>

              {checkpoint.status !== 'completed' && (
                <div className="flex gap-1">
                  <button
                    onClick={() => updateCheckpoint(checkpoint.id, {
                      status: checkpoint.status === 'in_progress' ? 'pending' : 'in_progress'
                    })}
                    className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    {checkpoint.status === 'in_progress' ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => updateCheckpoint(checkpoint.id, {
                      status: 'completed',
                      completedAt: Date.now()
                    })}
                    className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default CheckpointMarkers;
