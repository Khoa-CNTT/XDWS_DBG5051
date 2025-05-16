// validate.ts
export type ValidationRule = {
    test: (value: string) => boolean;
    message: string;
};

// Các quy tắc kiểm tra ràng buộc cho input
export const validateInput = (value: string, rules: ValidationRule[]) => {
    for (const rule of rules) {
        if (!rule.test(value)) {
            return rule.message;  // Nếu không hợp lệ, trả về thông báo lỗi
        }
    }
    return '';  // Nếu hợp lệ, trả về thông báo rỗng
};