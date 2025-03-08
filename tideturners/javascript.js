<script>
        let slideIndex = 1;
        let slideInterval;
    
        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("slide");
            let dots = document.getElementsByClassName("dot");
            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
        }
    
        function changeSlide(n) {
            showSlides(slideIndex += n);
            resetInterval();
        }
    
        function currentSlide(n) {
            showSlides(slideIndex = n);
            resetInterval();
        }
    
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide(1), 5000);
        }
    
        showSlides(slideIndex);
        resetInterval();
    </script>