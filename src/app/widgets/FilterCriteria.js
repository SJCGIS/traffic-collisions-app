define([
    'app/widgets/config',
    
    'dojo/text!./templates/FilterCriteria.html',

    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/event',
    'dojo/_base/lang',

    'dojo/dom-class',
    'dojo/on',
    'dojo/query',
    'dojo/topic',

    'dijit/form/CheckBox',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin'
], function(
    config,
    
    template,

    array,
    declare,
    event,
    lang,

    domClass,
    on,
    query,
    topic,

    Checkbox,

    _WidgetBase,
    _TemplatedMixin
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //    Base class for criteria filters

        templateString: template,
        baseClass: 'filter-criteria',

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('src.app.FilterCriteria::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //    wire events, and such
            //
            console.log('src.app.FilterCriteria::setupConnections', arguments);

            this.own(
                on(this.domNode, 'input[type="checkbox"]:change', lang.hitch(this, 'clicked'))
            );
        },
        clicked: function(evt) {
            // summary:
            //    handle click events
            //    evt: the click event
            console.log('src.app.FilterCriteria::clicked', arguments);

            // stop the input event from bubbling
            event.stop(evt);

            this._gatherData();
        },
        _gatherData: function() {
            // summary:
            //     gathers the ingredients from the checkboxes
            //
            console.log('src.app.FilterCriteria::_gatherData', arguments);

            var ingredients = array.map(query('input[type="checkbox"]:checked', this.domNode), function mapCheckboxes(node) {
                return node.value;
            }, this);

            if(ingredients.length < 1){
                ingredients = null;
            }
            this._setData(ingredients);
        },
        _setData: function(ingredients) {
            // summary:
            //     sets the criteria object from the data
            //     ingredients

            console.log('app.widgets.FilterCriteria::_setData', arguments);

            this.set('data', {
                ingredients: ingredients
            });
        }
    });
});
