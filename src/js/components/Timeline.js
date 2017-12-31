import movieList from '../../data/movie-list.json';
require('../../style/timeline.scss');

function createMovieItem(movie) {
  let template = document.createElement('template');
  template.innerHTML = `
    <div class='movie-item' data-title='${movie.title}' data-id=${movie.director}>
      <img src='./src/img/posters/${movie.image.replace('.png', 'bw.png')}'/>
      <p>${movie.year}</p>
    </div>
    `;
  return template.content.firstElementChild;
}


export const Timeline = {
  init(container) {
    movieList.movies.forEach(function(movie) {
      let movieItem = createMovieItem(movie);
      container.appendChild(movieItem);
    });
  }
};