import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import ConfirmModal from '../ConfirmModal';

const ZoneManagementPanel = () => {
  const { searchAreas, officers, deleteSearchArea, updateSearchArea } = useSearch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleDeleteZone = (zone) => {
    setSelectedZone(zone);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteZone = () => {
    if (selectedZone) {
      deleteSearchArea(selectedZone.id);
      setSelectedZone(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleUpdatePriority = (zoneId, priority) => {
    updateSearchArea(zoneId, { priority });
  };

  const getZoneStats = (zone) => {
    const assignedOfficers = officers.filter(o => o.assignedZone === zone.id);
    const activeOfficers = assignedOfficers.filter(o => o.active);
    const covered = zone.gridCells?.filter(c => c.covered).length || 0;
    const total = zone.gridCells?.length || 1;
    const coverage = ((covered / total) * 100).toFixed(1);

    return {
      assignedOfficers: assignedOfficers.length,
      activeOfficers: activeOfficers.length,
      coverage: parseFloat(coverage),
      status: coverage >= 80 ? 'COMPLETE' : coverage >= 40 ? 'IN PROGRESS' : 'PENDING'
    };
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 tactical-grid-bg">
      <div className="tactical-panel-header">OPERATIONAL ZONES</div>

      {searchAreas.length === 0 ? (
        <div className="tactical-panel text-center py-12">
          <svg className="w-16 h-16 mx-auto text-tactical-text-secondary opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div className="text-tactical-text-secondary text-sm">No zones defined</div>
          <div className="text-tactical-text-secondary text-xs mt-1">Use "Define Zone" to create operational areas</div>
        </div>
      ) : (
        <div className="space-y-3">
          {searchAreas.map((zone) => {
            const stats = getZoneStats(zone);
            return (
              <div key={zone.id} className="tactical-panel glow-border hover:glow-border-strong transition-all">
                {/* Zone Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-tactical-text-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {zone.name}
                    </h3>
                    <div className="text-xs text-tactical-text-secondary mt-1">
                      ID: {zone.id.split('-').pop()}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`badge ${
                    stats.status === 'COMPLETE' ? 'badge-success' :
                    stats.status === 'IN PROGRESS' ? 'badge-warning' :
                    'badge-info'
                  } text-xs`}>
                    {stats.status}
                  </div>
                </div>

                {/* Coverage Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="data-label">COVERAGE</span>
                    <span className="text-tactical-accent-primary font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {stats.coverage}%
                    </span>
                  </div>
                  <div className="progress-bar h-2">
                    <div
                      className="progress-fill"
                      style={{ width: `${stats.coverage}%` }}
                    />
                  </div>
                </div>

                {/* Zone Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-tactical-bg-tertiary rounded p-2 text-center">
                    <div className="data-label text-[10px]">Grid Cells</div>
                    <div className="text-tactical-accent-primary font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {zone.totalCells || zone.gridCells?.length || 0}
                    </div>
                  </div>
                  <div className="bg-tactical-bg-tertiary rounded p-2 text-center">
                    <div className="data-label text-[10px]">Officers</div>
                    <div className="text-tactical-success font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {stats.activeOfficers}/{stats.assignedOfficers}
                    </div>
                  </div>
                  <div className="bg-tactical-bg-tertiary rounded p-2 text-center">
                    <div className="data-label text-[10px]">Time Limit</div>
                    <div className="text-tactical-warning font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {zone.timeThreshold}m
                    </div>
                  </div>
                </div>

                {/* Priority Selector */}
                <div className="mb-3">
                  <label className="data-label block mb-1">PRIORITY LEVEL</label>
                  <select
                    value={zone.priority || 'medium'}
                    onChange={(e) => handleUpdatePriority(zone.id, e.target.value)}
                    className="tactical-input w-full text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                </div>

                {/* Priority Indicator */}
                <div className={`rounded p-2 mb-3 flex items-center space-x-2 ${
                  zone.priority === 'critical' ? 'bg-tactical-danger bg-opacity-20 border border-tactical-danger' :
                  zone.priority === 'high' ? 'bg-tactical-danger bg-opacity-10 border border-tactical-danger' :
                  zone.priority === 'medium' ? 'bg-tactical-warning bg-opacity-10 border border-tactical-warning' :
                  'bg-tactical-text-secondary bg-opacity-10 border border-tactical-text-secondary'
                }`}>
                  <svg className={`w-4 h-4 ${
                    zone.priority === 'critical' || zone.priority === 'high' ? 'text-tactical-danger' :
                    zone.priority === 'medium' ? 'text-tactical-warning' :
                    'text-tactical-text-secondary'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs text-tactical-text-secondary">
                    {zone.priority === 'critical' ? 'IMMEDIATE ACTION REQUIRED' :
                     zone.priority === 'high' ? 'HIGH PRIORITY - URGENT' :
                     zone.priority === 'medium' ? 'STANDARD OPERATIONS' :
                     'ROUTINE PATROL'}
                  </span>
                </div>

                {/* Assigned Officers List */}
                {stats.assignedOfficers > 0 && (
                  <div className="bg-tactical-bg-tertiary rounded p-2 mb-3">
                    <div className="data-label mb-2">ASSIGNED PERSONNEL</div>
                    <div className="space-y-1">
                      {officers
                        .filter(o => o.assignedZone === zone.id)
                        .map(officer => (
                          <div key={officer.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: officer.color }}
                              />
                              <span className="text-tactical-text-primary">{officer.officerName}</span>
                            </div>
                            <span className={`badge ${officer.active ? 'badge-success' : 'badge-warning'} text-[10px]`}>
                              {officer.active ? 'ACTIVE' : 'STANDBY'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Zone Coordinates Info */}
                <div className="bg-tactical-bg-tertiary rounded p-2 mb-3">
                  <div className="data-label mb-1">COORDINATES</div>
                  <div className="text-xs text-tactical-text-secondary space-y-0.5">
                    {zone.coordinates?.slice(0, 2).map((coord, idx) => (
                      <div key={idx}>
                        Point {idx + 1}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </div>
                    ))}
                    {zone.coordinates?.length > 2 && (
                      <div className="text-tactical-accent-primary">
                        + {zone.coordinates.length - 2} more points
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Focus map on zone (implement in future)
                      console.log('Focus on zone:', zone.id);
                    }}
                    className="btn-tactical flex-1 text-xs"
                  >
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    FOCUS
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone)}
                    className="btn-tactical btn-tactical-danger text-xs px-3"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Zone"
        message={`Are you sure you want to delete "${selectedZone?.name}"? All coverage data will be lost. Officers assigned to this zone will be unassigned.`}
        confirmText="Delete Zone"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDeleteZone}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default ZoneManagementPanel;
