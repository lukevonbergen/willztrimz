import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * MapController component
 * Controls map interactions based on drawing mode
 * Disables map dragging entirely when in drawing mode to allow drawing tools to work
 */
const MapController = ({ isDrawingMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (isDrawingMode) {
      // Disable map dragging when in drawing mode
      // This prevents the map from panning while trying to draw
      map.dragging.disable();
      console.log('Drawing mode ON - map dragging disabled');
    } else {
      // Re-enable map dragging when not in drawing mode
      map.dragging.enable();
      console.log('Drawing mode OFF - map dragging enabled');
    }

    // Cleanup function
    return () => {
      if (map) {
        // Always re-enable dragging on cleanup
        map.dragging.enable();
      }
    };
  }, [map, isDrawingMode]);

  return null; // This component doesn't render anything
};

export default MapController;
