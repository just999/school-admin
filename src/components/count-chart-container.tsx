import { db } from '@/lib/db';
import Image from 'next/image';
import CountChart from './count-chart';

type CountChartContainerProps = {};

const CountChartContainer = async () => {
  const data = await db.student.groupBy({
    by: ['sex'],
    _count: true,
  });
  const boys = data.find((d, i) => d.sex === 'MALE')?._count || 0;
  const girls = data.find((d, i) => d.sex === 'FEMALE')?._count || 0;

  return (
    <div className='h-full w-full rounded-xl bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Students</h1>
        <Image src='/icons/moreDark.png' alt='more' width={20} height={20} />
      </div>
      <div className='relative h-[75%] w-full'>
        <CountChart boys={boys} girls={girls} />
      </div>
      <div className='flex justify-center gap-16'>
        <div className='flex flex-col gap-1'>
          <div className='h-5 w-5 rounded-full bg-babyBlue' />
          <h1 className='font-bold'>{boys}</h1>
          <h2 className='text-xs text-gray-300'>
            Boys ({Math.round((boys / (boys + girls)) * 100)})
          </h2>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='h-5 w-5 rounded-full bg-babyYellow' />
          <h1 className='font-bold'>{girls}</h1>
          <h2 className='text-xs text-gray-300'>
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
