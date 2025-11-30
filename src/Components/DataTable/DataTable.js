import DataTableComponent from "react-data-table-component";

const defaultStyles = {
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      fontWeight: "bold",
      fontSize: "14px",
      minHeight: "56px", // Header row height
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      minHeight: "72px", // Row height increase - space barbe
      "&:hover": {
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
      },
    },
  },
  cells: {
    style: {
      paddingTop: "16px", // Uporer padding
      paddingBottom: "16px", // Nicher padding
      paddingLeft: "24px", // Bam diker padding
      paddingRight: "24px", // Dan diker padding
    },
  },
  headCells: {
    style: {
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "24px",
      paddingRight: "24px",
    },
  },
};

const DataTable = ({
  columns,
  data,
  pagination = true,
  selectableRows = false,
  customStyles = {},
  ...otherProps
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <DataTableComponent
        columns={columns}
        data={data}
        pagination={pagination}
        selectableRows={selectableRows}
        customStyles={{ ...defaultStyles, ...customStyles }}
        highlightOnHover
        pointerOnHover
        responsive
        {...otherProps}
      />
    </div>
  );
};

export default DataTable;
