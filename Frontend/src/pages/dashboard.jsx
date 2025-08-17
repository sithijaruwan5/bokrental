import { useEffect, useState } from "react";
import { Book, CreditCard, LogOut } from "lucide-react";
import { useBooksStore } from "../store/useBookStore";
import BookCard from "../components/BookCard";
import { useRentalStore } from "../store/useRentalStore";

// Dummy data
const initialBooks = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", available: true },
  { id: 2, title: "1984", author: "George Orwell", available: false },
  { id: 3, title: "Harry Potter", author: "J.K. Rowling", available: true },
];

const initialRentals = [
  { id: 1, book: "The Hobbit", user: "Alice", status: "Pending" },
  { id: 2, book: "1984", user: "Bob", status: "Returned" },
  { id: 3, book: "Harry Potter", user: "Charlie", status: "Pending" },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");

  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const { books, searchResults, fetchBooks } = useBooksStore();
  const { rentals , fetchRentals } = useRentalStore();

  console.log("Books in UserDashboard:", books);
  console.log("Rentals in UserDashboard:", rentals);

  useEffect(() => {
    fetchBooks();
    fetchRentals();

  }, [fetchBooks, fetchRentals]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleRent = (book) => {
    setSelectedBook(book);
  };

  const confirmRental = () => {

  };

  const filteredBooks = books?.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesAvailability = filterAvailable ? book.available : true;
    return matchesSearch && matchesAvailability;
  });

  const pendingRentals = rentals.filter((r) => r.returned === false);
  const rentalHistory = rentals.filter((r) => r.returned === true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2">
          <Book className="w-6 h-6" /> Book Rental
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "books" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("books")}
          >
            <Book className="inline w-4 h-4 mr-2" /> Books
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "rentals" ? "bg-gray-700" : ""
            }`}
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
                placeholder="Search books..."
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (<BookCard key={book.id} book={book} onRent={() => handleRent(book)} />
                ))
              ) : (
                <p>No books found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Pending Rentals</h2>
              {pendingRentals.length > 0 ? (
                <ul className="space-y-2">
                  {pendingRentals.map((r) => (
                    <li
                      key={r.rentalId}
                      className="bg-gradientcard1 p-4 rounded shadow-glass border border-gradient1/50"
                    >
                      <span className="font-semibold">{r.book.title}</span> by{" "}
                      {r.userName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending rentals.</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Rental History</h2>
              {rentalHistory.length > 0 ? (
                <ul className="space-y-2">
                  {rentalHistory.map((r) => (
                    <li
                      key={r.rentalId}
                      className="bg-gradientcard1 p-4 rounded shadow-glass border border-gradient1/50"
                    >
                      <span className="font-semibold">{r.book.title}</span> by{" "}
                      {r.userName} - {r.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rental history.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Rent Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
            <p className="mb-4 text-gray-300">Author: {selectedBook.author}</p>
            <p className="mb-4 text-green-400 font-semibold">Available</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-700"
                onClick={() => setSelectedBook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90"
                onClick={confirmRental}
              >
                Confirm Rental
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
