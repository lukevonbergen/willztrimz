import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { calculateCoveragePercentage, getCoverageByOfficer, calculateArea } from '../../utils/geoUtils';
import { format } from 'date-fns';

const MainDashboard = () => {
  const { searchAreas, officers, alerts, isSimulationRunning, currentTime } = useSearch();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Calculate stats for each search area
    const newStats = {};

    searchAreas.forEach(area => {
      const coverage = calculateCoveragePercentage(area.gridCells || []);
      const officerStats = getCoverageByOfficer(area.gridCells || [], officers);
      const totalArea = calculateArea(area.coordinates);
      const timeElapsed = currentTime - area.createdAt;

      newStats[area.id] = {
        coverage,
        officerStats,
        totalArea,
        timeElapsed,
        coveredArea: (totalArea * coverage) / 100
      };
    });

    setStats(newStats);
  }, [searchAreas, officers, currentTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
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
    <div className="h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold text-gray-800">Search Operations Dashboard</h2>
        <div className="mt-2 flex items-center space-x-4 text-sm">
          <div className={`px-3 py-1 rounded-full ${isSimulationRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isSimulationRunning ? 'Active' : 'Inactive'}
          </div>
          <div className="text-gray-600">
            {searchAreas.length} {searchAreas.length === 1 ? 'Area' : 'Areas'}
          </div>
          <div className="text-gray-600">
            {officers.filter(o => o.active).length} Active Officers
          </div>
        </div>
      </div>

      {/* Active Officers */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Active Officers</h3>
        {officers.length === 0 ? (
          <p className="text-sm text-gray-500">No officers assigned</p>
        ) : (
          <div className="space-y-2">
            {officers.filter(o => o.active).map(officer => (
              <div key={officer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
                <div className="text-xs text-gray-600">
                  {officer.path.length} positions tracked
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Areas Stats */}
      {searchAreas.map(area => {
        const areaStats = stats[area.id] || {};
        const coverage = areaStats.coverage || 0;
        const isComplete = coverage >= 100;

        // Calculate if area is behind schedule
        const timeElapsed = areaStats.timeElapsed || 0;
        const expectedCoverage = (timeElapsed / (area.timeThreshold * 60000)) * 100;
        const isBehindSchedule = coverage < expectedCoverage && !isComplete;

        return (
          <div key={area.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{area.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    area.priority === 'high' ? 'bg-red-100 text-red-800' :
                    area.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {area.priority} priority
                  </span>
                  {isComplete && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                      ✓ Complete
                    </span>
                  )}
                  {isBehindSchedule && (
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
                      ⚠ Behind Schedule
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold text-2xl" style={{ color: isComplete ? '#10b981' : '#3b82f6' }}>
                  {coverage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">searched</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(coverage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Total Area</div>
                <div className="font-medium">{formatArea(areaStats.totalArea || 0)}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Covered Area</div>
                <div className="font-medium">{formatArea(areaStats.coveredArea || 0)}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Time Elapsed</div>
                <div className="font-medium">{formatTime(timeElapsed)}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Time Threshold</div>
                <div className="font-medium">{area.timeThreshold} min</div>
              </div>
            </div>

            {/* Officer coverage breakdown */}
            {areaStats.officerStats && Object.keys(areaStats.officerStats).length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 mb-2">Coverage by Officer</div>
                <div className="space-y-1">
                  {Object.values(areaStats.officerStats).map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        ></div>
                        <span>{stat.officerName}</span>
                      </div>
                      <span className="font-medium">{stat.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty state */}
      {searchAreas.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Search Areas</h3>
          <p className="text-sm text-gray-500">
            Create a search area using the drawing tool to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
