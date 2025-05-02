import { useState, useEffect } from "react"
import axios from "axios"

export type CategoryType = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
const Category = () => {
    const [category, setCategory] = useState<CategoryType[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/cate');
                setCategory(response.data.data.map((item: CategoryType) => item)); // Lưu danh mục vào state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        fetchCategories();
    }, []);


    return (

        <div className="category-list">
            <h2 className="category-title">Quản lý danh mục</h2>


            <table className="category-items">
                <thead>
                    <tr className="category-header">
                        <th className="category-header-item">ID</th>
                        <th className="category-header-item">Tên danh mục</th>
                        <th className="category-header-item">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((item) => (
                        <tr className="category-item" key={item.id}>
                            <td className="category-item-id">{item.id}</td>
                            <td className="category-item-name">{item.name}</td>
                            <td className="category-item-action">
                                <button className="category-item-action-button">Thêm</button>
                                <button className="category-item-action-button">Sửa</button>
                                <button className="category-item-action-button">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>





        </div>
    )
}
export default Category