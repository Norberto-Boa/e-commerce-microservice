import express from 'express';
import './infra/providers/kafka/consumers';
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => { console.log('listening on port ' + PORT) });
