//laoding lesson levels dynamically
const levelsApi = "https://openapi.programming-hero.com/api/levels/all";
const loadLevels = () =>{
    fetch(levelsApi)
    .then(response => response.json())
    .then(levels => {
        displayLevels(levels.data)
    })
}

//function to display level names dynamically
function displayLevels(levels){
    levels.forEach(level => {
        // console.log(level.level_no)
        const lessonButtons = document.querySelector('.lesson-buttons');

        const singleLevel = document.createElement('div');

        singleLevel.innerHTML = `
            <button onclick='loadWord(${level.level_no})' class="btn border border-[#422AD5] text-[#422AD5] bg-white hover:bg-[#422AD5] hover:text-white level-btn"><i class="fa-solid fa-book"></i> Lesson-${level.level_no}</button>
        `

        lessonButtons.appendChild(singleLevel);
        
    });

    //active button
    const levelBtns = document.querySelectorAll('.level-btn');

    levelBtns.forEach(btn => {
        btn.addEventListener('click',function(event){
            // console.log(event.target)

            levelBtns.forEach(btn => btn.classList.remove('activeLesson'));

            const activeBtn = event.target;
            activeBtn.classList.add('activeLesson');
        })
    })
}

loadLevels();

//load words
function loadWord(level_no){
    manageLoading(true);  //right after clicking a lesson button, the loading bars will appear

    fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
    .then(response => response.json())
    .then(data => {
        displayWord(data.data)
    })
}

function displayWord(words){
    // console.log(words); //array of objects
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = '';

    if(words.length == 0){
        wordContainer.innerHTML = `
            <div class="col-span-3 py-5 flex flex-col justify-center items-center">
                <img src="./assets/alert-error.png" alt="" class="mb-4" />
                <p class="font-bangla">এই সেকশনে এখনো শব্দ যোগ করা হয় নি</p>
                <h1 class="text-xl font-bold mt-3 font-bangla">পরবর্তী লেসনে ক্লিক করুন</h1>
            </div>
        `
        manageLoading(false); //when the message with appear, the loading bars will disappear
        return;
    }

    words.forEach(word => {
        // console.log(word);
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
            <div class="word-card h-full flex flex-col items-center justify-center bg-white px-8 py-10 shadow-md rounded-lg">

                <div>
                    <h1 class="text-xl font-bold">${word.word}</h1>
                    <p class="my-4">Meaning/Pronunciation</p>
                    <h1 class="text-xl font-bangla">${word.meaning ? word.meaning : "not found"}/(${word.pronunciation ? word.pronunciation : "not found"})</h1>
                </div>
                
                ${/*word details and speaker button*/ ''}
                <div class="flex justify-between w-full mt-10">
                    <button onclick="loadWordDetail(${word.id})" class="btn bg-[#BADEFF40]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#BADEFF40]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `
        wordContainer.append(wordCard);
        manageLoading(false); //when the words are done loading, the loading bar will disappear
    })
}

const loadWordDetail = async(id) =>{
    const response = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
    const details = await response.json();

    displayDetailModal(details.data);
}


function displayDetailModal(details){
    // console.log(details);
    const wordDetailsContainer = document.getElementById("details-container");
    wordDetailsContainer.innerHTML = `
            <h1 class="text-2xl font-bold">${details.word} (<i class="fa-solid fa-microphone-lines"></i> :<span class="font-bangla">${details.pronunciation} </span>)</h1>

            <div class="meaning my-5">
                <p class="text-lg font-bold">Meaning</p>
                <p class="font-bangla">${details.meaning}</p>
            </div>

            <div class="example my-5">
                <p class="text-lg font-bold">Example</p>
                <p>${details.sentence}</p>
            </div>

            <div class="synonyms my-5">
                <p class="mb-2 font-bangla text-xl font-bold">সমার্থক শব্দ গুলো</p>
                <div>
                    ${synonymWords(details.synonyms)}
                </div>
            </div>
    `
    document.getElementById("word_details_modal").showModal();
}

//function for synonym words
const synonymWords =(synonyms) =>{

    if(synonyms.length == 0){
        return `N/A`;
    }

    const wordElements = synonyms.map((eachWord)=>{
        return `<span class="btn mt-2 mr-2">${eachWord}</span>`;
    })
    return wordElements.join(" ");

    /*because map() returns an array of all words inside a span tag, we need the words with span tag as string so the whole string gets placed inside the synonym's div as string wrapped in a span tag, which then looks like normal html code */
}


//managin loading bars

//right after clicking a lesson button, the loading bars will appear and word container will disappear, then after the word-container is fully loaded, the loading bars will be hidden
const manageLoading = (status) =>{
    if(status){
        document.querySelector('.loading-bars').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else{
        document.querySelector('.loading-bars').classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}


//search word functionality
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener('click',()=>{
    const searchBox = document.querySelector('.search-box');
    const searchValue = searchBox.value.trim().toLowerCase();

    // console.log(searchValue)

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(response => response.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter((wordDetails)=> wordDetails.word.toLowerCase().includes(searchValue));
        // console.log(filterWords);

        if(filterWords.length > 0){
            displayWord(filterWords);

            /* this function has been implemented to display words from an array of obj in dom, so can be used for this purpose as well */
        }
        else{
            const wordContainer = document.getElementById("word-container");
            wordContainer.innerHTML = '';

            wordContainer.innerHTML = `
            <div class="col-span-3 py-5 flex flex-col justify-center items-center">
                <img src="./assets/alert-error.png" alt="" class="mb-4" />
                <p class="font-bangla">Word not found. Try something else.</p>
            </div>
        `
        }
    });
})

//text to speach, word pronunciation functionality
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


//navbar in mobile device
const mobileNavbar = document.getElementById("mobile-nav");
const mobileNavBtn = document.getElementById("mobile-nav-btn");
const navCloseBtn = document.getElementById("nav-close-btn");


mobileNavBtn.addEventListener('click', () => {
  mobileNavbar.classList.remove('translate-x-full');
});
navCloseBtn.addEventListener('click', () => {
  mobileNavbar.classList.add('translate-x-full');
});


//frequently asked question section
/* const q1 = document.getElementById("q1");
const ans1 = document.getElementById("ans1");
const plus1 = document.getElementById("plus1");

q1.addEventListener('click',function(){
    ans1.classList.toggle("max-h-0");     
    ans1.classList.toggle("max-h-40");
    
    if(plus1.innerText === "+"){
        plus1.innerText = "-";
    }
    else{
        plus1.innerText = "+";
    }
}) */

const questions = document.querySelectorAll(".question");
// console.log(questions)

questions.forEach(question =>{
    question.addEventListener('click',(event)=>{
    //    console.log(event.currentTarget.children[1])
        const answer = event.currentTarget.children[1];
        answer.classList.toggle("max-h-0");     
        answer.classList.toggle("max-h-40");

        const plus = event.currentTarget.children[0].children[1];

        if(plus.innerText === "+"){
            plus.innerText = "-";
        }
        else{
            plus.innerText = "+";
        }
    })
})