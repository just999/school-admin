import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { ResultListPageProps } from '@/types';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

const renderRow = async (item: ResultListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.title}</td>

      <td>{item.studentName + '' + item.studentSurname}</td>
      <td className='hidden md:table-cell'>{item.score}</td>
      <td className='hidden md:table-cell'>
        {item.teacherName + '' + item.teacherSurname}
      </td>
      <td className='hidden md:table-cell'>{item.className}</td>
      <td className='hidden md:table-cell'>
        {' '}
        {new Intl.DateTimeFormat('en-US').format(item.startTime)}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {(role === 'admin' || role === 'teacher') && (
            <>
              <FormContainer table='result' type='update' data={item} />
              <FormContainer
                table='result'
                type='delete'
                id={item.id.toString()}
              />
            </>
          )}
        </div>
      </td>
      {/* <pre>{JSON.stringify(item.title, null, 2)}</pre> */}
    </tr>
  );
};
const ResultListPage = async ({
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
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Student',
      accessor: 'student',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Score',
      accessor: 'score',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Teacher',
      accessor: 'teacher',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Class',
      accessor: 'class',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Date',
      accessor: 'date',
      className: 'hidden lg:table-cell ',
    },
    ...(role === 'admin' || role === 'teacher'
      ? [
          {
            header: 'Action',
            accessor: 'action',
          },
        ]
      : []),
  ];

  const query: Prisma.ResultWhereInput = {};
  query.exam = {};
  query.student = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.student.studentClerkId = value;
            break;
          case 'search':
            query.OR = [
              { exam: { title: { contains: value, mode: 'insensitive' } } },
              { student: { name: { contains: value, mode: 'insensitive' } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { exam: { lesson: { teacher: { teacherClerkId: userId } } } },
        { assignment: { lesson: { teacher: { teacherClerkId: userId } } } },
      ];
      break;

    case 'student':
      query.student.studentClerkId = userId;
      break;

    case 'parent':
      query.student = {
        parent: { parentClerkId: userId },
      };
      break;

    default:
      break;
  }

  const [dataRes, count] = await db.$transaction([
    db.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.result.count({
      where: query,
    }),
  ]);
  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;
    const isExam = 'startTime' in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Results</h1>
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
            {(role === 'admin' || role === 'teacher') && (
              <FormContainer table='result' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
