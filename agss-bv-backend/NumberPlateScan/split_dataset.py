import os
import random
import shutil

IMAGE_DIR = "archive/images"
LABEL_DIR = "archive/labels"

TRAIN_IMG_DIR = "dataset_plate/images/train"
VAL_IMG_DIR = "dataset_plate/images/val"
TRAIN_LABEL_DIR = "dataset_plate/labels/train"
VAL_LABEL_DIR = "dataset_plate/labels/val"

images = [f for f in os.listdir(IMAGE_DIR) if f.endswith(".jpg")]
random.shuffle(images)

split_idx = int(0.8 * len(images))
train_images = images[:split_idx]
val_images = images[split_idx:]

def copy_files(image_list, img_dest, label_dest):
    for img in image_list:
        shutil.copy(
            os.path.join(IMAGE_DIR, img),
            os.path.join(img_dest, img)
        )
        label = img.replace(".jpg", ".txt")
        shutil.copy(
            os.path.join(LABEL_DIR, label),
            os.path.join(label_dest, label)
        )

copy_files(train_images, TRAIN_IMG_DIR, TRAIN_LABEL_DIR)
copy_files(val_images, VAL_IMG_DIR, VAL_LABEL_DIR)

print("✅ Dataset split completed")
