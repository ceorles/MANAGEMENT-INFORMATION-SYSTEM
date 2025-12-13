// make it true to run it in pythonanywhere
const IS_PRODUCTION = true; 
// make it false to run in localhost
// const IS_PRODUCTION = false;

const PRODUCTION_URL = 'https://librarymis.pythonanywhere.com'; 
const LOCAL_URL = 'http://127.0.0.1:8000';

export const API_URL = IS_PRODUCTION ? PRODUCTION_URL : LOCAL_URL;