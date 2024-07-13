from PIL import Image
from filters import *

def main():

    filename="../Lenna.png"
    try:
        img=Image.open(filename)
    except IOError:
        pass
    
    blackWhite(img) 

    return


main()