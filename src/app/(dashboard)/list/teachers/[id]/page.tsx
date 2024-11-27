import Announcements from '@/components/announcements';
import BigCalendarContainer from '@/components/big-calendar-container';
import FormContainer from '@/components/form-container';
import Performance from '@/components/performance';
import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { Teacher } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type TeacherSinglePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const TeacherSinglePage = async ({ params }: TeacherSinglePageProps) => {
  const { id } = await params;
  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await db.teacher.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });
  if (!teacher) return notFound();

  const { userId, role } = await getUserRoleAndId();
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 xl:flex-row'>
      <div className='w-full xl:w-2/3'>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='flex flex-1 gap-4 rounded-md bg-babyBlue px-4 py-6'>
            <div className='w-1/3'>
              <Image
                src={teacher.img || '/icons/noAvatar.png'}
                alt='teacher'
                width={144}
                height={144}
                className='h-36 w-36 rounded-full object-cover'
              />
            </div>
            <div className='flex w-2/3 flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>
                  {teacher.name + '' + teacher.surname}
                </h1>
                {role === 'admin' && (
                  <FormContainer table='teacher' type='update' data={teacher} />
                )}
              </div>
              <p className='text-sm text-gray-500'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste,
                beatae.
              </p>
              <div className='flex flex-wrap items-center justify-between gap-2 text-xs font-medium'>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/blood.png'
                    alt='blood'
                    width={14}
                    height={14}
                  />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/date.png'
                    alt='date'
                    width={14}
                    height={14}
                  />
                  <span className='text-nowrap'>
                    {new Intl.DateTimeFormat('en-GB').format(teacher.birthday)}
                  </span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/mail.png'
                    alt='mail'
                    width={14}
                    height={14}
                  />
                  <span>{teacher.email}</span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/phone.png'
                    alt='phone'
                    width={14}
                    height={14}
                  />
                  <span className='text-nowrap'>{teacher.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-1 flex-wrap justify-between gap-4'>
            <div className='flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src='/icons/singleAttendance.png'
                alt='singleAttendance'
                width={24}
                height={24}
                className='h-6 w-6'
              />
              <div>
                <h1 className='text-xl font-semibold'>90%</h1>
                <span className='text-sm text-gray-400'>Attendance</span>
              </div>
            </div>

            <div className='flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src='/icons/singleBranch.png'
                alt='singleBranch'
                width={24}
                height={24}
                className='h-6 w-6'
              />
              <div>
                <h1 className='text-xl font-semibold'>
                  {teacher._count.subjects}
                </h1>
                <span className='text-sm text-gray-400'>Branches</span>
              </div>
            </div>
            <div className='flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src='/icons/singleLesson.png'
                alt='singleLesson'
                width={24}
                height={24}
                className='h-6 w-6'
              />
              <div>
                <h1 className='text-xl font-semibold'>
                  {' '}
                  {teacher._count.lessons}
                </h1>
                <span className='text-sm text-gray-400'>Lessons</span>
              </div>
            </div>
            <div className='flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src='/icons/singleClass.png'
                alt='singleClass'
                width={24}
                height={24}
                className='h-6 w-6'
              />
              <div>
                <h1 className='text-xl font-semibold'>
                  {' '}
                  {teacher._count.classes}
                </h1>
                <span className='text-sm text-gray-400'>Classes</span>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 h-[800px] rounded-md bg-white p-4'>
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type='teacherId' id={teacher.id} />
        </div>
      </div>

      <div className='flex w-full flex-col gap-4 xl:w-1/3'>
        <div className='rounded-md bg-white p-4'>
          <h1 className='text-xl font-semibold'>Shortcuts</h1>
          <div className='mt-4 flex flex-wrap gap-4 text-xs text-gray-500'>
            <Link
              className='rounded-md bg-babyBlue p-3'
              href={`/list/classes?supervisorId=${'673df7b5930e117da850c7df'}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className='rounded-md bg-babyPurpleLight p-3'
              href={`/list/students?teacherId=${'673df7b4930e117da850c7d7'}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className='rounded-md bg-babyYellowLight p-3'
              href={`/list/lessons?teacherId=${'673df7b4930e117da850c7d7'}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className='rounded-md bg-pink-50 p-3'
              href={`/list/exams?teacherId=${'673df7b5930e117da850c7df'}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className='rounded-md bg-babyBlueLight p-3'
              href={`/list/assignments?teacherId=${'673df7b5930e117da850c7df'}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherSinglePage;
