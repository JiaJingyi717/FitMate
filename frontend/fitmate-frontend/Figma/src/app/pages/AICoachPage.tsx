import { useState, useEffect, useRef } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send, Sparkles, Smile, Zap, Mic, MicOff, Volume2, ChevronRight, Calendar, TrendingUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

type CoachGender = "male" | "female";
type CoachPersonality = "gentle" | "strict" | "energetic";

interface Message {
  id: number;
  sender: "user" | "coach";
  text: string;
  time: string;
  recommendation?: {
    title: string;
    description: string;
    icon: string;
    link: string;
  };
}

export default function AICoachPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<CoachGender>("male");
  const [personality, setPersonality] = useState<CoachPersonality>("gentle");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "coach",
      text: "你好！我是你的AI健身教练，很高兴认识你。让我们一起开始健康之旅吧！我可以帮你制定训练计划、解答健身问题、分析你的数据。有什么我可以帮助你的吗？",
      time: "10:00",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personalities = [
    { value: "gentle", label: "温柔", icon: Smile, color: "from-blue-400 to-cyan-400" },
    { value: "strict", label: "严格", icon: Zap, color: "from-blue-600 to-blue-700" },
    { value: "energetic", label: "活力", icon: Sparkles, color: "from-cyan-500 to-blue-500" },
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectIntent = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("训练计划") || lowerText.includes("计划") || lowerText.includes("制定")) {
      return {
        title: "训练计划",
        description: "点击查看和创建你的个性化训练计划",
        icon: "📅",
        link: "/workout",
      };
    }
    
    if (lowerText.includes("数据") || lowerText.includes("分析") || lowerText.includes("统计") || lowerText.includes("进度")) {
      return {
        title: "数据分析",
        description: "查看你的训练数据和进度分析",
        icon: "📊",
        link: "/dashboard",
      };
    }
    
    if (lowerText.includes("知识") || lowerText.includes("学习") || lowerText.includes("怎么") || lowerText.includes("如何")) {
      return {
        title: "健身知识库",
        description: "探索专业的健身知识和教程",
        icon: "📚",
        link: "/knowledge",
      };
    }
    
    return null;
  };

  const generateAIResponse = (userMessage: string): { text: string; recommendation?: any } => {
    const recommendation = detectIntent(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    
    let responseText = "";
    
    if (recommendation) {
      if (recommendation.link === "/workout") {
        const responses = {
          gentle: "当然可以！我可以帮你制定训练计划。根据你的目标和体能状况，我会为你设计最适合的方案。",
          strict: "很好！制定计划是成功的第一步。我会为你设计高效的训练方案，准备好接受挑战了吗？",
          energetic: "太棒了！让我们一起制定一个让你充满活力的训练计划吧！💪",
        };
        responseText = responses[personality];
      } else if (recommendation.link === "/dashboard") {
        const responses = {
          gentle: "我来帮你查看数据。通过数据分析，我们可以更好地了解你的进步哦~",
          strict: "数据不会说谎！让我们看看你的训练成果，找出还需要改进的地方。",
          energetic: "让我们一起看看你的精彩成绩！你的进步一定会让你惊喜的！🔥",
        };
        responseText = responses[personality];
      } else if (recommendation.link === "/knowledge") {
        const responses = {
          gentle: "好问题！我们的知识库里有很多专业的健身知识，我带你去看看~",
          strict: "学习是进步的关键。知识库里有你需要的答案，去好好学习吧！",
          energetic: "太好了！学习让我们变得更强！知识库里有超多有用的内容等着你！",
        };
        responseText = responses[personality];
      }
    } else {
      const generalResponses = {
        gentle: "我理解你的想法。让我们一步一步来，不要着急哦~ 💪",
        strict: "很好！保持这样的态度。记住，没有付出就没有收获！",
        energetic: "太棒了！你的热情让我也充满活力！让我们一起加油吧！🔥",
      };
      responseText = generalResponses[personality];
    }
    
    return { text: responseText, recommendation };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate AI response with voice
    setTimeout(() => {
      const { text, recommendation } = generateAIResponse(inputMessage);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "coach",
        text: text,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        recommendation: recommendation || undefined,
      };

      setMessages((prev) => [...prev, aiResponse]);
      
      // Simulate speaking animation
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000 + Math.random() * 1000);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("帮我生成一个训练计划");
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Digital Coach Avatar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Coach Avatar */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-white border border-blue-100 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              {/* Digital Human Avatar */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full aspect-square max-w-[280px]"
              >
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden relative">
                    {/* Avatar Face */}
                    <div className="text-[160px] relative">
                      {gender === "male" ? "👨‍💼" : "👩‍💼"}
                      
                      {/* Speaking Animation Indicator */}
                      <AnimatePresence>
                        {isSpeaking && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                            exit={{ scale: 0 }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                          >
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: ["8px", "16px", "8px"] }}
                                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                  className="w-1 bg-blue-500 rounded-full"
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  在线服务中
                </div>
              </motion.div>

              {/* Compact Settings */}
              <div className="w-full space-y-3 pt-4">
                {/* Gender Selection - Compact */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setGender("male")}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      gender === "male"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    👨 男教练
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      gender === "female"
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    👩 女教练
                  </button>
                </div>

                {/* Personality Selection - Compact */}
                <div className="flex gap-1.5 justify-center">
                  {personalities.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.value}
                        onClick={() => setPersonality(p.value as CoachPersonality)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                          personality === p.value
                            ? `bg-gradient-to-r ${p.color} text-white shadow-md`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 shadow-lg h-[calc(100vh-180px)] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI教练对话
              </h3>
              {isSpeaking && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>语音回复中...</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${message.sender === "coach" ? "space-y-2" : ""}`}>
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-5 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 shadow-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>

                    {/* Recommendation Card */}
                    {message.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card 
                          className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 cursor-pointer hover:shadow-lg transition-all group"
                          onClick={() => navigate(message.recommendation!.link)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{message.recommendation.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-0.5">
                                {message.recommendation.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {message.recommendation.description}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={isRecording ? "正在录音..." : "输入你的问题，或点击麦克风语音输入"}
                  className="flex-1"
                  disabled={isRecording}
                />
                <Button
                  onClick={handleVoiceInput}
                  variant={isRecording ? "default" : "outline"}
                  className={`${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isRecording}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setInputMessage("帮我生成一个训练计划")}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                >
                  💪 生成训练计划
                </button>
                <button
                  onClick={() => setInputMessage("我的训练数据怎么样？")}
                  className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-full text-sm transition-colors"
                >
                  📊 查看训练数据
                </button>
                <button
                  onClick={() => setInputMessage("如何正确做深蹲？")}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                >
                  📚 学习健身知识
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}