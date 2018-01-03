import movieList from '../data/movie-list.json';
import Point from 'esri/geometry/Point';

const movies = movieList.movies;

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

function getUniqueLocations(movies) {
  let uniqueLocations = [];
  for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
    if (movies[i].locations) {
        for (let j = 0; j < movie.locations.length; j++) {
        const location = movie.locations[j];
        let locationIndex = uniqueLocations.findIndex((l) => {
            return l.name === location.name;
        });
        if (locationIndex !== -1) {
            uniqueLocations[locationIndex].count++;
        }
        else {
            uniqueLocations.push(Object.assign({}, location, {
            count: 1
            }));
        }
        }
    }
  }
  return uniqueLocations;
}

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
      geometry: new Point({
        longitude: feature.longitude,
        latitude: feature.latitude,
        spatialReference: {
          wkid: 102100
        }
      }),
      attributes: {
        ObjectID: index,
        name: feature.name,
        country: feature.country,
        count: feature.count
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
    }
  ];
  return {
    fields,
    source
  };
}

export default {
  movies,
  uniqueActors,
  sortedUniqueLocations,
  getAllLocationsSource
};