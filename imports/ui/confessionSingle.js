import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './confessionSingle.html';

Template.confessionList.helpers({
  isHidden() {
    return this.hidden;
  },
});
