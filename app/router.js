var router = Ember.Router.map(function(){
  this.resource('families', function() {
    this.route('new');
  });

  this.resource('sessions', function() {
    this.route('new');
  });

  this.resource('sittings', function() {
    this.route('new');
  });
});

export default router;
