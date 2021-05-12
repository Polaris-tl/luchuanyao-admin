import React, { useState, useEffect } from 'react';
import { Checkbox, Button, message } from 'antd';
import { myPost, myGet } from '@/utils/request';
import moment from 'moment';
import setTop from '@/static/imgs/to_top.svg';
import deletItem from '@/static/imgs/delete.svg';
import edit from '@/static/imgs/edit.svg';
import st from './list.less';
interface INews {
  abstractname: string;
  subtitle: string;
  content: string;
  id: string;
  img: string;
  publishDate: string;
  publishPerson: string;
  title: string;
  voteCount: string;
  displayType: 1 | 2;
  isTop: boolean;
}
interface IProps {
  onEditNews: (newsDetail: INews) => void;
}
const NewsList: React.FC<IProps> = (props) => {
  const [news, setNews] = useState<INews[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const deleteNews = async () => {
    if (checkedList.length != 1) return;
    const res = myGet('/JoinUs/deleteById', { id: checkedList[0] + '' });
    if (res) {
      message.success('删除成功');
      setCheckedList([]);
      const res2 = await myGet<INews[]>('/JoinUs/selectAll');
      res2 && setNews(res2);
    } else {
      message.warning('删除失败');
    }
  };

  const setNewsTop = () => {
    if (checkedList.length != 1) return;
  };

  const editNews = () => {
    if (checkedList.length != 1) return;
    const target = news.find((item) => item.id == checkedList[0]);
    target && props.onEditNews(target);
  };

  useEffect(() => {
    (async () => {
      const res = await myGet<INews[]>('/JoinUs/selectAll');
      res && setNews(res);
    })();
  }, []);
  return (
    <div className={st.newsList}>
      <div className={st.toolbar}>
        <Button
          type="link"
          disabled={checkedList.length != 1}
          onClick={() => setNewsTop()}
        >
          <img src={setTop} alt="" />
          <span>置顶</span>
        </Button>
        <Button
          type="link"
          disabled={checkedList.length != 1}
          onClick={() => deleteNews()}
        >
          <img src={deletItem} alt="" />
          <span>删除</span>
        </Button>
        <Button
          type="link"
          disabled={checkedList.length != 1}
          onClick={() => editNews()}
        >
          <img src={edit} alt="" />
          <span>编辑</span>
        </Button>
      </div>
      <div className={st.list} style={{ display: 'flex', flexWrap: 'wrap' }}>
        {news.map((item, idx) => {
          if (idx < 2) {
            return (
              <div className={st.block} key={item.id}>
                <div className={st.imgBox}>
                  <Checkbox
                    checked={checkedList.includes(item.id)}
                    style={{ position: 'absolute', top: '20px', left: '24px' }}
                    onChange={(e) => {
                      const index = checkedList.findIndex(
                        (item2) => item2 == item.id,
                      );
                      if (e.target.checked) {
                        if (index == -1) {
                          // setCheckedList([...checkedList, item.id])
                          setCheckedList([item.id]);
                        }
                      } else {
                        if (index != -1) {
                          checkedList.splice(index, 1);
                          // setCheckedList([...checkedList])
                          setCheckedList([]);
                        }
                      }
                    }}
                  />
                  <img src={item.img} alt="" />
                </div>
                <div className={st.info}>
                  <p className={st.p1}>{item.title}</p>
                  <p className={st.p2}>
                    <span>{item.publishPerson}</span>
                    <span>{moment(item.publishDate).format('yyyy-MM-DD')}</span>
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div className={st.line} key={item.id}>
                <p className={st.p1}>
                  <Checkbox
                    checked={checkedList.includes(item.id)}
                    style={{ marginRight: '25px' }}
                    onChange={(e) => {
                      const index = checkedList.findIndex(
                        (item2) => item2 == item.id,
                      );
                      if (e.target.checked) {
                        if (index == -1) {
                          // setCheckedList([...checkedList, item.id])
                          setCheckedList([item.id]);
                        }
                      } else {
                        if (index != -1) {
                          checkedList.splice(index, 1);
                          // setCheckedList([...checkedList])
                          setCheckedList([]);
                        }
                      }
                    }}
                  />
                  <span>{item.title}</span>
                </p>
                <p className={st.p2}>
                  <span>{item.publishPerson}</span>
                  <span>{moment(item.publishDate).format('yyyy-MM-DD')}</span>
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
export default NewsList;
