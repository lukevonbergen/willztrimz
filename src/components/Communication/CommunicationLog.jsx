import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

const CommunicationLog = () => {
  const { communications = [], addCommunication, officers } = useSearch();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    type: 'general',
    priority: 'normal',
    fromOfficerId: '',
    toOfficerId: '',
    channel: 'all'
  });

  const messageTypes = [
    { value: 'general', label: 'General', icon: '💬', color: 'bg-gray-100' },
    { value: 'alert', label: 'Alert', icon: '⚠️', color: 'bg-yellow-100' },
    { value: 'emergency', label: 'Emergency', icon: '🚨', color: 'bg-red-100' },
    { value: 'status', label: 'Status Update', icon: '📊', color: 'bg-blue-100' },
    { value: 'command', label: 'Command', icon: '📢', color: 'bg-purple-100' },
    { value: 'report', label: 'Report', icon: '📝', color: 'bg-green-100' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const fromOfficer = officers.find(o => o.id === formData.fromOfficerId);
    const toOfficer = officers.find(o => o.id === formData.toOfficerId);

    addCommunication({
      ...formData,
      fromOfficerName: fromOfficer?.officerName || 'Command Center',
      toOfficerName: formData.channel === 'all' ? 'All Units' : toOfficer?.officerName || 'Unknown',
      timestamp: Date.now()
    });

    setFormData({
      message: '',
      type: 'general',
      priority: 'normal',
      fromOfficerId: '',
      toOfficerId: '',
      channel: 'all'
    });
    setIsAdding(false);
  };

  const sortedCommunications = [...communications].sort((a, b) => b.timestamp - a.timestamp);

  const getTypeInfo = (type) => {
    return messageTypes.find(t => t.value === type) || messageTypes[0];
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="text-lg">📡</span>
            Command Center Comms
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-3 py-1 text-sm rounded ${
              isAdding
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAdding ? 'Cancel' : '+ Send Message'}
          </button>
        </div>

        <div className="text-xs text-gray-400">
          {communications.length} total messages
        </div>
      </div>

      {isAdding && (
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">Message *</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
                rows="3"
                placeholder="Enter message..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
                >
                  {messageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">From</label>
              <select
                value={formData.fromOfficerId}
                onChange={(e) => setFormData({ ...formData, fromOfficerId: e.target.value })}
                className="w-full px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
              >
                <option value="">Command Center</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>{officer.officerName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">To</label>
              <select
                value={formData.channel}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    channel: val,
                    toOfficerId: val === 'all' ? '' : val
                  });
                }}
                className="w-full px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
              >
                <option value="all">All Units</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>{officer.officerName}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedCommunications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No communications</p>
            <p className="text-xs mt-1">Send messages to coordinate operations</p>
          </div>
        ) : (
          sortedCommunications.map(comm => {
            const typeInfo = getTypeInfo(comm.type);
            const isUrgent = comm.priority === 'urgent' || comm.priority === 'high';

            return (
              <div
                key={comm.id}
                className={`p-3 rounded border ${
                  comm.type === 'emergency' ? 'border-red-500 bg-red-900 bg-opacity-20' :
                  isUrgent ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' :
                  'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{typeInfo.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs">
                        <span className="font-semibold text-white">{comm.fromOfficerName}</span>
                        <span className="text-gray-400"> → </span>
                        <span className="font-semibold text-white">{comm.toOfficerName}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        comm.priority === 'urgent' ? 'bg-red-600 text-white' :
                        comm.priority === 'high' ? 'bg-orange-600 text-white' :
                        comm.priority === 'normal' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {comm.priority}
                      </span>
                    </div>

                    <div className="text-sm text-gray-200 mb-2">
                      {comm.message}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="capitalize">{typeInfo.label}</span>
                      <span>{new Date(comm.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick actions */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setFormData({
                ...formData,
                type: 'emergency',
                priority: 'urgent',
                channel: 'all'
              });
              setIsAdding(true);
            }}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            🚨 Emergency
          </button>
          <button
            onClick={() => {
              setFormData({
                ...formData,
                type: 'command',
                priority: 'high',
                channel: 'all'
              });
              setIsAdding(true);
            }}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            📢 Command
          </button>
          <button
            onClick={() => {
              setFormData({
                ...formData,
                type: 'status',
                priority: 'normal',
                channel: 'all'
              });
              setIsAdding(true);
            }}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            📊 Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationLog;
