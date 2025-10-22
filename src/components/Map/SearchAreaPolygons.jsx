import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';

const SearchAreaPolygons = () => {
  const { searchAreas } = useSearch();

  return (
    <>
      {searchAreas.map(area => {
        const positions = area.coordinates.map(coord => [coord[0], coord[1]]);

        return (
          <Polygon
            key={area.id}
            positions={positions}
            pathOptions={{
              color: area.priority === 'high' ? '#ef4444' :
                     area.priority === 'medium' ? '#f59e0b' : '#3b82f6',
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.1
            }}
          >
            <Tooltip>
              <div className="text-sm">
                <div className="font-semibold">{area.name}</div>
                <div>Priority: {area.priority}</div>
                <div>Threshold: {area.timeThreshold} min</div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};

export default SearchAreaPolygons;
