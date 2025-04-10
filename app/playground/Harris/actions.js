"use server";
import OpenAI from "openai";

// Configuration
const base_url = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const apiKey = "sk-f1863bae33d349d09bf1a6cc1f85c169";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: base_url,
});

// Define a tool for extracting structured nutrition facts
const nutritionTool = {
  type: "function",
  function: {
    name: "extract_nutrition_facts",
    description:
      "Extracts structured nutritional information, ingredients, risk levels, and health recommendations for a given food item, tailored to multiple illnesses.",
    parameters: {
      type: "object",
      properties: {
        sicknesses: {
          type: "array",
          items: {
            type: "string",
            enum: ["high blood pressure","gout", "diabetes", "heart disease", "obesity", "none"],
          },
          description: "An array of specific illnesses or conditions of the user (e.g., gout, diabetes).",
        },
        kcal: { type: "number", description: "The total calories (kcal) in the food item." },
        protein: { type: "number", description: "The amount of protein (in grams) in the food item." },
        carbs: { type: "number", description: "The amount of carbohydrates (in grams) in the food item." },
        fat: { type: "number", description: "The amount of fat (in grams) in the food item." },
        sugar: { type: "number", description: "The amount of sugar (in grams) in the food item." },
        fiber: { type: "number", description: "The amount of dietary fiber (in grams) in the food item." },
        sodium: { type: "number", description: "The amount of sodium (in milligrams) in the food item." },
        purines: { type: "number", description: "The estimated purine content (in milligrams) in the food item." },
        ingredients: {
          type: "array",
          items: { type: "string" },
          description: "A list of key ingredients identified in the food item.",
        },
        highPurineIngredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              ingredient: { type: "string", description: "The name of the high-purine ingredient." },
              purineLevel: { type: "number", description: "The estimated purine level of the ingredient (mg/100g)." },
            },
            required: ["ingredient", "purineLevel"],
          },
          description: "A list of ingredients with high purine levels and their estimated purine content.",
        },
        riskLevels: {
          type: "object",
          additionalProperties: {
            type: "string",
            enum: ["Low", "Moderate", "High"],
          },
          description: "An object mapping each illness to its respective risk level.",
        },
        recommendations: {
          type: "object",
          additionalProperties: {
            type: "array",
            items: { type: "string" },
          },
          description: "An object mapping each illness to its respective recommendations.",
        },
      },
      required: [
        "sicknesses",
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
        "recommendations",
      ],
    },
  },
};

// Main function to connect and analyze food image
export const connectionToMuhammadAli = async (sicknesses) => {
  try {
    // Define the messages for the chat completion
    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: `Can you tell me the food nutrition of the image, tailored for ${sicknesses.join(", ")}?` },
          {
            type: "image_url",
            image_url: {
              url: "https://media.istockphoto.com/id/526149515/photo/nasi-lemak-malaysian-cuisine.jpg?s=612x612&w=0&k=20&c=XiJE-q-zUMj8KLEmrDnEWHwVgaP-VPhYaOoWUgnR6UY=",
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