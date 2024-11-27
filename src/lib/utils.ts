export const item_per_page = 8;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  '/admin(.*)': ['admin'],
  '/student(.*)': ['student'],
  '/teacher(.*)': ['teacher'],
  '/parent(.*)': ['parent'],
  '/list/teachers': ['admin', 'teacher'],
  '/list/students': ['admin', 'teacher'],
  '/list/parents': ['admin', 'teacher'],
  '/list/subjects': ['admin'],
  '/list/classes': ['admin', 'teacher'],
  '/list/exams': ['admin', 'teacher', 'student', 'parent'],
  '/list/assignments': ['admin', 'teacher', 'student', 'parent'],
  '/list/results': ['admin', 'teacher', 'student', 'parent'],
  '/list/attendance': ['admin', 'teacher', 'student', 'parent'],
  '/list/events': ['admin', 'teacher', 'student', 'parent'],
  '/list/announcements': ['admin', 'teacher', 'student', 'parent'],
};

// export const role = 'admin';

// Helper function to delay execution
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  }
  if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  // const endOfWeek = new Date(startOfWeek);
  // endOfWeek.setDate(startOfWeek.getDate() + 4);
  // endOfWeek.setHours(23, 59, 59, 999);

  return startOfWeek;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfWeek);

    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);

    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};

export function generateClerkId() {
  const prefix = 'user_';
  const length = 27;
  let randomString = '';

  while (randomString.length < length) {
    randomString += Math.random().toString(36).substring(2);
  }

  randomString = randomString.substring(0, length);

  return `${prefix}${randomString}`;
}

const mockClerkAdmin1Id = generateClerkId();
console.log(mockClerkAdmin1Id); // Example output: user_2p9BLY9lnhr7cv4oZoJ9fHnedst

export const getButtonText = (
  isPending: boolean,
  type: 'create' | 'update'
) => {
  if (isPending) return `${type}ing...`;
  return `${type} teacher`;
};
