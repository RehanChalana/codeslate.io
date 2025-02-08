// import { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";

const ExcalidrawEditor = ({ roomId }) => {
  // const excalidrawAPIRef = useRef(null);
  // const ydocRef = useRef(new Y.Doc());
  // const yMapRef = useRef(ydocRef.current.getMap("excalidraw"));
  // const providerRef = useRef(null);
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   const ydoc = ydocRef.current;

  //   // Setup WebSocket connection
  //   providerRef.current = new WebsocketProvider("ws://localhost:1234", roomId, ydoc);
  //   const provider = providerRef.current;

  //   provider.on("synced", () => {
  //     console.log("✅ Yjs provider synced!");
  //     setIsReady(true);
  //   });

  //   provider.on("status", (event) => {
  //     console.log("WebSocket Status:", event.status);
  //   });

  //   return () => {
  //     provider.disconnect();
  //   };
  // }, [roomId]);

  // // Apply Yjs data to Excalidraw on load
  // useEffect(() => {
  //   if (isReady && excalidrawAPIRef.current) {
  //     const storedElements = yMapRef.current.get("elements") || [];
  //     console.log("📥 Loading Excalidraw elements from Yjs:", storedElements);

  //     excalidrawAPIRef.current.updateScene({ elements: storedElements });
  //   }
  // }, [isReady]);

  // // Listen for Excalidraw changes and update Yjs
  // const handleChange = (elements) => {
  //   console.log("✍️ Saving to Yjs:", elements);
    
  //   // 🔥 Fix: Use a new array to trigger Yjs updates!
  //   yMapRef.current.set("elements", elements.slice()); 
  // };

  // // Listen for Yjs updates and apply them to Excalidraw
  // useEffect(() => {
  //   const handleYjsUpdate = () => {
  //     if (excalidrawAPIRef.current) {
  //       console.log("🔄 Updating Excalidraw from Yjs...");
  //       excalidrawAPIRef.current.updateScene({
  //         elements: yMapRef.current.get("elements") || [],
  //       });
  //     }
  //   };

  //   yMapRef.current.observeDeep(handleYjsUpdate);

  //   return () => {
  //     yMapRef.current.unobserveDeep(handleYjsUpdate);
  //   };
  // }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        // onLoad={(api) => {
        //   excalidrawAPIRef.current = api;
        //   console.log("✅ Excalidraw Loaded!");
        // }}
        // onChange={handleChange} // Track Excalidraw updates
      />
    </div>
  );
};

export default ExcalidrawEditor;
