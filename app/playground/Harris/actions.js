"use server";
import OpenAI from "openai";
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const base_url = process.env.BASE_URL;
const apiKey = process.env.API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: base_url,
});

// Define a tool for extracting structured nutrition facts
const nutritionTool = {
  "type": "function",
  "function": {
    "name": "extract_nutrition_facts",
    "description": "Extracts structured nutritional information, ingredients, risk levels with explanations, and health recommendations for a given food item, tailored to multiple illnesses.",
    "parameters": {
      "type": "object",
      "properties": {
        "sicknesses": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["high blood pressure", "gout", "diabetes", "heart disease", "obesity", "none"]
          },
          "description": "An array of specific illnesses or conditions of the user (e.g., gout, diabetes)."
        },
        "prompts": {"type":"string", "description":"Additional prompts if have and generate based on this prompt please if not blank"},
        "kcal": { "type": "number", "description": "The total calories (kcal) in the food item, look at the prompts as well to estimate addons calories." },
        "protein": { "type": "number", "description": "The amount of protein (in grams) in the food item." },
        "carbs": { "type": "number", "description": "The amount of carbohydrates (in grams) in the food item." },
        "fat": { "type": "number", "description": "The amount of fat (in grams) in the food item." },
        "sugar": { "type": "number", "description": "The amount of sugar (in grams) in the food item." },
        "fiber": { "type": "number", "description": "The amount of dietary fiber (in grams) in the food item." },
        "sodium": { "type": "number", "description": "The amount of sodium (in milligrams) in the food item." },
        "purines": { "type": "number", "description": "The estimated purine content (in milligrams) in the food item." },
        "ingredients": {
          "type": "array",
          "items": { "type": "string" },
          "description": "A list of key ingredients identified in the food item."
        },
        "highPurineIngredients": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "ingredient": { "type": "string", "description": "The name of the high-purine ingredient." },
              "purineLevel": { "type": "number", "description": "The estimated purine level of the ingredient (mg/100g)." }
            },
            "required": ["ingredient", "purineLevel"]
          },
          "description": "A list of ingredients with high purine levels and their estimated purine content."
        },
        "riskLevels": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "level": {
                "type": "string",
                "enum": ["Low", "Moderate", "High"],
                "description": "The risk level for this specific illness."
              },
              "reason": {
                "type": "string",
                "description": "Detailed explanation of why this risk level was assigned, referencing specific nutrients or ingredients and prompts."
              }
            },
            "required": ["level", "reason"]
          },
          "description": "An object mapping each illness to its risk assessment with detailed reasoning."
        },
        "recommendations": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": { "type": "string" }
          },
          "description": "An object mapping each illness to its respective recommendations."
        }
      },
      "required": [
        "sicknesses",
        "prompts",
        "kcal",
        "protein",
        "carbs",
        "fat",
        "sugar",
        "fiber",
        "sodium",
        "purines",
        "ingredients",
        "highPurineIngredients",
        "riskLevels",
        "recommendations"
      ]
    }
  }
}

// Main function to connect and analyze food image
export const connectionToMuhammadAli = async (sicknesses, imageUrl, prompt) => {
  try {
    // Define the messages for the chat completion
    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: `Can you tell me the food nutrition of the image and from this prompt - ${prompt}, tailored for ${sicknesses.join(", ")}?` },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ];

    // Call the OpenAI API with tool calling enabled
    const response = await openai.chat.completions.create({
      model: "qwen2.5-vl-72b-instruct", // Use the appropriate model
      max_tokens: 1000,
      tools: [nutritionTool], // Enable tool calling
      messages: messages,
    });

    // Extract the tool call response
    const toolCalls = response.choices[0]?.message?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      if (toolCall.function.name === "extract_nutrition_facts") {
        const nutritionFacts = JSON.parse(toolCall.function.arguments);

        // Log and return the structured nutrition facts
        console.log(nutritionFacts);
        return nutritionFacts;
      }
    }

    // If no tool call was made, log the raw response
    console.log(JSON.stringify(response));
    
    return JSON.stringify(response);
  } catch (error) {
    console.error("Error during analysis:", error);
    throw error;
  }
};

// Configure the OSS client
const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_SECRET_KEY,
  bucket: process.env.BUCKET_NAME,
});

// Upload file to Alibaba OSS
export async function uploadToOSS(formData) {
  try {
    const file = formData.get('file'); // Get the uploaded file

    if (!file) {
      throw new Error('No file uploaded.');
    }

    // Generate a unique file name
    const fileName = `${uuidv4()}-${file.name}`;

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to OSS
    const result = await client.put(fileName, buffer);

    // Return the OSS URL
    return { success: true, url: result.url };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

// ✅ Reusable modular version of the nutrition extractor
export async function getNutritionFacts({ imageUrl, prompt, sicknesses }) {
  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Can you analyze this food image and provide detailed nutritional information based on this prompt: "${prompt}"?
The user has the following health concerns: ${sicknesses.join(", ")}.
Please extract total values (not per serving) and tailor risk levels accordingly.
            `.trim(),
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ];

    const response = await openai.chat.completions.create({
      model: "qwen2.5-vl-72b-instruct",
      max_tokens: 1500,
      tools: [nutritionTool],
      tool_choice: "auto",
      messages,
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "extract_nutrition_facts") {
      throw new Error("Tool function not called or improperly returned.");
    }

    const data = JSON.parse(toolCall.function.arguments);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error getting nutrition facts:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }
}
