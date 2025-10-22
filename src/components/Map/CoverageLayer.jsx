import React from 'react';
import { Rectangle } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';

const CoverageLayer = () => {
  const { searchAreas, officers } = useSearch();

  // Create a map of officer IDs to colors for quick lookup
  const officerColors = officers.reduce((acc, officer) => {
    acc[officer.id] = officer.color;
    return acc;
  }, {});

  return (
    <>
      {searchAreas.map(area => {
        if (!area.gridCells || area.gridCells.length === 0) return null;

        return area.gridCells.map(cell => {
          // Determine cell color
          let fillColor = '#9ca3af'; // gray for uncovered
          let fillOpacity = 0.2;

          if (cell.covered && cell.coveredBy) {
            fillColor = officerColors[cell.coveredBy] || '#10b981';
            fillOpacity = 0.6;
          }

          return (
            <Rectangle
              key={`${area.id}-cell-${cell.id}`}
              bounds={cell.bounds}
              pathOptions={{
                color: fillColor,
                weight: 0.5,
                opacity: 0.3,
                fillColor: fillColor,
                fillOpacity: fillOpacity
              }}
            />
          );
        });
      })}
    </>
  );
};

export default CoverageLayer;
