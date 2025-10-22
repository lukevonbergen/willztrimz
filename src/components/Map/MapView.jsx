import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';
import AreaDrawingTool from './AreaDrawingTool';
import OfficerMarkers from './OfficerMarkers';
import CoverageLayer from './CoverageLayer';
import SearchAreaPolygons from './SearchAreaPolygons';
import LocationSearch from './LocationSearch';
import MapController from './MapController';

// Default center (can be changed to any location)
const DEFAULT_CENTER = [40.7128, -74.0060]; // New York City
const DEFAULT_ZOOM = 15;

const MapView = ({ isDrawingMode, onAreaCreated }) => {
  const { officers, isPlaybackMode, playbackTime } = useSearch();
  const [map, setMap] = useState(null);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        ref={setMap}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
        />

        {/* Map controller - handles interaction states */}
        <MapController isDrawingMode={isDrawingMode} />

        {/* Search area polygons */}
        <SearchAreaPolygons />

        {/* Coverage visualization */}
        <CoverageLayer />

        {/* Officer markers and paths */}
        <OfficerMarkers />

        {/* Drawing tool (only active when in drawing mode) */}
        {isDrawingMode && <AreaDrawingTool onAreaCreated={onAreaCreated} />}

        {/* Location search (only active when in drawing mode) */}
        {isDrawingMode && <LocationSearch />}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm space-y-2">
          <div className="font-semibold">Map Legend</div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 border border-gray-400"></div>
            <span className="text-xs">Unsearched</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 opacity-60"></div>
            <span className="text-xs">Searched</span>
          </div>
          {isDrawingMode && (
            <div className="mt-2 pt-2 border-t">
              <span className="text-xs font-semibold text-blue-600">Drawing Mode Active</span>
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                <p>• Click toolbar (top-left) to select tool</p>
                <p>• Click and drag on map to draw</p>
                <p>• Pan and zoom still available</p>
              </div>
            </div>
          )}
          {isPlaybackMode && (
            <div className="mt-2 pt-2 border-t">
              <span className="text-xs font-semibold">Playback Mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
