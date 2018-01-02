import movieList from '../data/movie-list.json';

function getUniqueActors(movies) {
  let actors = [];
  for (let i = 0; i < movies.length; i++) {
    if (actors.indexOf(movies[i].actor) === -1) {
    actors.push(movies[i].actor);
    }
  }
  return actors;
}

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

export const dataManager = {

  movies: movieList.movies,

  uniqueActors: getUniqueActors(movieList.movies),

  sortedUniqueLocations: sortLocationsByCount(getUniqueLocations(movieList.movies))
};