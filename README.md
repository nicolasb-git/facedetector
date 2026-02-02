# Antigravity Object Detector

A premium, real-time object detection web application powered by **Transformers.js** and the **DETR-ResNet-50** model. This application performs locally-processed inference directly in your browser using the user's webcam.

![Object Detector Preview](https://github.com/huggingface/transformers.js/raw/main/mjs/assets/transformers-js-logo.png)

## 🚀 Features

- **Real-time Detection**: Live inference on webcam streams.
- **On-device Processing**: No server-side processing; everything stays in your browser via Transformers.js.
- **High Performance**: Optimized with Vite for fast builds and hot-reloading.
- **Premium UI**: Modern dark-mode interface with glassmorphism, responsive design, and smooth animations.
- **Live Stats**: Monitor frames-per-second (FPS) and object counts in real-time.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules).
- **Styling**: Vanilla CSS (Custom properties, Grid, Flexbox).
- **AI Engine**: [Transformers.js](https://huggingface.co/docs/transformers.js)
- **Model**: [facebook/detr-resnet-50](https://huggingface.co/facebook/detr-resnet-50) (Detection Transformer).
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd facedetector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 📖 Usage

1. **Initialize**: When the page loads, the AI model (`detr-resnet-50`) will begin downloading to your browser's cache (approx. 160MB).
2. **Start Camera**: Click the **Start Camera** button to grant permission for webcam access.
3. **Detect**: The system will automatically begin identifying objects. Bounding boxes and labels will appear overlaid on the video feed.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hugging Face for the incredible [Transformers.js](https://github.com/huggingface/transformers.js) library.
- Facebook Research for the [DETR](https://github.com/facebookresearch/detr) model architecture.
