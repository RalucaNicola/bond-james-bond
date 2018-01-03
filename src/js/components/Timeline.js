import dataManager from '../dataManager';
import watch from 'redux-watch';

import colors from '../../style/colors.scss';
require('../../style/timeline.scss');

function createMovieItem(movie) {
  let template = document.createElement('template');
  template.innerHTML = `
    <div class='movie-item' data-title='${movie.title}' data-director='${movie.director}'
    data-id=${movie.id} data-year=${movie.year} data-actor='${movie.actor}'>
      <div class='image-border'><img src='./src/img/posters/${movie.image}' class='grayed-out'/></div>
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

function displayTooltip(left, top) {
  let tooltipElement = document.querySelector('.tooltip');
  tooltipElement.classList.add('visible');
  tooltipElement.style.left = left + 'px';
  tooltipElement.style.top = top - 100 + 'px';
}

function handleEventsOnMouseOver(movieItem) {
  movieItem.addEventListener('mouseover', function (evt) {
    let target = evt.target;
    let image = target.getElementsByTagName('img')[0];
    let position = image.getBoundingClientRect();
    image.classList.add('selected');
    updateTooltipContent(target.dataset);
    displayTooltip(position.left, position.top);
    evt.stopPropagation();
  });

  movieItem.addEventListener('mouseout', function (evt) {
    let image = evt.target.getElementsByTagName('img')[0];
    image.classList.remove('selected');
    document.querySelector('.tooltip').classList.remove('visible');
    evt.stopPropagation();
  });
}

/*
  functions concerning visualization mode by actor
*/

function visualizeByActor() {
  let movieItemsList = document.getElementsByClassName('movie-item');
  for (let i = 0; i < movieItemsList.length; i++) {
    let movieItem = movieItemsList[i];
    let imageItem = movieItem.getElementsByClassName('image-border')[0];
    let actor = movieItem.dataset.actor;
    imageItem.style.border = '3px solid ' + colors[`actors-${actor.replace(' ', '').toLowerCase()}`];
  }
}

function visualizeByMovie() {
  let movieItemsList = document.getElementsByClassName('movie-item');
  for (let i = 0; i < movieItemsList.length; i++) {
    let movieItem = movieItemsList[i];
    let imageItem = movieItem.getElementsByClassName('image-border')[0];
    imageItem.style.border = 'none';
  }
}

export default {

  // initialize timeline
  init(container, store) {

    dataManager.movies.forEach(function(movie) {

      // create movie element
      let movieItem = createMovieItem(movie);
      container.appendChild(movieItem);

      // add event listeners
      handleEventsOnMouseOver(movieItem);

    });

    let visualizationChangeWatcher = watch(store.getState, 'visualization');
    store.subscribe(visualizationChangeWatcher((value) => {
      this.render(value);
    }));

    this.render(store.getState().visualization);
  },

  render(stateVisualization) {
    // this method will render based on the state of the visualization
    if (stateVisualization.mode === 'Movie') {
      visualizeByMovie();
    }
    else if (stateVisualization.mode === 'Actor') {
      visualizeByActor();
    }
  }

};