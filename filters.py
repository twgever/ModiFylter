from PIL import Image

def blackWhite(image):   
    #converts image to black and white

    BWimage=image.convert("1")

    return BWimage

def grayscale(image):   
    #converts image to black and white

    grayImage=image.convert("L")
    
    return grayImage

def lambda_handler(event, context):
    for record in event:
        print(record)