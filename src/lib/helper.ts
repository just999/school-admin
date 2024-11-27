export const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/icons/home.png',
        label: 'Home',
        href: '/',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/teacher.png',
        label: 'Teachers',
        href: '/list/teachers',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/icons/student.png',
        label: 'Students',
        href: '/list/students',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/icons/parent.png',
        label: 'Parents',
        href: '/list/parents',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/icons/subject.png',
        label: 'Subjects',
        href: '/list/subjects',
        visible: ['admin'],
      },
      {
        icon: '/icons/class.png',
        label: 'Classes',
        href: '/list/classes',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/icons/lesson.png',
        label: 'Lessons',
        href: '/list/lessons',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/icons/exam.png',
        label: 'Exams',
        href: '/list/exams',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/assignment.png',
        label: 'Assignments',
        href: '/list/assignments',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/result.png',
        label: 'Results',
        href: '/list/results',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/attendance.png',
        label: 'Attendance',
        href: '/list/attendances',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/calendar.png',
        label: 'Events',
        href: '/list/events',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/message.png',
        label: 'Messages',
        href: '/list/messages',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/announcement.png',
        label: 'Announcements',
        href: '/list/announcements',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: '/icons/profile.png',
        label: 'Profile',
        href: '/profile',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/setting.png',
        label: 'Settings',
        href: '/settings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/icons/logout.png',
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

type CountChartDataProps = {
  boys: number;
  girls: number;
};

export const countChartData = ({ boys, girls }: CountChartDataProps) => [
  {
    name: 'Total',
    count: boys + girls,
    fill: 'white',
  },
  {
    name: 'Girls',
    count: girls,
    fill: '#FAE27C',
  },
  {
    name: 'Boys',
    count: boys,
    fill: '#C3EBFA',
  },
];

export const attendanceData = [
  {
    name: 'Mon',
    present: 90,
    absent: 10,
  },
  {
    name: 'Tues',
    present: 95,
    absent: 5,
  },
  {
    name: 'Wed',
    present: 94,
    absent: 6,
  },
  {
    name: 'Thurs',
    present: 87,
    absent: 13,
  },
  {
    name: 'Fri',
    present: 79,
    absent: 21,
  },
];
export const weekDay = [
  {
    name: 'Monday',
    value: 'MONDAY',
  },
  {
    name: 'Tuesday',
    value: 'TUESDAY',
  },
  {
    name: 'Wednesday',
    value: 'WEDNESDAY',
  },
  {
    name: 'Thursday',
    value: 'THURSDAY',
  },
  {
    name: 'Friday',
    value: 'FRIDAY',
  },
];
