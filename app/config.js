define(['esri/InfoTemplate', 'dojo/i18n!./layout/nls/strings'], function(InfoTemplate, strings) {
    return {
        mapControls: {
            options: {
                id: 'map'
                ,scrollWheelZoom: true
                ,basemap: 'gray'
                ,center: [-123.0, 48.6]
                ,zoom: 10
                ,sliderPosition: 'bottom-right'
            },
            operationalLayers: [{
                type: 'feature',
                url: 'http://sjcgis.org/arcgis/rest/services/Andromeda/Traffic_Collisions/MapServer/0',
                title: 'Traffic Collisions',
                options: {
                    id: 'collisions',
                    opacity: 1.0,
                    visible: true,
                    outFields: ['*'],
                    infoTemplate: new InfoTemplate('Collision', '${*}'),
                    mode: 0
                }
            }],

            legendNodeId: 'mapLegend',

            widgets: {
                scalebar: {
                    // see https://developers.arcgis.com/javascript/jsapi/scalebar-amd.html#scalebar1
                },
                homeButton: {
                    // see: https://developers.arcgis.com/javascript/jsapi/homebutton-amd.html#homebutton1
                },
                locateButton: {
                    // see: https://developers.arcgis.com/javascript/jsapi/locatebutton-amd.html#locatebutton1
                },
                geocoder: {
                    // see https://developers.arcgis.com/javascript/jsapi/geocoder-amd.html#geocoder1
                    autoComplete: true,
                    arcgisGeocoder: {
                        placeholder: 'Address or Location'
                    },
                    'class': 'geocoder'
                }
            }
        },

        // filter modal
        filterModal: {
            layerIds: ['collisions']
        },

        // about modal
        aboutModal: {
            moreInfoUrl: 'https://github.com/Esri/dojo-bootstrap-map-js'
        }
    };
});
