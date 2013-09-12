var attr = DS.attr;

var Sitting = DS.Model.extend({
  startedAt: attr('date'),
  endedAt: attr('date'),
  requestedBy: DS.belongsTo('family'),
  performedBy: DS.belongsTo('family')
});

export default Sitting;

