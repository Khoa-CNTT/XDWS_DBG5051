import { useEffect, useState } from 'react'
import './Menu.scss'
import { FoodItem } from './foodItem'
import FoodForm from './FoodForm'
import axios from 'axios'


import { getCurrentApi, authHeader, getApiAdmin } from '../../../Api/Login'

import { CategoryType } from '../Category/Category'
const MenuManage = () => {
    const headers = ['Ảnh', 'Tên', 'Giá', 'Trạng Thái', 'Danh Mục', 'Hành Động']

    const [showAddForm, setShowAddForm] = useState(false)
    const [menus, setMenus] = useState<FoodItem[]>([])
    const [initMenus, setInitMenus] = useState<FoodItem | null>(null)
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [refresh, setRefresh] = useState(false)


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCurrentApi('/cate', 'get');
                console.log('Categories:', result.data);
                setCategories(result.data);
                return result.data;

            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };

        fetchCategories();
    }, [refresh]);

    useEffect(() => {

        const fetchMenus = async () => {
            try {
                const result = await getCurrentApi('/list-menu', 'get');
                setMenus(result.data);
                console.log('Lấy data thành công', result.data.map((item: FoodItem) => item));
            } catch (error) {
                console.log("Lỗi khi gọi API:", error);
            }
        };
        fetchMenus();

    }, [refresh]);

    const getImageUrl = (image: string | null) => {
        if (!image) return '/vite.svg';
        if (image.startsWith('http')) return image;
        return `http://localhost:8000/upload/menu/${image}`;
    };



    const handleSaveMenu = async (form: FormData) => {
        try {
            if (initMenus) {

                form.append('_method', 'PUT');
                const res = await axios.post(`http://localhost:8000/api/admin/update-menu/${initMenus.id}`, form,
                    authHeader()
                );
                console.log('Cập nhật món ăn thành công:', res.data);
            } else {
                // Gọi API thêm món ăn
                const res = await axios.post(`http://localhost:8000/api/admin/add-menu`, form, authHeader());
                console.log('Thêm món ăn thành công:', res.data.data);
            }

            // Đóng form và reset trạng thái
            setShowAddForm(false);
            setInitMenus(null);
            setRefresh(prev => !prev);
        } catch (error: any) {
            console.error('Lỗi khi lưu món ăn:', error.response);
        }
    };

    const handleDelete = (menuselect: FoodItem) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${menuselect.name}`)
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/api/admin/cate/${menuselect.id}`, authHeader())
            const updatedmenus = menus.filter((food) => food.id !== menuselect.id)
            console.log('Xóa món ăn thành công:', menuselect.name);

            setMenus(updatedmenus)

        }
    }

    const handleEdit = (food: FoodItem) => {
        setInitMenus(food);
        setShowAddForm(true);
        console.log(food);

    };

    const handleClose = () => {
        setInitMenus(null)
        setShowAddForm(false)
    }

    return (
        <>
            <div className='Menu-Manage'>
                <div className='Head'>
                    <button className="add-btn" onClick={() => setShowAddForm(true)} >+ Thêm Món Mới</button>
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
                            {menus?.filter(Boolean).map((food) => {
                                console.log('Food item:', food);
                                return (
                                    <tr key={food?.id} className="food-row">
                                        <td className="food-image-cell">
                                            <img
                                                src={getImageUrl(food?.image)}
                                                alt={food?.name || 'Food image'}
                                                className="food-image"
                                                onError={(e) => {
                                                    console.log('Image load error:', e);
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/vite.svg';
                                                }}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </td>

                                        <td className="food-name">{food?.name}</td>
                                        <td className="food-price">{food?.price?.toLocaleString()} VNĐ</td>
                                        <td className="food-status">
                                            {'Còn'}
                                        </td>
                                        <td className="food-type">
                                            {categories.find((category) => category.id === food?.category_id)?.name}
                                        </td>

                                        <td className="food-actions">
                                            <button className="btn-edit"
                                                onClick={() => handleEdit(food)}
                                            > Sửa</button>
                                            <button className="btn-delete"
                                                onClick={() => handleDelete(food)}
                                            >Xóa</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddForm && (
                <div className="overlay">
                    <FoodForm
                        onsave={handleSaveMenu}
                        food={initMenus}
                        closeForm={handleClose}
                    />
                </div>
            )}
        </>
    )
}

export default MenuManage