
import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";

// import Category from "../Category/Category";
// import './FoodForm.scss'

import axios from "axios";

interface AddCateFormProps {
    onsave: (cate: CategoryType) => void;
    cate: CategoryType | null;
    closeForm: () => void;
}

export type CategoryType = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export const statuss = ['Hết', 'Còn'] as const;

const FoodForm = ({ onsave, cate, closeForm }: AddCateFormProps) => {

    const [name, setName] = useState(cate?.name || "");

    useEffect(() => {
        if (cate) {
            setName(cate.name);
        }
    }, [cate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/cate');
                setName(response.data.data.map((item: CategoryType) => item.name));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCategories();
    }, []);




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const cateData = onsave({
            id: cate?.id ?? Date.now(),
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

        });

        console.log('fooddata:', cateData);

    };
    return (
        <>
            <div className="edit-food-form" >
                <h2 className="form-title">{cate ? `Sửa Danh Mục ${cate.name} ` : ` Thêm Danh Mục`}</h2>

                <form className="form-group"
                    onSubmit={handleSubmit}
                >


                    <label className="form-label">Tên Danh Mục</label>
                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />

                    <div className="form-group-button">

                        <button className="btn-save" type="submit">{cate ? 'Lưu' : 'Thêm'}</button>
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