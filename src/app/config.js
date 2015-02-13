define(['esri/InfoTemplate'], function(InfoTemplate) {
    return {
        map: {
            mapOptions: {
                id: 'map'
                ,scrollWheelZoom: true
                ,basemap: 'gray'
                ,center: [-123.0, 48.6]
                ,zoom: 10
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
                    mode: 0
                }
            }],
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
        navBar: {
            moreInfoUrl: 'https://github.com/Esri/dojo-bootstrap-map-js',
            layerIds: ['collisions']
        }
    };
});
