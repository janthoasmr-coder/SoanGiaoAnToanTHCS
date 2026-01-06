
export interface DigitalCompetency {
  id: string;
  code: string;
  name: string;
  action: string;
}

export interface Activity {
  id: string;
  title: string;
  objective: string;
  content: string;
  product: string;
  steps: {
    instruction: string; // Bước 1
    execution: string;   // Bước 2
    discussion: string;  // Bước 3
    conclusion: string;  // Bước 4
  };
  expectedProduct: string; // Column 2 in the table
  digitalComps?: DigitalCompetency[];
}

export interface LessonPlan {
  school: string;
  department: string;
  teacherName: string;
  lessonName: string;
  subject: string;
  grade: string;
  duration: string;
  goals: {
    knowledge: string[];
    competencies: {
      math: string;
      general: string;
      digital: DigitalCompetency[];
    };
    qualities: string[];
  };
  equipment: string;
  activities: {
    startup: Activity;
    knowledgeFormation: Activity[];
    practice: Activity;
    application: Activity;
  };
}
