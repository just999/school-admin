import Announcements from '@/components/announcements';
import BigCalendarContainer from '@/components/big-calendar-container';
import FormContainer from '@/components/form-container';
import Performance from '@/components/performance';
import StudentAttendanceCard from '@/components/student-attendance-card';
import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { Class, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type StudentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const StudentDetailPage = async ({ params }: StudentDetailPageProps) => {
  const { id } = await params;
  const student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
      })
    | null = await db.student.findUnique({
    where: {
      id,
    },
    include: {
      class: {
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });
  if (!student) return notFound();

  const { userId, role } = await getUserRoleAndId();
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 xl:flex-row'>
      <div className='w-full xl:w-2/3'>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='flex flex-1 gap-4 rounded-md bg-babyBlue px-4 py-6'>
            <div className='w-1/3'>
              <Image
                src={student.img || '/icons/noAvatar.png'}
                alt='student'
                width={144}
                height={144}
                className='h-36 w-36 rounded-full object-cover'
              />
            </div>
            <div className='flex w-2/3 flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>
                  {student.name + '' + student.surname}
                </h1>
                {role === 'admin' && (
                  <FormContainer table='student' type='update' data={student} />
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
                  <span>{student.bloodType}</span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/date.png'
                    alt='date'
                    width={14}
                    height={14}
                  />
                  <span className='text-nowrap'>
                    {new Intl.DateTimeFormat('en-GB').format(student.birthday)}
                  </span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/mail.png'
                    alt='mail'
                    width={14}
                    height={14}
                  />
                  <span>{student.email}</span>
                </div>
                <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                  <Image
                    src='/icons/phone.png'
                    alt='phone'
                    width={14}
                    height={14}
                  />
                  <span className='text-nowrap'>{student.phone || '-'}</span>
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
              <Suspense fallback='loading...'>
                <StudentAttendanceCard id={student.id} />
              </Suspense>
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
                  {student.class.name.charAt(0)}th
                </h1>
                <span className='text-sm text-gray-400'>Grade</span>
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
                  {student.class._count.lessons}
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
                <h1 className='text-xl font-semibold'>{student.class.name}</h1>
                <span className='text-sm text-gray-400'>Class</span>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 h-[800px] rounded-md bg-white p-4'>
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type='classId' id={student.class.id} />
        </div>
      </div>

      <div className='flex w-full flex-col gap-4 xl:w-1/3'>
        <div className='rounded-md bg-white p-4'>
          <h1 className='text-xl font-semibold'>Shortcuts</h1>
          <div className='mt-4 flex flex-wrap gap-4 text-xs text-gray-500'>
            <Link
              className='rounded-md bg-babyBlue p-3'
              href={`/list/lessons?classId=${'673df7b2930e117da850c7c7'}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className='rounded-md bg-babyPurpleLight p-3'
              href={`/list/teachers?classId=${'673df7b2930e117da850c7c7'}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className='rounded-md bg-pink-50 p-3'
              href={`/list/exams?classId=${'673df7b2930e117da850c7c9'}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className='rounded-md bg-babyBlueLight p-3'
              href={`/list/assignments?classId=${'673df7b2930e117da850c7c7'}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className='rounded-md bg-babyBlueLight p-3'
              href={`/list/results?studentId=${id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentDetailPage;
