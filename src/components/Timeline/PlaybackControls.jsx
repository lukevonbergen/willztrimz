import React, { useEffect, useRef } from 'react';
import { useSearch } from '../../context/SearchContext';

const PlaybackControls = () => {
  const {
    isPlaybackMode,
    setIsPlaybackMode,
    playbackTime,
    setPlaybackTime,
    playbackSpeed,
    setPlaybackSpeed,
    isPlaying,
    setIsPlaying,
    officers
  } = useSearch();

  const playbackIntervalRef = useRef(null);

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
      return { minTime: Date.now(), maxTime: Date.now() };
    }

    return { minTime, maxTime };
  };

  const { minTime, maxTime } = getTimeRange();

  // Handle playback
  useEffect(() => {
    if (isPlaying && isPlaybackMode) {
      const interval = 100; // Update every 100ms
      const timeStep = interval * playbackSpeed; // Adjust based on speed

      playbackIntervalRef.current = setInterval(() => {
        setPlaybackTime(prev => {
          const currentTime = prev || minTime;
          const nextTime = currentTime + timeStep;

          if (nextTime >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }

          return nextTime;
        });
      }, interval);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, isPlaybackMode, playbackSpeed, minTime, maxTime, setPlaybackTime, setIsPlaying]);

  const handlePlayPause = () => {
    if (!isPlaybackMode) {
      setIsPlaybackMode(true);
      setPlaybackTime(minTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPlaybackMode(false);
    setPlaybackTime(null);
  };

  const handleRestart = () => {
    setPlaybackTime(minTime);
    setIsPlaying(true);
    setIsPlaybackMode(true);
  };

  if (officers.length === 0 || officers.every(o => o.path.length === 0)) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Stop Button */}
          {isPlaybackMode && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Restart Button */}
          {isPlaybackMode && (
            <button
              onClick={handleRestart}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            {[0.5, 1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1 rounded text-sm ${
                  playbackSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Status */}
          {isPlaybackMode && (
            <div className="flex-1 text-sm text-gray-600">
              <span className="font-medium">Playback Mode</span>
              {playbackTime && (
                <span className="ml-2">
                  {new Date(playbackTime).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
