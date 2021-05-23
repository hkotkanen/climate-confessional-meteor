import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Confessions = new Mongo.Collection('confessions');

const adminAccounts = Meteor.settings.public.adminAccounts || [];

if (Meteor.isServer) {
  Meteor.publish('confessions', function confessionsPublication() {
    return Confessions.find({
      $or: [
        { hidden: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'confessions.insert'(text) {
    check(text, String);

    // Must be logged in AND be in admin accounts
    if (Meteor.user() === null || !adminAccounts.includes(Meteor.user().username)) {
      throw new Meteor.Error('not-authorized');
    }

    Confessions.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'confessions.setHidden'(confessionId, setHidden) {
    check(confessionId, String);
    check(setHidden, Boolean);

    const confession = Confessions.findOne(confessionId);

    // Only logged in user can make a confession hidden
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Confessions.update(confessionId, { $set: { hidden: setHidden } });
  },
});
