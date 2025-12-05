import os

IMAGE_DIR = "images"
valid_exts = (".png", ".jpg", ".jpeg", ".webp", ".gif")

files = [
    f for f in os.listdir(IMAGE_DIR)
    if f.lower().endswith(valid_exts)
]

files.sort()  # optional: alphabetical

print("const PHOTOS = [")
for f in files:
    path = f"{IMAGE_DIR}/{f}"
    alt = os.path.splitext(f.replace("_", " ").replace("-", " "))[0].title()
    print(
        f'  {{ src: "{path}", alt: "{alt}", caption: "{alt}" }},'
    )
print("];")