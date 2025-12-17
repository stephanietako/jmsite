import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.scss";
import wolf from "@/assets/images/mutation_wolf_origin.webp";

/* Composant image zoomable avec interactions tactiles et souris */
function ZoomableImage({ src, alt }) {
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [touchDist, setTouchDist] = useState(null);
  const imgRef = useRef(null);

  // Ajustement du fit initial
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.objectFit = "contain";
      imgRef.current.style.maxWidth = "100%";
      imgRef.current.style.maxHeight = "80vh";
    }
  }, []);

  // Zoom molette
  const handleWheel = (e) => {
    e.preventDefault();
    let newZoom = zoom + (e.deltaY < 0 ? 0.15 : -0.15);
    newZoom = Math.max(1, Math.min(3, newZoom));
    setZoom(newZoom);
    if (newZoom === 1) setDrag({ x: 0, y: 0 });
  };

  // Clic gauche = zoom avant / clic droit ou shift = arrière
  const handleClick = (e) => {
    if (e.shiftKey || e.button === 2) {
      setZoom((z) => {
        const newZoom = Math.max(1, z - 0.5);
        if (newZoom === 1) setDrag({ x: 0, y: 0 });
        return newZoom;
      });
    } else {
      setZoom((z) => Math.min(3, z + 0.5));
    }
  };

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setDragStart({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  };
  const handleMouseMove = (e) => {
    if (!dragStart) return;
    setDrag({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };
  const handleMouseUp = () => setDragStart(null);

  // Pinch zoom (tactile)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setTouchDist(
        Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      );
    } else if (e.touches.length === 1 && zoom > 1) {
      setDragStart({
        x: e.touches[0].clientX - drag.x,
        y: e.touches[0].clientY - drag.y,
      });
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      let delta = (dist - touchDist) / 100;
      let newZoom = Math.max(1, Math.min(3, zoom + delta));
      setZoom(newZoom);
      if (newZoom === 1) setDrag({ x: 0, y: 0 });
      setTouchDist(dist);
    } else if (e.touches.length === 1 && dragStart) {
      setDrag({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };
  const handleTouchEnd = () => {
    setDragStart(null);
    setTouchDist(null);
  };

  // Double clic pour reset
  const handleDoubleClick = () => {
    setZoom(1);
    setDrag({ x: 0, y: 0 });
  };

  // Empêche le menu contextuel
  const handleContextMenu = (e) => e.preventDefault();

  return (
    <div
      className={styles.galleryImageWrapper}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      style={{
        cursor: zoom > 1 ? (dragStart ? "grabbing" : "grab") : "zoom-in",
        touchAction: "none",
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={styles.galleryImage}
        style={{
          transform: `scale(${zoom}) translate(${drag.x / zoom}px, ${
            drag.y / zoom
          }px)`,
          transition: dragStart
            ? "none"
            : "transform 0.3s cubic-bezier(0.4, 0.2, 0.2, 1)",
        }}
        draggable={false}
      />
    </div>
  );
}

/* 🪟 Modal principal */
const Modal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
        ✕
      </button>

      <div
        className={styles.galleryModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <ZoomableImage
          src={wolf}
          alt="Œuvre originale 'Mutation Wolf' par Jean-Marc Eliette"
        />
        <div className={styles.caption}>
          Œuvre originale "Mutation Wolf" par Jean-Marc Eliette
        </div>
        <div className={styles.hint}>
          🖱️ Zoom / Pinch – Glisser : déplacer – Double clic : reset
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
