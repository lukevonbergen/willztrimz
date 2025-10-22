import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

const OfficerStatusPanel = () => {
  const { officers, updateOfficer, addAlert } = useSearch();
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const statusTypes = [
    { value: 'available', label: 'Available', color: 'bg-green-500', icon: '✓' },
    { value: 'busy', label: 'Busy', color: 'bg-yellow-500', icon: '⚠' },
    { value: 'emergency', label: 'EMERGENCY', color: 'bg-red-600', icon: '🚨' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-500', icon: '○' },
    { value: 'break', label: 'On Break', color: 'bg-blue-500', icon: '◐' },
    { value: 'en_route', label: 'En Route', color: 'bg-purple-500', icon: '→' }
  ];

  const handleStatusChange = (officerId, newStatus) => {
    updateOfficer(officerId, { status: newStatus, lastStatusChange: Date.now() });

    // Create alert for emergency status
    if (newStatus === 'emergency') {
      const officer = officers.find(o => o.id === officerId);
      addAlert({
        type: 'critical',
        title: 'OFFICER EMERGENCY',
        message: `${officer.officerName} has triggered an emergency alert!`,
        areaId: null,
        requiresAction: true
      });
    }
  };

  const getStatusInfo = (status) => {
    return statusTypes.find(s => s.value === status) || statusTypes[0];
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 mb-2">Officer Status</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {statusTypes.map(status => {
            const count = officers.filter(o => o.status === status.value).length;
            return (
              <div key={status.value} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {officers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>No officers assigned</p>
          </div>
        ) : (
          officers.map(officer => {
            const status = getStatusInfo(officer.status || 'available');
            const timeSinceStatusChange = officer.lastStatusChange
              ? Date.now() - officer.lastStatusChange
              : 0;

            return (
              <div
                key={officer.id}
                className={`bg-white border-2 rounded p-3 hover:shadow-md transition-shadow ${
                  officer.status === 'emergency' ? 'border-red-600 animate-pulse' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full ${status.color} ${
                        officer.status === 'emergency' ? 'animate-ping absolute' : ''
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full ${status.color}`}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-sm">{officer.officerName}</h4>
                      <p className="text-xs text-gray-500">ID: {officer.id.slice(0, 12)}...</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded text-white ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Path Points:</span>
                    <span className="font-medium">{officer.path?.length || 0}</span>
                  </div>
                  {officer.currentLocation && (
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-mono text-xs">
                        {officer.currentLocation.lat.toFixed(4)}, {officer.currentLocation.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                  {officer.lastStatusChange && (
                    <div className="flex justify-between">
                      <span>Status Duration:</span>
                      <span className="font-medium">{formatDuration(timeSinceStatusChange)}</span>
                    </div>
                  )}
                  {officer.vitals && (
                    <>
                      <div className="flex justify-between">
                        <span>Heart Rate:</span>
                        <span className={`font-medium ${
                          officer.vitals.heartRate > 120 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {officer.vitals.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Battery:</span>
                        <span className={`font-medium ${
                          officer.vitals.battery < 20 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {officer.vitals.battery}%
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {statusTypes.slice(0, 6).map(statusType => (
                    <button
                      key={statusType.value}
                      onClick={() => handleStatusChange(officer.id, statusType.value)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        officer.status === statusType.value
                          ? `${statusType.color} text-white font-bold`
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title={statusType.label}
                    >
                      {statusType.icon}
                    </button>
                  ))}
                </div>

                {officer.status === 'emergency' && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-xs">
                    <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                      <span className="text-lg">🚨</span>
                      <span>EMERGENCY ACTIVE</span>
                    </div>
                    <p className="text-red-700">
                      Officer requires immediate assistance!
                    </p>
                    <button
                      onClick={() => handleStatusChange(officer.id, 'available')}
                      className="mt-2 w-full px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Clear Emergency
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Status Legend */}
      <div className="p-3 border-t bg-gray-50 text-xs">
        <div className="font-semibold mb-2">Quick Status Guide:</div>
        <div className="grid grid-cols-2 gap-2">
          {statusTypes.map(status => (
            <div key={status.value} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
              <span>{status.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficerStatusPanel;
