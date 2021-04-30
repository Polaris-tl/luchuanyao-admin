import { useRef } from 'react'
import BannerUploader from '@/components/bannerUploader'
import ItemAdd from '@/components/itemAdd'
import ItemEditList from '@/components/itemEditList'

const Solutions = () => {
  const itemListRef = useRef<any>()
  const refreshList = async() => {
    itemListRef?.current.refreshList()
  }
 
  return (
    <div>
      <div style={{ width: '1200px',margin: 'auto' }}>
        {/*banner 图片、视频上传 */}
        {/* 1产品技术 2服务案例 3新闻中心 4加入我们 5解决方案 6品牌战略 */}
        <BannerUploader resourceId='2'/>
        {/*修改 */}
        <ItemEditList ref={itemListRef} listUrl='ServiceCase/selectAll' updateUrl='ServiceCase/update' deleteUrl='ServiceCase/deleteById'/>
        {/*新增 */}
        <ItemAdd uploadUrl='ServiceCase/add' refreshList={refreshList}/>
      </div>
    </div>
  );
};
export default Solutions;