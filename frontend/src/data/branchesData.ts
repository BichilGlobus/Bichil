export interface Branch {
  branch_id: number;
  branch_name: string;
  address: string;
  work_days: string | null;
  work_hours: string | null;
  latitude: string | null;
  longitude: string | null;
  phone_numbers: string[] | null;
  province_name: string | null;
  district_name: string | null;
  region_name: string | null;
  image?: string;
}

export const mockBranches: Branch[] = [
  {
    branch_id: 1,
    branch_name: "Төв салбар",
    address: "Улаанбаатар, Баянзүрх дүүрэг, Сүхбаатар орц",
    work_days: "Даваа - Баасан",
    work_hours: "09:00 - 18:00",
    latitude: "47.9184",
    longitude: "106.9177",
    phone_numbers: ["+976 11 123456", "+976 88 123456"],
    province_name: "Улаанбаатар",
    district_name: "Баянзүрх",
    region_name: "Улаанбаатар",
    image: "/images/news1.jpg",
  },
  {
    branch_id: 2,
    branch_name: "Сүхбаатар салбар",
    address: "Улаанбаатар, Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө",
    work_days: "Даваа - Баасан",
    work_hours: "09:00 - 18:00",
    latitude: "47.9222",
    longitude: "106.8869",
    phone_numbers: ["+976 11 234567"],
    province_name: "Улаанбаатар",
    district_name: "Сүхбаатар",
    region_name: "Улаанбаатар",
    image: "/images/news2.jpg",
  },
  {
    branch_id: 3,
    branch_name: "Чингэлтэй салбар",
    address: "Улаанбаатар, Чингэлтэй дүүрэг, Мэндэ орц",
    work_days: "Даваа - Баасан",
    work_hours: "09:00 - 18:00",
    latitude: "47.9261",
    longitude: "106.9202",
    phone_numbers: ["+976 11 345678"],
    province_name: "Улаанбаатар",
    district_name: "Чингэлтэй",
    region_name: "Улаанбаатар",
    image: "/images/news4.jpg",
  },
  {
    branch_id: 4,
    branch_name: "Дорноговь салбар",
    address: "Дорноговь аймаг, Улиассутай хот",
    work_days: "Даваа - Баасан",
    work_hours: "10:00 - 17:00",
    latitude: "47.7564",
    longitude: "104.4200",
    phone_numbers: ["+976 11 456789"],
    province_name: "Дорноговь",
    district_name: null,
    region_name: "Дорноговь",
    image: "/images/news5.jpg",
  },
  {
    branch_id: 5,
    branch_name: "Төв аймаг салбар",
    address: "Төв аймаг, Зуунмод хот",
    work_days: "Даваа - Баасан",
    work_hours: "10:00 - 17:00",
    latitude: "47.6517",
    longitude: "104.8637",
    phone_numbers: ["+976 11 567890"],
    province_name: "Төв",
    district_name: null,
    region_name: "Төв",
    image: "/images/news1.jpg",
  },
  {
    branch_id: 6,
    branch_name: "Дархан салбар",
    address: "Дархан-Уул аймаг, Дархан хот",
    work_days: "Даваа - Баасан",
    work_hours: "10:00 - 17:00",
    latitude: "49.4865",
    longitude: "105.9644",
    phone_numbers: ["+976 11 678901"],
    province_name: "Дархан-Уул",
    district_name: null,
    region_name: "Дархан-Уул",
    image: "/images/news2.jpg",
  },
];
