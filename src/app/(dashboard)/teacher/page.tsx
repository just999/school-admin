import Announcements from '@/components/announcements';
import BigCalendarContainer from '@/components/big-calendar-container';
import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';

import 'react-big-calendar/lib/css/react-big-calendar.css';

type TeacherPageProps = Record<string, unknown>;

const TeacherPage = async () => {
  const { userId, role } = await getUserRoleAndId();
  // const roleConditions = {
  //   teacher: {
  //     classes: {
  //       some: { lessons: { some: { teacher: { teacherClerkId: userId } } } },
  //     },
  //   },
  // };
  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  const newUserId = teacher?.id;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 xl:flex-row'>
      <div className='w-full xl:w-2/3'>
        <div className='h-full rounded-md bg-white p-4'>
          <h1 className='text-xl font-semibold'>Schedule </h1>
          {newUserId && (
            <BigCalendarContainer type='teacherId' id={newUserId} />
          )}
        </div>
      </div>
      <div className='w-fll flex h-full flex-col gap-8 xl:w-1/3'>
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
