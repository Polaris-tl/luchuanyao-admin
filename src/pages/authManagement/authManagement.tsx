import { Table, Button, Popover, Input, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myGet } from '@/utils/request';
import st from './authManagement.less';

interface IConsult {
  companyName: string;
  companyScale: string;
  consultContent: string;
  email: string;
  id: string;
  name: string;
}
const DataManagement = () => {
  // 删除用户事件
  const confirmDeleteUser = async (id: string) => {
    const res = await myGet('/User/deleteById', { id });
    if (res) {
      const res2 = await myGet('/User/selectAll');
      setData(res2);
    }
  };
  // 修改
  const updateAuth = async (id: string, password: string) => {
    const res = await myPost('/User/update', {
      id,
      password,
    });
    if (res) {
      const res2 = await myGet('/User/selectAll');
      setData(res2);
      document.body.click();
    }
  };
  const columns: any = [
    {
      title: '网站子页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: '操作',
      key: null,
      render: (text: any, record: any, index: number) => {
        return (
          <div>
            <Popover
              placement="top"
              title={'请输入新密码'}
              content={
                <div>
                  <Input />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '11px',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        const password = (e.target as any).parentNode.parentNode.parentNode.querySelector(
                          'input',
                        ).value;
                        updateAuth(record.id, password);
                      }}
                    >
                      确认
                    </Button>
                  </div>
                </div>
              }
              trigger="click"
            >
              <Button type="link">更名</Button>
            </Popover>
            <Button type="link">
              配置界面
            </Button>
          </div>
        );
      },
    },
  ];
  const columns2: any = [
    {
      title: '管理端页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: '操作',
      key: null,
      render: (text: any, record: any, index: number) => {
        return (
          <div>
            <Popover
              placement="top"
              title={'请输入新密码'}
              content={
                <div>
                  <Input />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '11px',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        const password = (e.target as any).parentNode.parentNode.parentNode.querySelector(
                          'input',
                        ).value;
                        updateAuth(record.id, password);
                      }}
                    >
                      确认
                    </Button>
                  </div>
                </div>
              }
              trigger="click"
            >
              <Button type="link">更名</Button>
            </Popover>
            <Button type="link">
              配置界面
            </Button>
          </div>
        );
      },
    },
  ];

  const [data, setData] = useState<IConsult[]>([]);
  useEffect(() => {
    myPost('/User/login',{
      username: 'admin',
      password: '111111'
    });
    (async () => {
      const res = await myGet('/VisitRecord/statisticsVisitCount');
      setData(res.map((item: any) => {
        const res: any = {}
        for(const key in item){
          res.pageName = key
        }
        return res
      }));
    })();
  }, []);
  return (
    <div>
      <div className={st.main}>
        <div style={{display: 'flex',justifyContent:'space-between'}}>
          <Table 
            rowKey='pageName'
            style={{width: '50%'}}
            rowSelection={{
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              },
              columnTitle: <div style={{width:'30px'}}>选择</div>
            }}
            pagination={false} 
            columns={columns} 
            dataSource={data} 
            bordered 
          />
          <Table 
            rowKey='pageName'
            style={{width: '50%'}} 
            rowSelection={{
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              },
              columnTitle: <div style={{width:'30px'}}>选择</div>
            }}
            pagination={false} 
            columns={columns2} 
            dataSource={data} 
            bordered 
          />
        </div>
        
        <p>注：左方黄色栏列表的勾选和编辑，功能为开放给游客用户查看；右方的蓝色列的勾选和编辑，功能为开放给企业管理员用户进行内容编辑、页面预览和发布</p>
      </div>
    </div>
  );
};
export default DataManagement;
