import { courses, type Course } from './mockData';
import { supabase } from './supabase';

const COURSE_PROGRESS_KEY = 'besteamhn-course-progress';
const CUSTOM_COURSES_KEY = 'besteamhn-custom-courses';
const DELETED_COURSES_KEY = 'besteamhn-deleted-courses';
const SHARED_COURSES_TABLE = 'app_courses';

export interface CourseProgress {
  courseId: string;
  completedModules: string[];
  gameCompleted: boolean;
  completedAt?: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('besteamhn-progress-updated'));
}

export function getCustomCourses(): Course[] {
  return readJson<Course[]>(CUSTOM_COURSES_KEY, []);
}

export function getDeletedCourseIds(): string[] {
  return readJson<string[]>(DELETED_COURSES_KEY, []);
}

export function saveCustomCourse(course: Course) {
  const customCourses = getCustomCourses();
  const next = [course, ...customCourses.filter((item) => item.id !== course.id)];
  writeJson(CUSTOM_COURSES_KEY, next);

  const deletedCourseIds = getDeletedCourseIds();
  if (deletedCourseIds.includes(course.id)) {
    writeJson(DELETED_COURSES_KEY, deletedCourseIds.filter((id) => id !== course.id));
  }
}

export async function saveSharedCourse(course: Course) {
  saveCustomCourse(course);

  const { error } = await supabase.from(SHARED_COURSES_TABLE).upsert({
    id: course.id,
    course,
    deleted: false,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn('No se pudo guardar el curso compartido en Supabase:', error.message);
  }
}

export function deleteCourse(courseId: string) {
  const customCourses = getCustomCourses().filter((course) => course.id !== courseId);
  const deletedCourseIds = getDeletedCourseIds();

  writeJson(CUSTOM_COURSES_KEY, customCourses);
  writeJson(DELETED_COURSES_KEY, Array.from(new Set([courseId, ...deletedCourseIds])));
}

export async function deleteSharedCourse(courseId: string) {
  deleteCourse(courseId);

  const { error } = await supabase.from(SHARED_COURSES_TABLE).upsert({
    id: courseId,
    course: null,
    deleted: true,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn('No se pudo eliminar el curso compartido en Supabase:', error.message);
  }
}

export function getAllCourses(): Course[] {
  const deletedCourseIds = new Set(getDeletedCourseIds());
  const customCourses = getCustomCourses().filter((course) => !deletedCourseIds.has(course.id));
  const customCourseIds = new Set(customCourses.map((course) => course.id));
  const baseCourses = courses.filter((course) => !deletedCourseIds.has(course.id) && !customCourseIds.has(course.id));

  return [...customCourses, ...baseCourses];
}

export async function getAllCoursesAsync(): Promise<Course[]> {
  const localCourses = getAllCourses();

  const { data, error } = await supabase
    .from(SHARED_COURSES_TABLE)
    .select('id, course, deleted')
    .order('updated_at', { ascending: false });

  if (error || !data) {
    if (error) console.warn('No se pudieron cargar cursos compartidos:', error.message);
    return localCourses;
  }

  const deletedIds = new Set(data.filter((row: any) => row.deleted).map((row: any) => row.id as string));
  const sharedCourses = data
    .filter((row: any) => !row.deleted && row.course)
    .map((row: any) => row.course as Course);
  const sharedIds = new Set(sharedCourses.map((course) => course.id));
  const merged = [
    ...sharedCourses,
    ...localCourses.filter((course) => !sharedIds.has(course.id) && !deletedIds.has(course.id)),
  ];

  writeJson(CUSTOM_COURSES_KEY, sharedCourses);
  writeJson(DELETED_COURSES_KEY, Array.from(deletedIds));

  return merged;
}

export function getCourseById(courseId: string): Course | undefined {
  return getAllCourses().find((course) => course.id === courseId);
}

export function getCourseProgress(): CourseProgress[] {
  return readJson<CourseProgress[]>(COURSE_PROGRESS_KEY, []);
}

export function getProgressForCourse(courseId: string): CourseProgress {
  return (
    getCourseProgress().find((item) => item.courseId === courseId) ?? {
      courseId,
      completedModules: [],
      gameCompleted: false,
    }
  );
}

export function saveProgressForCourse(progress: CourseProgress) {
  const allProgress = getCourseProgress();
  const next = [progress, ...allProgress.filter((item) => item.courseId !== progress.courseId)];
  writeJson(COURSE_PROGRESS_KEY, next);
}

export function getCourseModuleCount(course: Course) {
  return course.modules?.length ?? course.lessons;
}

export function getCompletedModuleCount(course: Course, progress: CourseProgress) {
  const moduleCount = getCourseModuleCount(course);
  if (course.modules?.length) return progress.completedModules.length;
  return Math.min(progress.completedModules.length, moduleCount);
}

export function getProgressPercent(course: Course, progress: CourseProgress) {
  const moduleCount = getCourseModuleCount(course);
  if (moduleCount === 0) return progress.gameCompleted ? 100 : 0;

  const modulePct = getCompletedModuleCount(course, progress) / moduleCount;
  const gameBonus = progress.gameCompleted ? 0.1 : 0;
  return Math.min(100, Math.round((modulePct + gameBonus) * 100));
}

export function getProfileProgressSummary() {
  const allCourses = getAllCourses();
  const allProgress = getCourseProgress();
  const completedActivities = allProgress.reduce(
    (total, progress) => total + progress.completedModules.length + (progress.gameCompleted ? 1 : 0),
    0,
  );
  const completedCourses = allCourses.filter((course) => {
    const progress = getProgressForCourse(course.id);
    return getProgressPercent(course, progress) >= 100 || !!progress.completedAt;
  });

  return {
    allCourses,
    completedActivities,
    completedCourses,
    coursesInProgress: allProgress.length,
  };
}
