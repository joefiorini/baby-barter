function Routes() {
  // // routes/resources
  this.resource('families', function() {
    this.route('new');
  });

  this.resource('sessions', function() {
    this.route('new');
  });
}

export default Routes;
