import React, { useMemo } from 'react';
import { Rectangle } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';

// Memoized cell component to prevent unnecessary re-renders
const CoverageCell = React.memo(({ cellKey, bounds, pathOptions }) => {
  return (
    <Rectangle
      key={cellKey}
      bounds={bounds}
      pathOptions={pathOptions}
    />
  );
});

CoverageCell.displayName = 'CoverageCell';

const CoverageLayer = () => {
  const { searchAreas, officers } = useSearch();

  // Create a map of officer IDs to colors for quick lookup
  const officerColors = useMemo(() => {
    return officers.reduce((acc, officer) => {
      acc[officer.id] = officer.color;
      return acc;
    }, {});
  }, [officers]);

  // Memoize the rendered cells to prevent unnecessary recalculations
  const renderedCells = useMemo(() => {
    const cells = [];

    searchAreas.forEach(area => {
      if (!area.gridCells || area.gridCells.length === 0) return;

      // Only render covered cells and a sample of uncovered cells for performance
      // This significantly reduces the number of DOM elements
      area.gridCells.forEach((cell, index) => {
        // Always render covered cells
        // For uncovered cells, render every 5th cell to show the grid without performance hit
        const shouldRender = cell.covered || index % 5 === 0;

        if (!shouldRender) return;

        // Determine cell color
        let fillColor = '#9ca3af'; // gray for uncovered
        let fillOpacity = 0.2;

        if (cell.covered && cell.coveredBy) {
          fillColor = officerColors[cell.coveredBy] || '#10b981';
          fillOpacity = 0.6;
        }

        cells.push(
          <CoverageCell
            key={`${area.id}-cell-${cell.id}`}
            cellKey={`${area.id}-cell-${cell.id}`}
            bounds={cell.bounds}
            pathOptions={{
              color: fillColor,
              weight: cell.covered ? 0.5 : 0.3,
              opacity: cell.covered ? 0.3 : 0.1,
              fillColor: fillColor,
              fillOpacity: fillOpacity
            }}
          />
        );
      });
    });

    return cells;
  }, [searchAreas, officerColors]);

  return <>{renderedCells}</>;
};

export default React.memo(CoverageLayer);
