import app from './src/app';
import config from './src/utils/config';

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
