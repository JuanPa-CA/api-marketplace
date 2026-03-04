// gemini.js  (o el nombre que prefieras en la raíz o en una carpeta utils/lib)
import { GoogleGenAI } from "@google/genai"; // ← nuevo SDK oficial
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY no está definida en .env");
}

const genAI = new GoogleGenAI({ apiKey });

// Modelos recomendados en marzo 2026 (elige uno según tus necesidades)
// Más estable y barato → gemini-2.5-flash
// Más ligero y rápido → gemini-2.5-flash-lite
// Preview experimental (muy bueno en razonamiento) → gemini-3.1-flash-lite-preview
const DEFAULT_MODEL = "gemini-2.5-flash";

const generateProductDescription = async (name, context = "Producto") => {
  try {
    const model = genAI.getModel(DEFAULT_MODEL);

    const prompt = `Actúa como copywriter experto. Crea una descripción corta y atractiva para un ${context} llamado "${name}". Solo texto plano, sin negritas ni símbolos. Máximo 2-3 líneas.`;

    // En el nuevo SDK la llamada es más limpia
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