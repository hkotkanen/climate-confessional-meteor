import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './confessionSingle.html';

Template.confessionList.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});
