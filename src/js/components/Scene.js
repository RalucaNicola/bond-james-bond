import WebScene from 'esri/WebScene';
import SceneView from 'esri/views/SceneView';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import novaStyle from '../../data/nova.json';
import watch from 'redux-watch';
import {viewReady} from '../actions/actionUtils';
require('../../style/scene.scss');

export const Scene = {

  init(store) {

    this.store = store;

    let novaBaseLayer = new VectorTileLayer({
      url: 'https://basemaps.arcgis.com/b2/arcgis/rest/services/World_Basemap/VectorTileServer'
    });
    novaBaseLayer.loadStyle(novaStyle);

    this.webscene = new WebScene({
      basemap: {
        baseLayers: [novaBaseLayer]
      }
    });

    let animationWatcher = watch(store.getState, 'initialization.animationFinished');
    store.subscribe(animationWatcher(() => {
      this._initializeView();
    }));

  },

  _initializeView() {
    this.view = new SceneView({
      container: 'scene-view',
      map: this.webscene,
      ui: {
        components: ['attribution']
      },
      environment: {
        atmosphereEnabled: false,
        starsEnabled: false
      },
      viewingMode: 'local'
    });

    window.setTimeout(() => {
      this.store.dispatch(viewReady());
    }, 5000);

  }
};
