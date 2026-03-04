import fs from "fs";

const MODELS_FILE = "./models.json";

export interface Model {
  name: string;
  id: string;
}

export let availableModels: Model[] = [];

export function loadModels() {
  if (!fs.existsSync(MODELS_FILE)) {
    throw new Error("Please provide a models.json file");
  } else {
    const data = fs.readFileSync(MODELS_FILE, "utf8");
    availableModels = JSON.parse(data).models;
  }
}
