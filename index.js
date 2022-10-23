#! /usr/bin/env node
const program = require("commander");
const chalk = require("chalk");

const copyString = (string) => {
  const proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(string);
  proc.stdin.end();

  console.log(chalk.bold.green("Copied to the clipboard!\n"));
};

const rename = (type, options) => {
  if (type === "neuro" || type === "n") {
    let { author, year, title } = options;
    if (!author || !year || !title) {
      console.error(
        chalk.bold.red("Please include author, year, and title of the paper")
      );
      return;
    } else {
      console.log(chalk.bold.yellow("\nInputs:"));
      console.log("author   " + author);
      console.log("year     " + year);
      console.log("title    " + title);
    }

    const noSpecialChars = title.replace(/[^a-zA-Z0-9 ]/g, " ");
    const titleArr = noSpecialChars.split(" ");
    const capitalize = titleArr.map((word) => {
      if (word === titleArr[0]) return word.toLowerCase();
      else return word.charAt(0).toUpperCase() + word.slice(1);
    });

    title = capitalize.join("");
    author = author.toLowerCase().replace(/\s/g, "");
    year = year.replace(/\s/g, "");

    const result = author + year + title;
    console.log(chalk.bold.green("\nResult: ") + result + "\n");
    copyString(result);
  } else if (type === "ass" || type === "a") {
    const { classId, number, sign } = options;
    const signature = "_Vadim_Egorov";
    if (!number) {
      console.error(chalk.bold.red("Please include number of assignment"));
      return;
    } else {
      console.log(chalk.bold.yellow("\nInputs:"));
      console.log("classId  " + classId);
      console.log("number   " + number);
      console.log("sign     " + sign);
    }

    const newNumber = number.replace(/[^0-9 ]/g, " ").replace(/\s/g, "-");
    const result =
      (classId ? `${classId}_` : "") +
      `HW${newNumber}` +
      (sign ? signature : "");

    console.log(chalk.bold.green("\nResult: ") + result + "\n");
    copyString(result);
  } else {
    console.error(
      chalk.bold.red(
        `Type of "${type}" doesn't exist, please choose the one below`
      )
    );
    console.log("Types:");
    console.log(" neuro     n       rename neuroscience papers");
    console.log(" ass       a       rename assignment files");
    return;
  }
};

program.version("0.0.1", "-v, --version").usage("[options]");

program
  .command("rename <type>")
  .usage("--author <author> --year <year> --title <title>")
  .description("rename file")
  .alias("rn")
  .option("-a --author <author>", "enter author of the paper")
  .option("-y --year <year>", "enter the year of the paper")
  .option("-t --title <title>", "enter the title of the paper")
  .option("-c --classId <class>", "enter class name", null)
  .option("-n --number <number>", "enter the assigment number ('1 1' = '1-1')")
  .option("-s --sign <sign>", "sign with my name (true or false)", true)
  .action((type, options) => {
    rename(type, options);
  });

program.command("*", { noHelp: true }).action(() => {
  console.log("Cannot find the following command");
  program.help();
});

program.parse(process.argv);
