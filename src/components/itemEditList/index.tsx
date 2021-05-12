import { useState, forwardRef, useEffect, useImperativeHandle  } from 'react';
import { Input, Button, message } from 'antd';
import { myGet, myPost, uploadFile } from '@/utils/request';
import st from './index.less';

export interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  img: string;
  file?: File;
}
interface IProps {
  listUrl: string,
  onClick: (item: IProduct) => void,
}

 export interface IExpose {
  refreshList: () => void
}
const ItemEditList = forwardRef<IExpose, IProps>((props:IProps, ref) => {
  const { listUrl, onClick } = props
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
  // 刷新
  const refreshList = async() => {
    const res = await myGet(listUrl);
    setProducts(res);
  }
  return (
    <div className={st.listBox}>
      {products.map((item,idx) => {
          return (
            <div key={idx} onClick={() => onClick({...item})}>
              <div><p>{item.title}</p></div>
              <div style={{height: '127px',overflow: 'hidden'}}><img src={item.img} alt=""/></div>
            </div>
          );
        })}
    </div>
  );
})
export default ItemEditList;
