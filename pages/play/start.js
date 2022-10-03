import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import stylesCustom from "../../styles/custom.module.css";

import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../context/state";
import { getJSONFlash } from "../../utils/getFlash";

import { motion } from "framer-motion";

const QuestionNumber = 10;

export const getServerSideProps = async (context) => {
  //console.log(context.query.kategori);
  var kategori_data = getJSONFlash(context.query.kategori);

  return {
    props: { kategori_data: kategori_data },
  };
};

export default function PlayStart(props) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();

  const [quizData, setQuizData] = useState([]);
  const [quizOptionImage, setQuizOptionImage] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [rightQuestion, setRightQuestion] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [showOption, setShowOption] = useState(false);

  const AudioSoundRef = useRef();
  const PlayButtonRef = useRef();
  const OptionsRef = useRef();

  useEffect(() => {
    console.log(userdata);
    var rawKategoriData = props.kategori_data;
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
          imageNum: Math.floor(Math.random() * 2) + 1,
        };
      }

      tempQuizData.push({
        name: randomizedKeysKategori[index],
        options: finalArrayOption,
      });
    }

    setQuizData(tempQuizData);
    setKategori(router.query.kategori);
    setUserdata({
      username: "Apa iya",
    });

    console.log(window.localStorage.getItem("userSession"));
  }, []);

  useEffect(() => {
    if (quizData.length != 0) {
      setQuizOptionImage([
        "/assets/" + kategori + "/image/" + quizData[indexQuestion]?.options[0]?.name + "_" + quizData[indexQuestion]?.options[0]?.imageNum + ".png",
        "/assets/" + kategori + "/image/" + quizData[indexQuestion]?.options[1]?.name + "_" + quizData[indexQuestion]?.options[1]?.imageNum + ".png",
        "/assets/" + kategori + "/image/" + quizData[indexQuestion]?.options[2]?.name + "_" + quizData[indexQuestion]?.options[2]?.imageNum + ".png",
        "/assets/" + kategori + "/image/" + quizData[indexQuestion]?.options[3]?.name + "_" + quizData[indexQuestion]?.options[3]?.imageNum + ".png",
      ]);
    }
    console.log(indexQuestion);
  }, [quizData, kategori, indexQuestion]);

  function playSound() {
    setIsPlay(true);
    if (!isPlay) {
      AudioSoundRef.current.play();
      setShowOption(true);
      // OptionsRef.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      //   inline: "nearest",
      // });
    }
  }

  function stopSound() {
    if (isPlay == true) {
      setIsPlay(false);
    }
  }

  function selectOption(choosed) {
    if (choosed == quizData[indexQuestion]?.name) {
      console.log("Betul");
      setRightQuestion(rightQuestion + 1);
    } else {
      console.log("Salah");
    }

    if (QuestionNumber == indexQuestion + 1) {
    } else {
      setIndexQuestion(indexQuestion + 1);
      setShowOption(false);
      // PlayButtonRef.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      //   inline: "nearest",
      // });
    }
  }

  //console.log(router.query.data);

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container" style={{ width: "50%", justifyContent: "center" }}>
        <div className={stylesCustom.status_bar}>
          <div className={stylesCustom.mini_card}>
            <h4 style={{ marginBottom: "0px" }}>
              Soal: {indexQuestion + 1} / {QuestionNumber}
            </h4>
          </div>
          <div className={stylesCustom.mini_card}>
            <h4 style={{ marginBottom: "0px", color: "green" }}>
              Benar: {rightQuestion} / {QuestionNumber}
            </h4>
          </div>
        </div>
      </div>

      {quizData.length != 0 ? (
        <main className={styles.main}>
          <div id="PlayButton" ref={PlayButtonRef} className={`${showOption ? stylesCustom.fade_out : stylesCustom.fade_in}`}>
            <div className={isPlay ? stylesCustom.overlay : null} style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Image
                onClick={() => {
                  playSound();
                }}
                src={"/assets/button_play.png"}
                width={400}
                height={400}
                alt="PlayButton"
                style={{ cursor: "pointer" }}
              />
              <h3 className={stylesCustom.mini_card}>Tekan Tombol diatas untuk memutar suara</h3>
            </div>
          </div>
          <h4 className={`${stylesCustom.mini_card} ${showOption ? stylesCustom.fade_in : stylesCustom.fade_out}`}>Pilih jawaban sesuai suara yang muncul</h4>

          {/* <h1 className={styles.title}>Buah: {quizData[indexQuestion]?.name}</h1> */}
          <audio ref={AudioSoundRef} controls src={"/assets/" + kategori + "/sound/" + quizData[indexQuestion]?.name + ".mp3"} style={{ display: "none" }} onEnded={stopSound()}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
          <br></br>
          {quizOptionImage.length != 0 ? (
            <div>
              <div id="Options" ref={OptionsRef} className={showOption ? stylesCustom.fade_in : stylesCustom.fade_out}>
                <br></br>
                <div className={styles.grid}>
                  <div onClick={() => selectOption(quizData[indexQuestion]?.options[0]?.name)} className={stylesCustom.card_option}>
                    <Image src={quizOptionImage[0]} width={400} height={400} alt="Option1" />
                  </div>
                  <div onClick={() => selectOption(quizData[indexQuestion]?.options[1]?.name)} className={stylesCustom.card_option}>
                    <Image src={quizOptionImage[1]} width={400} height={400} alt="Option2" />
                  </div>
                </div>
                <div className={styles.grid}>
                  <div onClick={() => selectOption(quizData[indexQuestion]?.options[2]?.name)} className={stylesCustom.card_option}>
                    <Image src={quizOptionImage[2]} width={400} height={400} alt="Option3" />
                  </div>
                  <div onClick={() => selectOption(quizData[indexQuestion]?.options[3]?.name)} className={stylesCustom.card_option}>
                    <Image src={quizOptionImage[3]} width={400} height={400} alt="Option4" />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* <Modal></Modal> */}
        </main>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.title}>Memuat Permainan...</h1>
        </main>
      )}
    </div>
  );
}

const Modal = (props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className={stylesCustom.popup_backdrop}
    >
      <motion.div className={stylesCustom.popup}>
        <motion.h3 className={`${stylesCustom.mini_card_popupRW}`} style={{ color: "green" }}>
          Benar
        </motion.h3>
        <motion.div className={stylesCustom.pu_content_container}>
          <motion.div
            initial={{
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: 1,
              rotate: 360,
              transition: {
                delay: 0.3,
                duration: 0.5,
              },
            }}
            style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Image
              onClick={() => {
                playSound();
              }}
              src={"/assets/button_play.png"}
              width={200}
              height={200}
              alt="PlayButton"
              style={{ cursor: "pointer" }}
            />
            {/* <h3 className={stylesCustom.mini_card}>Tekan Tombol diatas untuk memutar suara</h3> */}
          </motion.div>
        </motion.div>
        {/* button controls */}
        <motion.div style={{ marginTop: "10px" }}>
          <motion.button className="btn btn-primary">Soal Selanjutnya</motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};