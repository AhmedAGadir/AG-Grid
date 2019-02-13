function RichTextRenderer() { }

RichTextRenderer.prototype.init = function (params) {
    var offset = 120;
    var img = document.createElement('img');
    img.src = params.data.imageUrl;
    if (!params.node.imageLoaded) {
        img.addEventListener('load', () => {
            console.log('setting row height for node: ' + params.rowIndex);
            params.node.imageLoaded = true;
            params.node.setRowHeight(img.height + offset);
            // debouncedRowHeightChanged(params);
        })
    }

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = getRichText();
    this.eGui.appendChild(img);

    window.params = params;
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

// const debouncedRowHeightChanged = debounce((params) => {
//     console.log('debouncedRowHeightChanged', params.rowIndex)
//     params.api.onRowHeightChanged();
// }, 500);

function debounce (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};