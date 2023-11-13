const toggle = document.querySelector('.nav-checkbox')
const menu = document.querySelector('.nav-ul')
const overlay = document.querySelector('.kosong')
const after = document.querySelector('.nav-wrap-span')


toggle.addEventListener('click' , function(){
    menu.classList.toggle('open')
    overlay.classList.toggle('overlay')
    after.classList.toggle('after-effect')
})

var loader = await Notix.Interstitial.createLoader(/*6601018*/);
loader.startLoading();
InterstitialData interstitialData;
try {
    interstitialData = await loader.next();
} catch (e) {
    /* handle exception */
}
Notix.Interstitial.show(interstitialData);
