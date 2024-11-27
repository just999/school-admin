'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

type EventCalendarProps = {};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// const events = [
//   {
//     id: 1,
//     title: 'Lorem ipsum dolor',
//     time: '12:00 PM - 2:00 PM',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
//   {
//     id: 2,
//     title: 'Lorem ipsum dolor',
//     time: '12:00 PM - 2:00 PM',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
//   {
//     id: 3,
//     title: 'Lorem ipsum dolor',
//     time: '12:00 PM - 2:00 PM',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
// ];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toLocaleDateString('en-US')}`);
    }
  }, [value, router]);

  return (
    // <div className='rounded-md bg-white p-4'>
    //   <Calendar onChange={onChange} value={value} />
    //   <div className='flex items-center justify-between'>
    //     <h1 className='my-4 text-xl font-semibold'>Events</h1>
    //     <Image
    //       src='/icons/moreDark.png'
    //       alt='more-dark'
    //       width={20}
    //       height={20}
    //     />
    //   </div>
    //   <div className='flex flex-col gap-4'>
    //     {events.map((e, i) => (
    //       <div
    //         key={e.id}
    //         className='rounded-md border border-t-4 border-gray-100 p-5 odd:border-t-babyPurple even:border-t-babyBlue'
    //       >
    //         <div className='flex items-center justify-between'>
    //           <h1 className='font-semibold text-gray-600'>{e.title}</h1>
    //           <span className='text-xs text-gray-300'>{e.time}</span>
    //         </div>
    //         <p className='mt-2 text-sm text-gray-400'>{e.description}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <Calendar onChange={onChange} value={value} />
  );
};

export default EventCalendar;
