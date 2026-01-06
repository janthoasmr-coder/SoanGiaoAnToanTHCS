
import { GoogleGenAI, Type } from "@google/genai";

export async function generateLessonContent(topic: string, grade: string, subject: string) {
  // Khởi tạo instance mới ngay trước khi gọi để đảm bảo lấy đúng API_KEY hiện tại
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Bạn là một chuyên gia sư phạm hàng đầu. Hãy tạo nội dung giáo án chi tiết cho bài học: "${topic}", lớp ${grade}, môn ${subject}. 
  Yêu cầu tuân thủ nghiêm ngặt Công văn 5512 (4 hoạt động: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng) và tích hợp các mã Năng lực số cụ thể theo Công văn 3456.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Using responseSchema to ensure reliable structure mapping to the UI
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            knowledge: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Danh sách các yêu cầu cần đạt về kiến thức"
            },
            mathCompetency: {
              type: Type.STRING,
              description: "Mô tả cụ thể về năng lực toán học được hình thành"
            },
            digitalCompetencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING, description: "Mã năng lực số (ví dụ: 3.1.TC1a)" },
                  name: { type: Type.STRING, description: "Tên năng lực số" },
                  action: { type: Type.STRING, description: "Biểu hiện/hành động cụ thể của học sinh" }
                },
                required: ["code", "name", "action"]
              }
            },
            qualities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Các phẩm chất được tích hợp"
            },
            equipment: {
              type: Type.STRING,
              description: "Thiết bị dạy học và học liệu"
            },
            startup: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.STRING },
                instruction: { type: Type.STRING },
                execution: { type: Type.STRING },
                discussion: { type: Type.STRING },
                conclusion: { type: Type.STRING }
              }
            },
            formation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  expectedProduct: { type: Type.STRING }
                }
              }
            },
            practice: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.STRING },
                instruction: { type: Type.STRING },
                expectedProduct: { type: Type.STRING }
              }
            },
            application: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.STRING },
                instruction: { type: Type.STRING },
                expectedProduct: { type: Type.STRING }
              }
            }
          }
        }
      },
    });

    if (!response.text) throw new Error("Không có phản hồi từ AI");
    return JSON.parse(response.text.trim());
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Nếu lỗi do API Key không hợp lệ hoặc thiếu (Requested entity was not found)
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_NOT_FOUND");
    }
    throw error;
  }
}
