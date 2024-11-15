Here’s an example `README.md` file for your project, detailing the Iris model and its setup:

```markdown
# Iris Detection with MediaPipe

This project leverages MediaPipe's **Iris Landmark Model** for detecting iris landmarks and determining gaze direction (e.g., looking left, right, up, or down). It uses the WebAssembly (WASM) backend provided by MediaPipe for efficient real-time inference.

## Features
- Detects and tracks iris landmarks.
- Provides coordinates of the iris for gaze direction estimation.
- Processes single images or video streams.

## Setup Instructions

### 1. Install Dependencies
Install Next.js and required dependencies for the project:

```bash
npx create-next-app@latest my-face-landmarker-app --typescript
cd my-face-landmarker-app
npm install @mediapipe/tasks-vision
```

### 2. Add the Iris Model

The Iris Landmark Model is required for detecting iris landmarks. Download the model and its related assets:

| File                                    | Description                                                     | Source                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **`iris_landmark.tflite`**      | Pre-trained TensorFlow Lite model for detecting iris landmarks. | [MediaPipe Models](https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/models.md)                                     |
| **`vision_wasm_internal.js`**   | JavaScript runtime for the MediaPipe vision tasks.              | [MediaPipe CDN](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js)   |
| **`vision_wasm_internal.wasm`** | WebAssembly file for running MediaPipe vision tasks.            | [MediaPipe CDN](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm) |
| **`cdn data`** | CDN Data.            | [MediaPipe CDN All Files](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm) |

### 3. Place Files in the Project

- Save `iris_landmark.tflite` in `public/models/iris_landmark.tflite`.
- Save `vision_wasm_internal.js` and `vision_wasm_internal.wasm` in `public/mediapipe/wasm/`.

### 4. Configure the Model Path in Code

Update the file paths in your Next.js code to use the locally hosted files:

```typescript
const vision = await (window as any).FilesetResolver.forVisionTasks(
  "/mediapipe/wasm/"
);

const irisLandmarker = await IrisLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "/models/iris_landmark.tflite",
  },
  runningMode: "IMAGE", // Or "VIDEO" for video streams
});
```

### 5. Run the Project

Start your development server:

```bash
npm run dev
```

Access the app in your browser at `http://localhost:3000`.

## Iris Landmark Model Details

### Model Name

- **Iris Landmark Model**

### Format

- TensorFlow Lite (`.tflite`)

### Purpose

- Detects landmarks on the iris and surrounding eye region, enabling precise tracking of gaze direction.

### Training Dataset

- The Iris Landmark Model is trained on datasets of annotated images with labeled iris and eye landmarks. While the exact dataset is not publicly disclosed, it includes a diverse range of faces to ensure robustness across different conditions.

### Outputs

1. **Iris Center Point**: Central point of the iris.
2. **Iris Boundary Points**: Key points defining the shape and position of the iris.
3. **Eye Region Landmarks**: Additional points around the eye for precise gaze tracking.

### Applications

- Eye gaze tracking.
- Augmented reality (AR) applications.
- Assistive technologies (e.g., gaze-controlled interfaces).

## Sources

- [MediaPipe Solutions](https://google.github.io/mediapipe/)
- [MediaPipe Model Zoo](https://google.github.io/mediapipe/solutions/models)
- [MediaPipe WASM CDN](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/)

---
