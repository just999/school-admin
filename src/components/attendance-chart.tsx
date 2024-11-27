'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type AttendanceChartProps = {
  data: {
    name: string;
    present: number;
    absent: number;
  }[];
};

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <ResponsiveContainer width='100%' height='90%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        // margin={{
        //   top: 5,
        //   right: 30,
        //   left: 20,
        //   bottom: 5,
        // }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#ddd' />
        <XAxis
          dataKey='name'
          axisLine={false}
          tick={{ fill: '#d1d5db' }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }}
        />
        <Legend
          align='left'
          verticalAlign='top'
          wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
        />
        <Bar
          dataKey='present'
          fill='#fae27c'
          activeBar={<Rectangle fill='#fae27c' stroke='blue' />}
          legendType='circle'
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey='absent'
          fill='#c3ebfa'
          activeBar={<Rectangle fill='#c3ebfa' stroke='purple' />}
          legendType='circle'
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
