import { SocketIoConfig } from 'ngx-socket-io';

export const environment = {
  production: true,
  googleAPIKey: "AIzaSyD7jX4TvzUeiVRR-EDdsn-b5QdMlAu5Z2c",
  backUrl: 'http://localhost:3000',
  socketConfig: <SocketIoConfig>{ url: 'http://localhost:3000', options: {} }
};
