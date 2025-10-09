import easyocr
import re
from PIL import Image

# initialize reader 
reader = easyocr.Reader(['en'])  # you can add GPU=True if CUDA is available

# load image
image_path = "IMG_7966.jpg"
image = Image.open(image_path)

# perform OCR
results = reader.readtext(image_path)

# extract only numbers
numbers = []
for bbox, text, prob in results:
    # Keep only numeric characters (digits and dot)
    numeric_text = re.sub(r'[^0-9.]', '', text)
    if numeric_text:
        numbers.append(numeric_text)

reading = ''.join(numbers)
print("OCR Reading:", reading)
