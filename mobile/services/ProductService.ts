import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  rating: number;
  description: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  display_name: string;
}

class ProductService {
  async getProducts(category?: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  }

  // Mock data for development
  getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'אוזניות אלחוטיות פרימיום',
        price: 1200,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'electronics',
        rating: 4.8,
        description: 'אוזניות אלחוטיות באיכות גבוהה עם ביטול רעשים',
        colors: ['שחור', 'לבן', 'כחול'],
        stock: 50,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'שעון כושר חכם',
        price: 800,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'electronics',
        rating: 4.6,
        description: 'מעקב כושר מתקדם עם מוניטור דופק',
        colors: ['שחור', 'כסף', 'זהב'],
        stock: 30,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'חולצת טי אורגנית',
        price: 120,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        category: 'mens-clothing',
        rating: 4.5,
        description: 'חולצת טי נוחה וידידותית לסביבה',
        colors: ['לבן', 'שחור', 'אפור', 'כחול'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100,
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'שמלה אלגנטית',
        price: 450,
        image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
        category: 'womens-clothing',
        rating: 4.7,
        description: 'שמלה אלגנטית לאירועים מיוחדים',
        colors: ['שחור', 'אדום', 'כחול'],
        sizes: ['XS', 'S', 'M', 'L'],
        stock: 25,
        created_at: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'משקפי שמש מעצבים',
        price: 650,
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        category: 'accessories',
        rating: 4.7,
        description: 'משקפי שמש אופנתיים עם הגנה מפני UV',
        colors: ['שחור', 'חום', 'כחול'],
        stock: 40,
        created_at: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'רמקול בלוטות אלחוטי',
        price: 360,
        image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        category: 'electronics',
        rating: 4.4,
        description: 'רמקול נייד עם איכות סאונד מדהימה',
        colors: ['שחור', 'לבן', 'אדום'],
        stock: 60,
        created_at: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'ארנק עור',
        price: 200,
        image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        category: 'accessories',
        rating: 4.3,
        description: 'ארנק עור אמיתי עם מספר כיסי כרטיסים',
        colors: ['חום', 'שחור', 'חום כהה'],
        stock: 35,
        created_at: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'נעלי ספורט',
        price: 350,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'mens-shoes',
        rating: 4.6,
        description: 'נעלי ספורט נוחות לפעילות גופנית',
        colors: ['לבן', 'שחור', 'אפור'],
        sizes: ['39', '40', '41', '42', '43', '44'],
        stock: 45,
        created_at: new Date().toISOString(),
      },
      {
        id: '9',
        name: 'שמלה לילדה',
        price: 180,
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        category: 'kids-clothing',
        rating: 4.8,
        description: 'שמלה יפה ונוחה לילדות',
        colors: ['ורוד', 'כחול', 'צהוב'],
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        stock: 20,
        created_at: new Date().toISOString(),
      },
      {
        id: '10',
        name: 'עגלת קניות',
        price: 280,
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        category: 'home',
        rating: 4.5,
        description: 'עגלת קניות מעוצבת לבית',
        colors: ['שחור', 'לבן', 'אפור'],
        stock: 15,
        created_at: new Date().toISOString(),
      },
    ];
  }

  getMockCategories(): Category[] {
    return [
      { id: 'all', name: 'הכל', icon: 'grid', display_name: 'הכל' },
      { id: 'electronics', name: 'אלקטרוניקה', icon: 'laptopcomputer', display_name: 'אלקטרוניקה' },
      { id: 'mens-clothing', name: 'ביגוד גברים', icon: 'person', display_name: 'ביגוד גברים' },
      { id: 'womens-clothing', name: 'ביגוד נשים', icon: 'person.fill', display_name: 'ביגוד נשים' },
      { id: 'kids-clothing', name: 'ביגוד ילדים', icon: 'heart', display_name: 'ביגוד ילדים' },
      { id: 'mens-shoes', name: 'נעליים גברים', icon: 'shoe', display_name: 'נעליים גברים' },
      { id: 'womens-shoes', name: 'נעליים נשים', icon: 'shoe.fill', display_name: 'נעליים נשים' },
      { id: 'accessories', name: 'אביזרים', icon: 'bag', display_name: 'אביזרים' },
      { id: 'home', name: 'בית', icon: 'house', display_name: 'בית' },
    ];
  }
}

export const productService = new ProductService(); 