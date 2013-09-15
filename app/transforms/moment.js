var Transform = DS.Transform.extend({
  serialize: function(value) {
    return Ember.isNone(value) ? null : value.toDate();
  },
  deserialize: function(value) {
    return Ember.isNone(value) ? null : moment(value);
  }
});

export default Transform;
