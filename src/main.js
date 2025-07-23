const { invoke } = window.__TAURI__.core;


window.addEventListener("DOMContentLoaded", async () => {
  const btnQuit = document.getElementById("btnQuit");
  const btnSettings = document.getElementById("btnSettings");
  const urlModal = document.getElementById("urlModal");
  const closeModal = document.getElementById("closeModal");
  const urlInput = document.getElementById("urlInput");
  const saveUrlBtn = document.getElementById("saveUrl");
  const iframe = document.getElementById("webview");
  const defaultUrl = "https://demo.immichframe.online/";
  
  try {
    const savedUrl = await invoke("read_url_from_file") || "";
    const urlToLoad = savedUrl.trim() ? savedUrl : defaultUrl;
    if (iframe) {
      iframe.src = urlToLoad;
    }
  } catch (error) {
    console.error("Error loading saved URL:", error);
    if (iframe) {
      iframe.src = defaultUrl;
    }
  }

  if (btnQuit) {
    btnQuit.addEventListener("click", async () => {
      console.log("Attempting to quit app");
      try {
        await invoke("exit_app");
      } catch (error) {
        console.error("Error invoking exit_app:", error);
      }
    });
  }
  if (btnSettings) {
    btnSettings.addEventListener("click", async () => {
      console.log("Opening settings modal");
      try {
        const savedUrl = await invoke("read_url_from_file") || "";
        
        if (urlInput) {
          urlInput.value = savedUrl.trim() ? savedUrl : defaultUrl;
        }

        urlModal.style.display = "flex";
      } catch (error) {
        console.error("Error loading saved URL:", error);
        
        if (urlInput) {
          urlInput.value = defaultUrl;
        }

        urlModal.style.display = "flex";
      }
    });
  }
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      urlModal.style.display = "none";
    });
  }
  if (saveUrlBtn) {
    saveUrlBtn.addEventListener("click", async () => {
      const url = urlInput.value;
      console.log("URL to show:", url);
      
      try {
        await invoke("save_url_to_file", { url });
        console.log("URL saved successfully.");
      } catch (error) {
        console.error("Error saving URL:", error);
      }

      if (iframe) {
        iframe.src = url;
      }

      urlModal.style.display = "none";
    });
  }
});