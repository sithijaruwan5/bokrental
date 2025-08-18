import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const BookCard = ({ book, onRent, hasPendingRentals, isAdmin, onEdit, onDelete }) => {
  return (
    <div
      key={book.id}
      className="bg-gradientcard1 p-8 rounded-lg shadow-glass border border-gradient1/50 hover:shadow-lg transition relative"
    >
      <h3 className="font-bold text-xl">{book.title}</h3>
      <p className="text-gradient1 text-lg">{book.author}</p>
      <p>Genre: {book.genre || "N/A"}</p>
      <p className="text-gray-400 mt-1">ISBN: {book.isbn || "N/A"} </p>

      <p
        className={`mt-2 font-semibold ${
          book.available ? "text-green-400" : "text-red-400"
        }`}
      >
        {book.available ? "Available" : "Not available"}
      </p>


      {book.available && onRent && (
        <div className="w-full flex justify-end relative group">
          <button
            className={`mt-4 w-50 py-2 text-white text-lg font-semibold rounded transition ${
              hasPendingRentals
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-gradient1 to-gradient2 hover:opacity-90 cursor-pointer"
            }`}
            disabled={hasPendingRentals}
            onClick={() => onRent(book)}
          >
            Rent
          </button>

          {hasPendingRentals && (
            <span className="absolute bottom-full mb-2 px-3 py-1 rounded bg-black text-white text-sm opacity-0 group-hover:opacity-100 transition pointer-events-none">
              You have pending rentals.
            </span>
          )}
        </div>
      )}


      {isAdmin && book.available && (
        <div className="flex gap-3 mt-4 justify-end">
        
          <button
            className=" w-30 py-2 bg-red-500 text-white rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
            onClick={() => onDelete(book.id)}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button
            className="w-30 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
            onClick={() => onEdit(book)}
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
