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
    fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
    .then(response => response.json())
    .then(data => {
        displayWord(data.data)
    })
}

function displayWord(words){
    // console.log(words);
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = '';

    if(words.length == 0){
        wordContainer.innerHTML = `
            <div class="col-span-3 py-5 flex flex-col justify-center items-center">
                <img src="./assets/alert-error.png" alt="" class="mb-4" />
                <p>এই সেকশনে এখনো শব্দ আপলোড করা হয় নি</p>
                <h1 class="text-xl font-bold mt-3">পরবর্তী লেসনে ক্লিক করুন</h1>
            </div>
        `
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
                    <h1 class="text-xl">${word.meaning ? word.meaning : "not found"}/(${word.pronunciation ? word.pronunciation : "not found"})</h1>
                </div>
                
                <div class="flex justify-between w-full mt-10">
                    <button class="btn bg-[#BADEFF40]"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#BADEFF40]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `
        wordContainer.append(wordCard);
    })
}