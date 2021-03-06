import { useState, useRef, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { myPost,myGet, uploadFile } from '@/utils/request';
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
  addUrl: string,
  updateUrl: string,
  deleteUrl: string
  item: IProduct | undefined,
  refreshList: () => void,
}
const ItemAdd: React.FC<IProps> = (props) => {
  const { addUrl, updateUrl, deleteUrl, refreshList, item } = props
  const [addVisible, setAddVisible] = useState(true); //新增盒子显示
  const [toAddedItem, setToAddedItem] = useState<IProduct>({
    title: '',
    subtitle: '',
    content: '',
    img: '',
    id: '',
  }); //新增时的产品信息
  useEffect(() => {
    item && setToAddedItem(item)
  }, [item])
  const inputRef = useRef<HTMLInputElement>(null);
  // 文件改变事件
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  // 发布
  const onPublish = () => {
    if(toAddedItem.id){
      updateItem()
    }else{
      addItem()
    }
  }
  // 添加item
  const addItem = async () => {
    if (!toAddedItem.file) {
        return message.warning('请上传图片');
    }
    const { url } = await uploadFile(toAddedItem.file);
    const res = await myPost(addUrl, {
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
  // 修改item
  const updateItem = async () => {
    const {id, file, content, img, subtitle, title} = toAddedItem
    let newImg = img
    if (file) {
        const { url } = await uploadFile(file);
        newImg = url
    }
    const res = await myPost(updateUrl, {
      id,
      content,
      img: newImg,
      subtitle,
      title,
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
      message.warning('发布失败');
    }
  };
  // 删除
  const deleteItem = async () => {
    setToAddedItem({
      title: '',
      subtitle: '',
      content: '',
      img: '',
      id: '',
    });
    if(toAddedItem.id){
      const res = await myGet(deleteUrl, { id: toAddedItem.id });
      if (res) {
        message.success('删除成功');
        refreshList()
      }
    }
  }
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
            <Button onClick={() => deleteItem()}>删除此项</Button>
            <Button>保存预览</Button>
            <Button onClick={onPublish}>发布网站</Button>
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
        <div className={st.add} onClick={() => setToAddedItem({
          title: '',
          subtitle: '',
          content: '',
          img: '',
          id: '',
        })}>
          <PlusOutlined />
        </div>
      </div>
    </>
  )
}
export default ItemAdd