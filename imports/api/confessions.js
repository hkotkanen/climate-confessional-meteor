import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

const allowedAccounts = [
  'dummy'
];

export const Confessions = new Mongo.Collection('confessions');

if (Meteor.isServer) {
  Meteor.publish('confessions', function confessionsPublication() {
    return Confessions.find({ hidden: { $ne: true } });
  });
}

Meteor.methods({
  'confessions.insert'(text) {
    check(text, String);

    if (Meteor.user() && !allowedAccounts.includes(Meteor.user().username)) {
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
