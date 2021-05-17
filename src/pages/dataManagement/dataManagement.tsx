import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myGet } from '@/utils/request';
import st from './dataManagement.less';

interface IConsult {
  companyName: string;
  companyScale: string;
  consultContent: string;
  email: string;
  id: string;
  name: string;
}
const DataManagement = () => {
  const columns: any = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render: (text: any, record: any, index: number) => `${index + 1}`, // 显示每一行的序号
    },
    {
      title: '页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: '近一年度访问（次）',
      dataIndex: 'countByYear',
      key: 'countByYear',
    },
    {
      title: '上一季度访问（次）',
      dataIndex: 'countByQuarter',
      key: 'countByQuarter',
    },
    {
      title: '上一月度访问（次）',
      key: 'countByMonth',
      dataIndex: 'countByMonth',
    },
    {
      title: '上一周访问（次）',
      dataIndex: 'countByWeek',
      key: 'countByWeek',
    },
    {
      title: '今日点击访问',
      dataIndex: 'countToday',
      key: 'countToday',
    },
  ];

  const [data, setData] = useState<IConsult[]>([]);
  useEffect(() => {
    (async () => {
      // const res = await myGet('/VisitRecord/selectAll');
      const res = await myGet('/VisitRecord/statisticsVisitCount');
      setData(res.map((item: any) => {
        const res: any = {}
        for(const key in item){
          res.pageName = key
          res.countByYear = item[key].selectLastYear
          res.countByQuarter = item[key].selectLastQuarter
          res.countByMonth = item[key].selectLastMonth
          res.countByWeek = item[key].selectLastWeek
          res.countToday = item[key].selectCurrentDay
        }
        return res
      }));
    })();
  }, []);
  return (
    <div>
      <div className={st.main}>
        <Table columns={columns} dataSource={data} bordered />
      </div>
    </div>
  );
};
export default DataManagement;
