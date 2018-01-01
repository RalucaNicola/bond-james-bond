import watch from 'redux-watch';
import Typed from 'typed.js';
import {visualizationChanged} from '../actions/actionUtils';
import movieList from '../../data/movie-list.json';

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
    if (item === 'Movie') {
      menuItem.classList.add('info-selected');
    }
    menuItem.addEventListener('click', () => {
      onMenuClick(menuItem, store);
    });
    container.append(menuItem);
  });
}

function getUniqueActors(movies) {
  let actors = [];
  for (let i = 0; i < movies.length; i++) {
    if (actors.indexOf(movies[i].actor) === -1) {
      actors.push(movies[i].actor);
    }
  }
  return actors;
}

function displayActors(container) {
  let actors = getUniqueActors(movieList.movies);
  console.log(movieList.movies);
  actors.forEach((actor) => {
    let actorTemplate = document.createElement('template');
    actorTemplate.innerHTML = `<div>
      <img class='bond-symbol' src='./src/img/bond-actor.png' style='border:3px solid ${colors['actors-' + actor.replace(' ','').toLowerCase()]}'>
      <span>${actor}</span>
    </div>`;
    container.appendChild(actorTemplate.content.firstElementChild);
  });
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
        () => { initializeMenu(this.menu, store); }
      );
    }));

    let visualizationChangeWatcher = watch(store.getState, 'visualization');
    store.subscribe(visualizationChangeWatcher((value) => {
      if (value.mode === 'Actor') {
        displayActors(this.details);
      }
    }));
  }
};