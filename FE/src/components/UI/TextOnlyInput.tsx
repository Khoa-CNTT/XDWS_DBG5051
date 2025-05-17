import React, { useState } from 'react';
import { validateInput } from './Validate';  // Import hàm validate
// import { ValidationRule } from './ValidationRules';  // Import các quy tắc kiểm tra

interface TextOnlyInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    onValidChange?: (isValid: boolean) => void; // Tùy chọn: dùng để báo lỗi cho form
}

const TextOnlyInput: React.FC<TextOnlyInputProps> = ({
    value,
    onChange,
    placeholder,
    label,
    onValidChange
}) => {
    const [error, setError] = useState('');

    // Regex cho phép chữ có dấu và khoảng trắng
    const validRegex = /^[\p{L}\s]*$/u;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        onChange(input); // ⚠️ Không lọc ở đây — để người dùng gõ tự nhiên
    };

    const handleBlur = () => {
        if (!validRegex.test(value)) {
            setError('Không được nhập số hoặc ký tự đặc biệt');
            onValidChange?.(false);
        } else {
            setError('');
            onValidChange?.(true);
        }
    };


    return (
        <div style={{ marginBottom: '1rem' }}>
            <input
                className="form-input"
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                style={{ padding: '8px', width: '100%', borderColor: error ? 'red' : '#ccc' }}
            />
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        </div>
    );
};

export default TextOnlyInput;
