import Image from 'next/image';
import EventCalendar from './event-calendar';
import EventList from './event-list';

type EventCalendarContainerProps = {
  searchParams: Promise<{
    [keys: string]: string | undefined;
  }>;
};

const EventCalendarContainer = async ({
  searchParams,
}: EventCalendarContainerProps) => {
  const { date } = await searchParams;
  return (
    <div className='rounded-md bg-white p-4'>
      <EventCalendar />
      <div className='flex items-center justify-between'>
        <h1 className='my-4 text-xl font-semibold'>Events</h1>
        <Image
          src='/icons/moreDark.png'
          alt='more-dark'
          width={20}
          height={20}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
