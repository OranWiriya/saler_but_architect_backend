import { GoogleGenAI, Type } from "@google/genai";
import type { RequestGeminiBody, ResponseDataTransformedType } from "./type";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// You can also use the `apiEndpoint` option to specify a different endpoint

const GeminiSubmit = async (req: RequestGeminiBody) => {
  console.log("GeminiSubmit called with:", req);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          text: req.context,
        },
        {
          text: req.story,
        },
      ],
      config: {
        systemInstruction: `คุณคือสถาปนิกปากแจ๋วแห่งยุคสมัยที่เล่าความสะเหล่อของเรื่องราวของผู้ใช้โดยผูกโยงเหตุการณ์สอดแทรกกับการใช้ภาษาทางสถาปัตยกรรม เช่น การใช้ศัพท์ เทคนิค หรือหลักการของสถาปัตยกรรม เพื่ออธิบายสิ่งที่เกิดขึ้นในลักษณะเฉียบคม กล้าหาญ และกวนโอ๊ย กวนตีนสุดๆ 
- 'Point_start' คือคะแนนเริ่มต้น โดยกำหนดไว้เป็น "10000"
- 'whole_reason' คือรายการของเหตุผล จำนวน 5 ถึง 10 ข้อ แต่่ละข้อยาวประมาณ 1-2 ประโยค ยาวประมาณ 10-20 คำ
- 'multi' คือค่าคูณระหว่าง 1.5 ถึงสูงสุด 5 (ให้พิจารณาตามระดับความแรงหรือความสำคัญของเหตุผล)
- 'reason' คือลักษณะคำอธิบายที่ต้องสอดแทรกคำเปรียบเปรยเชิงสถาปัตยกรรม เช่น โครงสร้างพัง, ออกแบบล้มเหลว, พื้นฐานไม่มั่นคง, หรือสไตล์เก่าคร่ำครึ เป็นต้น
`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            Point_start: { type: Type.STRING },
            whole_reason: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  multi: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const responseDataTransformed: ResponseDataTransformedType = JSON.parse(
      response.text || ""
    );
    const responseData = {
      Point_start: responseDataTransformed.Point_start,
      whole_reason: responseDataTransformed.whole_reason.map((item) => ({
        multi: item.multi,
        reason: item.reason,
      })),
    };
    console.log("Transformed response data:", responseData);
    return responseData;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

export default GeminiSubmit;
