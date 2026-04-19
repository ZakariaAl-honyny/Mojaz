"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, Timer, CheckCircle2, XCircle, ChevronRight, Bookmark, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What does this traffic sign indicate?",
    options: ["Stop completely", "Yield to traffic", "Speed limit 50", "No parking"],
    correctAnswer: 0,
  },
  {
    id: 2,
    text: "In a roundabout, who has the right of way?",
    options: ["Vehicles entering", "Vehicles already inside", "The fastest vehicle", "Large trucks"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "When should you use your high beams?",
    options: ["In heavy fog", "In well-lit tunnels", "On dark open roads without oncoming traffic", "In city centers"],
    correctAnswer: 2,
  }
];

export function TheoryTestSimulator({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations("theory");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    if (selectedAnswer === SAMPLE_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-2xl flex items-center justify-center p-6 font-arabic rtl">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-3 space-y-4">
           <Card className="bg-white/5 border border-white/10 rounded-[2rem] p-6 gov-gloss">
              <div className="flex flex-col items-center gap-4 text-center">
                 <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,108,53,0.4)]">
                    <Timer className="w-8 h-8 text-white" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Time Remaining</p>
                    <p className="text-3xl font-black text-white font-mono tracking-tighter">{formatTime(timeLeft)}</p>
                 </div>
              </div>
           </Card>

           <Card className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
              <div className="space-y-6">
                 <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-neutral-500">
                    <span>Progress</span>
                    <span className="text-white">{currentQuestion + 1} / {SAMPLE_QUESTIONS.length}</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                       className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                       initial={{ width: 0 }}
                       animate={{ width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                    />
                 </div>
                 <div className="grid grid-cols-5 gap-2">
                    {SAMPLE_QUESTIONS.map((_, i) => (
                       <div 
                        key={i} 
                        className={cn(
                          "h-1 rounded-full bg-white/5 transition-all duration-500",
                          i <= currentQuestion ? "bg-primary-500 shadow-[0_0_8px_rgba(0,108,53,0.5)]" : ""
                        )} 
                       />
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
              {!isFinished ? (
                 <motion.div 
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <Card className="gov-glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                       <CardContent className="p-12 space-y-12">
                          <div className="flex justify-between items-start gap-8">
                             <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                   <div className="px-4 py-1.5 rounded-xl bg-primary-600/20 border border-primary-500/30 text-[10px] font-black text-primary-400 uppercase tracking-widest">
                                      Part 1: Traffic Rules
                                   </div>
                                    <button className="text-neutral-500 hover:text-white transition-colors">
                                       <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight font-arabic tracking-tight">
                                   {SAMPLE_QUESTIONS[currentQuestion].text}
                                </h2>
                             </div>
                             {SAMPLE_QUESTIONS[currentQuestion].image && (
                                <div className="w-64 h-48 bg-white/5 rounded-3xl border border-white/10 animate-pulse" />
                             )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                             {SAMPLE_QUESTIONS[currentQuestion].options.map((option, idx) => (
                                <button
                                   key={idx}
                                   onClick={() => setSelectedAnswer(idx)}
                                   className={cn(
                                      "group relative p-8 rounded-[1.5rem] border text-start transition-all duration-500",
                                      selectedAnswer === idx 
                                         ? "bg-primary-600 border-primary-400 shadow-[0_12px_24px_rgba(0,108,53,0.3)]"
                                         : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                   )}
                                >
                                   <div className="flex items-center gap-6">
                                      <div className={cn(
                                         "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-500",
                                         selectedAnswer === idx ? "bg-white text-primary-600" : "bg-white/10 text-neutral-500"
                                      )}>
                                         {String.fromCharCode(65 + idx)}
                                      </div>
                                      <span className={cn(
                                         "text-xl font-bold transition-all",
                                         selectedAnswer === idx ? "text-white" : "text-neutral-400"
                                      )}>
                                         {option}
                                      </span>
                                   </div>
                                   {selectedAnswer === idx && (
                                      <motion.div 
                                         layoutId="option-ring"
                                         className="absolute -inset-px rounded-[1.5rem] border-2 border-primary-300/50" 
                                      />
                                   )}
                                </button>
                             ))}
                          </div>

                          <div className="flex justify-end pt-8 border-t border-white/5">
                             <Button 
                                onClick={handleAnswer}
                                disabled={selectedAnswer === null}
                                className="h-16 px-12 rounded-[1.2rem] bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(0,108,53,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                             >
                                {currentQuestion === SAMPLE_QUESTIONS.length - 1 ? "Finish Test" : "Next Question"}
                                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                 </motion.div>
              ) : (
                 <motion.div 
                    key="results"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-12 py-12"
                 >
                    <div className="relative mx-auto w-40 h-40">
                       <div className={cn(
                          "w-full h-full rounded-[3rem] flex items-center justify-center shadow-2xl transition-all duration-1000",
                          score >= 2 ? "bg-primary-600 shadow-primary-900/50" : "bg-red-600 shadow-red-900/50"
                       )}>
                          {score >= 2 ? <CheckCircle2 className="w-20 h-20 text-white" /> : <XCircle className="w-20 h-20 text-white" />}
                       </div>
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 border-2 border-dashed border-white/10 rounded-[4rem]"
                       />
                    </div>

                    <div className="space-y-4">
                       <h2 className="text-4xl font-black text-white tracking-tighter">
                          {score >= 2 ? "MARSHALL APPROVED" : "INSUFFICIENT SCORE"}
                       </h2>
                       <p className="text-xl text-neutral-400 font-bold uppercase tracking-[0.2em]">
                          Final Score: {score} out of {SAMPLE_QUESTIONS.length}
                       </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-md mx-auto">
                       <p className="text-neutral-400 leading-relaxed mb-8">
                          {score >= 2 
                             ? "Congratulations! You have demonstrated exceptional knowledge of traffic laws. You are now eligible to schedule your practical driving test."
                             : "Unfortunately, you did not meet the minimum score required. Please review the manual and attempt the simulator again."}
                       </p>
                       <Button 
                          onClick={() => onComplete(score)}
                          className="h-16 px-12 rounded-[1.2rem] bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest transition-all w-full"
                       >
                          Return to Portal
                          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                       </Button>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
