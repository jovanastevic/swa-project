import {app} from './index';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// for jest this file is separated from index.ts, so we need to start the server here
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});