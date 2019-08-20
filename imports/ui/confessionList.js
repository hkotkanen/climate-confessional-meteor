import { Meteor } from "meteor/meteor";
import { Template } from 'meteor/templating';
import { Confessions } from "../api/confessions";
import './confessionList.html';
import './confessionSingle.js';

const allowedAccounts = Meteor.settings.public.allowedAccounts || [];

function getConfessions() {
    // not admin gets 10 random ones
    if (!Meteor.user() || !allowedAccounts.includes(Meteor.user().username)) {
      const randArray = _.shuffle(Confessions.find().fetch());
      return _.first(randArray, 10);
    }
    //show admin all
    return Confessions.find({}, { sort: { createdAt: -1 } });
}

Template.confessionList.onCreated(function created() {
  var self = this;

  this.visible = new ReactiveVar(false);
  this.confessions = new ReactiveVar();

  this.subscribe('confessions', () => {
    self.confessions.set(getConfessions());
    self.visible.set(true);
  });

  // this.handle = Meteor.setInterval((function() {
  //   // animate fadeout
  //   self.visible.set(false);
  //
  //   // animate fadein after a delay
  //   Meteor.setTimeout(() => {
  //     self.confessions.set(getConfessions());
  //     self.visible.set(true);
  //   }, 500)
  //
  // }), 5 * 1000);
});

Template.confessionList.helpers({
  confessions() {
  //   // not admin gets 10 random ones
  //   if (!Meteor.user() || !allowedAccounts.includes(Meteor.user().username)) {
  //     const randArray = _.shuffle(Confessions.find().fetch());
  //     return _.first(randArray, 10);
  //   }
  //   //show admin all
  //   return Confessions.find({}, { sort: { createdAt: -1 } });
    return Template.instance().confessions.get();
  },
});
