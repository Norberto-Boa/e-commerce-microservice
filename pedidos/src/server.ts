import express from 'express';
import './infra/providers/kafka/consumers';
import { router } from './infra/routes';
const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => { console.log('listening on port ' + PORT) });
