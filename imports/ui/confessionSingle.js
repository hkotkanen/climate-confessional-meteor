import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './confessionSingle.html';

Template.confessionSingle.helpers({
  isHidden() {
    return this.hidden;
  },
  isOwner() {
    return Meteor.userId() === this.owner;
  },
  dateString() {
    return this.createdAt.toLocaleString();
  },
});

Template.confessionSingle.events({
  'click .toggle-hidden'() {
    Meteor.call('confessions.setHidden', this._id, !this.hidden);
  },
});
