import { useState, useRef } from 'react'
import { Input, Upload, Button, message } from 'antd';
import { UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import defaultImage from '@/static/imgs/default_image.png'
import st from './products.less'

interface IProduct {
  title: string,
  subTitle: string,
  content: string,
  url: string,
  file?: File
}

const Products = () => {
  const [ fileList, setFileList ] = useState<{file: File, src: string, type: 'img' | 'video'}[]>([]) //banner图片\视频列表
  const [ title, setTitle ] = useState('') //标题
  const [ subTitle, setSubTitle ] = useState('') //副标题
  const [ products, setProducts ] = useState<IProduct[]>([]) //产品详情列表
  const [ addedProduct, setAddedProduct ] = useState<IProduct>({title: '', subTitle: '', content: '', url: ''}) //新增时的产品信息
  const fileInputElement1 = useRef<HTMLInputElement>(null)
  const fileInputElement2 = useRef<HTMLInputElement>(null)
  // banner图像视频上传
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    // if(file.size > 12 * 1024 * 1024){
    //   return message.warning('文件大小超出限制')
    // }

    // 图片
    if(file.type.includes('image')){
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.onload=function(){
            const width = image.width;
            const height = image.height;
            // if(width == 1920 && height == 600){
              setFileList([
                  ...fileList,
                  {
                  file: file,
                  src: reader.result as string,
                  type: 'img'
                }
              ])
            // }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    // 视频
    if(file.type.includes('mp4')){
      setFileList([
          ...fileList,
          {
          file: file,
          src: URL.createObjectURL(file),
          type: 'video'
        }
      ])
    }
  }
  // 产品图像上传
  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    // if(file.size > 12 * 1024 * 1024){
    //   return message.warning('文件大小超出限制')
    // }

    // 图片
    if(file.type.includes('image')){
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.onload=function(){
            const width = image.width;
            const height = image.height;
            // if(width == 1920 && height == 600){
              setAddedProduct({...addedProduct, url: reader.result as string, file: file})
            // }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <div>
      <div className={st.main}>
        {/* 图片、视频上传 */}
        <div className={st.uploadBox}>
          <div className={st.imgBox}>
            {
              fileList.length == 0 && (
                <div>
                  请上传图片或视频
                </div>
              )
            }
            {
              fileList.map(file => {
                return <div style={{ position: 'relative' }}>
                  {file.type == 'img' ? <img src={file.src} alt=""/> : <video src={file.src} controls ></video>}
                  <CloseOutlined 
                    onClick={() => {
                      setFileList(fileList.filter(file2 => {
                        return file2.file != file.file
                      }))
                    }}
                    style={{
                      position: 'absolute',
                      right: '40px',
                      top: '10px'
                    }}
                  />
                </div>
              })
            }
          </div>
          <div className={st.bottom}>
            <p className={st.tip}>请再次上传页面顶部的banner图像(jpg、png或mp4格式, 1920px * 600px, 12Mb以内)</p>
            <div className={st.btnGroup}>
              <Button onClick={() => {fileInputElement2.current?.click()}}>上传图像
                <input onChange={handleBannerFileChange} ref={fileInputElement2} accept='image/jpeg, image/png, audio/mp4, video/mp4' type="file" hidden />
              </Button>
              <Button>保存预览</Button>
              <Button>发布网站</Button>
            </div>
          </div>
        </div>
        {/* 标题、副标题、文本上传 */}
        <div className={st.articleBox}>
          <div className={st.top}>
            <div className={st.left}>
              <Input 
                value={addedProduct.title}
                onChange={(e) => {setAddedProduct({...addedProduct,title: e.target.value})}}
                placeholder='请输入标题内容'
                className={st.title}
              />
              <div className={st.subTitleBox}>
                <Input.TextArea 
                  value={addedProduct.subTitle}
                  onChange={(e) => {setAddedProduct({...addedProduct,subTitle: e.target.value})}}
                  className={st.subTitle} 
                  maxLength={150} 
                  showCount 
                  placeholder='请输入副标或简介'
                />
                <div className={st.upload} onClick={() => {fileInputElement1.current?.click()}}>
                  <img hidden={!Boolean(addedProduct.url)} src={addedProduct.url} alt=""/>
                  <p hidden={Boolean(addedProduct.url)}>请上传内容图片</p>
                  <input onChange={handleProductFileChange} ref={fileInputElement1} accept='image/jpeg, image/png' type="file" hidden />
                </div>
              </div>
            </div>
            <div className={st.right}>
              <Input.TextArea 
                value={addedProduct.content}
                onChange={(e) => {setAddedProduct({...addedProduct,content: e.target.value})}}
                maxLength={150} 
                showCount 
                placeholder='请输入内容描述' 
              />
            </div>
          </div>
          <div className={st.bottom}>
            <p className={st.tip}>注：图片制式为1200px*600px的jpg、png格式文件</p>
            <div className={st.btnGroup}>
              <Button onClick={() => {fileInputElement2.current?.click()}}>删除此项
                <input onChange={handleBannerFileChange} ref={fileInputElement2} accept='image/jpeg, image/png, audio/mp4, video/mp4' type="file" hidden />
              </Button>
              <Button>保存预览</Button>
              <Button>发布网站</Button>
            </div>
          </div>
        </div>
        {/* 预览 */}
        <div className={st.previewBox}>
          <div className={st.preview}>
            <p>{addedProduct.title || '标题预览'}</p>
            <div>
              <img hidden={!Boolean(addedProduct.url)} src={addedProduct.url || defaultImage} alt=""/>
            </div>
          </div>
          <div className={st.add}>
            <PlusOutlined />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Products