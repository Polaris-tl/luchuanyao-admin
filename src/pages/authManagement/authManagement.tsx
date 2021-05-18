import { Table, Button, Popover, Input, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myPost2, myGet } from '@/utils/request';
import st from './authManagement.less';
import { useModel } from 'umi';

const AuthManagement = () => {
  const { user } = useModel('useAuthModel', (model) => ({ user: model.user }));
  const updateName = async (id: string, name: string) => {
    const res = await myPost('/Resource/update', {
      id,
      name,
    });
    if (res) {
      const resource = await myGet('/Resource/selectAll');
      setResource(resource);
    }
  };
  const columns: any = [
    {
      title: '网站子页面名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: null,
      render: (text: any, record: any, index: number) => {
        return (
          <div>
            <Popover
              placement="top"
              title={'请输入页面名称'}
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
                        const name = (e.target as any).parentNode.parentNode.parentNode.querySelector(
                          'input',
                        ).value;
                        updateName(record.id, name);
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
            <Button type="link">配置界面</Button>
          </div>
        );
      },
    },
  ];
  const columns2: any = [
    {
      title: '管理端页面名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: null,
      render: (text: any, record: any, index: number) => {
        return (
          <div>
            <Popover
              placement="top"
              title={'请输入页面名称'}
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
                        const name = (e.target as any).parentNode.parentNode.parentNode.querySelector(
                          'input',
                        ).value;
                        updateName(record.id, name);
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
            <Button type="link">配置界面</Button>
          </div>
        );
      },
    },
  ];
  const [resource, setResource] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const resource = await myGet('/Resource/selectAll');
      setResource(resource);
    })();
  }, []);
  return (
    <div>
      <div className={st.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={st.table1}>
            <Table
              rowKey="id"
              rowSelection={{
                columnTitle: <div style={{ width: '30px' }}>选择</div>,
              }}
              pagination={false}
              columns={columns}
              dataSource={resource}
              bordered
            />
          </div>
          <div className={st.table2}>
              <Table
                rowKey="id"
                rowSelection={{
                  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                    myPost2('/User/grantResource', {
                      userId: (user as any).userId,
                      resourceIds: selectedRowKeys,
                    });
                  },
                  columnTitle: <div style={{ width: '30px' }}>选择</div>,
                  defaultSelectedRowKeys: (user as any).resources.map(
                    (item: any) => item.id,
                  ),
                }}
                pagination={false}
                columns={columns2}
                dataSource={resource}
                bordered
              />
          </div>
        </div>

        <p>
          注：左方黄色栏列表的勾选和编辑，功能为开放给游客用户查看；右方的蓝色列的勾选和编辑，功能为开放给企业管理员用户进行内容编辑、页面预览和发布
        </p>
      </div>
    </div>
  );
};
export default AuthManagement;
