import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import st from './strategy.less'
const Products = () => {
  return <div>
    <div className={st.main}>
      <div>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          className="upload-list-inline"
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
    </div>
  </div>
}
export default Products