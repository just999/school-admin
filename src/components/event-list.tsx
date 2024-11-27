import { db } from '@/lib/db';

type EventListProps = {
  dateParam: string | undefined;
};

const EventList = async ({ dateParam }: EventListProps) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await db.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  return data.map((e, i) => (
    <div
      key={e.id}
      className='rounded-md border border-t-4 border-gray-100 p-5 odd:border-t-babyPurple even:border-t-babyBlue'
    >
      <div className='flex items-center justify-between'>
        <h1 className='font-semibold text-gray-600'>{e.title}</h1>
        <span className='text-xs text-gray-300'>
          {e.startTime.toLocaleDateString('en-UK', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>
      </div>
      <p className='mt-2 text-sm text-gray-400'>{e.description}</p>
    </div>
  ));
};

export default EventList;
