define([
    'dojo/query',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/topic',

    './config',
    './mapping/MapControls',
    './layout/NavBar',
    './layout/AboutModal',
    './layout/FilterModal',

    'dojo-bootstrap/Modal',

    'dojo/domReady!'],
       function(
           query, dom, domClass, domStyle, topic,
           config, MapControls, NavBar, AboutModal, FilterModal
       ) {
           'use strict';
           var app = {};

           // start map
           app.mapControls = new MapControls(config.mapControls, 'mapControls');
           app.mapControls.startup();

           // start nav
           app.navBar = new NavBar({}, 'navBar');
           app.navBar.startup();

           // start about modal
           app.aboutModal = new AboutModal(config.aboutModal, 'aboutModal');
           app.aboutModal.startup();

           // start filter modal
           app.filterModal = new FilterModal(config.filterModal, 'filterModal');
           app.filterModal.startup();

           // responsive sidebar
           app.sidebar = dom.byId('sidebar');

           // app topics
           // set app title and about text when loading from web map
           topic.subscribe('webmap/load', function(args) {
               var item;
               if (!args.itemInfo && args.itemInfo.item) {
                   return;
               }
               item = args.itemInfo.item;
               app.aboutModal.set('title', item.title);
               app.aboutModal.set('content', item.description);
               app.navBar.set('title', item.title);
           });

           // set the basemap
           topic.subscribe('basemap/set', function(args) {
               app.mapControls.setBasemap(args.basemap);
           });

           // toggle the sidebar
           topic.subscribe('sidebar/toggle', function() {
               if (!app.sidebar) {
                   return;
               }
               // make sure sidebar is same height as the map
               domStyle.set(app.sidebar, 'height', app.mapControls.map.height + 'px');
               domClass.toggle(window.document.body, 'sidebar-open');
           });

           // show the filter modal
           topic.subscribe('filter/show', function() {
               console.log('showing filter modal');
               query('.filter-modal').modal('show');
           });

           // show the about modal
           topic.subscribe('about/show', function() {
               console.log('showing about modal');
               query('.about-modal').modal('show');
           });
           
           // filter the data
           topic.subscribe('filter/filter', function(args){
               var layerIds = config.filterModal.layerIds;
               app.mapControls.setDefExp(layerIds, args.expression);
           });

           // reset filters
           topic.subscribe('filter/reset', function() {
               app.filterModal.resetFilters();
           });

           return app;
       });
