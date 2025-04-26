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

var serviceAccount = require("../snekiwebshop-firebase-adminsdk-fbsvc-423d8c9f11.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); //Dodano za pregledniji kod

app.get('/products', async (req, res) => {
  try {

      const productsRef = db.collection('products');
      const snapshot = await db.collection('products').get();
      
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
        const productsRef = db.collection('products');
        
        const snapshot = await productsRef.orderBy('price', 'asc').get();
        
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No products found' });
        }
  
        const products = [];
        snapshot.forEach(doc => {
            const product = doc.data();
            console.log(product);  // Debugging: log each product to the console
            
            if (typeof product.price === 'number') {
                products.push({ id: doc.id, ...product });
            }
        });
  
        // Sorting the products in case something unexpected happens with Firestore query
        products.sort((a, b) => a.price - b.price);
        return res.json(products);
    } catch (error) {
        console.error("Error fetching sorted products by price: ", error);
        return res.status(500).json({ message: 'Error fetching sorted products' });
    }
  });
  
app.get('/products/category/:categoryName', async (req, res) => {
    try {
      const categoryName = req.params.categoryName;
      const snapshot = await db.collection('products').where('category', '==', categoryName).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: 'No products found for this category' });
      }
  
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
  
      return res.json(products);
    } catch (error) {
      console.error("Error filtering products: ", error);
      return res.status(500).json({ message: 'Error filtering products' });
    }
  });
  
  app.post('/products', async (req, res) => {
    try {
      const newProduct = req.body;
  
      const docRef = await db.collection('products').add(newProduct);
      return res.status(201).json({ message: 'Product added', id: docRef.id });
    } catch (error) {
      console.error("Error adding product: ", error);
      return res.status(500).json({ message: 'Error adding product' });
    }
  });
  
  app.put('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
  
      await db.collection('products').doc(productId).update(updatedData);
      return res.json({ message: 'Product updated' });
    } catch (error) {
      console.error("Error updating product: ", error);
      return res.status(500).json({ message: 'Error updating product' });
    }
  });
  
  app.delete('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      await db.collection('products').doc(productId).delete();
      return res.json({ message: 'Product deleted' });
    } catch (error) {
      console.error("Error deleting product: ", error);
      return res.status(500).json({ message: 'Error deleting product' });
    }
  });