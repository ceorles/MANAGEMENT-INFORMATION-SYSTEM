const IS_PRODUCTION = true; 

const PRODUCTION_URL = 'https://libyte.pythonanywhere.com';
const LOCAL_URL = 'http://127.0.0.1:8000';

const API_BASE_URL = IS_PRODUCTION ? PRODUCTION_URL : LOCAL_URL;

export default API_BASE_URL;