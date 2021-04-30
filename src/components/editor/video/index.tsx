import { useState } from 'react'
import { Tabs, Button, Input, Radio, Upload, Dropdown  } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { EditorState, Entity, AtomicBlockUtils } from 'draft-js';
import { uploadFile } from '@/utils/request'
import st from './index.less'
const { TabPane } = Tabs;

interface IProps {
  editorState: EditorState,
  onChange: (data: EditorState) => void,
  config: any
}

const VideoRenderer = (props: any) => {
  const [ expanded, setExpanded ] = useState(false)
  const [ src, setSrc] = useState('')
  const [ position, setPosition] = useState<'flex-start' | 'center' | 'flex-end'>('center')
  const addVideo = async () => {
    setExpanded(!expanded)
    const { editorState, onChange, config } = props as IProps
    const entityData =  {
      src,
      position
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('video', 'MUTABLE', entityData)
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    onChange(newEditorState);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.type.includes('mp4')) {
      const { url } = await uploadFile(file)
      setSrc(url)
    }
  };
  return (
    <div className={st.box}>
      <Dropdown
        trigger={['click']}
        overlayStyle={{background: '#fff',padding: '10px', boxShadow: '0 0 9px 0px #adadad', width: '290px'}}
        visible={expanded}
        overlay={
          <div className={st.popup}>
            <Tabs defaultActiveKey="1" onChange={() => {setPosition('flex-start');setSrc('')}}>
              <TabPane tab="本地视频" key="1">
                <input
                  onChange={onFileChange}
                  accept="mp4"
                  type="file"
                />
                <Radio.Group onChange={(e) => setPosition(e.target.value)} value={position} style={{margin: '18px 0'}}>
                  <Radio value={'flex-start'}>靠左</Radio>
                  <Radio value={'center'}>居中</Radio>
                  <Radio value={'flex-end'}>靠右</Radio>
                </Radio.Group>
              </TabPane>
              <TabPane tab="在线视频" key="2">
                <p style={{marginBottom: '7px'}}>视频地址：</p>
                <Input value={src} onChange={(e) => setSrc(e.target.value)}></Input>
                <Radio.Group onChange={(e) => setPosition(e.target.value)} value={position} style={{margin: '18px 0'}}>
                  <Radio value={'flex-start'}>靠左</Radio>
                  <Radio value={'center'}>居中</Radio>
                  <Radio value={'flex-end'}>靠右</Radio>
                </Radio.Group>
              </TabPane>
            </Tabs>
            <Button disabled={src.length == 0} onClick={addVideo} type='primary' size='small' style={{marginRight: '16px', marginLeft: '10px'}}>确认</Button>
            <Button onClick={() => setExpanded(false)} size='small'>取消</Button>
          </div>
        }
      >
        <div onClick={() => {setExpanded(!expanded)}} className={st.icon}>添加</div>
      </Dropdown>
    </div>
  );
}

export default VideoRenderer