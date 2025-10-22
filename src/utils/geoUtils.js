import * as turf from '@turf/turf';

/**
 * Generate a grid of cells for a given polygon area
 * @param {Array} coordinates - Array of [lat, lng] coordinates defining the polygon
 * @param {number} cellSize - Size of each cell in meters (default 10m)
 * @returns {Object} Object containing grid cells and metadata
 */
export const generateGridForArea = (coordinates, cellSize = 10) => {
  try {
    // Convert coordinates to GeoJSON polygon format [lng, lat]
    const polygonCoords = coordinates.map(coord => [coord[1], coord[0]]);
    // Close the polygon if not already closed
    if (JSON.stringify(polygonCoords[0]) !== JSON.stringify(polygonCoords[polygonCoords.length - 1])) {
      polygonCoords.push(polygonCoords[0]);
    }

    const polygon = turf.polygon([polygonCoords]);
    const bbox = turf.bbox(polygon);

    // Convert cell size from meters to approximate degrees
    // At the equator, 1 degree ≈ 111km, so we adjust based on latitude
    const avgLat = (bbox[1] + bbox[3]) / 2;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = 111320 * Math.cos(avgLat * Math.PI / 180);

    const cellSizeLat = cellSize / metersPerDegreeLat;
    const cellSizeLng = cellSize / metersPerDegreeLng;

    const gridCells = [];
    let cellId = 0;

    // Generate grid
    for (let lng = bbox[0]; lng < bbox[2]; lng += cellSizeLng) {
      for (let lat = bbox[1]; lat < bbox[3]; lat += cellSizeLat) {
        const cellPolygon = turf.polygon([[
          [lng, lat],
          [lng + cellSizeLng, lat],
          [lng + cellSizeLng, lat + cellSizeLat],
          [lng, lat + cellSizeLat],
          [lng, lat]
        ]]);

        // Check if cell intersects with the search area
        try {
          const intersects = turf.booleanIntersects(cellPolygon, polygon);
          if (intersects) {
            const center = turf.center(cellPolygon);
            gridCells.push({
              id: cellId++,
              bounds: [
                [lat, lng],
                [lat + cellSizeLat, lng + cellSizeLng]
              ],
              center: [center.geometry.coordinates[1], center.geometry.coordinates[0]],
              covered: false,
              coveredBy: null,
              coveredAt: null
            });
          }
        } catch (e) {
          // Skip cells that cause errors
          console.warn('Error checking cell intersection:', e);
        }
      }
    }

    console.log(`Generated ${gridCells.length} cells for search area`);

    return {
      cells: gridCells,
      totalCells: gridCells.length,
      cellSize,
      bbox
    };
  } catch (error) {
    console.error('Error generating grid:', error);
    return {
      cells: [],
      totalCells: 0,
      cellSize,
      bbox: null
    };
  }
};

/**
 * Check if a point is within a cell
 * @param {Array} point - [lat, lng]
 * @param {Object} cell - Cell object with bounds
 * @returns {boolean}
 */
export const isPointInCell = (point, cell) => {
  const [lat, lng] = point;
  const [[minLat, minLng], [maxLat, maxLng]] = cell.bounds;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

/**
 * Update coverage for cells based on officer location
 * @param {Array} cells - Array of cell objects
 * @param {Array} location - [lat, lng]
 * @param {string} officerId - Officer's ID
 * @returns {Array} Updated cells
 */
export const updateCellCoverage = (cells, location, officerId) => {
  return cells.map(cell => {
    if (!cell.covered && isPointInCell(location, cell)) {
      return {
        ...cell,
        covered: true,
        coveredBy: officerId,
        coveredAt: Date.now()
      };
    }
    return cell;
  });
};

/**
 * Calculate coverage percentage for an area
 * @param {Array} cells - Array of cell objects
 * @returns {number} Percentage covered (0-100)
 */
export const calculateCoveragePercentage = (cells) => {
  if (!cells || cells.length === 0) return 0;
  const coveredCells = cells.filter(cell => cell.covered).length;
  return (coveredCells / cells.length) * 100;
};

/**
 * Get coverage statistics by officer
 * @param {Array} cells - Array of cell objects
 * @param {Array} officers - Array of officer objects
 * @returns {Object} Coverage stats by officer
 */
export const getCoverageByOfficer = (cells, officers) => {
  const stats = {};

  officers.forEach(officer => {
    const coveredByOfficer = cells.filter(cell => cell.coveredBy === officer.id).length;
    stats[officer.id] = {
      officerName: officer.officerName,
      cellsCovered: coveredByOfficer,
      percentage: cells.length > 0 ? (coveredByOfficer / cells.length) * 100 : 0,
      color: officer.color
    };
  });

  return stats;
};

/**
 * Calculate distance between two points in meters
 * @param {Array} point1 - [lat, lng]
 * @param {Array} point2 - [lat, lng]
 * @returns {number} Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const from = turf.point([point1[1], point1[0]]);
  const to = turf.point([point2[1], point2[0]]);
  return turf.distance(from, to, { units: 'meters' });
};

/**
 * Calculate area of a polygon in square meters
 * @param {Array} coordinates - Array of [lat, lng] coordinates
 * @returns {number} Area in square meters
 */
export const calculateArea = (coordinates) => {
  try {
    const polygonCoords = coordinates.map(coord => [coord[1], coord[0]]);
    if (JSON.stringify(polygonCoords[0]) !== JSON.stringify(polygonCoords[polygonCoords.length - 1])) {
      polygonCoords.push(polygonCoords[0]);
    }
    const polygon = turf.polygon([polygonCoords]);
    return turf.area(polygon);
  } catch (error) {
    console.error('Error calculating area:', error);
    return 0;
  }
};

/**
 * Generate a random point within a polygon
 * @param {Array} coordinates - Array of [lat, lng] coordinates
 * @returns {Array} Random point [lat, lng]
 */
export const randomPointInPolygon = (coordinates) => {
  try {
    const polygonCoords = coordinates.map(coord => [coord[1], coord[0]]);
    if (JSON.stringify(polygonCoords[0]) !== JSON.stringify(polygonCoords[polygonCoords.length - 1])) {
      polygonCoords.push(polygonCoords[0]);
    }
    const polygon = turf.polygon([polygonCoords]);
    const bbox = turf.bbox(polygon);

    // Try up to 100 times to find a point inside the polygon
    for (let i = 0; i < 100; i++) {
      const lng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
      const lat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
      const point = turf.point([lng, lat]);

      if (turf.booleanPointInPolygon(point, polygon)) {
        return [lat, lng];
      }
    }

    // Fallback to center if no point found
    const center = turf.center(polygon);
    return [center.geometry.coordinates[1], center.geometry.coordinates[0]];
  } catch (error) {
    console.error('Error generating random point:', error);
    return null;
  }
};

/**
 * Check if a point is within a polygon
 * @param {Array} point - [lat, lng]
 * @param {Array} coordinates - Array of [lat, lng] coordinates defining the polygon
 * @returns {boolean}
 */
export const isPointInPolygon = (point, coordinates) => {
  try {
    const pt = turf.point([point[1], point[0]]);
    const polygonCoords = coordinates.map(coord => [coord[1], coord[0]]);
    if (JSON.stringify(polygonCoords[0]) !== JSON.stringify(polygonCoords[polygonCoords.length - 1])) {
      polygonCoords.push(polygonCoords[0]);
    }
    const polygon = turf.polygon([polygonCoords]);
    return turf.booleanPointInPolygon(pt, polygon);
  } catch (error) {
    console.error('Error checking point in polygon:', error);
    return false;
  }
};
