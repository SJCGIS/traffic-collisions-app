define([
    'app/widgets/config',
    'app/widgets/FilterControls',

    'dojo/dom-construct',
    'dojo/query',
    'dojo/Stateful',
    'dojo/topic'    
], function(
    config,
    WidgetUnderTest,

    domConstruct,
    query,
    Stateful,
    topic
) {
    describe('FilterControls', function() {
        var widget;
        var destroy = function (widget) {
            if (widget && widget.destroyRecursive) {
                widget.destroyRecursive();
                widget = null;
            }
        };

        beforeEach(function() {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, document.body));
        });

        afterEach(function() {
            destroy(widget);
        });

        describe('Sanity', function() {
            it('should create a FilterControls', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('should build definition queries', function() {
            it('returns empty if no criteria', function() {
                var actual = widget._buildDefinitionQueryFromObject({});
                expect(actual).toEqual('');
            });
            describe('island criteria', function() {
                it('creates definition query for one island', function() {
                    var criteria = [{
                        field: 'ISLAND',
                        ingredients: ['Orcas']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('ISLAND IN (\'Orcas\')');
                });
                it('creates definition query for multiple islands', function() {
                    var criteria = [{
                        field: 'ISLAND',
                        ingredients: ['San Juan','Orcas']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('ISLAND IN (\'San Juan\',\'Orcas\')');
                });
            });
            describe('collision type criteria', function() {
                it('creates definition query for one collision type', function() {
                    var criteria = [{
                        field: 'SEVERITY',
                        ingredients: ['1']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('SEVERITY IN (1)');
                });
                it('creates definition query for multiple collision types', function(){
                    var criteria = [{
                        field: 'SEVERITY',
                        ingredients: ['1','3']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('SEVERITY IN (1,3)');
                });
            });
            describe('multiple columns of criteria', function() {
                it('creates definition query for multiple columns of single type', function() {
                    var criteria = [{
                        field: 'ISLAND',
                        ingredients: ['Orcas']
                    },{
                        field: 'SEVERITY',
                        ingredients: ['3']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('ISLAND IN (\'Orcas\') AND SEVERITY IN (3)');
                });
                it('creates definition query for multiple columns of multiple types', function(){
                    var criteria = [{
                        field: 'ISLAND',
                        ingredients: ['Lopez', 'San Juan']
                    },{
                        field: 'SEVERITY',
                        ingredients: ['2','3']
                    }];

                    var actual = widget._buildDefinitionQueryFromObject(criteria);
                    expect(actual).toEqual('ISLAND IN (\'Lopez\',\'San Juan\') AND SEVERITY IN (2,3)');
                });
            });
        });
        describe('Data gathering', function() {
            it('gathers data from the child widgets', function() {
                widget.childWidgets = [
                    new Stateful({
                        data: {
                            field: 'Field1',
                            ingredients: 1
                        }
                    }),
                    new Stateful({
                        data: {
                            field: 'Field2',
                            ingredients: 2
                        }
                    }),
                    new Stateful({
                        data: {
                            field: 'Field3',
                            ingredients: 3
                        }
                    })
                ];

                var actual = widget._getFilterIngredients();
                expect(actual).toEqual([
                    {
                        field: 'Field1',
                        ingredients: 1
                    },{
                        field: 'Field2',
                        ingredients: 2
                    },{
                        field: 'Field3',
                        ingredients: 3
                    }
                ]);
            });            
        });
        describe('topics', function() {
            var topicSpies;
            beforeEach(function() {
                topicSpies = {
                    filterCompleted: function(exp){
                        return;
                    },
                    resetCompleted: function() {
                        return;
                    }
                };
                spyOn(topicSpies, 'filterCompleted');
                spyOn(topicSpies, 'resetCompleted');
                topic.subscribe('filter/filter', function(data) {
                    topicSpies.filterCompleted(data.expression);
                });
                topic.subscribe('filter/reset', topicSpies.resetCompleted);                
            });
            
            describe('filter button', function(){
                beforeEach(function(){
                    widget.childWidgets = [
                        new Stateful({
                            data: {
                                field: 'ISLAND',
                                ingredients: ['Orcas', 'San Juan']
                            }
                        }),
                        new Stateful({
                            data: {
                                field: 'SEVERITY',
                                ingredients: [2]
                            }
                        })
                    ];
                });
                it('should have published a filter topic', function(){
                    widget.filter();
                    expect(topicSpies.filterCompleted).toHaveBeenCalled();
                });
                it('should publish a specific filter topic', function(){
                    widget.filter();
                    var expression = 'ISLAND IN (\'Orcas\',\'San Juan\') AND SEVERITY IN (2)';
                    expect(topicSpies.filterCompleted).toHaveBeenCalledWith(expression);
                });
            });
            describe('reset button', function(){
                it('should publish a reset topic', function(){
                    widget.reset();
                    expect(topicSpies.resetCompleted).toHaveBeenCalled();
                });
            });
        });
    });
});
