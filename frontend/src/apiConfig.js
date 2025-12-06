const IS_PRODUCTION = true;

const PRODUCTION_URL = 'https://librarymis.pythonanywhere.com'; 
const LOCAL_URL = 'http://127.0.0.1:8000';

export const API_URL = IS_PRODUCTION ? PRODUCTION_URL : LOCAL_URL;