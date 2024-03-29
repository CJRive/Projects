import React from "react";
import { useTable } from "react-table";
import PropTypes from "prop-types";
import debug from "monefi-debug";
import { useEffect } from "react";

const UniversalTable = (props) => {
  let columns = props.columns;
  let data = props.data || [];

  const table = useTable({ columns, data });

  const _logger = debug.extend("App");
  const _loggerTC = _logger.extend("UniversalTable");

  useEffect(() => {
    _loggerTC(props.data);
  }, [props]);

  const mapHeader = (headerGroup, index) => {
    return (
      <tr {...headerGroup.getHeaderGroupProps()} key={index}>
        {headerGroup.headers.map((column, index) => (
          <th {...column.getHeaderProps()} key={index}>
            {column.render("Header")}
          </th>
        ))}
      </tr>
    );
  };

  const mapCell = (row, index) => {
    table.prepareRow(row);
    return (
      <tr {...row.getRowProps()} key={index}>
        {row.cells.map((cell, index) => (
          <td {...cell.getCellProps()} key={index}>
            {cell.render("Cell")}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <table {...table.getTableProps()}>
      <thead>{table.headerGroups.map(mapHeader)}</thead>
      <tbody {...table.getTableBodyProps()}>{table.rows.map(mapCell)}</tbody>
    </table>
  );
};

UniversalTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.element.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export Universal UniversalTable;
