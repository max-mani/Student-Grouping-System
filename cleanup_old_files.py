#!/usr/bin/env python3
"""
Cleanup script to remove old files and keep only the newly created ones
"""
import os
import shutil
import glob

def cleanup_old_files():
    """Remove old files and keep only the newly created ones"""
    
    print("[INFO] Starting cleanup of old files...")
    
    # Files to remove (old versions)
    files_to_remove = [
        "processed_students_levels.csv",  # Will be recreated
        "student_team_clustering/clustered_teams.csv",  # Will be recreated
        "student_team_clustering/team_model.pkl",  # Will be recreated
        "student_team_clustering/scaler.pkl",  # Will be recreated
        "model/team_model.pkl",  # Will be recreated
        "model/scaler.pkl",  # Will be recreated
    ]
    
    # Directories to clean
    directories_to_clean = [
        "backend/uploads",
    ]
    
    # Remove old files
    for file_path in files_to_remove:
        if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"[OK] Removed: {file_path}")
        except Exception as e:
            print(f"[WARNING] Could not remove {file_path}: {e}")
    
    # Clean upload directories
    for dir_path in directories_to_clean:
        if os.path.exists(dir_path):
            try:
                # Remove all files in directory but keep the directory
                for file in os.listdir(dir_path):
                    file_path = os.path.join(dir_path, file)
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        print(f"[OK] Removed: {file_path}")
            except Exception as e:
                print(f"[WARNING] Could not clean {dir_path}: {e}")
    
    # Remove old visualization files (they will be regenerated)
    old_visualizations = [
        "elbow_plot.png",
        "pca_scatter_plot.png", 
        "team_skill_bar_charts.png"
    ]
    
    for viz_file in old_visualizations:
        if os.path.exists(viz_file):
            try:
                os.remove(viz_file)
                print(f"[OK] Removed old visualization: {viz_file}")
            except Exception as e:
                print(f"[WARNING] Could not remove {viz_file}: {e}")
    
    print("\n[OK] Cleanup completed!")
    print("[INFO] Ready for new file generation...")

if __name__ == "__main__":
    cleanup_old_files()
