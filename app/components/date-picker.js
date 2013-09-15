var DatePicker = Ember.Component.extend({
  value: null,
  didInsertElement: function() {
    var component = this;

    var pickerFacade = {
      valueWasSet: function(e) {
        console.log("this", this);
        component.set("value", e.select);
        Ember.run.schedule('render', this, 'close')
      }
    }

    this.$(".date-picker").pickadate({
      onSet: pickerFacade.valueWasSet
    });

  }
});


export default DatePicker;
