import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { format } from 'date-fns';

const TimelineSlider = () => {
  const {
    officers,
    isPlaybackMode,
    playbackTime,
    setPlaybackTime,
    setIsPlaybackMode
  } = useSearch();

  // Get time range from officer paths
  const getTimeRange = () => {
    let minTime = Infinity;
    let maxTime = -Infinity;

    officers.forEach(officer => {
      if (officer.path.length > 0) {
        const firstTime = officer.path[0].timestamp;
        const lastTime = officer.path[officer.path.length - 1].timestamp;
        minTime = Math.min(minTime, firstTime);
        maxTime = Math.max(maxTime, lastTime);
      }
    });

    if (minTime === Infinity || maxTime === -Infinity) {
      return { minTime: Date.now(), maxTime: Date.now(), hasData: false };
    }

    return { minTime, maxTime, hasData: true };
  };

  const { minTime, maxTime, hasData } = getTimeRange();

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setPlaybackTime(value);
    if (!isPlaybackMode) {
      setIsPlaybackMode(true);
    }
  };

  if (!hasData) {
    return null;
  }

  const currentTime = playbackTime || maxTime;
  const progress = ((currentTime - minTime) / (maxTime - minTime)) * 100;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{format(minTime, 'HH:mm:ss')}</span>
            {isPlaybackMode && playbackTime && (
              <span className="font-medium text-blue-600">
                {format(playbackTime, 'HH:mm:ss')}
              </span>
            )}
            <span>{format(maxTime, 'HH:mm:ss')}</span>
          </div>

          {/* Timeline slider */}
          <div className="relative">
            <input
              type="range"
              min={minTime}
              max={maxTime}
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
              }}
            />
          </div>

          {/* Timeline markers for significant events */}
          <div className="text-xs text-gray-500">
            Duration: {Math.round((maxTime - minTime) / 1000)} seconds
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default TimelineSlider;
