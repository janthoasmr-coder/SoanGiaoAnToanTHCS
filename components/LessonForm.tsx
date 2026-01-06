
import React, { useState } from 'react';
import { LessonPlan, Activity, DigitalCompetency } from '../types';

interface Props {
  lesson: LessonPlan;
  onUpdate: (lesson: LessonPlan) => void;
  onAIGenerate: (topic: string, grade: string, subject: string) => void;
  isGenerating: boolean;
}

const LessonForm: React.FC<Props> = ({ lesson, onUpdate, onAIGenerate, isGenerating }) => {
  const [topicPrompt, setTopicPrompt] = useState('');

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...lesson, [field]: value });
  };

  const handleGoalChange = (subField: string, value: any) => {
    onUpdate({
      ...lesson,
      goals: { ...lesson.goals, [subField]: value }
    });
  };

  const handleActivityChange = (type: string, id: string | null, field: string, value: any) => {
    const updatedActivities = { ...lesson.activities };
    if (type === 'formation') {
      updatedActivities.knowledgeFormation = updatedActivities.knowledgeFormation.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      );
    } else {
      (updatedActivities as any)[type] = { ...(updatedActivities as any)[type], [field]: value };
    }
    onUpdate({ ...lesson, activities: updatedActivities });
  };

  const addFormationActivity = () => {
    const newAct: Activity = {
      id: `form-${Date.now()}`,
      title: `Hoạt động ${lesson.activities.knowledgeFormation.length + 1}`,
      objective: '',
      content: '',
      product: '',
      steps: { instruction: '', execution: '', discussion: '', conclusion: '' },
      expectedProduct: ''
    };
    handleActivityChange('formation_list', null, 'knowledgeFormation', [...lesson.activities.knowledgeFormation, newAct]);
    onUpdate({
      ...lesson,
      activities: {
        ...lesson.activities,
        knowledgeFormation: [...lesson.activities.knowledgeFormation, newAct]
      }
    });
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* AI Assistant Tool */}
      <section className="bg-indigo-50 p-6 rounded-lg border-2 border-dashed border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-800 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Trợ lý AI Soạn giáo án
        </h3>
        <p className="text-sm text-indigo-600 mb-4">Nhập chủ đề bài học để AI gợi ý nội dung chuẩn 5512 và các mã năng lực số 3456.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ví dụ: Phép nhân và phép chia hai số nguyên"
            className="flex-1 border-gray-300 border p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
          />
          <button 
            disabled={isGenerating || !topicPrompt}
            onClick={() => onAIGenerate(topicPrompt, lesson.grade, lesson.subject)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang tạo...
              </>
            ) : "Tạo giáo án"}
          </button>
        </div>
      </section>

      {/* Basic Info */}
      <section>
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Trường</label>
            <input 
              type="text" value={lesson.school} 
              onChange={(e) => handleChange('school', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tổ chuyên môn</label>
            <input 
              type="text" value={lesson.department} 
              onChange={(e) => handleChange('department', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giáo viên</label>
            <input 
              type="text" value={lesson.teacherName} 
              onChange={(e) => handleChange('teacherName', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên bài học</label>
            <input 
              type="text" value={lesson.lessonName} 
              onChange={(e) => handleChange('lessonName', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lớp</label>
            <input 
              type="text" value={lesson.grade} 
              onChange={(e) => handleChange('grade', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời lượng (Số tiết)</label>
            <input 
              type="text" value={lesson.duration} 
              onChange={(e) => handleChange('duration', e.target.value)}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
        </div>
      </section>

      {/* I. Mục tiêu */}
      <section>
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">I. Mục tiêu</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bold">1. Kiến thức</label>
            <textarea 
              rows={3}
              value={lesson.goals.knowledge.join('\n')}
              onChange={(e) => handleGoalChange('knowledge', e.target.value.split('\n'))}
              placeholder="Mỗi yêu cầu một dòng..."
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bold">2. Năng lực chuyên môn (Toán học)</label>
            <textarea 
              rows={3}
              value={lesson.goals.competencies.math}
              onChange={(e) => handleGoalChange('competencies', { ...lesson.goals.competencies, math: e.target.value })}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bold">3. Phẩm chất</label>
            <textarea 
              rows={2}
              value={lesson.goals.qualities.join(', ')}
              onChange={(e) => handleGoalChange('qualities', e.target.value.split(',').map(s => s.trim()))}
              className="mt-1 w-full border-gray-300 border p-2 rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Activities: Dynamic and Detailed */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">III. Tiến trình dạy học</h2>
        
        {/* Startup Activity */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-bold text-lg mb-4 text-indigo-700">1. Hoạt động Khởi động</h3>
          <div className="grid grid-cols-1 gap-4">
            <textarea 
              placeholder="Mục tiêu khởi động..."
              value={lesson.activities.startup.objective}
              onChange={(e) => handleActivityChange('startup', null, 'objective', e.target.value)}
              className="w-full border p-2 rounded h-20"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <textarea 
                  placeholder="Bước 1: Chuyển giao..."
                  value={lesson.activities.startup.steps.instruction}
                  onChange={(e) => handleActivityChange('startup', null, 'steps', { ...lesson.activities.startup.steps, instruction: e.target.value })}
                  className="border p-2 rounded h-24 text-sm"
               />
               <textarea 
                  placeholder="Bước 4: Kết luận..."
                  value={lesson.activities.startup.steps.conclusion}
                  onChange={(e) => handleActivityChange('startup', null, 'steps', { ...lesson.activities.startup.steps, conclusion: e.target.value })}
                  className="border p-2 rounded h-24 text-sm"
               />
            </div>
          </div>
        </div>

        {/* Formation Activities */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-indigo-700">2. Hình thành kiến thức mới</h3>
            <button 
              onClick={addFormationActivity}
              className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1"
            >
              + Thêm đơn vị kiến thức
            </button>
          </div>
          
          {lesson.activities.knowledgeFormation.map((act, index) => (
            <div key={act.id} className="bg-white p-4 rounded-lg border-2 border-indigo-100 space-y-3">
              <input 
                value={act.title}
                onChange={(e) => handleActivityChange('formation', act.id, 'title', e.target.value)}
                className="font-bold w-full border-none focus:ring-0 text-indigo-800"
              />
              <textarea 
                placeholder="Mục tiêu HĐ..."
                value={act.objective}
                onChange={(e) => handleActivityChange('formation', act.id, 'objective', e.target.value)}
                className="w-full border p-2 rounded text-sm h-16"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea 
                  placeholder="Tổ chức thực hiện (Cột 1: Bước 1, 2, 3...)"
                  value={act.steps.instruction}
                  onChange={(e) => handleActivityChange('formation', act.id, 'steps', { ...act.steps, instruction: e.target.value })}
                  className="w-full border p-2 rounded text-sm h-32"
                />
                <textarea 
                  placeholder="Sản phẩm dự kiến (Cột 2: Nội dung vở ghi/đáp án...)"
                  value={act.expectedProduct}
                  onChange={(e) => handleActivityChange('formation', act.id, 'expectedProduct', e.target.value)}
                  className="w-full border p-2 rounded text-sm h-32 bg-yellow-50"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LessonForm;
