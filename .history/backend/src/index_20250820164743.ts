import app from './app';
import { ENV } from './utils/env';

app.listen(ENV.PORT, () => {
  console.log(`API listening on http://localhost:${ENV.PORT}`);
});
