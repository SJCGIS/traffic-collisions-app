define([
    'dojo/text!./templates/FilterSeverity.html',

    'dojo/_base/declare',

    'app/widgets/FilterCriteria'
], function(
    template,

    declare,

    FilterCriteria
) {
    return declare([FilterCriteria], {
        // description:
        //    Filter data based on crash severity

        templateString: template,
        baseClass: 'filter-criteria',
        field: 'SEVERITY'
    });
});
