import cron from 'node-cron';
import { AliExpressService } from './marketplaces/aliexpress';

const aliexpressService = new AliExpressService(process.env.ALIEXPRESS_API_KEY || '', process.env.ALIEXPRESS_API_SECRET || '');

// Импорт товаров каждый день в 03:00
cron.schedule('0 3 * * *', async () => {
  console.log('[CRON] Импорт товаров с AliExpress...');
  await aliexpressService.importProducts();
  console.log('[CRON] Импорт товаров завершён');
});

// Синхронизация остатков и цен каждый час
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Синхронизация остатков и цен с AliExpress...');
  await aliexpressService.syncStockAndPrices();
  console.log('[CRON] Синхронизация завершена');
});

// Обработка заказов каждые 10 минут
cron.schedule('*/10 * * * *', async () => {
  console.log('[CRON] Обработка заказов с AliExpress...');
  await aliexpressService.processOrders();
  console.log('[CRON] Обработка заказов завершена');
});

console.log('CRON задачи для AliExpress запущены'); 