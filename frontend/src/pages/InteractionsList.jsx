import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInteractions,
  updateInteraction,
} from "../redux/interactionsSlice";

const InteractionsList = () => {
  const dispatch = useDispatch();
  const {
    items: interactions,
    status,
    error,
  } = useSelector((state) => state.interactions);

  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchInteractions());
    }
  }, [status, dispatch]);

  const handleUpdate = async (id) => {
    try {
      await dispatch(updateInteraction({ id, notes: editNotes })).unwrap();
      setEditingId(null);
    } catch (err) {
      alert("Failed to update notes.");
    }
  };

  if (status === "loading") {
    return (
      <div className="mt-4 p-4 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-medium">
        Loading interaction history...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-4 p-4 rounded-md bg-red-50 text-red-800 border border-red-200 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6 mt-0">
        CRM Interaction Logs
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-600">
              <th className="p-4 font-semibold">HCP Name</th>
              <th className="p-4 font-semibold w-1/2">Notes</th>
              <th className="p-4 font-semibold">AI Summary</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  No interactions logged yet.
                </td>
              </tr>
            ) : (
              interactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 text-slate-800 font-medium">
                    {item.hcp_name}
                  </td>
                  <td className="p-4 text-slate-600">
                    {editingId === item.id ? (
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                        rows="3"
                      />
                    ) : (
                      <span className="whitespace-pre-line text-sm">
                        {item.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 italic text-sm">
                    {item.summary}
                  </td>
                  <td className="p-4 text-center">
                    {editingId === item.id ? (
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-md font-medium text-sm transition-colors shadow-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditNotes(item.notes);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-md font-medium text-sm transition-colors shadow-sm"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InteractionsList;
