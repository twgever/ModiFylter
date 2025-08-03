from PIL import Image

def blackWhite(image):   
    #converts image to black and white

    BWimage=image.convert("1")

    return BWimage

def grayscale(image):   
    #converts image to black and white

    grayImage=image.convert("L")
    
    return grayImage
