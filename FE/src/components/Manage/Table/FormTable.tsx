import { TableFormData, StatusType } from "./TableItem"
import React, { useState } from "react";

import './FormTable.scss'
interface AddTableFormProps {
    onsave: (table: TableFormData) => void;
    table: TableFormData | null;
    closeForm: () => void;
}


export const positions: string[] = [
    "Gần cửa", "Góc phòng", "Gần quầy bar", "Ban công", "Giữa phòng",
    "Gần tường", "Ngoài trời", "Góc khuất", "Lầu 2", "Gần nhà vệ sinh",
    "Gần cửa sổ", "Góc trái", "Gần lối ra vào", "Trung tâm", "Khu VIP"
];

export const statuss = ['Đã Đặt', 'Trống', 'Đang Hoạt Động'] as const;

const FormTable = ({ onsave, table, closeForm }: AddTableFormProps) => {
    const [position, setPosition] = useState(table?.position || positions[0]);
    const [status, setStatus] = useState<StatusType>(table?.status || "Trống");
    const [number, setNumber] = useState(table?.number?.toString() || "");
    const [quantity, setQuantity] = useState(table?.quantity?.toString() || "");




    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onsave({
            id: table?.id ?? Date.now(),
            number: Number(number),
            position,
            quantity: Number(quantity),
            status: status as StatusType



        });
    };
    return (
        <>
            <div className="edit-food-form" >

                <h2 className="form-title" >{table ? `Sửa Bàn số ${table.number} ` : ` Thêm Bàn`}</h2>

                <form className="form-group" onSubmit={handleSubmit} >

                    <label className="form-label">Bàn số</label>
                    <input type="text" className="form-input" value={number} onChange={(e) => setNumber(e.target.value)} />
                    <label className="form-label" >Số lượng</label>
                    <input type="text" className="form-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    <label className="form-label">Vị Trí</label>
                    <select className="form-select" value={position} onChange={(e) => setPosition(e.target.value)} >
                        {positions.map((position) => (
                            <option value={position} key={position} >
                                {position}
                            </option>
                        ))}
                    </select>
                    <label className="form-label">Trạng Thái</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as StatusType)}>
                        {statuss.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <div className="form-group-button">
                        <button className="btn-save" type="submit">{table ? 'Lưu' : 'Thêm'}</button>
                        <button

                            onClick={closeForm}
                            className="btn-exit"
                        >
                            Đóng
                        </button>

                    </div>
                </form>




            </div >
        </>
    )
}

export default FormTable