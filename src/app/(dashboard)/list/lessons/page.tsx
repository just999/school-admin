import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

export type LessonListPageProps = Lesson & {
  subject: Subject;
  // id: number;
  // subject: string;
  // class: string;
  // teacher: string;
} & { class: Class } & { teacher: Teacher };

const renderRow = async (item: LessonListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className='hidden md:table-cell'>
        {item.teacher.name + '' + item.teacher.surname}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {/* <Link href={`/list/lessons/${item.id}`}>
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
              <FormContainer table='lesson' type='update' data={item} />
              <FormContainer table='lesson' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const LessonListPage = async ({
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
    ...(role === 'admin'
      ? [
          {
            header: 'Action',
            accessor: 'action',
          },
        ]
      : []),
  ];
  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.classId = value;
            break;
          case 'teacherId':
            query.teacherId = value;
            break;
          case 'search':
            query.OR = [
              { subject: { name: { contains: value, mode: 'insensitive' } } },
              { teacher: { name: { contains: value, mode: 'insensitive' } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await db.$transaction([
    db.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.lesson.count({
      where: query,
    }),
  ]);
  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Lessons</h1>
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
              <FormContainer table='lesson' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;
