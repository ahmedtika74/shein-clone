import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Button, Modal } from "../../components/ui";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  deleteContactMessageThunk,
  fetchContactMessagesThunk,
  selectContactMessages,
  updateContactMessageStatusThunk,
} from "../../store/dataSlice";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

export const AdminContactMessagesPage = () => {
  const { t } = useTranslation(["admin", "common"]);
  const dispatch = useDispatch();
  const messages = useSelector(selectContactMessages);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadMessages = () => {
    setLoading(true);
    setError("");
    return dispatch(fetchContactMessagesThunk())
      .unwrap()
      .then(() => setError(""))
      .catch((err) => setError(err || t("failedToLoadMessages")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, [dispatch]);

  const filtered = useMemo(() => {
    const sorted = [...messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    if (filterStatus === "ALL") return sorted;
    return sorted.filter((msg) => msg.status === filterStatus);
  }, [messages, filterStatus]);

  const handleStatus = async (id, status) => {
    setActionError("");
    setBusyId(id);
    try {
      await dispatch(updateContactMessageStatusThunk({ id, status })).unwrap();
    } catch (err) {
      setActionError(err || t("failedToUpdateMessageStatus"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionError("");
    setBusyId(deleteId);
    try {
      await dispatch(deleteContactMessageThunk(deleteId)).unwrap();
      if (expandedId === deleteId) setExpandedId(null);
      setDeleteId(null);
    } catch (err) {
      setActionError(err || t("failedToDeleteMessage"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
        )}
      >
        <div>
          <h1 className={cn("text-2xl font-bold text-gray-900")}>
            {t("contactMessages")}
          </h1>
          <p className={cn("text-sm text-gray-500 mt-1")}>
            {t("contactMessagesHint")}
          </p>
        </div>
        <div className={cn("flex items-center gap-2")}>
          <label className={cn("text-xs font-bold text-gray-500 uppercase")}>
            {t("status")}
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-black",
            )}
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="Pending">{t("pending")}</option>
            <option value="Completed">{t("completed")}</option>
          </select>
        </div>
      </div>

      {(error || actionError) && (
        <p className={cn("text-sm text-red-600 font-medium mb-4")}>
          {error || actionError}{" "}
          {error && (
            <button
              type="button"
              onClick={loadMessages}
              className={cn("underline font-bold cursor-pointer")}
            >
              {t("retry", { ns: "common" })}
            </button>
          )}
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div
          className={cn(
            "bg-white p-12 rounded-[20px] shadow-sm text-center text-gray-500",
          )}
        >
          <i
            className={cn(
              "fa-regular fa-envelope text-5xl text-gray-300 mb-3 block",
            )}
          ></i>
          {t("noContactMessages")}
        </div>
      ) : (
        <div className={cn("space-y-3")}>
          {filtered.map((msg) => {
            const isOpen = String(expandedId) === String(msg.id);
            const isBusy = String(busyId) === String(msg.id);
            const isCompleted = msg.status === "Completed";

            return (
              <div
                key={msg.id}
                className={cn(
                  "bg-white border rounded-xl shadow-sm overflow-hidden",
                  isCompleted ? "border-green-200" : "border-gray-200",
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : msg.id)}
                  className={cn(
                    "w-full text-start p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-gray-50",
                  )}
                >
                  <div className={cn("flex-1 min-w-0")}>
                    <div className={cn("flex flex-wrap items-center gap-2 mb-1")}>
                      <span className={cn("font-bold text-gray-900")}>
                        {msg.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-800",
                        )}
                      >
                        {isCompleted ? t("completed") : t("pending")}
                      </span>
                    </div>
                    <p className={cn("text-sm text-gray-700 font-medium truncate")}>
                      {msg.subject}
                    </p>
                    <p className={cn("text-xs text-gray-500 mt-1 truncate")}>
                      {msg.email}
                      {msg.phone ? ` · ${msg.phone}` : ""}
                      {" · "}
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  <i
                    className={cn(
                      "fa-solid fa-chevron-down text-gray-400 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  ></i>
                </button>

                {isOpen && (
                  <div
                    className={cn(
                      "border-t border-gray-100 px-4 sm:px-5 py-4 space-y-4",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm text-gray-700 whitespace-pre-line leading-relaxed",
                      )}
                    >
                      {msg.message}
                    </p>
                    <div className={cn("flex flex-wrap gap-2")}>
                      {!isCompleted ? (
                        <Button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatus(msg.id, "Completed")}
                          className={cn(
                            "h-10 px-4 bg-green-600 hover:bg-green-700",
                          )}
                        >
                          {t("markCompleted")}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isBusy}
                          onClick={() => handleStatus(msg.id, "Pending")}
                          className={cn("h-10 px-4")}
                        >
                          {t("markPending")}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => setDeleteId(msg.id)}
                        className={cn(
                          "h-10 px-4 text-red-600 border-red-200 hover:bg-red-50",
                        )}
                      >
                        {t("delete", { ns: "common" })}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title={t("confirmDelete")}
      >
        <p className={cn("text-sm text-gray-600 mb-6")}>
          {t("confirmDeleteMessage")}
        </p>
        <div className={cn("flex gap-3 justify-end")}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeleteId(null)}
          >
            {t("cancel", { ns: "common" })}
          </Button>
          <Button
            type="button"
            disabled={busyId != null}
            onClick={handleDelete}
            className={cn("bg-red-600 hover:bg-red-700")}
          >
            {t("delete", { ns: "common" })}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
