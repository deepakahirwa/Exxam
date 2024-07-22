import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then((result) => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(` ⚙️  Server is running on ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`⚠️  error in connecting the DB ${err}`);
    });
