import { useState, forwardRef, useEffect, useImperativeHandle  } from 'react';
import { Input, Button, message } from 'antd';
import { myGet, myPost, uploadFile } from '@/utils/request';
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
  listUrl: string,
  updateUrl: string
}

 export interface IExpose {
  refreshList: () => void
}
const ItemEditList = forwardRef<IExpose, IProps>((props:IProps, ref) => {
  const { listUrl, updateUrl } = props
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    (async () => {
      const res = await myGet(listUrl);
      setProducts(res);
    })();
  }, []);
  useImperativeHandle(ref, () => ({
    refreshList: refreshList
  }));
  // 文件改变事件
  const onChange = (
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
          if(width <= 1920 && height <= 600){
            //修改图片
            setProducts(
              products.map((item2) => {
                if (item2.id != id) {
                  return item2;
                }
                return { ...item2, img: reader.result as string, file: file };
              }),
            );
          }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  // 刷新
  const refreshList = async() => {
    const res = await myGet(listUrl);
    setProducts(res);
  }
  // 修改
  const updateItem = async (id: string) => {
    const specificProduct = products.find((item) => item.id == id);
    if (!specificProduct) return;
    if (!specificProduct.img) {
      return message.warning('请上传图片');
    }
    let src = specificProduct.img;
    if (specificProduct.file) {
      //说明修改了图片
      const { url } = await uploadFile(specificProduct.file);
      src = url;
    }
    const res = await myPost(updateUrl, {
      id,
      content: specificProduct.content,
      img: src,
      subtitle: specificProduct.subtitle,
      title: specificProduct.title,
    });
    if (res) {
      message.success('修改成功');
    } else {
      message.success('修改失败');
    }
  };
  // 删除
  const deleteItem = async (id: string) => {
    const res = await myGet('ProductTech/deleteById', { id });
    if (res) {
      message.success('删除成功');
      refreshList()
    }
  };
  return (
    <>
      {products.map((item,idx) => {
          return (
            <div className={st.articleBox} key={idx}>
              <div className={st.top}>
                <div className={st.left}>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      setProducts(
                        products.map((item2) => {
                          if (item2.id != item.id) {
                            return item;
                          }
                          return { ...item2, title: e.target.value };
                        }),
                      );
                    }}
                    placeholder="请输入标题内容"
                    className={st.title}
                  />
                  <div className={st.subTitleBox}>
                    <Input.TextArea
                      value={item.subtitle}
                      onChange={(e) => {
                        setProducts(
                          products.map((item2) => {
                            if (item2.id != item.id) {
                              return item;
                            }
                            return { ...item2, subtitle: e.target.value };
                          }),
                        );
                      }}
                      className={st.subTitle}
                      maxLength={150}
                      showCount
                      placeholder="请输入副标或简介"
                    />
                    <div
                      className={st.upload}
                      onClick={(e: any) => {
                        e.currentTarget.firstChild.click();
                      }}
                    >
                      <input
                        onChange={(e) => {
                          onChange(e, item.id);
                        }}
                        accept="image/jpeg, image/png"
                        type="file"
                        hidden
                      />
                      <img hidden={!Boolean(item.img)} src={item.img} alt="" />
                      <p hidden={Boolean(item.img)}>请上传内容图片</p>
                    </div>
                  </div>
                </div>
                <div className={st.right}>
                  <Input.TextArea
                    value={item.content}
                    onChange={(e) => {
                      setProducts(
                        products.map((item2) => {
                          if (item2.id != item.id) {
                            return item;
                          }
                          return { ...item2, content: e.target.value };
                        }),
                      );
                    }}
                    maxLength={300}
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
                      deleteItem(item.id);
                    }}
                  >
                    删除此项
                  </Button>
                  <Button>保存预览</Button>
                  <Button onClick={() => updateItem(item.id)}>
                    发布网站
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
})
export default ItemEditList;
