import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const ResourcePanel = () => {
  const { resources = [], addResource, updateResource, deleteResource, officers, searchAreas } = useSearch();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'vehicle',
    subtype: 'patrol_car',
    status: 'available',
    assignedOfficerId: '',
    assignedAreaId: '',
    location: '',
    callSign: '',
    notes: ''
  });

  const resourceTypes = {
    vehicle: {
      label: 'Vehicle',
      icon: '🚗',
      subtypes: [
        { value: 'patrol_car', label: 'Patrol Car' },
        { value: 'suv', label: 'SUV' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'mobile_command', label: 'Mobile Command Unit' },
        { value: 'swat_van', label: 'SWAT Van' },
        { value: 'ambulance', label: 'Ambulance' }
      ]
    },
    k9: {
      label: 'K9 Unit',
      icon: '🐕',
      subtypes: [
        { value: 'patrol_k9', label: 'Patrol K9' },
        { value: 'search_rescue', label: 'Search & Rescue' },
        { value: 'detection', label: 'Detection (Narcotics/Explosives)' },
        { value: 'cadaver', label: 'Cadaver Dog' }
      ]
    },
    drone: {
      label: 'Drone',
      icon: '🚁',
      subtypes: [
        { value: 'surveillance', label: 'Surveillance Drone' },
        { value: 'thermal', label: 'Thermal Imaging' },
        { value: 'delivery', label: 'Equipment Delivery' },
        { value: 'search_rescue', label: 'Search & Rescue' }
      ]
    },
    equipment: {
      label: 'Equipment',
      icon: '🎒',
      subtypes: [
        { value: 'medical_kit', label: 'Medical Kit' },
        { value: 'evidence_kit', label: 'Evidence Collection Kit' },
        { value: 'radio', label: 'Radio' },
        { value: 'night_vision', label: 'Night Vision Equipment' },
        { value: 'other', label: 'Other Equipment' }
      ]
    }
  };

  const statusTypes = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'deployed', label: 'Deployed', color: 'bg-blue-500' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-500' },
    { value: 'unavailable', label: 'Unavailable', color: 'bg-red-500' },
    { value: 'standby', label: 'Standby', color: 'bg-gray-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const officer = officers.find(o => o.id === formData.assignedOfficerId);
    const area = searchAreas.find(a => a.id === formData.assignedAreaId);

    addResource({
      ...formData,
      assignedOfficerName: officer?.officerName,
      assignedAreaName: area?.name,
      createdAt: Date.now()
    });

    setFormData({
      name: '',
      type: 'vehicle',
      subtype: 'patrol_car',
      status: 'available',
      assignedOfficerId: '',
      assignedAreaId: '',
      location: '',
      callSign: '',
      notes: ''
    });
    setIsAdding(false);
  };

  const getStatusColor = (status) => {
    return statusTypes.find(s => s.value === status)?.color || 'bg-gray-500';
  };

  const getResourceIcon = (type) => {
    return resourceTypes[type]?.icon || '📦';
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) acc[resource.type] = [];
    acc[resource.type].push(resource);
    return acc;
  }, {});

  const stats = {
    total: resources.length,
    available: resources.filter(r => r.status === 'available').length,
    deployed: resources.filter(r => r.status === 'deployed').length,
    unavailable: resources.filter(r => r.status === 'unavailable' || r.status === 'maintenance').length
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Resource Allocation</h3>
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
            <div className="font-bold text-lg">{stats.total}</div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-bold text-lg text-green-600">{stats.available}</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-bold text-lg text-blue-600">{stats.deployed}</div>
            <div className="text-gray-600">Deployed</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="font-bold text-lg text-red-600">{stats.unavailable}</div>
            <div className="text-gray-600">Out</div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="p-4 border-b bg-gray-50 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Resource Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Unit 5, Rover, Eagle-1, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Call Sign</label>
              <input
                type="text"
                value={formData.callSign}
                onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="ALPHA-7, K9-2, DRONE-1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const firstSubtype = resourceTypes[newType]?.subtypes[0]?.value || '';
                  setFormData({ ...formData, type: newType, subtype: firstSubtype });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {Object.entries(resourceTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Subtype *</label>
              <select
                value={formData.subtype}
                onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {resourceTypes[formData.type]?.subtypes.map(subtype => (
                  <option key={subtype.value} value={subtype.value}>
                    {subtype.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {statusTypes.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
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
              <label className="block text-xs font-medium mb-1">Assign to Search Area</label>
              <select
                value={formData.assignedAreaId}
                onChange={(e) => setFormData({ ...formData, assignedAreaId: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="">None</option>
                {searchAreas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Current Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Staging Area, HQ, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="2"
                placeholder="Special capabilities, restrictions, etc."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Add Resource
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No resources allocated</p>
            <p className="text-xs mt-1">Add vehicles, K9 units, and equipment</p>
          </div>
        ) : (
          Object.entries(groupedResources).map(([type, items]) => (
            <div key={type}>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="text-lg">{getResourceIcon(type)}</span>
                {resourceTypes[type]?.label} ({items.length})
              </h4>
              <div className="space-y-2">
                {items.map(resource => {
                  const subtypeLabel = resourceTypes[type]?.subtypes.find(
                    st => st.value === resource.subtype
                  )?.label || resource.subtype;

                  return (
                    <div key={resource.id} className="bg-white border rounded p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(resource.status)}`}></div>
                          <div>
                            <h5 className="font-semibold text-sm">{resource.name}</h5>
                            {resource.callSign && (
                              <div className="text-xs text-gray-500 font-mono">{resource.callSign}</div>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded text-white ${getStatusColor(resource.status)}`}>
                          {statusTypes.find(s => s.value === resource.status)?.label}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{subtypeLabel}</span>
                        </div>

                        {resource.assignedOfficerName && (
                          <div className="flex justify-between">
                            <span>Officer:</span>
                            <span>{resource.assignedOfficerName}</span>
                          </div>
                        )}

                        {resource.assignedAreaName && (
                          <div className="flex justify-between">
                            <span>Area:</span>
                            <span>{resource.assignedAreaName}</span>
                          </div>
                        )}

                        {resource.location && (
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span>{resource.location}</span>
                          </div>
                        )}

                        {resource.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-gray-700">
                            {resource.notes}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t flex gap-1">
                        <select
                          value={resource.status}
                          onChange={(e) => updateResource(resource.id, { status: e.target.value })}
                          className="flex-1 px-2 py-1 border rounded text-xs"
                        >
                          {statusTypes.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this resource?')) {
                              deleteResource(resource.id);
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcePanel;
