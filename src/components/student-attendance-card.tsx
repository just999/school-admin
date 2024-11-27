import { db } from '@/lib/db';

type StudentAttendanceCardProps = {
  id: string;
};

const StudentAttendanceCard = async ({ id }: StudentAttendanceCardProps) => {
  const attendance = await db.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = (presentDays - totalDays) * 100;
  return (
    <div>
      <h1 className='text-xl font-semibold'>
        {percentage ? `${percentage}%` : '-'}
      </h1>
      <span className='text-sm text-gray-400'>Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
