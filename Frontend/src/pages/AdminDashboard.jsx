import { useState } from "react";
import { Book, CreditCard, LogOut, Edit2, Trash2, Plus } from "lucide-react";

// Dummy data for admin
const initialBooks = [
  { id: 1, isbn: "978-0547928227", title: "The Hobbit", author: "J.R.R. Tolkien", available: true },
  { id: 2, isbn: "978-0451524935", title: "1984", author: "George Orwell", available: true },
  { id: 3, isbn: "978-0439708180", title: "Harry Potter", author: "J.K. Rowling", available: false },
];

const initialRentals = [
  { id: 1, book: "The Hobbit", user: "Alice", status: "Pending" },
  { id: 2, book: "1984", user: "Bob", status: "Returned" },
  { id: 3, book: "Harry Potter", user: "Charlie", status: "Pending" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState(initialBooks);
  const [rentals, setRentals] = useState(initialRentals);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => console.log("Logging out...");

  const filteredBooks = books.filter(book => {
    const searchLower = search.toLowerCase();
    return book.title.toLowerCase().includes(searchLower) || book.isbn.toLowerCase().includes(searchLower);
  });

  const pendingRentals = rentals.filter(r => r.status === "Pending");
  const rentalHistory = rentals.filter(r => r.status !== "Pending");

  const openNewBookModal = () => {
    setSelectedBook({ isbn: "", title: "", author: "", available: true });
    setIsEditing(false);
  };

  const openEditBookModal = (book) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const saveBook = () => {
    if (isEditing) {
      setBooks(books.map(b => b.id === selectedBook.id ? selectedBook : b));
    } else {
      setBooks([...books, { ...selectedBook, id: books.length + 1 }]);
    }
    setSelectedBook(null);
  };

  const deleteBook = (id) => setBooks(books.filter(b => b.id !== id));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2">
          <Book className="w-6 h-6" /> Admin Panel
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${activeTab === "books" ? "bg-gray-700" : ""}`}
            onClick={() => setActiveTab("books")}
          >
            <Book className="inline w-4 h-4 mr-2" /> Books
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${activeTab === "rentals" ? "bg-gray-700" : ""}`}
            onClick={() => setActiveTab("rentals")}
          >
            <CreditCard className="inline w-4 h-4 mr-2" /> Rentals
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mt-4 text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="inline w-4 h-4 mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "books" && (
          <div>
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search by ISBN or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gradient1"
              />
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded flex items-center gap-2"
                onClick={openNewBookModal}
              >
                <Plus className="w-4 h-4" /> Add Book
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <div
                  key={book.id}
                  className="bg-gradientcard1 p-4 rounded-lg shadow-glass border border-gradient1/50 relative"
                >
                  <h3 className="font-bold text-lg bg-gradient-to-r from-gradient1 to-gradient2 bg-clip-text text-transparent">{book.title}</h3>
                  <p className="text-gray-200">Author: {book.author}</p>
                  <p className="text-gray-200">ISBN: {book.isbn}</p>
                  <p className={`mt-2 font-semibold ${book.available ? "text-green-400" : "text-red-400"}`}>
                    {book.available ? "Available" : "Not available"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 py-1 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90 flex items-center justify-center gap-1"
                      onClick={() => openEditBookModal(book)}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      className="flex-1 py-1 bg-red-500 text-white rounded hover:opacity-90 flex items-center justify-center gap-1"
                      onClick={() => deleteBook(book.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Pending Rentals</h2>
              {pendingRentals.length > 0 ? (
                <ul className="space-y-2">
                  {pendingRentals.map(r => (
                    <li key={r.id} className="bg-gradientcard1 p-4 rounded shadow-glass border border-gradient1/50">
                      <span className="font-semibold">{r.book}</span> by {r.user}
                    </li>
                  ))}
                </ul>
              ) : <p>No pending rentals.</p>}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Rental History</h2>
              {rentalHistory.length > 0 ? (
                <ul className="space-y-2">
                  {rentalHistory.map(r => (
                    <li key={r.id} className="bg-gradientcard1 p-4 rounded shadow-glass border border-gradient1/50">
                      <span className="font-semibold">{r.book}</span> by {r.user} - {r.status}
                    </li>
                  ))}
                </ul>
              ) : <p>No rental history.</p>}
            </div>
          </div>
        )}
      </main>

      {/* Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">{isEditing ? "Edit Book" : "Add Book"}</h2>
            <input
              type="text"
              placeholder="Title"
              value={selectedBook.title}
              onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
              className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gradient1"
            />
            <input
              type="text"
              placeholder="Author"
              value={selectedBook.author}
              onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
              className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gradient1"
            />
            <input
              type="text"
              placeholder="ISBN"
              value={selectedBook.isbn}
              onChange={(e) => setSelectedBook({...selectedBook, isbn: e.target.value})}
              className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gradient1"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={selectedBook.available}
                onChange={() => setSelectedBook({...selectedBook, available: !selectedBook.available})}
                className="form-checkbox h-4 w-4"
              />
              Available
            </label>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-700"
                onClick={() => setSelectedBook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90"
                onClick={saveBook}
              >
                {isEditing ? "Save Changes" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
