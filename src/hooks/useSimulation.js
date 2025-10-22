import { useEffect, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { createSimulations } from '../utils/gpsSimulation';
import { updateCellCoverage, calculateCoveragePercentage } from '../utils/geoUtils';

export const useSimulation = () => {
  const {
    searchAreas,
    officers,
    isSimulationRunning,
    simulationSpeed,
    updateSearchArea,
    addOfficerLocation,
    addAlert,
    isPlaybackMode
  } = useSearch();

  const simulationsRef = useRef(new Map());
  const intervalRef = useRef(null);
  const lastAlertRef = useRef(new Map());

  useEffect(() => {
    // Don't run simulation in playback mode
    if (isPlaybackMode) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isSimulationRunning && searchAreas.length > 0 && officers.length > 0) {
      // Initialize simulations for each officer in each search area
      searchAreas.forEach(area => {
        if (!simulationsRef.current.has(area.id)) {
          const sims = createSimulations(officers.filter(o => o.active), area);
          simulationsRef.current.set(area.id, sims);
        } else {
          // Update simulations if officers changed
          const existingSims = simulationsRef.current.get(area.id);
          const activeOfficers = officers.filter(o => o.active);

          // Add new officers
          activeOfficers.forEach(officer => {
            if (!existingSims.has(officer.id)) {
              const sims = createSimulations([officer], area);
              existingSims.set(officer.id, sims.get(officer.id));
            }
          });

          // Remove inactive officers
          existingSims.forEach((sim, officerId) => {
            const officer = activeOfficers.find(o => o.id === officerId);
            if (!officer) {
              existingSims.delete(officerId);
            }
          });
        }
      });

      // Start simulation interval
      const baseInterval = 3000; // 3 seconds base
      const interval = baseInterval / simulationSpeed;

      intervalRef.current = setInterval(() => {
        searchAreas.forEach(area => {
          const simulations = simulationsRef.current.get(area.id);
          if (!simulations) return;

          let cellsUpdated = false;
          let updatedCells = area.gridCells ? [...area.gridCells] : [];

          simulations.forEach((simulation, officerId) => {
            const nextPosition = simulation.getNextPosition();

            if (nextPosition) {
              // Update officer location
              addOfficerLocation(officerId, {
                lat: nextPosition[0],
                lng: nextPosition[1]
              });

              // Update cell coverage
              if (updatedCells.length > 0) {
                updatedCells = updateCellCoverage(
                  updatedCells,
                  nextPosition,
                  officerId
                );
                cellsUpdated = true;
              }
            }
          });

          // Update search area with new coverage data
          if (cellsUpdated) {
            const newCoverage = calculateCoveragePercentage(updatedCells);
            const oldCoverage = calculateCoveragePercentage(area.gridCells || []);

            updateSearchArea(area.id, {
              gridCells: updatedCells
            });

            // Check for 100% coverage alert
            if (newCoverage >= 100 && oldCoverage < 100) {
              addAlert({
                type: 'success',
                message: `Search area "${area.name}" is 100% complete!`,
                details: 'All cells in this area have been searched.'
              });
            }

            // Check for time threshold warnings
            const timeElapsed = Date.now() - area.createdAt;
            const minutesElapsed = timeElapsed / 60000;
            const expectedCoverage = (minutesElapsed / area.timeThreshold) * 100;

            // Alert if more than 25% behind schedule (and not already alerted recently)
            const lastAlert = lastAlertRef.current.get(area.id) || 0;
            const timeSinceLastAlert = Date.now() - lastAlert;

            if (
              newCoverage < expectedCoverage - 25 &&
              minutesElapsed > area.timeThreshold * 0.25 &&
              timeSinceLastAlert > 300000 // Only alert every 5 minutes
            ) {
              addAlert({
                type: 'warning',
                message: `Search area "${area.name}" is behind schedule`,
                details: `Expected ${expectedCoverage.toFixed(1)}% coverage, but only ${newCoverage.toFixed(1)}% complete.`
              });
              lastAlertRef.current.set(area.id, Date.now());
            }
          }
        });
      }, interval);

      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Clear simulations if stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [
    isSimulationRunning,
    searchAreas,
    officers,
    simulationSpeed,
    updateSearchArea,
    addOfficerLocation,
    addAlert,
    isPlaybackMode
  ]);

  return {
    isRunning: isSimulationRunning && !isPlaybackMode
  };
};
