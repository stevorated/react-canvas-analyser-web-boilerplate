import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use('/public', express.static('src/public'));

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
