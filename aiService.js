import { GoogleGenAI } from "@google/genai"; 
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY no está definida en .env");
}

const genAI = new GoogleGenAI({ apiKey });

const DEFAULT_MODEL = "gemini-2.5-flash";

const generateProductDescription = async (name, context = "Producto") => {
  try {
    const model = genAI.getModel(DEFAULT_MODEL);

    const prompt = `Actúa como copywriter experto. Crea una descripción corta y atractiva para un ${context} llamado "${name}". Solo texto plano, sin negritas ni símbolos. Máximo 2-3 líneas.`;
    const result = await model.generateContent(prompt);
    const text = result.text.trim();

    return text;
  } catch (error) {
    console.error("Error en generateProductDescription:", error.message);
    return "Calidad excepcional, diseño moderno y funcionalidad superior en cada detalle.";
  }
};

const analyzeReviews = async (productName, reviewsArray) => {
  try {
    if (!Array.isArray(reviewsArray) || reviewsArray.length === 0) {
      return "Aún no hay reseñas disponibles.";
    }

    const cleanReviews = reviewsArray
      .map((r) =>
        typeof r === "string" ? r : (r.comment || r.comentario || String(r))
      )
      .filter(Boolean);

    if (cleanReviews.length === 0) {
      return "Aún no hay reseñas válidas.";
    }

    const model = genAI.getModel(DEFAULT_MODEL);

    const prompt = `Analiza estas reseñas del producto "${productName}":\n${cleanReviews
      .map((r, i) => `${i + 1}. ${r}`)
      .join("\n")}\n\nResume el sentimiento general en español en UNA frase corta y directa.`;

    const result = await model.generateContent(prompt);
    const text = result.text.trim();

    return text;
  } catch (error) {
    console.error("Error en analyzeReviews:", error.message);
    return "Análisis de sentimiento no disponible en este momento.";
  }
};

export { generateProductDescription, analyzeReviews };