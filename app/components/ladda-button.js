var LaddaButton = Ember.Component.extend({
  click: function() {
    var l = Ladda.create(this.$(".ladda-button")[0]);
    l.start();
  }
});

export default LaddaButton;
