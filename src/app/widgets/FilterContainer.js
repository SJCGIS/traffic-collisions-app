define([
    'widgets/config',
    'widgets/FilterControls',
    'widgets/FilterIsland',
    'widgets/FilterSeverity',
    
    'dojo/text!./templates/FilterContainer.html',

    'dojo/query',
    'dojo/topic',

    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'
], function(
    config,
    FilterControls,
    FilterIsland,
    FilterSeverity,
    
    template,

    query,
    topic,

    array,
    declare,
    lang,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //    Container for filters

        templateString: template,
        baseClass: 'filter-container',
        widgetsInTemplate: true,

        // Properties to be sent into constructor
        map: null,
        layerIds: [],
        childWidgets: null,

        constructor: function() {
            // summary:
            //     sets up properties for widget
            console.log('app.FilterContainer::constructor', arguments);

            this.childWidgets = [];
        },

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app.FilterContainer::postCreate', arguments);

            this.childWidgets.push(
                new FilterControls({
                    childWidgets: [
                        new FilterIsland({}, this.filterIslandNode),
                        new FilterSeverity({}, this.filterSeverityNode)
                    ]
                }, this.filterControlsNode)
            );

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //    wire events, and such
            //
            console.log('app.FilterContainer::setupConnections', arguments);

            topic.subscribe(config.topics.search.filter, lang.hitch(this, 'setDefExp'));
            topic.subscribe(config.topics.search.reset, lang.hitch(this, 'resetFilters'));
        },        
        startup: function() {
            // summary:
            //    Starts up all child widgets after they are all defined in postCreate
            //
            console.log('app.FilterContainer::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function(widget) {
                that.own(widget);
                widget.startup();
            });
        },
        resetFilters: function() {
            // summary:
            //    resets childwidget checkboxes and removes definition expression
            //
            console.log('app.FilterContainer::resetFilters', arguments);
            var checkboxes = query('input[type="checkbox"]', this.domNode);
            array.forEach(checkboxes, function(checkbox) {
                checkbox.checked = false;
            });
        },
        setDefExp: function(expression) {
            // summary:
            //    sets definition expression for layer
            // expression
            console.log('app.FilterContainer::setDefExp', arguments);

            var defExp = expression.expression;
            
            array.forEach(this.layerIds, lang.hitch(this, function(layerId) {
                var layer = this.map.getLayer(layerId);
                layer.setDefinitionExpression(defExp);
            }));
        }
    });
});
