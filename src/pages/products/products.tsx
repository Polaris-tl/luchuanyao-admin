import { useState } from 'react'
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import img1 from '@/static/imgs/banner_product.jpg'
import st from './products.less'


const Products = () => {
  const [ fileList, setFilList] = useState<{bolb: Blob, src: string}[]>([])
  return (
    <div>
      <div className={st.main}>
        <div className={st.uploadBox}>
          <div className={st.imgBox}>
            <img src={img1} alt=""/>
            <img src={img1} alt=""/>
            <img src={img1} alt=""/>
            <img src={img1} alt=""/>
            <img src={img1} alt=""/>
          </div>
          <div className={st.bottom}>
            <p className={st.tip}>请再次上传页面顶部的banner图像(jpg、png或mp4格式, 1920px * 600px, 12Mb以内)</p>
            <div className={st.btnGroup}>
              <Button>上传图像</Button>
              <Button>保存预览</Button>
              <Button>发布网站</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Products