'use client'
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

const EyeTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceMeshRef = useRef<any>(null);

  useEffect(() => {
    async function initializeFaceMesh() {
      // Dynamically import FaceMesh and Camera utilities from MediaPipe
      const FaceMeshModule = await import('@mediapipe/face_mesh');
      const CameraModule = await import('@mediapipe/camera_utils');

      const { FaceMesh } = FaceMeshModule;
      const { Camera } = CameraModule;

      // Initialize FaceMesh
      faceMeshRef.current = new FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Handle FaceMesh results
      faceMeshRef.current.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const leftIrisCenter = landmarks[468];
          const rightIrisCenter = landmarks[473];

          console.log("Left Iris:", leftIrisCenter, "Right Iris:", rightIrisCenter);

          // Additional gaze calculation logic can be added here
        }
      });

      // Initialize Camera
      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
      }
    }

    initializeFaceMesh();

    return () => {
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
    </div>
  );
};

export default EyeTracker;
