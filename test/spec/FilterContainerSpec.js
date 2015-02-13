define([
    'widgets/FilterContainer',

    'esri/map',
    'esri/layers/FeatureLayer',

    'dojo/dom',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/window'
], function(
    WidgetUnderTest,

    Map,
    FeatureLayer,

    dom,
    domConstruct,
    query,
    win
) {
    describe('FilterContainer', function() {
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
            it('should create a FilterContainer', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('setting definition expressions', function() {
            it('should set a definition expression on a single layer', function() {
                var filter = {};
                filter.expression = 'Island IN (\'Orcas\')';
                widget.setDefExp(filter);
                expect(fLayer1.getDefinitionExpression()).toEqual(filter.expression);
            });

            it('should set a definition expression on multiple layers', function() {
                var filter = {};
                filter.expression = 'Island IN (\'Orcas\')';
                widget.layerIds.push('mySecondLayer');
                widget.setDefExp(filter);
                expect(fLayer1.getDefinitionExpression()).toEqual(filter.expression);
                expect(fLayer2.getDefinitionExpression()).toEqual(filter.expression);
            });
            // it('should filter by selected island', function() {
            //     var orcasCheck = query('input[type="checkbox"][value="Orcas"]', widget.domNode)[0];
            //     var filterButton = query('button[id="filter"]', widget.domNode)[0];
            //     orcasCheck.checked = true;
            //     expect(orcasCheck.checked).toBeTruthy();
            //     expect(filterButton).toBeDefined();
            //     expect(fLayer.getDefinitionExpression()).toEqual('Island IN (\'Orcas\')');
        });
    });
});

