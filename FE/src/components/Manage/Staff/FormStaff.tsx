import { StaffList } from "./StaffList";
import React, { useState, useEffect } from "react";

interface AddFormProps {
    onsave: (staff: StaffList) => void;
    staff: StaffList | null;
    closeForm: () => void;
}

const FormStaff = ({ onsave, staff, closeForm }: AddFormProps) => {

    const [name, setName] = useState(staff?.name || "");
    const [mail, setMail] = useState(staff?.email || "");
    const [pass, setPass] = useState("");
    const [phone, setPhone] = useState(staff?.phone || "");



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onsave({
            id: staff?.id ?? Date.now(),
            name,
            phone: phone,
            email: mail,
            password: pass || '',
            role: 'staff',
        });
    };
    return (
        <>
            <div className="edit-food-form" >
                <h2 className="form-title">{staff ? `Sửa Nhân Viên ${staff.name} ` : ` Thêm Nhân Viên`}</h2>

                <form className="form-group" style={{

                }}
                    onSubmit={handleSubmit}
                >


                    <label className="form-label">Tên</label>
                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />

                    <label className="form-label" >Email</label>
                    <input type="text" className="form-input" value={mail} onChange={(e) => setMail(e.target.value)} />

                    <label className="form-label" >SĐT</label>
                    <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />

                    <label className="form-label" >Mật khẩu</label>
                    <input type="text" className="form-input" value={pass} onChange={(e) => setPass(e.target.value)} />


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