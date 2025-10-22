import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const EvidencePanel = () => {
  const { evidenceMarkers = [], addEvidence, officers } = useSearch();
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    type: 'evidence',
    priority: 'medium',
    description: '',
    lat: '',
    lng: '',
    officerId: '',
    caseNumber: '',
    tags: ''
  });

  const evidenceTypes = [
    { value: 'evidence', label: 'Physical Evidence' },
    { value: 'witness', label: 'Witness Location' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'suspect', label: 'Suspect Sighting' },
    { value: 'poi', label: 'Point of Interest' },
    { value: 'clue', label: 'Clue/Lead' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const officer = officers.find(o => o.id === formData.officerId);

    addEvidence({
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      officerName: officer?.officerName || 'Unknown',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      photos: [],
      timestamp: Date.now()
    });

    setFormData({
      title: '',
      type: 'evidence',
      priority: 'medium',
      description: '',
      lat: '',
      lng: '',
      officerId: '',
      caseNumber: '',
      tags: ''
    });
    setIsAddingEvidence(false);
  };

  const filteredMarkers = evidenceMarkers.filter(m =>
    filter === 'all' || m.type === filter
  );

  const sortedMarkers = [...filteredMarkers].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Evidence & POI</h3>
          <button
            onClick={() => setIsAddingEvidence(!isAddingEvidence)}
            className={`px-3 py-1 text-sm rounded ${
              isAddingEvidence
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAddingEvidence ? 'Cancel' : '+ Add'}
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="all">All Types ({evidenceMarkers.length})</option>
          {evidenceTypes.map(type => {
            const count = evidenceMarkers.filter(m => m.type === type.value).length;
            return (
              <option key={type.value} value={type.value}>
                {type.label} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {isAddingEvidence && (
        <div className="p-4 border-b bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Brief title"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  {evidenceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Priority *</label>
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
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="3"
                placeholder="Detailed description..."
              />
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
                  placeholder="40.7128"
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
                  placeholder="-74.0060"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Reporting Officer</label>
              <select
                value={formData.officerId}
                onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="">Select officer...</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>
                    {officer.officerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Case Number</label>
              <input
                type="text"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="CASE-2025-001"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="weapon, fingerprints, urgent"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Add Evidence Marker
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedMarkers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p>No evidence markers</p>
            <p className="text-xs mt-1">Add markers to track evidence and points of interest</p>
          </div>
        ) : (
          sortedMarkers.map(marker => (
            <div key={marker.id} className="bg-white border rounded p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{marker.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  marker.priority === 'high' ? 'bg-red-100 text-red-800' :
                  marker.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {marker.priority}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{marker.type}</span>
                  {marker.caseNumber && (
                    <span className="text-gray-400">• {marker.caseNumber}</span>
                  )}
                </div>

                {marker.description && (
                  <p className="text-gray-700 line-clamp-2">{marker.description}</p>
                )}

                <div className="flex items-center gap-2 text-gray-500">
                  <span>{new Date(marker.timestamp).toLocaleString()}</span>
                  {marker.officerName && (
                    <span>• {marker.officerName}</span>
                  )}
                </div>

                {marker.tags && marker.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {marker.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EvidencePanel;
