import {app} from './index';

// for jest this file is separated from index.ts, so we need to start the server here
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});