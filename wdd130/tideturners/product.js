const sliderMainImage = document.getElementById("product-main-image")
const sliderImageList = document.getElementsByClassName("image-list")
console.log(sliderImageList)

sliderImageList[0].onclick = () => {
  sliderMainImage.src = sliderImageList[0].src
  console.log(sliderMainImage.src)
}

sliderImageList[1].onclick = () => {
  sliderMainImage.src = sliderImageList[1].src
  console.log(sliderMainImage.src)
}

sliderImageList[2].onclick = () => {
  sliderMainImage.src = sliderImageList[2].src
  console.log(sliderMainImage.src)
}

sliderImageList[3].onclick = () => {
  sliderMainImage.src = sliderImageList[3].src
  console.log(sliderMainImage.src)
}

