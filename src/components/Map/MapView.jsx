import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSearch } from '../../context/SearchContext';
import AreaDrawingTool from './AreaDrawingTool';
import OfficerMarkers from './OfficerMarkers';
import CoverageLayer from './CoverageLayer';
import SearchAreaPolygons from './SearchAreaPolygons';
import LocationSearch from './LocationSearch';
import MapController from './MapController';
import EvidenceMarkers from '../Evidence/EvidenceMarkers';
import CheckpointMarkers from '../Checkpoints/CheckpointMarkers';

// Default center - London
const DEFAULT_CENTER = [51.5074, -0.1278]; // London, UK
const DEFAULT_ZOOM = 13;

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
        {/* CARTO Voyager - Light style with clear buildings, blue labels, grey roads */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
          subdomains='abcd'
          maxZoom={20}
        />

        {/* Map controller - handles interaction states */}
        <MapController isDrawingMode={isDrawingMode} />

        {/* Search area polygons */}
        <SearchAreaPolygons />

        {/* Coverage visualization */}
        <CoverageLayer />

        {/* Officer markers and paths */}
        <OfficerMarkers />

        {/* Evidence markers */}
        <EvidenceMarkers />

        {/* Checkpoint markers */}
        <CheckpointMarkers />

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
                <p>• Use toolbar (top-left) to draw</p>
                <p>• Zoom with scroll wheel</p>
                <p>• Map dragging disabled</p>
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
