import { FoodItem, StatusTypeFood } from "./foodItem";
import React, { useState, useEffect } from "react";
import { Category } from '../Category/Category'
import './FoodForm.scss'
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
    const [category, setCategory] = useState(food?.type || "Khai vị");
    const [image, setImage] = useState(food?.image || "");
    const [status, setStatus] = useState<StatusTypeFood>(food?.status || 'Còn');

    useEffect(() => {
        if (food?.image) {
            setShowImage(food.image);
        }
    }, [food]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl: string = URL.createObjectURL(file);
            setShowImage(imageUrl);
            setImage(imageUrl)
        }
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onsave({
            id: food?.id ?? Date.now(),
            name,
            price: Number(price),
            type: category,
            image,
            status: status as StatusTypeFood
        });
    };
    return (
        <>
            <div className="edit-food-form" >
                <h2 className="form-title">{food ? `Sửa Món ${food.name} ` : ` Thêm món`}</h2>

                <form className="form-group"
                    onSubmit={handleSubmit}
                >
                    <label className="form-label" >Ảnh</label>
                    <input type="file" className="form-input" onChange={(e) => {
                        handleImageChange(e)
                        setImage(e.target.value)
                    }


                    } />
                    <div className="image-box">
                        {showImage ? (image && <img src={image} alt="Preview" className="image-preview" />) : <span className="image-placeholder">Chưa có ảnh</span>}
                    </div>
                    <label className="form-label">Tên</label>
                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                    <label className="form-label" >Giá</label>
                    <input type="text" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <label className="form-label">Danh Mục</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {Category.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <label className="form-label">Trạng Thái</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as StatusTypeFood)}>
                        {statuss.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
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