'use strict';

  function smoothScroll(target, time) {
    window.Synapp.scrollFocus(target,time)
    /* time when scroll starts
    const start = new Date().getTime();
        const interval=25; //25 mSec
    

        // set an interval to update scrollTop attribute every 25 ms
        const timer = setInterval( () => {

            var doc = document.documentElement;
            var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
            var distance = target - top; // negative if currently below target

            // calculate the step, i.e the degree of completion of the smooth scroll 
            let step = Math.min(1, (new Date().getTime() - start) / time);


            // calculate the scroll distance and update the scrollTop
            document.body['scrollTop'] = top + step*distance;
            document.documentElement.scrollTop= top + step*distance; //this if for IE!!

            // end interval if the scroll is completed
            if (step == 1) clearInterval(timer);
        }, interval);
        */
  }

  export default smoothScroll;