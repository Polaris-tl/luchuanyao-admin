import { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { myGet, myPost, uploadFile, uploadFiles } from '@/utils/request';
import st from './index.less';

type mediaType = 'img' | 'video'
interface IBanner {
  file?: File;
  img: string;
  type: mediaType,
  id: string
}

const BannerUploader:React.FC<{resourceId: string}> = (props) => {
  const { resourceId } = props
  const [fileList, setFileList] = useState<IBanner[]>([]); //banner图片\视频列表
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    (async () => {
      const banners = await myPost<IBanner[]>('ResourceImg/selectByCondition', {resourceId: resourceId})
      const newFileList = banners.map(banner => ({
        img: banner.img,
        id: banner.id,
        type: banner.img.includes('.mp4') ? 'video' : 'img' as mediaType
      }))
      setFileList(newFileList)
    })();
  }, []);

  // 发布网站
  const onSubmiit =  async () => {
    const res = await uploadFiles(fileList.filter(item => item.file).map(item => item.file) as File[], resourceId)
    if(res.msg == '上传成功'){
      message.success('上传成功')
    }
  }
  // 文件改变事件
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setFileList([
              ...fileList,
              {
                file: file,
                img: reader.result as string,
                type: 'img',
                id: ''
              },
            ]);
          }
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
          img: URL.createObjectURL(file),
          type: 'video',
          id: ''
        },
      ]);
    }
  };

  const deleteBanner = (banner: IBanner) => {
    myGet('ResourceImg/deleteById', {id: banner.id})
    setFileList(
      fileList.filter((item) => {
        if(banner.file){
          return item.file != banner.file;
        }
        return item.img != banner.img;
      }),
    );
  }
  return(
    <div className={st.uploadBox}>
      <div className={st.imgBox}>
        {fileList.length == 0 && <div>请上传图片或视频</div>}
        {fileList.map((file,idx) => {
          return (
            <div style={{ position: 'relative' }} key={idx}>
              {file.type == 'img' ? (
                <img src={file.img} alt="" />
              ) : (
                <video src={file.img} controls></video>
              )}
              <CloseOutlined
                onClick={() => deleteBanner(file)}
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
              inputRef.current?.click();
            }}
          >
            上传图像
            <input
              onChange={onChange}
              ref={inputRef}
              accept="image/jpeg, image/png, audio/mp4, video/mp4"
              type="file"
              hidden
            />
          </Button>
          <Button>保存预览</Button>
          <Button onClick={onSubmiit}>发布网站</Button>
        </div>
      </div>
    </div>
  )
}

export default BannerUploader