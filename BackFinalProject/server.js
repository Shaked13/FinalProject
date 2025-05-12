import express from 'express';
import router from './router/router.js';
import chalk from 'chalk';
import { badRequest } from './middlewares/badRequest.js';
import { morganLogger } from './middlewares/logger.js';
import { conn } from './services/db.service.js';
import userSeed from "./users/initialData/initialUsers.json" with {type: "json"};
import User from "./users/models/User.schema.js";
import { hashPassword } from './users/services/password.service.js';
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json({ limit: '5mb' }));

app.use(morganLogger);

app.use(cors());

app.use(router);

app.use(badRequest);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("Something broke!");
});

app.listen(PORT, async () => {
    console.log(chalk.magenta(`Server is running on port ${PORT}`));
    await conn();

    const usersFromDb = await User.find();

    try {
        userSeed.forEach(async (user) => {
            if (usersFromDb.find((dbUser) => dbUser.email === user.email)) {
                return;
            }
            const newUser = new User(user);
            newUser.password = await hashPassword(newUser.password);
            await newUser.save();
            console.log("User created ", newUser.email);
        });

    } catch (err) {
        console.log(err);
    }
});