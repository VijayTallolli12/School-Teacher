import apiClient from '../utils/axios';
import {
  ExamListResponse,
  ExamDetailResponse,
  ExamScheduleResponse,
  ExamClassesResponse,
  ExamSubjectsResponse,
  MarksResponse,
  SaveMarksResponse,
  PublishResultResponse,
  MarksPayload,
  ExamItem,
  ExamDetail,
  TeacherClass,
} from '../types';

interface ApiExamItem {
  id: number;
  exam_name: string;
  exam_type: string;
  exam_date: string;
  subject: { id: number; name: string };
  class_section: { id: number; class: string; section: string };
  maximum_marks: number;
  pass_marks: number;
  status: string;
  is_published: boolean;
}

interface ApiExamStudent {
  student_id: number;
  uuid: string;
  admission_no: string;
  full_name: string;
  roll_no: string;
  result: {
    id: number;
    marks_obtained: number;
    grade: string;
    status: string;
    remarks: string | null;
  } | null;
}

interface ApiExamDetailData {
  exam: ApiExamItem;
  students: ApiExamStudent[];
  total_students: number;
  results_submitted: number;
}

function mapExamItem(item: ApiExamItem): ExamItem {
  return {
    id: String(item.id),
    name: item.exam_name,
    subject: item.subject.name,
    className: item.class_section.class,
    section: item.class_section.section,
    date: item.exam_date,
    duration: 0,
    totalMarks: item.maximum_marks,
    status: item.status as ExamItem['status'],
    resultPublished: item.is_published,
    marksEntered: false,
  };
}

function mapExamDetail(data: ApiExamDetailData): ExamDetail {
  const scores = data.students
    .filter((s) => s.result)
    .map((s) => s.result!.marks_obtained);
  const passed = scores.filter((s) => s >= 40).length;
  const totalWithResult = scores.length;
  return {
    ...mapExamItem(data.exam),
    schedule: [],
    resultSummary: {
      totalStudents: data.total_students,
      appeared: totalWithResult,
      passed,
      failed: totalWithResult - passed,
      passPercentage: totalWithResult > 0 ? Math.round((passed / totalWithResult) * 100) : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    },
    marksEntryStatus:
      data.results_submitted === 0
        ? 'pending'
        : data.results_submitted < data.total_students
          ? 'partial'
          : 'completed',
  };
}

export const examsApi = {
  async getExams(): Promise<ExamListResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiExamItem[];
    }>('/api/v1/teacher/exams');
    return { data: response.data.data.map(mapExamItem) };
  },

  async getExamDetail(examId: string): Promise<ExamDetailResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: ApiExamDetailData;
    }>(`/api/v1/teacher/exams/${examId}`);
    return { data: mapExamDetail(response.data.data) };
  },

  async getExamSchedule(examId: string): Promise<ExamScheduleResponse> {
    const response = await apiClient.get<ExamScheduleResponse>(
      `/api/v1/teacher/exams/${examId}/schedule`
    );
    return response.data;
  },

  async getExamClasses(): Promise<ExamClassesResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { classes: { id: number; class: string; section: string }[] };
    }>('/api/v1/teacher/classes');
    return {
      data: (response.data.data.classes ?? []).map((c) => ({
        id: String(c.id),
        name: c.class,
        section: c.section,
      })),
    };
  },

  async getExamSubjects(): Promise<ExamSubjectsResponse> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: { subjects: { id: number; name: string; code: string }[] };
    }>('/api/v1/teacher/classes');
    return {
      data: (response.data.data.subjects ?? []).map((s) => ({
        id: String(s.id),
        name: s.name,
        code: s.code,
      })),
    };
  },

  async getMarks(examId: string, classId: string, subjectId: string): Promise<MarksResponse> {
    const response = await apiClient.get<MarksResponse>(
      `/api/v1/teacher/exams/${examId}/marks`,
      { params: { classId, subjectId } }
    );
    return response.data;
  },

  async saveMarks(payload: MarksPayload): Promise<SaveMarksResponse> {
    const response = await apiClient.post<SaveMarksResponse>(
      `/api/v1/teacher/exams/${payload.examId}/marks`,
      {
        results: payload.marks.map((m) => ({
          student_id: m.studentId,
          marks_obtained: m.marks,
          remarks: m.remarks,
        })),
        publish: !payload.isDraft,
      }
    );
    return response.data;
  },

  async publishResultsStatus(examId: string): Promise<PublishResultResponse> {
    const response = await apiClient.post<PublishResultResponse>(
      `/api/v1/teacher/exams/${examId}/publish`
    );
    return response.data;
  },
};
