import axios from './axios';

export const getMovementsRequest = () => axios.get('/movements');
export const deleteMovementsRequest = () => axios.delete('/movements');
