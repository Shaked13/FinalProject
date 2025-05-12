import { connect } from 'mongoose';
import chalk from 'chalk';

import dotenv from "dotenv";

dotenv.config();
const mongoLocal = process.env.MONGO_LOCAL;

export const conn = async () => {

    try {
        await connect(mongoLocal);
        console.log(chalk.yellow(`Connected to MongoDB`));
    } catch (error) {
        console.log(error);
    }

};