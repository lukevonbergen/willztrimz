import { useEffect, useState } from 'react';
import { useMap, Polyline, Marker, Polygon } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon for drawing points
const createPointIcon = (isFirst) => {
  const size = isFirst ? 20 : 12;
  const anchor = isFirst ? 10 : 6;
  return L.divIcon({
    className: 'custom-drawing-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${isFirst ? '#ef4444' : '#3b82f6'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        cursor: pointer;
        ${isFirst ? 'animation: pulse 2s infinite;' : ''}
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor]
  });
};

const PolygonDrawingTool = ({ onComplete, onCancel }) => {
  const map = useMap();
  const [points, setPoints] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e) => {
      if (isComplete) return;

      const newPoint = [e.latlng.lat, e.latlng.lng];

      // Check if clicking on the first point to complete polygon
      if (points.length >= 3) {
        const firstPoint = points[0];
        const distance = map.distance(firstPoint, newPoint);

        // If clicked within 50 meters of first point, complete the polygon
        if (distance < 50) {
          setIsComplete(true);
          onComplete(points);
          return;
        }
      }

      setPoints(prev => [...prev, newPoint]);
    };

    // Add click handler
    map.on('click', handleMapClick);

    // Disable default map dragging while drawing
    map.dragging.disable();

    return () => {
      map.off('click', handleMapClick);
      map.dragging.enable();
    };
  }, [map, points, isComplete, onComplete]);

  // Handle clicking on the first marker to complete
  const handleFirstMarkerClick = () => {
    if (points.length >= 3 && !isComplete) {
      setIsComplete(true);
      onComplete(points);
    }
  };

  // Handle Escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <>
      {/* Draw lines between points */}
      {points.length > 1 && (
        <Polyline
          positions={points}
          color="#3b82f6"
          weight={2}
          dashArray="5, 5"
        />
      )}

      {/* Preview line from last point to first (when 3+ points) */}
      {points.length >= 3 && (
        <Polyline
          positions={[points[points.length - 1], points[0]]}
          color="#10b981"
          weight={2}
          dashArray="5, 5"
          opacity={0.6}
        />
      )}

      {/* Show completed polygon */}
      {isComplete && points.length >= 3 && (
        <Polygon
          positions={points}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2
          }}
        />
      )}

      {/* Draw markers for each point */}
      {points.map((point, index) => (
        <Marker
          key={index}
          position={point}
          icon={createPointIcon(index === 0)}
          eventHandlers={index === 0 ? {
            click: handleFirstMarkerClick
          } : {}}
        />
      ))}

      {/* Drawing instructions overlay */}
      <div className="leaflet-top leaflet-left" style={{ marginTop: '80px', marginLeft: '10px', pointerEvents: 'none' }}>
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500" style={{ pointerEvents: 'auto', maxWidth: '280px' }}>
          <h3 className="font-bold text-sm mb-2 text-blue-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Drawing Zone
          </h3>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white mt-0.5"></div>
              <p><span className="font-semibold">First point</span> - Click to start</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white mt-0.5"></div>
              <p><span className="font-semibold">Additional points</span> - Click to add</p>
            </div>
            <div className="pt-2 border-t space-y-1">
              <p className="text-red-600 font-bold">
                <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-1 align-middle animate-pulse"></span>
                Click the RED dot to complete!
              </p>
              <p><span className="font-semibold">Minimum:</span> 3 points required</p>
              <p><span className="font-semibold">Cancel:</span> Press <kbd className="px-1 bg-gray-100 border rounded">Esc</kbd></p>
            </div>
            {points.length > 0 && (
              <div className="pt-2 border-t bg-blue-50 -mx-4 -mb-4 px-4 py-2 mt-2 rounded-b-lg">
                <p className="font-semibold text-blue-700">
                  {points.length} point{points.length !== 1 ? 's' : ''} placed
                  {points.length >= 3 && (
                    <span className="block text-green-600 mt-1">
                      ✓ Ready to complete
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolygonDrawingTool;
