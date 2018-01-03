import WebScene from 'esri/WebScene';
import SceneView from 'esri/views/SceneView';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import novaStyle from '../../data/nova.json';
import FeatureLayer from 'esri/layers/FeatureLayer';
import watch from 'redux-watch';
import {viewReady} from '../actions/actionUtils';

import dataManager from '../dataManager';
import vizConfig from '../visualizationConfig';
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

  getAllLocationsLayer() {

    let locationsSource = dataManager.getAllLocationsSource();

    return new FeatureLayer({
      source: locationsSource.source,
      fields: locationsSource.fields,
      objectIdField: 'ObjectID',
      geometryType: 'point',
      title: 'All locations',
      screenSizePerspectiveEnabled: false,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'point-3d',
          symbolLayers: [{
            type: 'icon',
            resource: {
              href: vizConfig.allLocationsSymbol
            }
          }]
        },
        visualVariables: [
          {
            type: 'size',
            field: 'count',
            stops: [
              {
                value: vizConfig.minCount,
                size: vizConfig.minSize + 'px'
              }, {
                value: vizConfig.maxCount,
                size: vizConfig.maxSize + 'px'
              }
            ]
          }
        ]
      },
      outFields: ['*'],
      labelingInfo: [
        {
          labelExpressionInfo: {
            value: '{name}'
          },
          symbol: {
            type: 'label-3d',
            symbolLayers: [{
              type: 'text',
              material: {
                color: [250, 250, 250]
              },
              font: {
                family: 'Roboto Mono'
              },
              size: 9
            }],
            verticalOffset: {
              screenLength: 200,
              maxWorldLength: 100000,
              minWorldLength: 2000
            },
            callout: {
              type: 'line',
              size: 0.5,
              color: [255, 255, 255]
            },
          }
        }],
      labelsVisible: true
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

    this.webscene.add(this.getAllLocationsLayer());

  },


};
