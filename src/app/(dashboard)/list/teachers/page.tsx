import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Class, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';

export type TeacherListPageProps = Teacher & {
  subjects: Subject[];
} & { classes: Class[] };

const renderRow = async (item: TeacherListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>
        <Image
          src={item.img || '/icons/noAvatar.png'}
          alt='photo'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full object-cover md:hidden xl:block'
        />
        <div className='flex flex-col'>
          <h3 className='font-semibold'>{item.name}</h3>
          <p className='to-gray-500 text-xs'>{item?.email}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>{item.username}</td>
      <td className='hidden md:table-cell'>
        {item.subjects.map((subject) => subject.name).join(',')}
      </td>
      <td className='hidden md:table-cell'>
        {item.classes.map((cl) => cl.name).join(',')}
      </td>
      <td className='hidden md:table-cell'>{item.phone}</td>
      <td className='hidden md:table-cell'>{item.address}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link href={`/list/teachers/${item.id}`}>
            <button className='flex h-7 w-7 items-center justify-center rounded-full bg-babyBlue'>
              <Image src='/icons/view.png' alt='view' width={16} height={16} />
            </button>
          </Link>
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
              {/* <FormContainer table='teacher' type='update' data={item} /> */}
              <FormContainer table='teacher' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, ...queryParams } = await searchParams;
  z;
  const p = page ? parseInt(page) : 1;

  const { role } = await getUserRoleAndId();

  const columns = [
    {
      header: 'Info',
      accessor: 'info',
    },
    {
      header: 'Teacher ID',
      accessor: 'teacherId',
      className: 'hidden md:table-cell ',
    },
    {
      header: 'Subjects',
      accessor: 'subjects',
      className: 'hidden md:table-cell ',
    },
    {
      header: 'Classes',
      accessor: 'classes',
      className: 'hidden md:table-cell ',
    },
    {
      header: 'Phone',
      accessor: 'phone',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Address',
      accessor: 'address',
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

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lessons = {
              some: {
                classId: value,
              },
            };
            break;
          case 'search':
            query.name = {
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

  const [data, count] = await db.$transaction([
    db.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.teacher.count({
      where: query,
    }),
  ]);
  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Teachers</h1>
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
              <FormContainer table='teacher' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
