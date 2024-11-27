import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

export type ExamListPageProps = Exam & {
  // id: number;
  // subject: string;
  // class: string;
  // teacher: string;
  // date: string;
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const renderRow = async (item: ExamListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>
        {item.lesson.subject.name}
      </td>
      <td>{item.lesson.class.name}</td>
      <td className='hidden md:table-cell'>
        {item.lesson.teacher.name + '' + item.lesson.teacher.surname}
      </td>
      <td className='hidden md:table-cell'>
        {new Intl.DateTimeFormat('en-US').format(item.startTime)}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {/* <Link href={`/list/exams/${item.id}`}>
            <button className='flex h-7 w-7 items-center justify-center rounded-full bg-babyBlue'>
              <Image
                src='/icons/update.png'
                alt='view'
                width={16}
                height={16}
              />
            </button>
          </Link> */}
          {(role === 'admin' || role === 'teacher') && (
            // <button className='flex h-7 w-7 items-center justify-center rounded-full bg-babyPurple'>
            //   <Image
            //     src='/icons/delete.png'
            //     alt='view'
            //     width={16}
            //     height={16}
            //   />
            // </button>
            <>
              <FormContainer table='exam' type='update' data={item} />
              <FormContainer table='exam' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
const ExamListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { userId, role } = await getUserRoleAndId();

  const columns = [
    {
      header: 'Subject Name',
      accessor: 'subject',
    },
    {
      header: 'Class',
      accessor: 'class',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Teacher',
      accessor: 'teacher',
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

  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};
  query.lesson.teacher = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson.classId = value;
            break;
          case 'teacherId':
            query.lesson.teacherId = value;
            break;
          case 'search':
            query.lesson.subject = {
              name: { contains: value, mode: 'insensitive' },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // !ROLE CONDITIONS
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.lesson.teacher.teacherClerkId = userId;
      break;
    case 'student':
      query.lesson.class = {
        students: {
          some: {
            studentClerkId: userId,
          },
        },
      };
      break;
    case 'parent':
      query.lesson.class = {
        students: {
          some: {
            parent: {
              parentClerkId: userId,
            },
          },
        },
      };
      break;
    default:
      break;
  }

  const [data, count] = await db.$transaction([
    db.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.exam.count({
      where: query,
    }),
  ]);

  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Exams</h1>
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
              // <button className='flex h-8 w-8 items-center justify-center rounded-full bg-babyYellow'>
              //   <Image
              //     src='/icons/plus.png'
              //     alt='filter'
              //     width={14}
              //     height={14}
              //   />
              // </button>
              <FormContainer table='exam' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamListPage;
