import { useState, useRef, useEffect } from 'react';
import { Input, Button, message, DatePicker, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { myGet, myPost, uploadFile } from '@/utils/request';
import Editor from '@/components/editor';
import defaultImage from '@/static/imgs/default_image.png';
import NewsList from './list';
import st from './news.less';
import moment from 'moment';
interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  publishDate: string;
  publishPerson: string;
  abstractname: string;
  img: string;
  displayType: 0 | 1; // 1块元素  0行
  isTop: 0 | 1; // 1是  0行
  file?: File;
}
const Products = () => {
  const [activeTabOne, setActiveTabOne] = useState(false); // 切换
  const [initValue, setInitValue] = useState<string>(''); // 编辑器初始值
  const [toAddedItem, setToAddedItem] = useState<IProduct>({
    title: '',
    subtitle: '',
    content: '',
    img: '',
    publishDate: '',
    publishPerson: '',
    id: '',
    displayType: 1,
    abstractname: '',
    isTop: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = function () {
        setToAddedItem({
          ...toAddedItem,
          img: reader.result as string,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const onSave = () => {};
  // 添加新闻
  const onPublish = async () => {
    let newImage = ''
    if (!toAddedItem.img) {
      if (!toAddedItem.file) {
        return message.warning('请上传图片');
      }
      const { url } = await uploadFile(toAddedItem.file);
      newImage = url
    }else{
      if (toAddedItem.file) {
        const { url } = await uploadFile(toAddedItem.file);
        newImage = url
      }else{
        newImage = toAddedItem.img
      }
    }
    const {
      content,
      displayType,
      isTop,
      subtitle,
      title,
      publishDate,
    } = toAddedItem;
    const data: any = {
      content,
      img: newImage,
      subtitle,
      title,
      displayType,
      isTop,
      publishPerson: 1,
      publishDate: publishDate ?? moment().format('yyyy-MM-DD HH:mm:ss'),
      abstractname: subtitle,
    };
    if(toAddedItem.id){
      data.id = toAddedItem.id
      const res = myPost('/NewsCenter/update', data)
      if (res) {
        message.success('修改成功');
        setToAddedItem({
          title: '',
          subtitle: '',
          content: '',
          img: '',
          id: '',
          publishDate: '',
          publishPerson: '',
          displayType: 1,
          abstractname: '',
          isTop: 0,
        });
      } else {
        message.success('修改失败');
      }
    }else{
      const res = myPost('/NewsCenter/add', data)
      if (res) {
        message.success('发布成功');
        setToAddedItem({
          title: '',
          subtitle: '',
          content: '',
          img: '',
          id: '',
          publishDate: '',
          publishPerson: '',
          displayType: 1,
          abstractname: '',
          isTop: 0,
        });
      } else {
        message.success('发布失败');
      }
    }
  };
  // 删除
  const onDelete = async () => {
    const res = myGet('/NewsCenter/deleteById', { id: toAddedItem.id });
    if (res) {
      message.success('删除成功');
      setToAddedItem({
        title: '',
        subtitle: '',
        content: '',
        img: '',
        publishDate: '',
        publishPerson: '',
        id: '',
        displayType: 1,
        abstractname: '',
        isTop: 0,
      });
    } else {
      message.warning('删除失败');
    }
  };
  return (
    <div>
      <div className={st.main}>
        <div className={st.left}>
          <div className={st.tab}>
            <span
              className={activeTabOne ? st.active : ''}
              onClick={() => setActiveTabOne(true)}
              style={{ borderRight: '2px solid #dde3ed' }}
            >
              查看发布文章
            </span>
            <span
              className={activeTabOne ? '' : st.active}
              onClick={() => setActiveTabOne(false)}
            >
              新建图文消息
            </span>
          </div>
          <div className={st.previewBox}>
            {!activeTabOne && (
              <div className={st.preview}>
                <p>{toAddedItem.title || '标题预览'}</p>
                <div>
                  <img src={toAddedItem.img || defaultImage} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
        {!activeTabOne && (
          <div className={st.right}>
            <Editor
              initValue={initValue}
              setHtmlString={(html) => {
                setToAddedItem({
                  ...toAddedItem,
                  content: html,
                });
              }}
            />
            <div className={st.addBox}>
              <p className={st.top}>封面和摘要</p>
              <div className={st.bottom}>
                <div
                  className={st.left}
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  <input
                    onChange={onFileChange}
                    ref={inputRef}
                    accept="image/jpeg, image/png"
                    type="file"
                    hidden
                  />
                  {toAddedItem.img && <img src={toAddedItem.img} alt="" />}
                  {!toAddedItem.img && <PlusOutlined />}
                </div>
                <div className={st.right22}>
                  <Input
                    value={toAddedItem.title}
                    style={{ marginBottom: '10px' }}
                    onChange={(e) => {
                      setToAddedItem({ ...toAddedItem, title: e.target.value });
                    }}
                    placeholder="请输入标题内容"
                  />
                  <div
                    style={{
                      display: 'flex',
                      marginBottom: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <DatePicker
                      style={{ marginRight: '24px' }}
                      placeholder="发布日期"
                      showTime
                      value={toAddedItem.publishDate ? moment(toAddedItem.publishDate) : undefined}
                      onChange={(date) => {
                        if (date) {
                          setToAddedItem({
                            ...toAddedItem,
                            publishDate: date.format('YYYY-MM-DD HH:mm:ss'),
                          });
                        }
                      }}
                    />
                    <Checkbox
                      checked={toAddedItem.displayType == 1}
                      onChange={(e) => {
                        setToAddedItem({
                          ...toAddedItem,
                          displayType: e.target.checked ? 1 : 0,
                        });
                      }}
                      defaultChecked
                    >
                      大图展示
                    </Checkbox>
                    <Checkbox
                      checked={toAddedItem.isTop == 1}
                      onChange={(e) => {
                        setToAddedItem({
                          ...toAddedItem,
                          isTop: e.target.checked ? 1 : 0,
                        });
                      }}
                    >
                      是否置顶
                    </Checkbox>
                  </div>
                  <div>
                    <Input
                      value={toAddedItem.abstractname}
                      onChange={(e) => {
                        setToAddedItem({
                          ...toAddedItem,
                          subtitle: e.target.value,
                          abstractname: e.target.value,
                        });
                      }}
                      placeholder="请输入摘要"
                    />
                  </div>
                  <div className={st.btnGroup}>
                    <Button onClick={onDelete}>删除</Button>
                    <Button onClick={onSave}>保存预览</Button>
                    <Button onClick={onPublish}>发布网站</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTabOne && (
          <div className={st.right}>
            <NewsList
              onEditNews={(newsDetail) => {
                setActiveTabOne(false);
                setToAddedItem(newsDetail);
                setInitValue(newsDetail.content)
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
