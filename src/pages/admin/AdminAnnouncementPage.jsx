import { cn } from "../../utils/cn";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAnnouncement, updateAnnouncement } from "../../store/dataSlice";
import { Card, CardContent, Input, Button } from "../../components/ui";

export const AdminAnnouncementPage = () => {
  const dispatch = useDispatch();
  const announcement = useSelector(selectAnnouncement);

  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (announcement) {
      setText(announcement.text);
      setIsActive(announcement.isActive);
    }
  }, [announcement]);

  const handleSave = () => {
    dispatch(updateAnnouncement({ text, isActive }));
    sessionStorage.removeItem("announcementDismissed");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className={cn("p-6 w-full max-w-4xl")}>
      <div className={cn("mb-8")}>
        <h1 className={cn("text-2xl font-bold text-gray-900 mb-2")}>
          Announcement Settings
        </h1>
        <p className={cn("text-gray-500")}>
          Manage the top banner displayed across the storefront.
        </p>
      </div>

      <Card
        className={cn("p-0 overflow-hidden shadow-sm border border-gray-100")}
      >
        <CardContent className={cn("p-6")}>
          <div className={cn("flex flex-col gap-6")}>
            {/* Status Toggle */}
            <div className={cn("flex items-center justify-between")}>
              <div>
                <h3 className={cn("font-semibold text-gray-900")}>
                  Enable Announcement
                </h3>
                <p className={cn("text-sm text-gray-500")}>
                  Show the announcement banner at the top of the storefront.
                </p>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer",
                  isActive ? "bg-black" : "bg-gray-300",
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    isActive ? "translate-x-6" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            <hr className={cn("border-gray-100")} />

            {/* Text Input */}
            <Input
              label="Announcement Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Free Shipping On Orders Over $49"
              className={cn("h-12")}
            />

            {/* Preview */}
            <div>
              <label className={cn("block font-semibold text-gray-900 mb-2")}>
                Preview
              </label>
              <div
                className={cn(
                  "bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center text-sm font-semibold h-10 flex items-center justify-center uppercase tracking-[0.2em] shadow-sm relative px-8",
                )}
              >
                <p className={cn("truncate")}>{text || "Your text here"}</p>
                <div
                  className={cn(
                    "absolute right-4 w-6 h-6 flex items-center justify-center",
                  )}
                >
                  <i className={cn("fa-solid fa-xmark text-sm")}></i>
                </div>
              </div>
            </div>

            <div className={cn("flex justify-end mt-4")}>
              <Button
                onClick={handleSave}
                className={cn(
                  "px-6 h-10 font-bold transition-colors shadow-lg",
                  isSaved
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-black hover:bg-gray-900 text-white",
                )}
              >
                {isSaved ? (
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-check"></i> Saved!
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
