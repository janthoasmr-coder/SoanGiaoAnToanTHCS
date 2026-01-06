
import React from 'react';
import { LessonPlan, Activity } from '../types';

interface Props {
  lesson: LessonPlan;
}

const LessonPreview: React.FC<Props> = ({ lesson }) => {
  return (
    <div className="lesson-page bg-white p-12 shadow-2xl mx-auto max-w-[21cm] min-h-[29.7cm] font-serif text-[13pt] leading-relaxed border border-gray-300">
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-center uppercase font-bold text-sm">
        <div>
          <p>{lesson.school}</p>
          <p>Tổ: {lesson.department}</p>
        </div>
        <div>
          <p>KẾ HOẠCH BÀI DẠY</p>
          <p>Họ tên giáo viên: {lesson.teacherName}</p>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold uppercase">Tên bài dạy: {lesson.lessonName}</h1>
        <p className="mt-2 font-bold italic">Môn học: {lesson.subject}; Lớp: {lesson.grade}</p>
        <p className="font-bold italic">Thời gian thực hiện: {lesson.duration}</p>
      </div>

      {/* I. MỤC TIÊU */}
      <section className="mb-6">
        <h2 className="font-bold uppercase mb-2">I. MỤC TIÊU</h2>
        <div className="ml-4 space-y-2">
          <p className="font-bold">1. Kiến thức:</p>
          <p className="ml-4 whitespace-pre-wrap">{lesson.goals.knowledge.map(k => `- ${k}`).join('\n')}</p>
          
          <p className="font-bold">2. Năng lực:</p>
          <div className="ml-4 space-y-1">
            <p>- Năng lực riêng: {lesson.goals.competencies.math}</p>
            <p>- Năng lực chung: {lesson.goals.competencies.general}</p>
            <p className="font-bold italic">- Năng lực số (CV 3456):</p>
            {lesson.goals.competencies.digital.map((dc, i) => (
              <p key={i} className="ml-4">- Mã {dc.code} – {dc.name}: {dc.action}</p>
            ))}
          </div>

          <p className="font-bold">3. Phẩm chất:</p>
          <p className="ml-4">{lesson.goals.qualities.join(', ')}.</p>
        </div>
      </section>

      {/* II. THIẾT BỊ DẠY HỌC */}
      <section className="mb-6">
        <h2 className="font-bold uppercase mb-2">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h2>
        <p className="ml-4">{lesson.equipment}</p>
      </section>

      {/* III. TIẾN TRÌNH DẠY HỌC */}
      <section className="mb-6">
        <h2 className="font-bold uppercase mb-4">III. TIẾN TRÌNH DẠY HỌC</h2>

        {/* Hoạt động 1 */}
        <div className="mb-8">
          <h3 className="font-bold mb-2">1. HOẠT ĐỘNG KHỞI ĐỘNG</h3>
          <p className="ml-4">a) Mục tiêu: {lesson.activities.startup.objective}</p>
          <p className="ml-4">b) Nội dung: HS quan sát, thực hiện nhiệm vụ.</p>
          <p className="ml-4">c) Sản phẩm: Câu trả lời của HS.</p>
          <p className="ml-4 font-bold">d) Tổ chức thực hiện:</p>
          <div className="ml-8 text-sm">
            <p><span className="font-bold">Bước 1: Chuyển giao:</span> {lesson.activities.startup.steps.instruction}</p>
            <p><span className="font-bold">Bước 2: Thực hiện:</span> {lesson.activities.startup.steps.execution || 'HS hoạt động cá nhân/nhóm.'}</p>
            <p><span className="font-bold">Bước 3: Báo cáo:</span> {lesson.activities.startup.steps.discussion || 'GV gọi HS đại diện trả lời.'}</p>
            <p><span className="font-bold">Bước 4: Kết luận:</span> {lesson.activities.startup.steps.conclusion}</p>
          </div>
        </div>

        {/* Hoạt động 2 - Hình thành kiến thức (TABLE FORMAT) */}
        <div className="mb-8">
          <h3 className="font-bold mb-4">2. HÌNH THÀNH KIẾN THỨC MỚI</h3>
          {lesson.activities.knowledgeFormation.map((act, index) => (
            <div key={act.id} className="mb-6">
              <p className="font-bold mb-1 italic">Hoạt động {index + 1}: {act.title}</p>
              <p className="text-sm mb-1 ml-4">a) Mục tiêu: {act.objective}</p>
              <p className="text-sm mb-2 ml-4">d) Tổ chức thực hiện:</p>
              
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 w-1/2">HĐ CỦA GV VÀ HS</th>
                    <th className="border border-black p-2 w-1/2">SẢN PHẨM DỰ KIẾN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 align-top whitespace-pre-wrap">
                      <p className="font-bold">Bước 1: Chuyển giao</p>
                      {act.steps.instruction}
                      <p className="font-bold mt-2">Bước 2: Thực hiện</p>
                      {act.steps.execution}
                      <p className="font-bold mt-2">Bước 3: Báo cáo</p>
                      {act.steps.discussion}
                      <p className="font-bold mt-2">Bước 4: Kết luận</p>
                      {act.steps.conclusion}
                    </td>
                    <td className="border border-black p-2 align-top whitespace-pre-wrap">
                      {act.expectedProduct}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Hoạt động 3 - Luyện tập */}
        <div className="mb-8">
          <h3 className="font-bold mb-4 uppercase">3. HOẠT ĐỘNG LUYỆN TẬP</h3>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-1/2 uppercase">Tổ chức thực hiện</th>
                <th className="border border-black p-2 w-1/2 uppercase">Sản phẩm dự kiến</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 align-top whitespace-pre-wrap">
                   {lesson.activities.practice.steps.instruction}
                   <p className="mt-2 italic">Tổ chức: {lesson.activities.practice.steps.execution}</p>
                </td>
                <td className="border border-black p-2 align-top whitespace-pre-wrap">
                  {lesson.activities.practice.expectedProduct}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hoạt động 4 - Vận dụng */}
        <div className="mb-8">
          <h3 className="font-bold mb-4 uppercase">4. HOẠT ĐỘNG VẬN DỤNG</h3>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-1/2 uppercase">Nhiệm vụ giao về nhà</th>
                <th className="border border-black p-2 w-1/2 uppercase">Sản phẩm mong đợi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 align-top whitespace-pre-wrap">
                   {lesson.activities.application.steps.instruction}
                </td>
                <td className="border border-black p-2 align-top whitespace-pre-wrap">
                  {lesson.activities.application.expectedProduct}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Signature */}
      <div className="mt-12 grid grid-cols-2 text-center text-sm font-bold uppercase">
        <div>
          <p>DUYỆT CỦA TỔ TRƯỞNG</p>
          <p className="mt-16 font-normal italic">(Ký tên)</p>
        </div>
        <div>
          <p>GIÁO VIÊN BỘ MÔN</p>
          <p className="mt-16 font-normal italic">(Ký tên)</p>
        </div>
      </div>
    </div>
  );
};

export default LessonPreview;
