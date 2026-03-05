import modelsData from "./configs/models.json";

export enum ModelReturnType {
  MULTIMODAL = "multimodal",
  IMAGE = "image",
}

export interface Model {
  name: string;
  id: string;
  returnType: ModelReturnType;
}

export const availableModels: Model[] = modelsData.models as Model[];
