import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY no está definida en .env");
}

const genAI = new GoogleGenAI({ apiKey });

const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Genera una descripción atractiva para un producto o categoría usando Gemini AI.
 * @param {string} name - Nombre del producto o categoría
 * @param {string} context - Contexto (ej: "Producto", "Categoría de tienda")
 * @returns {Promise<string>} Descripción generada
 */
const generateProductDescription = async (name, context = "Producto") => {
  try {
    const prompt = `Actúa como copywriter experto. Crea una descripción corta y atractiva para un ${context} llamado "${name}". Solo texto plano, sin negritas ni símbolos. Máximo 2-3 líneas.`;
    const response = await genAI.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    const text = response.text.trim();
    return text;

  } catch (error) {
    console.error("Error en generateProductDescription:", error.message);
    return "Calidad excepcional, diseño moderno y funcionalidad superior en cada detalle.";
  }
};

/**
 * Analiza un array de reseñas y resume el sentimiento general usando Gemini AI.
 * @param {string} productName - Nombre del producto
 * @param {Array<string|object>} reviewsArray - Array de reseñas (strings u objetos con .comment)
 * @returns {Promise<string>} Resumen del sentimiento general
 */
const analyzeReviews = async (productName, reviewsArray) => {
  try {
    if (!Array.isArray(reviewsArray) || reviewsArray.length === 0) {
      return "Aún no hay reseñas disponibles.";
    }

    const cleanReviews = reviewsArray
      .map((r) =>
        typeof r === "string" ? r : r.comment || r.comentario || String(r)
      )
      .filter(Boolean);

    if (cleanReviews.length === 0) {
      return "Aún no hay reseñas válidas para analizar.";
    }

    const prompt = `Analiza estas reseñas del producto "${productName}":\n${cleanReviews
      .map((r, i) => `${i + 1}. ${r}`)
      .join("\n")}\n\nResume el sentimiento general en español en UNA frase corta y directa.`;

    const response = await genAI.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    const text = response.text.trim();
    return text;

  } catch (error) {
    console.error("Error en analyzeReviews:", error.message);
    return "Análisis de sentimiento no disponible en este momento.";
  }
};

export { generateProductDescription, analyzeReviews };