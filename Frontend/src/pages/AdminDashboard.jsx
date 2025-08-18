import { useEffect, useState } from "react";
import { Book, CreditCard, LogOut, Plus } from "lucide-react";
import { useBooksStore } from "../store/useBookStore";
import { useRentalStore } from "../store/useRentalStore";
import BookCard from "../components/BookCard";
import RentalCard from "../components/RentalCard";
import { useUserStore } from "../store/useUserStore";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [errors, setErrors] = useState({});
  const [bookToDelete, setBookToDelete] = useState(null);

  const { books, fetchBooks, addBook, updateBook, deleteBook } = useBooksStore();
  const { rentals, fetchRentals } = useRentalStore();
  const { logoutUser } = useUserStore();

  useEffect(() => {
    fetchBooks();
    fetchRentals();
  }, [fetchBooks, fetchRentals]);

  const handleSaveBook = async (book) => {
    try {
      if (book.id) {
        await updateBook(book);
      } else {
        await addBook(book);
      }
      console.log("Saving book:", book);
      fetchBooks();
      setSelectedBook(null);
      setErrors({});
    } catch (err) {
      console.error("Failed to save book:", err);
    }
  };


  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks();
      setBookToDelete(null);
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };
  

  const validateBook = (book) => {
    const newErrors = {};
    if (!book.title?.trim()) newErrors.title = "Title is required";
    if (!book.author?.trim()) newErrors.author = "Author is required";
    if (!book.isbn?.trim()) newErrors.isbn = "ISBN is required";
    if (!book.genre?.trim()) newErrors.genre = "Genre is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesAvailability = filterAvailable ? book.available : true;
    return matchesSearch && matchesAvailability;
  });

  const pendingRentals = rentals.filter((r) => !r.returned);
  const rentalHistory = rentals.filter((r) => r.returned);

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-gradient-to-b from-gradienthero1 to-gradienthero2 text-gray-100 flex flex-col min-h-screen border-r border-gradient1/50">
        <div className="p-6 text-2xl font-bold flex items-center gap-2">
          <Book className="w-6 h-6" /> Admin Panel
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gradient-to-r from-gradient1 to-gradient2 font-semibold ${
              activeTab === "books" ? "border border-gradient1" : ""
            }`}
            onClick={() => setActiveTab("books")}
          >
            <Book className="inline w-4 h-4 mr-2" /> Books
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gradient-to-r from-gradient1 to-gradient2 font-semibold ${
              activeTab === "rentals" ? "border border-gradient1" : ""
            }`}
            onClick={() => setActiveTab("rentals")}
          >
            <CreditCard className="inline w-4 h-4 mr-2" /> Rentals
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded mt-4 text-red-400 font-semibold cursor-pointer"
            onClick={() => logoutUser()}
          >
            <LogOut className="inline w-4 h-4 mr-2" /> Logout
          </button>
        </nav>
      </aside>


      <main className="flex-1 p-8 max-h-screen overflow-y-scroll">
        {activeTab === "books" && (
          <div>
            <div className="flex justify-between mb-4">
              <div className="flex  gap-10">
                <input
                  type="text"
                  placeholder="Search by ISBN or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gradient1"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterAvailable}
                    onChange={() => setFilterAvailable(!filterAvailable)}
                    className="form-checkbox h-4 w-4"
                  />
                  Available only
                </label>
              </div>
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded flex items-center gap-2 cursor-pointer text-lg font-semibold"
                onClick={() =>
                  setSelectedBook({
                    isbn: "",
                    title: "",
                    author: "",
                    available: true,
                    genre: "",
                  })
                }
              >
                <Plus className="w-4 h-4" /> Add Book
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <BookCard
                  key={book.id}
                  book={book}
                  onEdit={setSelectedBook}
                  onDelete={() => setBookToDelete(book)} // instead of deleting directly
                  isAdmin={true}
                />
                
                ))
              ) : (
                <p>No books found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div>
              <h2 className="text-xl font-bold mb-5">Pending Rentals</h2>
              {pendingRentals.length > 0 ? (
                <ul className="space-y-4">
                  {pendingRentals.map((r) => (
                    <RentalCard key={r.id} r={r} isAdmin={true} />
                  ))}
                </ul>
              ) : (
                <p>No pending rentals.</p>
              )}
            </div>


            <div>
              <h2 className="text-xl font-bold mb-5">Rental History</h2>
              {rentalHistory.length > 0 ? (
                <ul className="space-y-4">
                  {rentalHistory.map((r) => (
                    <RentalCard key={r.id} r={r} isAdmin={true} />
                  ))}
                </ul>
              ) : (
                <p>No rental history.</p>
              )}
            </div>
          </div>
        )}
      </main>


      {selectedBook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 ">
          <div className="bg-gray-900 p-8 rounded-lg max-w-xl w-full border border-gradient1">
            <h2 className="text-2xl font-bold mb-4">
              {selectedBook.id ? "Edit Book" : "Add Book"}
            </h2>

            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={selectedBook.title}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, title: e.target.value })
              }
              className={`w-full mb-2 p-2 rounded bg-gray-800 border ${
                errors.title ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-gradient1`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-2">{errors.title}</p>
            )}

            <label className="block mb-1 font-semibold">Author</label>
            <input
              type="text"
              placeholder="Author"
              value={selectedBook.author}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, author: e.target.value })
              }
              className={`w-full mb-2 p-2 rounded bg-gray-800 border ${
                errors.author ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-gradient1`}
            />
            {errors.author && (
              <p className="text-red-500 text-sm mb-2">{errors.author}</p>
            )}

            <label className="block mb-1 font-semibold">ISBN</label>
            <input
              type="text"
              placeholder="ISBN"
              value={selectedBook.isbn}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, isbn: e.target.value })
              }
              className={`w-full mb-4 p-2 rounded bg-gray-800 border ${
                errors.isbn ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-gradient1`}
            />
            {errors.isbn && (
              <p className="text-red-500 text-sm mb-2">{errors.isbn}</p>
            )}

            <label className="block mb-1 font-semibold">Genre</label>
            <select
              value={selectedBook.genre || ""}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, genre: e.target.value })
              }
              className={`w-full mb-4 p-2 rounded bg-gray-800 border ${
                errors.genre ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-gradient1`}
            >
              <option value="">Select Genre</option>
              <option value="FICTION">Fiction</option>
              <option value="NON_FICTION">Non-Fiction</option>
              <option value="MYSTERY">Mystery</option>
              <option value="FANTASY">Fantasy</option>
              <option value="SCI_FI">Sci-Fi</option>
              <option value="BIOGRAPHY">Biography</option>
              <option value="HISTORY">History</option>
              <option value="ROMANCE">Romance</option>
              <option value="CHILDREN">Children</option>
            </select>
            {errors.genre && (
              <p className="text-red-500 text-sm mb-2">{errors.genre}</p>
            )}

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setSelectedBook(null);
                  setErrors({});
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90 cursor-pointer"
                onClick={() => {
                  if (validateBook(selectedBook)) handleSaveBook(selectedBook);
                }}
              >
                {selectedBook.id ? "Save Changes" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bookToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gradient1">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete the book
              <span className="font-semibold text-white">
                {" "}
                "{bookToDelete.title}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 cursor-pointer"
                onClick={() => setBookToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                onClick={() => handleDeleteBook(bookToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
