
import React, { useState, useEffect } from 'react';
import { LessonPlan } from './types';
import LessonForm from './components/LessonForm';
import LessonPreview from './components/LessonPreview';
import { generateLessonContent } from './services/geminiService';

// Fix: Use the global AIStudio interface to avoid conflict with existing declarations and modifiers
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const initialLesson: LessonPlan = {
  school: "[Tên trường]",
  department: "[Tên tổ chuyên môn]",
  teacherName: "[Họ và tên giáo viên]",
  lessonName: "[Tên bài học]",
  subject: "Toán",
  grade: "6",
  duration: "2 tiết",
  goals: {
    knowledge: [],
    competencies: {
      math: "",
      general: "Tự chủ và tự học, giao tiếp and hợp tác, giải quyết vấn đề và sáng tạo.",
      digital: []
    },
    qualities: ["Chăm chỉ", "Trung thực", "Trách nhiệm"]
  },
  equipment: "SGK, Kế hoạch bài dạy, Máy tính, Tivi/Máy chiếu, Phần mềm (GeoGebra, Azota, Quizizz...), Phiếu học tập.",
  activities: {
    startup: {
      id: 'startup', title: 'Khởi động', objective: '', content: '', product: '', steps: { instruction: '', execution: '', discussion: '', conclusion: '' }, expectedProduct: ''
    },
    knowledgeFormation: [],
    practice: {
      id: 'practice', title: 'Luyện tập', objective: '', content: '', product: '', steps: { instruction: '', execution: '', discussion: '', conclusion: '' }, expectedProduct: ''
    },
    application: {
      id: 'application', title: 'Vận dụng', objective: '', content: '', product: '', steps: { instruction: '', execution: '', discussion: '', conclusion: '' }, expectedProduct: ''
    }
  }
};

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonPlan>(initialLesson);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    setHasApiKey(hasKey);
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    // Sau khi mở dialog, giả định người dùng đã chọn (tránh race condition)
    setHasApiKey(true);
  };

  const handleUpdate = (updated: LessonPlan) => {
    setLesson(updated);
  };

  const handleAIGenerate = async (topic: string, grade: string, subject: string) => {
    setIsGenerating(true);
    try {
      const data = await generateLessonContent(topic, grade, subject);
      
      const newLesson: LessonPlan = {
        ...lesson,
        lessonName: topic,
        grade,
        subject,
        goals: {
          ...lesson.goals,
          knowledge: data.knowledge || [],
          competencies: {
            ...lesson.goals.competencies,
            math: data.mathCompetency || "",
            digital: data.digitalCompetencies || []
          },
          qualities: data.qualities || []
        },
        equipment: data.equipment || lesson.equipment,
        activities: {
          startup: {
            ...lesson.activities.startup,
            objective: data.startup?.objective || "",
            steps: {
              instruction: data.startup?.instruction || "",
              execution: data.startup?.execution || "",
              discussion: data.startup?.discussion || "",
              conclusion: data.startup?.conclusion || "",
            }
          },
          knowledgeFormation: data.formation?.map((f: any, idx: number) => ({
            id: `form-${idx}`,
            title: f.title,
            objective: f.objective,
            steps: { instruction: f.instruction, execution: 'HS làm việc theo yêu cầu', discussion: 'Đại diện nhóm báo cáo', conclusion: 'GV chốt kiến thức' },
            expectedProduct: f.expectedProduct
          })) || [],
          practice: {
            ...lesson.activities.practice,
            objective: data.practice?.objective || "",
            steps: { instruction: data.practice?.instruction || "", execution: 'HS làm bài cá nhân', discussion: 'Đổi chéo kiểm tra', conclusion: 'GV nhận xét' },
            expectedProduct: data.practice?.expectedProduct || ""
          },
          application: {
            ...lesson.activities.application,
            objective: data.application?.objective || "",
            steps: { instruction: data.application?.instruction || "", execution: 'Thực hiện tại nhà', discussion: 'Báo cáo vào tiết sau', conclusion: 'GV đánh giá' },
            expectedProduct: data.application?.expectedProduct || ""
          }
        }
      };
      setLesson(newLesson);
    } catch (err: any) {
      if (err.message === "API_KEY_NOT_FOUND") {
        alert("API Key của bạn không khả dụng hoặc đã hết hạn. Vui lòng thiết lập lại.");
        setHasApiKey(false);
      } else {
        alert("Có lỗi xảy ra khi tạo giáo án: " + err.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-indigo-100">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Yêu cầu API Key</h1>
          <p className="text-gray-600 mb-8">Để bảo mật và sử dụng hạn mức riêng, vui lòng chọn API Key của bạn từ Google AI Studio.</p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200"
          >
            Thiết lập API Key cá nhân
          </button>
          <p className="mt-4 text-xs text-gray-400">
            Khóa của bạn được lưu cục bộ và không được gửi đi bất cứ đâu ngoài máy chủ Google.
          </p>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block mt-4 text-sm text-indigo-500 hover:underline">Tìm hiểu về phí và thanh toán</a>
        </div>
      </div>
    );
  }

  if (hasApiKey === null) return null; // Loading state

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-700 text-white shadow-lg p-4 sticky top-0 z-50 no-print">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            S-Planner 5512/3456
          </h1>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 mr-4 border-r pr-4 border-indigo-500">
              <button onClick={() => setActiveTab('form')} className={`px-3 py-1.5 rounded-lg text-sm transition ${activeTab === 'form' ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}>Soạn thảo</button>
              <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-lg text-sm transition ${activeTab === 'preview' ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}>Xem trước</button>
            </div>
            <button 
              onClick={handleSelectKey}
              className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-indigo-400"
              title="Đổi API Key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Đổi Key
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Xuất PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        {activeTab === 'form' ? (
          <LessonForm lesson={lesson} onUpdate={handleUpdate} onAIGenerate={handleAIGenerate} isGenerating={isGenerating} />
        ) : (
          <LessonPreview lesson={lesson} />
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 p-4 text-center text-sm no-print">
        <p>&copy; 2024 - Công cụ hỗ trợ giáo viên soạn thảo giáo án chuẩn 5512 & 3456</p>
      </footer>
    </div>
  );
};

export default App;
