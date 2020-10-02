// This fake server uses http://alasql.org/ to mimic how a real server
// might generate sql queries from the Server-Side Row Model request.
// To keep things simple it does the bare minimum to support the example.
function FakeServer(allData) {
  alasql.options.cache = false;

  return {
    getData: function(request) {
      var results = executeQuery(request);
      console.log('rows', results);
      return {
        success: true,
        rows: results,
        lastRow: getLastRowIndex(request, results),
      };
    },
  };

  function executeQuery(request) {
    var sql = buildSql(request);

    console.log('[FakeServer] - about to execute query:', sql);

    return alasql(sql, [allData]);
  }

  function buildSql(request) {
    return (
      'SELECT * FROM ?' +
      whereSql(request) +
      orderBySql(request) +
      limitSql(request)
    );
  }

  function whereSql(request) {
    var whereParts = [];
    var filterModel = request.filterModel;

    if (filterModel) {
      Object.keys(filterModel).forEach(function(key) {
        var item = filterModel[key];

        switch (item.filterType) {
          case 'text':
            whereParts.push(createFilterSql(textFilterMapper, key, item));
            break;
          case 'number':
            whereParts.push(createFilterSql(numberFilterMapper, key, item));
            break;
          case 'date':
            whereParts.push(createFilterSql(dateFilterMapper, key, item));
            break;
          default:
            console.log('unknown filter type: ' + item.filterType);
            break;
        }
      });
    }

    if (whereParts.length > 0) {
      return ' WHERE ' + whereParts.join(' AND ');
    }

    return '';
  }

  function createFilterSql(mapper, key, item) {
    if (item.operator) {
      var condition1 = mapper(key, item.condition1);
      var condition2 = mapper(key, item.condition2);

      return '(' + condition1 + ' ' + item.operator + ' ' + condition2 + ')';
    }

    return mapper(key, item);
  }

  function textFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + " = '" + item.filter + "'";
      case 'notEqual':
        return key + "' != '" + item.filter + "'";
      case 'contains':
        return key + " LIKE '%" + item.filter + "%'";
      case 'notContains':
        return key + " NOT LIKE '%" + item.filter + "%'";
      case 'startsWith':
        return key + " LIKE '" + item.filter + "%'";
      case 'endsWith':
        return key + " LIKE '%" + item.filter + "'";
      default:
        console.log('unknown text filter type: ' + item.type);
    }
  }

  function numberFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + ' = ' + item.filter;
      case 'notEqual':
        return key + ' != ' + item.filter;
      case 'greaterThan':
        return key + ' > ' + item.filter;
      case 'greaterThanOrEqual':
        return key + ' >= ' + item.filter;
      case 'lessThan':
        return key + ' < ' + item.filter;
      case 'lessThanOrEqual':
        return key + ' <= ' + item.filter;
      case 'inRange':
        return (
          '(' +
          key +
          ' >= ' +
          item.filter +
          ' and ' +
          key +
          ' <= ' +
          item.filterTo +
          ')'
        );
      default:
        console.log('unknown number filter type: ' + item.type);
    }
  }

  function dateFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
      const [match, year, month, day] = item.dateFrom.match(/(\d{4})-(\d{2})-(\d{2})/);
      const str = day + '/' + month + '/' + year
        return key + ' = ' + "'" + str + "'";
      // case 'notEqual':
      //   return key + ' != ' + item.filter;
      // case 'greaterThan':
      //   return key + ' > ' + item.filter;
      // case 'greaterThanOrEqual':
      //   return key + ' >= ' + item.filter;
      // case 'lessThan':
      //   return key + ' < ' + item.filter;
      // case 'lessThanOrEqual':
      //   return key + ' <= ' + item.filter;
      // case 'inRange':
      //   return (
      //     '(' +
      //     key +
      //     ' >= ' +
      //     item.filter +
      //     ' and ' +
      //     key +
      //     ' <= ' +
      //     item.filterTo +
      //     ')'
      //   );
      // default:
      //   console.log('unknown number filter type: ' + item.type);
    }
  }

  function orderBySql(request) {
    var sortModel = request.sortModel;

    if (sortModel.length === 0) return '';

    var sorts = sortModel.map(function(s) {
      return s.colId + ' ' + s.sort.toUpperCase();
    });

    return ' ORDER BY ' + sorts.join(', ');
  }

  function limitSql(request) {
    var blockSize = request.endRow - request.startRow;

    return ' LIMIT ' + (blockSize + 1) + ' OFFSET ' + request.startRow;
  }

  function getLastRowIndex(request, results) {
    if (!results || results.length === 0) {
      return request.startRow;
    }

    var currentLastRow = request.startRow + results.length;

    return currentLastRow <= request.endRow ? currentLastRow : -1;
  }
}
