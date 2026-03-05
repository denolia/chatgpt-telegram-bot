import fs from "fs";
import { Username } from "./types";
import { normalizeUsername } from "./users";

const ADMIN_USERS_FILE = "./admins.json";
export let adminUsers: Username[] = [];

function normalizeUsernames(usernames: string[]): Username[] {
  return [...new Set(usernames.map(normalizeUsername).filter(Boolean))];
}

export function loadAdminUsers() {
  if (!fs.existsSync(ADMIN_USERS_FILE)) {
    throw new Error("Please provide an admins.json file");
  } else {
    const data = fs.readFileSync(ADMIN_USERS_FILE, "utf8");
    adminUsers = normalizeUsernames(JSON.parse(data).admins ?? []);
  }
}

export function isAdminUser(username: string) {
  return adminUsers.includes(normalizeUsername(username));
}
