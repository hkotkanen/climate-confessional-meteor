import { Template } from 'meteor/templating';
import { Confessions } from "../api/confessions";

import './confessionSlideshow.html';


function newConfession(prevConfession) {
  let randConfession = null;
  const array = Confessions.find().fetch();
  do {
    const randomIndex = Math.floor( Math.random() * array.length );
    randConfession = array[randomIndex];
  // get a new one until it's different from the previous one
  } while (!!prevConfession && randConfession._id == prevConfession.get()._id)
  return randConfession;
}

Template.confessionSlideshow.onCreated(function created() {
  this.gallery = FlowRouter.getRouteName();

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
      self.confession.set(newConfession(self.confession));
      self.visible.set(true);
    }, 500)

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
  },
  galleryMode() {
    return Template.instance().gallery;
  }
});
