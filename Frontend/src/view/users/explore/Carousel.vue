<template>
  <div class="card-carousel" @mouseover="stopTimer" @mouseleave="restartTimer">
    <div class="slider">
      <div class="main-slider">
        <div class="left-title text-bold-700">Featured</div>
        <div class="progressbar" v-if="autoSlideInterval && showProgressBar">
          <div :style="{ width: progressBar + '%' }"></div>
        </div>
        <div class="card-img">
          <img
            class="cardOverlay"
            :src="currentImage"
            alt=""
            @error="replaceByDefaultCoverImage"
          />
          <!-- <div
            class="cardOverlay"
            v-bind:style="{ 'background-image': 'url(' + currentImage + ')' }"
          ></div> -->
          <router-link :to="'/user/' + currentID"
            ><span class="highlighted-name text-capitalize">{{
              currentTitle
            }}</span></router-link
          >
          <p>{{ currentDescription }}</p>
          <div class="actions">
            <span @click="prevImage" class="prev"> ◀ </span>
            <span @click="nextImage" class="next"> ▶ </span>
          </div>
        </div>
      </div>
      <div class="thumbnails">
        <div class="ml-2 left-title text-bold-700 find-more">Find More</div>
        <div
          v-for="(image, index) in images"
          :key="image.id"
          :class="[
            'thumbnail-image',
            'item',
            activeImage == index ? 'active' : '',
          ]"
          @click="activateImage(index)"
        >
          <img :src="image.thumb" @error="replaceByDefaultCoverImage" />
          <div class="detail">
            <span class="text-capitalize">{{ image.title }}</span>
            <p>{{ image.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import proImg from '../../../assets/images/profile/no-user.png';
import coverImg from '../../../assets/images/profile/defult_cover.jpg';
export default {
  name: 'Carousel',
  data() {
    return {
      //Index of the active image
      activeImage: 0,
      //Hold the timeout, so we can clear it when it is needed
      autoSlideTimeout: null,
      //If the timer is stopped e.g. when hovering over the carousel
      stopSlider: false,
      //Hold the time left until changing to the next image
      timeLeft: 0,
      //Hold the interval so we can clear it when needed
      timerInterval: null,
      //Every 10ms decrease the timeLeft
      countdownInterval: 10,
    };
  },
  computed: {
    // currentImage gets called whenever activeImage changes
    // and is the reason why we don't have to worry about the
    // big image getting updated
    currentImage() {
      // this.timeLeft = this.autoSlideInterval;
      return this.images[this.activeImage].big;
    },
    currentID() {
      // this.timeLeft = this.autoSlideInterval;
      return this.images[this.activeImage].userId;
    },
    currentTitle() {
      // this.timeLeft = this.autoSlideInterval;
      return this.images[this.activeImage].title;
    },
    currentDescription() {
      // this.timeLeft = this.autoSlideInterval;
      return this.images[this.activeImage].description;
    },
    progressBar() {
      //Calculate the width of the progressbar
      return 100 - (this.timeLeft / this.autoSlideInterval) * 100;
    },
  },
  methods: {
    // Go forward on the images array
    // or go at the first image if you can't go forward
    nextImage() {
      var active = this.activeImage + 1;
      if (active >= this.images.length) {
        active = 0;
      }
      this.activateImage(active);
    },
    // Go backwards on the images array
    // or go at the last image
    prevImage() {
      var active = this.activeImage - 1;
      if (active < 0) {
        active = this.images.length - 1;
      }
      this.activateImage(active);
    },
    activateImage(imageIndex) {
      this.activeImage = imageIndex;
    },
    //Wait until 'interval' and go to the next image;
    startTimer(interval) {
      if (interval && interval > 0 && !this.stopSlider) {
        var self = this;
        clearTimeout(this.autoSlideTimeout);
        this.autoSlideTimeout = setTimeout(function () {
          self.nextImage();
          self.startTimer(self.autoSlideInterval);
        }, interval);
      }
    },
    //Stop the timer when hovering over the carousel
    stopTimer() {
      clearTimeout(this.autoSlideTimeout);
      this.stopSlider = true;
      clearInterval(this.timerInterval);
    },
    //Restart the timer(with 'timeLeft') when leaving from the carousel
    restartTimer() {
      this.stopSlider = false;
      clearInterval(this.timerInterval);
      this.startCountdown();
      this.startTimer(this.timeLeft);
    },
    //Start countdown from 'autoSlideInterval' to 0
    startCountdown() {
      if (!this.showProgressBar) return;
      var self = this;
      this.timerInterval = setInterval(function () {
        self.timeLeft -= self.countdownInterval;
        if (self.timeLeft <= 0) {
          self.timeLeft = self.autoSlideInterval;
        }
      }, this.countdownInterval);
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    replaceByDefaultCoverImage(e) {
      e.target.src = coverImg;
    },
    goProfile() {
      this.$router.push('/profile');
    },
  },
  created() {
    //Check if startingImage prop was given and if the index is inside the images array bounds
    if (
      this.startingImage &&
      this.startingImage >= 0 &&
      this.startingImage < this.images.length
    ) {
      this.activeImage = this.startingImage;
    }

    //Check if autoSlideInterval prop was given and if it is a positive number
    if (
      this.autoSlideInterval &&
      this.autoSlideInterval > this.countdownInterval
    ) {
      //Start the timer to go to the next image
      this.startTimer(this.autoSlideInterval);
      this.timeLeft = this.autoSlideInterval;
      //Start countdown to show the progressbar
      this.startCountdown();
    }
  },
  props: ['startingImage', 'images', 'autoSlideInterval', 'showProgressBar'],
};
</script>

<style scoped>
.thumbnail-image.item .detail {
  display: flex;
  /* align-items: center; */
  /* flex-wrap: wrap; */
  flex-flow: column;
}
img.cardOverlay {
  width: 100%;
}
.card-carousel {
  user-select: none;
  position: relative;
}
.slider {
  display: flex;
  margin-bottom: 50px;
}
.main-slider {
  width: 55%;
  padding: 0 40px 0 20px;
  border-right: 1px solid #e3e3e3;
}
.progressbar {
  display: block;
  width: 46%;
  height: 3px;
  position: absolute;
  background-color: rgba(221, 221, 221, 0.25);
  z-index: 1;
  /* padding: 0 20px; */
}

.progressbar > div {
  background-color: rgba(255, 255, 255, 0.52);
  height: 100%;
}

.find-more {
  margin-left: 40px !important;
}

.thumbnails {
  width: 45%;
  display: flex;
  /* justify-content: space-evenly; */
  flex-direction: column;
}

.thumbnail-image {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 40px;
}
.thumbnail-image .detail {
  padding: 0 20px;
  font-size: inherit;
  font-weight: initial;
}
.thumbnail-image .detail span {
  font-size: 14px;
  font-weight: 600;
  color: #123c3d;
}
.thumbnail-image .detail p {
  margin-top: 5px;
  opacity: 0.7;
  font-size: 11px;
  height: 35px;
  font-weight: 500;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: unset;
  line-height: 17px;
}

.thumbnail-image > img {
  width: 100px;
  height: 50px;
  transition: all 250ms;
  border-radius: 10px;
}

.thumbnail-image:hover > img,
.thumbnail-image.active > img {
  opacity: 0.6;
  box-shadow: 0px 0px 0px 2.5px #123c3d;
  /* border: 3px solid #123c3d; */
}

.card-img {
  position: relative;
  margin-bottom: 15px;
}

.card-img > img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border-radius: 20px;
  margin-bottom: 30px;
  max-height: 207px;
}
.cardOverlay {
  display: block;
  margin: 0 auto 30px;
  max-width: 100%;
  border-radius: 20px;
  margin-bottom: 30px;
  height: 207px;
  background-size: cover;
  transition: all ease-in-out 500ms;
}
.highlighted-name {
  font-size: 16px;
  color: #123c3d;
  font-weight: 700;
}
.card-img > span {
  font-size: 15px;
  color: #000;
}
.card-img > p {
  opacity: 0.8;
  font-size: 13px;
  color: #000;
  margin-top: 10px;
  height: 45px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: unset;
  line-height: 25px;
}

.actions {
  font-size: 1.5em;
  height: 40px;
  position: absolute;
  top: 35%;
  margin-top: -20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #585858;
}

.actions > span {
  cursor: pointer;
  transition: all 250ms;
  font-size: 12px;
  background-color: #ffd700;
  padding: 0 17px;
  border-radius: 50%;
  color: #000;
}

.actions > span.prev {
  margin-left: -18px;
  padding: 8px 14px 8px 12px;
}

.actions > span.next {
  margin-right: -18px;
  padding: 8px 12px 8px 14px;
}

.actions > span:hover {
  color: #eee;
  background-color: #123c3d;
}
.left-title {
  font-size: 18px;
  color: #000000;
  margin-bottom: 20px;
  font-weight: 600;
}
@media (min-width: 768px) and (max-width: 1440px) {
  .card-img > p {
    font-size: 11px;
    color: #000;
    margin-top: 20px;
    max-height: 45px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: unset;
    line-height: 17px;
  }
  .card-img {
    height: 230px;
  }
  .main-slider {
    width: 55%;
    padding: 0 25px 0 10px;
    border-right: 1px solid #e3e3e3;
  }
  .cardOverlay {
    height: 125px;
  }
  .actions > span {
    cursor: pointer;
    transition: all 250ms;
    font-size: 1.2rem;
    background-color: gold;
    border-radius: 50%;
    height: 29px;
    line-height: 27px;
  }
  .actions > span.prev {
    margin-left: -18px;
    padding: 7px 14px 32px 10px;
  }
  .actions > span.next {
    margin-left: -18px;
    padding: 7px 10px 32px 14px;
  }
  .actions {
    top: 30%;
  }
}

/* Responsive */

@media only screen and (max-width: 768px) {
  .slider {
    flex-direction: column;
    margin-bottom: 0px;
  }
  .main-slider {
    width: 100%;
    padding: 0 15px;
    border-right: none;
  }
  .actions {
    top: 30%;
  }
  .actions > span {
    padding: 0px 15px;
    line-height: 30px;
  }
  .card-img > img {
    margin-bottom: 15px;
  }
  .thumbnails {
    display: none;
  }
  .progressbar {
    display: none;
  }
  .card-img > p {
    font-size: 11px;
    color: #000;
    margin-top: 20px;
    max-height: 45px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: unset;
    line-height: 17px;
  }
  .card-img {
    height: 230px;
  }
  .main-slider {
    padding: 0 15px;
    border-right: none;
  }
  .cardOverlay {
    height: 125px;
  }
  .actions > span {
    font-size: 1.2rem;
  }
  .actions > span.prev {
    margin-left: -18px;
    padding: 7px 14px 32px 10px;
  }
  .actions > span.next {
    margin-left: -18px;
    padding: 7px 10px 32px 14px;
  }
  .actions {
    top: 30%;
  }
}

@media screen and (max-width: 768px) {
  .actions > span.next {
    margin-right: -18px;
    padding: 0px 5px 0px 10px;
    margin-top: -20px;
    margin-right: -13px;
    font-size: 1rem;
  }
  .actions > span.prev {
    padding: 0px 8px 0px 7px;
    margin-top: -20px;
    margin-left: -13px;
    font-size: 1rem;
  }
}
@media screen and (min-width: 768px) and (max-width: 999px) {
  .thumbnails {
    display: block;
  }
  .slider {
    flex-direction: unset;
    margin-bottom: 0px;
  }
  .main-slider {
    width: 55%;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  .thumbnails {
    width: 55%;
  }
  .main-slider {
    width: 45%;
    padding: 0 25px 0 10px;
  }
}
</style>
