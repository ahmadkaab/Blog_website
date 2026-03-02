import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-02',
  token: process.env.SANITY_API_TOKEN,
});

const GeminiKey1 = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY;
const GeminiKey2 = process.env.GEMINI_API_KEY_2;
const OpenRouterKey = process.env.OPENROUTER_API_KEY;
const HFKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;

const models = [];
if (GeminiKey1) {
  models.push({
    name: 'Gemini 2.5 Flash (Key 1)',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GeminiKey1}`,
    type: 'gemini'
  });
}
if (GeminiKey2) {
  models.push({
    name: 'Gemini 2.5 Flash (Key 2)',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GeminiKey2}`,
    type: 'gemini'
  });
}
models.push(
  {
    name: 'Llama 3.3 70B (OpenRouter)',
    url: "https://openrouter.ai/api/v1/chat/completions",
    type: 'openrouter',
    modelId: 'meta-llama/llama-3.3-70b-instruct:free'
  },
  {
    name: 'Qwen 2.5 72B (OpenRouter)',
    url: "https://openrouter.ai/api/v1/chat/completions",
    type: 'openrouter',
    modelId: 'qwen/qwen-2.5-72b-instruct:free'
  }
);

async function getArticleFromAI(topic) {
  const prompt = `You are an elite SEO content writer and PC hardware expert. 
Write a highly technical, analytical, and engaging blog post about: "${topic}".
Adhere to a "Cyber-Premium" aesthetic: authoritative, minimalist, latency-obsessed.

Return EXACTLY a pure JSON object mapping. No markdown fences.

The JSON MUST follow this exact structure exactly, using an array of blocks for content:
{
  "title": "A highly clickable SEO title",
  "slug": "url-friendly-slug-format",
  "content": [
    {
      "_type": "block",
      "style": "h2",
      "children": [{"_type": "span", "text": "Introduction"}]
    },
    {
      "_type": "block",
      "style": "normal",
      "children": [{"_type": "span", "text": "A detailed paragraph..."}]
    }
  ]
}

Please generate at least 5 substantial paragraphs, and use h2 and h3 sections.
Make sure the JSON matches this structure exactly.`;

  for (const model of models) {
    console.log(`🤖 Attempting AI generation with: ${model.name}...`);
    try {
      let response;
      if (model.type === 'gemini') {
        response = await fetch(model.url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
          })
        });
      } else if (model.type === 'openrouter') {
        response = await fetch(model.url, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${OpenRouterKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "FrameFoundry Automation",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model.modelId,
            messages: [{ "role": "user", "content": prompt }],
            temperature: 0.7,
            top_p: 1.0,
            stream: false
          })
        });
      }

      const data = await response.json();
      
      if (data.error) {
         throw new Error(`API Error from ${model.name}: ${JSON.stringify(data.error)}`);
      }

      let outputText = "";
      if (model.type === 'gemini') {
        outputText = data.candidates[0].content.parts[0].text.trim();
      } else if (model.type === 'openrouter') {
        outputText = data.choices[0].message.content.trim();
      }

      outputText = outputText.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsedJSON = JSON.parse(outputText);
      console.log(`✅ Successfully generated article using ${model.name}`);
      return parsedJSON;

    } catch (apiError) {
      console.warn(`⚠️ Failed with ${model.name}: ${apiError.message}. Trying next model...`);
    }
  }

  console.error("❌ All AI models failed, falling back to mock data.");
  return {
    title: `${topic} - A Comprehensive Analysis`,
    slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    content: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Introduction to " + topic }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "This is an auto-generated mock article because all AI APIs in the waterfall fallback failed or were rate limited." }]
      }
    ]
  };
}

async function getImageFromAI(title) {
  const prompt = `Generate a hyper-realistic, cinematic 16:9 banner image representing: ${title}. Cyber-premium aesthetic, dark mode, subtle neon lighting, volumetric fog. No text in the image.`;

  const imageModels = [];
  if (GeminiKey1) {
    imageModels.push({
      name: 'Imagen 4 Fast (Key 1)',
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GeminiKey1}`,
      type: 'gemini-imagen'
    });
  }
  if (GeminiKey2) {
    imageModels.push({
      name: 'Imagen 4 Fast (Key 2)',
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GeminiKey2}`,
      type: 'gemini-imagen'
    });
  }
  
  if (HFKey) {
     imageModels.push({
        name: 'SDXL (Hugging Face)',
        url: `https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell`,
        type: 'huggingface'
     });
  }

  for (const model of imageModels) {
    console.log(`🎨 Attempting Image generation with: ${model.name}...`);
    try {
      if (model.type === 'gemini-imagen') {
        const response = await fetch(model.url, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1, aspectRatio: "16:9" }
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(JSON.stringify(data.error));
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
          console.log(`✅ Successfully generated image using ${model.name}`);
          return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
        }
      } else if (model.type === 'huggingface') {
        const headers = {
           "Content-Type": "application/json"
        };
        if (HFKey) headers["Authorization"] = `Bearer ${HFKey}`;
        
        const response = await fetch(model.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ inputs: prompt })
        });
        
        
        if (!response.ok) {
           throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log(`✅ Successfully generated image using ${model.name}`);
        return Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.warn(`⚠️ Failed with ${model.name}: ${error.message}. Trying next model...`);
    }
  }
  
  console.log("❌ All Image GenAI models failed. Falling back to curated high-quality Unsplash image...");
  const fallbackImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop", // Tech circuits
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop", // Cyber security
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=675&fit=crop", // Matrix code
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop", // Server room neon
    "https://images.unsplash.com/photo-1614064641913-a53cfea0c0dd?w=1200&h=675&fit=crop"  // Abstract data/AI
  ];
  const randomUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  
  try {
    const res = await fetch(randomUrl);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch(e) {
    console.error("❌ Ultimate fallback image failed", e);
    return null;
  }
}

async function publishArticle(topic) {
  try {
    const articleData = await getArticleFromAI(topic);
    
    console.log(`📝 Generated Title: ${articleData.title}`);
    console.log(`🚀 Publishing to Sanity CMS (Slug: ${articleData.slug})...`);
    
    // Fetch an author to attach (uses the first one found)
    const authors = await sanityClient.fetch('*[_type == "author"]{_id}');
    let authorRef = undefined;
    if (authors && authors.length > 0) {
      authorRef = { _type: 'reference', _ref: authors[0]._id };
    }

    console.log(`🎨 Requesting AI Image for: ${articleData.title}...`);
    const imageBuffer = await getImageFromAI(articleData.title);
    let mainImageRef = undefined;
    
    if (imageBuffer) {
      console.log(`☁️ Uploading Image to Sanity Assets...`);
      const imageAsset = await sanityClient.assets.upload('image', imageBuffer, {
        filename: `${articleData.slug}-hero.jpg`
      });
      mainImageRef = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        }
      };
      console.log(`✅ Image uploaded successfully (ID: ${imageAsset._id})`);
    }

    const doc = {
      _type: 'post',
      title: articleData.title,
      slug: {
        _type: 'slug',
        current: articleData.slug,
      },
      author: authorRef,
      mainImage: mainImageRef,
      body: articleData.content,
      publishedAt: new Date().toISOString(),
    };

    const result = await sanityClient.create(doc);
    console.log(`✅ Success! Article published and live.`);
    console.log(`View it on the CMS at ID: ${result._id}`);

  } catch (error) {
    console.error("❌ Automation Failed:", error);
  }
}

const topic = process.argv.slice(2).join(' ');
if (!topic) {
  console.log("Usage: node publish-post.mjs 'Your topic idea here'");
  process.exit(1);
}

publishArticle(topic);
