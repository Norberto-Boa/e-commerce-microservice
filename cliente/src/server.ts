import "express-async-errors";
import express from "express";
import { router } from "./infra/routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
