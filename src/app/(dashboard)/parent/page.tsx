import Announcements from '@/components/announcements';
import BigCalendarContainer from '@/components/big-calendar-container';
import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const ParentPage = async () => {
  const { userId } = await getUserRoleAndId();

  const parent = await db.parent.findFirst({
    where: {
      parentClerkId: userId,
    },
  });

  const students = await db.student.findMany({
    where: {
      parentId: parent?.id,
    },
  });

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 xl:flex-row'>
      {students.map((student, i) => (
        <div className='w-full xl:w-2/3' key={student.id}>
          <div className='h-full rounded-md bg-white p-4'>
            <h1 className='text-xl font-semibold'>Schedule (Students name)</h1>
            <BigCalendarContainer type='classId' id={student.classId} />
          </div>
        </div>
      ))}
      <div className='w-fll flex h-full flex-col gap-8 xl:w-1/3'>
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
