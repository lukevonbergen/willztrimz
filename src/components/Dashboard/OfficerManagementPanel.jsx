import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import ConfirmModal from '../ConfirmModal';

const OfficerManagementPanel = () => {
  const {
    officers,
    searchAreas,
    addOfficer,
    updateOfficer,
    removeOfficer,
    assignOfficerToZone,
    unassignOfficerFromZone
  } = useSearch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [newOfficer, setNewOfficer] = useState({
    officerName: '',
    badgeNumber: '',
    rank: 'Officer'
  });

  const handleAddOfficer = () => {
    if (!newOfficer.officerName.trim()) {
      alert('Please enter an officer name');
      return;
    }

    addOfficer({
      officerName: newOfficer.officerName.trim(),
      badgeNumber: newOfficer.badgeNumber.trim() || null,
      rank: newOfficer.rank
    });

    setNewOfficer({ officerName: '', badgeNumber: '', rank: 'Officer' });
    setShowAddModal(false);
  };

  const handleDeleteOfficer = (officer) => {
    setSelectedOfficer(officer);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOfficer = () => {
    if (selectedOfficer) {
      removeOfficer(selectedOfficer.id);
      setSelectedOfficer(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleToggleActive = (officer) => {
    updateOfficer(officer.id, { active: !officer.active });
  };

  const handleAssignZone = (officerId, zoneId) => {
    if (zoneId === 'none') {
      unassignOfficerFromZone(officerId);
    } else {
      assignOfficerToZone(officerId, zoneId);
    }
  };

  const getZoneName = (zoneId) => {
    if (!zoneId) return 'Unassigned';
    const zone = searchAreas.find(a => a.id === zoneId);
    return zone ? zone.name : 'Unknown Zone';
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 tactical-grid-bg">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="tactical-panel-header">PERSONNEL ROSTER</div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-tactical btn-tactical-success text-xs"
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ADD OFFICER
        </button>
      </div>

      {/* Officers List */}
      {officers.length === 0 ? (
        <div className="tactical-panel text-center py-12">
          <svg className="w-16 h-16 mx-auto text-tactical-text-secondary opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="text-tactical-text-secondary text-sm">No officers assigned</div>
          <div className="text-tactical-text-secondary text-xs mt-1">Add officers to begin operations</div>
        </div>
      ) : (
        <div className="space-y-3">
          {officers.map((officer) => {
            const zone = searchAreas.find(a => a.id === officer.assignedZone);
            return (
              <div key={officer.id} className="tactical-panel glow-border hover:glow-border-strong transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {/* Officer Avatar */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor: officer.color,
                        boxShadow: `0 0 10px ${officer.color}80`
                      }}
                    >
                      {officer.officerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>

                    {/* Officer Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-tactical-text-primary font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          {officer.officerName}
                        </span>
                        {officer.badgeNumber && (
                          <span className="badge badge-info text-xs">
                            #{officer.badgeNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-tactical-text-secondary mt-0.5">
                        {officer.rank || 'Officer'}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`badge ${officer.active ? 'badge-success' : 'badge-warning'} text-xs`}>
                    {officer.active ? 'ACTIVE' : 'STANDBY'}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-tactical-bg-tertiary rounded p-2">
                    <div className="data-label text-[10px]">Distance</div>
                    <div className="data-value text-sm">
                      {((officer.distanceTraveled || 0) / 1000).toFixed(1)} km
                    </div>
                  </div>
                  <div className="bg-tactical-bg-tertiary rounded p-2">
                    <div className="data-label text-[10px]">Path Points</div>
                    <div className="data-value text-sm">
                      {officer.path?.length || 0}
                    </div>
                  </div>
                  <div className="bg-tactical-bg-tertiary rounded p-2">
                    <div className="data-label text-[10px]">Position</div>
                    <div className="data-value text-sm">
                      {officer.currentLocation ? '✓' : '—'}
                    </div>
                  </div>
                </div>

                {/* Zone Assignment */}
                <div className="mb-3">
                  <label className="data-label block mb-1">ASSIGNED ZONE</label>
                  <select
                    value={officer.assignedZone || 'none'}
                    onChange={(e) => handleAssignZone(officer.id, e.target.value)}
                    className="tactical-input w-full text-sm"
                  >
                    <option value="none">— Unassigned —</option>
                    {searchAreas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name} ({area.priority?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Assignment Display */}
                {officer.assignedZone && zone && (
                  <div className="bg-tactical-bg-tertiary rounded p-2 mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-tactical-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="text-xs text-tactical-text-primary">{zone.name}</span>
                    </div>
                    <span className={`text-xs ${
                      zone.priority === 'high' ? 'text-tactical-danger' :
                      zone.priority === 'medium' ? 'text-tactical-warning' :
                      'text-tactical-text-secondary'
                    }`}>
                      {zone.priority?.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(officer)}
                    className={`btn-tactical flex-1 text-xs ${
                      officer.active ? 'btn-tactical-danger' : 'btn-tactical-success'
                    }`}
                  >
                    {officer.active ? (
                      <>
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        DEACTIVATE
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ACTIVATE
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteOfficer(officer)}
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

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70">
          <div className="tactical-panel max-w-md w-full mx-4 glow-border-strong">
            <div className="tactical-panel-header mb-4">ADD NEW OFFICER</div>

            <div className="space-y-4">
              <div>
                <label className="data-label block mb-2">OFFICER NAME *</label>
                <input
                  type="text"
                  value={newOfficer.officerName}
                  onChange={(e) => setNewOfficer({ ...newOfficer, officerName: e.target.value })}
                  className="tactical-input w-full"
                  placeholder="e.g., John Smith"
                  autoFocus
                />
              </div>

              <div>
                <label className="data-label block mb-2">BADGE NUMBER</label>
                <input
                  type="text"
                  value={newOfficer.badgeNumber}
                  onChange={(e) => setNewOfficer({ ...newOfficer, badgeNumber: e.target.value })}
                  className="tactical-input w-full"
                  placeholder="e.g., 12345"
                />
              </div>

              <div>
                <label className="data-label block mb-2">RANK</label>
                <select
                  value={newOfficer.rank}
                  onChange={(e) => setNewOfficer({ ...newOfficer, rank: e.target.value })}
                  className="tactical-input w-full"
                >
                  <option value="Officer">Officer</option>
                  <option value="Detective">Detective</option>
                  <option value="Sergeant">Sergeant</option>
                  <option value="Lieutenant">Lieutenant</option>
                  <option value="Captain">Captain</option>
                  <option value="Chief">Chief</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-tactical flex-1"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddOfficer}
                  className="btn-tactical btn-tactical-success flex-1"
                >
                  ADD OFFICER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Remove Officer"
        message={`Are you sure you want to remove ${selectedOfficer?.officerName}? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDeleteOfficer}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default OfficerManagementPanel;
