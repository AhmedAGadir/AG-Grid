var store = {
    rowData: [
        { id: 1, filePath: ['Documents'], type: 'folder' },
        { id: 2, filePath: ['Documents', 'txt'], type: 'folder' },
        {
            id: 3,
            filePath: ['Documents', 'txt', 'notes.txt'],
            type: 'file',
            dateModified: 'May 21 2017 01:50:00 PM',
            size: 14.7,
        },
        { id: 4, filePath: ['Documents', 'pdf'], type: 'folder' },
        {
            id: 5,
            filePath: ['Documents', 'pdf', 'book.pdf'],
            type: 'file',
            dateModified: 'May 20 2017 01:50:00 PM',
            size: 2.1,
        },
        {
            id: 6,
            filePath: ['Documents', 'pdf', 'cv.pdf'],
            type: 'file',
            dateModified: 'May 20 2016 11:50:00 PM',
            size: 2.4,
        },
        { id: 7, filePath: ['Documents', 'xls'], type: 'folder' },
        {
            id: 8,
            filePath: ['Documents', 'xls', 'accounts.xls'],
            type: 'file',
            dateModified: 'Aug 12 2016 10:50:00 AM',
            size: 4.3,
        },
        { id: 9, filePath: ['Documents', 'stuff'], type: 'folder' },
        {
            id: 10,
            filePath: ['Documents', 'stuff', 'xyz.txt'],
            type: 'file',
            dateModified: 'Jan 17 2016 08:03:00 PM',
            size: 1.1,
        },
        { id: 11, filePath: ['Music'], type: 'folder' },
        { id: 12, filePath: ['Music', 'mp3'], type: 'folder' },
        {
            id: 13,
            filePath: ['Music', 'mp3', 'theme.mp3'],
            type: 'file',
            dateModified: 'Sep 11 2016 08:03:00 PM',
            size: 14.3,
        },
        { id: 14, filePath: ['Misc'], type: 'folder' },
        {
            id: 15,
            filePath: ['Misc', 'temp.txt'],
            type: 'file',
            dateModified: 'Aug 12 2016 10:50:00 PM',
            size: 101,
        },
    ],
};

var gridOptions = {
    defaultColDef: {
        resizable: true,
    },
    components: {
        fileCellRenderer: getFileCellRenderer(),
    },
    columnDefs: [
        { field: 'dateModified' },
        {
            field: 'size',
            valueFormatter: params => params.value ? params.value + ' MB' : '',
        },
    ],
    rowData: store.rowData,
    treeData: true,
    animateRows: true,
    groupDefaultExpanded: -1,
    getDataPath: function (data) {
        return data.filePath;
    },
    deltaRowDataMode: true,
    getRowNodeId: function (data) {
        return data.id;
    },
    autoGroupColumnDef: {
        rowDrag: true,
        headerName: 'Files',
        width: 250,
        cellRendererParams: {
            suppressCount: true,
            innerRenderer: 'fileCellRenderer',
        },
    },
    onRowDragEnd: onRowDragEnd,
};

function onRowDragEnd(params) {
    var movingNode = params.node;
    var overNode = params.overNode;

    // root node
    if (!overNode) {
        overNode = {
            data: {
                filePath: [],
                type: 'folder'
            }
        }
    }

    // moving a file into the same spot
    // or moving a folder into a child folder 
    if (overNode.data.filePath === movingNode.data.filePath || isSelectionParentOfTarget(params.node, overNode)) {
        console.warn('invalid move');
        return;
    }

    // filter out moving node and all its children and the overnode itself
    let updatedRows = store.rowData.filter(row => {
        return movingNode.data.filePath.some((dir, ind) => row.filePath[ind] !== dir)
            && row.id !== overNode.data.id
    })

    console.log(updatedRows.map(row => row.filePath))

    // generate new paths for moving node and its children
    let rowsToAdd = [];
    generateRowsToAdd(overNode.data.filePath, overNode.data.type, movingNode, rowsToAdd);

    // add new rows at the correct index (the order for deltaRowDataMode is what dictates the view)
    let overNodeInd = updatedRows.findIndex(row => row.id === overNode.data.id);;
    updatedRows.splice(overNodeInd, 0, ...rowsToAdd);

    // update the store
    store.rowData = updatedRows;
    params.api.setRowData(updatedRows);

    params.api.clearFocusedCell();
}


function generateRowsToAdd(parentPath, parentType, node, rowsToAdd) {
    let parentPathCopy = [...parentPath];
    if (parentType === 'file') {
        // parentPathCopy.pop();
        parentPathCopy[parentPathCopy.length - 1] = parentPathCopy[parentPathCopy.length - 1].replace(/\..*$/, '');
        console.log(parentPathCopy)
    }
    var fileName = node.data.filePath[node.data.filePath.length - 1];
    var newChildPath = [...parentPathCopy, fileName];

    rowsToAdd.push({
        ...node.data,
        filePath: newChildPath
    });

    if (node.childrenAfterGroup) {
        node.childrenAfterGroup.forEach(function (childNode) {
            generateRowsToAdd(newChildPath, node.data.type, childNode, rowsToAdd);
        });
    }
}

function isSelectionParentOfTarget(selectedNode, targetNode) {
    var children = selectedNode.childrenAfterGroup;
    for (var i = 0; i < children.length; i++) {
        if (targetNode && children[i].key === targetNode.key) return true;
        isSelectionParentOfTarget(children[i], targetNode);
    }
    return false;
}

function getFileCellRenderer() {
    function FileCellRenderer() { }

    FileCellRenderer.prototype.init = function (params) {
        var tempDiv = document.createElement('div');
        var value = params.value;
        var icon = getFileIcon(params.value);
        tempDiv.innerHTML = icon
            ? '<i class="' +
            icon +
            '"/>' +
            '<span class="filename">' +
            value +
            '</span>'
            : value;
        this.eGui = tempDiv.firstChild;
    };
    FileCellRenderer.prototype.getGui = function () {
        return this.eGui;
    };

    return FileCellRenderer;
}

function getFileIcon(filename) {
    return filename.endsWith('.mp3') || filename.endsWith('.wav')
        ? 'far fa-file-audio'
        : filename.endsWith('.xls')
            ? 'far fa-file-excel'
            : filename.endsWith('.txt')
                ? 'far fa-file'
                : filename.endsWith('.pdf')
                    ? 'far fa-file-pdf'
                    : 'far fa-folder';
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});
