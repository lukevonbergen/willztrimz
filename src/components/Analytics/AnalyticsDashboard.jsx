import React, { useState, useEffect, useMemo } from 'react';
import { useSearch } from '../../context/SearchContext';
import { calculateCoveragePercentage, calculateArea } from '../../utils/geoUtils';

const AnalyticsDashboard = () => {
  const { searchAreas, officers, evidenceMarkers = [], incidents = [], currentTime } = useSearch();
  const [timeRange, setTimeRange] = useState('all');

  const analytics = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      'all': Infinity
    };

    const cutoff = now - (timeRanges[timeRange] || Infinity);

    // Overall search metrics
    const totalAreas = searchAreas.length;
    const totalOfficers = officers.length;
    const activeOfficers = officers.filter(o => o.active).length;

    // Coverage statistics
    const coverageStats = searchAreas.map(area => {
      const coverage = calculateCoveragePercentage(area.gridCells || []);
      const totalArea = calculateArea(area.coordinates);
      const timeElapsed = now - area.createdAt;
      const efficiency = timeElapsed > 0 ? (coverage / (timeElapsed / 3600000)) : 0; // % per hour

      return {
        area,
        coverage,
        totalArea,
        timeElapsed,
        efficiency,
        coveredArea: (totalArea * coverage) / 100
      };
    });

    const avgCoverage = coverageStats.length > 0
      ? coverageStats.reduce((sum, s) => sum + s.coverage, 0) / coverageStats.length
      : 0;

    const totalAreaSize = coverageStats.reduce((sum, s) => sum + s.totalArea, 0);
    const totalCoveredArea = coverageStats.reduce((sum, s) => sum + s.coveredArea, 0);

    // Officer efficiency
    const officerStats = officers.map(officer => {
      const pathLength = officer.path?.length || 0;
      const coverageContribution = searchAreas.reduce((sum, area) => {
        if (!area.gridCells) return sum;
        const officerCells = area.gridCells.filter(cell =>
          cell.officerId === officer.id
        ).length;
        const totalCells = area.gridCells.length;
        return sum + (totalCells > 0 ? (officerCells / totalCells) * 100 : 0);
      }, 0);

      const avgContribution = searchAreas.length > 0
        ? coverageContribution / searchAreas.length
        : 0;

      const timeActive = officer.startTime ? now - officer.startTime : 0;
      const efficiency = timeActive > 0 ? (pathLength / (timeActive / 60000)) : 0; // points per minute

      return {
        officer,
        pathLength,
        coverageContribution: avgContribution,
        timeActive,
        efficiency
      };
    });

    officerStats.sort((a, b) => b.coverageContribution - a.coverageContribution);

    // Evidence and incident stats
    const recentEvidence = evidenceMarkers.filter(e => e.timestamp >= cutoff);
    const recentIncidents = incidents.filter(i => i.timestamp >= cutoff);

    const evidenceByPriority = {
      high: recentEvidence.filter(e => e.priority === 'high').length,
      medium: recentEvidence.filter(e => e.priority === 'medium').length,
      low: recentEvidence.filter(e => e.priority === 'low').length
    };

    const incidentsBySeverity = {
      critical: recentIncidents.filter(i => i.severity === 'critical').length,
      high: recentIncidents.filter(i => i.severity === 'high').length,
      medium: recentIncidents.filter(i => i.severity === 'medium').length,
      low: recentIncidents.filter(i => i.severity === 'low').length
    };

    const openIncidents = incidents.filter(i => i.status === 'open').length;
    const closedIncidents = incidents.filter(i => i.status === 'closed').length;

    // Search patterns
    const completedAreas = coverageStats.filter(s => s.coverage >= 100).length;
    const inProgressAreas = coverageStats.filter(s => s.coverage > 0 && s.coverage < 100).length;
    const unstartedAreas = coverageStats.filter(s => s.coverage === 0).length;

    // Predictions
    const areasWithEfficiency = coverageStats.filter(s => s.efficiency > 0);
    const avgEfficiency = areasWithEfficiency.length > 0
      ? areasWithEfficiency.reduce((sum, s) => sum + s.efficiency, 0) / areasWithEfficiency.length
      : 0;

    const estimatedTimeToCompletion = inProgressAreas > 0 && avgEfficiency > 0
      ? coverageStats
          .filter(s => s.coverage < 100)
          .reduce((sum, s) => {
            const remaining = 100 - s.coverage;
            return sum + (remaining / avgEfficiency);
          }, 0)
      : 0;

    return {
      totalAreas,
      totalOfficers,
      activeOfficers,
      avgCoverage,
      totalAreaSize,
      totalCoveredArea,
      coverageStats,
      officerStats,
      evidenceCount: recentEvidence.length,
      evidenceByPriority,
      incidentCount: recentIncidents.length,
      incidentsBySeverity,
      openIncidents,
      closedIncidents,
      completedAreas,
      inProgressAreas,
      unstartedAreas,
      avgEfficiency,
      estimatedTimeToCompletion
    };
  }, [searchAreas, officers, evidenceMarkers, incidents, currentTime, timeRange]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const formatArea = (sqMeters) => {
    if (sqMeters < 1000) return `${sqMeters.toFixed(0)} m²`;
    return `${(sqMeters / 1000).toFixed(2)} km²`;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      {/* Header with time range selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Average Coverage</div>
          <div className="text-3xl font-bold text-blue-600">
            {analytics.avgCoverage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.totalCoveredArea > 0 && `${formatArea(analytics.totalCoveredArea)} covered`}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Active Officers</div>
          <div className="text-3xl font-bold text-green-600">
            {analytics.activeOfficers} / {analytics.totalOfficers}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {((analytics.activeOfficers / Math.max(analytics.totalOfficers, 1)) * 100).toFixed(0)}% active
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Evidence Collected</div>
          <div className="text-3xl font-bold text-purple-600">
            {analytics.evidenceCount}
          </div>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="text-red-600">{analytics.evidenceByPriority.high} high</span>
            <span className="text-yellow-600">{analytics.evidenceByPriority.medium} med</span>
            <span className="text-blue-600">{analytics.evidenceByPriority.low} low</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Incidents</div>
          <div className="text-3xl font-bold text-orange-600">
            {analytics.incidentCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.openIncidents} open, {analytics.closedIncidents} closed
          </div>
        </div>
      </div>

      {/* Search area progress */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Search Area Progress</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {analytics.completedAreas}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.inProgressAreas}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-gray-600">
              {analytics.unstartedAreas}
            </div>
            <div className="text-xs text-gray-600">Not Started</div>
          </div>
        </div>

        {analytics.estimatedTimeToCompletion > 0 && (
          <div className="p-3 bg-blue-50 rounded text-sm">
            <div className="font-semibold text-blue-800">Estimated Time to Completion</div>
            <div className="text-blue-600">
              {formatTime(analytics.estimatedTimeToCompletion * 3600000)}
            </div>
          </div>
        )}
      </div>

      {/* Officer leaderboard */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Officer Performance</h3>
        {analytics.officerStats.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No officer data</p>
        ) : (
          <div className="space-y-2">
            {analytics.officerStats.map((stat, idx) => (
              <div key={stat.officer.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold text-gray-400 w-6">
                  #{idx + 1}
                </div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: stat.officer.color }}
                ></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{stat.officer.officerName}</div>
                  <div className="text-xs text-gray-500">
                    {stat.pathLength} positions • {formatTime(stat.timeActive)} active
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">
                    {stat.coverageContribution.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">coverage</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Area efficiency breakdown */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Area Efficiency</h3>
        {analytics.coverageStats.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No search areas</p>
        ) : (
          <div className="space-y-3">
            {analytics.coverageStats.map(stat => (
              <div key={stat.area.id} className="border-l-4 pl-3" style={{
                borderColor: stat.coverage >= 100 ? '#10b981' :
                            stat.coverage >= 50 ? '#3b82f6' :
                            stat.coverage > 0 ? '#f59e0b' : '#6b7280'
              }}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">{stat.area.name}</h4>
                  <span className="text-sm font-bold">{stat.coverage.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Area Size:</span>
                    <span>{formatArea(stat.totalArea)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Elapsed:</span>
                    <span>{formatTime(stat.timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <span>{stat.efficiency.toFixed(2)}% per hour</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(stat.coverage, 100)}%`,
                      backgroundColor: stat.coverage >= 100 ? '#10b981' : '#3b82f6'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incident severity breakdown */}
      {analytics.incidentCount > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Incident Severity Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.incidentsBySeverity).map(([severity, count]) => {
              const total = analytics.incidentCount;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                critical: { bg: 'bg-red-500', text: 'text-red-800' },
                high: { bg: 'bg-orange-500', text: 'text-orange-800' },
                medium: { bg: 'bg-yellow-500', text: 'text-yellow-800' },
                low: { bg: 'bg-green-500', text: 'text-green-800' }
              };
              const color = colors[severity];

              return (
                <div key={severity}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{severity}</span>
                    <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color.bg}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
