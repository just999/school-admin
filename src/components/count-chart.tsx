'use client';

import Image from 'next/image';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

type CountChartProps = {
  boys: number;
  girls: number;
};

const CountChart = ({ boys, girls }: CountChartProps) => {
  const countChartData = [
    {
      name: 'Total',
      count: boys + girls,
      fill: 'white',
    },
    {
      name: 'Girls',
      count: girls,
      fill: '#FAE27C',
    },
    {
      name: 'Boys',
      count: boys,
      fill: '#C3EBFA',
    },
  ];
  return (
    // <div className='h-full w-full rounded-xl bg-white p-4'>
    //   <div className='flex items-center justify-between'>
    //     <h1 className='text-lg font-semibold'>Students</h1>
    //     <Image src='/icons/moreDark.png' alt='more' width={20} height={20} />
    //   </div>
    <div className='relative h-[75%] w-full'>
      <ResponsiveContainer>
        <RadialBarChart
          cx='50%'
          cy='50%'
          innerRadius='40%'
          outerRadius='100%'
          barSize={32}
          data={countChartData}
        >
          <RadialBar
            // minAngle={15}
            // label={{ position: 'insideStart', fill: '#fff' }}
            background
            // clockWise
            dataKey='count'
          />
          {/* <Legend
              iconSize={10}
              layout='vertical'
              verticalAlign='middle'
              // wrapperStyle={style}
            /> */}
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src='/icons/maleFemale.png'
        alt='maleFemale'
        width={50}
        height={50}
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      />
    </div>
  );
};

export default CountChart;
