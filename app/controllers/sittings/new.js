function setDateTimeProperty(obj, prop, date) {
  var timeProp = prop + "Time";
  var time = obj.get(timeProp);
  if(!time) { return; }
  date = moment(date).startOf('day');
  var dateTime = date.add('minutes', time);
  obj.set(prop, dateTime);
}

// if end time is less than start time, assume they crossed a day boundary
function resolveDayBoundaryForTimeRange(obj, date, startProp, endProp) {
  var start = obj.get(startProp), end = obj.get(endProp);

  if(start && end && end.isBefore(start)) {
    end = end.add('days', 1);
    obj.set(endProp, end);
  }
}

var NewController = Ember.ObjectController.extend({
  actions: {
    save: function() {
      var self = this;
      this.get("model").save().then(function() {
        self.transitionToRoute("families.index");
      }).fail(Ember.RSVP.rethrow);
    }
  },
  performedOn: "2013 July, 10",
  startedAtTime: null,
  finishedAtTime: null,
  performedOnDidChange: function() {
    var date = this.get("performedOn");
    setDateTimeProperty(this, "startedAt", date);
    setDateTimeProperty(this, "endedAt", date);
  }.observes("performedOn"),
  startedAtTimeDidChange: function() {
    var date = this.get("performedOn");
    setDateTimeProperty(this, "startedAt", date);
    resolveDayBoundaryForTimeRange(this, date, "startedAt", "finishedAt");
  }.observes("startedAtTime"),
  finsihedAtTimeDidChange: function() {
    var date = this.get("performedOn");
    setDateTimeProperty(this, "finishedAt", date);
    resolveDayBoundaryForTimeRange(this, date, "startedAt", "finishedAt");
  }.observes("finishedAtTime"),
  startedAtDidChange: function() {
    console.log("startedAt: ", this.get("startedAt"));
  }.observes("startedAt"),
  finishedAtDidChange: function() {
    console.log("finishedAt: ", this.get("finishedAt"));
  }.observes("finishedAt"),
});

export default NewController;
