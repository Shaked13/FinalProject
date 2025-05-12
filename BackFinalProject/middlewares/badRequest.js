import chalk from 'chalk';

export const badRequest = (req, res) => {
    console.log(chalk.redBright(`404 - Not Found`));

    res.status(404).json({ message: "Not found" });

};