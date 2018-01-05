import movieList from '../data/test-movie-list.json';
import Point from 'esri/geometry/Point';
import Polyline from 'esri/geometry/Polyline';
import geometryEngine from 'esri/geometry/geometryEngine';

const movies = movieList.movies.map((movie, index) => {
  movie.id = index;
  return movie;
});

function createPoint(feature) {
  return new Point({
    longitude: feature.longitude,
    latitude: feature.latitude,
    spatialReference: {
      wkid: 3857
    }
  });
}

function getArcLines(locations) {

  let arcLines = [];

  if (locations) {
    for (let i = 0; i < locations.length - 1; i++) {

      let point1 = createPoint(locations[i]);
      let point2 = createPoint(locations[i+1]);

      // build a line between the 2 locations
      let initialTravelLine = new Polyline({
        paths: [
          [point1.x, point1.y, 0],
          [point2.x, point2.y, 0]
        ],
        spatialReference: {
          wkid: 3857
        }
      });

      // densify the line
      let distance = geometryEngine.distance(point1, point2, 'meters');
      let segmentLength = 5000 * parseInt(distance).toString().length;
      let densifiedTravelLine = geometryEngine.densify(initialTravelLine, segmentLength, 'meters');

      // add z values to vertices to make a nice arc
      let vertices = densifiedTravelLine.paths[0];
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][2] = -50000 * Math.pow(i, 2) / (vertices.length - 1) + i * 50000;
      }

      // add line to the arcLines
      arcLines.push(densifiedTravelLine);
    }
  }

  return arcLines;
}

function getMoviesWithArcLines() {
  return movies.map((movie) => {
    movie.arcLines = getArcLines(movie.locations);
    return movie;
  });
}

const moviesWithArcLines = getMoviesWithArcLines();
console.log(moviesWithArcLines);

// list of unique actors used for the legend in the info panel

function getUniqueActors() {
  let actors = [];
  for (let i = 0; i < movies.length; i++) {
    if (actors.indexOf(movies[i].actor) === -1) {
    actors.push(movies[i].actor);
    }
  }
  return actors;
}
const uniqueActors = getUniqueActors();

/*
 list of unique locations used to create the layer of locations
 the attributes for the locations are also calculated
 - count: how many times James Bond went to that location
 - actors: a list of actors that went to that location
*/

function getUniqueLocations(movies) {
  let uniqueLocations = [];
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    if (movie.locations) {
        for (let j = 0; j < movie.locations.length; j++) {
        const location = movie.locations[j];
        let locationIndex = uniqueLocations.findIndex((l) => {
            return l.name === location.name;
        });
        if (locationIndex !== -1) {
          uniqueLocations[locationIndex].count++;
          if (uniqueLocations[locationIndex].actors.indexOf(movie.actor) === -1) {
            uniqueLocations[locationIndex].actors.push(movie.actor);
          }
        }
        else {
          uniqueLocations.push(Object.assign({}, location, {
            count: 1,
            actors: [movie.actor]
          }));
        }
      }
    }
  }
  return uniqueLocations;
}

// sort locations by count to display the most visited ones in the info panel
function sortLocationsByCount(locations) {
  return locations.sort((l1, l2) => {
    if (l1.count > l2.count) {
      return -1;
    }
    else {
      return 1;
    }
  });
}

let uniqueLocations = getUniqueLocations(movieList.movies);

let sortedUniqueLocations = sortLocationsByCount(uniqueLocations);

function getAllLocationsSource() {

  let source = sortedUniqueLocations.map(function(feature, index) {
    return {
      geometry: createPoint(feature),
      attributes: {
        ObjectID: index,
        name: feature.name,
        country: feature.country,
        count: feature.count,
        actors: feature.actors.sort().join(',')
      }
    };
  });
  let fields = [
    {
      name: 'ObjectID',
      alias: 'ObjectID',
      type: 'oid'
    },{
      name: 'name',
      alias: 'name',
      type: 'string'
    },{
      name: 'country',
      alias: 'country',
      type: 'string'
    },{
      name: 'count',
      alias: 'count',
      type: 'number'
    },{
      name: 'actors',
      alias: 'actors',
      type: 'string'
    }
  ];
  return {
    fields,
    source
  };
}

export default {
  movies,
  moviesWithArcLines,
  uniqueActors,
  sortedUniqueLocations,
  getAllLocationsSource
};