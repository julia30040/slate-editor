import React, { useState } from "react";
// import styled from "styled-components";
// import { color, SCREEN_SIZE, typography } from "../../styles/theme";
import { useSlate } from "slate-react";
import { CustomEditor } from "../utils/CustomEditor";
import { editorJoiSchema } from "../utils/validator";

import LinkInputDialog from "./LinkInputDialog";

export const InputDialog = ({
  openedType,
  initialValues = {
    dialogValue: "",
    dialogUrl: "",
    dialogText: "",
    openInNewWindow: false,
    showTextInput: false,
  },
  onSubmit,
  onClose,
}) => {
  const editor = useSlate();
  // initialValues = {
  // // 以下四個都是儲存 dialog 裡面值的變數用
  //   dialogValue: "",
  //   dialogUrl: "",
  //   dialogText: "",
  //   openInNewWindow: true,
  //   showTextInput: true,
  // }

  const [dialogValue, setDialogValue] = useState(initialValues.dialogValue);
  const [dialogUrl, setDialogUrl] = useState(initialValues.dialogUrl);
  const [dialogText, setDialogText] = useState(initialValues.dialogText);
  const [openInNewWindow, setOpenInNewWindow] = useState(
    initialValues.openInNewWindow
  );
  const { showTextInput } = initialValues;

  const onChange = (e) => setDialogValue(e.target.value);
  const onChangeUrl = (e) => setDialogUrl(e.target.value);
  const onChangeText = (e) => setDialogText(e.target.value);
  const onChangeOpenInNewWindow = (e) => setOpenInNewWindow(e.target.checked);
  /** This is a workaround solution：在關閉 Dialog 的那瞬間不知道為什麼
   * 不能同時改變 editor 的值，所以這邊讓 Dialog 晚點關閉。 */
  // const onClose = () => {
  //   window.setTimeout(() => {
  //     // this.setState({ openedDialog: null });
  //     onClose()
  //   }, 100);
  // };

  const handleClose = () => {
    // TODO: reset states
    // setDialogValue()
    onClose();
  };

  console.log({ openedType });
  switch (openedType) {
    case "link":
      return (
        <LinkInputDialog
          isOpen
          showTextInput={showTextInput}
          title="插入連結"
          url={dialogUrl}
          text={dialogText}
          openInNewWindow={openInNewWindow}
          urlValidate={editorJoiSchema.url}
          textValidate={editorJoiSchema.text}
          onChangeUrl={onChangeUrl}
          onChangeText={onChangeText}
          onChangeOpenInNewWindow={onChangeOpenInNewWindow}
          onClose={handleClose}
          onSubmit={() => {
            CustomEditor.addLink(editor, {
              href: dialogUrl,
              text: dialogText,
              openInNewWindow: openInNewWindow,
            });
            handleClose();
          }}
        />
      );
    case "edit-link":
      return (
        <LinkInputDialog
          isOpen
          showTextInput={showTextInput}
          title="編輯連結"
          url={dialogUrl}
          text={dialogText}
          openInNewWindow={openInNewWindow}
          urlValidate={editorJoiSchema.url}
          textValidate={editorJoiSchema.text}
          onChangeUrl={onChangeUrl}
          onChangeText={onChangeText}
          onChangeOpenInNewWindow={onChangeOpenInNewWindow}
          onClose={handleClose}
          onSubmit={() => {
            CustomEditor.updateLink(editor, {
              href: dialogUrl,
              openInNewWindow,
            });
            handleClose();
          }}
        />
      );
    // case "giphy":
    //   return (
    //     <InputDialog
    //       title="請輸入 Giphy 網址"
    //       text="範例：https://giphy.com/gifs/oooxxx/html5"
    //       value={dialogValue}
    //       isOpen
    //       validate={editorJoiSchema.giphyUrl}
    //       onChange={onChange}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         this.insertGiphy(dialogValue);
    //         onClose();
    //       }}
    //     />
    //   );
    // case "youtube":
    //   return (
    //     <InputDialog
    //       title="請輸入 Youtube 網址"
    //       text="範例：https://www.youtube.com/watch?v=oooxxx 或 https://youtu.be/oooxxx 或 https://www.youtube.com/embed/oooxxx"
    //       value={dialogValue}
    //       isOpen
    //       validate={editorJoiSchema.youtubeUrl}
    //       onChange={onChange}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         this.insertYoutube(dialogValue);
    //         onClose();
    //       }}
    //     />
    //   );
    // case "vimeo":
    //   return (
    //     <InputDialog
    //       title="請輸入 Vimeo 網址"
    //       text="範例：https://vimeo.com/12345678 或 https://player.vimeo.com/video/12345678"
    //       value={dialogValue}
    //       isOpen
    //       validate={editorJoiSchema.vimeoUrl}
    //       onChange={onChange}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         this.insertVimeo(dialogValue);
    //         onClose();
    //       }}
    //     />
    //   );
    // case "mixcloud":
    //   return (
    //     <InputDialog
    //       title="請輸入 MixCloud 網址"
    //       text="範例：https://www.mixcloud.com/ooo/xxx/"
    //       value={dialogValue}
    //       isOpen
    //       validate={editorJoiSchema.mixCloudUrl}
    //       onChange={onChange}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         this.insertMixCloud(dialogValue);
    //         onClose();
    //       }}
    //     />
    //   );
    // case "soundcloud":
    //   return (
    //     <InputDialog
    //       title="請輸入 SoundCloud 網址"
    //       text="範例：https://soundcloud.com/ooo/xxx"
    //       value={dialogValue}
    //       isOpen
    //       validate={editorJoiSchema.soundCloudUrl}
    //       onChange={onChange}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         this.insertSoundCloud(dialogValue);
    //         onClose();
    //       }}
    //     />
    //   );

    // case "edit-image-info":
    //   return (
    //     <LinkInputDialog
    //       isOpen
    //       showTextInput={showTextInput}
    //       title="編輯圖片"
    //       url={dialogUrl}
    //       text={dialogText}
    //       openInNewWindow={openInNewWindow}
    //       urlValidate={(input) => !input || editorJoiSchema.url(input)}
    //       textValidate={() => true}
    //       onChangeUrl={onChangeUrl}
    //       onChangeText={onChangeText}
    //       onChangeOpenInNewWindow={onChangeOpenInNewWindow}
    //       onClose={onClose}
    //       onSubmit={() => {
    //         const node = value.document.getNode(
    //           editNodeKey
    //         );
    //         const src = node ? node.data.get("src") : "";
    //         this.editImageInfo(
    //           editNodeKey,
    //           dialogText,
    //           src,
    //           dialogUrl,
    //           openInNewWindow
    //         );
    //         onClose();
    //       }}
    //     />
    //   );
    default:
      return null;
  }
};
