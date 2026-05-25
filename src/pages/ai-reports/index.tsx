import React, { useState } from "react";
import { useTheme } from "../../contexts";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Download,
  Share2,
  TrendingUp,
  AlertTriangle,
  Users,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { cn } from "../../utils/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIReportsPage() {
  const { tokens } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an AI Sales Analyst for an Inquiry Distribution System. 
        Analyze the following request and provide a detailed report based on the company's sales data (simulated).
        
        Request: ${prompt}
        
        Provide the report in a professional markdown format with sections for:
        1. Executive Summary
        2. Key Performance Indicators
        3. Distribution Efficiency
        4. Recommendations for Improvement`,
      });

      setReport(response.text || "Failed to generate report.");
    } catch (error) {
      console.error("Error generating report:", error);
      setReport(
        "An error occurred while generating the report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          Powered by Gemini AI
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: tokens.text }}
        >
          AI Reporting System
        </h1>
        <p
          className="text-sm max-w-lg mx-auto"
          style={{ color: tokens.textSec }}
        >
          Generate intelligent sales reports, analyze distribution patterns, and
          get actionable insights using advanced AI.
        </p>
      </div>

      <div
        className="p-6 rounded-2xl border shadow-xl shadow-blue-500/5"
        style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <textarea
              placeholder="Ask me to 'Analyze sales performance for last month' or 'Identify bottlenecks in inquiry distribution'..."
              className="w-full pl-4 pr-12 py-4 rounded-xl border outline-none transition-all min-h-[100px] resize-none"
              style={{
                backgroundColor: tokens.bg,
                borderColor: tokens.border,
                color: tokens.text,
              }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={generateReport}
              disabled={loading || !prompt.trim()}
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Monthly Performance",
            "Distribution Bottlenecks",
            "Agent Efficiency",
            "Inquiry Trends",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() =>
                setPrompt(`Generate a report on ${suggestion.toLowerCase()}`)
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-opacity-10"
              style={{
                backgroundColor: tokens.borderLight,
                borderColor: tokens.border,
                color: tokens.textSec,
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {report && (
        <div
          className="p-8 rounded-2xl border animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          }}
        >
          <div
            className="flex items-center justify-between mb-8 pb-4 border-b"
            style={{ borderColor: tokens.border }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: tokens.text }}>
                  AI Generated Analysis
                </h3>
                <p className="text-xs" style={{ color: tokens.textMuted }}>
                  Generated just now
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-lg hover:bg-opacity-10"
                style={{
                  color: tokens.textSec,
                  backgroundColor: tokens.borderLight,
                }}
              >
                <Download size={18} />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-opacity-10"
                style={{
                  color: tokens.textSec,
                  backgroundColor: tokens.borderLight,
                }}
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            style={{ color: tokens.textSec }}
          >
            {report.split("\n").map((line, i) => {
              if (line.startsWith("#")) {
                return (
                  <h3
                    key={i}
                    className="text-lg font-bold mt-6 mb-2"
                    style={{ color: tokens.text }}
                  >
                    {line.replace(/#/g, "").trim()}
                  </h3>
                );
              }
              if (line.startsWith("-") || line.startsWith("*")) {
                return (
                  <li key={i} className="ml-4 mb-1">
                    {line.substring(1).trim()}
                  </li>
                );
              }
              return (
                <p key={i} className="mb-4">
                  {line}
                </p>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
            <TrendingUp className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-600">AI Insight</p>
              <p className="text-xs" style={{ color: tokens.textSec }}>
                Based on current trends, increasing distribution to Agent 2
                could improve closure rates by 15% due to their high efficiency
                with Website inquiries.
              </p>
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div
            className="p-6 rounded-2xl border text-center space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h4 className="font-bold text-sm" style={{ color: tokens.text }}>
              Identify Risks
            </h4>
            <p className="text-xs" style={{ color: tokens.textSec }}>
              AI automatically flags unassigned inquiries and performance drops.
            </p>
          </div>
          <div
            className="p-6 rounded-2xl border text-center space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
              <TrendingUp size={24} />
            </div>
            <h4 className="font-bold text-sm" style={{ color: tokens.text }}>
              Predict Trends
            </h4>
            <p className="text-xs" style={{ color: tokens.textSec }}>
              Forecast inquiry volume for the next week based on historical
              data.
            </p>
          </div>
          <div
            className="p-6 rounded-2xl border text-center space-y-3"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-sm" style={{ color: tokens.text }}>
              Team Optimization
            </h4>
            <p className="text-xs" style={{ color: tokens.textSec }}>
              Get recommendations on how to balance workload across your team.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
