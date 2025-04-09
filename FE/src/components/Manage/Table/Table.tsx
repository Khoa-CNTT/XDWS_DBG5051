import { TableData, TableFormData, TableItem } from "./TableItem"
import { useState } from 'react'
import FormTable from './FormTable'
import './Table.scss'
const Table = () => {

    const info = [
        'Bàn số',
        'Vị trí',
        'Số lượng',
        'Trạng Thái',
        'Hoạt động'
    ]

    const [showForm, setShowForm] = useState(false)
    const [tables, setTables] = useState<TableItem[]>(TableData)
    const [initTables, setInitTables] = useState<TableItem | null>(null);

    const handleSaveTable = (table: TableFormData) => {
        if (initTables) {
            setTables(tables.map((item) => (item.id === table.id ? table as TableItem : item)));
        } else {

            setTables([...tables, { ...table, id: Date.now() }]);

        }
        setShowForm(false);
        setInitTables(null);
        console.log(tables);

    };

    const handleDelete = (tableSelect: TableItem) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa bàn số ${tableSelect.number}`)
        if (confirmDelete) {
            const updatedTables = tables.filter(table => table.id !== tableSelect.id)
            setTables(updatedTables)
        }
    }

    const handleEdit = (a: TableItem) => {
        setInitTables(a);
        setShowForm(!showForm);
        console.log(a);

    };
    return (
        <>
            <div className="Table-Manage">
                <div className="Head">
                    <button type="submit" className="add-btn" onClick={() => {
                        setShowForm(true)
                        setInitTables(null)
                    }}>
                        + Thêm Bàn
                    </button>
                </div>

                <div className="Table-body">
                    <table className="Table-Table">
                        <thead className="table-head">
                            <tr>
                                {info.map((item) => (
                                    <th key={item}>{item}</th>
                                ))}
                            </tr>

                        </thead>
                        <tbody className="table-body">
                            {tables.map((item) => (
                                <tr
                                    key={item.id}
                                    className='table-row'
                                >
                                    <td className="table-number"> {item.number}</td>
                                    <td className="table-position"> {item.position}</td>
                                    <td className="table-quantity"> {item.quantity}</td>
                                    <td className="table-status"> {item.status}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(item)}>Sửa</button>
                                        <button className="btn-delete" onClick={() => handleDelete(item)}>Xóa</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>


            {showForm && (
                <div className="overlay">
                    <FormTable
                        onsave={handleSaveTable}
                        table={initTables}
                        closeForm={() => setShowForm(false)}
                    />
                </div>
            )
            }
        </>
    )
}

export default Table