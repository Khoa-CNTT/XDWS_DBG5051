// validationRules.ts
import { ValidationRule } from './Validate';

// Quy tắc kiểm tra chỉ cho phép chữ cái có dấu và khoảng trắng
export const onlyLettersRule: ValidationRule = {
    test: (value) => /^[\p{L}\s]+$/u.test(value),
    message: 'Chỉ được nhập chữ cái và khoảng trắng.',
};

// Quy tắc kiểm tra độ dài
export const minLengthRule = (minLength: number): ValidationRule => ({
    test: (value) => value.length >= minLength,
    message: `Tên phải có ít nhất ${minLength} ký tự.`,
});
// export { ValidationRule };

