const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/hello', (request, response) => {return response.send('Hello world');
});
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

var admin = require("firebase-admin");

var serviceAccount = require(__dirname + "/snekiwebshop-firebase-adminsdk-fbsvc-7150c1bcf4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.get('/products', async (req, res) => {
  try {

      const productsRef = admin.firestore().collection('products');
      const snapshot = await productsRef.get();
      
      if (snapshot.empty) {
          return res.status(404).json({ message: 'No products found' });
      }


      const products = [];
      snapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
      });


      return res.json(products);
  } catch (error) {
      console.error("Error fetching products: ", error);
      return res.status(500).json({ message: 'Error fetching products' });
  }
});

app.get('/products/sorted', async (req, res) => {
  try {
      const productsRef = admin.firestore().collection('products');
      
      const snapshot = await productsRef.orderBy('price', 'asc').get();
      
      if (snapshot.empty) {
          return res.status(404).json({ message: 'No products found' });
      }

      const products = [];
      snapshot.forEach(doc => {
          const product = doc.data();
          

          if (product.price !== undefined) {
              products.push({ id: doc.id, ...product });
          }
      });


      return res.json(products);
  } catch (error) {
      console.error("Error fetching sorted products by price: ", error);
      return res.status(500).json({ message: 'Error fetching sorted products' });
  }
});