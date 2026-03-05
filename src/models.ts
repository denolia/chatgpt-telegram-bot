import modelsData from "./configs/models.json";

export interface Model {
  name: string;
  id: string;
  returnType: "multimodal" | "image";
}

export const availableModels: Model[] = modelsData.models as Model[];
