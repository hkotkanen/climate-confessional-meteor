import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './listener.html';

Template.listener.onCreated(function onCreated() {
  this.state = new ReactiveDict();
  this.state.set('listening', false);
  this.state.set('interimResult', '...');
  this.state.set('sessionResults', []);
  this.state.set('finalResult', '...');

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
    return Template.instance().state.get('finalResult');
  },
});

Template.listener.events({
  'click .toggle-listening'() {
    const instance = Template.instance();
    const listening = !instance.state.get('listening');
    instance.state.set('listening', listening);

    if (listening) {
      instance.recognition.start();
      instance.state.set('finalResult', '...');
    } else {
      instance.recognition.stop();
      Meteor.setTimeout(
        () => {
          console.log(`Final message: ${instance.state.get('sessionResults').join('. ')}`);
          instance.state.set('interimResult', '...');
          instance.state.set('finalResult', instance.state.get('sessionResults').join('. '));
          Meteor.call('confessions.insert', instance.state.get('finalResult'));
        },
        5000
      );
    }
  },
});
