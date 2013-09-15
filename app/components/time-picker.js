var TimePicker = Ember.Component.extend({
  didInsertElement: function() {

    var component = this;

    var pickerFacade = {
      valueWasSet: function(e) {
        component.set("value", e.select);
        Ember.run.schedule('render', this, 'close')
      }
    }

    var picker =
      this.$(".time-picker").pickatime({
        onSet: pickerFacade.valueWasSet
      }).pickatime('picker');

    this.set('picker', picker);
  },
  minValueDidChange: function() {
    if(!this.get('minValue')) { return; }
    var date = moment().startOf('day').add('minutes', this.get('minValue'));
    var scope = [date.hour(), date.minute()];
    Ember.run.schedule('render', this.get('picker'), 'set', 'min', scope);
  }.observes('minValue'),
  maxValueDidChange: function() {
    if(!this.get('maxValue')) { return; }
    var date = moment().startOf('day').add('minutes', this.get('maxValue'));
    var scope = [date.hour(), date.minute()];
    Ember.run.schedule('render', this.get('picker'), 'set', 'max', scope);
  }.observes('maxValue')
});

export default TimePicker;
