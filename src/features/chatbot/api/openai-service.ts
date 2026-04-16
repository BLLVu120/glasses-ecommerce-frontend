import { api } from "@/lib/axios";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const { data } = await api.post("/chatbot/chat", { messages });
    return data?.result?.reply || "Xin lỗi, tôi không thể trả lời lúc này.";
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}
