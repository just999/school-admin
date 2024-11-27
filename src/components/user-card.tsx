import { db } from '@/lib/db';
import Image from 'next/image';

type UserCardProps = {
  type: 'admin' | 'teacher' | 'student' | 'parent';
};

const UserCard = async ({ type }: UserCardProps) => {
  const modelMap: Record<typeof type, any> = {
    admin: db.admin,
    teacher: db.teacher,
    student: db.student,
    parent: db.parent,
  };

  const data = await modelMap[type].count();
  return (
    <div className='min-w-[130px] flex-1 rounded-2xl p-4 odd:bg-babyPurple even:bg-babyYellow'>
      <div className='flex items-center justify-between'>
        <span className='rounded-full bg-white px-2 py-1 text-[10px] text-emerald-600'>
          2024/25
        </span>
        <Image src='/icons/more.png' alt='more' width={20} height={20} />
      </div>
      <h1 className='my-4 text-2xl font-semibold'>{data}</h1>
      <h2 className='text-sm font-medium capitalize text-gray-500'>{type}s</h2>
    </div>
  );
};

export default UserCard;
