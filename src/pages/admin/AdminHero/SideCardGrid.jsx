import { cn } from "../../../utils/cn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, Button, Input } from "../../../components/ui";
import {
  updateLeftSideCard,
  updateRightSideCard,
} from "../../../store/dataSlice";

const SideCardEditor = ({ card, index, side }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card.title);
  const [actionText, setActionText] = useState(card.actionText);
  const [img, setImg] = useState(card.img);
  const [link, setLink] = useState(card.link || "");
  const [isEditing, setIsEditing] = useState(false);

  const [inputMode, setInputMode] = useState("upload");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImg(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updated = { title, actionText, img, link };
    if (side === "left") dispatch(updateLeftSideCard({ index, card: updated }));
    else dispatch(updateRightSideCard({ index, card: updated }));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card className={cn("p-0 overflow-hidden shadow-xs")}>
        <CardContent className={cn("p-4")}>
          <img
            src={card.img}
            alt={card.title}
            className={cn("w-full h-32 object-cover rounded-lg mb-3")}
          />
          <h4 className={cn("font-bold text-sm text-gray-900")}>
            {card.title}
          </h4>
          <p className={cn("text-xs text-gray-500 mb-1")}>{card.actionText}</p>
          <p className={cn("text-xs text-blue-500 truncate mb-3")}>
            {card.link || "No Link"}
          </p>
          <Button
            variant="outline"
            className={cn("w-full h-9 text-xs")}
            onClick={() => setIsEditing(true)}
          >
            Edit Card
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gray-50 shadow-xs p-0")}>
      <CardContent className={cn("p-4 space-y-3")}>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <Input
          label="Action Text"
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          placeholder="Action Text"
        />
        <div>
          <label
            className={cn(
              "block text-[10px] font-bold text-gray-500 uppercase mb-1",
            )}
          >
            Image Source
          </label>
          <div className={cn("flex bg-gray-200 p-1 rounded-lg w-fit mb-2")}>
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                inputMode === "upload"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                inputMode === "url"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              URL
            </button>
          </div>
          {inputMode === "upload" ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={cn("hidden")}
                id={`card-img-upload-${side}-${index}`}
              />
              <label
                htmlFor={`card-img-upload-${side}-${index}`}
                className={cn(
                  "inline-flex items-center justify-center bg-black text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap h-9",
                )}
              >
                <i className={cn("fa-solid fa-upload mr-2")}></i> Choose File...
              </label>
            </div>
          ) : (
            <Input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Image URL"
            />
          )}
          {img && (
            <img
              src={img}
              alt="Preview"
              className={cn(
                "w-full h-20 object-cover rounded-lg mt-2 border border-gray-200",
              )}
            />
          )}
        </div>
        <Input
          label="Redirect Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/products?category=..."
        />
        <div className={cn("flex gap-2 mt-4 pt-2 border-t border-gray-200")}>
          <Button onClick={handleSave} className={cn("flex-1 h-9 text-xs")}>
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsEditing(false)}
            className={cn("flex-1 h-9 text-xs")}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SideCardGrid = ({ cards, side }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6")}>
      {cards.map((card, idx) => (
        <SideCardEditor
          key={card.id || `${side}-${idx}`}
          card={card}
          index={idx}
          side={side}
        />
      ))}
    </div>
  );
};
