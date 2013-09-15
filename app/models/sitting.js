var attr = DS.attr;

var Sitting = DS.Model.extend({
  startedAt: attr('moment'),
  endedAt: attr('moment'),
  requestedBy: DS.belongsTo('family'),
  performedBy: DS.belongsTo('family')
});

export default Sitting;

