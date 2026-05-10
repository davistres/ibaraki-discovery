import os
from PIL import Image
import time

import sys

# Forcer l'encodage UTF-8 pour la console Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def optimize_images(directory, max_width=1920, quality=80):
    total_original_size = 0
    total_optimized_size = 0
    optimized_count = 0
    
    # Extensions supportées
    valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    
    print(f"Optimisation des images dans : {directory}")
    print("-" * 50)
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(valid_extensions):
            file_path = os.path.join(directory, filename)
            original_size = os.path.getsize(file_path)
            total_original_size += original_size
            
            try:
                with Image.open(file_path) as img:
                    # Convertir en RGB si nécessaire (pour sauver en JPEG)
                    if img.mode in ("RGBA", "P") and filename.lower().endswith(('.jpg', '.jpeg')):
                        img = img.convert("RGB")
                    
                    # Redimensionner si trop large
                    if img.width > max_width:
                        ratio = max_width / float(img.width)
                        new_height = int(float(img.height) * float(ratio))
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Sauvegarder avec compression
                    if filename.lower().endswith(('.jpg', '.jpeg')):
                        img.save(file_path, "JPEG", optimize=True, quality=quality)
                    elif filename.lower().endswith('.png'):
                        img.save(file_path, "PNG", optimize=True)
                    elif filename.lower().endswith('.webp'):
                        img.save(file_path, "WEBP", quality=quality)
                
                optimized_size = os.path.getsize(file_path)
                total_optimized_size += optimized_size
                optimized_count += 1
                
                reduction = (original_size - optimized_size) / 1024 / 1024
                if reduction > 0.1:
                    print(f"Optimisé: {filename} (-{reduction:.2f} Mo)")
                
            except Exception as e:
                print(f"Erreur sur {filename}: {e}")
                total_optimized_size += original_size

    print("-" * 50)
    print(f"Total images traitées: {optimized_count}")
    print(f"Taille originale: {total_original_size / 1024 / 1024:.2f} Mo")
    print(f"Nouvelle taille: {total_optimized_size / 1024 / 1024:.2f} Mo")
    print(f"Espace gagné: {(total_original_size - total_optimized_size) / 1024 / 1024:.2f} Mo")

if __name__ == "__main__":
    photo_dir = "public/Photo"
    if os.path.exists(photo_dir):
        optimize_images(photo_dir)
    else:
        print(f"Erreur: Le dossier {photo_dir} n'existe pas.")
