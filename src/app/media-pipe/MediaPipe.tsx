'use client'

import React, { useState, useRef, useEffect } from 'react';

const FaceLandmarkerPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>('/input/face.jpg'); // Default image path
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load the default image initially on the canvas
  useEffect(() => {
    loadImageToCanvas(selectedImage);
  }, [selectedImage]);

  const loadImageToCanvas = (imageSrc: string) => {
    const imageElement = new Image();
    imageElement.src = imageSrc;
    imageElement.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);
      }
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectFaceLandmarks = async () => {
    if (!selectedImage || !canvasRef.current) return;

    try {
      console.log('Loading model and WASM files...');
      //  cdn alternate [CDN](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm)
      const vision = await (window as any).FilesetResolver.forVisionTasks(
        '/model/mediapipe/iris_cdn'
      );

      const modelPath = '/model/media-pipe/iris_model/iris_landmark.tflite';

      const faceLandmarker = await (window as any).faceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
        },
        runningMode: 'IMAGE',
        numFaces: 1,
      });

      const imageElement = new Image();
      imageElement.src = selectedImage;
      imageElement.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous canvas and draw new image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageElement, 0, 0);

        // Run detection
        const result = faceLandmarker.detect(imageElement);
        console.log('Face Landmark Data:', result);

        if (result.face_landmarks) {
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          result.face_landmarks.forEach((face: { x: number; y: number }[]) => {
            face.forEach((landmark: { x: number; y: number }) => {
              const x = landmark.x * canvas.width;
              const y = landmark.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, 2 * Math.PI);
              ctx.stroke();
            });
          });
        }
      };
    } catch (error) {
      console.error('Error loading model or running detection:', error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Face Landmarker</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      <button onClick={detectFaceLandmarks} className="p-2 font-semibold rounded-md bg-gray-300 text-gray-900 mb-4">
        Detect Face Landmarks
      </button>
      <div>
        <canvas
          ref={canvasRef}
          className="border border-black mt-4"
        />
      </div>
    </div>
  );
};

export default FaceLandmarkerPage;
