import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';

const TacticalHeader = ({ missionStartTime, onToggleSimulation, onToggleDrawing, isDrawingMode }) => {
  const { searchAreas, officers, isSimulationRunning } = useSearch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionDuration, setMissionDuration] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Calculate mission duration
      const elapsed = Date.now() - missionStartTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setMissionDuration(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [missionStartTime]);

  const activeOfficers = officers.filter(o => o.active).length;
  const activeZones = searchAreas.length;

  // Calculate overall threat level based on activity
  const getThreatLevel = () => {
    if (activeZones === 0) return { level: 'MINIMAL', color: 'text-tactical-text-secondary', bg: 'bg-gray-700' };
    if (activeZones >= 5 || activeOfficers >= 10) return { level: 'CRITICAL', color: 'text-tactical-danger', bg: 'bg-red-900' };
    if (activeZones >= 3 || activeOfficers >= 5) return { level: 'ELEVATED', color: 'text-tactical-warning', bg: 'bg-yellow-900' };
    return { level: 'MODERATE', color: 'text-tactical-success', bg: 'bg-green-900' };
  };

  const threatLevel = getThreatLevel();

  return (
    <header className="bg-tactical-bg-secondary border-b border-tactical-border shadow-lg">
      <div className="px-6 py-3">
        {/* Top Row - Title and System Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-tactical-accent-secondary to-tactical-accent-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                  TACTICAL OPERATIONS SYSTEM
                </h1>
                <div className="text-xs text-tactical-text-secondary tracking-wider">
                  CLASSIFIED // LAW ENFORCEMENT USE ONLY
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* System Time */}
            <div className="tactical-panel px-4 py-2">
              <div className="text-xs text-tactical-text-secondary mb-1">SYSTEM TIME</div>
              <div className="text-lg font-bold text-tactical-accent-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>

            {/* Threat Level */}
            <div className="tactical-panel px-4 py-2">
              <div className="text-xs text-tactical-text-secondary mb-1">THREAT LEVEL</div>
              <div className={`text-lg font-bold ${threatLevel.color} pulse-glow`} style={{ fontFamily: 'Orbitron, monospace' }}>
                {threatLevel.level}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Mission Stats and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Mission Timer */}
            <div className="flex items-center space-x-2">
              <div className="text-xs text-tactical-text-secondary tracking-wider">MISSION DURATION</div>
              <div className="mission-timer">
                {missionDuration}
              </div>
            </div>

            {/* Active Zones */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-tactical-bg-tertiary rounded border border-tactical-border">
              <svg className="w-4 h-4 text-tactical-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-tactical-text-secondary text-xs">ZONES:</span>
              <span className="text-tactical-accent-primary font-bold">{activeZones}</span>
            </div>

            {/* Active Officers */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-tactical-bg-tertiary rounded border border-tactical-border">
              <svg className="w-4 h-4 text-tactical-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-tactical-text-secondary text-xs">OFFICERS:</span>
              <span className="text-tactical-success font-bold">{activeOfficers}/{officers.length}</span>
            </div>

            {/* Simulation Status */}
            <div className={`px-3 py-1 rounded text-xs font-semibold ${
              isSimulationRunning
                ? 'bg-tactical-success bg-opacity-20 text-tactical-success border border-tactical-success pulse-glow'
                : 'bg-tactical-text-secondary bg-opacity-20 text-tactical-text-secondary border border-tactical-text-secondary'
            }`}>
              {isSimulationRunning ? '⚡ LIVE TRACKING' : '⏸ STANDBY'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Draw Zone Button */}
            <button
              onClick={onToggleDrawing}
              className={`btn-tactical ${isDrawingMode ? 'btn-tactical-danger' : ''}`}
            >
              {isDrawingMode ? (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  CANCEL
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  DEFINE ZONE
                </>
              )}
            </button>

            {/* Simulation Control */}
            <button
              onClick={onToggleSimulation}
              disabled={searchAreas.length === 0 || officers.length === 0}
              className={`btn-tactical ${
                isSimulationRunning ? 'btn-tactical-danger' : 'btn-tactical-success'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSimulationRunning ? (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PAUSE
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  START
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TacticalHeader;
