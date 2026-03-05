import fs from "fs";
import { Username } from "./types";

const REGISTERED_USERS_FILE = "./registered-users.json";
export let registeredUsers: Username[] = [];

export function normalizeUsername(username: string): Username {
  return username.trim().replace(/^@/, "").toLowerCase();
}

function normalizeUsernames(usernames: string[]): Username[] {
  return [...new Set(usernames.map(normalizeUsername).filter(Boolean))];
}

function writeRegisteredUsers() {
  const data = JSON.stringify({ users: registeredUsers }, null, 2);
  fs.writeFileSync(REGISTERED_USERS_FILE, `${data}\n`, "utf8");
}

export function loadRegisteredUsers() {
  if (!fs.existsSync(REGISTERED_USERS_FILE)) {
    throw new Error("Please provide a registered-users.json file");
  } else {
    const data = fs.readFileSync(REGISTERED_USERS_FILE, "utf8");
    registeredUsers = normalizeUsernames(JSON.parse(data).users ?? []);
  }
}

export function isRegisteredUser(username: string) {
  return registeredUsers.includes(normalizeUsername(username));
}

export function addRegisteredUser(username: string) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername || isRegisteredUser(normalizedUsername)) {
    return false;
  }

  registeredUsers = [...registeredUsers, normalizedUsername];
  writeRegisteredUsers();
  return true;
}

export function removeRegisteredUser(username: string) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername || !isRegisteredUser(normalizedUsername)) {
    return false;
  }

  registeredUsers = registeredUsers.filter((user) => user !== normalizedUsername);
  writeRegisteredUsers();
  return true;
}
