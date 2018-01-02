import watch from 'redux-watch';
import Typed from 'typed.js';
import {visualizationChanged} from '../actions/actionUtils';
import { dataManager } from '../dataManager';

import colors from '../../style/colors.scss';
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
      <img class='bond-symbol' src='./src/img/bond-actor.png' style='border:3px solid ${colors['actors-' + actor.replace(' ','').toLowerCase()]}'>
      <span>${actor}</span>
    </div>`;
    container.appendChild(actorTemplate.content.firstElementChild);
  });
}

function displayMovies(container) {
  let movieTemplate = document.createElement('template');
    movieTemplate.innerHTML = `<div>
      <p>During all his movies James Bond has mostly travelled to:</p>
      <div>
        <img class='bond-symbol' src='./src/img/circle-blue.svg' style='height: 40px'>
        <span>London</span>
      </div>
      <div>
        <img class='bond-symbol' src='./src/img/circle-blue.svg' style='height: 30px; margin: 0 5px;'>
        <span>Paris</span>
      </div>
      <div style='margin-top: 5px'>
        <img class='bond-symbol' src='./src/img/circle-blue.svg' style='height: 20px; margin: 0 10px;'>
        <span>Tokyo</span>
      </div>
      <p>James Bond was last seen in London.</p>
      <p>Select a movie in the timeline for more details.</p>
    </div>`;
    container.appendChild(movieTemplate.content.firstElementChild);
}

function emptyElement(element) {
  element.innerHTML = '';
}

export const InfoPanel = {
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
          this.render(store.getState().visualization);
        }
      );
    }));

    let visualizationChangeWatcher = watch(store.getState, 'visualization');
    store.subscribe(visualizationChangeWatcher((value) => {
      this.render(value);
    }));

  },

  render(stateVisualization) {

    if (stateVisualization.mode === 'Actor') {
      emptyElement(this.details);
      displayActors(this.details);
    }
    else if (stateVisualization.mode === 'Movie') {
      emptyElement(this.details);
      displayMovies(this.details);
    }

  }
};