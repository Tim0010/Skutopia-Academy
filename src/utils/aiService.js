/**
 * AI Service for Skutopia Academy
 * Provides integration with OpenAI API for various AI features
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side use, ideally use server-side API routes
});

/**
 * Generate STEM lesson content aligned with Zambian curriculum
 * @param {string} topic - The lesson topic
 * @param {number} gradeLevel - Student grade level (8-12)
 * @param {string} subject - Subject area (Physics, Chemistry, Biology, Mathematics)
 * @returns {Promise<Object>} - Structured lesson content
 */
export async function generateLessonContent(topic, gradeLevel, subject) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert STEM educator specializing in the Zambian curriculum for grade ${gradeLevel}. 
                  Create engaging, interactive lesson content for the ${subject} topic: ${topic}.
                  Format the response as a structured JSON object with:
                  - Key concepts
                  - Detailed explanations with examples
                  - Interactive elements (descriptions of simulations, exercises)
                  - Quiz questions with answers and explanations`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating lesson content:", error);
    throw new Error("Failed to generate lesson content");
  }
}

/**
 * Answer student questions about STEM topics
 * @param {string} question - The student's question
 * @param {string} topic - Current topic being studied
 * @param {number} gradeLevel - Student grade level
 * @returns {Promise<string>} - AI tutor response
 */
export async function answerStudentQuestion(question, topic, gradeLevel) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful STEM tutor for Zambian students in grade ${gradeLevel}.
                  Provide clear, accurate answers with examples when helpful.
                  Current topic: ${topic}.
                  Keep explanations appropriate for the student's grade level.`
        },
        {
          role: "user",
          content: question
        }
      ]
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error answering student question:", error);
    throw new Error("Failed to answer question");
  }
}

/**
 * Generate quiz questions for STEM topics
 * @param {string} topic - The topic to generate questions for
 * @param {number} gradeLevel - Student grade level
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} - Array of quiz questions
 */
export async function generateQuizQuestions(topic, gradeLevel, difficulty, count) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate ${count} ${difficulty}-level multiple-choice quiz questions about ${topic} for grade ${gradeLevel} Zambian STEM students.
                  For each question, provide:
                  1. The question text
                  2. Four possible answers with one correct answer
                  3. An explanation of why the correct answer is right
                  4. Format as a JSON array of objects`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content).questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

/**
 * Generate interactive flashcards for STEM concepts
 * @param {string} topic - The topic for flashcards
 * @param {number} gradeLevel - Student grade level
 * @param {string} subject - Subject area
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array>} - Array of flashcard content
 */
export async function generateFlashcards(topic, gradeLevel, subject, count) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Create ${count} educational flashcards for grade ${gradeLevel} Zambian students studying ${subject}, focused on the topic: ${topic}.
                  For each flashcard, provide:
                  1. Front content (question, concept, or term)
                  2. Back content (answer, explanation, or definition)
                  3. A suggestion for a simple visual or diagram to accompany it
                  4. Difficulty level (1-3)
                  Format as a JSON array of objects`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content).flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards");
  }
} 