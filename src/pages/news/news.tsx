import { useState, useRef, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { myPost, uploadFile } from '@/utils/request';
import Editor from '@/components/editor';
import defaultImage from '@/static/imgs/default_image.png';
import st from './news.less';

interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  img: string;
  file?: File;
}
const Products = () => {
  const [activeTabOne, setActiveTabOne] = useState(false); // 切换
  const [htmlString, setHtmlString] = useState<string>(''); // 编辑器内容
  const [initValue, setInitValue] = useState<string>(''); // 编辑器初始值
  const [toAddedItem, setToAddedItem] = useState<IProduct>({
    title: '',
    subtitle: '',
    content: '',
    img: '',
    id: '',
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
    if (!toAddedItem.file) {
      return message.warning('请上传图片');
    }
    const { url } = await uploadFile(toAddedItem.file);
    const res = await myPost('/News/add', {
      content: toAddedItem.content,
      img: url,
      subtitle: toAddedItem.subtitle,
      title: toAddedItem.title,
    });
    if (res) {
      message.success('发布成功');
      setToAddedItem({
        title: '',
        subtitle: '',
        content: '',
        img: '',
        id: '',
      });
    } else {
      message.success('发布失败');
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
            {activeTabOne ? (
              <div>asdad</div>
            ) : (
              <div className={st.preview}>
                <p>{toAddedItem.title || '标题预览'}</p>
                <div>
                  <img src={toAddedItem.img || defaultImage} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={st.right}>
          <Editor initValue={initValue} setHtmlString={setHtmlString} />
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
                <div>
                  <Input.TextArea
                    value={toAddedItem.subtitle}
                    onChange={(e) => {
                      setToAddedItem({
                        ...toAddedItem,
                        subtitle: e.target.value,
                      });
                    }}
                    style={{ height: '67px' }}
                    maxLength={150}
                    showCount
                    placeholder="请输入摘要"
                  />
                </div>
                <div className={st.btnGroup}>
                  <Button onClick={onSave}>保存预览</Button>
                  <Button onClick={onPublish}>发布网站</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
