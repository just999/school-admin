import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Class, Event, Prisma } from '@prisma/client';
import Image from 'next/image';

export type EventListPageProps = Event & {
  class: Class;
};

const renderRow = async (item: EventListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.title}</td>
      <td>{item.class?.name || '-'}</td>
      <td className='hidden md:table-cell'>
        {new Intl.DateTimeFormat('en-US').format(item.startTime)}
      </td>
      <td className='hidden md:table-cell'>
        {item.startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </td>
      <td className='hidden md:table-cell'>
        {item.endTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {/* <Link href={`/list/events/${item.id}`}>
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
              <FormContainer table='event' type='update' data={item} />
              <FormContainer table='event' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
const EventListPage = async ({
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
      header: 'Class',
      accessor: 'class',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Start Time',
      accessor: 'startTime',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'End Time',
      accessor: 'endTime',
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

  const query: Prisma.EventWhereInput = {};
  query.class = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = {
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

  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { classId: null },
        {
          class: { lessons: { some: { teacher: { teacherClerkId: userId } } } },
        },
      ];
      break;
    case 'student':
      query.OR = [
        { classId: null },
        {
          class: { students: { some: { studentClerkId: userId } } },
        },
      ];
      break;
    case 'parent':
      query.OR = [
        { classId: null },
        {
          class: { students: { some: { parent: { parentClerkId: userId } } } },
        },
      ];
      break;
    default:
      break;
  }

  const [data, count] = await db.$transaction([
    db.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.event.count({
      where: query,
    }),
  ]);
  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Events</h1>
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
              <FormContainer table='event' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventListPage;
