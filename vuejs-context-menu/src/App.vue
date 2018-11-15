<template>
    <ag-grid-vue style="width: 100vw; height: 100vh;"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="rowData"
                 :getContextMenuItems="getContextMenuItems"
                 :enableSorting="true"
                 :enableFilter="true">
    </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null
    };
  },
  components: {
    AgGridVue
  },
  methods: {
    getContextMenuItems(params) {
      var result = [
        {
          // custom item
          name: "Alert " + params.value,
          action: function() {
            window.alert("Alerting about " + params.value);
          },
          cssClasses: ["redFont", "bold"]
        },
        {
          // custom item
          name: "Always Disabled",
          disabled: true,
          tooltip:
            "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!"
        },
        {
          name: "Country",
          subMenu: [
            {
              name: "Ireland",
              action: function() {
                console.log("Ireland was pressed");
              },
              icon: createFlagImg("ie")
            },
            {
              name: "UK",
              action: function() {
                console.log("UK was pressed");
              },
              icon: createFlagImg("gb")
            },
            {
              name: "France",
              action: function() {
                console.log("France was pressed");
              },
              icon: createFlagImg("fr")
            }
          ]
        },
        {
          name: "Person",
          subMenu: [
            {
              name: "Niall",
              action: function() {
                console.log("Niall was pressed");
              }
            },
            {
              name: "Sean",
              action: function() {
                console.log("Sean was pressed");
              }
            },
            {
              name: "John",
              action: function() {
                console.log("John was pressed");
              }
            },
            {
              name: "Alberto",
              action: function() {
                console.log("Alberto was pressed");
              }
            },
            {
              name: "Tony",
              action: function() {
                console.log("Tony was pressed");
              }
            },
            {
              name: "Andrew",
              action: function() {
                console.log("Andrew was pressed");
              }
            },
            {
              name: "Kev",
              action: function() {
                console.log("Kev was pressed");
              }
            },
            {
              name: "Will",
              action: function() {
                console.log("Will was pressed");
              }
            },
            {
              name: "Armaan",
              action: function() {
                console.log("Armaan was pressed");
              }
            }
          ]
        }, // built in separator
        "separator",
        {
          // custom item
          name: "Windows",
          shortcut: "Alt + W",
          action: function() {
            console.log("Windows Item Selected");
          },
          icon: '<img src="../images/skills/windows.png"/>'
        },
        {
          // custom item
          name: "Mac",
          shortcut: "Alt + M",
          action: function() {
            console.log("Mac Item Selected");
          },
          icon: '<img src="../images/skills/mac.png"/>'
        }, // built in separator
        "separator",
        {
          // custom item
          name: "Checked",
          checked: true,
          action: function() {
            console.log("Checked Selected");
          },
          icon: '<img src="../images/skills/mac.png"/>'
        }, // built in copy item
        "copy"
      ];

      return result;
    }
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: "Athlete", field: "athlete", width: 150 },
      { headerName: "Age", field: "age", width: 90 },
      { headerName: "Country", field: "country", width: 120 },
      { headerName: "Year", field: "year", width: 90 },
      { headerName: "Date", field: "date", width: 110 },
      { headerName: "Sport", field: "sport", width: 110 },
      { headerName: "Gold", field: "gold", width: 100 },
      { headerName: "Silver", field: "silver", width: 100 },
      { headerName: "Bronze", field: "bronze", width: 100 },
      { headerName: "Total", field: "total", width: 100 }
    ];

    fetch(
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
    )
      .then(result => result.json())
      .then(rowData => (this.rowData = rowData));
  }
};

function createFlagImg(flag) {
  return (
    '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' +
    flag +
    '.png"/>'
  );
}
</script>

<style>
.redFont {
  color: red;
}

.bold {
  font-weight: bold;
}
</style>