// Simple round-robin model rotation given an array of model ids
export const rotateModels = (models, index) => {
  if (!models || models.length === 0) return 'gemini-2.5-flash';
  return models[index % models.length];
};

export default rotateModels;
