import React from "react";

const BookCard = ({ book }) => {
  return (
    <div
      key={book.id}
      className="bg-gradientcard1 p-8 rounded-lg shadow-glass border border-gradient1/50 hover:shadow-lg transition relative"
    >
      <h3 className="font-bold text-xl ">{book.title}</h3>
      <p className="text-gradient1">{book.author}</p>
      <p>Genre: {book.genre || "N/A"}</p>
      <p className="text-gray-400 mt-1">ISBN: {book.isbn || "N/A"} </p>

      <p
        className={`mt-2 font-semibold ${
          book.available ? "text-green-400" : "text-red-400"
        }`}
      >
        {book.available ? "Available" : "Not available"}
      </p>
      {book.available && (
        <div className="w-full flex justify-end">
          <button
            className="mt-4 w-50 py-2 bg-gradient-to-r from-gradient1 to-gradient2 text-white text-lg font-semibold rounded hover:opacity-90 transition cursor-pointer"
            onClick={() => handleRent(book)}
          >
            Rent
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
