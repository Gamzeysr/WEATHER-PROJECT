const form = document.querySelector("section.top-banner form");
// top banner in altında ki form u buraya çağırmış olduk 
const input = document.querySelector(".container input")
// container clasının altında ki input u çağırdık
const msg = document.querySelector("span.msg");
// kullanıcıya yanlıs girerse uyarı verecek yeri çağırdık
const list = document.querySelector(".ajax-section .cities");
// citiesin içinde ki liler yani hava durumu kartları bana kart olarak gelecek 

localStorage.setItem("tokenKey", EncryptStringAES("a118c3dd09cb98f52ab2cbf3bb695ffd"));
// kullanıcı login oldugunda o kullanıcıyı arka plana alıcaz.Veri tabanından cekicez veri tabanından cektiğimiz token ı  browserın storyısıne atıcaz
// EncryptStringAES yaparak apim yani tokenim ekranda altta konsollde görünmesin diye gizlemek için EncryptStringAES kodunu kullanarak tokemi gizledim 
// her sayfada her zaman yazmayalım dıye bu sekilde yapıcaz 
let Api = DecryptStringAES(localStorage.getItem("tokenKey"));
// Burada almış oldugum Api miartık saklayıp kullanabilirim 
// Buradada DecryptStringAES yöntemi ile Api mi yani gizlemiş oldugum APİmi vscoduma okuttum tanıttım 
// console.log(Api)

form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeatherDataFromApi();
});
// preventDefault yazmamın sebebi; ben yazılımcı olarak diyorum ki senin default olrak görevlerini unut benim sana tanımladıgım görevleri yerine getir diyorum 


//! burada forma tıklandıgında formın içindeki submit e baglan hem enter hemde mouse la giriş yapılsın ayrı ayrı clik enter için fonk oluşmasın diye bunu yaptık 
// Burada Form u kullanmamızın sebebi de bu hem enter hemde mouse ile girdi yapabilmeyi ikisiini bir arada yapabilelim diye form içine aldık 
// kullanıcı bunlardan birisini yaptıgındA getWeatherDataFromApi fonk bağlan dedik 
const getWeatherDataFromApi = async () => {
    // alert("http request is gone!");
    const inputValue = input.value;


    const units = "metric";
    const lang = "tr";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${Api}&units=${units}&lang=&${lang}`;

    try {

        const response = await fetch(url).then(response => response.json());
        // Burada apiden veri çıktık bu fonk ile 
        console.log(response);

        //! neye ihtiyacım varsa artık destrucing yöntemi ile yazıyorum  buraya kullanıcam sonra o yüzden yani
        //! Bu kısım artık gelen verileri ayrıştırma kısmı 
        const { main, sys, weather, name } = response;
        // bunu responseden almamızın sebebi fethden gelen url bağlantısından bana lazım olanları alıyorum destruting bunu saglıyor bize 

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        // icon ekledim burada 
        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/$%7Bweather[0].icon%7D.svg`;
        // buda ikinci icon ne olur olmaz diye eklendi 


        const cityNameSpans = list.querySelectorAll(".city span");
        const cityNameSpansArray = Array.from(cityNameSpans);
        //! cityNameSpans içindekileri array e cevirdim 
        // foreAch metodunu kullanmak için array a cevirdim foreach metodu arrayın içinde gezebiliyor 
        if (cityNameSpansArray.length > 0)
        // Yani bu cityNameArrayin içinde eleman varsa bu kontrolu yap diyoruz length > 0 diyerek
        {
            const filteredArray = cityNameSpansArray.filter(span => span.innerText == name);
            if (filteredArray.length > 0) {
                msg.innerText = `You already know the weather for ${name}, Please search for another city ✋`
                form.reset();
                setTimeout(() => {
                    msg.innerText = "";
                }, 5000);
                return;
            }

        }
        //  lenghtini sıfırdan büyükse dememin sebebi burada yani arrayımın içinde eleman yani kart varsa oldugu sürece baksın diye > 0 dan dedik 


        const createdLi = document.createElement("li");
        // yeni bir li oluşturdum html de ve bu kısımda da li ye cratedLi dedim 
        createdLi.classList.add("city");
        // buradada olusturdugum li lerin classına city de dedim classList ile 
        // className de verebilirim ama classList verince baska yerlerdede class ı city olan olabilir onları ezmemek için classList kullanmak daha mantıkklı
        createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
               </h2>
              <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
              <figure>
              <img class="city-icon" src="${iconUrl}">
             <figcaption>${weather[0].description}</figcaption>
              </figure>`;
        //! innerHTML  ekranda görülmesini istediğim kod kısmı 
        //! temp yuvarladık cünkü ondalıklı sayı olsun istemiyoruz 


        // figure ve figcaptionu kullanma sebebimiz:
        // google algoritmasında bizi ceo çalışmasında öne cıkarmaya yarayan kullanım 

        // figyure ve figcaption u ın yerine div ve h2 de kullanabiliriedik evet ama figure ve figcaption u kullanan bir kişi div ve h2 elemenleri gibi elementleri kullanan kişinin önüne çıkıyor .


        //****append vs prepend**//
        // list.append(createdLi);
        //!  Burada yukarıda ul nin içindekini onun dısındaki sectionu list olarak burada tanımladım onun içine burada olusturmuş oldugum kullanıcının girecek oldugu li dedğimiz şeyi list e at diyoruz 

        // son aradığım ilk olsun diye prepend metonudu kullansak daha iyi o yüzden prependt metodunu kullancaz 👇
        list.append(createdLi);
        // aşağıda benim aramış oldugum şehir varsa bu kartı eklememeli o yüzden kartı oluşturmadan önce o kartın aynısından var mı diye kontrolunu yapmam lazım yani createdLi yi oluşturmadan önce bunun kontrolunu yapmam lazım 
    }
    catch (error) {
        msg.innerText = `404 (City Not Found)`;
        setTimeout(() => {
            msg.innerText = "";
        }, 5000);
    }
    form.reset();
    // butonun içindeki kullanıcının girdiği veriler silinsin kalmasın diye reset diye metotdumuz var onu girince reset yapıyor 
};
