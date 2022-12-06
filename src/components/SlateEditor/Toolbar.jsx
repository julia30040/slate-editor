import React, { useCallback } from "react";
import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import { useSlate } from "slate-react";
import FontAwesome from "react-fontawesome";

import {
  CustomEditor,
  TEXT_ALIGN_TYPES,
  LIST_TYPES,
  DEFAULT_NODE,
} from "../../utils/CustomEditor.js";
import { Tooltip } from "../Tooltip";
import clearIcon from "../../assets/icon-clear.svg";

/**
 * Render a mark-toggling toolbar button.
 *
 * @param {String} type - custom name of node type defined by ourselves,
 *                        just for understanding. e.g. paragraph, block-quote.
 * @param {Element} icon - react element to be shown as button icon
 * @return {Element}
 */
const MarkButton = ({ format, icon, tooltipText }) => {
  const editor = useSlate();

  const isActive = CustomEditor.isMarkActive(editor, format);

  return (
    <Tooltip placement="bottom" overlay={tooltipText}>
      <button
        type="button"
        className="button btn btn-default btn-sm"
        onMouseDown={() => CustomEditor.toggleMark(editor, format)}
        data-active={isActive}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

const BlockButton = ({ format, icon, tooltipText }) => {
  const editor = useSlate();
  return (
    <Tooltip placement="bottom" overlay={tooltipText}>
      <button
        type="button"
        className="button btn btn-default btn-sm"
        data-active={CustomEditor.isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, format);
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

const LinkButton = ({ onLinkModalOpen }) => {
  const editor = useSlate();
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === "link",
  });
  const hasLinks = !!match;

  /**
   * 點擊超連結按鈕的 handler
   * 假設選取的範圍有超連結，那就會移除掉超連結，不然就會跳出 Dialog，給使用者新增超連結
   *
   * @param {Event} event
   */
  const handleMouseDown = (event) => {
    event.preventDefault();

    if (hasLinks) {
      CustomEditor.removeLink(editor);
    } else {
      onLinkModalOpen({
        showTextInput: Range.isCollapsed(editor.selection),
      });
    }
  };
  return (
    <Tooltip placement="bottom" overlay="超連結">
      <button
        type="button"
        className="button btn btn-default btn-sm"
        onMouseDown={handleMouseDown}
        data-active={hasLinks}
      >
        <FontAwesome name="link" />
      </button>
    </Tooltip>
  );
};

export const Toolbar = ({ onLinkModalOpen }) => {
  const editor = useSlate();

  return (
    <div className="toolbar-menu">
      <div className="button-group">
        <div className="flex">
          <MarkButton
            format="bold"
            icon={<FontAwesome name="bold" />}
            tooltipText="粗體 (⌘+B)"
          />
          <MarkButton
            format="italic"
            icon={<FontAwesome name="italic" />}
            tooltipText="斜體 (⌘+I)"
          />
          <BlockButton
            format="pre"
            icon={<FontAwesome name="code" />}
            tooltipText="程式碼區塊"
          />
          <BlockButton
            format="heading-four"
            icon={<FontAwesome name="header" />}
            tooltipText="標題"
          />
          <BlockButton
            format="block-quote"
            icon={<FontAwesome name="quote-right" />}
            tooltipText="引用區塊"
          />
          <Tooltip placement="bottom" overlay="清除格式">
            <button
              type="button"
              className="button btn btn-default btn-sm"
              onClick={(e) => {
                e.preventDefault();
                CustomEditor.clearFormat(editor);
              }}
            >
              <img src={clearIcon} alt="clear format icon" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="button-group">
        <div className="flex">
          <BlockButton
            format="numbered-list"
            icon={<FontAwesome name="list-ol" />}
            tooltipText="編號清單"
          />
          <BlockButton
            format="bulleted-list"
            icon={<FontAwesome name="list" />}
            tooltipText="項目清單"
          />
        </div>
      </div>
      <div className="button-group">
        <div className="flex">
          <LinkButton onLinkModalOpen={onLinkModalOpen} />
          {/* {this.renderImageUploadButton()}
          {this.renderButton(
            this.onClickGiphy,
            <FontAwesome name="giphy" />,
            "Giphy",
            "giphy-button"
          )}
          {this.renderButton(
            this.onClickYoutube,
            <FontAwesome name="youtube-play" />,
            "Youtube",
            "youtube-button"
          )}
          {this.renderButton(
            this.onClickVimeo,
            <FontAwesome name="vimeo-square" />,
            "Vimeo",
            "vimeo-button"
          )}
          {this.renderButton(
            this.onClickMixCloud,
            <FontAwesome name="mixcloud" />,
            "Mixcloud",
            "mixcloud-button"
          )}
          {this.renderButton(
            this.onClickSoundCloud,
            <FontAwesome name="soundcloud" />,
            "Soundcloud",
            "soundcloud-button"
          )} */}
        </div>
      </div>
      {/* {this.renderFullScreenButton()} */}
    </div>
  );
};
