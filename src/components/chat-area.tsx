"use client"

import {
  ChevronDown,
  Settings,
  Upload,
  Lightbulb,
  FileText,
  ImageIcon,
  Mic,
  ArrowUp,
  Paperclip,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { ParticleOrb } from "@/components/particle-orb"

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-black/40 border border-border/40 rounded-2xl px-4 py-3">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
          <div
            className="w-2 h-2 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  )
}

export function ChatArea() {
  const [isRecording, setIsRecording] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [configDropdownOpen, setConfigDropdownOpen] = useState(false)
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState<{
    id: string,
    role: "user" | "assistant"
    content: string
  }[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const startRecording = async () => {
  if (isRecording) return;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  streamRef.current = stream;

  const mediaRecorder = new MediaRecorder(stream);

  audioChunksRef.current = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  mediaRecorder.start();

  mediaRecorderRef.current = mediaRecorder;
  setIsRecording(true);
};

const cancelRecording = () => {

  mediaRecorderRef.current?.stop();

  streamRef.current?.getTracks().forEach(track =>
    track.stop()
  );

  streamRef.current = null;

  audioChunksRef.current = [];

  setIsRecording(false);
};

const sendQuickQuestion = (question: string) => {

  setTimeout(() => {
    sendMessage(question);
  }, 100);
};

  const hasStartedChat = messages.length > 0

  const sendMessage = async (customText?: string) => {
    const text = customText ?? input;
    if (!text.trim()) return; 

  setMessages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    },
  ]);

  setInput("");
  setIsThinking(true);

  try {
    const isEnglish = /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(text);

if (isEnglish) {
  setIsThinking(true)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setMessages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "કૃપા કરીને તમારો પ્રશ્ન ગુજરાતીમાં પૂછો.",
    },
  ]);
  return;
}
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      },
    ]);
  } catch (error) {
    console.error(error);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "હું હાલમાં માત્ર ગુજરાતી ભાષામાં પ્રશ્નોના જવાબ આપી શકું છું. કૃપા કરીને તમારો પ્રશ્ન ગુજરાતીમાં લખો.",
      },
    ]);
  } finally {
    setIsThinking(false);
  }
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages, isThinking])

const stopRecording = async () => {
  if (!mediaRecorderRef.current) return;

  mediaRecorderRef.current.stop();

  mediaRecorderRef.current.onstop = async () => {

  streamRef.current?.getTracks().forEach(track =>
    track.stop()
  );

  streamRef.current = null;

  const audioBlob = new Blob(
    audioChunksRef.current,
    {
      type: "audio/webm",
    }
  );

  await sendAudio(audioBlob);
};

  setIsRecording(false);
};

const sendAudio = async (audioBlob: Blob) => {
  try {

    const formData = new FormData();

    formData.append(
      "audio",
      audioBlob,
      "recording.webm"
    );

    const response = await fetch(
      `${API_URL}/speech`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Speech API failed");
    }

    const data = await response.json();

    setInput(data.transcript);

  } catch (error) {
    console.error(error);

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "માફ કરશો, અવાજ પ્રોસેસ કરવામાં ભૂલ આવી.",
      }
    ]);

  } finally {
    setIsThinking(false);
  }
};

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      {/* Animated gradient orbs for shader effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.15] grid-background" />

      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/30">
        <div className="relative">
          <Button
            className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm border border-border/30 shadow-lg"
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          >
            GuWiki v1
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-hidden px-6">
        {!hasStartedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <ParticleOrb />
            </div>

            <h1 className="text-4xl font-semibold text-foreground mb-8 text-center">
              ગુજરાતી વિકિપીડિયા
            </h1>
            <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
              60M+ Speakers. One Knowledge Base.
            </h3>
          </div>
        ) : (
          <div
            className="
    w-full
    max-w-4xl
    mx-auto
    flex-1
    min-h-0
    overflow-y-auto
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
  "
          >
            <div className="px-0 pt-6 pb-24 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={`
              max-w-[80%]
              rounded-2xl
              px-4
              py-3
              whitespace-pre-wrap
              shadow-xl
              ${message.role === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-cyan-700"
                        : "bg-zinc-900 border border-zinc-800"
                      }
            `}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isThinking && <ThinkingBubble />}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="w-full max-w-4xl mx-auto shrink-0 py-4">
          {isRecording && (
            <div className="mb-3 input-3d bg-gradient-to-r from-black/90 via-black/95 to-black/90 backdrop-blur-xl rounded-full border border-border/50 px-6 py-3 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex items-center justify-between gap-6">
                {/* Left: Recording indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <p className="text-sm font-medium text-foreground">Recording...</p>
                </div>

                {/* Center: Voice wave animation spanning full width */}
                <div className="flex-1 flex items-center justify-center gap-[2px] h-10 overflow-hidden">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className="voice-wave-bar-horizontal bg-foreground/70 rounded-full shrink-0"
                      style={{
                        width: "2px",
                        animationDelay: `${-i * 0.03}s`,
                        animationDirection: "reverse",
                      }}
                    />
                  ))}
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-8 w-8 rounded-full bg-secondary/30 hover:bg-destructive/20 text-white hover:text-destructive"
                    onClick={cancelRecording}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="btn-3d btn-glow h-8 w-8 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black hover:from-gray-900 hover:to-black text-white shadow-xl"
                    onClick={stopRecording}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="input-3d bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  //     
                  placeholder="ગુજરાતી વિકિપીડિયાને પૂછો..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-slate-100 placeholder:text-slate-500 text-lg min-h-[80px] font-medium"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                    onClick={()=> sendQuickQuestion("સરદાર વલ્લભભાઈ પટેલ વિશે જણાવો.")}
                  >
                    સરદાર વલ્લભભાઈ પટેલ વિશે જણાવો.
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                    onClick={()=> sendQuickQuestion("સાબરમતી આશ્રમ ક્યાં આવેલું છે?")}
                  >
                    સાબરમતી આશ્રમ ક્યાં આવેલું છે?
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                    onClick={()=> sendQuickQuestion("નર્મદા નદી વિશે માહિતી આપો.")}
                  >
                  નર્મદા નદી વિશે માહિતી આપો.
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-9 w-9 text-white hover:text-foreground"
                    onClick={startRecording}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => sendMessage()}
                    className="btn-3d btn-glow h-9 w-9 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black text-white"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}