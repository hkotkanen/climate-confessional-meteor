/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Confessions } from "./confessions";

if (Meteor.isServer) {
  describe('Confessions', () => {
    describe('methods', () => {
      const userId = Random.id();
      let confessionId;

      beforeEach(() => {
        Confessions.remove({});
        confessionId = Confessions.insert({
          text: 'test confession',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned confession', () => {
        const deleteTask = Meteor.server.method_handlers['confessions.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [confessionId]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}
