import express from 'express';
import { router } from './infra/routes';

const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => { console.log('listening on port ' + PORT) });
