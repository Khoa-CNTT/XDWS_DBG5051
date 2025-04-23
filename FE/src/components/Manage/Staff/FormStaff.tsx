import { PositionStaffType, StaffList, staffList, StatusStaffType } from "./StaffList";
import React, { useState, useEffect } from "react";
// import { Category } from '../Category/Category'
import './FormStaff.scss'
interface AddFormProps {
    onsave: (staff: StaffList) => void;
    staff: StaffList | null;
    closeForm: () => void;
}
export const statuss = ['Nghỉ', 'Đang Làm Việc', 'Khóa Tài Khoản'] as const;
export const positions = ['Phục Vụ', 'Thu Ngân', 'Bếp', 'Quản Lý Ca']
const FormStaff = ({ onsave, staff, closeForm }: AddFormProps) => {
    const [showImage, setShowImage] = useState<string | null>(null);

    const [name, setName] = useState(staff?.name || "");
    const [phone, setPhone] = useState(staff?.phoneNumber || "");
    const [mail, setMail] = useState(staff?.email || "");
    const [position, setPosition] = useState(staff?.position || "Phục Vụ");
    const [statusStaff, setStatusStaff] = useState(staff?.statusStaff || 'Đang Làm Việc');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onsave({
            id: staff?.id ?? Date.now(),
            name,
            phoneNumber: phone,
            email: mail,
            position: position as PositionStaffType,
            statusStaff: statusStaff as StatusStaffType
        });
    };
    return (
        <>
            <div className="edit-food-form" >
                <h2 className="form-title">{staff ? `Sửa Nhân Viên ${staff.name} ` : ` Thêm Nhân Viên`}</h2>

                <form className="form-group"
                    onSubmit={handleSubmit}
                >


                    <label className="form-label">Tên</label>
                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                    <label className="form-label" >Số Điện Thoại</label>
                    <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <label className="form-label" >Email</label>
                    <input type="text" className="form-input" value={mail} onChange={(e) => setMail(e.target.value)} />

                    <label className="form-label">Vị Trí</label>
                    <select className="form-select" value={position} onChange={(e) => setPosition(e.target.value as PositionStaffType)}>
                        {positions.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <label className="form-label">Trạng Thái</label>
                    <select className="form-select" value={statusStaff} onChange={(e) => setStatusStaff(e.target.value as StatusStaffType)}>
                        {statuss.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <div className="form-group-button">
                        <button className="btn-save" type="submit">{staff ? 'Lưu' : 'Thêm'}</button>
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

export default FormStaff