import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../../../styles/Home.module.css";
import stylesCustom from "../../../styles/custom.module.css";

import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "../../../context/state";
import { getJSONFlash, getJSONCategory } from "../../../utils/getLocalJSON";
import { GenMengejaGambarData } from "../../../utils/genQuizData";
import { getLocale } from "../../../utils/getLocaleText";
import { ModalReactionQuiz, ModalCountdownASRQuiz } from "../../../components/modal";
import axios, { post } from "axios";
import { Preferences } from "@capacitor/preferences";

import { Capacitor } from "@capacitor/core";

import { SpeechRecognition } from "@capacitor-community/speech-recognition";

import { motion } from "framer-motion";

const QuestionNumber = 10;
var chunks = [];

export default function MengejaGambar_dev(props) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();

  const [isRecordAvailable, SetIsRecordAvailable] = useState(false);
  const [mediaRecorder, SetImediaRecorder] = useState(null);
  const [recognizedData, SetrecognizedData] = useState({ prediction: "Empty, Start Recording", time_exec: 0 });

  const [recordIcon, setRecordIcon] = useState("/assets/button_record.png");
  const [enableRecog, setEnableRecog] = useState(false);
  const [recognitionType, setRecognitionType] = useState("server");
  const [RecogServer, setRecogServer] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [rightQuestion, setRightQuestion] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [countdown_number, setCountdown_number] = useState(4);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);
  const [isDoneSubmitData, setDoneSubmitData] = useState(false);
  const [showModalData, setShowModalData] = useState({
    isCorrect: false,
    showModal: false,
  });
  const [showModalDataCount, setShowModalDataCount] = useState({
    showModal: false,
  });

  const localeGeneral = props.localeData?.general;

  const recordButtonRef = useRef();
  const AudioSoundRef = useRef();

  useEffect(() => {
    var finalQuestionData = GenMengejaGambarData(props.kategori_data, QuestionNumber);

    setQuizData(finalQuestionData);
    setKategori(router.query.category);

    if (Capacitor.getPlatform() == "web") {
      fetch("https://elbicare.my.id/api/vibio/check_recognitionServer", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setEnableRecog(false);
          } else if (data.isonline == "true") {
            if (navigator.mediaDevices.getUserMedia) {
              Preferences.get({ key: "enableRecog" }).then((ret) => {
                setEnableRecog(ret.value);
              });
              SetIsRecordAvailable(true);
              navigator.mediaDevices
                .getUserMedia({
                  audio: true,
                })
                .then(onSuccess, onError);
            } else {
              SetIsRecordAvailable(false);
            }
          }
        })
        .catch((error) => {
          setEnableRecog(false);
          console.log("Error ========>", error);
        });
    } else {
      SpeechRecognition.requestPermissions().then((result) => {
        SpeechRecognition.checkPermissions().then((result_permission) => {
          console.log(result_permission.speechRecognition);
        });
      });

      SpeechRecognition.available().then((result) => {
        if (result.available) {
          SpeechRecognition.getSupportedLanguages().then((result_lang) => {
            if (result_lang.languages.includes("id-ID")) {
              setEnableRecog(true);
              setRecognitionType("native");
            }
          });
        } else {
          fetch("https://elbicare.my.id/api/vibio/check_recognitionServer", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                setEnableRecog(false);
              } else if (data.isonline == "true") {
                if (navigator.mediaDevices.getUserMedia) {
                  SetIsRecordAvailable(true);
                  navigator.mediaDevices
                    .getUserMedia({
                      audio: true,
                    })
                    .then(onSuccess, onError);
                } else {
                  SetIsRecordAvailable(false);
                }
              }
            })
            .catch((error) => {
              setEnableRecog(false);
              console.log("Error ========>", error);
            });
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mediaRecorder !== null) {
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = ({ e }) => {
        setIsSendingAudio(true);
        console.log("data available after MediaRecorder.stop() called.");

        const blob = new Blob(chunks, {
          type: "audio/wav;",
        });

        chunks = [];

        let file = new File([blob], "Lohe" + ".wav", {
          type: "audio/wav",
          lastModified: new Date().getTime(),
        });

        const formData = new FormData();
        formData.append("file_audio", file);

        fetch("https://elbicare.my.id/api/vibio/recognition", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            SetrecognizedData(data);
            setIsSendingAudio(false);
            setCountdown_number(4);
            setShowModalDataCount({
              showModal: false,
            });
            console.log(data);
          })
          .catch((error) => {
            setIsSendingAudio(false);
            setCountdown_number(4);
            setShowModalDataCount({
              showModal: false,
            });
            console.log("Error ========>", error);
          });
      };
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (showModalDataCount.showModal == true) {
      const countdownInterval = setInterval(() => {
        if (countdown_number > 0) {
          setCountdown_number(countdown_number - 1);
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
    // Clear the interval when the component unmounts
  }, [countdown_number, showModalDataCount]);

  let onSuccess = function (stream) {
    var mediaRecorder = new MediaRecorder(stream);
    SetImediaRecorder(mediaRecorder);

    // Preferences.get({ key: "recognitionServer" }).then((ret) => {
    //   setRecogServer(ret.value);
    // });

    // Preferences.get({ key: "enableRecog" }).then((ret) => {
    //   setEnableRecog(ret.value == "true");
    // });
  };

  let onError = function (err) {
    alert("The following error occured: " + err);
  };

  const start_record = () => {
    setRecordIcon("/assets/button_onrecord.png");
    console.log("recorder started");

    if (recognitionType == "server") {
      mediaRecorder.start();
      setShowModalDataCount({
        showModal: true,
      });
      setCountdown_number(4);

      setTimeout(() => {
        setCountdown_number(4);
        setRecordIcon("/assets/button_record.png");
        mediaRecorder.stop();
      }, 4000);
    } else if (recognitionType == "native") {
      SpeechRecognition.start({
        language: "id-ID",
        maxResults: 1,
        prompt: "Say something",
        partialResults: false,
        popup: true,
      }).then((result) => {
        console.log(result.matches);
        SetrecognizedData({ prediction: result.matches[0].replace(/\W/g, "").toLowerCase() });
        setRecordIcon("/assets/button_record.png");
        SpeechRecognition.stop();
        SpeechRecognition.removeAllListeners();
      });
    }
  };

  function playSound() {
    setIsPlay(true);
    if (!isPlay) {
      AudioSoundRef.current.play();
    }
  }

  function stopSound() {
    if (isPlay == true) {
      setIsPlay(false);
    }
  }

  function selectOption(choosed) {
    setShowModalData({
      isCorrect: choosed,
      showModal: true,
    });

    if (choosed) {
      setRightQuestion(rightQuestion + 1);
    }
  }

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      checkAnswer(recognizedData.prediction.replace(/\W/g, "").toLowerCase());
    }
    didMountRef.current = true;
  }, [recognizedData]);

  const checkAnswer = (prediction) => {
    var nowIndex = indexQuestion;
    var now_jawaban = quizData[nowIndex].name;
    var sp_prediction = prediction; // Remove char
    console.log(sp_prediction);
    console.log(now_jawaban);
    var similarityWord = levenshteinSimilarity(sp_prediction, now_jawaban);
    if (similarityWord > 0.7) {
      selectOption(true);
    } else {
      selectOption(false);
    }
  };

  const nextQuestion = () => {
    setShowModalData({
      isCorrect: false,
      showModal: false,
    });
    if (QuestionNumber == indexQuestion + 1) {
      try {
        Preferences.get({ key: "user_uuid" }).then((ret) => {
          let formData = new FormData();
          formData.append(
            "json_data",
            JSON.stringify({
              kategori: router.query.category,
              jumlah_benar: rightQuestion,
              jumlah_salah: QuestionNumber - rightQuestion,
              timestamp: Date.now(),
            })
          );
          formData.append("tipe_terapi", 1);

          post("https://elbicare.my.id/api/vibio/insert_terapi/" + ret.value, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((response) => {
              console.log(response.data);
              setDoneSubmitData(true);
              setIsFinishQuiz(true);
            })
            .catch((error) => {
              Preferences.get({ key: "buffered_sendedData" }).then((ret) => {
                if (ret.value != null) {
                  let buffered_data = JSON.parse(ret.value);
                  let length_entries = Object.keys(buffered_data).length;

                  buffered_data[length_entries] = {
                    json_data: JSON.stringify({
                      kategori: router.query.category,
                      jumlah_benar: rightQuestion,
                      jumlah_salah: QuestionNumber - rightQuestion,
                      timestamp: Date.now(),
                    }),
                    tipe_terapi: 1,
                  };

                  Preferences.set({
                    key: "buffered_sendedData",
                    value: JSON.stringify(buffered_data),
                  }).then(() => {
                    setDoneSubmitData(true);
                    setIsFinishQuiz(true);
                  });
                }
              });
              console.log("Error ========>", error);
            });
        });
      } catch (error) {
        alert(error);
      }
      console.log(indexQuestion);
    } else {
      setIndexQuestion(indexQuestion + 1);
    }
  };

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "linear-gradient(rgba(36, 36, 36, 0.40), rgba(36, 36, 36, 0.40)), url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isFinishQuiz ? (
        <main className={styles.main}>
          <h2 className={stylesCustom.menu_title_font}>{localeGeneral.play_finish}</h2>
          <h4 className={stylesCustom.menu_subtitle_font}>{localeGeneral.play_finish_subtitle}</h4>
          <motion.div
            initial={{
              scale: 1,
              rotate: 0,
            }}
            animate={{
              rotate: [-2, 2, -2, 2, -2],
              scale: [1.01, 0.99, 1.01, 0.99, 1.01],
            }}
            transition={{
              duration: 1.5,
              times: [0.3, 0.6, 0.9, 1.2, 1.5],
              repeat: Infinity,
            }}
          >
            <Image src={"/assets/emoji_good.png"} width={150} height={150} alt="PlayButton" style={{ cursor: "pointer" }} />
          </motion.div>
          <div className={stylesCustom.finish_play_container}>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "green" }}>
                Menjawab Benar: {rightQuestion} / {QuestionNumber}
              </h4>
            </div>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "red" }}>
                Menjawab Salah: {QuestionNumber - rightQuestion} / {QuestionNumber}
              </h4>
            </div>
          </div>
          {isDoneSubmitData ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                router.push("/play");
              }}
            >
              Kembali Ke Menu Terapi Wicara
            </button>
          ) : (
            <h4 className={stylesCustom.menu_subtitle_font}>Sedang Mengupload Data ke Server</h4>
          )}
        </main>
      ) : (
        <>
          {quizData.length != 0 ? (
            <main className={styles.main} style={{ paddingTop: "15px" }}>
              <div className="container">
                <div className="row mt-5">
                  <div className="col-6 col-sm-6 col-md-4 mx-auto">
                    <div className={stylesCustom.mini_card}>
                      <h4 style={{ marginBottom: "0px" }}>
                        Soal: {indexQuestion + 1} / {QuestionNumber}
                      </h4>
                    </div>
                  </div>
                  <div className="col-6 col-sm-6 col-md-4 mx-auto">
                    <div className={stylesCustom.mini_card}>
                      <h4 style={{ marginBottom: "0px", color: "green" }}>
                        Benar: {rightQuestion} / {QuestionNumber}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={styles.grid}
                animate={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: [1, 1, 1.01, 0.99, 1],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.8, 1.1, 1.5],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <div className={stylesCustom.card_option}>
                  <Image
                    onClick={() => {
                      playSound();
                    }}
                    src={`/assets/items/${kategori}/image/${quizData[indexQuestion].name}_${quizData[indexQuestion].imageNum}.png`}
                    width={window.innerHeight * 0.4}
                    height={window.innerHeight * 0.4}
                    alt="BendaImage"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {enableRecog ? (
                <div className={stylesCustom.button_container_mengeja_gambar}>
                  <div
                    className={stylesCustom.button_image_subtitle}
                    onClick={() => {
                      start_record();
                    }}
                  >
                    <Image ref={recordButtonRef} src={recordIcon} width={window.innerHeight * 0.2} height={window.innerHeight * 0.2} alt="ButtonNo" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ) : (
                <div className={stylesCustom.button_container_mengeja_gambar}>
                  <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(false)}>
                    <Image src={`/assets/button_no.png`} width={window.innerHeight * 0.15} height={window.innerHeight * 0.15} alt="ButtonNo" style={{ cursor: "pointer" }} />
                    <h4 style={{ marginBottom: "0px" }}>Salah</h4>
                  </div>
                  <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(true)}>
                    <Image src={`/assets/button_ok.png`} width={window.innerHeight * 0.15} height={window.innerHeight * 0.15} alt="ButtonOK" style={{ cursor: "pointer" }} />
                    <h4 style={{ marginBottom: "0px" }}>Benar</h4>
                  </div>
                </div>
              )}

              {/* <div id="PlayButton" ref={PlayButtonRef} className={`${showOption ? stylesCustom.fade_out : stylesCustom.fade_in}`}>
            <div className={isPlay ? stylesCustom.overlay : null} style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 className={stylesCustom.mini_card}>Tekan Tombol diatas untuk memutar suara</h3>
            </div>
          </div> */}

              <audio ref={AudioSoundRef} controls src={"/assets/items/" + kategori + "/sound/" + quizData[indexQuestion]?.name + ".mp3"} style={{ display: "none" }} onEnded={stopSound()}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
              <ModalReactionQuiz isShow={showModalData.showModal} isCorrect={showModalData.isCorrect} clickFunction={nextQuestion}></ModalReactionQuiz>
              <ModalCountdownASRQuiz isShow={showModalDataCount.showModal} countdown={countdown_number} isSending={isSendingAudio}></ModalCountdownASRQuiz>
              <div className={stylesCustom.home_button} onClick={() => router.push("/home")}>
                <div className={stylesCustom.button_card}>
                  <h4 style={{ marginBottom: "0px", color: "green" }}>Home</h4>
                </div>
              </div>
              {/* <div style={{ position: "absolute", top: "5vh", right: "5vh" }}>
                <div className={stylesCustom.button_card}>
                  <h4 style={{ marginBottom: "0px", color: "green" }}>Dev Page</h4>
                </div>
              </div> */}
            </main>
          ) : (
            <main className={styles.main}>
              <h1 className={styles.title}>Memuat Permainan...</h1>
            </main>
          )}
        </>
      )}
    </div>
  );
}

export const getStaticProps = async ({ params: { category } }) => {
  var kategori_data = getJSONFlash(category);
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      kategori_data: kategori_data,
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
};

export async function getStaticPaths() {
  var arrayPath = [];
  var kategoriObj = getJSONCategory();
  Object.keys(kategoriObj).map((key, id) => {
    arrayPath.push({ params: { category: key } });
  });
  return {
    paths: arrayPath,
    fallback: true,
  };
}

function wordSimilarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = [];

  for (let i = 0; i <= len1; i++) {
    dp[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = str1[i - 1] === str2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[len1][len2];
}

function levenshteinSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarityPercentage = (maxLength - distance) / maxLength;

  return similarityPercentage.toFixed(2); // Round to two decimal places
}

function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const blobToBase64 = (blob) => blobToDataUrl(blob).then((text) => text.slice(text.indexOf(",")));

// export async function getStaticProps({ params: { category } }) {

//   console.log(category);
//   return { props: { category } };
// }

// export async function getStaticPaths() {
//   const [posts] = await Promise.all([getAllBlogPostEntries()]);

//   const paths = posts.entries.map((c) => {
//     return { params: { post: c.route } }; // Route is something like "this-is-my-post"
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// }

// export const getServerSideProps = async (context) => {
//   if (context.query.category !== undefined) {
//     var kategori_data = getJSONFlash(context.query.category);
//     var localeDataGeneral = getLocale("id", "general");
//     return {
//       props: {
//         kategori_data: kategori_data,
//         localeData: {
//           general: localeDataGeneral,
//         },
//       },
//     };
//   } else {
//     return {
//       redirect: {
//         destination: "/play",
//         permanent: false,
//       },
//     };
//   }
// };

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}
