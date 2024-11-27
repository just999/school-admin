type TableProps = {
  columns: {
    header: string;
    accessor: string;
    className?: string;
  }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
};

const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className='mt-4 w-full'>
      <thead>
        <tr className='text-left text-sm text-gray-500'>
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          return renderRow(item);
        })}

        {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
      </tbody>
    </table>
  );
};

export default Table;
