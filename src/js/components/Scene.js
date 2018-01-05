import WebScene from 'esri/WebScene';
import SceneView from 'esri/views/SceneView';
import VectorTileLayer from 'esri/layers/VectorTileLayer';
import novaStyle from '../../data/nova.json';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/Graphic';
import Polyline from 'esri/geometry/Polyline';
import watch from 'redux-watch';
import {viewReady} from '../actions/actionUtils';

import dataManager from '../dataManager';
import vizConfig from '../visualizationConfig';
require('../../style/scene.scss');

export default {

  getLocationsByActorLayer() {
    let locationsSource = dataManager.getAllLocationsSource();
    let uniqueActorValues = [];
    locationsSource.source.forEach((feature) => {
      if (uniqueActorValues.indexOf(feature.attributes.actors) === -1) {
        uniqueActorValues.push(feature.attributes.actors);
      }
    });

    let uniqueValueInfos = uniqueActorValues.map((actors) => {
      return {
        symbol: {
          type: 'point-3d',
          symbolLayers: [{
            type: 'icon',
            resource: {
              href: vizConfig.getSceneSymbolForActors(actors.split(','))
            },
            anchor: 'bottom',
            size: '120px'
          }]
        },
        value: actors
      };
    });


    return new FeatureLayer({
      visible: false,
      source: locationsSource.source,
      fields: locationsSource.fields,
      objectIdField: 'ObjectID',
      geometryType: 'point',
      title: 'All locations by actor',
      screenSizePerspectiveEnabled: false,
      renderer: {
        type: 'unique-value',
        field: 'actors',
        uniqueValueInfos: uniqueValueInfos
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

  getAllLocationsLayer() {

    let locationsSource = dataManager.getAllLocationsSource();

    return new FeatureLayer({
      visible: false,
      source: locationsSource.source,
      fields: locationsSource.fields,
      objectIdField: 'ObjectID',
      geometryType: 'point',
      title: 'All locations by count',
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

  cleanUpArcLines() {
    this.arcLinesLayer.removeAll();
  },

  init(store) {

    this.store = store;
    this.state = {
      timeout: null
    };

    let novaBaseLayer = new VectorTileLayer({
      url: 'https://basemaps.arcgis.com/b2/arcgis/rest/services/World_Basemap/VectorTileServer'
    });
    novaBaseLayer.loadStyle(novaStyle);

    this.arcLinesLayer = new GraphicsLayer();

    this.allLocationsLayer = this.getAllLocationsLayer();
    this.locationsByActorLayer = this.getLocationsByActorLayer();

    this.webscene = new WebScene({
      basemap: {
        baseLayers: [novaBaseLayer]
      },
      layers: [
        this.allLocationsLayer,
        this.locationsByActorLayer,
        this.arcLinesLayer
      ]
    });

    let animationWatcher = watch(store.getState, 'initialization.animationFinished');
    store.subscribe(animationWatcher(() => {
      this._initializeView();
    }));

    let visualizationChangeWatcher = watch(store.getState, 'visualization.mode');
    store.subscribe(visualizationChangeWatcher((value) => {
      this.render(value);
    }));

    let visualizationSelectionWatcher = watch(store.getState, 'visualization.selection');
    store.subscribe(visualizationSelectionWatcher((value) => {
      this.cleanUpArcLines();
      if (value) {
        this._startAnimation(dataManager.moviesWithArcLines[value]);
      }

    }));
    this.render(store.getState().visualization.mode);

  },

  render(value) {
    if (value === 'Actor') {
      this.locationsByActorLayer.visible = true;
      this.allLocationsLayer.visible = false;
    } else if (value === 'Movie') {
      this.locationsByActorLayer.visible = false;
      this.allLocationsLayer.visible = true;
    }
  },

  _startAnimation(movie) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    this.view.goTo({ target: movie.arcLines, tilt: 60 }, { duration: 2000 })
    .then(function () {
      this._currentLineIndex = 0;
      this._lines = movie.arcLines;
      this._startMovieAnimation();
    }.bind(this))
    .otherwise(err => console.log(err));
  },

  _animateLine: function (line, currentVertex) {
    let paths = line.paths[0];
    let i = currentVertex;
    /* if (this.state.inAnimation) { */
      if (i < paths.length) {

        let polyline = new Polyline({
          paths: paths.slice(i, i + 2),
          spatialReference: {
            wkid: 3857
          }
        });

        let opacity = 0.1 + i / paths.length;
        let lineSymbol = {
          type: 'simple-line',
          color: [66, 220, 224, opacity],
          width: 3
        };

        let lineGraphic = new Graphic({
          geometry: polyline,
          symbol: lineSymbol
        });

        this.arcLinesLayer.add(lineGraphic);

        this.state.timeout = window.setTimeout(function () {
          this._animateLine(line, currentVertex + 1);
        }.bind(this), 10);
      }
      else {
        this._currentLineIndex++;
        this._startMovieAnimation(this._lines, this._currentLineIndex);
      }
    /* } */
  },


  _startMovieAnimation: function() {
    /* if (this.state.inAnimation) { */
      if (this._currentLineIndex < this._lines.length) {
        let line = this._lines[this._currentLineIndex];
        this._animateLine(line, 0);
      }
    /* } */
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

  },


};
