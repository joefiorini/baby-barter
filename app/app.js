import Resolver from 'resolver';
import Adapter from 'appkit/adapter';
import SessionInit from 'appkit/initializers/session';

Ember.ENV.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver
});

Adapter.reopen({
  host: 'http://ember-dev-27896.use1.actionbox.io:3000'
});

App.ApplicationAdapter = Adapter;

Ember.TextField.reopen({
  attributeBindings: ["autofocus"]
});

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

App.Router.reopen({ location: 'history' });


App.initializer(SessionInit);

export default App;
