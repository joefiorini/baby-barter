import Resolver from 'resolver';

Ember.ENV.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver
});

DS.RESTAdapter.reopen({
  host: 'https://densitypop.ngrok.com'
});

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

App.Router.reopen({ location: 'history' });

export default App;
