//Basic CRUD Operation

// Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 13.99 } })

// Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" })

//Advance queries
// Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// Return only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// Sort books by price ascending
db.books.find().sort({ price: 1 })

// Sort books by price descending
db.books.find().sort({ price: -1 })

// Page 1: First 5 books
db.books.find().skip(0).limit(5)

// Page 2: Next 5 books
db.books.find().skip(5).limit(5)



