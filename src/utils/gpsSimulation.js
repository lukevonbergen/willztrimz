import { calculateDistance, isPointInPolygon, randomPointInPolygon } from './geoUtils';

/**
 * Simulate GPS movement for an officer
 * Walking speed is approximately 5 km/h = 1.39 m/s
 * With updates every 3 seconds, each step is ~4.2 meters
 */

const WALKING_SPEED_MPS = 1.39; // meters per second
const UPDATE_INTERVAL_MS = 3000; // 3 seconds
const STEP_DISTANCE = WALKING_SPEED_MPS * (UPDATE_INTERVAL_MS / 1000); // ~4.2 meters

/**
 * Generate a systematic search pattern (grid search)
 * @param {Array} areaCoordinates - Polygon coordinates
 * @param {Array} startPoint - Starting point [lat, lng]
 * @returns {Array} Array of waypoints
 */
export const generateGridSearchPattern = (areaCoordinates, startPoint) => {
  // This is a simplified grid pattern
  // In a real implementation, you'd want more sophisticated path planning
  const waypoints = [startPoint];

  // Generate a simple back-and-forth grid pattern
  const bbox = getBoundingBox(areaCoordinates);
  const stepSize = 0.0001; // approximately 11 meters

  let currentLat = bbox.minLat;
  let direction = 1; // 1 for east, -1 for west

  while (currentLat < bbox.maxLat) {
    let currentLng = direction > 0 ? bbox.minLng : bbox.maxLng;
    const endLng = direction > 0 ? bbox.maxLng : bbox.minLng;

    while ((direction > 0 && currentLng < endLng) || (direction < 0 && currentLng > endLng)) {
      const point = [currentLat, currentLng];
      if (isPointInPolygon(point, areaCoordinates)) {
        waypoints.push(point);
      }
      currentLng += direction * stepSize;
    }

    currentLat += stepSize;
    direction *= -1; // Reverse direction for next row
  }

  return waypoints;
};

/**
 * Generate a perimeter search pattern
 * @param {Array} areaCoordinates - Polygon coordinates
 * @param {Array} startPoint - Starting point [lat, lng]
 * @returns {Array} Array of waypoints
 */
export const generatePerimeterSearchPattern = (areaCoordinates) => {
  // Walk around the perimeter, then spiral inward
  return [...areaCoordinates, areaCoordinates[0]];
};

/**
 * Generate a random search pattern
 * @param {Array} areaCoordinates - Polygon coordinates
 * @param {number} numPoints - Number of random points to generate
 * @returns {Array} Array of waypoints
 */
export const generateRandomSearchPattern = (areaCoordinates, numPoints = 50) => {
  const waypoints = [];
  for (let i = 0; i < numPoints; i++) {
    const point = randomPointInPolygon(areaCoordinates);
    if (point) waypoints.push(point);
  }
  return waypoints;
};

/**
 * Get bounding box for coordinates
 */
const getBoundingBox = (coordinates) => {
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  coordinates.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return { minLat, maxLat, minLng, maxLng };
};

/**
 * Calculate next position moving from current to target
 * @param {Array} current - Current position [lat, lng]
 * @param {Array} target - Target position [lat, lng]
 * @param {number} stepDistance - Distance to move in meters
 * @returns {Array} Next position [lat, lng]
 */
export const calculateNextPosition = (current, target, stepDistance = STEP_DISTANCE) => {
  const distance = calculateDistance(current, target);

  // If we're close enough to the target, return the target
  if (distance <= stepDistance) {
    return target;
  }

  // Calculate the bearing and move stepDistance toward target
  const [lat1, lng1] = current;
  const [lat2, lng2] = target;

  // Simple linear interpolation (good enough for small distances)
  const ratio = stepDistance / distance;

  const latDiff = lat2 - lat1;
  const lngDiff = lng2 - lng1;

  const newLat = lat1 + (latDiff * ratio);
  const newLng = lng1 + (lngDiff * ratio);

  return [newLat, newLng];
};

/**
 * Officer simulation class
 */
export class OfficerSimulation {
  constructor(officer, searchArea, patternType = 'grid') {
    this.officer = officer;
    this.searchArea = searchArea;
    this.waypoints = this.generateWaypoints(patternType);
    this.currentWaypointIndex = 0;
    this.currentPosition = this.waypoints[0];
    this.isComplete = false;
  }

  generateWaypoints(patternType) {
    const startPoint = randomPointInPolygon(this.searchArea.coordinates);

    switch (patternType) {
      case 'grid':
        return generateGridSearchPattern(this.searchArea.coordinates, startPoint);
      case 'perimeter':
        return generatePerimeterSearchPattern(this.searchArea.coordinates);
      case 'random':
        return generateRandomSearchPattern(this.searchArea.coordinates);
      default:
        return generateGridSearchPattern(this.searchArea.coordinates, startPoint);
    }
  }

  getNextPosition() {
    if (this.isComplete) return null;

    const targetWaypoint = this.waypoints[this.currentWaypointIndex];
    const nextPosition = calculateNextPosition(this.currentPosition, targetWaypoint);

    // Check if we've reached the current waypoint
    if (JSON.stringify(nextPosition) === JSON.stringify(targetWaypoint)) {
      this.currentWaypointIndex++;

      // Check if we've completed all waypoints
      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.isComplete = true;
        return null;
      }
    }

    this.currentPosition = nextPosition;
    return nextPosition;
  }

  reset() {
    this.currentWaypointIndex = 0;
    this.currentPosition = this.waypoints[0];
    this.isComplete = false;
  }
}

/**
 * Create simulation for multiple officers
 * @param {Array} officers - Array of officer objects
 * @param {Object} searchArea - Search area object
 * @returns {Map} Map of officerId to OfficerSimulation
 */
export const createSimulations = (officers, searchArea) => {
  const simulations = new Map();
  const patterns = ['grid', 'perimeter', 'random'];

  officers.forEach((officer, index) => {
    const patternType = patterns[index % patterns.length];
    simulations.set(officer.id, new OfficerSimulation(officer, searchArea, patternType));
  });

  return simulations;
};
