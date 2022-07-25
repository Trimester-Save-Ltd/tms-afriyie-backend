import "dotenv/config";
// import BreeSchedular from "./utils/schedular";
import { bree } from "./utils/schedular";
import UtilSever from "./utils/util";
import { app } from "./app";
import path from "path";


// const bree = new BreeSchedular().schedular();

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    //const us = new UtilSever()
    //const due = us.calculateDueDays();
    console.log(`Listening on port ${PORT}`);
    // bree.start();
});
