import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectHeroSlides,
  selectLeftSideCards,
  selectRightSideCards,
  addHeroSlide,
  removeHeroSlide,
} from "../../../store/dataSlice";

export const useHeroLogic = () => {
  const dispatch = useDispatch();
  const heroSlides = useSelector(selectHeroSlides);
  const leftSideCards = useSelector(selectLeftSideCards);
  const rightSideCards = useSelector(selectRightSideCards);

  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [newSlideLink, setNewSlideLink] = useState("");
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [inputMode, setInputMode] = useState("upload");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewSlideUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = () => {
    if (imageInputUrl.trim()) {
      setNewSlideUrl(imageInputUrl.trim());
      setImageInputUrl("");
    }
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newSlideUrl.trim()) return;
    dispatch(
      addHeroSlide({ img: newSlideUrl.trim(), link: newSlideLink.trim() }),
    );
    setNewSlideUrl("");
    setImageInputUrl("");
    setNewSlideLink("");
  };

  const handleDeleteSlide = (index) => {
    dispatch(removeHeroSlide(index));
  };

  return {
    heroSlides,
    leftSideCards,
    rightSideCards,
    newSlideUrl,
    setNewSlideUrl,
    newSlideLink,
    setNewSlideLink,
    imageInputUrl,
    setImageInputUrl,
    inputMode,
    setInputMode,
    handleFileUpload,
    handleAddUrl,
    handleAddSlide,
    handleDeleteSlide,
  };
};
