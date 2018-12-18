// FILTER OPTIONS
const textFilterOptions = ['equals', 'notEqual', 'startsWith', 'endsWith', 'contains', 'notContains'];
const numberFilterOptions = ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
const dateFilterOptions = ['equals', 'notEqual', 'greaterThan', 'lessThan'];

function initFilterPanel(modalToggleButton) {

    let modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modalToggleButton.addEventListener('click', () => toggleModal(modal));

    let closeModalSpan = document.createElement('span');
    closeModalSpan.innerHTML = '&times;'
    modal.appendChild(closeModalSpan);
    closeModalSpan.addEventListener('click', () => toggleModal(modal))

    let filterTable = document.createElement('table');
    modal.appendChild(filterTable);
    createFilterRow(filterTable);

    let setFilterButton = document.createElement('button');
    setFilterButton.textContent = 'Filter';
    modal.appendChild(setFilterButton);
    setFilterButton.addEventListener('click', () => setFilterOptions(filterTable));

    let clearFilterButton = document.createElement('button');
    clearFilterButton.textContent = 'Clear'
    modal.appendChild(clearFilterButton);
    clearFilterButton.addEventListener('click', () => clearFilterOptions(filterTable));

    document.querySelector('body').appendChild(modal)

}

// MODAL TOGGLE
let toggle = false;
function toggleModal(e) {
    toggle = !toggle;
    modal.style.display = toggle ? 'block' : 'none';
}

// ADDING FILTER OPTIONS 
function createFilterRow(filterTable) {
    let tr = document.createElement('tr')

    let td1 = document.createElement('td')
    let fieldSelect = document.createElement('select');
    td1.appendChild(fieldSelect);

    let td2 = document.createElement('td');
    let input = document.createElement('input');
    input.type = 'text';
    td2.appendChild(input);

    let td3 = document.createElement('td');
    let typeSelect = document.createElement('select');
    td3.appendChild(typeSelect);

    let td4 = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = 'add';
    td4.appendChild(button);

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    filterTable.appendChild(tr)

    // FIELD SELECT OPTIONS
    gridOptions.columnApi.getAllColumns().forEach(col => {
        let option = document.createElement('option');
        option.textContent = option.value = col.colDef.field;
        fieldSelect.appendChild(option);
    })

    // TYPE SELECT OPTIONS
    generateFilterTypeOptions(fieldSelect.value, typeSelect)

    // TYPE SELECT CHANGE HANDLER
    fieldSelect.addEventListener('change', e => {
        generateFilterTypeOptions(e.target.value, typeSelect)
    })

    // BUTTON EVENT LISTENERS
    button.addEventListener('click', createFilterRowWrap);
    button.addEventListener('click', () => {
        button.removeEventListener('click', createFilterRowWrap);
        button.textContent = 'remove'
        button.addEventListener('click', () => tr.remove())
    })

    function createFilterRowWrap() {
        createFilterRow(filterTable)
    }
}

function generateFilterTypeOptions(field, select) {
    select.innerHTML = ''

    let filter = columnDefs.find(col => col.field === field).filter;

    let options;
    switch (filter) {
        case 'agNumberColumnFilter':
            options = numberFilterOptions;
            break;
        case 'agDateColumnFilter':
            options = dateFilterOptions;
            break;
        case 'textColumnFilter':
            options = textFilterOptions;
            break;
        default:
            options = textFilterOptions
    }

    options.forEach(opt => {
        let option = document.createElement('option');
        option.textContent = option.value = opt;
        select.appendChild(option);
    })
}

// SET FILTER OPTIONS 
function setFilterOptions(filterTable) {
    let tableRows = Array.from(filterTable.children)
    let filterModel = {};
    tableRows.forEach(row => {
        let tableDataArr = Array.from(row.children);
        let field = tableDataArr[0].firstElementChild.value;
        let type = tableDataArr[2].firstElementChild.value;

        filterModel[field] = {};
        filterModel[field].type = type;
        if (field === 'date') {
            filterModel[field].dateFrom = tableDataArr[1].firstElementChild.value;
        } else {
            filterModel[field].filter = tableDataArr[1].firstElementChild.value;
        }
    })
    gridOptions.api.setFilterModel(filterModel);
    gridOptions.api.onFilterChanged();
}

//CLEAR FILTER OPTIONS 
function clearFilterOptions(filterTable) {
    gridOptions.api.setFilterModel(null);
    gridOptions.api.onFilterChanged();

    let tableRows = Array.from(filterTable.children)
    tableRows.forEach(row => row.remove());
    createFilterRow(filterTable);
}