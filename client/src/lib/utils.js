import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function fileToDataURL(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise(function (resolve, reject) {
      reader.onload = function (event) {
          const url = event.target.result;
          const inputImage = new Image();
          inputImage.src = url;

          const outputImageAspectRatio = 1;

          inputImage.onload = () => {
              const inputWidth = inputImage.naturalWidth;
              const inputHeight = inputImage.naturalHeight;
          
              const inputImageAspectRatio = inputWidth / inputHeight;
          
              let outputWidth = inputWidth;
              let outputHeight = inputHeight;
              if (inputImageAspectRatio > outputImageAspectRatio) {
                  outputWidth = inputHeight * outputImageAspectRatio;
              } else if (inputImageAspectRatio < outputImageAspectRatio) {
                  outputHeight = inputWidth / outputImageAspectRatio;
              }
          
              const outputX = (outputWidth - inputWidth) * 0.5;
              const outputY = (outputHeight - inputHeight) * 0.5;
          
              const outputImage = document.createElement('canvas');
          
              outputImage.width = outputWidth;
              outputImage.height = outputHeight;
          
              const ctx = outputImage.getContext('2d');
              ctx.drawImage(inputImage, outputX, outputY);

              resolve(outputImage.toDataURL());
          }
      }
  });
}

export function processImages(e) {
  if(e.target.files.length !== 5) {
      toast.error("Morate izabrati tačno 5 slika!");
      return;
  }

  var filesArray = Array.prototype.slice.call(e.target.files);      
  return Promise.all(filesArray.map(fileToDataURL));
}