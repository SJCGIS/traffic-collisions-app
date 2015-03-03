define([
    'app/widgets/config',
    'dojo/text!./templates/FilterControls.html',

    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',    

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/topic'
], function(
    config,
    template,

    array,
    declare,
    lang,

    _WidgetBase,
    _TemplatedMixin,
    topic
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //    Filter controller for features in FeatureLayer

        templateString: template,
        baseClass: 'filter-controls',

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app.widgets.FilterControls::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //    wire events, and such
            //
            console.log('app.widgets.FilterControls::setupConnections', arguments);

        },
        filter: function() {
            // summary:
            //     gathers the filter criteria and sends the request
            //
            console.log('app.widgets.FilterControls::filter', arguments);

            var criteria = this._getFilterIngredients();
            var expression = this._buildDefinitionQueryFromObject(criteria);
            var pubData = {expression: expression};
            topic.publish('filter/filter', pubData);
        },
        reset: function() {
            // summary:
            //     resets the filters and definition query on feature layer
            //
            console.log('app.widgets.FilterControls::reset', arguments);

            topic.publish('filter/filter', '');
            topic.publish('filter/reset', {});
        },
        _getFilterIngredients: function() {
            // summary:
            //    gets the filter ingredients from the childWidgets array
            //
            console.log('app.widgets.FilterControls::_getFilterIngredients', arguments);

            var criteria = [];

            array.forEach(this.childWidgets, function(widget){
                criteria.push(widget.get('data'));
            }, this);

            return criteria;
        },
        _buildDefinitionQueryFromObject: function(criteria){
            // summary:
            //    get the filter criteria and build a definition query
            //
            console.log('app.widgets.FilterControls::_buildDefinitionQueryFromObject', arguments);

            var filters = [], filter;

            array.forEach(criteria, lang.hitch(this, function(crit) {
                if (crit && crit.ingredients) {
                    filter = this._formSqlInQueryFromArray(crit.ingredients);
                    filters.push( crit.field + ' IN (' + filter + ')');
                }
            }));

            return filters.join(' AND ');
        },
        _formSqlInQueryFromArray: function(itemArray) {
            // summary:
            //     forma a SQL IN query from an array of strings
            //
            console.log('app.widgets.FilterControls::_formSqlInQueryFromArray', arguments);

            var itemFilter = [];
            array.map(itemArray, function(item) {
                if (isNaN(item)) {
                    itemFilter.push('\'' + item + '\'');
                } else {
                    itemFilter.push(item);
                }
            });
            return itemFilter;
        }
    });
});
