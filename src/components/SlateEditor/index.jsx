import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import { Toolbar } from "./Toolbar";
import { ZINDEX, typography, color, opacity } from "../../styles/theme";
import { Leaf } from "./Leaf";
import { Element } from "./Element";
import gifImageURL from "../../assets/icon-gif.png";
import GlobalStyleDiv from "../../styles/global.style";
import { InputDialog } from "../InputDialog";
import { CustomEditor } from "../../utils/CustomEditor";

/**
 * TODO: 整併 styles
 * 1. GlobalStyleDiv
 * 2. Wrapper: 包含 RichTextView.style.js 與 SlateEditor.style.js
 */
const Wrapper = styled.div`
  /** RichTextView.style.js start */
  display: block;
  user-select: text;
  word-break: break-all;

  p,
  h4,
  li,
  a,
  pre {
    word-break: break-word;
    word-wrap: normal;
    white-space: pre-wrap;
  }

  p {
    margin: 16px 0;
    padding: 0;
  }

  /*
    這個 style 主要是解決在把 rich text 塞到 DOM 裡面顯示的時候，
    連續空白的 <p></p> 不會換行的問題。
    ref: https://github.com/hahow/hh-frontend-react/pull/2069

    但這個 style 在 slate editor 的編輯模式的時候，必須移除。
    否則碰到多個空的 paragraph 的時候，鍵盤向下的按鈕會失效。
  */
  p::after {
    content: " ";
  }

  pre {
    font-size: ${typography.font.size.sm};
    line-height: 1.8em;
    margin: 24px 0;
    padding: 8px 16px;
    border-radius: 0;
    border: 0;
    background-color: ${color.gray.lighter};
  }

  /*
    為了讓兩個相鄰的 pre 中間的距離是 8px
  */
  pre + pre {
    margin-top: -16px;
  }

  a {
    color: ${color.brand.primary.base};
    border-bottom: 1px solid ${color.brand.primary.base};

    &:visited,
    &:focus {
      color: ${color.brand.primary.base};
      border-bottom: 1px solid ${color.brand.primary.base};
    }
    &:hover {
      color: ${color.brand.primary.dark};
      border-bottom: 1px solid transparent;
    }
    &:active {
      color: ${color.brand.primary.light};
      border-bottom: 1px solid ${color.brand.primary.base};
    }
  }

  ol,
  ul {
    padding-left: 20px;
    margin: 24px 0;
  }

  ol > li {
    list-style: decimal;
  }

  ul > li {
    list-style: disc;
  }

  img,
  iframe {
    width: 100%;
  }

  h4 {
    text-align: left;
    margin-bottom: 16px;
    margin-top: 40px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, ${opacity.lower});
  }

  img {
    margin: 24px 0;
  }

  blockquote {
    color: ${typography.font.color.dark};
    font-size: 18px;
    letter-spacing: 0.1em;
    margin: 24px 0;
    padding: 2px 0 2px 16px;
    border-left: 5px solid ${color.brand.primary.base};
  }

  .video-container {
    margin: 24px 0;
  }
  /**  RichTextView style end*/

  /* override dropdown menu */
  .dropdown-menu {
    padding: 0;
    width: 350px;
    a {
      border-bottom: none;
      padding: 20px;
      > :not(pre):not(h4) {
        margin: 0;
        padding: 0;
      }
    }
    li {
      list-style: none;
    }
    h4 {
      margin-bottom: 12px;
      padding-bottom: 12px;
      padding-top: 30px;
      border-bottom: 1px solid rgba(0, 0, 0, ${opacity.lower});
    }
    blockquote {
      padding-left: 50px;
    }
  }

  /* override dropdown end */
  form.ng-invalid.ng-touched .note-editor {
    border-color: ${color.error};
  }

  .note-popover .popover .popover-content {
    padding: 10px;
  }

  .note-popover .popover .popover-content > .btn-group {
    margin: 0;
  }

  .note-editor {
    color: ${typography.font.color.base} !important;
    min-height: 400px;
    img {
      width: 100% !important;
      padding: 20px 0;
    }
    &.fullscreen {
      .note-icon-arrows-alt::before {
        content: "";
        font-family: FontAwesome;
      }
    }
    .note-editing-area
      .note-editable[contenteditable="true"]:empty:not(:focus)::before {
      color: ${typography.font.color.lightest} !important;
    }
  }

  .note-image-popover {
    top: 0 !important;
    right: 10px;
    left: auto !important;
    background: transparent;
    border: none;
    br {
      display: none;
    }

    .arrow {
      display: none;
    }

    .popover-content > .btn-group {
      display: none;
    }

    .popover-content > .btn-group:last-child {
      display: block;
    }
  }

  .note-image-dialog .form-group:not(.note-group-select-from-files) {
    display: none;
  }

  .note-control-selection-info {
    display: none;
  }

  .note-control-se {
    border-top: none !important;
    border-left: none !important;
    background: none !important;
  }
  .btn {
    background-color: #2e3138;
    color: white;
    &:hover {
      background-color: ${color.brand.primary.base};
      color: white;
    }
  }
  .note-editor.note-frame .note-editing-area .note-editable {
    color: ${typography.font.color.base};
  }

  .invalidation {
    color: ${color.error};
    display: none;
  }

  .btn {
    height: 36px;
    min-width: 36px;
  }
  .fa-giphy {
    background-image: url(${gifImageURL});
    width: 22px;
    height: 24px;
    background-size: 22px 24px;
    margin-left: -2px;
    margin-top: 1px;
  }

  .video-container {
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    padding-top: 56.2%;

    iframe,
    video {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border: none;
    }
  }

  /** RichTextView.style.js end */

  /** SlateEditor.style.js start */
  background-color: white;
  border: 1px solid
    ${(props) => {
      if (props.error) {
        return color.error;
      }
      return "#a9a9a9";
    }};
  border-radius: 3px;

  /*
    這邊必須要把 p::after 的 content 移除掉，要不然 slate editor
    碰到多個空的 paragraph 的時候，鍵盤向下的按鈕會失效
  */
  p::after {
    content: none;
  }

  .slate-full-screen-mode {
    background-color: white;
    position: fixed;
    left: 0;
    top: 55px;
    width: 100%;
    height: 100%;
    z-index: ${ZINDEX.slate_full_screen};
  }

  .toolbar-menu {
    padding: 5px 10px 0;
    margin: 0;
    background-color: #f5f5f5;
    border-color: #ddd;
    position: relative;
    border-bottom: 1px solid #ddd;
  }

  .toolbar-menu .button {
    border-radius: 3px !important;
    border: none;
    margin-left: 3px;

    &:first-child {
      margin-left: 0;
    }
    &[data-active="true"] {
      background-color: #fa8b00;
    }
    &:focus {
      outline: 0;
    }
    .fa {
      font-size: 14px;
    }
    img {
      margin-top: 9px;
      width: 16px;
      height: auto;
    }
  }

  .toolbar-menu {
    .button-group {
      display: inline-block;
      margin-bottom: 5px;
      &:first-child {
        margin-right: 12px;
      }
    }
    .button-group + .button-group {
      margin-right: 12px;
    }
    .button-group:last-of-type {
      margin-right: 45px;
    }
  }

  .toolbar-menu .full-screen-btn {
    position: absolute;
    right: 10px;
    top: 5px;
  }

  .toolbar-menu .button .click-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar-menu .button .fa-giphy {
    width: 18px;
    height: 20px;
    background-size: 18px 20px;
    margin-left: -2px;
    margin-top: 7px;
  }

  .toolbar-menu .button .fa-mixcloud {
    width: 14px;
    margin-left: -2px;
  }

  .no-style-container {
    padding: 0;
    margin: 0;
    border: 0;
    display: inline-block;
    &:focus {
      outline: 0;
    }
  }

  .editing-area {
    padding: 0 24px 5px;
    resize: vertical;
    overflow: auto;
    height: ${(props) => (props.height ? `${props.height}px` : "350px")};
    /* walkaround for resolving blinking problem of youtube iframe in editor */
    transform: translate3d(0, 0, 0);

    .slate-editor {
      height: 100%;

      img:hover {
        opacity: 0.8;
        outline: 3px solid blue;
      }

      img.active {
        opacity: 1;
        outline: 3px solid blue;
      }
    }
  }

  .slate-full-screen-mode .editing-area {
    height: 100%;
  }

  .flex {
    display: flex;
  }
  /** SlateEditor.style.js end */
`;

const initialValue = [
  {
    type: "block-quote",
    children: [
      {
        text: "A line of ",
      },
      {
        text: "text",
        bold: true,
        italic: true,
      },
      {
        text: " in a paragraph.",
      },
    ],
  },
  {
    type: "heading-four",
    children: [
      {
        text: "標題",
      },
    ],
  },
  {
    type: "pre",
    children: [
      {
        text: "Hello 你好嗎衷心感謝～",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "提供自我介紹或所屬團隊介紹（可以",
          },
          {
            type: "link",
            href: "https://hahow.in",
            target: "_blank",
            children: [
              {
                text: "使用",
              },
            ],
          },
          {
            text: "真名、暱稱或教學慣用的藝名）",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "提供個人網站、粉絲團或其他可讓學生更進一步了解授課老師背景的公開頁面，讓學生更近一步了解授課老師的背景的公開頁面，讓學生更近一步了解授課老師的背景",
          },
        ],
      },
    ],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "註 1：",
            bold: true,
          },
          {
            text: "避免提供資訊非公開權限的個人臉書",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "註 2：\\我們這一家/",
          },
        ],
      },
    ],
  },
];

const withInlines = (editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    ["link"].includes(element.type) || isInline(element);

  return editor;
};

const dialogInitialState = {
  type: null,
  initialValues: null,
};

export const SlateEditor = () => {
  const [editor] = useState(() =>
    withInlines(withReact(withHistory(createEditor())))
  );
  // const [modalInfo, setModalInfo] = useState({
  //   // 目前打開的 dialog 的名字
  //   currentOpenDialog: null,
  //   // 以下四個都是儲存 dialog 裡面值的變數用
  //   dialogValue: "",
  //   dialogUrl: "",
  //   dialogText: "",
  //   openInNewWindow: true,
  //   showTextInput: true,
  //   // 從編輯器選擇 node 要編輯時會到
  //   editNodeKey: null,
  // });

  // stateValue = { type: 'link', initialValues: {} }
  const [openedDialog, setOpenedDialog] = useState(dialogInitialState);

  console.log({ editor });
  const handleEditDialogOpen = useCallback(({ type, initialValues }) => {
    setOpenedDialog({
      type,
      initialValues,
    });
  }, []);

  const renderElement = useCallback((props) => {
    return <Element {...props} onEditDialogOpen={handleEditDialogOpen} />;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const handleLinkModalOpen = ({ showTextInput }) => {
    setOpenedDialog({
      type: "link",
      initialValues: {
        showTextInput,
        openInNewWindow: true,
      },
    });
  };

  // const handleDialogSubmit = ({ dialogUrl, dialogText, openInNewWindow }) => {
  //   switch (openedDialog.type) {
  //     case "link":
  //       CustomEditor.addLink(editor, {
  //         url: dialogUrl,
  //         text: dialogText,
  //         openInNewWindow: openInNewWindow,
  //       });
  //       break;
  //     default:
  //       console.warn("未處理的 openedDialog.type");
  //       break;
  //   }
  // };

  const handleDialogClose = () => {
    window.setTimeout(() => {
      setOpenedDialog(dialogInitialState);
    }, 100);
  };

  console.log({ openedDialog });

  return (
    <GlobalStyleDiv>
      <Wrapper>
        <Slate editor={editor} value={initialValue}>
          <Toolbar editor={editor} onLinkModalOpen={handleLinkModalOpen} on />
          <div className="editing-area">
            <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
          </div>
          {openedDialog.type && (
            <InputDialog
              openedType={openedDialog.type}
              initialValues={openedDialog.initialValues}
              // onSubmit={handleDialogSubmit}
              onClose={handleDialogClose}
            />
          )}
        </Slate>
      </Wrapper>
    </GlobalStyleDiv>
  );
};
