import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { calculateCoveragePercentage, calculateArea } from '../../utils/geoUtils';

const AreaList = () => {
  const { searchAreas, deleteSearchArea, updateSearchArea } = useSearch();
  const [editingArea, setEditingArea] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (area) => {
    setEditingArea(area.id);
    setEditForm({
      name: area.name,
      priority: area.priority,
      timeThreshold: area.timeThreshold
    });
  };

  const handleSaveEdit = () => {
    if (editingArea) {
      updateSearchArea(editingArea, editForm);
      setEditingArea(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingArea(null);
    setEditForm({});
  };

  const handleDelete = (areaId) => {
    if (window.confirm('Are you sure you want to delete this search area?')) {
      deleteSearchArea(areaId);
    }
  };

  const formatArea = (sqMeters) => {
    if (sqMeters < 1000) {
      return `${sqMeters.toFixed(0)} m²`;
    } else {
      return `${(sqMeters / 1000).toFixed(2)} km²`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Search Areas</h3>

      {searchAreas.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No search areas defined. Use the drawing tool to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {searchAreas.map(area => {
            const coverage = calculateCoveragePercentage(area.gridCells || []);
            const totalArea = calculateArea(area.coordinates);
            const isEditing = editingArea === area.id;

            return (
              <div
                key={area.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                {isEditing ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600">Priority</label>
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600">Time Threshold (minutes)</label>
                      <input
                        type="number"
                        value={editForm.timeThreshold}
                        onChange={(e) => setEditForm({ ...editForm, timeThreshold: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{area.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            area.priority === 'high' ? 'bg-red-100 text-red-800' :
                            area.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {area.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {area.timeThreshold} min threshold
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(area)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Area:</span>
                        <span className="ml-1 font-medium">{formatArea(totalArea)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Coverage:</span>
                        <span className="ml-1 font-medium">{coverage.toFixed(1)}%</span>
                      </div>
                      <div className="col-span-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(coverage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AreaList;
