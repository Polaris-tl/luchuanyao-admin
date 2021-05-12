import { useRef, useState } from 'react'
import BannerUploader from '@/components/bannerUploader'
import ItemAdd from '@/components/itemAdd'
import ItemEditList,{ IProduct } from '@/components/itemEditList'

const Cases = () => {
  const itemListRef = useRef<any>()
  const [currentItem, setCurrentItem] = useState<IProduct>()
  const refreshList = async() => {
    itemListRef?.current.refreshList()
  }
 
  return (
    <div>
      <div style={{ width: '1200px',margin: 'auto' }}>
        {/*banner 图片、视频上传 */}
        {/* 1产品技术 2服务案例 3新闻中心 4加入我们 5解决方案 6品牌战略 */}
        <BannerUploader resourceId='2'/>
        {/*新增 */}
        <ItemAdd 
          item={currentItem}  
          addUrl='ServiceCase/add' 
          updateUrl='ServiceCase/update' 
          deleteUrl='ServiceCase/deleteById'
          refreshList={refreshList}
        />
        {/*修改 */}
        <ItemEditList
          ref={itemListRef} 
          listUrl='ServiceCase/selectAll' 
          onClick={(item) => setCurrentItem(item)} 
        />
      </div>
    </div>
  );
};
export default Cases;