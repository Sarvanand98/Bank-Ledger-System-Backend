import app from "./src/app.js";
import connectdb from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectdb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server due to DB error:", err.message);
        process.exit(1);
    }
};

start();