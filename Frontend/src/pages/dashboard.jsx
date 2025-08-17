import { useEffect, useState } from "react";
import { Book, CreditCard, LogOut } from "lucide-react";
import { useBooksStore } from "../store/useBookStore";
import BookCard from "../components/BookCard";
import { useRentalStore } from "../store/useRentalStore";
import RentalCard from "../components/RentalCard";
import { useUserStore } from "../store/useUserStore";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const { user, logoutUser } = useUserStore();
  const { books, fetchBooks } = useBooksStore();
  const { userRentals, fetchRentalsByUser, returnRental, extendRentalDate, createRental } =
    useRentalStore();

  useEffect(() => {
    fetchBooks();
    fetchRentalsByUser();
  }, [fetchBooks, fetchRentalsByUser]);

  const handleLogout = () => {
    logoutUser();
  };

  const handleRent = async (book) => {
    setSelectedBook(book);
  };

  const confirmRental = async (bookId) => {
    try {
      await createRental(bookId);
      fetchRentalsByUser();
      fetchBooks();
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to create rental:", error);
    }
  };

  const handleExtend = async (rentalId) => {
    try {
      await extendRentalDate(rentalId);
      fetchRentalsByUser();
    } catch (err) {
      console.error("Failed to extend rental:", err);
    }
  };

  const handleReturn = async (rentalId) => {
    try {
      await returnRental(rentalId);
      fetchRentalsByUser();
      fetchBooks();
    } catch (err) {
      console.error("Failed to return rental:", err);
    }
  };

  const filteredBooks = books?.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesAvailability = filterAvailable ? book.available : true;
    return matchesSearch && matchesAvailability;
  });

  const pendingRentals = userRentals.filter((r) => !r.returned);
  const rentalHistory = userRentals.filter((r) => r.returned);

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-gradient-to-b from-gradienthero1 to-gradienthero2 text-gray-100 flex flex-col min-h-screen border-r border-gradient1/50">
        <div className="p-6 flex flex-col gap-4">
          <div className="text-lg font-semibold">Welcome, {user?.name || "User"}!</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Book className="w-6 h-6" /> Book Rental
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gradient-to-r from-gradient1 to-gradient2 cursor-pointer text-lg font-semibold ${
              activeTab === "books" ? "border border-gradient1" : ""
            }`}
            onClick={() => setActiveTab("books")}
          >
            <Book className="inline w-4 h-4 mr-2" /> Books
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded hover:bg-gradient-to-r from-gradient1 to-gradient2 cursor-pointer  text-lg font-semibold ${
              activeTab === "rentals" ? "border border-gradient1" : ""
            }`}
            onClick={() => setActiveTab("rentals")}
          >
            <CreditCard className="inline w-4 h-4 mr-2" /> Rentals
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded  mt-4 text-red-400 cursor-pointer text-lg font-semibold "
            onClick={handleLogout}
          >
            <LogOut className="inline w-4 h-4 mr-2" /> Logout
          </button>
        </nav>
      </aside>


      <main className="flex-1 p-8  max-h-screen overflow-y-scroll">
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
                filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onRent={handleRent}
                    hasPendingRentals={pendingRentals.length > 0}
                  />
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
      <h2 className="text-xl font-bold mb-5">Pending Rentals</h2>
      {pendingRentals.length > 0 ? (
        <ul className="space-y-4">
          {pendingRentals.map((r) => (
            <RentalCard key={r.rentalId} r={r} onExtend={handleExtend} onReturn={handleReturn} />
          ))}
        </ul>
      ) : (
        <p>No pending rentals.</p>
      )}
    </div>

    <div>
      <h2 className="text-xl font-bold mb-5">Rental History</h2>
      {rentalHistory.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rentalHistory.map((r) => (
            <RentalCard key={r.rentalId} r={r} onExtend={handleExtend} onReturn={handleReturn} />
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full border border-gradient1">
            <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
            <p className="mb-4 text-gray-300">{selectedBook.author}</p>
            <p className="mb-4 text-gray-300">Genre: {selectedBook.genre || "N/A"}</p>
            <p className="mb-4 text-gray-300">ISBN: {selectedBook.isbn || "N/A"}</p>
            <p className="mb-4 text-green-400 font-semibold">Available</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedBook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90 cursor-pointer"
                onClick={() => confirmRental(selectedBook.id)}
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
