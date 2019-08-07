import '../imports/startup/accounts-config.js';
import '../imports/ui/layout.js';

import '../imports/ui/listener.js';
import '../imports/ui/confessionList.js'
// import '../imports/ui/confessionSlideShow.js'
//
// FlowRouter.route('/', {
//   action: function (params) {
//     console.log('Yay! Routed to /');
//     BlazeLayout.render('layout', { main: 'confessionSlideShow' });
//   }
// });

FlowRouter.route('/listener', {
  action: function (params) {
    console.log('Yay! Routed to /listener');
    BlazeLayout.render('layout', { main: 'listener' });
  }
});

FlowRouter.route('/', {
  action: function (params) {
    console.log('Yay! Routed to /list');
    BlazeLayout.render('layout', { main: 'confessionList' });
  }
});

// FlowRouter.route('/info', {
//   action: function (params) {
//     console.log('Yay! Routed to /info');
//     BlazeLayout.render('layout', { main: 'info' });
//   }
// });
