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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '近一年度访问（次）',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '上一季度访问（次）',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '上一月度访问（次）',
      key: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '上一周访问（次）',
      dataIndex: 'companyScale',
      key: 'companyScale',
    },
    {
      title: '今日点击访问',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  const [data, setData] = useState<IConsult[]>([]);
  useEffect(() => {
    (async () => {
      const res = await myGet('/VisitRecord/selectAll');
      setData(res);
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
