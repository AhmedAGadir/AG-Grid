function RichTextRenderer() { }

RichTextRenderer.prototype.init = function (params) {
    var offset = 120;
    var img = document.createElement('img');
    img.src = params.data.imageUrl;
    img.addEventListener('load', () => {
        params.node.setRowHeight(img.height + offset);
        params.api.onRowHeightChanged();
    })

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = getRichText();
    this.eGui.appendChild(img);
}

RichTextRenderer.prototype.getGui = function () {
    return this.eGui;
}

function getRichText() {
    const str = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum deserunt maiores nobis, tempora repellat libero asperiores blanditiis dignissimos dolore dolorem excepturi perspiciatis. Necessitatibus officiis error nisi veritatis delectus, ipsum et.Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum deserunt maiores nobis, tempora repellat libero asperiores blanditiis dignissimos dolore dolorem excepturi perspiciatis. Necessitatibus officiis error nisi veritatis delectus, ipsum et.';
    const randInd = Math.floor(Math.random() * str.length);
    const richText = `
    <div style="white-space: normal !important">
        ${str.slice(0, randInd)}
    </div>
  `
    return richText;
}