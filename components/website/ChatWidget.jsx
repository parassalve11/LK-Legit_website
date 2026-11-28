"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ExternalLink } from "lucide-react";
import { TOPICS, matchTopic, isValidPhone } from "@/lib/chatbot";
import styles from "./ChatWidget.module.css";

// Guided website assistant: ready answers + keyword matching from lib/chatbot.js,
// and a call-back form that saves the lead (admin Leads + Telegram).

const STORAGE_KEY = "lk-chat-v2";
const TYPING_MS = 450;
const MENU_BUTTON = { label: "Main menu", topic: "menu" };

const firstMessage = () => ({ role: "bot", text: TOPICS.menu.text });

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.messages) && saved.messages.length) return saved;
  } catch {}
  return null;
}

export default function ChatWidget({ phone = "+91 866 834 9265", logoUrl = "/Logo.png" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [firstMessage()]);
  const [buttons, setButtons] = useState(TOPICS.menu.buttons);
  const [stage, setStage] = useState("chat"); // chat | name | phone | saving
  const [interest, setInterest] = useState("General enquiry");
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const restored = useRef(false);
  const timer = useRef(null);

  // Restore this tab's earlier conversation the first time the chat opens.
  function openChat() {
    if (!restored.current) {
      restored.current = true;
      const saved = loadSaved();
      if (saved) {
        setMessages(saved.messages);
        setButtons(saved.buttons || TOPICS.menu.buttons);
        setInterest(saved.interest || "General enquiry");
        setStage(saved.stage === "saving" ? "chat" : saved.stage || "chat");
        setName(saved.name || "");
      }
    }
    setOpen(true);
  }

  useEffect(() => {
    const onOpen = () => openChat();
    window.addEventListener("lk:open-chat", onOpen);
    return () => {
      window.removeEventListener("lk:open-chat", onOpen);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, buttons, interest, stage, name }));
    } catch {}
  }, [messages, buttons, interest, stage, name]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const addUser = (text) => setMessages((prev) => [...prev, { role: "user", text }]);

  /** Show a bot message after a short "typing" pause. */
  function botSay(message, nextButtons = []) {
    setButtons([]);
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", ...message }]);
      setButtons(nextButtons);
    }, TYPING_MS);
  }

  function answer(topic) {
    if (topic.label) setInterest(topic.label);
    botSay({ text: topic.text, links: topic.links }, topic.buttons || [MENU_BUTTON]);
  }

  function startCallback() {
    setStage("name");
    botSay({ text: "Sure! What's your name?" }, [MENU_BUTTON]);
  }

  function onButton(button) {
    if (typing || stage === "saving") return;
    addUser(button.label);
    if (button.lead) return startCallback();
    setStage("chat");
    answer(TOPICS[button.topic] || TOPICS.menu);
  }

  async function saveLead(phoneNumber) {
    setStage("saving");
    setButtons([]);
    setTyping(true);
    const transcript = messages.filter((m) => m.role === "user").map((m) => m.text);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneNumber, interest, transcript }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setTyping(false);
      setStage("chat");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Thanks ${name}! 🙌 The LK team will call you on ${phoneNumber} soon. Anything else I can help with?` },
      ]);
      setButtons([TOPICS.menu.buttons[0], TOPICS.menu.buttons[1], TOPICS.menu.buttons[2], MENU_BUTTON]);
    } catch {
      setTyping(false);
      setStage("phone");
      setMessages((prev) => [
        ...prev,
        { role: "bot", error: true, text: `Sorry, I couldn't save that right now. Please try again, or call us on ${phone}.` },
      ]);
      setButtons([MENU_BUTTON]);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || stage === "saving") return;
    setInput("");
    addUser(text);

    if (stage === "name") {
      if (text.length < 2 || /\d{5,}/.test(text)) {
        botSay({ text: "Please type your name (for example: Rahul Sharma)." }, [MENU_BUTTON]);
        return;
      }
      setName(text.slice(0, 120));
      setStage("phone");
      botSay({ text: `Nice to meet you, ${text.split(" ")[0]}! What's your phone number (WhatsApp is fine)?` }, [MENU_BUTTON]);
      return;
    }

    if (stage === "phone") {
      if (!isValidPhone(text)) {
        botSay({ text: "That doesn't look like a phone number. Please enter it with 10 digits, e.g. 98765 43210." }, [MENU_BUTTON]);
        return;
      }
      saveLead(text);
      return;
    }

    const topic = matchTopic(text);
    if (topic.id === "contact") {
      setInterest(topic.label);
      return startCallback();
    }
    answer(topic);
  }

  const placeholder =
    stage === "name" ? "Your name" : stage === "phone" ? "Your phone number" : "Type your question…";

  return (
    <>
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="Chat with Trade with LK">
          <header className={styles.header}>
            <img src={logoUrl} alt="" className={styles.avatar} />
            <div className={styles.headerText}>
              <p className={styles.title}>LK Assistant</p>
              <p className={styles.status}><span aria-hidden="true" /> Online · instant answers</p>
            </div>
            <button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div ref={listRef} className={styles.messages} aria-live="polite">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className={styles.user}>{m.text}</p>
              ) : (
                <div key={i} className={m.error ? styles.botError : styles.bot}>
                  <p>{m.text}</p>
                  {m.links?.length ? (
                    <div className={styles.links}>
                      {m.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label} <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ),
            )}
            {typing ? (
              <p className={styles.typing} aria-label="Assistant is typing">
                <span /><span /><span />
              </p>
            ) : null}
            {buttons.length && !typing ? (
              <div className={styles.quick}>
                {buttons.map((b) => (
                  <button key={b.label} type="button" onClick={() => onButton(b)}>{b.label}</button>
                ))}
              </div>
            ) : null}
          </div>

          <form className={styles.composer} onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              maxLength={stage === "phone" ? 20 : 300}
              inputMode={stage === "phone" ? "tel" : "text"}
              autoComplete={stage === "name" ? "name" : stage === "phone" ? "tel" : "off"}
              aria-label={placeholder}
            />
            <button type="submit" className={styles.send} disabled={typing || !input.trim()} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
          <p className={styles.note}>Educational content only · not financial advice</p>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <MessageCircle size={25} />}
      </button>
    </>
  );
}
