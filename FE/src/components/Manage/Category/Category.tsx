import { useState, useEffect } from "react"
import { api } from "../../../Api/AxiosIntance"
import CateForm from "./CateForm"

export type CategoryType = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
const Category = () => {
    const [category, setCategory] = useState<CategoryType[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [initCate, setInitCate] = useState<CategoryType | null>(null)
    const [refresh, setRefresh] = useState(false)
    const headers = ['Tên Danh Mục', 'Hành Động']

    useEffect(() => {
        const fetchCategories = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get('http://localhost:8000/api/cate');
                setCategory(response.data.data);
=======
                const response = await api.get('/cate');
                setCategory(response.data.data.map((item: CategoryType) => item));
>>>>>>> Vuong
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCategories();
    }, [refresh]);

    const handleEdit = (cate: CategoryType) => {
        setInitCate(cate);
        setShowAddForm(true);
        console.log(cate);
    };

    const handleClose = () => {
        setInitCate(null);
        setShowAddForm(false)
    }

    const handleSaveCate = async (cate: CategoryType) => {
        try {
            if (initCate) {
<<<<<<< HEAD
                const res = await axios.put(`http://localhost:8000/api/admin/update-cate/${cate.id}`, cate,
                    authHeader()
                );
                console.log('Cập nhật Danh Mục thành công:', res.data);
            } else {

                const res = await axios.post(`http://localhost:8000/api/admin/add-cate`, cate, authHeader());
                console.log('Thêm Danh Mục ăn thành công:', res.data);
=======
                const res = await api.put(`/admin/update-cate/${cate.id}`, cate);
                console.log('Cập nhật Danh Mục thành công:', res.data);
            } else {
                const res = await api.post(`/admin/add-cate`, cate);
                console.log('Thêm danh mục thành công:', res.data);
>>>>>>> Vuong
            }

            setShowAddForm(false);
            setInitCate(null);
            setRefresh(prev => !prev);
        } catch (error: any) {
<<<<<<< HEAD
            console.error('Lỗi khi lưu Danh Mục:', error.response);

=======
            console.error('Lỗi khi lưu danh mục:', error.response);
>>>>>>> Vuong
        }
    };

    const handleDelete = async (cate: CategoryType) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${cate.name}`)
        if (confirmDelete) {
            try {
<<<<<<< HEAD
                const res = await axios.delete(`http://localhost:8000/api/admin/delete-cate/${cate.id}`, authHeader());
=======
                const res = await api.delete(`/admin/cate/${cate.id}`);
>>>>>>> Vuong
                console.log('Xóa danh mục thành công:', res.data);
                setCategory((prev) => prev.filter((item) => item.id !== cate.id));
            } catch (error: any) {
                console.error('Lỗi khi xóa danh mục:', error.response);
            }
        }
    }

    return (
        <div className='Menu-Manage'>
            <div className='Head'>
                <button className="add-btn" onClick={() => {
                    setShowAddForm(true);
                    setInitCate(null);
                }} >+ Thêm Danh Mục Mới</button>
            </div>

            <div className='tb-body' >
                <table className="food-table">
                    <thead>
                        <tr className="food-table-header">
                            {headers.map((item) => (
                                <th key={item} className="header-cell">{item}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='food-table-body' >
                        {category?.filter(Boolean).map((cate) => {
                            console.log('Danh muc:', cate);
                            return (
                                <tr key={cate?.id} className="food-row">
                                    <td className="food-name">{cate?.name}</td>
                                    <td className="food-actions">
                                        <button className="btn-edit"
                                            onClick={() => {
                                                setInitCate(cate);
                                                setShowAddForm(true);
                                            }
                                            }
                                        > Sửa</button>
                                        <button className="btn-delete"
                                            onClick={() => handleDelete(cate)}
                                        >Xóa</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <div className="overlay">
                    <CateForm
                        onsave={handleSaveCate}
                        cate={initCate}
                        closeForm={handleClose}
                    />
                </div>
            )}
        </div>
    )
}

export default Category