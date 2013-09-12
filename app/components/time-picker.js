var TimePicker = Ember.Component.extend({
  didInsertElement: function() {
    this.$(".time-picker").pickatime();
  }
});

export default TimePicker;
