import st from './banner.less'
import { Carousel } from 'antd';

const contentStyle: any = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
interface IProps {
  imgUrl: string[] | string
}

const Banner: React.FC<IProps> = (props) => {
  const { imgUrl } = props
  return(
    <div>
      <Carousel autoplay>
        {
          Array.isArray(imgUrl) ? imgUrl.map((url, idx) => {
            return(
              <div key={url + idx}>
                <div>
                  <img src={url} alt=""/>
                </div>
              </div>
            )
          }) :
          <div><h3 style={contentStyle}>{imgUrl}</h3></div>
        }
      </Carousel>
    </div>
  )
}
export default Banner