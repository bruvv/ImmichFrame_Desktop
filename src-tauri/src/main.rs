// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dirs::{config_dir, home_dir};
use std::fs::{create_dir_all, File};
use std::io::Read;
use std::io::Write;
use tauri::{command, Builder};

#[command]
fn save_url_to_file(url: String) -> Result<(), String> {
    // Determine the appropriate directory based on the OS
    let save_dir = match std::env::consts::OS {
        "windows" => {
            // On Windows, use "AppData/Roaming" or "Documents"
            home_dir()
                .ok_or("Failed to get home directory")?
                .join("AppData")
                .join("Roaming")
                .join("immichFrame")
        }
        "macos" => {
            // On macOS, use "Library/Application Support"
            home_dir()
                .ok_or("Failed to get home directory")?
                .join("Library")
                .join("Application Support")
                .join("immichFrame")
        }
        "linux" => {
            // On Linux, use "~/.config"
            config_dir()
                .ok_or("Failed to get config directory")?
                .join("immichFrame")
        }
        _ => {
            // Default to using home directory if OS is unsupported
            home_dir().ok_or("Failed to get home directory")?
        }
    };

    // Create the directory if it doesn't exist
    if !save_dir.exists() {
        create_dir_all(&save_dir).map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    // Create the full path to the Settings.txt file inside the "immichFrame" folder
    let file_path = save_dir.join("Settings.txt");

    // Print the file path for debugging purposes
    println!("Saving to: {:?}", file_path);

    // Open (or create) the file
    let mut file = match File::create(file_path) {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file: {}", e)),
    };

    // Write the URL to the file
    match file.write_all(url.as_bytes()) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to write to file: {}", e)),
    }
}

#[command]
fn read_url_from_file() -> Result<String, String> {
    // Define the file path
    let save_dir = match std::env::consts::OS {
        "windows" => home_dir()
            .ok_or("Failed to get home directory")?
            .join("AppData")
            .join("Roaming")
            .join("immichFrame"),
        "macos" => home_dir()
            .ok_or("Failed to get home directory")?
            .join("Library")
            .join("Application Support")
            .join("immichFrame"),
        "linux" => config_dir()
            .ok_or("Failed to get config directory")?
            .join("immichFrame"),
        _ => home_dir().ok_or("Failed to get home directory")?,
    };

    let file_path = save_dir.join("Settings.txt");

    // Open the file and read the contents
    let mut file = match File::open(file_path) {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file: {}", e)),
    };

    let mut url = String::new();
    match file.read_to_string(&mut url) {
        Ok(_) => Ok(url),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
fn exit_app() {
  std::process::exit(0x0);
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_url_to_file,
            read_url_from_file,
            exit_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    immichframe_lib::run();
}