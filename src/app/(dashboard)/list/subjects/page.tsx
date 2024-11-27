import FormContainer from '@/components/form-container';
import Pagination from '@/components/pagination';
import Table from '@/components/table';
import TableSearch from '@/components/table-search';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { item_per_page } from '@/lib/utils';
import { Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

export type SubjectListPageProps = Subject & {
  teachers: Teacher[];
};

const renderRow = async (item: SubjectListPageProps) => {
  const { role } = await getUserRoleAndId();
  return (
    <tr
      key={item.id}
      className='border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-babyPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.name}</td>
      <td className='hidden md:table-cell'>
        {item.teachers.map((teacher) => teacher.name).join(',')}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {role === 'admin' && (
            <>
              <FormContainer table='subject' type='update' data={item} />
              <FormContainer table='subject' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const { role } = await getUserRoleAndId();

  const columns = [
    {
      header: 'Subject Name',
      accessor: 'name',
    },
    {
      header: 'Teachers',
      accessor: 'teachers',
      className: 'hidden lg:table-cell ',
    },
    {
      header: 'Actions',
      accessor: 'actions',
    },
  ];
  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = {
              contains: value,
              mode: 'insensitive',
            };
            break;
        }
      }
    }
  }

  const [data, count] = await db.$transaction([
    db.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: item_per_page,
      skip: item_per_page * (p - 1),
    }),
    db.subject.count({
      where: query,
    }),
  ]);
  return (
    <div className='m-4 mt-0 flex-1 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden text-lg font-semibold md:block'> All Subjects</h1>
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
              <FormContainer table='subject' type='create' />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default SubjectListPage;
