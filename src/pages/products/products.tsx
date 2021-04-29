import { useState, useRef, useEffect } from 'react';
import { Input, Upload, Button, message } from 'antd';
import { UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { myGet, myPost, uploadFile } from '@/utils/request';
import defaultImage from '@/static/imgs/default_image.png';
import st from './products.less';

interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  img: string;
  file?: File;
}

const Products = () => {
  const [fileList, setFileList] = useState<
    { file: File; src: string; type: 'img' | 'video' }[]
  >([]); //banner图片\视频列表
  const [addVisible, setAddVisible] = useState(true); //新增盒子显示
  const [products, setProducts] = useState<IProduct[]>([]); //产品详情列表
  const [addedProduct, setAddedProduct] = useState<IProduct>({
    title: '',
    subtitle: '',
    content: '',
    img: '',
    id: '',
  }); //新增时的产品信息
  const fileInputElement1 = useRef<HTMLInputElement>(null);
  const fileInputElement2 = useRef<HTMLInputElement>(null);
  useEffect(() => {
    (async () => {
      const res = await myGet('ProductTech/selectAll');
      setProducts(res);
    })();
  }, []);
  // banner图像视频上传
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setFileList([
            ...fileList,
            {
              file: file,
              src: reader.result as string,
              type: 'img',
            },
          ]);
          // }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    // 视频
    if (file.type.includes('mp4')) {
      setFileList([
        ...fileList,
        {
          file: file,
          src: URL.createObjectURL(file),
          type: 'video',
        },
      ]);
    }
  };
  // 产品图像上传
  const handleProductFileChange = (
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
          if (!id) {
            //新增图片
            setAddedProduct({
              ...addedProduct,
              img: reader.result as string,
              file: file,
            });
          } else {
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

          // }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // 添加产品
  const addProduct = async () => {
    if (!addedProduct.file) {
      return message.warning('请上传图片');
    }
    const { url } = await uploadFile(addedProduct.file);
    const res = await myPost('ProductTech/add', {
      content: addedProduct.content,
      img: url,
      subtitle: addedProduct.subtitle,
      title: addedProduct.title,
    });
    if (res) {
      message.success('发布成功');
      const res = await myGet('ProductTech/selectAll');
      setAddedProduct({
        title: '',
        subtitle: '',
        content: '',
        img: '',
        id: '',
      });
      setProducts(res);
    } else {
      message.success('发布失败');
    }
  };
  // 修改产品
  const updateProduct = async (id: string) => {
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
    const res = await myPost('ProductTech/update', {
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
  // 删除产品
  const deleteProduct = async (id: string) => {
    const res = await myGet('ProductTech/deleteById', { id });
    if (res) {
      message.success('删除成功');
      const res = await myGet('ProductTech/selectAll');
      setProducts(res);
    }
  };
  return (
    <div>
      <div className={st.main}>
        {/*新增、修改  图片、视频上传 */}
        <div className={st.uploadBox}>
          <div className={st.imgBox}>
            {fileList.length == 0 && <div>请上传图片或视频</div>}
            {fileList.map((file) => {
              return (
                <div style={{ position: 'relative' }}>
                  {file.type == 'img' ? (
                    <img src={file.src} alt="" />
                  ) : (
                    <video src={file.src} controls></video>
                  )}
                  <CloseOutlined
                    onClick={() => {
                      setFileList(
                        fileList.filter((file2) => {
                          return file2.file != file.file;
                        }),
                      );
                    }}
                    style={{
                      position: 'absolute',
                      right: '40px',
                      top: '10px',
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className={st.bottom}>
            <p className={st.tip}>
              请在此上传页面顶部的banner图像(jpg、png或mp4格式, 1920px * 600px,
              12Mb以内)
            </p>
            <div className={st.btnGroup}>
              <Button
                onClick={() => {
                  fileInputElement2.current?.click();
                }}
              >
                上传图像
                <input
                  onChange={handleBannerFileChange}
                  ref={fileInputElement2}
                  accept="image/jpeg, image/png, audio/mp4, video/mp4"
                  type="file"
                  hidden
                />
              </Button>
              <Button>保存预览</Button>
              <Button>发布网站</Button>
            </div>
          </div>
        </div>

        {/*修改 产品列表 */}
        {products.map((item) => {
          return (
            <div className={st.articleBox}>
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
                          handleProductFileChange(e, item.id);
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
                      deleteProduct(item.id);
                    }}
                  >
                    删除此项
                  </Button>
                  <Button>保存预览</Button>
                  <Button onClick={() => updateProduct(item.id)}>
                    发布网站
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* 新增 标题、副标题、文本上传 */}
        <div className={st.articleBox} hidden={!addVisible}>
          <div className={st.top}>
            <div className={st.left}>
              <Input
                value={addedProduct.title}
                onChange={(e) => {
                  setAddedProduct({ ...addedProduct, title: e.target.value });
                }}
                placeholder="请输入标题内容"
                className={st.title}
              />
              <div className={st.subTitleBox}>
                <Input.TextArea
                  value={addedProduct.subtitle}
                  onChange={(e) => {
                    setAddedProduct({
                      ...addedProduct,
                      subtitle: e.target.value,
                    });
                  }}
                  className={st.subTitle}
                  maxLength={150}
                  showCount
                  placeholder="请输入副标或简介"
                />
                <div
                  className={st.upload}
                  onClick={() => {
                    fileInputElement1.current?.click();
                  }}
                >
                  <input
                    onChange={handleProductFileChange}
                    ref={fileInputElement1}
                    accept="image/jpeg, image/png"
                    type="file"
                    hidden
                  />
                  <img
                    hidden={!Boolean(addedProduct.img)}
                    src={addedProduct.img}
                    alt=""
                  />
                  <p hidden={Boolean(addedProduct.img)}>请上传内容图片</p>
                </div>
              </div>
            </div>
            <div className={st.right}>
              <Input.TextArea
                value={addedProduct.content}
                onChange={(e) => {
                  setAddedProduct({ ...addedProduct, content: e.target.value });
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
                  setAddedProduct({
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
              <Button onClick={addProduct}>发布网站</Button>
            </div>
          </div>
        </div>
        {/* 预览 */}
        <div className={st.previewBox}>
          <div className={st.preview}>
            <p>{addedProduct.title || '标题预览'}</p>
            <div>
              <img
                hidden={!Boolean(addedProduct.img)}
                src={addedProduct.img || defaultImage}
                alt=""
              />
            </div>
          </div>
          <div className={st.add} onClick={() => setAddVisible(true)}>
            <PlusOutlined />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
