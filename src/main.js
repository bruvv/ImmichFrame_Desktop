const { invoke } = window.__TAURI__.core;


window.addEventListener("DOMContentLoaded", () => {
  const btnQuit = document.getElementById("btnQuit");
  const btnSettings = document.getElementById("btnSettings");
  const urlModal = document.getElementById("urlModal");
  const closeModal = document.getElementById("closeModal");
  const urlInput = document.getElementById("urlInput");
  const saveUrlBtn = document.getElementById("saveUrl");
  const iframe = document.getElementById("webview");

  if (btnQuit) {
    btnQuit.addEventListener("click", async () => {
      console.log("Attempting to quit app"); // Log to console to check if it's triggered
      try {
        await invoke("quit_app"); // Call the Rust function to quit
      } catch (error) {
        console.error("Error invoking quit_app:", error);
      }
    });
  } 
  if (btnSettings) {
    btnSettings.addEventListener("click", () => {
      console.log("Opening settings modal");
      urlModal.style.display = "flex"; // Show the modal
    });
  }
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      urlModal.style.display = "none"; // Hide the modal
    });
  }
  if (saveUrlBtn) {
    saveUrlBtn.addEventListener("click", async () => {
      const url = urlInput.value;
      console.log("URL to show:", url);

      // You can either update the iframe URL directly, or pass the URL to the Rust backend
      // For now, let's simply log it and close the modal
     
      if (iframe) {
        iframe.src = url; // Set the iframe source to the URL entered
      }

      // Close modal after saving URL
      urlModal.style.display = "none";
    });
  }
});