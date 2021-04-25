import React from 'react'
import { ContentBlock, Editor as DraftEditor, EditorState, RawDraftContentState} from 'react-draft-wysiwyg'
import { Modifier, Editor } from 'draft-js';
import draftjs from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
 

interface IState {
  editorContent: RawDraftContentState | undefined,
  editorState: EditorState | undefined,
}

const Video: React.FC<{src?: string}> = (props) => {
  return <video controls src={'props.src'} />;
};

function mediaBlockRenderer(block: ContentBlock) {
  console.log(block)
  if (block.getType() === 'atomic') {
    return {
      component: Video,
      editable: false,
    };
  }
  return null;
}

class CustomOption extends React.Component {
  addVideo: Function = (): void => {
    const { editorState, onChange } = this.props as {
      editorState: EditorState,
      onChange: (data: EditorState) => void
    };
    // const contentState = Modifier.replaceText(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   `<video src="https://vd3.bdstatic.com/mda-kahje543cjudrw4k/v1-cae/sc/mda-kahje543cjudrw4k.mp4?v_from_s=nj_haokan_4469&auth_key=1619087461-0-0-12a0a9008485976688691e2fa3314c11&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_1"></video>`,
    //   editorState.getCurrentInlineStyle(),
    // );
    const contentState = Modifier.applyEntity(editorState.getCurrentContent(), editorState.getSelection(), 'atomic')
    EditorState
    // const contentState = Modifier.
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  render() {
    return (
      <div onClick={() => {this.addVideo()}}>视频</div>
    );
  }
}

const toobarOptions = {
  image: {
    uploadCallback: (data: File) => {
      return new Promise((resolve) => {
        const formData = new FormData();
        const request = new XMLHttpRequest();
        formData.append("image", data);
        request.open("POST", 'imageUploadUrl');
        request.onload = () => {
          console.log(request.response)
          resolve({ data: { link: 'http://img1.sycdn.imooc.com/5939663c000133f904850387.jpg'}})
        }
        request.send(formData);
      })
    },
    previewImage: true,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
  }
}


export default class ArticleEditor extends React.Component<{},IState>{
    state = {
        editorContent: {
          blocks: [],
          entityMap:{}
        },
        editorState: undefined
    }
    //清空文本
    handleClearContent = () => {  
        this.setState({
            editorState: undefined
        })
    }
    //获取html格式文本内容
    handleGetText = () => {    
        alert(draftjs(this.state.editorContent))
    }
    //编辑器的状态
    onEditorStateChange = (editorState: EditorState) => {   
        this.setState({
            editorState
        })
    }
    //编辑器文本框内容
    onContentStateChange = (editorContent: RawDraftContentState) => {   
        this.setState({
            editorContent
        })
    }
    render(){
        const { editorState } = this.state;
        return (
          <div>
            <DraftEditor
              editorState= {editorState}
              customBlockRenderFunc={mediaBlockRenderer}
              // customDecorators={}
              onEditorStateChange= {this.onEditorStateChange}
              onContentStateChange= {this.onContentStateChange}
              toolbarCustomButtons={[<CustomOption />]}
              toolbar= { toobarOptions }
              localization= {{ locale: 'zh'}}
              placeholder="请输入内容..."
            />
          </div>
        )
    }
}　　