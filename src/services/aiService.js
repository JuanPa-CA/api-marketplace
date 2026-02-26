import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Inicializamos la IA fuera para no repetir la instancia en cada llamada
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProductDescription = async (name, context = "Producto") => {
    try {
        // Verificación de seguridad para la API KEY
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key no encontrada en el archivo .env");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Actúa como copywriter experto. Crea una descripción corta y atractiva para un ${context} llamado "${name}". Solo texto plano, sin negritas ni símbolos.`;
        
        const result = await model.generateContent(prompt);
        // Esperamos explícitamente la respuesta para evitar errores de promesa pendiente
        const response = await result.response;
        const text = response.text();
        
        return text.trim();
    } catch (error) {
        console.error("Error en Descripción IA:", error.message);
        // El return de error es vital para que el controlador no reciba un 'undefined'
        return "Calidad excepcional y diseño único en cada detalle.";
    }
};

const analyzeReviews = async (productName, reviewsArray) => {
    try {
        if (!Array.isArray(reviewsArray) || reviewsArray.length === 0) {
            return "Aún no hay reseñas disponibles.";
        }

        const cleanReviews = reviewsArray.map(r => 
            typeof r === 'string' ? r : (r.comment || r.comentario || String(r))
        );

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analiza estas reseñas de "${productName}": ${cleanReviews.join(" | ")}. Resume el sentimiento general en español en una frase corta.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return text.trim();
    } catch (error) {
        console.error("Error en Análisis IA:", error.message);
        return "Análisis de sentimiento no disponible por el momento.";
    }
};

export { generateProductDescription, analyzeReviews };