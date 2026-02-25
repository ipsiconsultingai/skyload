"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

import styles from "./TableSelect.module.css";

interface TableSelectOption {
  value: string | number;
  label: string;
}

interface TableSelectProps {
  value: string | number;
  options: TableSelectOption[];
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export const TableSelect = ({
  value,
  options,
  onChange,
  placeholder = "-",
}: TableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const strValue = String(value);
  const selectedOption = options.find((o) => String(o.value) === strValue);
  const displayLabel = selectedOption?.label ?? placeholder;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 80),
    });
  }, []);

  const open = useCallback(() => {
    updatePosition();
    setIsOpen(true);
    const idx = options.findIndex((o) => String(o.value) === String(value));
    setHighlightIdx(idx >= 0 ? idx : 0);
  }, [updatePosition, options, value]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightIdx(-1);
  }, []);

  const selectOpt = useCallback(
    (opt: TableSelectOption) => {
      onChange(opt.value);
      close();
      triggerRef.current?.focus();
    },
    [onChange, close]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || listRef.current?.contains(t)) {
        return;
      }
      close();
    };
    const handleScroll = () => updatePosition();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, close, updatePosition]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        open();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((p) => (p < options.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((p) => (p > 0 ? p - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < options.length) {
          selectOpt(options[highlightIdx]);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case "Tab":
        close();
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || highlightIdx < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-option]");
    items[highlightIdx]?.scrollIntoView({
      block: "nearest",
    });
  }, [isOpen, highlightIdx]);

  const isSelected = (opt: TableSelectOption) =>
    String(opt.value) === String(value);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerLabel}>{displayLabel}</span>
        <ChevronDown size={12} className={styles.triggerChevron} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={listRef}
            className={styles.dropdown}
            style={{
              top: pos.top,
              left: pos.left,
              minWidth: pos.width,
            }}
            role="listbox"
          >
            {options.map((opt, idx) => (
              <div
                key={String(opt.value)}
                data-option
                role="option"
                aria-selected={isSelected(opt)}
                className={`${styles.option} ${idx === highlightIdx ? styles.optionHighlighted : ""} ${isSelected(opt) ? styles.optionSelected : ""}`}
                onMouseEnter={() => setHighlightIdx(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOpt(opt);
                }}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                {isSelected(opt) && (
                  <Check size={13} className={styles.optionCheck} />
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
