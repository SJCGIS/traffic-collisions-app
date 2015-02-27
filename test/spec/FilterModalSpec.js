define([
    'app/layout/FilterModal',

    'esri/map',
    'esri/layers/FeatureLayer',

    'dojo/_base/array',

    'dojo/dom',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/window'
], function(
    WidgetUnderTest,

    Map,
    FeatureLayer,

    array,

    dom,
    domConstruct,
    query,
    win
) {
    describe('FilterModal', function() {
        var map, fLayer1, fLayer2;
        var widget;
        var destroy = function (widget) {
            if (widget && widget.destroyRecursive) {
                widget.destroyRecursive();
                widget = null;
            }
        };

        beforeEach(function() {
            var div = domConstruct.create('div', {id: 'map', style: 'width:300px;height:200px'}, win.body);
            map = new Map(div, {
                basemap: 'topo',
                center: [-123.45,48.35],
                zoom: 10,
                sliderStyle: 'small'
            });
            console.log('created map');
            var url1 = 'http://www.sjcgis.org/arcgis/rest/services/Andromeda/Traffic_Collisions/MapServer/0';
            var url2 = 'http://www.sjcgis.org/arcgis/rest/services/Andromeda/Citations/MapServer/0';
            fLayer1 = new FeatureLayer(url1, {id: 'myLayer'});
            fLayer2 = new FeatureLayer(url2, {id: 'mySecondLayer'});
            map.addLayers([fLayer1,fLayer2]);
            widget = new WidgetUnderTest({
                map: map,
                layerIds: ['myLayer']
            }, domConstruct.create('div', null, win.body));
            widget.startup();
        });

        afterEach(function() {
            destroy(widget);
        });

        describe('Sanity', function() {
            it('should create a FilterModal', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('resetFilters', function() {
            beforeEach(function() {
                var checkboxes = query('input[type="checkbox"]', widget.domNode);
                console.log('There are ' + checkboxes.length + ' checkboxes');
                array.forEach(checkboxes, function(checkbox){
                    checkbox.checked = true;
                });
                var checkedBoxes = query('input[type="checkbox"]:checked', widget.domNode);
                console.log('We have ' + checkedBoxes.length + ' checked boxes before the reset');
            });
            it('should set all checkboxes to unchecked', function(){
                widget.resetFilters();
                var checkedBoxes = query('input[type="checkbox"]:checked', widget.domNode);
                expect(checkedBoxes.length).toEqual(0);
            });
        });
    });
});


