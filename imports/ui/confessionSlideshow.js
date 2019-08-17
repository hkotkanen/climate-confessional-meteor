import { Template } from 'meteor/templating';
import { Confessions } from "../api/confessions";
import { Random } from 'meteor/random';

import './confessionSlideshow.html';

//
function newConfession() {
  const array = Confessions.find().fetch();
  const randomIndex = Math.floor( Math.random() * array.length );
  console.log(array[randomIndex]);
  return array[randomIndex];
}

Template.confessionSlideshow.onCreated(function created() {
  var self = this;

  this.visible = new ReactiveVar(false);
  this.confession = new ReactiveVar();

  this.subscribe('confessions', () => {
    self.confession.set(newConfession());
    self.visible.set(true);
  });

  this.handle = Meteor.setInterval((function() {
    // animate fadeout
    self.visible.set(false);

    // animate fadein after a delay
    Meteor.setTimeout(() => {
      self.confession.set(newConfession());
      self.visible.set(true);
    }, 750)

  }), 10 * 1000);
});

Template.confessionSlideshow.destroyed = function() {
  Meteor.clearInterval(this.handle);
};

Template.confessionSlideshow.helpers({
  confession() {
    return Template.instance().confession.get();
  },
  visible() {
    return Template.instance().visible.get();
  }
});
