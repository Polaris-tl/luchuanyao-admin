import { useModel } from 'umi';
import { Popover, Button } from 'antd';
import img1 from '@/static/imgs/banner_product.jpg';

const date = new Date();
const weekMaps = ['日', '一', '二', '三', '四', '五', '六'];
const year = date.getFullYear();
const month = date.getMonth() + 1 + '';
const day = date.getDate() + '';

import st from './header.less';
const Header = () => {
  const { user, logout } = useModel('useAuthModel', (model) => ({
    user: model.user,
    logout: model.signout,
  }));
  return (
    <div className={st.header}>
      <div className={st.box}>
        <div className={st.logo}></div>
        <div className={st.left}>摇橹船科技网站平台信息管理系统</div>
        {user && (
          <div className={st.right}>
            <span className={st.time}>
              {year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')}{' '}
              {'星期' + weekMaps[date.getDay()]}
            </span>
            <span>{user.username || '水手'}</span>
            <span className={st.avator}>
              <Popover
                content={
                  <div>
                    <Button type="link" onClick={logout}>
                      注销
                    </Button>
                  </div>
                }
              >
                <img src={img1} alt="" />
              </Popover>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;
