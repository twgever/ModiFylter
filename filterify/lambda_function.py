from PIL import Image
import base64
import io

def blackWhite(image):   
    #converts image to black and white
    BWimage=image.convert("1")

    return BWimage

def grayscale(image):   
    #converts image to grayscale

    grayImage=image.convert("L")
    return grayImage

def lambda_handler(event, context):
    image64 = base64.b64decode(event['base64'])
    filter = event['chosenFilter']
    image = Image.open(io.BytesIO(image64))
    
    if filter=="Black & white" :
        processed_image=blackWhite(image)
    elif filter=="Grayscale" :
        processed_image=grayscale(image)


    
    buffered = io.BytesIO()
    processed_image.save(buffered, format="JPEG",quality=50)
    processed_image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return {
        'statusCode': 200,
        'body': { 'processed_image_base64': processed_image_base64,
            'format': 'jpeg'
            }
    }

