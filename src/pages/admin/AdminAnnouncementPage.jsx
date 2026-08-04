import { cn } from "../../utils/cn";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  removeAnnouncement,
} from "../../store/dataSlice";
import { Card, CardContent, Input, Button, Modal } from "../../components/ui";

export const AdminAnnouncementPage = () => {
  const dispatch = useDispatch();
  const announcements = useSelector(selectAnnouncements);

  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleAdd = () => {
    if (!newText.trim()) return;
    dispatch(
      addAnnouncement({
        id: Date.now(),
        text: newText.trim(),
        isActive: true,
      }),
    );
    setNewText("");
    flashSaved();
  };

  const handleToggle = (ann) => {
    dispatch(updateAnnouncement({ id: ann.id, isActive: !ann.isActive }));
  };

  const handleStartEdit = (ann) => {
    setEditingId(ann.id);
    setEditText(ann.text);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    dispatch(updateAnnouncement({ id: editingId, text: editText.trim() }));
    setEditingId(null);
    setEditText("");
    flashSaved();
  };

  const handleDelete = () => {
    dispatch(removeAnnouncement(deleteId));
    setDeleteId(null);
    flashSaved();
  };

  const flashSaved = () => {
    setIsSaved(true);
    sessionStorage.removeItem("announcementDismissed");
    setTimeout(() => setIsSaved(false), 2000);
  };

  const activeAnnouncements = announcements.filter((a) => a.isActive);

  return (
    <div className={cn("p-6 w-full max-w-4xl")}>
      <div className={cn("mb-8")}>
        <h1 className={cn("text-2xl font-bold text-gray-900 mb-2")}>
          Announcement Settings
        </h1>
        <p className={cn("text-gray-500")}>
          Manage the rotating announcement bar displayed across the storefront.
          Active announcements auto-rotate every 4 seconds.
        </p>
      </div>

      {/* Add New Announcement */}
      <Card
        className={cn(
          "p-0 overflow-hidden shadow-sm border border-gray-100 mb-6",
        )}
      >
        <CardContent className={cn("p-6")}>
          <h3 className={cn("font-bold text-gray-900 mb-4")}>
            Add New Announcement
          </h3>
          <div className={cn("flex gap-3")}>
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g., Free Shipping On Orders Over 500 EGP"
              className={cn("h-11")}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              onClick={handleAdd}
              disabled={!newText.trim()}
              className={cn("px-6 h-11 shrink-0")}
            >
              <i className="fa-solid fa-plus mr-2"></i> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <Card
        className={cn(
          "p-0 overflow-hidden shadow-sm border border-gray-100 mb-6",
        )}
      >
        <CardContent className={cn("p-6")}>
          <div className={cn("flex items-center justify-between mb-4")}>
            <h3 className={cn("font-bold text-gray-900")}>
              All Announcements ({announcements.length})
            </h3>
            <span className={cn("text-xs text-gray-500")}>
              {activeAnnouncements.length} active
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className={cn("text-center py-12 text-gray-400")}>
              <i className="fa-solid fa-bullhorn text-4xl mb-3 block opacity-30"></i>
              <p className={cn("font-medium")}>No announcements yet</p>
              <p className={cn("text-sm mt-1")}>
                Add your first announcement above.
              </p>
            </div>
          ) : (
            <div className={cn("space-y-3")}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    ann.isActive
                      ? "border-gray-200 bg-white"
                      : "border-gray-100 bg-gray-50 opacity-60",
                  )}
                >
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(ann)}
                    className={cn(
                      "w-10 h-5 rounded-full flex items-center transition-colors px-0.5 cursor-pointer shrink-0",
                      ann.isActive ? "bg-black" : "bg-gray-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        ann.isActive ? "translate-x-5" : "translate-x-0",
                      )}
                    />
                  </button>

                  {/* Text */}
                  {editingId === ann.id ? (
                    <div className={cn("flex-1 flex gap-2")}>
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={cn("h-9")}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={!editText.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        "flex-1 text-sm font-medium text-gray-800 truncate",
                      )}
                    >
                      {ann.text}
                    </span>
                  )}

                  {/* Actions */}
                  {editingId !== ann.id && (
                    <div className={cn("flex gap-1 shrink-0")}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(ann)}
                        className={cn("text-gray-400 hover:text-black")}
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(ann.id)}
                        className={cn("text-gray-400 hover:text-red-500")}
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card
        className={cn("p-0 overflow-hidden shadow-sm border border-gray-100")}
      >
        <CardContent className={cn("p-6")}>
          <label className={cn("block font-bold text-gray-900 mb-3")}>
            Preview
          </label>
          {activeAnnouncements.length > 0 ? (
            <div
              className={cn(
                "bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center text-sm font-semibold h-10 flex items-center justify-center uppercase tracking-[0.2em] shadow-sm relative px-8 rounded-lg overflow-hidden",
              )}
            >
              <p className={cn("truncate")}>{activeAnnouncements[0].text}</p>
              {activeAnnouncements.length > 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 bottom-0.5 flex gap-1",
                  )}
                >
                  {activeAnnouncements.map((_, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "w-1 h-1 rounded-full",
                        idx === 0 ? "bg-white w-2.5" : "bg-white/40",
                      )}
                    />
                  ))}
                </div>
              )}
              <div
                className={cn(
                  "absolute right-4 w-6 h-6 flex items-center justify-center",
                )}
              >
                <i className={cn("fa-solid fa-xmark text-sm")}></i>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "bg-gray-100 text-gray-400 text-center text-sm font-medium h-10 flex items-center justify-center rounded-lg",
              )}
            >
              No active announcements to display
            </div>
          )}
          {activeAnnouncements.length > 1 && (
            <p className={cn("text-xs text-gray-400 mt-2 text-center")}>
              {activeAnnouncements.length} announcements will auto-rotate every
              4 seconds
            </p>
          )}
        </CardContent>
      </Card>

      {/* Saved Toast */}
      {isSaved && (
        <div
          className={cn(
            "fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold z-50 animate-fade-in",
          )}
        >
          <i className="fa-solid fa-check"></i> Changes Saved!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Announcement"
        maxWidth="max-w-sm"
      >
        <div className={cn("text-center")}>
          <div
            className={cn(
              "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5",
            )}
          >
            <i className={cn("fa-solid fa-trash text-3xl")}></i>
          </div>
          <p className={cn("text-gray-500 mb-6 text-sm")}>
            Are you sure you want to delete this announcement? This action
            cannot be undone.
          </p>
          <div className={cn("flex flex-col gap-3")}>
            <Button
              variant="danger"
              onClick={handleDelete}
              className={cn("w-full py-3.5 rounded-xl font-bold")}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className={cn("w-full py-3.5 rounded-xl font-bold")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
