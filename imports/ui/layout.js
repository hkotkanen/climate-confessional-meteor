import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import  { Confessions } from "../api/confessions.js";

import './layout.html';

const adminAccounts = Meteor.settings.public.adminAccounts || [];

Template.layout.helpers({
  hiddenCount() {
    const n = Confessions.find({ hidden: true }).count();
    return n ? n : 0;
  },
  isAdminUser() {
    return (Meteor.user() && adminAccounts.includes(Meteor.user().username));
  },
});
