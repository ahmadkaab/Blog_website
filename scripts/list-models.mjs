import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const key = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
     console.log("Listing Gemini Models...");
     const res = await fetch(url);
     const data = await res.json();
     if(data.error) {
       console.error("API Error Response:", JSON.stringify(data.error, null, 2));
     } else {
       console.log("Found", data.models.length, "models.");
       const imageModels = data.models.filter(m => m.name.includes("imagen") || m.name.includes("image"));
       console.log("Image/Imagen models:", JSON.stringify(imageModels, null, 2));
       
       // Just list all model names just in case
       console.log("All model names:", data.models.map(m => m.name).join(", "));
     }
  } catch (error) {
     console.error("Fetch failed:", error);
  }
}

listModels();
