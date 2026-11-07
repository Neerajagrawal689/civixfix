const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// Initialize the client. It automatically picks up GEMINI_API_KEY from environment variables.
const ai = new GoogleGenAI();

/**
 * Analyzes a civic issue report using Gemini.
 * @param {string} title - The issue title
 * @param {string} description - The issue description
 * @param {string} imagePath - Absolute path to the uploaded image file
 * @returns {Promise<Object>} - The structured AI response
 */
const analyzeIssue = async (title, description, imagePath, departments = []) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[AI Service] GEMINI_API_KEY is not set. Skipping AI analysis.');
      return null;
    }

    const deptListStr = departments.map(d => `ID: ${d.id}, Name: ${d.name}`).join(' | ');

    const prompt = `
      You are an AI assistant for a civic issue reporting system.
      Analyze the following issue reported by a citizen.

      Title: ${title}
      Description: ${description}
      
      Determine if this is a valid civic issue. Also assign a suggested category, a priority level, and your confidence score.
      Crucially, select the most appropriate department to handle this issue from the following list:
      [ ${deptListStr} ]
      
      Respond strictly in JSON format matching this schema, without markdown formatting:
      {
        "isValid": true/false,
        "category": "string (e.g., Pothole, Garbage, Lighting, Water, Other)",
        "priority": "string (LOW, MEDIUM, HIGH, CRITICAL)",
        "department_id": "string (the exact ID of the best matching department, or null)",
        "confidence": number (0 to 1),
        "reasoning": "Brief explanation of your decision"
      }
    `;

    const contents = [];

    // Attach image if available
    if (imagePath && fs.existsSync(imagePath)) {
      const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
      contents.push({
        inlineData: {
          data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
          mimeType
        }
      });
    }

    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    const jsonResult = JSON.parse(resultText);
    
    return jsonResult;
  } catch (error) {
    console.error('[AI Service] Error analyzing issue:', error);
    return null; // Fail gracefully
  }
};

const detectDuplicate = async (newIssue, existingIssues) => {
  try {
    if (!process.env.GEMINI_API_KEY || existingIssues.length === 0) return { isDuplicate: false };

    const prompt = `
      You are an AI assistant for a civic issue reporting system.
      A citizen has reported a new issue:
      Title: "${newIssue.title}"
      Description: "${newIssue.description}"
      Location: [${newIssue.latitude}, ${newIssue.longitude}]
      
      We found some recent unresolved issues nearby in the same category.
      Please determine if the new issue is highly likely to be the EXACT SAME physical real-world problem as any of these existing issues.
      
      Existing Issues:
      ${existingIssues.map(i => `ID: ${i.id} | Title: "${i.title}" | Desc: "${i.description}" | Location: [${i.latitude}, ${i.longitude}]`).join('\n')}
      
      Respond strictly in JSON format matching this schema, without any markdown formatting:
      {
        "isDuplicate": true/false,
        "duplicateOfId": "string (the ID of the matched existing issue, or null)",
        "confidence": number (0 to 1),
        "reasoning": "Brief explanation of why it is or isn't a duplicate"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('[AI Service] Error detecting duplicate:', error);
    return { isDuplicate: false };
  }
};

module.exports = {
  analyzeIssue,
  detectDuplicate
};
