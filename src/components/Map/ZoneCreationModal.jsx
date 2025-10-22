import React, { useState } from 'react';

const ZoneCreationModal = ({ isOpen, onClose, onSubmit, officers, coordinates }) => {
  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium',
    timeThreshold: 60,
    assignedOfficers: []
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      coordinates,
      assignedOfficers: formData.assignedOfficers
    });
    // Reset form
    setFormData({
      name: '',
      priority: 'medium',
      timeThreshold: 60,
      assignedOfficers: []
    });
  };

  const toggleOfficer = (officerId) => {
    setFormData(prev => ({
      ...prev,
      assignedOfficers: prev.assignedOfficers.includes(officerId)
        ? prev.assignedOfficers.filter(id => id !== officerId)
        : [...prev.assignedOfficers, officerId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Create Search Zone</h2>
          <p className="text-sm text-blue-100 mt-1">Configure zone details and assign officers</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            {/* Zone Details */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Zone Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Crime Scene Area - Zone A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority Level *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Threshold (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.timeThreshold}
                      onChange={(e) => setFormData({ ...formData, timeThreshold: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Assignment */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Assign Officers
              </h3>

              {officers.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">No officers available</p>
                  <p className="text-xs text-gray-500 mt-1">Add officers from the Officers tab first</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {officers.map(officer => {
                    const isAssigned = formData.assignedOfficers.includes(officer.id);
                    return (
                      <div
                        key={officer.id}
                        onClick={() => toggleOfficer(officer.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isAssigned
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isAssigned
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isAssigned && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: officer.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{officer.officerName}</div>
                            <div className="text-xs text-gray-500">
                              ID: {officer.id.slice(0, 20)}...
                              {officer.status && (
                                <span className="ml-2 capitalize">• {officer.status}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {formData.assignedOfficers.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">{formData.assignedOfficers.length} officer{formData.assignedOfficers.length !== 1 ? 's' : ''}</span> assigned to this zone
                  </p>
                </div>
              )}
            </div>

            {/* Zone Preview */}
            {coordinates && coordinates.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Zone Preview</h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Points:</span> {coordinates.length}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      Coordinates: {coordinates.map(c => `[${c[0].toFixed(4)}, ${c[1].toFixed(4)}]`).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 pt-4 border-t flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              Create Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZoneCreationModal;
