// Mock pages data for admin with localStorage sync
export interface CustomPage {
  id: string;
  slug: string;
  title_mn: string;
  title_en: string;
  content_mn: string;
  content_en: string;
  meta_description_mn?: string;
  meta_description_en?: string;
  image_url?: string; // Feature image for the page
  title_color?: string; // Title text color (hex code)
  title_size?: number; // Title font size in px
  title_weight?: string; // Title font weight (400, 500, 600, 700)
  title_family?: string; // Title font family
  content_color?: string; // Content text color (hex code)
  content_size?: number; // Content font size in px
  content_weight?: string; // Content font weight (400, 500, 600, 700)
  content_family?: string; // Content font family
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Default pages data
const defaultPages: CustomPage[] = [
  {
    id: '1',
    slug: 'about-us',
    title_mn: 'Бидний тухай',
    title_en: 'About Us',
    content_mn: `Манай компани нь 2020 онд үүсгэн байгуулагдсан бөгөөд санхүүгийн үйлчилгээний салбарт тэргүүлэгч байр суурийг эзэлдэг.

Бид үүнд дэмжлэг үзүүлдэг:
• Зээлийн үйлчилгээ
• Хадгаламжийн бүтээгдэхүүн
• Инвестицийн зөвлөгөө
• Санхүүгийн зөвлөгөө

Манай зорилго бол хэрэглэгчдийнхээ санхүүгийн зорилгод хүрэхэд туслах явдал юм.`,
    content_en: `Our company was established in 2020 and holds a leading position in the financial services sector.

We provide support in:
• Loan services
• Savings products
• Investment advice
• Financial consulting

Our goal is to help our customers achieve their financial objectives.`,
    meta_description_mn: 'Манай компанийн тухай дэлгэрэнгүй мэдээлэл',
    meta_description_en: 'Detailed information about our company',
    image_url: 'https://www.bichilglobus.mn/storage/uploadImages/b0efgylnq5cg0oc2022Dec28.jpg',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    slug: 'our-mission',
    title_mn: 'Манай эрхэм зорилго',
    title_en: 'Our Mission',
    content_mn: `Бид хэрэглэгчдийнхээ амьдралыг сайжруулахад чиглэсэн санхүүгийн шийдлүүд санал болгодог.

Манай үнэт зүйлс:
 Үйлчлүүлэгчийн аюулгүй байдал
 Итгэлцэл ба ил тод байдал  
 Инновац ба технологи
 Тогтвортой хөгжил

Бид ирээдүйн санхүүгийн шийдлийг өнөөдөр хэрэглэгчдэдээ хүргэх зорилготой.`,
    content_en: `We offer financial solutions aimed at improving the lives of our customers.

Our core values:
 Customer security
 Trust and transparency  
 Innovation and technology
 Sustainable development

We aim to bring future financial solutions to our customers today.`,
    meta_description_mn: 'Манай эрхэм зорилго болон үнэт зүйлс',
    meta_description_en: 'Our mission and core values',
    image_url: 'https://www.bichilglobus.mn/storage/uploadImages/b0efgylnq5cg0oc2022Dec28.jpg',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T11:45:00Z'
  },
  {
    id: '3',
    slug: 'contact',
    title_mn: 'Холбоо барих',
    title_en: 'Contact Us',
    content_mn: `Бидэнтэй холбогдох боломжит аргууд:

 Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо
 Утас: +976 1234 5678
 И-мэйл: info@company.mn
 Вэб: www.company.mn

Ажлын цаг:
Даваа - Баасан: 09:00 - 18:00
Бямба: 09:00 - 14:00
Ням: Амрах өдөр

Бидэнд хандаж байгаад баярлалаа!`,
    content_en: `Ways to contact us:

 Address: Ulaanbaatar, Sukhbaatar district, 1st khoroo
 Phone: +976 1234 5678
 Email: info@company.mn
 Web: www.company.mn

Working hours:
Monday - Friday: 09:00 - 18:00
Saturday: 09:00 - 14:00
Sunday: Rest day

Thank you for contacting us!`,
    meta_description_mn: 'Бидэнтэй холбогдох мэдээлэл',
    meta_description_en: 'Contact information',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-22T16:20:00Z'
  },
  {
    id: '4',
    slug: 'privacy-policy',
    title_mn: 'Нууцлалын бодлого',
    title_en: 'Privacy Policy',
    content_mn: `Энэхүү нууцлалын бодлого нь таны хувийн мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалж байгааг тайлбарладаг.

Мэдээлэл цуглуулах:
• Нэр, хаяг, утасны дугаар
• И-мэйл хаяг
• Санхүүгийн мэдээлэл (шаардлагатай тохиолдолд)

Мэдээлэл ашиглах зорилго:
• Үйлчилгээ үзүүлэх
• Харилцаа холбоо хийх
• Аюулгүй байдлыг хангах

Таны мэдээлэл найдвартай хадгалагдана.`,
    content_en: `This privacy policy explains how we collect, use and protect your personal information.

Information Collection:
• Name, address, phone number
• Email address
• Financial information (when necessary)

Purpose of Information Use:
• Providing services
• Communication
• Ensuring security

Your information is stored securely.`,
    meta_description_mn: 'Нууцлалын бодлого болон хувийн мэдээллийн хамгаалалт',
    meta_description_en: 'Privacy policy and personal data protection',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
    created_at: '2024-01-08T12:00:00Z',
    updated_at: '2024-01-25T10:15:00Z'
  },
  {
    id: '5',
    slug: 'terms-of-service',
    title_mn: 'Үйлчилгээний нөхцөл',
    title_en: 'Terms of Service',
    content_mn: `Энэхүү үйлчилгээний нөхцөлд манай платформыг ашиглахтай холбоотой дүрэм журмууд байна.

Ерөнхий нөхцөлүүд:
1. Бүртгэлийн мэдээлэл үнэн байх
2. Нууц үг аюулгүй хадгалах
3. Хууль бус үйл ажиллагаа явуулахгүй байх

Үүрэг хариуцлага:
• Үйлчлүүлэгчийн үүрэг
• Компанийн үүрэг
• Маргааныг шийдвэрлэх арга зам

Нөхцөлийг зөрчсөн тохиолдолд данс хаагдаж болно.`,
    content_en: `These terms of service contain rules related to using our platform.

General Conditions:
1. Registration information must be accurate
2. Keep passwords secure
3. Do not engage in illegal activities

Responsibilities:
• Customer responsibilities
• Company responsibilities
• Dispute resolution methods

Accounts may be closed if terms are violated.`,
    meta_description_mn: 'Үйлчилгээний нөхцөл болон дүрэм журам',
    meta_description_en: 'Terms of service and regulations',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-28T14:30:00Z'
  },
  {
    id: '6',
    slug: 'draft-example',
    title_mn: 'Ноорог хуудас',
    title_en: 'Draft Page',
    content_mn: 'Энэ бол ноорог хуудас - хараахан нийтлээгүй.',
    content_en: 'This is a draft page - not yet published.',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: false,
    created_at: '2024-01-30T10:00:00Z',
    updated_at: '2024-01-30T10:00:00Z'
  }
];

// LocalStorage helpers
function getStoredPages(): CustomPage[] {
  if (typeof window === 'undefined') return defaultPages;
  
  try {
    const stored = localStorage.getItem('cms_pages');
    return stored ? JSON.parse(stored) : defaultPages;
  } catch {
    return defaultPages;
  }
}

function saveToStorage(pages: CustomPage[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cms_pages', JSON.stringify(pages));
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('pages-updated'));
  } catch (error) {
    console.warn('Failed to save pages to localStorage:', error);
  }
}

// Initialize default data
function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('cms_pages');
  if (!stored) {
    saveToStorage(defaultPages);
  }
}

// Initialize on first load
if (typeof window !== 'undefined') {
  initializeStorage();
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// CRUD operations with localStorage
export const mockPagesService = {
  // Get all pages (admin view - includes drafts)
  getAllPages: async (): Promise<CustomPage[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return getStoredPages();
  },

  // Get published pages only (frontend view)
  getPublishedPages: async (): Promise<CustomPage[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getStoredPages().filter(page => page.is_published);
  },

  // Get page by slug (published only for frontend)
  getPageBySlug: async (slug: string): Promise<CustomPage | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const page = getStoredPages().find(p => p.slug === slug && p.is_published);
    return page || null;
  },

  // Create new page
  createPage: async (pageData: Omit<CustomPage, 'id' | 'created_at' | 'updated_at'>): Promise<CustomPage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPage: CustomPage = {
      ...pageData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const pages = getStoredPages();
    pages.push(newPage);
    saveToStorage(pages);
    
    return newPage;
  },

  // Update page
  updatePage: async (id: string, updateData: Partial<Omit<CustomPage, 'id' | 'created_at'>>): Promise<CustomPage | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pages = getStoredPages();
    const pageIndex = pages.findIndex(p => p.id === id);
    
    if (pageIndex === -1) return null;
    
    pages[pageIndex] = {
      ...pages[pageIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    saveToStorage(pages);
    return pages[pageIndex];
  },

  // Delete page
  deletePage: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const pages = getStoredPages();
    const filteredPages = pages.filter(p => p.id !== id);
    
    if (filteredPages.length < pages.length) {
      saveToStorage(filteredPages);
      return true;
    }
    
    return false;
  }
};

// Direct access functions (for frontend)
export function getMockPages(): CustomPage[] {
  return getStoredPages().filter(page => page.is_published);
}

export function getMockPageBySlug(slug: string): CustomPage | undefined {
  return getStoredPages().find(page => page.slug === slug && page.is_published);
}
