"use client";
import React, { useState } from "react";
import { useUIContext } from "@/context/UIContext";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";

export default function FeedbackDemoPage() {
  const { addNotification } = useUIContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const startFlow = async () => {
    addNotification("Starting action...", "info");
    setModalOpen(true);
  };

  const confirmAction = async () => {
    setModalOpen(false);
    setLoading(true);
    // Simulate async work
    await new Promise((res) => setTimeout(res, 1800));
    setLoading(false);
    addNotification("Operation completed successfully", "success");
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Feedback Flow Demo</h1>
      <p className="mb-4 text-sm text-gray-600">
        Toast → Modal → Loader → Toast
      </p>

      <div className="space-x-2">
        <button
          onClick={startFlow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Flow
        </button>
        <button
          onClick={() => addNotification("Quick info toast", "info")}
          className="px-4 py-2 border rounded"
        >
          Quick Toast
        </button>
      </div>

      <div className="mt-6">{isLoading && <Loader />}</div>

      <Modal
        isOpen={isModalOpen}
        title="Confirm Action"
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
      >
        <p>
          Do you want to proceed with this operation? This cannot be undone.
        </p>
      </Modal>
    </main>
  );
}
