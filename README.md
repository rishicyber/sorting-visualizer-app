# 🔢 Sorting Studio — Algorithm Visualizer

> An interactive sorting algorithm visualizer built with React + Vite.  
> **This project was generated using [Claude Sonnet 4.6](https://www.anthropic.com/claude) by Anthropic.**

---

## 🚀 Live Demo

🌐 [https://rishicyber.github.io/sorting-visualizer-app](https://rishicyber.github.io/sorting-visualizer-app)

---

## 📸 Preview

A dark-themed, animated bar visualizer that shows how different sorting algorithms work in real time — with color-coded bars for comparisons, swaps, and sorted elements.

---

## ✨ Features

- 📊 **Bar Visualizer** — bars sized by value, animated in real time
- ⚙️ **5 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick Sort
- 🎚️ **Array Size Control** — choose between 10 and 120 elements
- ⚡ **Speed Control** — adjust speed from 1 to 100, even while sorting
- 📈 **Live Stats** — tracks swap count and step count in real time
- ⏸️ **Pause / Resume** — pause mid-sort and resume anytime
- 🔁 **New Array** — regenerate a random array instantly

---

## 🎨 Color Guide

| Color | Meaning |
|-------|---------|
| 🟣 Purple | Default / unsorted |
| 💜 Bright Purple | Currently comparing |
| 🟡 Amber | Being swapped |
| 🟢 Green | Sorted / complete |

---

## 🛠️ Tech Stack

- [React](https://react.dev/) — UI and state management
- [Vite](https://vitejs.dev/) — development server and build tool
- [gh-pages](https://www.npmjs.com/package/gh-pages) — GitHub Pages deployment

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/rishicyber/sorting-visualizer.git
cd sorting-visualizer

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 🧠 Algorithms Implemented

| Algorithm | Best Case | Average Case | Worst Case |
|-----------|-----------|--------------|------------|
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Selection Sort | O(n²) | O(n²) | O(n²) |
| Insertion Sort | O(n) | O(n²) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) |

---

## 🤖 AI Attribution

This project was fully generated using **Claude Sonnet 4.6** by [Anthropic](https://www.anthropic.com/).  
Claude Sonnet 4.6 is part of the Claude 4 model family — a powerful AI assistant capable of building production-grade applications from natural language prompts.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ and Claude Sonnet 4.6</p>
