import { useState } from 'react'
import './Menu.scss'
import { FoodItem, foodItem } from './foodItem'
import FoodForm from './FoodForm'

const MenuManage = () => {
    const headers = ['Ảnh', 'Tên', 'Giá', 'Trạng Thái', 'Danh Mục', 'Hành Động']

    const [showAddForm, setShowAddForm] = useState(false)
    const [foods, setFoods] = useState(foodItem)
    const [initFoods, setInitFoods] = useState<FoodItem | null>(null)

    const handleSaveFood = (food: FoodItem) => {
        if (initFoods) {
            setFoods(foods.map((item) => (item.id === food.id ? food : item)));
        } else {
            setFoods([...foods, { ...food, id: Date.now() }]);
        }
        setShowAddForm(false);
        setInitFoods(null);
    };

    const handleDelete = (foodselect: FoodItem) => {
        const confirmDelete = window.confirm(` Bạn muốn xóa ${foodselect.name}`)
        if (confirmDelete) {
            const updatedFoods = foods.filter(food => food.id !== foodselect.id)
            setFoods(updatedFoods)
        }
    }

    const handleEdit = (food: FoodItem) => {
        setInitFoods(food);
        setShowAddForm(true);
        console.log(food);

    };

    const handleClose = () => {
        setInitFoods(null)
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
                            {foods.map((food) => (
                                <tr key={food.id} className="food-row">
                                    <td className="food-image-cell">
                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            className="food-image"
                                        />
                                    </td>
                                    <td className="food-name">{food.name}</td>
                                    <td className="food-price">{food.price.toLocaleString()} VNĐ</td>
                                    <td className="food-status">
                                        {Math.floor(Math.random() * 2) === 1 ? 'Còn' : 'Hết'}
                                    </td>
                                    <td className="food-type">{food.type}</td>
                                    <td className="food-actions">
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(food)}

                                        > Sửa</button>
                                        <button className="btn-delete"
                                            onClick={() => handleDelete(food)}
                                        >Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div >

            </div>



            {showAddForm && (
                <div className="overlay">
                    <FoodForm
                        onsave={handleSaveFood}
                        food={initFoods}
                        closeForm={handleClose}
                    />
                </div>
            )
            }

        </>
    )
}

export default MenuManage