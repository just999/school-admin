import Announcements from '@/components/announcements';
import BigCalendarContainer from '@/components/big-calendar-container';
import EventCalendar from '@/components/event-calendar';
import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';

import 'react-big-calendar/lib/css/react-big-calendar.css';

type StudentPageProps = Record<string, unknown>;

const StudentPage = async () => {
  const { userId } = await getUserRoleAndId();
  const student = await db.student.findFirst({
    where: {
      studentClerkId: userId,
    },
  });
  const newStudentId = student?.id;

  const classItem = await db.class.findMany({
    where: {
      students: { some: { id: newStudentId } },
    },
  });
  return (
    <div className='flex flex-col gap-4 p-4 xl:flex-row'>
      <div className='w-full xl:w-2/3'>
        <div className='h-full rounded-md bg-white p-4'>
          <h1 className='text-xl font-semibold'>Schedule (4A)</h1>
          {classItem && (
            <BigCalendarContainer type='classId' id={classItem[0].id} />
          )}
        </div>
      </div>
      <div className='w-fll flex h-full flex-col gap-8 xl:w-1/3'>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
