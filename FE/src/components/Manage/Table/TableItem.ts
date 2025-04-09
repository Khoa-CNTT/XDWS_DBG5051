
export type StatusType = "Đã Đặt" | "Trống" | "Đang Hoạt Động";


export interface TableItem {
    id: number;
    number: number;
    position: string;
    quantity: number;
    status: StatusType;
}


// export interface TableFormData {
//     id?: number;
//     number: number;
//     position: string;
//     quantity: number;
//     status: StatusType;
// }



export const tableItem: TableItem[] = [
    {
        id: 1,
        number: 1,
        position: "Gần cửa sổ",
        quantity: 4,
        status: "Trống",
    },
    {
        id: 2,
        number: 2,
        position: "Góc trái",
        quantity: 2,
        status: "Đang Hoạt Động",
    },
    {
        id: 3,
        number: 3,
        position: "Gần quầy bar",
        quantity: 6,
        status: "Trống",
    },
    {
        id: 4,
        number: 4,
        position: "Giữa phòng",
        quantity: 4,
        status: "Đang Hoạt Động",
    },
    {
        id: 5,
        number: 5,
        position: "Ban công",
        quantity: 2,
        status: "Trống",
    },
    {
        id: 6,
        number: 6,
        position: "Gần lối ra vào",
        quantity: 4,
        status: "Đang Hoạt Động",
    },
    {
        id: 7,
        number: 7,
        position: "Góc phải",
        quantity: 6,
        status: "Trống",
    },
    {
        id: 8,
        number: 8,
        position: "Trung tâm",
        quantity: 4,
        status: "Đang Hoạt Động",
    },
    {
        id: 9,
        number: 9,
        position: "Gần cửa sau",
        quantity: 2,
        status: "Trống",
    },
    {
        id: 10,
        number: 10,
        position: "Khu VIP",
        quantity: 8,
        status: "Đang Hoạt Động",
    },
]