/*
 * @Author: 任继民
 * @Date: 2021-04-20 15:40:54
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-11 16:09:28
 * @Description:
 */
/*
  inspired by https://www.npmjs.com/package/react-csv-downloader
  now removed from Github
*/

const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
    const line = row.map(data => {
        if (!quoted) return data;
        // quote data
        data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
        return `"${data}"`;
    });
    content.push(line.join(separator));
};

const defaults = {
    separator: ',',
    quoted: false
};

export default function csv(columns, datas, options, noHeader = false) {
    options = Object.assign({}, defaults, options);
    let columnOrder;
    const content = [];
    const column = [];

    if (columns) {
        columnOrder = columns.map(v => {
            if (typeof v === 'string') return v;
            if (!noHeader) {
                column.push(typeof v.title !== 'undefined' ? v.title : v.dataIndex);
            }
            return v.dataIndex;
        });
        if (column.length > 0) appendLine(content, column, options);
    } else {
        columnOrder = [];
        datas.forEach(v => {
            if (!Array.isArray(v)) {
                columnOrder = columnOrder.concat(Object.keys(v));
            }
        });
        if (columnOrder.length > 0) {
            columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
            if (!noHeader) appendLine(content, columnOrder, options);
        }
    }

    if (Array.isArray(datas)) {
        datas.forEach(row => {
            if (!Array.isArray(row)) {
                row = columnOrder.map(k => (typeof row[k] !== 'undefined' ? row[k] : ''));
            }
            appendLine(content, row, options);
        });
    }
    return content.join(newLine);
}
