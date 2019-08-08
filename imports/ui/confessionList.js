import { Template } from 'meteor/templating';
import { Confessions } from "../api/confessions";

import './confessionList.html';
import './confessionSingle.js';

Template.confessionList.onCreated(function created() {
  Meteor.subscribe('confessions');
});

Template.confessionList.helpers({
  confessions() {
    return Confessions.find({}, { sort: { createdAt: -1 } });
  },
});
