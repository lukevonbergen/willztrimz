import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * MapController component
 * Controls map interactions based on drawing mode
 * NOTE: Leaflet Draw handles its own interactions, so we don't disable anything
 * We just provide visual feedback (cursor) when in drawing mode
 */
const MapController = ({ isDrawingMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (isDrawingMode) {
      // Don't disable any map interactions - Leaflet Draw needs them!
      // Just change cursor to indicate drawing mode
      const container = map.getContainer();
      container.classList.add('drawing-mode');
    } else {
      // Remove drawing mode class
      const container = map.getContainer();
      container.classList.remove('drawing-mode');
    }

    // Cleanup function
    return () => {
      if (map) {
        const container = map.getContainer();
        container.classList.remove('drawing-mode');
      }
    };
  }, [map, isDrawingMode]);

  return null; // This component doesn't render anything
};

export default MapController;
