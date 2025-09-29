import React from 'react';
import { Table, Card } from 'react-bootstrap';
import './DataTable.css';

const DataTable = ({ 
  columns = [],
  data = [],
  variant = 'default',
  striped = false,
  bordered = false,
  hover = true,
  responsive = true,
  className = '',
  ...props 
}) => {
  const tableClasses = [
    'data-table',
    `data-table--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item, item[column.key]);
    }
    return item[column.key];
  };

  return (
    <Card className="data-table-container">
      <Card.Body className="p-0">
        <Table 
          responsive={responsive}
          striped={striped}
          bordered={bordered}
          hover={hover}
          className={tableClasses}
          {...props}
        >
          <thead className="data-table__header">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="data-table__header-cell">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table__body">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="data-table__row">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="data-table__cell">
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default DataTable;
