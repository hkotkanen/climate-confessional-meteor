import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Random } from 'meteor/random';

// import  { Confessions } from "../api/confessions.js";

import './layout.html';

// Template.body.onCreated(function bodyOnCreated() {
//   this.state = new ReactiveDict();
//   Meteor.subscribe('confessions');
// });
//
// Template.body.helpers({
//   confessions() {
//     const instance = Template.instance();
//     if (instance.state.get('hideCompleted')) {
//       return Confessions.find({ checked: { $ne: true }}, { sort: { createdAt: -1 } })
//     }
//     return Confessions.find({}, { sort: { createdAt: -1 } });
//   },
//   randomConfession() {
//     // probably shouldn't do it like this?
//     const randomConfession = Random.choice(Confessions.find().fetch());
//     console.log('tried to choice a confessoin');
//     console.log(randomConfession._id);
//     return randomConfession;
//   },
//   playing() {
//     const instance = Template.instance();
//     return instance.state.get('playing');
//   },
//   hiddenCount() {
//     return Confessions.find({ hidden: true }).count();
//   }
// });

Template.body.events({
  'submit .new-confession'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    if (text) {
      Meteor.call('confessions.insert', text);
      // Clear form
      target.text.value = '';
    }
  },
  // 'click .toggle-autoplay'(event, instance) {
  //   instance.state.set('playing', !instance.state.get('playing'));
  //   console.log(`Playing state: ${instance.state.get('playing')}`);
  // }
});
