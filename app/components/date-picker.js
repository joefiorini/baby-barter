var DatePicker = Ember.Component.extend({
  didInsertElement: function() {
    this.$(".date-picker").pickadate();
  }
});

export default DatePicker;
