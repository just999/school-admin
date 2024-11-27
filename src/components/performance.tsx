'use client';

import Image from 'next/image';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

type PerformanceProps = {};

const data = [
  { name: 'Group A', value: 92, fill: '#c3ebfa' },
  { name: 'Group B', value: 8, fill: '#fae27c' },
];

const Performance = () => {
  return (
    <div className='relative h-80 rounded-md bg-white p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Performance</h1>
        <Image
          src='/icons/moreDark.png'
          alt='more dark'
          width={16}
          height={16}
        />
      </div>

      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            dataKey='value'
            startAngle={180}
            endAngle={0}
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={70}
            fill='#8884d8'
            // label
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center'>
        <h1 className='text-3xl font-bold'>9.2</h1>
        <p className='text-nowrap text-xs text-gray-300'>of 10</p>
      </div>
      <h2 className='absolute bottom-16 left-0 right-0 m-auto text-center font-medium'>
        1st Semester - 2nd Semester
      </h2>
    </div>
  );
};

export default Performance;