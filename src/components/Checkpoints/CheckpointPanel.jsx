import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const CheckpointPanel = () => {
  const { checkpoints = [], addCheckpoint, updateCheckpoint, deleteCheckpoint, officers, searchAreas } = useSearch();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'waypoint',
    lat: '',
    lng: '',
    areaId: '',
    assignedOfficerId: '',
    priority: 'medium',
    instructions: '',
    estimatedTime: ''
  });

  const checkpointTypes = [
    { value: 'waypoint', label: 'Waypoint', icon: '📍' },
    { value: 'checkpoint', label: 'Checkpoint', icon: '🎯' },
    { value: 'staging', label: 'Staging Area', icon: '🏁' },
    { value: 'command_post', label: 'Command Post', icon: '🏢' },
    { value: 'evidence_collection', label: 'Evidence Collection Point', icon: '📦' },
    { value: 'rest_area', label: 'Rest Area', icon: '☕' },
    { value: 'meeting_point', label: 'Meeting Point', icon: '🤝' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const officer = officers.find(o => o.id === formData.assignedOfficerId);
    const area = searchAreas.find(a => a.id === formData.areaId);

    addCheckpoint({
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      assignedOfficerName: officer?.officerName,
      areaName: area?.name,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
      status: 'pending',
      createdAt: Date.now()
    });

    setFormData({
      name: '',
      type: 'waypoint',
      lat: '',
      lng: '',
      areaId: '',
      assignedOfficerId: '',
      priority: 'medium',
      instructions: '',
      estimatedTime: ''
    });
    setIsAdding(false);
  };

  const handleStatusChange = (checkpointId, newStatus) => {
    updateCheckpoint(checkpointId, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : null
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'skipped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const sortedCheckpoints = [...checkpoints].sort((a, b) => {
    const statusOrder = { 'in_progress': 0, 'pending': 1, 'skipped': 2, 'completed': 3 };
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };

    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const stats = {
    pending: checkpoints.filter(c => c.status === 'pending').length,
    inProgress: checkpoints.filter(c => c.status === 'in_progress').length,
    completed: checkpoints.filter(c => c.status === 'completed').length,
    skipped: checkpoints.filter(c => c.status === 'skipped').length
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Checkpoints & Waypoints</h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-3 py-1 text-sm rounded ${
              isAdding
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAdding ? 'Cancel' : '+ Add'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-bold text-lg">{stats.pending}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-bold text-lg text-blue-600">{stats.inProgress}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-bold text-lg text-green-600">{stats.completed}</div>
            <div className="text-gray-600">Done</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="font-bold text-lg text-yellow-600">{stats.skipped}</div>
            <div className="text-gray-600">Skipped</div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="p-4 border-b bg-gray-50 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Checkpoint Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Checkpoint Alpha"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {checkpointTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Search Area</label>
              <select
                value={formData.areaId}
                onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="">None (General)</option>
                {searchAreas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Assign to Officer</label>
              <select
                value={formData.assignedOfficerId}
                onChange={(e) => setFormData({ ...formData, assignedOfficerId: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="">Unassigned</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>{officer.officerName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="3"
                placeholder="Specific instructions for this checkpoint..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Estimated Time (minutes)</label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="15"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Add Checkpoint
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedCheckpoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p>No checkpoints created</p>
            <p className="text-xs mt-1">Add checkpoints to coordinate search operations</p>
          </div>
        ) : (
          sortedCheckpoints.map(checkpoint => {
            const typeInfo = checkpointTypes.find(t => t.value === checkpoint.type);

            return (
              <div
                key={checkpoint.id}
                className="bg-white border rounded p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full mt-1 ${getPriorityColor(checkpoint.priority)}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm">
                        {typeInfo?.icon} {checkpoint.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(checkpoint.status)}`}>
                        {checkpoint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {checkpoint.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-mono">{checkpoint.lat.toFixed(4)}, {checkpoint.lng.toFixed(4)}</span>
                  </div>

                  {checkpoint.assignedOfficerName && (
                    <div className="flex justify-between">
                      <span>Assigned:</span>
                      <span>{checkpoint.assignedOfficerName}</span>
                    </div>
                  )}

                  {checkpoint.areaName && (
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span>{checkpoint.areaName}</span>
                    </div>
                  )}

                  {checkpoint.estimatedTime && (
                    <div className="flex justify-between">
                      <span>Est. Time:</span>
                      <span>{checkpoint.estimatedTime} min</span>
                    </div>
                  )}

                  {checkpoint.instructions && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <div className="font-medium mb-1">Instructions:</div>
                      <div className="text-gray-700">{checkpoint.instructions}</div>
                    </div>
                  )}

                  {checkpoint.completedAt && (
                    <div className="flex justify-between text-green-600">
                      <span>Completed:</span>
                      <span>{new Date(checkpoint.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  {checkpoint.status !== 'completed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(checkpoint.id, 'in_progress')}
                        className={`flex-1 px-2 py-1 text-xs rounded ${
                          checkpoint.status === 'in_progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(checkpoint.id, 'completed')}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                      >
                        Complete
                      </button>
                    </>
                  )}
                  {checkpoint.status === 'completed' && (
                    <button
                      onClick={() => handleStatusChange(checkpoint.id, 'pending')}
                      className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this checkpoint?')) {
                        deleteCheckpoint(checkpoint.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CheckpointPanel;
