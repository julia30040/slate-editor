import React, { Component } from "react";
import PropTypes from "prop-types";

import Dialog from "./Dialog";
import Button from "./Button";
import { ValidateInput } from "./Input";

class LinkInputDialog extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired, // currently open or not
    showTextInput: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    introText: PropTypes.string,
    url: PropTypes.string,
    text: PropTypes.string,
    openInNewWindow: PropTypes.bool.isRequired,
    urlValidate: PropTypes.func.isRequired,
    textValidate: PropTypes.func.isRequired,
    onChangeUrl: PropTypes.func.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onChangeOpenInNewWindow: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    introText: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      urlIsValid: props.urlValidate(props.url),
      textIsValid: props.textValidate(props.text),
    };
  }

  componentDidMount() {
    if (this.urlInput) {
      this.urlInput.focus();
    }
  }

  onChangeUrl = (event) => {
    this.setState({
      urlIsValid: true,
    });
    this.props.onChangeUrl(event);
  };

  onChangeText = (event) => {
    this.setState({
      textIsValid: true,
    });
    this.props.onChangeText(event);
  };

  onFailUrl = () => {
    this.setState({
      urlIsValid: false,
    });
  };

  onFailText = () => {
    this.setState({
      textIsValid: false,
    });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter" && this.state.urlIsValid) {
      if (this.props.showTextInput) {
        if (this.state.textIsValid) {
          this.props.onSubmit();
        }
      } else {
        this.props.onSubmit();
      }
    }
  };

  renderUrlInput = () => {
    const { url, urlValidate } = this.props;
    return (
      <div className="input-wrapper" style={{ marginBottom: "5px" }}>
        <span>連結：</span>
        <ValidateInput
          type="text"
          value={url}
          onChange={this.onChangeUrl}
          validate={urlValidate}
          onFail={this.onFailUrl}
          errorMsg="以 http:// 或 https:// 開頭"
          inputRef={(c) => {
            this.urlInput = c;
          }}
          onKeyPress={this.props.showTextInput ? () => {} : this.handleKeyPress}
        />
      </div>
    );
  };

  renderTextInput = () => {
    const { text, textValidate } = this.props;
    return (
      <div className="input-wrapper" style={{ marginBottom: "5px" }}>
        <span>顯示文字：</span>
        <ValidateInput
          type="text"
          value={text}
          onChange={this.onChangeText}
          validate={textValidate}
          onFail={this.onFailText}
          errorMsg="請填入至少一個字"
          onKeyPress={this.props.showTextInput ? this.handleKeyPress : () => {}}
        />
      </div>
    );
  };

  render() {
    const {
      isOpen,
      showTextInput,
      title,
      introText,
      openInNewWindow,
      onChangeOpenInNewWindow,
      onClose,
      onSubmit,
    } = this.props;

    return (
      <Dialog open={isOpen} width="500px" title={title} onClose={onClose}>
        <div
          style={{
            paddingLeft: "40px",
            paddingRight: "40px",
            paddingBottom: "20px",
          }}
        >
          <p style={{ marginBottom: "15px" }}>{introText}</p>
          {this.renderUrlInput()}
          {showTextInput ? this.renderTextInput() : null}
          <div style={{ marginBottom: "20px" }}>
            <input
              id="open-in-new-window"
              type="checkbox"
              onChange={onChangeOpenInNewWindow}
              checked={openInNewWindow}
            />
            <label htmlFor="open-in-new-window" style={{ marginLeft: "10px" }}>
              {" "}
              在新視窗開啟{" "}
            </label>
          </div>
          <Button
            disabled={
              !this.state.urlIsValid ||
              (!this.state.textIsValid && showTextInput)
            }
            style={{ marginTop: "15px" }}
            onClick={onSubmit}
            size="md"
            block
          >
            送出
          </Button>
        </div>
      </Dialog>
    );
  }
}

export default LinkInputDialog;
