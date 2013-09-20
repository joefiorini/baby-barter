var attr = DS.attr, hasMany = DS.hasMany;

var Family = DS.Model.extend({
  email: attr('string'),
  displayName: attr('string'),
  password: attr('string'),
  sittings: hasMany('sitting', {inverse: 'performedBy', async: true})
});

export default Family;
