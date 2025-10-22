import React, { useState, useEffect, useMemo } from 'react';
import { useSearch } from '../../context/SearchContext';

const TacticalActivityLog = () => {
  const { alerts, officers, searchAreas } = useSearch();
  const [activityLog, setActivityLog] = useState([]);

  // Generate activity log from various sources
  useEffect(() => {
    const newActivities = [];

    // Add alert-based activities
    alerts.slice(-20).forEach(alert => {
      newActivities.push({
        id: `alert-${alert.id}`,
        timestamp: alert.timestamp,
        type: alert.type,
        category: 'ALERT',
        message: alert.message,
        priority: alert.type === 'overdue' || alert.type === 'breach' ? 'high' : 'medium',
        icon: alert.type === 'overdue' ? 'clock' : alert.type === 'completed' ? 'check' : 'warning'
      });
    });

    // Add officer status changes
    officers.forEach(officer => {
      if (officer.active) {
        newActivities.push({
          id: `officer-${officer.id}-active`,
          timestamp: Date.now() - Math.random() * 3600000, // Simulate timestamps
          type: 'officer_deployed',
          category: 'PERSONNEL',
          message: `${officer.officerName} deployed to ${officer.assignedZone ? 'assigned zone' : 'field'}`,
          priority: 'medium',
          icon: 'user'
        });
      }
    });

    // Add zone status updates
    searchAreas.forEach(area => {
      const covered = area.gridCells?.filter(c => c.covered).length || 0;
      const total = area.gridCells?.length || 1;
      const coverage = (covered / total) * 100;

      if (coverage >= 80) {
        newActivities.push({
          id: `zone-${area.id}-complete`,
          timestamp: Date.now() - Math.random() * 1800000,
          type: 'zone_complete',
          category: 'OPERATION',
          message: `Zone "${area.name}" search complete (${coverage.toFixed(0)}%)`,
          priority: 'low',
          icon: 'check-circle'
        });
      } else if (coverage >= 40) {
        newActivities.push({
          id: `zone-${area.id}-progress`,
          timestamp: Date.now() - Math.random() * 900000,
          type: 'zone_progress',
          category: 'OPERATION',
          message: `Zone "${area.name}" ${coverage.toFixed(0)}% complete`,
          priority: 'low',
          icon: 'activity'
        });
      }
    });

    // Sort by timestamp (most recent first)
    newActivities.sort((a, b) => b.timestamp - a.timestamp);

    // Limit to most recent 50 activities
    setActivityLog(newActivities.slice(0, 50));
  }, [alerts, officers, searchAreas]);

  const getIconSvg = (iconType) => {
    switch (iconType) {
      case 'clock':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'check':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        );
      case 'warning':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        );
      case 'user':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        );
      case 'check-circle':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'activity':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-tactical-danger';
      case 'medium':
        return 'text-tactical-warning';
      case 'low':
        return 'text-tactical-success';
      default:
        return 'text-tactical-text-secondary';
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'ALERT': 'border-tactical-danger text-tactical-danger',
      'PERSONNEL': 'border-tactical-success text-tactical-success',
      'OPERATION': 'border-tactical-accent-primary text-tactical-accent-primary',
      'SYSTEM': 'border-tactical-text-secondary text-tactical-text-secondary'
    };

    return colors[category] || colors['SYSTEM'];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 tactical-grid-bg">
      <div className="tactical-panel-header sticky top-0 bg-tactical-bg-secondary z-10 py-2">
        <div className="flex items-center justify-between">
          <span>ACTIVITY LOG</span>
          <span className="text-xs font-normal text-tactical-text-secondary">REAL-TIME</span>
        </div>
      </div>

      {activityLog.length === 0 ? (
        <div className="tactical-panel text-center py-8">
          <svg className="w-12 h-12 mx-auto text-tactical-text-secondary opacity-50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-tactical-text-secondary text-sm">No activity recorded</div>
          <div className="text-tactical-text-secondary text-xs mt-1">Start a mission to see live updates</div>
        </div>
      ) : (
        <div className="space-y-2">
          {activityLog.map((activity, index) => (
            <div
              key={activity.id}
              className="tactical-panel hover:glow-border transition-all duration-200 cursor-pointer"
              style={{
                animation: index < 3 ? 'fadeIn 0.5s ease-in' : 'none'
              }}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${
                  activity.priority === 'high' ? 'bg-tactical-danger' :
                  activity.priority === 'medium' ? 'bg-tactical-warning' :
                  'bg-tactical-success'
                } bg-opacity-20 flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${getPriorityColor(activity.priority)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIconSvg(activity.icon)}
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryBadge(activity.category)}`}>
                          {activity.category}
                        </span>
                        <span className="text-xs text-tactical-text-secondary">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-tactical-text-primary leading-snug">
                        {activity.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System Status Footer */}
      <div className="tactical-panel sticky bottom-0 bg-tactical-bg-secondary">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-tactical-success rounded-full pulse-glow"></div>
            <span className="text-tactical-text-secondary">System Online</span>
          </div>
          <div className="text-tactical-text-secondary">
            {activityLog.length} events logged
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TacticalActivityLog;
