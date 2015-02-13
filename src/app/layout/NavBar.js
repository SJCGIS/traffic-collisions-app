define([
    'app/widgets/FilterContainer',

    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/query',
    'dojo/touch',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/text!./templates/NavBar.html',
    'dojo/i18n!./nls/strings',

    'dojo-bootstrap/Collapse',
    'dojo-bootstrap/Dropdown',
    'dojo-bootstrap/Modal'
], function(
    FilterContainer, array,
    declare, query, touch, topic,
    _WidgetBase, _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template, strings
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        strings: strings,
        widgetsInTemplate: true,

        map: null,
        layerIds: [],
        childWidgets: null,
        
        constructor: function() {
            // summary: 
            //   sets up properties for widget
            console.log('app.layout.NavBar::constructor', arguments);

            this.childWidgets = [];
        },

        postCreate: function() {
            // summary:
            //  Overrides method of same name in dijit._Widget.
            //
            console.log('app.layout.NavBar::postCreate', arguments);

            this.childWidgets.push( 
                new FilterContainer({
                    map: this.map,
                    layerIds: this.layerIds
                }, this.filterNode)
            );
            
            this.inherited(arguments);
            this._attachEventHandlers();
        },

        _attachEventHandlers: function() {
            var _this = this;
            // change basemap
            query('.basemap-list li', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                topic.publish('basemap/set', {
                    basemap: e.target.text
                });
                _this._hideDropdownNav(e);
            });
            // show filter container modal
            query('a[href="#filter"]', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                query('.filter-modal').modal('show');
                _this._hideDropdownNav(e);
            });
            // show about modal
            query('a[href="#about"]', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                query('.about-modal').modal('show');
                _this._hideDropdownNav(e);
            });
        },

        _hideDropdownNav: function(e) {
            // hide nav dropdown on mobile
            if (query('.navbar-collapse.in', this.domNode).length > 0) {
                e.stopPropagation();
                query('.navbar-toggle', this.domNode)[0].click();
            }
        },
        startup: function() {
            // summary: 
            //    starts up all child widgets defined in postCreate
            //
            console.log('app.layout.NavBar::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function(widget) {
                that.own(widget);
                widget.startup();
            });
        }
    });
});
