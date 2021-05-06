import * as Main from "./index";

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

if (!username) {
  throw Error("username must be given in env var");
}

if (!password) {
  throw Error("password must be given in env var");
}

Main.main(username, password);
