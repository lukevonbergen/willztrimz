import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const DeviceManager = () => {
  const { officers, addOfficer, updateOfficer, removeOfficer } = useSearch();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');

  const handleAddOfficer = () => {
    if (newOfficerName.trim()) {
      addOfficer({
        officerName: newOfficerName.trim()
      });
      setNewOfficerName('');
      setShowAddForm(false);
    }
  };

  const handleToggleActive = (officerId, currentStatus) => {
    updateOfficer(officerId, { active: !currentStatus });
  };

  const handleRemove = (officerId) => {
    if (window.confirm('Are you sure you want to remove this officer?')) {
      removeOfficer(officerId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Device Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          {showAddForm ? 'Cancel' : '+ Add Officer'}
        </button>
      </div>

      {/* Add officer form */}
      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newOfficerName}
              onChange={(e) => setNewOfficerName(e.target.value)}
              placeholder="Officer name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddOfficer()}
            />
            <button
              onClick={handleAddOfficer}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Officers list */}
      {officers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No officers added yet
        </p>
      ) : (
        <div className="space-y-2">
          {officers.map(officer => (
            <div
              key={officer.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: officer.color }}
                ></div>
                <div>
                  <div className="text-sm font-medium">{officer.officerName}</div>
                  <div className="text-xs text-gray-500">ID: {officer.id}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  officer.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {officer.active ? 'Active' : 'Inactive'}
                </span>

                <button
                  onClick={() => handleToggleActive(officer.id, officer.active)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                  title={officer.active ? 'Deactivate' : 'Activate'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <button
                  onClick={() => handleRemove(officer.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
