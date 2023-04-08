

// This function receive data from API, map and combine all in html string and return it to caller. 
function parseAsTable(data, columns) {
    const tableRows = data.map((dataEntry) => {
        const rowCells = Object.keys(dataEntry).map((key) => `<td>${dataEntry[key]}</td>`).join('');
        return `<tr>${rowCells}</tr>`;
    }).join('');

    const tableHeaderCells = columns.map((column) => `<th>${column}</th>`).join('');
    const table = `
    <table>
      <thead>
        <tr>${tableHeaderCells}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
    return table;
}


module.exports = { parseAsTable };