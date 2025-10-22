import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const IncidentPanel = () => {
  const { incidents = [], addIncident, updateIncident, deleteIncident, officers } = useSearch();
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    type: 'general',
    severity: 'medium',
    description: '',
    location: '',
    lat: '',
    lng: '',
    officerId: '',
    involvedPersons: '',
    actionsTaken: '',
    followUpRequired: false,
    caseNumber: ''
  });

  const incidentTypes = [
    { value: 'general', label: 'General Incident' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'arrest', label: 'Arrest' },
    { value: 'use_of_force', label: 'Use of Force' },
    { value: 'property_damage', label: 'Property Damage' },
    { value: 'witness_statement', label: 'Witness Statement' },
    { value: 'vehicle_stop', label: 'Vehicle Stop' },
    { value: 'search_warrant', label: 'Search Warrant Execution' },
    { value: 'evidence_collection', label: 'Evidence Collection' },
    { value: 'suspicious_activity', label: 'Suspicious Activity' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const officer = officers.find(o => o.id === formData.officerId);

    addIncident({
      ...formData,
      lat: formData.lat ? parseFloat(formData.lat) : null,
      lng: formData.lng ? parseFloat(formData.lng) : null,
      officerName: officer?.officerName || 'Unknown',
      involvedPersons: formData.involvedPersons.split(',').map(p => p.trim()).filter(Boolean),
      status: 'open',
      timestamp: Date.now()
    });

    setFormData({
      title: '',
      type: 'general',
      severity: 'medium',
      description: '',
      location: '',
      lat: '',
      lng: '',
      officerId: '',
      involvedPersons: '',
      actionsTaken: '',
      followUpRequired: false,
      caseNumber: ''
    });
    setIsAddingIncident(false);
  };

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'open') return i.status === 'open';
    if (filter === 'closed') return i.status === 'closed';
    return i.type === filter;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => b.timestamp - a.timestamp);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'requires_follow_up': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Incident Reports</h3>
          <button
            onClick={() => setIsAddingIncident(!isAddingIncident)}
            className={`px-3 py-1 text-sm rounded ${
              isAddingIncident
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAddingIncident ? 'Cancel' : '+ New Report'}
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="all">All Incidents ({incidents.length})</option>
          <option value="open">Open ({incidents.filter(i => i.status === 'open').length})</option>
          <option value="closed">Closed ({incidents.filter(i => i.status === 'closed').length})</option>
          <option disabled>---</option>
          {incidentTypes.map(type => {
            const count = incidents.filter(i => i.type === type.value).length;
            return count > 0 ? (
              <option key={type.value} value={type.value}>
                {type.label} ({count})
              </option>
            ) : null;
          })}
        </select>
      </div>

      {isAddingIncident && (
        <div className="p-4 border-b bg-gray-50 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Incident Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Brief description of incident"
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
                  {incidentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Detailed Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="4"
                placeholder="Detailed description of what occurred..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Location Description</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., Corner of Main St and 5th Ave"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="40.7128"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="-74.0060"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Reporting Officer *</label>
              <select
                required
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
              <label className="block text-xs font-medium mb-1">Involved Persons (comma-separated)</label>
              <input
                type="text"
                value={formData.involvedPersons}
                onChange={(e) => setFormData({ ...formData, involvedPersons: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="John Doe, Jane Smith"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Actions Taken</label>
              <textarea
                value={formData.actionsTaken}
                onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="3"
                placeholder="Describe actions taken by responding officers..."
              />
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="followUpRequired"
                checked={formData.followUpRequired}
                onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="followUpRequired" className="text-sm">
                Follow-up Required
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Submit Incident Report
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedIncidents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No incident reports</p>
            <p className="text-xs mt-1">Create reports to document incidents during operations</p>
          </div>
        ) : (
          sortedIncidents.map(incident => (
            <div key={incident.id} className="bg-white border rounded p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm flex-1">{incident.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ml-2 ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded ${getStatusColor(incident.status)}`}>
                    {incident.status.replace('_', ' ')}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                    {incident.type.replace('_', ' ')}
                  </span>
                  {incident.followUpRequired && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                      Follow-up Required
                    </span>
                  )}
                </div>

                {incident.description && (
                  <p className="text-gray-700 line-clamp-2">{incident.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  {incident.officerName && (
                    <div>
                      <span className="font-medium">Officer:</span> {incident.officerName}
                    </div>
                  )}
                  {incident.location && (
                    <div>
                      <span className="font-medium">Location:</span> {incident.location}
                    </div>
                  )}
                  {incident.caseNumber && (
                    <div>
                      <span className="font-medium">Case #:</span> {incident.caseNumber}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Date:</span> {new Date(incident.timestamp).toLocaleString()}
                  </div>
                </div>

                {incident.involvedPersons && incident.involvedPersons.length > 0 && (
                  <div>
                    <span className="font-medium">Involved:</span> {incident.involvedPersons.join(', ')}
                  </div>
                )}

                <div className="pt-2 border-t flex gap-2">
                  <button
                    onClick={() => updateIncident(incident.id, {
                      status: incident.status === 'open' ? 'closed' : 'open'
                    })}
                    className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    {incident.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this incident report?')) {
                        deleteIncident(incident.id);
                      }
                    }}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentPanel;
