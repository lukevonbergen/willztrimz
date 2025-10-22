import React, { useMemo } from 'react';
import { useSearch } from '../../context/SearchContext';

const MissionControlPanel = () => {
  const { searchAreas, officers, alerts } = useSearch();

  // Calculate statistics
  const stats = useMemo(() => {
    const activeOfficers = officers.filter(o => o.active);
    const totalCoverage = searchAreas.reduce((sum, area) => {
      const covered = area.gridCells?.filter(c => c.covered).length || 0;
      const total = area.gridCells?.length || 1;
      return sum + (covered / total);
    }, 0);
    const avgCoverage = searchAreas.length > 0 ? (totalCoverage / searchAreas.length) * 100 : 0;

    // Calculate total distance traveled by all officers
    const totalDistance = officers.reduce((sum, officer) => {
      return sum + (officer.distanceTraveled || 0);
    }, 0);

    // Calculate critical alerts
    const criticalAlerts = alerts.filter(a => a.type === 'overdue' || a.type === 'breach').length;

    // Determine overall mission status
    let missionStatus = 'STANDBY';
    let statusColor = 'text-tactical-text-secondary';
    if (activeOfficers.length > 0) {
      if (avgCoverage >= 80) {
        missionStatus = 'COMPLETING';
        statusColor = 'text-tactical-success';
      } else if (avgCoverage >= 40) {
        missionStatus = 'IN PROGRESS';
        statusColor = 'text-tactical-accent-primary';
      } else {
        missionStatus = 'INITIATED';
        statusColor = 'text-tactical-warning';
      }
    }

    return {
      activeOfficers: activeOfficers.length,
      totalOfficers: officers.length,
      activeZones: searchAreas.length,
      avgCoverage: avgCoverage.toFixed(1),
      totalDistance: (totalDistance / 1000).toFixed(2), // Convert to km
      criticalAlerts,
      missionStatus,
      statusColor
    };
  }, [searchAreas, officers, alerts]);

  // Zone details
  const zoneDetails = useMemo(() => {
    return searchAreas.map(area => {
      const covered = area.gridCells?.filter(c => c.covered).length || 0;
      const total = area.gridCells?.length || 1;
      const coverage = ((covered / total) * 100).toFixed(1);

      // Assigned officers
      const assignedOfficers = officers.filter(o => o.assignedZone === area.id && o.active);

      return {
        id: area.id,
        name: area.name,
        coverage: parseFloat(coverage),
        priority: area.priority,
        assignedCount: assignedOfficers.length,
        status: coverage >= 80 ? 'COMPLETE' : coverage >= 40 ? 'ACTIVE' : 'PENDING'
      };
    });
  }, [searchAreas, officers]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 tactical-grid-bg">
      {/* Mission Status Card */}
      <div className="tactical-panel glow-border-strong">
        <div className="tactical-panel-header">MISSION STATUS</div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-3xl font-bold ${stats.statusColor}`} style={{ fontFamily: 'Orbitron, monospace' }}>
              {stats.missionStatus}
            </div>
            <div className="text-xs text-tactical-text-secondary mt-1">
              {stats.activeOfficers > 0 ? 'OPERATIONS ACTIVE' : 'AWAITING DEPLOYMENT'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
              {stats.avgCoverage}%
            </div>
            <div className="text-xs text-tactical-text-secondary">AVG COVERAGE</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.avgCoverage}%` }}
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="tactical-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label">Officers</div>
              <div className="text-2xl font-bold text-tactical-success" style={{ fontFamily: 'Orbitron, monospace' }}>
                {stats.activeOfficers}/{stats.totalOfficers}
              </div>
            </div>
            <svg className="w-10 h-10 text-tactical-success opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="tactical-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label">Active Zones</div>
              <div className="text-2xl font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                {stats.activeZones}
              </div>
            </div>
            <svg className="w-10 h-10 text-tactical-accent-primary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>

        <div className="tactical-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label">Distance</div>
              <div className="text-2xl font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                {stats.totalDistance} km
              </div>
            </div>
            <svg className="w-10 h-10 text-tactical-accent-primary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="tactical-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label">Critical Alerts</div>
              <div className={`text-2xl font-bold ${stats.criticalAlerts > 0 ? 'text-tactical-danger' : 'text-tactical-success'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                {stats.criticalAlerts}
              </div>
            </div>
            <svg className={`w-10 h-10 ${stats.criticalAlerts > 0 ? 'text-tactical-danger' : 'text-tactical-success'} opacity-30`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Zone Status List */}
      {zoneDetails.length > 0 && (
        <div className="tactical-panel">
          <div className="tactical-panel-header">ZONE STATUS</div>
          <div className="space-y-2">
            {zoneDetails.map(zone => (
              <div key={zone.id} className="data-row">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      zone.status === 'COMPLETE' ? 'bg-tactical-success' :
                      zone.status === 'ACTIVE' ? 'bg-tactical-accent-primary' :
                      'bg-tactical-text-secondary'
                    } pulse-glow`}></div>
                    <span className="font-semibold text-tactical-text-primary">{zone.name}</span>
                  </div>
                  <div className="text-xs text-tactical-text-secondary mt-1">
                    Priority: <span className={`${
                      zone.priority === 'high' ? 'text-tactical-danger' :
                      zone.priority === 'medium' ? 'text-tactical-warning' :
                      'text-tactical-text-secondary'
                    }`}>{zone.priority?.toUpperCase()}</span>
                    {' '} | Officers: {zone.assignedCount}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {zone.coverage}%
                  </div>
                  <div className="text-xs text-tactical-text-secondary">{zone.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Objectives */}
      <div className="tactical-panel">
        <div className="tactical-panel-header">MISSION OBJECTIVES</div>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className={`mt-1 ${stats.activeOfficers > 0 ? 'text-tactical-success' : 'text-tactical-text-secondary'}`}>
              {stats.activeOfficers > 0 ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-tactical-text-primary">Deploy Officers</div>
              <div className="text-xs text-tactical-text-secondary">Assign and activate officers to zones</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className={`mt-1 ${parseFloat(stats.avgCoverage) >= 50 ? 'text-tactical-success' : 'text-tactical-text-secondary'}`}>
              {parseFloat(stats.avgCoverage) >= 50 ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-tactical-text-primary">Achieve 50% Coverage</div>
              <div className="text-xs text-tactical-text-secondary">Cover at least half of all designated zones</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className={`mt-1 ${parseFloat(stats.avgCoverage) >= 80 ? 'text-tactical-success' : 'text-tactical-text-secondary'}`}>
              {parseFloat(stats.avgCoverage) >= 80 ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-tactical-text-primary">Complete Search Operation</div>
              <div className="text-xs text-tactical-text-secondary">Achieve 80%+ coverage across all zones</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className={`mt-1 ${stats.criticalAlerts === 0 && stats.activeOfficers > 0 ? 'text-tactical-success' : 'text-tactical-text-secondary'}`}>
              {stats.criticalAlerts === 0 && stats.activeOfficers > 0 ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-tactical-text-primary">Maintain Zero Critical Alerts</div>
              <div className="text-xs text-tactical-text-secondary">Respond to all breaches and delays</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="tactical-panel">
        <div className="tactical-panel-header">QUICK ACTIONS</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-tactical text-xs py-2">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ADD OFFICER
          </button>
          <button className="btn-tactical text-xs py-2">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            DEFINE ZONE
          </button>
          <button className="btn-tactical text-xs py-2">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            EXPORT DATA
          </button>
          <button className="btn-tactical text-xs py-2">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            IMPORT DATA
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionControlPanel;
