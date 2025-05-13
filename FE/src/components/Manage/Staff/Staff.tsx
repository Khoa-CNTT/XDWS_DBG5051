import { useEffect, useState } from 'react'
import {
    StaffList
} from './StaffList'
import FormStaff from './FormStaff'
import './Staff.scss'

import { authHeader } from '../../../Api/Login'
import axios from 'axios'

const Staff = () => {


    const headers = ['Tên Nhân Viên', 'Email', 'Số điện thoại', 'Hành Động']
    const [showForm, setShowForm] = useState(false)

    const [staffs, setStaffs] = useState<StaffList[]>([])
    const [initStaffs, setInitStaffs] = useState<StaffList | null>(null)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/admin/list-user', authHeader());
                if (Array.isArray(res.data.data)) {
                    const staffOnly = res.data.data.filter((user: any) => user.role === 'staff');
                    setStaffs(staffOnly);

                } else {
                    console.error('Dữ liệu trả về không phải là một mảng:', res.data);
                    setStaffs([]); // Đặt giá trị mặc định là mảng rỗng
                }
            } catch (error: any) {
                console.error('Lỗi khi lấy danh sách nhân viên:', error.response);
                setStaffs([]); // Đặt giá trị mặc định là mảng rỗng khi có lỗi
            }
        };

        fetchStaff();
    }, [refresh]);





    const handleSaveStaff = async (staff: StaffList) => {
        try {
            if (initStaffs) {
                const res = await axios.put(`http://localhost:8000/api/admin/update-user/${staff.id}`, staff,
                    authHeader()
                );
                console.log('Cập nhật Nhân Viên thành công:', res.data);
            } else {

                const res = await axios.post(`http://localhost:8000/api/admin/add-user`, staff, authHeader());
                console.log('Thêm nhân viên ăn thành công:', res.data);
            }

            setShowForm(false);
            setInitStaffs(null);
            setRefresh(prev => !prev);
        } catch (error: any) {
            console.error('Lỗi khi lưu nhân viên:', error.response);

        }
    };

    const handleDelete = (staffSelect: StaffList) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${staffSelect.name}`)
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/api/admin/user/${staffSelect.id}`, authHeader())
            const updateStaff = staffs.filter((food) => food.id !== staffSelect.id)
            setStaffs(updateStaff)
            alert(`Xóa nhân viên thành công: ${staffSelect.name}`);

        }
    }

    const handleEdit = (staff: StaffList) => {
        setInitStaffs(staff);
        setShowForm(true);
        // console.log(staff);
        console.log('Hello');


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

                                    <td className="staff-mail">
                                        {staff.email}
                                    </td>
                                    <td className="staff-phone">
                                        {staff.phone}
                                    </td>



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
                        onsave={handleSaveStaff}
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