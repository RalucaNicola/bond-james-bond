import WebScene from 'esri/WebScene';
import SceneView from 'esri/views/SceneView';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import novaStyle from '../../data/nova.json';
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

    store.subscribe(() => {
      this._initializeView();
    });

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

  }
};
