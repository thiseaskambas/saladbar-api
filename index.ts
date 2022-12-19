import app from './src/app';
import config from './src/utils/config';
// import errorController from './src/controllers/errorController';
//NOTE: Dealing With Unhandled and Uncaught Errors
//(1)
process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  // errorController.errorHandler(error);
  process.exit(1);
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

//(2)when not handling a rejected Promise with a .catch() :
process.on('unhandledRejection', (reason: Error | any) => {
  console.log(`Unhandled Rejection: ${reason.message || reason}`);
  // throw new Error(reason.message || reason);
  process.exit(1);
});
