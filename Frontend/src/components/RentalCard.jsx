import React from "react";

const RentalCard = ({ r, onExtend, onReturn, isAdmin, extendloading, returnLoading }) => {
  return (
    <div className="w-full bg-gradientcard1 p-6 px-10 rounded-lg shadow-glass border border-gradient1/50 hover:shadow-lg transition relative">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-xl mb-2">Rental ID: {r.rentalId}</h3>
          <p className="text-gray-300 mb-1 text-lg">Book: {r.book.title}</p>
          <p className="text-gray-300 mb-1 text-lg">
            Rented By: {r.userName}{" "}
            <span className=" text-gray-400">(User ID: {r.userId})</span>
          </p>
          <p className="text-gray-400 mb-1 text-lg">
            Rental Date: {new Date(r.rentalDate).toLocaleDateString()}
          </p>
          <p className="text-gray-400 mb-2 text-lg">
            Due Date: {new Date(r.returnDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-end">
          <p
            className={`mt-2 font-semibold text-right ${
              r.returned ? "text-green-400" : "text-red-400"
            }`}
          >
            {r.returned ? "Returned" : "Pending"}
          </p>
        </div>
      </div>


      {!r.returned && !isAdmin && (
        <div className="mt-2 flex items-end justify-end gap-5">
          <button
            className="border border-gradient1 p-3 text-lg font-semibold rounded-md cursor-pointer w-40 hover:opacity-90 transition"
            onClick={() => onExtend(r.rentalId)}
          >
            {extendloading ? ("Processing..."):("Extend Date")}
            
          </button>
          <button
            className="bg-gradient1 p-3 text-lg font-semibold rounded-md cursor-pointer w-40 hover:opacity-90 transition"
            onClick={() => onReturn(r.rentalId)}
          >
            {returnLoading ? ("Processing..."):("Return Book")}
         
          </button>
        </div>
      )}
    </div>
  );
};

export default RentalCard;
