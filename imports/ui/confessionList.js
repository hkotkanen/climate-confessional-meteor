import { Meteor } from "meteor/meteor";
import { Template } from 'meteor/templating';
import { Confessions } from "../api/confessions";
import './confessionList.html';
import './confessionSingle.js';

const adminAccounts = Meteor.settings.public.adminAccounts || [];

function getConfessions() {
    // not admin? no confessions for you, only empty page
    if (!Meteor.user() || !adminAccounts.includes(Meteor.user().username)) {
      // redirecting not a good idea because we want to be able to log in here
      // FlowRouter.go('/');
      return {}
    }
    // admin? here's all of them
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
});

Template.confessionList.helpers({
  confessions() {
    return Template.instance().confessions.get();
  },
});
