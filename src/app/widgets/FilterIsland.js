define([
    'dojo/text!./templates/FilterIsland.html',

    'dojo/_base/declare',

    'app/widgets/FilterCriteria'
], function(
    template,

    declare,

    FilterCriteria
) {
    return declare([FilterCriteria], {
        // description:
        //    Filter data based on island

        templateString: template,
        baseClass: 'filter-criteria',
        field: 'ISLAND'
    });
});
