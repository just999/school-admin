import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Attendance, Lesson, Prisma, Student } from '@prisma/client';
import Image from 'next/image';

export type AttendanceListPageProps = Attendance & {
  // id: number;
  // title: string;
  // class: string;
  // date: string;
  student: Student;
  lesson: Lesson;
};

const renderRow = async (item: AttendanceListPageProps) => {
  const { role } = await getUserRoleAndId();

  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='hidden items-center gap-4 p-4 md:table-cell'>
        {new Intl.DateTimeFormat('en-US').format(item.date)}
      </td>
      <td>{item.present ? 'present' : 'absent'}</td>
      <td>{item.student?.name || '_'}</td>
      <td>{item.lesson?.name || '_'}</td>

      <td>
        <div className='flex items-center gap-2'>
          {/* <Link href={`/list/attendances/${item.id}`}>
            <button className='flex h-7 w-7 items-center justify-center rounded-full bg-babyBlue'>
              <Image
                src='/icons/update.png'
                alt='view'
                width={16}
                height={16}
              />
            </button>
          </Link> */}
          {role === 'admin' && (
            // <button className='flex h-7 w-7 items-center justify-center rounded-full bg-babyPurple'>
            //   <Image
            //     src='/icons/delete.png'
            //     alt='view'
            //     width={16}
            //     height={16}
            //   />
            // </button>
            <>
              <FormContainer table='attendance' type='update' data={item} />
              <FormContainer table='attendance' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const { page, ...queryParams } = resolvedSearchParams;
  const p = page ? parseInt(page) : 1;

  const { userId, role } = await getUserRoleAndId();

  const columns = [
    {
      header: 'Date ',
      accessor: 'date',
    },
    {
      header: 'Present ',
      accessor: 'present',
    },
    {
      header: 'Student',
      accessor: 'student',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Lessons',
      accessor: 'lessons',
      className: 'hidden lg:table-cell ',
    },
    ...(role === 'admin'
      ? [
          {
            header: 'Action',
            accessor: 'action',
          },
        ]
      : []),
  ];

  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.studentId = {
              contains: value,
              mode: 'insensitive',
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ?ROLE CONDITIONS
  // const roleConditions = {
  //   teacher: { lessons: { some: { teacher: { teacherClerkId: userId } } } },
  //   student: { students: { some: { studentClerkId: userId } } },
  //   parent: { students: { some: { parent: { parentClerkId: userId } } } },
  // };

  // query.OR = [
  //   { classId: null },
  //   { class: roleConditions[role as keyof typeof roleConditions] || {} },
  // ];

  const [data, count] = await db.$transaction([
    db.attendance.findMany({
      where: query,
      include: {
        student: true,
        lesson: true,
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.attendance.count({
      where: query,
    }),
  ]);
  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'>
          {' '}
          All Attendances
        </h1>
        <div className='flex w-full flex-col items-center gap-4 md:w-auto md:flex-row'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='flex h-8 w-8 items-center justify-center rounded-full bg-babyYellow'>
              <Image
                src='/icons/filter.png'
                alt='filter'
                width={14}
                height={14}
              />
            </button>
            <button className='flex h-8 w-8 items-center justify-center rounded-full bg-babyYellow'>
              <Image
                src='/icons/sort.png'
                alt='filter'
                width={14}
                height={14}
              />
            </button>
            {role === 'admin' && (
              // <button className='flex h-8 w-8 items-center justify-center rounded-full bg-babyYellow'>
              //   <Image
              //     src='/icons/plus.png'
              //     alt='filter'
              //     width={14}
              //     height={14}
              //   />
              // </button>
              <FormContainer table='attendance' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
