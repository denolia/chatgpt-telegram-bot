import modelsData from "./configs/models.json";

export interface Model {
  name: string;
  id: string;
  returnType: "text" | "image";
}

export const availableModels: Model[] = modelsData.models as Model[];

