import 'dotenv/config';
import app from './src/app.js';

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});