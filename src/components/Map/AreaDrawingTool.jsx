import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

const AreaDrawingTool = ({ onAreaCreated }) => {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    if (!map) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    // Initialize the draw control
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e74c3c',
            message: '<strong>Error:</strong> Shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        },
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    map.addControl(drawControl);

    // Handle shape creation
    const onDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      // Convert to our coordinate format [lat, lng]
      let coordinates;
      if (e.layerType === 'polygon') {
        coordinates = layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]);
      } else if (e.layerType === 'rectangle') {
        const bounds = layer.getBounds();
        coordinates = [
          [bounds.getNorth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()],
          [bounds.getSouth(), bounds.getEast()],
          [bounds.getSouth(), bounds.getWest()]
        ];
      }

      if (coordinates && onAreaCreated) {
        onAreaCreated(coordinates);
      }
    };

    map.on(L.Draw.Event.CREATED, onDrawCreated);

    // Cleanup
    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onAreaCreated]);

  return null;
};

export default AreaDrawingTool;
