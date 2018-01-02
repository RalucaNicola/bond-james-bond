import WebScene from 'esri/WebScene';
import SceneView from 'esri/views/SceneView';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import novaStyle from '../../data/nova.json';
import watch from 'redux-watch';
import {viewReady} from '../actions/actionUtils';

import {dataManager} from '../dataManager';
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
      viewingMode: 'local',
      camera: {
        position: {
          x: -16717961.801382363,
          y: -12063519.288896995,
          z: 12585640.377230108,
          spatialReference: {
            wkid: 102100
          }
        },
        heading: 36,
        tilt: 61
      }
    });

    window.view = this.view;

    window.setTimeout(() => {
      this.store.dispatch(viewReady());
    }, 5000);

    const featureLayer = dataManager.getAllLocationsAsFeatureLayer();
    this.webscene.add(featureLayer);

  }
};
