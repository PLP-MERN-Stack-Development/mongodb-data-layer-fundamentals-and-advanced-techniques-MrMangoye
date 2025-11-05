// insert_books.js - Script to populate MongoDB with sample book data

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI (replace with your MongoDB connection string if using Atlas)
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Sample book data
const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  }
];

// Function to insert books into MongoDB
async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if collection already has documents
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Collection already contains ${count} documents. Dropping collection...`);
      await collection.drop();
      console.log('Collection dropped successfully');
    }

    // Insert the books
    const result = await collection.insertMany(books);
    console.log(`${result.insertedCount} books were successfully inserted into the database`);

    // Display the inserted books
    console.log('\nInserted books:');
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}
// Function to perform all tasks after inserting books
async function runTasks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n--- Task 2: Basic CRUD Operations ---');

    // Find all books in a specific genre
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log(`Fiction books: ${fictionBooks.length}`);

    // Find books published after a certain year
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log(`Books published after 1950: ${recentBooks.length}`);

    // Find books by a specific author
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log(`Books by George Orwell: ${orwellBooks.length}`);

    // Update the price of a specific book
    await collection.updateOne({ title: '1984' }, { $set: { price: 13.99 } });
    console.log('Updated price of "1984"');

    // Delete a book by its title
    await collection.deleteOne({ title: 'Moby Dick' });
    console.log('Deleted "Moby Dick"');

    console.log('\n--- Task 3: Advanced Queries ---');

    // Find books that are in stock and published after 2010
    const modernStock = await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log(`In-stock books published after 2010: ${modernStock.length}`);

    // Projection: title, author, price
    const projectedBooks = await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
    console.log('Projected fields (title, author, price):');
    console.table(projectedBooks);

    // Sorting by price ascending
    const sortedAsc = await collection.find().sort({ price: 1 }).toArray();
    console.log('Books sorted by price (ascending):');
    console.table(sortedAsc.map(b => ({ title: b.title, price: b.price })));

    // Sorting by price descending
    const sortedDesc = await collection.find().sort({ price: -1 }).toArray();
    console.log('Books sorted by price (descending):');
    console.table(sortedDesc.map(b => ({ title: b.title, price: b.price })));

    // Pagination: 5 books per page (page 1)
    const page1 = await collection.find().skip(0).limit(5).toArray();
    console.log('Page 1 (5 books):');
    console.table(page1.map(b => ({ title: b.title })));

    console.log('\n--- Task 4: Aggregation Pipeline ---');

    // Average price by genre
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: '$genre', avgPrice: { $avg: '$price' } } }
    ]).toArray();
    console.log('Average price by genre:');
    console.table(avgPriceByGenre);

    // Author with most books
    const topAuthor = await collection.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log('Author with most books:');
    console.table(topAuthor);

    // Group books by publication decade
    const booksByDecade = await collection.aggregate([
      {
        $group: {
          _id: { $floor: { $divide: ['$published_year', 10] } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          decade: { $multiply: ['$_id', 10] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { decade: 1 } }
    ]).toArray();
    console.log('Books grouped by decade:');
    console.table(booksByDecade);

    console.log('\n--- Task 5: Indexing ---');

    // Create index on title
    await collection.createIndex({ title: 1 });
    console.log('Index created on title');

    // Create compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log('Compound index created on author and published_year');

    // Use explain to show performance improvement
    const explainResult = await collection.find({ title: '1984' }).explain('executionStats');
    console.log('Explain output for title search:');
    console.log(JSON.stringify(explainResult.executionStats, null, 2));

  } catch (err) {
    console.error('Error during tasks:', err);
  } finally {
    await client.close();
    console.log('All tasks completed and connection closed');
  }
}

// Chain the task runner after insertion
insertBooks().then(runTasks).catch(console.error);

// Run the function
//insertBooks().catch(console.error);

/*
 * Example MongoDB queries you can try after running this script:
 *
 * 1. Find all books:
 *    db.books.find()
 *
 * 2. Find books by a specific author:
 *    db.books.find({ author: "George Orwell" })
 *
 * 3. Find books published after 1950:
 *    db.books.find({ published_year: { $gt: 1950 } })
 *
 * 4. Find books in a specific genre:
 *    db.books.find({ genre: "Fiction" })
 *
 * 5. Find in-stock books:
 *    db.books.find({ in_stock: true })
 */ 