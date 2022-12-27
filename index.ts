import app from './src/app';

import config from './src/utils/config';

process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  //TODO: need to implement a tool for restarting the app on the host service (if not automatic)
  process.exit(1);
});

const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

//(2)when not handling a rejected Promise with a .catch() :
process.on('unhandledRejection', (reason: Error | any) => {
  console.log(
    `Unhandled Rejection: ${reason.message || reason}. Shutting app down.`
  );
  //TODO: fixserver not closing
  server.close(() => {
    console.log('server closed, shtting now');
    //TODO: need to implement a tool for restarting the app on the host service (if not automatic)
    process.exit(1);
  });
});
