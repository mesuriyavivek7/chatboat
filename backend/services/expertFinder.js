import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const chat = new ChatOpenAI({
  temperature: 0.5,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const QUESTIONS = [
  "Could you please tell me what is the focus area or sector of your project?",
  "What are the basic skills you are looking for?",
  "Give the name of countries you're interested in.",
];

const VALIDATION_PROMPTS = [
  "Is this a valid project sector? Answer only yes or no: ",
  "Is this a valid list of professional skills? Answer only yes or no: ",
  "Are these valid country names or locations? Answer only yes or no: ",
];

const validateResponse = async (index, response) => {
  const validationPrompt = VALIDATION_PROMPTS[index] + response;
  const result = await chat.call([new HumanMessage(validationPrompt)]);
  return result.content.trim().toLowerCase() === "yes";
};

const getExpertProfiles = async (sector, skills, countries) => {
  const prompt = `Generate 10 expert profiles for the ${sector} sector with skills in ${skills} located in ${countries}. Return a JSON array with name, role, experience, skills, companies, location, availability.`;
  const result = await chat.call([new HumanMessage(prompt)]);
  return JSON.parse(result.content);
};

export const handleChatFlow = async (messages, step, answers) => {
  const userMessages = messages
    .filter((msg) => msg.type === "user")
    .map((msg) => msg.text);

  if (userMessages.length === 1)
    return { type: "question", content: QUESTIONS[step], resolve: false };

  const currentAnswer = userMessages[userMessages.length - 1];

  const isValid = await validateResponse(step, currentAnswer);
  if (!isValid) {
    return {
      type: "question",
      content: `I couldn't understand your response clearly. ${QUESTIONS[step]}`,
      resolve: false,
    };
  }

  if (step < QUESTIONS.length - 1) {
    return {
      type: "question",
      content: QUESTIONS[step + 1],
      resolve: true,
    };
  }

  // All 3 valid answers collected
  const [sector, skills] = answers.slice(0, 2);
  const expert = await getExpertProfiles(sector, skills, currentAnswer);

  return {
    type: "result",
    content: "Based on your requirements, I've found the following experts:",
    expert,
    resolve: true,
  };
};
