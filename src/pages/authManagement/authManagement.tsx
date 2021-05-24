import { Table, Button, Popover, Input, Checkbox } from 'antd';
import { useState, useEffect } from 'react';
import { myPost, myPost2, myGet } from '@/utils/request';
import st from './authManagement.less';
import { useModel } from 'umi';

const AuthManagement: React.FC<{userId: string}> = (props) => {
  const { user } = useModel('useAuthModel', (model) => ({ user: model.user }));
  const [visitor, setVisitor] = useState([])
  const [admin, setAdmin] = useState([])
  useEffect(() => {
    if(props.userId == '0'){
      myGet('/User/hasResourceFromUser', { id: props.userId })
      .then((data) => {
        setVisitor(data.map(
          (item: any) => item.id,
        ))
      })
    }
    myGet('/User/hasResourceFromUser', { id: props.userId })
    .then((data) => {
      setAdmin(data.map(
        (item: any) => item.id,
      ))
    })
  },[props.userId])
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
          {
            props.userId == '0' ? (
              <div className={st.table1}>
                <Table
                  rowKey="id"
                  key={visitor.join()}
                  rowSelection={{
                    columnTitle: <div style={{ width: '30px' }}>选择</div>,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                      myPost('/User/grantResource', {
                        userId: 0,
                        resourceIds: selectedRowKeys,
                      });
                    },
                    defaultSelectedRowKeys: visitor
                  }}
                  pagination={false}
                  columns={columns}
                  dataSource={resource}
                  bordered
                />
              </div>
            ) : (
              <div className={st.table2}>
                <Table
                  rowKey="id"
                  key={admin.join()}
                  rowSelection={{
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                      myPost('/User/grantResource', {
                        userId: props.userId,
                        resourceIds: selectedRowKeys,
                      });
                    },
                    columnTitle: <div style={{ width: '30px' }}>选择</div>,
                    defaultSelectedRowKeys: admin,
                  }}
                  pagination={false}
                  columns={columns2}
                  dataSource={resource}
                  bordered
                />
            </div>
            )
          }
        </div>

        <p>
          注：左方黄色栏列表的勾选和编辑，功能为开放给游客用户查看；右方的蓝色列的勾选和编辑，功能为开放给企业管理员用户进行内容编辑、页面预览和发布
        </p>
      </div>
    </div>
  );
};
export default AuthManagement;
