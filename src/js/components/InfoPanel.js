import watch from 'redux-watch';
import Typed from 'typed.js';
import {visualizationChanged} from '../actions/actionUtils';
import dataManager from '../dataManager';
import vizConfig from '../visualizationConfig';

require('../../style/info-panel.scss');

function startTyping(container, text, onComplete) {
  const typed = new Typed(container, {
    strings: [text],
    typeSpeed: 20,
    backSpeed: 0,
    fadeOut: true,
    backDelay: 1000,
    startDelay: 500,
    showCursor: false,
    smartBackspace: true,
    loop: false,
    onComplete: (self) => {
      onComplete();
    }
  });
}

function onMenuClick(menuItem, store) {
  store.dispatch(visualizationChanged(menuItem.innerHTML));
  let previous = document.getElementsByClassName('info-selected')[0];
  previous.classList.remove('info-selected');
  menuItem.classList.add('info-selected');
}

function initializeMenu(container, store) {
  ['Movie', 'Actor'].forEach((item) => {
    let menuItem = document.createElement('li');
    menuItem.innerHTML = item;
    if (item === store.getState().visualization.mode) {
      menuItem.classList.add('info-selected');
    }
    menuItem.addEventListener('click', () => {
      onMenuClick(menuItem, store);
    });
    container.append(menuItem);
  });
}

function displayActors(container) {
  let actors = dataManager.uniqueActors;
  actors.forEach((actor) => {
    let actorTemplate = document.createElement('template');
    actorTemplate.innerHTML = `<div>
      ${vizConfig.getDOMSymbolForActors(actor)}
      <span>${actor}</span>
    </div>`;
    container.appendChild(actorTemplate.content.firstElementChild);
  });
}

function displayMovies(container) {
  const topLocations = dataManager.sortedUniqueLocations.slice(0, 3);
  let movieTemplate = document.createElement('template');
    movieTemplate.innerHTML = `<div>
      <p>During all his movies James Bond has mostly travelled to:</p>
      ${topLocations.map((location, index) => {
        return `<div>
          <img class='bond-symbol-${index + 1}' src='${vizConfig.allLocationsSymbol}' style='height: ${vizConfig.getLocationSize(location.count)}px'>
          <span>${location.name} (${location.count} times)</span>
        </div>`;
      }).join('')}
      <p>Select a movie in the timeline for more details.</p>
    </div>`;
    container.appendChild(movieTemplate.content.firstElementChild);
}

function emptyElement(element) {
  element.innerHTML = '';
}

export default {
  init(store) {
    this.container = document.getElementById('info-panel');
    this.title = document.getElementById('info-title');
    this.menu = document.getElementById('info-menu');
    this.details = document.getElementById('info-details');

    let viewReadyWatcher = watch(store.getState, 'initialization.viewReady');
    store.subscribe(viewReadyWatcher(() => {
      startTyping(this.title,
        `Visualize James Bond's travels based on:`,
        () => {
          initializeMenu(this.menu, store);
          this.render(store.getState().visualization.mode);
        }
      );
    }));

    let visualizationChangeWatcher = watch(store.getState, 'visualization.mode');
    store.subscribe(visualizationChangeWatcher((value) => {
      this.render(value);
    }));

  },

  render(visualizationMode) {

    if (visualizationMode === 'Actor') {
      emptyElement(this.details);
      displayActors(this.details);
    }
    else if (visualizationMode === 'Movie') {
      emptyElement(this.details);
      displayMovies(this.details);
    }

  }
};