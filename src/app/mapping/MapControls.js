define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/on',
  'dojo/topic',

  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'esri/map',
  'esri/dijit/Scalebar',
  'esri/layers/WebTiledLayer',
  'esri/dijit/HomeButton',
  'esri/dijit/LocateButton',
  'esri/dijit/Geocoder',
  'esri/arcgis/utils',
  'esri/dijit/Legend',

  'bootstrap-map-js/js/bootstrapmap',

  'spin/spin',

  'dojo/text!./templates/Map.html'
], function(
  declare, array, lang, domClass, on, topic,
  _WidgetBase, _TemplatedMixin,
  Map, Scalebar, WebTiledLayer, HomeButton, LocateButton, Geocoder, arcgisUtils, Legend,
  BootstrapMap, Spinner,
  template) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    postCreate: function() {
        console.log('app.mapping.MapControls::postCreate', arguments);
      this.inherited(arguments);
      // NOTE: BootstrapMap needs to work off an id
      this.mapNode.id = this.id + 'Map';
      this._initMap();
      this.setupConnections();
    },
    setupConnections: function() {
        // summary:
        // wire events and the like
        //
        console.log('app.mapping.MapControls::setupConnections', arguments);
        
        on(this.map, 'update-start', lang.hitch(this, 'showSpinner'));
        on(this.map, 'update-end', lang.hitch(this, 'hideSpinner'));
    },
    showSpinner: function() {
        // summary:
        // sets up and shows the spinner
        //
        console.log('app.mapping.MapControls::showSpinner', arguments);
        
        var opts = {
            lines: 9, // The number of lines to draw
            length: 4, // The length of each line
            width: 3, // The line thickness
            radius: 4, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 100, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent in px
            left: '50%' // Left position relative to parent in px
        };

        if(!this.spinner) {
            this.spinner = new Spinner(opts).spin(this.spinnerNode);
        } else {
            if(!this.spinner.el) {
                // only start spinner if not already started
                this.spinner.spin(this.spinnerNode);
            }
        }
    },
    hideSpinner: function() {
        // summary:
        // hides the spinner 
        //
        console.log('app.mapping.MapControls::hideSpinner', arguments);
        this.spinner.stop();
    },

    // initalize map from configuration parameters
    _initMap: function() {
        console.log('app.mapping.MapControls::_initMap', arguments);
      if (!this.options) {
        this.options = {};
      }
      if (this.itemId) {
        BootstrapMap.createWebMap(this.itemId, this.mapNode.id, this.options).then(lang.hitch(this, '_onWebMapLoad'));
      } else {
        this.map = BootstrapMap.create(this.mapNode.id, this.options);
        this._initLayers();
        this._initWidgets();
      }
    },

    // set reference to the map
    // then show legend and map widgets
    _onWebMapLoad: function (response) {
        console.log('app.mapping.MapControls::_onWebMapLoad', arguments);
      var self = this;
      var layerInfos;
      this.map = response.map;
      if (this.legendNodeId) {
        layerInfos = arcgisUtils.getLegendLayers(response);
        if (this.map.loaded) {
          this._initLegend(layerInfos);
        } else {
          this.map.on('load',function(){
            self._initLegend(layerInfos);
          });
        }
      }
      this._initWidgets();
      topic.publish('webmap/load', response);
    },

    // init map layers from options instead of a web map
    _initLayers: function() {
        console.log('app.mapping.MapControls::_initLayers', arguments);
      if (!this.operationalLayers) {
        return;
      }
      var layers = [];
      var layerTypes = {
        dynamic: 'ArcGISDynamicMapService',
        feature: 'Feature',
        tiled: 'ArcGISTiledMapService'
      };
      // loading all the required modules first ensures the layer order is maintained
      var modules = [];
      array.forEach(this.operationalLayers, function(operationalLayer) {
        var type = layerTypes[operationalLayer.type];
        if (type) {
          modules.push('esri/layers/' + type + 'Layer');
        } else {
          console.log('Layer type not supported: ', operationalLayer.type);
        }
      }, this);
      require(modules, lang.hitch(this, function() {
        var layerInfos = [];
        array.forEach(this.operationalLayers, function(operationalLayer) {
          var type = layerTypes[operationalLayer.type];
          if (type) {
            require(['esri/layers/' + type + 'Layer'], lang.hitch(this, '_initLayer', operationalLayer, layers, layerInfos));
          }
        }, this);
        this.map.addLayers(layers);
        this._initLegend(layerInfos);
      }));
    },

    _initLayer: function(operationalLayer, layers, layerInfos, LayerClass) {
      var l = new LayerClass(operationalLayer.url, operationalLayer.options);
      // unshift instead of push to keep layer ordering on map intact
      layers.unshift(l);
      layerInfos.unshift({
        layer: l,
        title: operationalLayer.title || l.name
      });
    },

    _initLegend: function(layerInfos) {
        console.log('app.mapping.MapControls::_initLegend', arguments);
      if (!this.legendNodeId) {
        return;
      }
      this.legend = new Legend({
          map: this.map,
          layerInfos: layerInfos
        }, this.legendNodeId);
      this.legend.startup();
    },

    // init map widgets if they are in config
    _initWidgets: function() {
        console.log('app.mapping.MapControls::_initWidgets', arguments);
      var self = this;
      if (!this.widgets) {
        return;
      }

      // scalebar
      if (this.widgets.scalebar) {
        this.scalebar = new Scalebar(lang.mixin({
          map: this.map,
          scalebarUnit: 'dual'
        }, this.widgets.scalebar));
      }

      // home button
      if (this.widgets.homeButton) {
        this.homeButton = new HomeButton(lang.mixin({
          map: this.map
        }, this.widgets.homeButton), this.homeNode);
        this.homeButton.startup();
      }

      // locate button
      if (this.widgets.locateButton) {
        this.locateButton = new LocateButton(lang.mixin({
          map: this.map,
          'class': 'locate-button'
        }, this.widgets.locateButton), this.locateNode);
        this.locateButton.startup();
      }

      // geocoder
      if (this.widgets.geocoder) {
        this.geocoder = new Geocoder(lang.mixin({
          map: this.map,
          'class': 'geocoder'
        }, this.widgets.geocoder), this.searchNode);
        this.geocoder.startup();
        this.own(this.geocoder.on('select', function(e) {
          domClass.remove(self.geocoder.domNode, 'shown');
        }));
      }
    },

    getMapHeight: function() {
      if(this.map) {
        return this.map.height;
      } else {
        return 0;
      }
    },

    clearBaseMap: function() {
        console.log('app.mapping.MapControls::clearBasemap', arguments);
      var map = this.map;
      if (map.basemapLayerIds && map.basemapLayerIds.length > 0) {
        array.forEach(map.basemapLayerIds, function(lid) {
          map.removeLayer(map.getLayer(lid));
        });
        map.basemapLayerIds = [];
      } else {
        map.removeLayer(map.getLayer(map.layerIds[0]));
      }
    },

    setBasemap: function(basemapText) {
        console.log('app.mapping.MapControls::setBasemap', arguments);
      var map = this.map;
      var l, options;
      this.clearBaseMap();
      switch (basemapText) {
        case 'Water Color':
          options = {
            id: 'Water Color',
            copyright: 'stamen',
            resampling: true,
            subDomains: ['a', 'b', 'c', 'd']
          };
          l = new WebTiledLayer('http://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg', options);
          map.addLayer(l, 0);
          break;

        case 'MapBox Space':

          options = {
            id: 'mapbox-space',
            copyright: 'MapBox',
            resampling: true,
            subDomains: ['a', 'b', 'c', 'd']
          };
          l = new WebTiledLayer('http://${subDomain}.tiles.mapbox.com/v3/eleanor.ipncow29/${level}/${col}/${row}.jpg', options);
          map.addLayer(l, 0);
          break;

        case 'Pinterest':
          options = {
            id: 'mapbox-pinterest',
            copyright: 'Pinterest/MapBox',
            resampling: true,
            subDomains: ['a', 'b', 'c', 'd']
          };
          l = new WebTiledLayer('http://${subDomain}.tiles.mapbox.com/v3/pinterest.map-ho21rkos/${level}/${col}/${row}.jpg', options);
          map.addLayer(l, 0);
          break;
        case 'Streets':
          map.setBasemap('streets');
          break;
        case 'Imagery':
          map.setBasemap('hybrid');
          break;
        case 'National Geographic':
          map.setBasemap('national-geographic');
          break;
        case 'Topographic':
          map.setBasemap('topo');
          break;
        case 'Gray':
          map.setBasemap('gray');
          break;
        case 'Open Street Map':
          map.setBasemap('osm');
          break;
      }
    },
      setDefExp: function(layerIds, expression) {
          // summary:
          //    sets definition expression for layer
          // expression
          console.log('app.mapping.MapControls::setDefExp', arguments);
          
          var defExp = expression;
          
          array.forEach(layerIds, lang.hitch(this, function(layerId) {
              var layer = this.map.getLayer(layerId);
              layer.setDefinitionExpression(defExp);
          }));
      }
  });
});
