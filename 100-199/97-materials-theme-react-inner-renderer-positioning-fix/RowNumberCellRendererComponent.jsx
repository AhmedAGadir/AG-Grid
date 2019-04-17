import React from "react";

export default class RowNumberCellRendererComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    refresh(params) {
        return false;
    }

    render() {
        var icon = this.getFileIcon(this.props.value);
        console.log(icon);
        return (
            <div><i class={icon}></i> {this.props.value}</div>
        );
    }
    
    getFileIcon(filename) {
      return filename.endsWith(".mp3") || filename.endsWith(".wav")
        ? "fa fa-file-audio-o"
        : filename.endsWith(".xls")
          ? "fa fa-file-excel-o"
          : filename.endsWith(".txt")
            ? "fa fa fa-file-o"
            : filename.endsWith(".pdf")
              ? "fa fa-file-pdf-o"
              : "fa fa-folder";
    }
}
