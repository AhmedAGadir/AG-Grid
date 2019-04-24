import Vue from 'vue';
import { AgGridVue } from 'ag-grid-vue';
import TextAreaJSRenderer from './TextAreaJSRenderer.js';
import 'ag-grid-enterprise';
import TextAreaVueRenderer from './TextAreaVueRenderer.js';

const LinkComponent = Vue.extend({
  template: '<span>{{ params.value }} / {{ params.style }}</span>',
});




const VueExample = {
  template: `
        <div style="height: 100%">   
            <div style="height: 100%; box-sizing: border-box;">
                      <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-balham"
                          :gridReady="onGridReady" 
                          :columnDefs="columnDefs"
                          :rowData="rowData"
                          :components="components"
                          :frameworkComponents="frameworkComponents"
                          :defaultColDef="defaultColDef"></ag-grid-vue>
            </div>
        </div>
    `,
  components: {
    'ag-grid-vue': AgGridVue,
  },
  data: function () {
    return {
      columnDefs: null,
      rowData: null,
      frameworkComponents: null,
      defaultColDef: null,
    };
  },
  beforeMount() {
    this.columnDefs = [
      {
        headerName: 'TextArea JS Renderer',
        field: 'textAreaJS',
        cellRenderer: 'TextAreaJSRenderer',
        width: 300,
        editable: false,
      },
      {
        headerName: 'TextArea Vue Renderer',
        field: 'textAreaVue',
        cellRenderer: 'TextAreaVueRenderer',
        width: 300,
        editable: false,
      },
    ];
    this.rowData = this.createRowData();
    this.frameworkComponents = {
      TextAreaVueRenderer: TextAreaVueRenderer,
    };
    this.components = {
      TextAreaJSRenderer,
    };
    this.defaultColDef = {
      suppressKeyboardEvent: function (params) {
        console.log(params.event.key)
        const key = params.event.key;
        const isCellRenderer = params.api.getCellRendererInstances({ rowNodes: [params.node], columns: [params.column] }).length > 0;
        return isCellRenderer && (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowRight' || key === 'ArrowLeft')
      }
    }
  },
  methods: {
    onGridReady(params) {
      params.api.sizeColumnsToFit();

      var toggleBtn = document.querySelector('#toggleBtn');
      toggleBtn.addEventListener('click', () => {
        editEnabled = !editEnabled;

        params.api.redrawRows();
      });
    },
    createRowData() {
      return [
        {
          name: 'Bob',
          mood: 'Happy',
          number: 10,
        },
        {
          name: 'Harry',
          mood: 'Sad',
          number: 3,
        },
        {
          name: 'Sally',
          mood: 'Happy',
          number: 20,
        },
        {
          name: 'Mary',
          mood: 'Sad',
          number: 5,
        },
        {
          name: 'John',
          mood: 'Happy',
          number: 15,
        },
        {
          name: 'Jack',
          mood: 'Happy',
          number: 25,
        },
        {
          name: 'Sue',
          mood: 'Sad',
          number: 43,
        },
        {
          name: 'Sean',
          mood: 'Sad',
          number: 1335,
        },
        {
          name: 'Niall',
          mood: 'Happy',
          number: 2,
        },
        {
          name: 'Alberto',
          mood: 'Happy',
          number: 123,
        },
        {
          name: 'Fred',
          mood: 'Sad',
          number: 532,
        },
        {
          name: 'Jenny',
          mood: 'Happy',
          number: 34,
        },
        {
          name: 'Larry',
          mood: 'Happy',
          number: 13,
        },
      ];
    },
  },
};

new Vue({
  el: '#app',
  components: {
    'my-component': VueExample,
  },
});
