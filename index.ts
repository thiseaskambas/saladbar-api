import app from './src/app';
import config from './src/utils/config';

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

//NOTE: Dealing With Unhandled and Uncaught Errors

//(1)when not handling a rejected Promise with a .catch() :
process.on('unhandledRejection', (reason: Error | any) => {
  console.log(`Unhandled Rejection: ${reason.message || reason}`);

  throw new Error(reason.message || reason);
});

//(2)
process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  // errorHandler.handleError(error);
});
