import movieList from '../../data/movie-list.json';
require('../../style/timeline.scss');

function createMovieItem(movie) {
  let template = document.createElement('template');
  template.innerHTML = `
    <div class='movie-item' data-title='${movie.title}' data-id=${movie.director}>
      <img src='./src/img/posters/${movie.image}' class='grayed-out'/>
      <p>${movie.year}</p>
    </div>
    `;
  return template.content.firstElementChild;
}

function handleEventsOnMouseOver(movieItem) {
  movieItem.addEventListener('mouseover', function (evt) {
    console.log(evt.target);
    evt.stopPropagation();
  });

  movieItem.addEventListener('mouseout', function (evt) {
    console.log(evt.target);
    evt.stopPropagation();
  });
}


export const Timeline = {

  // initialize timeline
  init(container) {

    movieList.movies.forEach(function(movie) {

      // create movie element
      let movieItem = createMovieItem(movie);
      container.appendChild(movieItem);

      // add event listeners
      handleEventsOnMouseOver(movieItem);
    });

  }
};