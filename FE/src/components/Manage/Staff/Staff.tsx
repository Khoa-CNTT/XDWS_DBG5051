import { useState } from 'react'
import { staffList, StaffList } from './StaffList'
import FormStaff from './FormStaff'
import './Staff.scss'

const Staff = () => {
    const headers = ['Tên', 'Số Điện Thoại', 'Email', 'Vị Trí', 'Trạng Thái', 'Hành Động']

    const [showForm, setShowForm] = useState(false)
    const [staffs, setStaffs] = useState(staffList)
    const [initStaffs, setInitStaffs] = useState<StaffList | null>(null)

    const handleSaveFood = (staff: StaffList) => {
        if (initStaffs) {
            setStaffs(staffs.map((item) => (item.id === staff.id ? staff : item)));
        } else {
            setStaffs([...staffs, { ...staff, id: Date.now() }]);
        }
        setShowForm(false);
        setInitStaffs(null);
    };

    const handleDelete = (staffselect: StaffList) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${staffselect.name}`)
        if (confirmDelete) {
            const updatedstaffs = staffs.filter(food => food.id !== staffselect.id)
            setStaffs(updatedstaffs)
        }
    }

    const handleEdit = (staff: StaffList) => {
        setInitStaffs(staff);
        setShowForm(true);
        console.log(staff);

    };

    const handleClose = () => {
        setInitStaffs(null)
        setShowForm(false)
    }



    return (
        <>

            <div className='Menu-Manage'>
                <div className='Head'>

                    <button className="add-btn" onClick={() => setShowForm(true)} >+ Thêm Nhân Viên</button>

                </div>

                <div className='tb-body' >
                    <table className="staff-table">
                        <thead>
                            <tr className="staff-table-header">
                                {headers.map((item) => (
                                    <th key={item} className="header-cell">{item}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className='staff-table-body' >
                            {staffs.map((staff) => (
                                <tr key={staff.id} className="staff-row">

                                    <td className="staff-name">{staff.name}</td>
                                    <td className="staff-price">{staff.phoneNumber.toLocaleString()}</td>
                                    <td className="staff-mail">
                                        {staff.email}
                                    </td>

                                    <td className="staff-type">{staff.position}</td>
                                    <td className="staff-type">{staff.statusStaff}</td>
                                    <td className="staff-actions">
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(staff)}

                                        > Sửa</button>
                                        <button className="btn-delete"
                                            onClick={() => handleDelete(staff)}
                                        >Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div >

            </div>


            {showForm && (
                <div className="overlay">
                    <FormStaff
                        onsave={handleSaveFood}
                        staff={initStaffs}
                        closeForm={handleClose}
                    />
                </div>
            )
            }

        </>
    )
}

export default Staff