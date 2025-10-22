import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * MapController component
 * Controls map interactions based on drawing mode
 * Disables dragging when in drawing mode to prevent conflicts with drawing tools
 */
const MapController = ({ isDrawingMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (isDrawingMode) {
      // Only disable map dragging when drawing
      // This prevents the map from moving when trying to draw polygons
      // But keeps zoom and other drawing tools functional
      map.dragging.disable();

      // Keep zoom enabled so users can zoom in/out while positioning for drawing
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();

      // Keep tap enabled for touch devices
      if (map.tap) map.tap.enable();

      // Change cursor to crosshair to indicate drawing mode
      map.getContainer().style.cursor = 'crosshair';
    } else {
      // Re-enable all interactions when not drawing
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      // Reset cursor
      map.getContainer().style.cursor = '';
    }

    // Cleanup function
    return () => {
      if (map) {
        // Ensure interactions are re-enabled when component unmounts
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        map.getContainer().style.cursor = '';
      }
    };
  }, [map, isDrawingMode]);

  return null; // This component doesn't render anything
};

export default MapController;
