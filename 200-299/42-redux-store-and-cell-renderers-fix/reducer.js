const INITIAL_STATE = {
    columnDefs: [
          {
      headerName: "#",
      valueGetter: "Number(node.id)",
    },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 200,
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 100,
        cellRenderer : "DummyRenderer",
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 100,
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 120,
      },
    ],
    rowData: [
      {
        id:1,
        athlete: 'Michael Phelps',
        age: 23,
        year: 1990,
        country: 'United States',
      },
      {
        id:2,
        athlete: 'Natalie Coughlin',
        age: 25,
        year: 1991,
        country: 'United States',
      },
      {
        id:3,
        athlete: 'Aleksey Nemov',
        age: 24,
        year: 1992,
        country: 'Russia',
      },
    ],
  };

export default (
  state= INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      let result = {...state, rowData: action.payload};
      console.log('returning', result)
      return result;
    default:
      return state;
  }
};
