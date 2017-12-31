import movieList from '../../data/movie-list.json';
require('../../style/timeline.scss');

function createMovieItem(movie) {
  let template = document.createElement('template');
  template.innerHTML = `
    <div class='movie-item' data-title='${movie.title}' data-director='${movie.director}'
    data-id=${movie.id} data-year=${movie.year} data-actor='${movie.actor}'>
      <img src='./src/img/posters/${movie.image}' class='grayed-out'/>
      <p>${movie.year}</p>
    </div>
    `;
  return template.content.firstElementChild;
}

function updateTooltipContent(data) {
  document.querySelector('.tooltip').innerHTML = `<h1>${data.title}</h1>
      <p>${data.year}</p>
      <p>${data.actor}</p>
      <p>${data.director}</p>`;
}

function displayTooltip(positionX) {
  let tooltipElement = document.querySelector('.tooltip');
  tooltipElement.classList.add('visible');
  tooltipElement.style.left = positionX + 'px';
}

function handleEventsOnMouseOver(movieItem) {
  movieItem.addEventListener('mouseover', function (evt) {
    let target = evt.target;
    let image = target.getElementsByTagName('img')[0];
    image.classList.add('selected');
    updateTooltipContent(target.dataset);
    displayTooltip(target.offsetLeft);
    evt.stopPropagation();
  });

  movieItem.addEventListener('mouseout', function (evt) {
    let image = evt.target.getElementsByTagName('img')[0];
    image.classList.remove('selected');
    document.querySelector('.tooltip').classList.remove('visible');
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