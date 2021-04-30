import { useRef } from 'react'
import BannerUploader from '@/components/bannerUploader'
import ItemAdd from '@/components/itemAdd'
import ItemEditList from '@/components/itemEditList'
import st from './products.less';


const Products = () => {
  const itemListRef = useRef<any>()
  const refreshList = async() => {
    console.log(refreshList)
    itemListRef?.current.refreshList()
  }
 
  return (
    <div>
      <div className={st.main}>
        {/*banner 图片、视频上传 */}
        <BannerUploader resourceId='1'/>
        {/*修改 */}
        <ItemEditList ref={itemListRef} listUrl='ProductTech/selectAll' updateUrl='ProductTech/update'/>
        {/*新增 */}
        <ItemAdd uploadUrl='ProductTech/add' refreshList={refreshList}/>
      </div>
    </div>
  );
};
export default Products;
