import Announcements from '@/components/announcements';
import AttendanceChartContainer from '@/components/attendance-chart-container';
import CountChartContainer from '@/components/count-chart-container';
import EventCalendarContainer from '@/components/event-calendar-container';
import FinanceChart from '@/components/finance-chart';
import UserCard from '@/components/user-card';

type AdminPageProps = {
  searchParams: Promise<{
    [keys: string]: string | undefined;
  }>;
};

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  return (
    <div className='flex flex-col gap-4 p-4 md:flex-row'>
      <div className='flex w-full flex-col gap-8 lg:w-2/3'>
        <div className='flex flex-wrap justify-between gap-4'>
          <UserCard type='admin' />
          <UserCard type='teacher' />
          <UserCard type='student' />
          <UserCard type='parent' />
        </div>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='h-[450px] w-full lg:w-1/3'>
            <CountChartContainer />
          </div>
          <div className='h-[450px] w-full lg:w-2/3'>
            <AttendanceChartContainer />
          </div>
        </div>
        <div className='h-[500px] w-full'>
          <FinanceChart />
        </div>
      </div>
      <div className='w-fll flex h-full flex-col gap-8 lg:w-1/3'>
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
