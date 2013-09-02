var attr = DS.attr;

var Family = DS.Model.extend({
  email: attr('string'),
  displayName: attr('string'),
  password: attr('string')
});

export default Family;
