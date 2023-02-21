function GenDengarkanGambarData(rawKategoriData, QuestionNumber) {
  var keysKategori = Object.keys(rawKategoriData);
  var randomizedKeysKategori = [];

  for (let index = keysKategori.length - 1; index >= 0; index--) {
    var randIndex = Math.floor(Math.random() * (index + 1));
    randomizedKeysKategori.push(keysKategori[randIndex]);
    keysKategori.splice(randIndex, 1);
  }
  
  var randomed_items = rawKategoriData[randomizedKeysKategori[Math.floor(Math.random() * randomizedKeysKategori.length) + 1]];

  return randomed_items;
}

function GenMengejaGambarData(rawKategoriData, QuestionNumber) {
  try {
    var keysKategori = Object.keys(rawKategoriData);
    var randomizedKeysKategori = [];
  
    for (let index = keysKategori.length - 1; index >= 0; index--) {
      var randIndex = Math.floor(Math.random() * (index + 1));
      randomizedKeysKategori.push(keysKategori[randIndex]);
      keysKategori.splice(randIndex, 1);
    }
  
    var finalQuestionData = [];
    for (let index = 0; index < QuestionNumber; index++) {
      finalQuestionData[index] = {
        name: randomizedKeysKategori[index],
        imageNum: Math.floor(Math.random() * rawKategoriData[randomizedKeysKategori[index]].image_file.length) + 1,
      };
    }
    return finalQuestionData;
  } catch (error) {
    console.log(error)
    return []
  }

}

function GenTebakGambarData(rawKategoriData, QuestionNumber) {
  var keysKategori = Object.keys(rawKategoriData);
  var randomizedKeysKategori = [];

  for (let index = keysKategori.length - 1; index >= 0; index--) {
    var randIndex = Math.floor(Math.random() * (index + 1));
    randomizedKeysKategori.push(keysKategori[randIndex]);
    keysKategori.splice(randIndex, 1);
  }

  var tempQuizData = [];
  var jumlahOption = 4;
  for (let index = 0; index < QuestionNumber; index++) {
    var randIndexAnswer = Math.floor(Math.random() * jumlahOption);
    var arrayOption = [];
    for (let j = 0; j < 10; j++) {
      if (arrayOption.length == 4) break;
      if (arrayOption.length == randIndexAnswer) {
        arrayOption.push(randomizedKeysKategori[index]);
      } else {
        var randomAnswer = randomizedKeysKategori[Math.floor(Math.random() * randomizedKeysKategori.length)];
        if (!arrayOption.includes(randomAnswer) && randomAnswer != randomizedKeysKategori[index]) {
          arrayOption.push(randomAnswer);
        } else {
          j--;
        }
      }
    }

    var finalArrayOption = [];
    for (let index = 0; index < arrayOption.length; index++) {
      finalArrayOption[index] = {
        name: arrayOption[index],
        imageNum: Math.floor(Math.random() * rawKategoriData[randomizedKeysKategori[index]].image_file.length) + 1,
      };
    }

    tempQuizData.push({
      name: randomizedKeysKategori[index],
      options: finalArrayOption,
    });
  }
  return tempQuizData;
}

module.exports = {
  GenMengejaGambarData,
  GenTebakGambarData,
  GenDengarkanGambarData
};
