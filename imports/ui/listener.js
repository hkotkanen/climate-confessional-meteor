import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './listener.html';

const adminAccounts = Meteor.settings.public.adminAccounts || [];
function isAdmin() {
  return !!Meteor.user() && adminAccounts.includes(Meteor.user().username);
}

Template.listener.onCreated(function onCreated() {
  this.state = new ReactiveDict();
  this.state.set('listening', false);
  this.state.set('interimResult', '...');
  this.state.set('sessionResults', []);

  this.recognition = new webkitSpeechRecognition();
  this.recognition.continuous = true;
  this.recognition.interimResults = true;
  this.recognition.lang = 'fi-FI';
  console.log(this.recognition);

  this.recognition.onresult = (event) => {
    const latestResult = event.results[event.results.length - 1];
    // lots of empty ones on short pauses
    if (latestResult.isFinal && latestResult[0].transcript !== '') {
      console.log(`Final result received: ${latestResult[0].transcript}`);
      const sessionResults = this.state.get('sessionResults');
      sessionResults.push(latestResult[0].transcript);
      this.state.set('sessionResults', sessionResults);
    } else {
      // console.log(`Interim result received: ${latestResult[0].transcript}. Confidence: ${latestResult[0].confidence}`);
      this.state.set('interimResult', latestResult[0].transcript);
    }
  };
});

Template.listener.helpers({
  isListening() {
    return Template.instance().state.get('listening');
  },
  interimResult() {
    return Template.instance().state.get('interimResult');
  },
  finalResult() {
    return Template.instance().state.get('sessionResults').join('. ');
  },
});

Template.listener.events({
  'click .start-listening'() {
    const instance = Template.instance();
    instance.state.set('listening', true);
    instance.state.set('sessionResults', []);
    instance.recognition.start();
  },
  'click .stop-listening'() {
    const instance = Template.instance();
    instance.state.set('listening', false);

    instance.recognition.stop();
    Meteor.setTimeout(
      () => {
        const finalMessage = instance.state.get('sessionResults').join('. ');
        if (isAdmin() && finalMessage !== '') {
          console.log(`Saving final message: ${finalMessage}`);
          instance.state.set('interimResult', '...');
          Meteor.call('confessions.insert', finalMessage);
        } else {
          console.log(`Did not save message: ${finalMessage}`)
        }
      },  // google might take this long or even maybe longer to answer
          // so let's hope a new session isn't initiated during this time?
      2500
    );
  },
  'keydown .robot-input'(event) {
    if (event.key === "l") {
      // console.log('listening');
      document.getElementsByClassName("start-listening")[0].click();
      event.currentTarget.value = "";
    }
    else if (event.key === "s") {
      try {
        // console.log('stopping');
        document.getElementsByClassName("stop-listening")[0].click();
        event.currentTarget.value = "";
      }
      catch {}
    }
  }
});
