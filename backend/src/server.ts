import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
