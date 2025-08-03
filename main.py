from PIL import Image
from filters import *

def main():
    img=None

    filename="fotina.jpg"
    try:
        img=Image.open(filename)
    except IOError:
        print("ok")
        pass
    
    img.show()
    img1=blackWhite(img) 
    img1.show()
    img2=grayscale(img)
    img2.show()

    return


main()