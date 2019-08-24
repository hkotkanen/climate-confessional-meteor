import '../imports/startup/accounts-config.js';
import '../imports/ui/layout.js';

import '../imports/ui/listener.js';
import '../imports/ui/confessionList.js'
import '../imports/ui/confessionSlideshow.js'
import '../imports/ui/info.js'


FlowRouter.route('/', {
  action: function (params) {
    BlazeLayout.render('layout', { main: 'confessionSlideshow' });
  }
});
FlowRouter.route('/gallery', {
  name: 'gallery',
  action: function (params) {
    BlazeLayout.render('layout', { main: 'confessionSlideshow' });
  }
});

FlowRouter.route('/listener', {
  action: function (params) {
    BlazeLayout.render('layout', { main: 'listener' });
  }
});

FlowRouter.route('/list', {
  action: function (params) {
    BlazeLayout.render('layout', { main: 'confessionList' });
  }
});

FlowRouter.route('/info', {
  action: function (params) {
    BlazeLayout.render('layout', { main: 'info' });
  }
});

FlowRouter.notFound = {
  action: function (params) {
    BlazeLayout.render('layout', { main: 'confessionSlideshow' });
  }
};
