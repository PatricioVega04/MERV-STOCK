
import axios from "./axios";

export const registerSaleRequest = (saleData) => axios.post('/sales', saleData);