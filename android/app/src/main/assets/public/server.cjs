var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/gemini/enhance-caption", async (req, res) => {
    const { text } = req.body;
    try {
      if (!text) return res.status(400).json({ error: "Text is required" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Enhance this social media caption to be more engaging, modern, and punchy. Keep it around the same length. Use 1-2 relevant emojis. 
        Caption: "${text}"`,
        config: {
          temperature: 0.8
        }
      });
      res.json({ enhancedText: response.text });
    } catch (error) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429") || error.status === 429 || error.code === 429;
      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for enhance-caption");
        return res.status(429).json({
          error: "AI Quota reached. The AI is taking a short break. Please try again later.",
          fallback: text
        });
      }
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/gemini/feed-insights", async (req, res) => {
    try {
      const { posts } = req.body;
      const postsText = posts.map((p) => p.content).join("\n---\n");
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these social media posts and provide a 2-sentence 'Vibe Check' for the community trends today. 
        Posts:
        ${postsText}`,
        config: {
          temperature: 0.7
        }
      });
      res.json({ insights: response.text });
    } catch (error) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429") || error.status === 429 || error.code === 429;
      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for feed-insights");
        return res.status(429).json({
          error: "AI Quota reached. Vibes are currently unanalyzable.",
          insights: "The community is currently experiencing high-energy creative waves. Everyone is sharing their best moments!"
        });
      }
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/gemini/search-music", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a music search engine. Find 10 popular songs that match this search query: "${query}". 
        Return the results as a JSON array of objects, where each object has:
        - name: string (song title)
        - artist: string (artist name)
        - id: string (unique identifier)
        
        ONLY return the JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                id: { type: import_genai.Type.STRING },
                name: { type: import_genai.Type.STRING },
                artist: { type: import_genai.Type.STRING }
              },
              required: ["id", "name", "artist"]
            }
          }
        }
      });
      const tracks = JSON.parse(response.text || "[]");
      res.json({ tracks });
    } catch (error) {
      const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429") || error.status === 429 || error.code === 429;
      if (isQuotaError) {
        console.warn("Gemini Quota Exceeded for search-music. Returning fallback results.");
        const fallbacks = [
          { id: "f1", name: "Sunset Vibes", artist: "Chill Master" },
          { id: "f2", name: "City Lights", artist: "Midnight Pulse" },
          { id: "f3", name: "Aura Flow", artist: "Zenith" },
          { id: "f4", name: "Electric Dreams", artist: "Cyber Soul" },
          { id: "f5", name: "Summer Rain", artist: "Acoustic Waves" },
          { id: "f6", name: "Midnight City", artist: "Retro Wave" },
          { id: "f7", name: "Lofi Study", artist: "Chill Beats" },
          { id: "f8", name: "Morning Sun", artist: "Acoustic Folk" },
          { id: "f9", name: "Dance Floor", artist: "Techno King" },
          { id: "f10", name: "Skyline", artist: "Nu Jazz" }
        ];
        const filtered = fallbacks.filter(
          (t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.artist.toLowerCase().includes(query.toLowerCase())
        );
        const results = filtered.length > 0 ? filtered : fallbacks.slice(0, 5);
        return res.json({
          tracks: results,
          warning: "Using local fallback database due to AI quota limits."
        });
      }
      console.error("Music Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/gemini/search-users", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a user database for an Indian Social Media app. Find 10 realistic Indian Instagram accounts (real celebrities or realistic dummy creators) that match this search query: "${query}". 
        Return the results as a JSON array of objects, where each object has:
        - id: string (unique)
        - name: string (full name in English)
        - username: string (instagram style username)
        - avatar: string (use a realistic placeholder URL from unsplash like https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=150&h=150)
        - followers: number
        - following: number
        - bio: string
        
        ONLY return the JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                id: { type: import_genai.Type.STRING },
                name: { type: import_genai.Type.STRING },
                username: { type: import_genai.Type.STRING },
                avatar: { type: import_genai.Type.STRING },
                followers: { type: import_genai.Type.NUMBER },
                following: { type: import_genai.Type.NUMBER },
                bio: { type: import_genai.Type.STRING }
              },
              required: ["id", "name", "username", "avatar", "followers", "following", "bio"]
            }
          }
        }
      });
      const users = JSON.parse(response.text || "[]");
      res.json({ users });
    } catch (error) {
      if (error.message?.includes("429") || error.status === 429) {
        const fallbacks = [
          { id: "u101", name: "Shah Rukh Khan", username: "iamsrk", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", followers: 44e6, following: 6, bio: "Actor" },
          { id: "u102", name: "Sachin Tendulkar", username: "sachintendulkar", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150", followers: 48e6, following: 30, bio: "Cricketer" },
          { id: "u103", name: "Ranbir Kapoor", username: "ranbir_kapoor_official", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", followers: 12e6, following: 100, bio: "Artist" }
        ];
        return res.json({ users: fallbacks });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/gemini/search-global", async (req, res) => {
    const { query } = req.body;
    try {
      if (!query) return res.status(400).json({ error: "Query is required" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a search engine for an Indian Social Media app. Search for: "${query}".
        Find:
        1. "users": 5 realistic Indian accounts (id, name, username, avatar, followers, bio).
        2. "posts": 5 realistic Indian posts (id, author {id, name, username, avatar}, content, image, likes).
        3. "hashtags": 5 trending Indian hashtags related to the query.

        Return as a structured JSON object with these three keys.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              users: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    id: { type: import_genai.Type.STRING },
                    name: { type: import_genai.Type.STRING },
                    username: { type: import_genai.Type.STRING },
                    avatar: { type: import_genai.Type.STRING },
                    followers: { type: import_genai.Type.NUMBER },
                    bio: { type: import_genai.Type.STRING }
                  },
                  required: ["id", "name", "username", "avatar", "followers", "bio"]
                }
              },
              posts: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    id: { type: import_genai.Type.STRING },
                    author: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        id: { type: import_genai.Type.STRING },
                        name: { type: import_genai.Type.STRING },
                        username: { type: import_genai.Type.STRING },
                        avatar: { type: import_genai.Type.STRING }
                      }
                    },
                    content: { type: import_genai.Type.STRING },
                    image: { type: import_genai.Type.STRING },
                    likes: { type: import_genai.Type.NUMBER }
                  }
                }
              },
              hashtags: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            }
          }
        }
      });
      const results = JSON.parse(response.text || "{}");
      res.json(results);
    } catch (error) {
      console.error("Global Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
