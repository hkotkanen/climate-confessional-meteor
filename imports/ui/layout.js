import { Template } from 'meteor/templating';
import  { Confessions } from "../api/confessions.js";

import './layout.html';

Template.layout.helpers({
  hiddenCount() {
    const n = Confessions.find({ hidden: true }).count();
    return n ? n : 0;
  },
});
