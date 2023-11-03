const mongoose = require('mongoose');
mongoose.connect(process.env.mongoURL).then(()=>console.log('Connected with DB')).catch((error)=> console.log(`Erorr ${error} has occured`));
