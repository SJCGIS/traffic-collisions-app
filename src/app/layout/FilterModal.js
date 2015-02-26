define([
    'app/widgets/FilterControls',
    'app/widgets/FilterIsland',
    'app/widgets/FilterSeverity',

    'dojo/query',
    'dojo/topic',

    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/text!./templates/FilterModal.html',
    'dojo/i18n!./nls/strings'
], function(
    FilterControls,
    FilterIsland,
    FilterSeverity,
    query, topic,
    array, declare, lang,
    _WidgetBase, _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template, strings
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        strings: strings,
        widgetsInTemplate: true,

        _setTitleAttr: {
            node: 'titleNode',
            type: 'innerHTML'
        },

        _setContentAttr: {
            node: 'contentNode',
            type: 'innerHTML'
        },

        map: null,
        layerIds: [],
        childWidgets: null,

        constructor: function() {
            // summary:
            // sets up properties for widget
            console.log('app.layout.FilterModal::constructor', arguments);

            this.childWidgets = [];
        },

        postCreate: function() {
            console.log('app.layout.FilterModal::postCreate', arguments);
            
            // define childwidgets
            this.childWidgets.push(
                new FilterControls({
                    childWidgets: [
                        new FilterIsland({}, this.filterIslandNode),
                        new FilterSeverity({}, this.filterSeverityNode)
                    ]
                }, this.filterControlsNode)
            );
            // get default title/content from i18n strings
            this.set('title', strings.modalFilterTitle);
            this.set('content', '<p>' + strings.modalFilterContent + '</p>');
            this.inherited(arguments);
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
        startup: function() {
            // summary:
            // starts up all child widgets defined in postCreate
            //
            console.log('app.layout.FilterModal::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function(widget){
                that.own(widget);
                widget.startup();
            });
        }
    });
});
