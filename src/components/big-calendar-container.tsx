import { db } from '@/lib/db';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import BigCalendar from './big-calendar';

type BigCalendarContainerProps = {
  type: 'teacherId' | 'classId';
  id: string;
};

const BigCalendarContainer = async ({
  type,
  id,
}: BigCalendarContainerProps) => {
  const dataRes = await db.lesson.findMany({
    where: {
      ...(type === 'teacherId'
        ? { teacherId: id as string }
        : { classId: id as string }),
    },
  });
  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);
  return (
    <div>
      <BigCalendar data={schedule} />{' '}
    </div>
  );
};

export default BigCalendarContainer;
