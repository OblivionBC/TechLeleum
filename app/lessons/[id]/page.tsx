"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";
import MyBlocklyEditor from "@/components/blockly/BlocklyPlay";
import { learningTopics, TopicLesson, Topic } from "@/app/utils/learningMapData";
import { getToolboxForLesson, getLessonValidation } from "@/app/utils/lessons";

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<{ lesson: TopicLesson; topic: Topic } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    for (const topic of learningTopics) {
      const foundLesson = topic.lessons.find((l) => l.id === lessonId);
      if (foundLesson) {
        setLesson({ lesson: foundLesson, topic });
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Lesson not found</p>
          <button
            onClick={() => router.push("/lessons")}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => router.push("/lessons")}
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 mb-2 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Lessons
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{lesson.topic.icon}</span>
            <div>
              <h1 className="text-lg font-bold text-amber-900">{lesson.lesson.title}</h1>
              <p className="text-sm text-stone-600">{lesson.topic.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{lesson.lesson.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span>Lesson {lesson.topic.lessons.findIndex((l) => l.id === lessonId) + 1} of {lesson.topic.lessons.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Side - Lesson Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">About This Lesson</h2>
              <p className="text-stone-700 leading-relaxed">{lesson.lesson.description}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md p-6 border border-amber-200">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">Learning Goal</h2>
              <p className="text-stone-700 leading-relaxed">
                In this lesson, you'll learn to use Blockly blocks to create your first program. 
                Follow the instructions and experiment with different blocks to understand how they work together.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-stone-700 mb-4">
                <li>Drag blocks from the toolbox on the left into the workspace</li>
                <li>Connect blocks together to create a program</li>
                <li>Click "Run Code" to execute your program</li>
                <li>Check if your output matches the expected result below</li>
              </ol>
              
              {(() => {
                const validation = getLessonValidation(lessonId);
                if (validation) {
                  const expected = typeof validation.expectedOutput === 'string' 
                    ? validation.expectedOutput 
                    : validation.expectedOutput.join(', ');
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-amber-700" />
                        <h3 className="font-semibold text-amber-900 text-sm">Expected Output:</h3>
                      </div>
                      <p className="text-amber-800 text-sm font-mono bg-white px-3 py-2 rounded border border-amber-200">
                        {expected}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Right Side - Blockly Editor */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">Your Workspace</h2>
            <div className="border border-stone-200 rounded-lg overflow-hidden w-full flex-1" style={{ minHeight: '400px', maxHeight: '500px' }}>
              <MyBlocklyEditor 
                toolboxConfiguration={getToolboxForLesson(lessonId)} 
                lessonId={lessonId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
