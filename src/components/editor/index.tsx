import React from 'react';
import {
  ContentBlock,
  Editor as DraftEditor,
  RawDraftContentState,
} from 'react-draft-wysiwyg';
import { EditorState, Entity, AtomicBlockUtils, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { uploadFile } from '@/utils/request';
import VideoRenderer from './video';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IProps {
  setHtmlString?: (html: string) => void;
  initValue?: string;
}
interface IState {
  editorContent: RawDraftContentState | undefined;
  editorState: EditorState | undefined;
}

// 媒体元素渲染
const Media = (props: any) => {
  const key = props.block.getEntityAt(0);
  if (!key) {
    return null;
  }
  const entity = Entity.get(key);
  const data = entity.getData();
  const type = entity.getType();
  if (type.toLocaleLowerCase() === 'image') {
    return (
      <img className="content_image" src={data.src} alt="用户上传的图片" />
    );
  } else if (type.toLocaleLowerCase() === 'video') {
    return (
      <div style={{ display: 'flex', justifyContent: data.position }}>
        <video controls src={data.src} />
      </div>
    );
  }
  return null;
};

// 自定义渲染器
const mediaBlockRenderer = (block: ContentBlock) => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
};

const toobarOptions = {
  image: {
    uploadCallback: async (data: File) => {
      const res = await uploadFile(data);
      return new Promise((r) => r({ data: { link: res.url } }));
    },
    previewImage: true,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
  },
  colorPicker: {
    // icon: color,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    colors: ['#22334a', '#c8d2e2', '#f69c44'],
  },
};

// 自定义draftjs-to-html转换函数
const customEntityTransform = (a: any, b: any) => {
  if (a.type == 'video') {
    return `<video controls src='${a.data.src}'></video>`;
  }
};
export default class ArticleEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      editorContent: {
        blocks: [],
        entityMap: {},
      },
      editorState: undefined,
    };
  }
  componentDidMount() {
    const { initValue } = this.props;
    if (initValue) {
      const contentBlock = htmlToDraft(initValue);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    }
  }
  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.initValue !== nextProps.initValue && nextProps.initValue) {
      // 匹配富文本编辑器格式，回显保存的内容
      const contentBlock = htmlToDraft(nextProps.initValue);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    }
  }
  //清空文本
  handleClearContent = () => {
    this.setState({
      editorState: undefined,
    });
  };
  //获取html格式文本内容
  handleGetText = () => {
    if (this.state.editorContent) {
      alert(draftToHtml(this.state.editorContent));
    }
  };

  //编辑器的状态
  onEditorStateChange = (editorState: EditorState) => {
    this.setState(
      {
        editorState,
      },
      () => {
        if (this.state.editorContent) {
          this.props.setHtmlString &&
            this.props.setHtmlString(
              draftToHtml(
                this.state.editorContent,
                undefined,
                undefined,
                customEntityTransform,
              ),
            );
        }
      },
    );
  };
  //编辑器文本框内容
  onContentStateChange = (editorContent: RawDraftContentState) => {
    this.setState({
      editorContent,
    });
  };
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <DraftEditor
          editorState={editorState}
          customBlockRenderFunc={mediaBlockRenderer}
          onEditorStateChange={this.onEditorStateChange}
          onContentStateChange={this.onContentStateChange}
          toolbarCustomButtons={[<VideoRenderer />]}
          toolbar={toobarOptions}
          localization={{ locale: 'zh' }}
          placeholder="请输入内容..."
        />
      </div>
    );
  }
}
