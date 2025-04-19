import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const phrases = [
    "You can use an AI Avatar to represent yourself 🤖",
    "This app detects your emotions in real-time 😄",
    "Chat through smart, conversation-based messaging 💬",
    "Express yourself through realistic AI avatars 👤✨",
    "Feel more connected with emotion recognition 💖",
    "Get human-like responses with emotion-aware AI 🧠",
    "Your avatar mirrors your expressions in real-time 😎",
    "Talk, and express — all in one smart call 💡"
  ];
  

const TextScramble = () => {
  const textRef = useRef(null);
  const [chars] = useState("!<>-_\\/[]{}—=+*^?#________");

  useEffect(() => {
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = chars;
        this.queue = [];
        this.frame = 0;
        this.update = this.update.bind(this);
      }

      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        return new Promise((resolve) => {
          this.resolve = resolve;
          this.queue = [];
          for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 15);
            const end = start + Math.floor(Math.random() * 15);
            this.queue.push({ from, to, start, end });
          }
          cancelAnimationFrame(this.frameRequest);
          this.frame = 0;
          this.update();
        });
      }

      update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          const { from, to, start, end } = this.queue[i];
          let char = this.queue[i].char;

          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += '<span class="dud">' + char + "</span>";
          } else {
            output += from;
          }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }

      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    if (textRef.current) {
      const fx = new TextScramble(textRef.current);
      let counter = 0;
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, 1500);
        });
        counter = (counter + 1) % phrases.length;
      };

      next();
    }
  }, [chars]);

  return (
    <div>
      <Textstyle>
      <h2 className='loadingmsg' ref={textRef}></h2>
      </Textstyle>
    </div>
  );
};

const Textstyle = styled.div`
.loadingmsg{
  font-family: "Pacifico";
  font-weight: 1100;
    font-size: 1.5rem;
    color: whitesmoke;
  text-shadow: white 0 0 15px;
}
`

export default TextScramble;
