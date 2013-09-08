var attr = DS.attr;

var Family = DS.Model.extend({
  email: attr('string'),
  display_name: attr('string'),
  password: attr('string')
});

export default Family;
