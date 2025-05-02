import { useEffect, useState } from 'react'
import './Menu.scss'
import { FoodItem } from './foodItem'
import FoodForm from './FoodForm'
import axios from 'axios'
import { AxiosError } from 'axios';

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
                const res = await axios.get('http://localhost:8000/api/cate');
                setCategories(res.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/list_menu');
                setMenus(res.data.data);
                console.log('Lấy data thành công', res.data.data.map((item: FoodItem) => item));
            } catch (error) {
                console.log("Lỗi khi gọi API:", error);
            }
        };

        fetchMenus();
    }, [refresh]);

    const getImageUrl = (image: string | null) => {
        if (!image) return '/vite.svg';
        if (image.startsWith('http')) return image;
        return `http://localhost:8000/uploads/${image}`;
    };

    const handleSaveMenu = async (food: FoodItem) => {
        try {
            if (initMenus) {
                // Gọi API cập nhật món ăn
                const res = await axios.put(`http://localhost:8000/api/admin/update_menu/${food.id}`, food);
                console.log('Cập nhật món ăn thành công:', res.data);
            } else {
                // Gọi API thêm món ăn
                const res = await axios.post(`http://localhost:8000/api/admin/add_menu`, food);
                console.log('Thêm món ăn thành công:', res.data);
            }

            // Đóng form và reset trạng thái
            setShowAddForm(false);
            setInitMenus(null);
            setRefresh(prev => !prev);
        } catch (error) {
            console.error('Lỗi khi lưu món ăn:', error);
        }
    };

    const handleDelete = (menuselect: FoodItem) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${menuselect.name}`)
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/api/admin/cate/${menuselect.id}`)
            const updatedmenus = menus.filter((food) => food.id !== menuselect.id)
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
                                            {food?.status ? 'Còn' : 'Hết'}
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