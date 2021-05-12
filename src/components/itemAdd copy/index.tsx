import { useState, useRef } from 'react';
import { Input, Button, message } from 'antd';
import { myPost, uploadFile } from '@/utils/request';
import { PlusOutlined } from '@ant-design/icons';
import defaultImage from '@/static/imgs/default_image.png';
import st from './index.less';

interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  img: string;
  file?: File;
}

interface IProps {
  uploadUrl: string,
  refreshList: () => void,
}
const ItemAdd: React.FC<IProps> = (props) => {
  const { uploadUrl, refreshList } = props
  const [addVisible, setAddVisible] = useState(true); //新增盒子显示
  const [toAddedItem, setToAddedItem] = useState<IProduct>({
    title: '',
    subtitle: '',
    content: '',
    img: '',
    id: '',
  }); //新增时的产品信息
  const inputRef = useRef<HTMLInputElement>(null);
  // 文件改变事件
  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id?: string,
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    // if(file.size > 12 * 1024 * 1024){
    //   return message.warning('文件大小超出限制')
    // }

    // 图片
    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          // if(width == 1920 && height == 600){
          setToAddedItem({
            ...toAddedItem,
            img: reader.result as string,
            file: file,
          });
          // }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  // 添加item
  const addItem = async () => {
    if (!toAddedItem.file) {
      return message.warning('请上传图片');
    }
    const { url } = await uploadFile(toAddedItem.file);
    const res = await myPost(uploadUrl, {
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
      refreshList()
    } else {
      message.success('发布失败');
    }
  };

  return(
    <>
      <div className={st.articleBox} hidden={!addVisible}>
        <div className={st.top}>
          <div className={st.left}>
            <Input
              value={toAddedItem.title}
              onChange={(e) => {
                setToAddedItem({ ...toAddedItem, title: e.target.value });
              }}
              placeholder="请输入标题内容"
              className={st.title}
            />
            <div className={st.subTitleBox}>
              <Input.TextArea
                value={toAddedItem.subtitle}
                onChange={(e) => {
                  setToAddedItem({
                    ...toAddedItem,
                    subtitle: e.target.value,
                  });
                }}
                className={st.subTitle}
                maxLength={300}
                showCount
                placeholder="请输入副标或简介"
              />
              <div
                className={st.upload}
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
                <img
                  hidden={!Boolean(toAddedItem.img)}
                  src={toAddedItem.img}
                  alt=""
                />
                <p hidden={Boolean(toAddedItem.img)}>请上传内容图片</p>
              </div>
            </div>
          </div>
          <div className={st.right}>
            <Input.TextArea
              value={toAddedItem.content}
              onChange={(e) => {
                setToAddedItem({ ...toAddedItem, content: e.target.value });
              }}
              maxLength={150}
              showCount
              placeholder="请输入内容描述"
            />
          </div>
        </div>
        <div className={st.bottom}>
          <p className={st.tip}>
            注：图片制式为1200px*600px的jpg、png格式文件
          </p>
          <div className={st.btnGroup}>
            <Button
              onClick={() => {
                setToAddedItem({
                  title: '',
                  subtitle: '',
                  content: '',
                  img: '',
                  id: '',
                });
                setAddVisible(false);
              }}
            >
              删除此项
            </Button>
            <Button>保存预览</Button>
            <Button onClick={addItem}>发布网站</Button>
          </div>
        </div>
      </div>

      {/* 预览 */}
      <div className={st.previewBox}>
        <div className={st.preview}>
          <p>{toAddedItem.title || '标题预览'}</p>
          <div>
            <img
              src={toAddedItem.img || defaultImage}
              alt=""
            />
          </div>
        </div>
        <div className={st.add} onClick={() => setAddVisible(true)}>
          <PlusOutlined />
        </div>
      </div>
    </>
  )
}
export default ItemAdd