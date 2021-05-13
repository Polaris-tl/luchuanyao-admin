import { Table, Tag, Space } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myGet } from '@/utils/request';
import st from './consult.less';

interface IConsult {
  companyName: string;
  companyScale: string;
  consultContent: string;
  email: string;
  id: string;
  name: string;
}
const Consult = () => {
  const columns: any = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render: (text: any, record: any, index: number) => `${index + 1}`, // 显示每一行的序号
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '邮件',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '公司名称',
      key: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '公司规模',
      dataIndex: 'companyScale',
      key: 'companyScale',
    },
    {
      title: '咨询事由',
      dataIndex: 'consultContent',
      key: 'consultContent',
    },
  ];
  const [data, setData] = useState<IConsult[]>([]);
  useEffect(() => {
    (async () => {
      const res = await myGet('/TechConsult/selectAll');
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
export default Consult;
