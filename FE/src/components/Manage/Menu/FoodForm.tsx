import { FoodItem, StatusTypeFood } from "./foodItem";
import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";
import { CategoryType } from '../Category/Category'
// import Category from "../Category/Category";
import './FoodForm.scss'

import axios from "axios";
interface AddFoodFormProps {
    onsave: (food: FoodItem) => void;
    food: FoodItem | null;
    closeForm: () => void;
}
export const statuss = ['Hết', 'Còn'] as const;

const FoodForm = ({ onsave, food, closeForm }: AddFoodFormProps) => {
    const [showImage, setShowImage] = useState<string | null>(null);

    const [name, setName] = useState(food?.name || "");
    const [price, setPrice] = useState(food?.price || "");
    const [categoryName, setCategoryName] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>(food?.category_id || 0);
    const [image, setImage] = useState(food?.image || "");
    // const [status, setStatus] = useState<StatusTypeFood>(food?.status || 'Còn');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (food) {
            setName(food.name);
            setPrice(String(food.price));
            setSelectedCategory(food.category_id);
            setImage(food.image || "");
            // setStatus(food.status || 'Còn');
            setShowImage(food.image || null);
        }
    }, [food]);
    useEffect(() => {
        if (food?.image) {
            setShowImage(food.image);
        }
    }, [food]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/cate');
                setCategoryName(response.data.data.map((item: CategoryType) => item));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCategories();
    }, []);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file); // lưu file để gửi lên server

            const reader = new FileReader();
            reader.onloadend = () => {
                setShowImage(reader.result as string); // xem trước ảnh
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (categoryName.length > 0 && selectedCategory === 0) {
            setSelectedCategory(categoryName[0].id); // Đặt giá trị mặc định là ID của danh mục đầu tiên
        }
    }, [categoryName]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let imageUrl = food?.image || "";


        const fooddata = onsave({
            id: food?.id ?? Date.now(),
            name,
            category_id: selectedCategory ?? 0,
            price: Number(price),

            image: image || null,
            // status: status as StatusTypeFood
        });

        console.log('fooddata:', fooddata);

    };
    return (
        <>
            <div className="edit-food-form" >
                <h2 className="form-title">{food ? `Sửa Món ${food.name} ` : ` Thêm món`}</h2>

                <form className="form-group"
                    onSubmit={handleSubmit}
                >
                    <label className="form-label" >Ảnh</label>
                    <input type="file" className="form-input" onChange={
                        handleImageChange
                    } />
                    <div className="image-box">
                        {showImage ? <img src={showImage} alt="Preview" className="image-preview" /> : <span className="image-placeholder">Chưa có ảnh</span>}
                    </div>
                    <label className="form-label">Tên</label>
                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                    <label className="form-label" >Giá</label>
                    <input type="text" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <label className="form-label">Danh Mục</label>

                    <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value))}>
                        {categoryName.map((item) => (
                            <option value={item.id} key={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <label className="form-label">Trạng Thái</label>
                    {/* <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as StatusTypeFood)}>
                        {statuss.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select> */}

                    <div className="form-group-button">

                        <button className="btn-save" type="submit">{food ? 'Lưu' : 'Thêm'}</button>
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

export default FoodForm