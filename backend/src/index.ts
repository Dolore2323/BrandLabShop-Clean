import express from 'express';
import { AliExpressService } from './marketplaces/aliexpress';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Marketplace Integration Backend is running');
});

const aliexpressService = new AliExpressService(process.env.ALIEXPRESS_API_KEY || '', process.env.ALIEXPRESS_API_SECRET || '');

app.get('/aliexpress/products/import', async (req, res) => {
  const products = await aliexpressService.importProducts();
  res.json(products);
});

app.post('/aliexpress/stock-sync', async (req, res) => {
  const result = await aliexpressService.syncStockAndPrices();
  res.json({ success: result });
});

app.post('/aliexpress/orders/process', async (req, res) => {
  const result = await aliexpressService.processOrders();
  res.json({ success: result });
});

const PORT = process.env.PORT || 8885;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 