import { Table, Button, Popover, Input, Popconfirm, Drawer } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myGet } from '@/utils/request';
import st from './userManagement.less';
import AuthManagement from '@/pages/authManagement/authManagement'
interface IUser {
  id: string;
  password: string;
  username: string;
}
const DataManagement = () => {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const columns: any = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render: (text: any, record: any, index: number) => `${index + 1}`, // 显示每一行的序号
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户密码',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: '设置权限',
      dataIndex: null,
      render: (text: any, record: any) => {
        return <Button type="link" onClick={() => {
          setVisible(true)
          setSelectedId(record.id)
        }}>设置权限</Button>;
      },
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
                        updateUser(record.id, password);
                      }}
                    >
                      确认
                    </Button>
                  </div>
                </div>
              }
              trigger="click"
            >
              <Button type="link">修改密码</Button>
            </Popover>
            <Popconfirm
              title="是否确认删除"
              onConfirm={() => {
                confirmDeleteUser(record.id);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" danger>
                删除用户
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  
  const [data, setData] = useState<IUser[]>([]);
  // 删除用户事件
  const confirmDeleteUser = async (id: string) => {
    const res = await myGet('/User/deleteById', { id });
    if (res) {
      const res2 = await myGet('/User/selectAll');
      setData(res2);
    }
  };
  // 修改用户
  const updateUser = async (id: string, password: string) => {
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
  useEffect(() => {
    (async () => {
      const res = await myGet('/User/selectAll');
      setData(res);
    })();
  }, []);
  return (
    <div>
      <div className={st.main}>
        <Table columns={columns} dataSource={data} bordered />
        <Drawer
          title="权限设置"
          width={1200}
          onClose={() => {
            setVisible(false);
          }}
          visible={visible}
        >
          <AuthManagement userId={selectedId}/>
        </Drawer>
      </div>
    </div>
  );
};
export default DataManagement;
